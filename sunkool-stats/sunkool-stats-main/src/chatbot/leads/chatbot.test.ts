import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FALLBACK_NAME,
  FALLBACK_PRODUCT,
  MIN_SECRET_LENGTH,
  chatbotLeadName,
  chatbotLeadProduct,
  conversationSubmissionKey,
  isChatbotSecretConfigured,
  parseChatbotPayload,
  secretFromRequest,
  secretMatches,
  submitChatbotLead,
} from "./chatbot";
import { UUID_PATTERN } from "@/lib/leads/validation";

const SECRET = "0123456789abcdef0123456789abcdef";

type Call = { fn: string; args: Record<string, unknown> };

function fakeSupabase(result: { data?: unknown; error?: { message?: string; code?: string } | null } = {}) {
  const calls: Call[] = [];
  const supabase = {
    rpc: async (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      return { data: result.data ?? true, error: result.error ?? null };
    },
  } as unknown as Parameters<typeof submitChatbotLead>[0];
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

test("the secret must be set and long enough to count as configured", () => {
  assert.equal(isChatbotSecretConfigured(SECRET), true);
  assert.equal(isChatbotSecretConfigured("x".repeat(MIN_SECRET_LENGTH)), true);
  assert.equal(isChatbotSecretConfigured("x".repeat(MIN_SECRET_LENGTH - 1)), false);
  assert.equal(isChatbotSecretConfigured(""), false);
  assert.equal(isChatbotSecretConfigured(undefined), false);
});

test("only the exact secret is accepted, and never when none is configured", () => {
  assert.equal(secretMatches(SECRET, SECRET), true);
  assert.equal(secretMatches(`${SECRET}x`, SECRET), false);
  assert.equal(secretMatches(SECRET.slice(1), SECRET), false);
  assert.equal(secretMatches("", SECRET), false);
  assert.equal(secretMatches(null, SECRET), false);
  assert.equal(secretMatches(undefined, SECRET), false);
  // An unset or too-short secret on the server must not let an empty or matching guess through.
  assert.equal(secretMatches("", undefined), false);
  assert.equal(secretMatches("short", "short"), false);
  assert.equal(secretMatches(undefined, undefined), false);
});

test("the secret is read from the header, or from ?token= when only a URL can be configured", () => {
  const none = new URLSearchParams();
  assert.equal(secretFromRequest(new Headers({ "x-chatbot-secret": ` ${SECRET} ` }), none), SECRET);
  assert.equal(secretFromRequest(new Headers(), new URLSearchParams({ token: SECRET })), SECRET);
  assert.equal(secretFromRequest(new Headers({ "x-chatbot-secret": "a" }), new URLSearchParams({ token: "b" })), "a", "the header wins");
  assert.equal(secretFromRequest(new Headers(), none), null);
  assert.equal(secretFromRequest(new Headers({ "x-chatbot-secret": "  " }), none), null);
});

test("the payload is read from flat keys, with phone and Zoho's visitor object as fallbacks", () => {
  assert.deepEqual(
    parseChatbotPayload({ name: "Yash", mobile: "+918483030945", product: "Ultra Edge", conversation_id: "c1" }),
    { name: "Yash", mobile: "+918483030945", product: "Ultra Edge", conversationId: "c1" }
  );
  assert.deepEqual(parseChatbotPayload({ name: "Yash", phone: "8483030945", conversationId: "c2" }), {
    name: "Yash", mobile: "8483030945", product: undefined, conversationId: "c2",
  });
  assert.deepEqual(parseChatbotPayload({ visitor: { name: "Tricia", phone: "9123459876" }, product: "PPF" }), {
    name: "Tricia", mobile: "9123459876", product: "PPF", conversationId: undefined,
  });
  assert.equal(parseChatbotPayload({ name: "Flat", visitor: { name: "Nested" } }).name, "Flat", "flat keys win");
});

test("anything that is not an object gives an empty payload instead of throwing", () => {
  for (const body of [null, undefined, "text", 42, [], [{ name: "x" }]]) {
    assert.deepEqual(parseChatbotPayload(body), { name: undefined, mobile: undefined, product: undefined, conversationId: undefined });
  }
  // A visitor that is not an object is ignored.
  assert.equal(parseChatbotPayload({ visitor: "Tricia" }).name, undefined);
});

test("names are tidied but not rejected, and a missing or one-letter name falls back", () => {
  assert.equal(chatbotLeadName("  Rahul \t  Sharma\n"), "Rahul Sharma");
  assert.equal(chatbotLeadName("Yash123"), "Yash123", "digits are fine here: the number is what matters");
  assert.equal(chatbotLeadName("A"), FALLBACK_NAME);
  assert.equal(chatbotLeadName(""), FALLBACK_NAME);
  assert.equal(chatbotLeadName(undefined), FALLBACK_NAME);
  assert.equal(chatbotLeadName({ evil: true }), FALLBACK_NAME);
  assert.equal(chatbotLeadName("Ra\u0000hul\u007F"), "Ra hul");
  assert.equal(Array.from(chatbotLeadName("x".repeat(200))).length, 80);
});

test("a long name is cut on a character boundary, never in the middle of an emoji", () => {
  const name = chatbotLeadName(`${"a".repeat(79)}😀😀`);
  assert.equal(Array.from(name).length, 80);
  assert.ok(name.endsWith("😀"));
  assert.doesNotMatch(name, /[\uD800-\uDBFF](?![\uDC00-\uDFFF])/, "no lone surrogate");
});

test("the product keeps the bot's label and gets a stable id from it", () => {
  assert.deepEqual(chatbotLeadProduct("Heat Control Glazing"), { id: "chatbot/heat-control-glazing", name: "Heat Control Glazing" });
  assert.deepEqual(chatbotLeadProduct("  Warranty / Support "), { id: "chatbot/warranty-support", name: "Warranty / Support" });
  assert.equal(chatbotLeadProduct("heat   control glazing").id, "chatbot/heat-control-glazing", "case and spacing do not change the id");
  assert.deepEqual(chatbotLeadProduct(undefined), { id: "chatbot/not-specified", name: FALLBACK_PRODUCT });
  assert.deepEqual(chatbotLeadProduct("   "), { id: "chatbot/not-specified", name: FALLBACK_PRODUCT });
  assert.equal(chatbotLeadProduct("???").id, "chatbot/other", "a label with no letters still gets a valid id");
  assert.equal(chatbotLeadProduct("Interior PPF").id, "chatbot/interior-ppf");
});

test("product ids and names stay inside the database's length limits", () => {
  const product = chatbotLeadProduct("long label ".repeat(40));
  assert.ok(product.id.length <= 80, `${product.id.length}`);
  assert.ok(Array.from(product.name).length <= 120);
  assert.doesNotMatch(product.id, /-$/);
});

test("the same chat always maps to the same uuid, and different chats to different ones", () => {
  const key = conversationSubmissionKey("17000000004021");
  assert.ok(key && UUID_PATTERN.test(key), String(key));
  assert.equal(conversationSubmissionKey("17000000004021"), key);
  assert.equal(conversationSubmissionKey(17000000004021), key, "a numeric id is the same id");
  assert.notEqual(conversationSubmissionKey("17000000004022"), key);
});

test("no usable conversation id means the database makes its own key", () => {
  for (const id of [undefined, null, "", "   ", {}, "x".repeat(201)]) assert.equal(conversationSubmissionKey(id), null, String(id));
});

test("stores a lead through submit_chatbot_lead with cleaned values", async () => {
  const { supabase, calls } = fakeSupabase();
  const result = await submitChatbotLead(supabase, {
    name: " Yash  ", mobile: "+91 84830 30945", product: "Heat Control Glazing", conversationId: "abc",
  });
  assert.deepEqual(result, { success: true, stored: true });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], {
    fn: "submit_chatbot_lead",
    args: {
      p_name: "Yash",
      p_mobile: "+918483030945",
      p_product_id: "chatbot/heat-control-glazing",
      p_product_name: "Heat Control Glazing",
      p_submission_key: conversationSubmissionKey("abc"),
    },
  });
});

