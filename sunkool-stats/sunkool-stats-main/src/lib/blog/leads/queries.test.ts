import { test } from "node:test";
import assert from "node:assert/strict";
import { BlogLeadsError } from "./errors";
import { getBlogLeadCounts, getBlogLeadSourceCounts, getBlogLeads, mapBlogLead, setBlogLeadStatus } from "./queries";

type Result = { data: unknown[] | null; count?: number | null; error: { code?: string; message: string } | null };

/**
 * A stand-in for the Supabase query builder that records what was asked and replays the given results in order.
 * A list query ends at `range`; a count query is awaited right after `in` (or after `eq`, for a source), so
 * those two hand back something that is both chainable (`.order(…)` follows them on a filtered list) and awaitable.
 */
function fakeDb(...results: Result[]) {
  const calls: unknown[][] = [];
  const queue = [...results];
  const next = () => Promise.resolve(queue.shift() as Result);
  const chainableAndAwaitable = () => Object.assign(Object.create(builder), { then: (...args: Parameters<Promise<Result>["then"]>) => next().then(...args) });
  const builder = {
    select: (columns: string, options: unknown) => (calls.push(["select", columns, options]), builder),
    in: (column: string, values: unknown) => {
      calls.push(["in", column, values]);
      return chainableAndAwaitable();
    },
    eq: (column: string, value: unknown) => {
      calls.push(["eq", column, value]);
      return chainableAndAwaitable();
    },
    order: (column: string, options: unknown) => (calls.push(["order", column, options]), builder),
    range: (from: number, to: number) => (calls.push(["range", from, to]), next()),
  };
  const db = { from: (table: string) => (calls.push(["from", table]), builder) };
  return { db: db as unknown as Parameters<typeof getBlogLeads>[0], calls };
}

/** The update path: from → update → eq → select, awaited at `select`. */
function fakeUpdateDb(result: Result) {
  const calls: unknown[][] = [];
  const builder = {
    update: (values: unknown) => (calls.push(["update", values]), builder),
    eq: (column: string, value: unknown) => (calls.push(["eq", column, value]), builder),
    select: (columns: string) => (calls.push(["select", columns]), Promise.resolve(result)),
  };
  const db = { from: (table: string) => (calls.push(["from", table]), builder) };
  return { db: db as unknown as Parameters<typeof getBlogLeads>[0], calls };
}

const row = {
  id: "5b0e7a3e-1c1f-4c61-9d3a-0a1a1f1f1f1f",
  name: "Asha Verma",
  mobile: "+919876543210",
  city: "Nagpur",
  product_name: "Sapphire",
  product_category: "Window Film",
  blog_title: "How does El Niño affect cars in India",
  blog_url: "https://www.sunkool.in/blog/el-nino",
  status: "new",
  created_at: "2026-10-15T10:24:00+00:00",
};

test("maps a database row to a lead", () => {
  assert.deepEqual(mapBlogLead(row), {
    id: row.id,
    source: "blog",
    name: "Asha Verma",
    mobile: "+919876543210",
    city: "Nagpur",
    productName: "Sapphire",
    productCategory: "Window Film",
    message: null,
    blogTitle: "How does El Niño affect cars in India",
    blogUrl: "https://www.sunkool.in/blog/el-nino",
    status: "pending",
    createdAt: "2026-10-15T10:24:00+00:00",
  });
});

test("carries the visitor's message through, and reads a row from before the column existed as no message", () => {
  assert.equal(mapBlogLead({ ...row, message: "Need film for my SUV" }).message, "Need film for my SUV");
  assert.equal(mapBlogLead({ ...row, message: undefined }).message, null);
});

test("a closed row reads as Completed", () => {
  assert.equal(mapBlogLead({ ...row, status: "closed" }).status, "completed");
});

test("reads blog_leads newest first and reports the total", async () => {
  const { db, calls } = fakeDb({ data: [row], count: 1, error: null });
  const result = await getBlogLeads(db);

  assert.equal(result.total, 1);
  assert.equal(result.page, 1);
  assert.equal(result.leads[0].name, "Asha Verma");
  assert.deepEqual(calls[0], ["from", "blog_leads"]);
  assert.deepEqual(calls[1][2], { count: "exact" });
  assert.deepEqual(calls[2], ["order", "created_at", { ascending: false }]);
  assert.deepEqual(calls[4], ["range", 0, 24]);
});

