import { test } from "node:test";
import assert from "node:assert/strict";
import { submitBlogLead, type SubmitLeadInput } from "./submit";

const POST_ID = "3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b";
const KEY = "0c9d7b3e-8a1f-4c2d-b5e6-7f8a9b0c1d2e";

const input: SubmitLeadInput = {
  postId: POST_ID,
  name: " Rahul   Sharma ",
  mobile: "98765 43210",
  city: "Nagpur",
  productId: "window-film/sapphire",
  submissionKey: KEY,
  website: "",
};

type Call = { fn: string; args: Record<string, unknown> };

function fakeSupabase(error: { message?: string; code?: string } | null = null) {
  const calls: Call[] = [];
  const supabase = {
    rpc: async (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      return { data: null, error };
    },
  } as unknown as Parameters<typeof submitBlogLead>[0];
  return { supabase, calls };
}

/** Silences the server log for tests that deliberately hit an unexpected-error path. */
function quietly<T>(run: () => Promise<T>): Promise<T> {
  const original = console.error;
  console.error = () => {};
  return run().finally(() => {
    console.error = original;
  });
}

test("stores a valid enquiry through submit_blog_lead with normalised values", async () => {
  const { supabase, calls } = fakeSupabase();
  assert.deepEqual(await submitBlogLead(supabase, input), { success: true });
  assert.deepEqual(calls, [
    {
      fn: "submit_blog_lead",
      args: {
        p_post_id: POST_ID,
        p_name: "Rahul Sharma",
        p_mobile: "+919876543210",
        p_city: "Nagpur",
        p_product_id: "window-film/sapphire",
        p_product_name: "Sapphire",
        p_product_category: "Window Film",
        p_submission_key: KEY,
      },
    },
  ]);
});

test("the product name and category come from the catalogue, never from the browser", async () => {
  const { supabase, calls } = fakeSupabase();
  await submitBlogLead(supabase, { ...input, productName: "FREE iPhone", productCategory: "Scam" } as SubmitLeadInput);
  assert.equal(calls[0].args.p_product_name, "Sapphire");
  assert.equal(calls[0].args.p_product_category, "Window Film");
});

test("invalid fields are rejected with per-field messages and nothing reaches the database", async () => {
  const { supabase, calls } = fakeSupabase();
  const result = await submitBlogLead(supabase, { ...input, name: "", mobile: "123", city: "9", productId: "" });
  assert.equal(result.success, false);
  if (!result.success) assert.deepEqual(Object.keys(result.fieldErrors ?? {}).sort(), ["city", "mobile", "name", "productId"]);
  assert.equal(calls.length, 0);
});

test("a product id that is not in the catalogue is rejected", async () => {
  const { supabase, calls } = fakeSupabase();
  const result = await submitBlogLead(supabase, { ...input, productId: "window-film/does-not-exist" });
  assert.equal(result.success, false);
  if (!result.success) assert.match(result.fieldErrors?.productId ?? "", /Choose a product/);
  assert.equal(calls.length, 0);
});

test("a missing or malformed blog post id is rejected before any database call", async () => {
  for (const postId of [undefined, "", "not-a-uuid", 42, "3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b'; drop table posts;--"]) {
    const { supabase, calls } = fakeSupabase();
    const result = await submitBlogLead(supabase, { ...input, postId });
    assert.equal(result.success, false, String(postId));
    assert.equal(calls.length, 0);
  }
});

test("the honeypot makes a bot think it succeeded while storing nothing", async () => {
  const { supabase, calls } = fakeSupabase();
  assert.deepEqual(await submitBlogLead(supabase, { ...input, website: "https://spam.example" }), { success: true });
  assert.equal(calls.length, 0);
});

test("a bad idempotency key is dropped (the database makes its own) rather than failing the visitor", async () => {
  const { supabase, calls } = fakeSupabase();
  assert.equal((await submitBlogLead(supabase, { ...input, submissionKey: "nope" })).success, true);
  assert.equal(calls[0].args.p_submission_key, null);
});

test("maps database errors to messages a visitor can act on", async () => {
  const rateLimited = await submitBlogLead(fakeSupabase({ message: "lead_rate_limited", code: "PT429" }).supabase, input);
  assert.equal(rateLimited.success, false);
  if (!rateLimited.success) assert.match(rateLimited.error, /several enquiries/);

  const gone = await submitBlogLead(fakeSupabase({ message: "post_not_found", code: "P0001" }).supabase, input);
  assert.equal(gone.success, false);
  if (!gone.success) assert.match(gone.error, /no longer available/);

  const mobile = await submitBlogLead(fakeSupabase({ message: "invalid_lead:mobile", code: "P0001" }).supabase, input);
  assert.equal(mobile.success, false);
  if (!mobile.success) assert.ok(mobile.fieldErrors?.mobile);

  const product = await submitBlogLead(fakeSupabase({ message: "invalid_lead:product", code: "P0001" }).supabase, input);
  if (!product.success) assert.ok(product.fieldErrors?.productId);
});

test("unexpected database errors are logged but never shown to the visitor", async () => {
  const leaky = { message: 'relation "blog_leads" does not exist', code: "42P01" };
  const result = await quietly(() => submitBlogLead(fakeSupabase(leaky).supabase, input));
  assert.equal(result.success, false);
  if (!result.success) {
    assert.doesNotMatch(result.error, /relation|blog_leads|42P01/);
    assert.match(result.error, /couldn't send your enquiry/);
  }
});

test("a function that does not exist yet (migration not applied) fails gracefully", async () => {
  const missing = { message: "Could not find the function public.submit_blog_lead", code: "PGRST202" };
  const result = await quietly(() => submitBlogLead(fakeSupabase(missing).supabase, input));
  assert.equal(result.success, false);
});

test("sends p_message only when the visitor wrote one", async () => {
  const without = fakeSupabase();
  await submitBlogLead(without.supabase, input);
  assert.equal("p_message" in without.calls[0].args, false);

  const withMessage = fakeSupabase();
  const result = await submitBlogLead(withMessage.supabase, { ...input, message: "  Need film for my SUV  " });
  assert.deepEqual(result, { success: true });
  assert.equal(withMessage.calls[0].args.p_message, "Need film for my SUV");
});

test("a database without migration 0008 still takes the enquiry (retried without the message)", async () => {
  const calls: Call[] = [];
  const supabase = {
    rpc: async (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      return "p_message" in args ? { data: null, error: { code: "PGRST202", message: "no function" } } : { data: null, error: null };
    },
  } as unknown as Parameters<typeof submitBlogLead>[0];
  const result = await submitBlogLead(supabase, { ...input, message: "Hello" });
  assert.deepEqual(result, { success: true });
  assert.equal(calls.length, 2);
  assert.equal("p_message" in calls[1].args, false);
});