test("a local number and a numeric number are normalised to E.164", async () => {
  for (const mobile of ["98765 43210", "09876543210", 919876543210, "+91 98765-43210"]) {
    const { supabase, calls } = fakeSupabase();
    const result = await submitChatbotLead(supabase, { name: "Rahul", mobile, product: "PPF" });
    assert.equal(result.success, true, String(mobile));
    assert.equal(calls[0].args.p_mobile, "+919876543210", String(mobile));
  }
});

test("a lead with no usable number is refused (422) and nothing reaches the database", async () => {
  for (const mobile of [undefined, "", "123", "not a number", "+91 12345 67890", "9999999999", {}]) {
    const { supabase, calls } = fakeSupabase();
    const result = await submitChatbotLead(supabase, { name: "Rahul", mobile, product: "PPF" });
    assert.equal(result.success, false, String(mobile));
    if (!result.success) assert.equal(result.status, 422);
    assert.equal(calls.length, 0);
  }
});

test("a lead without a name or product is still stored, under the fallbacks", async () => {
  const { supabase, calls } = fakeSupabase();
  assert.deepEqual(await submitChatbotLead(supabase, { mobile: "9876543210" }), { success: true, stored: true });
  assert.equal(calls[0].args.p_name, FALLBACK_NAME);
  assert.equal(calls[0].args.p_product_id, "chatbot/not-specified");
  assert.equal(calls[0].args.p_submission_key, null);
});

test("a duplicate the database already holds is reported as not stored, still a success", async () => {
  const { supabase } = fakeSupabase({ data: false });
  assert.deepEqual(await submitChatbotLead(supabase, { name: "Rahul", mobile: "9876543210", product: "PPF" }), { success: true, stored: false });
});

test("database errors map to a status the caller can act on", async () => {
  const input = { name: "Rahul", mobile: "9876543210", product: "PPF" };

  const limited = await submitChatbotLead(fakeSupabase({ error: { message: "lead_rate_limited", code: "PT429" } }).supabase, input);
  assert.deepEqual([limited.success, !limited.success && limited.status], [false, 429]);

  for (const field of ["name", "mobile", "product"]) {
    const invalid = await submitChatbotLead(fakeSupabase({ error: { message: `invalid_lead:${field}`, code: "P0001" } }).supabase, input);
    assert.deepEqual([invalid.success, !invalid.success && invalid.status], [false, 422], field);
  }

  const notSetUp = await quietly(() =>
    submitChatbotLead(fakeSupabase({ error: { message: "Could not find the function public.submit_chatbot_lead", code: "PGRST202" } }).supabase, input)
  );
  assert.deepEqual([notSetUp.success, !notSetUp.success && notSetUp.status], [false, 503]);
});

test("unexpected database errors are logged but never echoed to the caller", async () => {
  const leaky = { message: 'relation "blog_leads" does not exist', code: "42P01" };
  const result = await quietly(() => submitChatbotLead(fakeSupabase({ error: leaky }).supabase, { name: "Rahul", mobile: "9876543210" }));
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.status, 500);
    assert.doesNotMatch(result.error, /relation|blog_leads|42P01/);
  }
});