test("asks for the right slice of a later page", async () => {
  const { db, calls } = fakeDb({ data: [], count: 80, error: null });
  const result = await getBlogLeads(db, 3);

  assert.equal(result.page, 3);
  assert.deepEqual(calls.at(-1), ["range", 50, 74]);
});

test("treats a nonsense page number as the first page", async () => {
  for (const page of [0, -4, Number.NaN]) {
    const { db, calls } = fakeDb({ data: [], count: 0, error: null });
    assert.equal((await getBlogLeads(db, page)).page, 1);
    assert.deepEqual(calls.at(-1), ["range", 0, 24]);
  }
});

test("an empty table is an empty list, not an error", async () => {
  const { db } = fakeDb({ data: null, count: null, error: null });
  assert.deepEqual(await getBlogLeads(db), { leads: [], total: 0, page: 1, pageSize: 25 });
});

test("a page past the end falls back to the first page", async () => {
  const { db, calls } = fakeDb(
    { data: null, count: null, error: { code: "PGRST103", message: "Requested range not satisfiable" } },
    { data: [row], count: 1, error: null }
  );
  const result = await getBlogLeads(db, 9);

  assert.equal(result.page, 1);
  assert.equal(result.leads.length, 1);
  assert.deepEqual(calls.filter((c) => c[0] === "range"), [["range", 200, 224], ["range", 0, 24]]);
});

test("database failures surface as a readable BlogLeadsError carrying the code", async () => {
  const { db } = fakeDb({ data: null, count: null, error: { code: "PGRST205", message: "Could not find the table 'public.blog_leads'" } });
  await assert.rejects(getBlogLeads(db), (error: unknown) => {
    assert.ok(error instanceof BlogLeadsError);
    assert.equal(error.code, "PGRST205");
    assert.match(error.message, /blog_leads/);
    return true;
  });
});

test("the list asks for the status column and the unfiltered list adds no status filter", async () => {
  const { db, calls } = fakeDb({ data: [row], count: 1, error: null });
  await getBlogLeads(db);

  assert.match(String(calls[1][1]), /\bstatus\b/);
  assert.equal(calls.some((c) => c[0] === "in"), false);
});

test("a status filter asks for exactly the enum values that read as that status", async () => {
  const completed = fakeDb({ data: [{ ...row, status: "closed" }], count: 7, error: null });
  const result = await getBlogLeads(completed.db, 1, "completed");

  assert.deepEqual(completed.calls.find((c) => c[0] === "in"), ["in", "status", ["converted", "closed"]]);
  assert.equal(result.total, 7);
  assert.equal(result.leads[0].status, "completed");
  // Filtering must not change how the list is ordered or sliced.
  assert.deepEqual(completed.calls.filter((c) => c[0] === "order"), [["order", "created_at", { ascending: false }], ["order", "id", { ascending: true }]]);
  assert.deepEqual(completed.calls.at(-1), ["range", 0, 24]);

  const pending = fakeDb({ data: [], count: 0, error: null });
  await getBlogLeads(pending.db, 1, "pending");
  assert.deepEqual(pending.calls.find((c) => c[0] === "in"), ["in", "status", ["new", "contacted"]]);
});

test("a page past the end of a filtered list falls back to the first page of the same filter", async () => {
  const { db, calls } = fakeDb(
    { data: null, count: null, error: { code: "PGRST103", message: "Requested range not satisfiable" } },
    { data: [row], count: 1, error: null }
  );
  const result = await getBlogLeads(db, 4, "completed");

  assert.equal(result.page, 1);
  assert.deepEqual(calls.filter((c) => c[0] === "in"), [["in", "status", ["converted", "closed"]], ["in", "status", ["converted", "closed"]]]);
  assert.deepEqual(calls.filter((c) => c[0] === "range"), [["range", 75, 99], ["range", 0, 24]]);
});

test("counts Pending and Completed separately and the total is their sum", async () => {
  const { db, calls } = fakeDb({ data: null, count: 5, error: null }, { data: null, count: 12, error: null });

  assert.deepEqual(await getBlogLeadCounts(db), { total: 17, pending: 5, completed: 12 });
  // head: true — only the count comes back, never the contact details.
  assert.deepEqual(calls.filter((c) => c[0] === "select").map((c) => c[2]), [{ count: "exact", head: true }, { count: "exact", head: true }]);
  assert.deepEqual(calls.filter((c) => c[0] === "in"), [["in", "status", ["new", "contacted"]], ["in", "status", ["converted", "closed"]]]);
});

test("no enquiries is zero everywhere, not an error", async () => {
  const { db } = fakeDb({ data: null, count: null, error: null }, { data: null, count: null, error: null });
  assert.deepEqual(await getBlogLeadCounts(db), { total: 0, pending: 0, completed: 0 });
});

test("a failing count surfaces as a BlogLeadsError", async () => {
  const { db } = fakeDb({ data: null, count: null, error: { code: "42501", message: "permission denied for table blog_leads" } }, { data: null, count: 1, error: null });
  await assert.rejects(getBlogLeadCounts(db), (error: unknown) => {
    assert.ok(error instanceof BlogLeadsError);
    assert.equal(error.code, "42501");
    return true;
  });
});

test("setting a status writes the matching enum value to that one row", async () => {
  const done = fakeUpdateDb({ data: [{ id: row.id }], error: null });
  assert.equal(await setBlogLeadStatus(done.db, row.id, "completed"), true);
  assert.deepEqual(done.calls, [["from", "blog_leads"], ["update", { status: "closed" }], ["eq", "id", row.id], ["select", "id"]]);

  const back = fakeUpdateDb({ data: [{ id: row.id }], error: null });
  await setBlogLeadStatus(back.db, row.id, "pending");
  assert.deepEqual(back.calls[1], ["update", { status: "new" }]);
});

test("a status change that touched no row reports false instead of pretending it saved", async () => {
  // A deleted enquiry, or one RLS hides from this user, updates zero rows without any error.
  assert.equal(await setBlogLeadStatus(fakeUpdateDb({ data: [], error: null }).db, row.id, "completed"), false);
  assert.equal(await setBlogLeadStatus(fakeUpdateDb({ data: null, error: null }).db, row.id, "completed"), false);
});

test("a failed status change surfaces as a BlogLeadsError", async () => {
  const { db } = fakeUpdateDb({ data: null, error: { code: "42501", message: "permission denied for table blog_leads" } });
  await assert.rejects(setBlogLeadStatus(db, row.id, "completed"), (error: unknown) => {
    assert.ok(error instanceof BlogLeadsError);
    assert.equal(error.code, "42501");
    return true;
  });
});

const chatbotRow = { ...row, lead_source: "chatbot", city: null, blog_title: null, blog_url: null };

test("a chatbot lead says where it came from and has no city or blog", () => {
  const lead = mapBlogLead(chatbotRow);
  assert.equal(lead.source, "chatbot");
  assert.equal(lead.city, null);
  assert.equal(lead.blogTitle, null);
  assert.equal(lead.blogUrl, null);
  assert.equal(lead.productName, "Sapphire");
});

test("a row without lead_source, or with an unknown one, reads as a blog enquiry", () => {
  assert.equal(mapBlogLead(row).source, "blog");
  assert.equal(mapBlogLead({ ...row, lead_source: "blog" }).source, "blog");
  assert.equal(mapBlogLead({ ...row, lead_source: "something-new" }).source, "blog");
});

test("a source filter reads lead_source and asks for only that source, keeping the order and the slice", async () => {
  const { db, calls } = fakeDb({ data: [chatbotRow], count: 1, error: null });
  const result = await getBlogLeads(db, 1, "all", undefined, "chatbot");

  assert.match(String(calls[1][1]), /\blead_source\b/);
  assert.deepEqual(calls.filter((c) => c[0] === "eq"), [["eq", "lead_source", "chatbot"]]);
  assert.equal(result.leads[0].source, "chatbot");
  assert.deepEqual(calls.filter((c) => c[0] === "order"), [["order", "created_at", { ascending: false }], ["order", "id", { ascending: true }]]);
  assert.deepEqual(calls.at(-1), ["range", 0, 24]);
});

test("without a source, lead_source is neither read nor filtered on (a database before migration 0010)", async () => {
  const { db, calls } = fakeDb({ data: [row], count: 1, error: null });
  await getBlogLeads(db);

  assert.doesNotMatch(String(calls[1][1]), /lead_source/);
  assert.equal(calls.some((c) => c[0] === "eq"), false);
});

test("a source and a status filter combine", async () => {
  const { db, calls } = fakeDb({ data: [], count: 0, error: null });
  await getBlogLeads(db, 1, "pending", undefined, "chatbot");

  assert.deepEqual(calls.find((c) => c[0] === "in"), ["in", "status", ["new", "contacted"]]);
  assert.deepEqual(calls.find((c) => c[0] === "eq"), ["eq", "lead_source", "chatbot"]);
});

test("before migration 0008 the list drops only the message column and keeps the source filter", async () => {
  const { db, calls } = fakeDb(
    { data: null, count: null, error: { code: "42703", message: 'column "message" does not exist' } },
    { data: [row], count: 1, error: null }
  );
  const result = await getBlogLeads(db, 1, "all", undefined, "blog");

  const selects = calls.filter((c) => c[0] === "select").map((c) => String(c[1]));
  assert.equal(selects.length, 2);
  assert.match(selects[0], /\bmessage\b/);
  assert.doesNotMatch(selects[1], /\bmessage\b/);
  assert.match(selects[1], /\blead_source\b/);
  assert.deepEqual(calls.filter((c) => c[0] === "eq"), [["eq", "lead_source", "blog"], ["eq", "lead_source", "blog"]]);
  assert.equal(result.leads.length, 1);
});

test("a page past the end of a source's list falls back to the first page of the same source", async () => {
  const { db, calls } = fakeDb(
    { data: null, count: null, error: { code: "PGRST103", message: "Requested range not satisfiable" } },
    { data: [chatbotRow], count: 1, error: null }
  );
  const result = await getBlogLeads(db, 3, "all", undefined, "chatbot");

  assert.equal(result.page, 1);
  assert.deepEqual(calls.filter((c) => c[0] === "eq"), [["eq", "lead_source", "chatbot"], ["eq", "lead_source", "chatbot"]]);
  assert.deepEqual(calls.filter((c) => c[0] === "range"), [["range", 50, 74], ["range", 0, 24]]);
});

test("the status counts can be limited to one source", async () => {
  const { db, calls } = fakeDb({ data: null, count: 1, error: null }, { data: null, count: 2, error: null });

  assert.deepEqual(await getBlogLeadCounts(db, "chatbot"), { total: 3, pending: 1, completed: 2 });
  assert.deepEqual(calls.filter((c) => c[0] === "eq"), [["eq", "lead_source", "chatbot"], ["eq", "lead_source", "chatbot"]]);
});

test("counts say how many enquiries each source holds, reading only the counts", async () => {
  const { db, calls } = fakeDb({ data: null, count: 40, error: null }, { data: null, count: 3, error: null });

  assert.deepEqual(await getBlogLeadSourceCounts(db), { blog: 40, chatbot: 3 });
  assert.deepEqual(calls.filter((c) => c[0] === "eq"), [["eq", "lead_source", "blog"], ["eq", "lead_source", "chatbot"]]);
  assert.deepEqual(calls.filter((c) => c[0] === "select").map((c) => c[2]), [{ count: "exact", head: true }, { count: "exact", head: true }]);
});

test("source counts are null, not an error, while the lead_source column does not exist yet", async () => {
  const { db } = fakeDb({ data: null, count: null, error: { code: "42703", message: 'column "lead_source" does not exist' } });
  assert.equal(await getBlogLeadSourceCounts(db), null);
});

test("a failing source count surfaces as a BlogLeadsError", async () => {
  const { db } = fakeDb({ data: null, count: null, error: { code: "42501", message: "permission denied for table blog_leads" } });
  await assert.rejects(getBlogLeadSourceCounts(db), (error: unknown) => {
    assert.ok(error instanceof BlogLeadsError);
    assert.equal(error.code, "42501");
    return true;
  });
});
