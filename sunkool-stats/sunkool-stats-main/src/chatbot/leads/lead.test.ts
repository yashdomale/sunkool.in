import { test } from "node:test";
import assert from "node:assert/strict";
import { submitChatLead } from "./lead";
import { conversationSubmissionKey } from "@/chatbot/leads/chatbot";

const SESSION = "0c9d7b3e-8a1f-4c2d-b5e6-7f8a9b0c1d2e";

type Call = { fn: string; args: Record<string, unknown> };

function fakeSupabase(result: { data?: unknown; error?: { message?: string; code?: string } | null } = {}) {
  const calls: Call[] = [];
  const supabase = {
    rpc: async (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      return { data: result.data ?? true, error: result.error ?? null };
    },
  } as unknown as Parameters<typeof submitChatLead>[0];
  return { supabase, calls };
}

const good = { name: "Yash Domale", mobile: "84830 30945", topic: "Heat Control Glazing", sessionId: SESSION };

async function quietly<T>(run: () => Promise<T>): Promise<T> {
  const original = console.error;
  console.error = () => {};
  try {
    return await run();
  } finally {
    console.error = original;
  }
}

test("a call-back request is filed as a chatbot lead under the topic the visitor picked", async () => {
  const { supabase, calls } = fakeSupabase();
  assert.deepEqual(await submitChatLead(supabase, good), { success: true, name: "Yash Domale" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].fn, "submit_chatbot_lead");
  assert.deepEqual(calls[0].args, {
    p_name: "Yash Domale",
    p_mobile: "+918483030945",
    p_product_id: "chatbot/heat-control-glazing",
    p_product_name: "Heat Control Glazing",
    p_submission_key: conversationSubmissionKey(`${SESSION}:heat-control-glazing`),
  });
});

test("a lead that did not come from a quick topic is filed as a general enquiry", async () => {
  for (const topic of [undefined, null, "", "Something I made up"]) {
    const { supabase, calls } = fakeSupabase();
    await submitChatLead(supabase, { ...good, topic });
    assert.equal(calls[0].args.p_product_name, "General enquiry", String(topic));
  }
});

test("sending the same request twice in one chat stores one lead (the key comes from the chat's id and the product)", async () => {
  const a = fakeSupabase();
  const b = fakeSupabase();
  await submitChatLead(a.supabase, good);
  await submitChatLead(b.supabase, { ...good, name: "Yash D" });
  assert.equal(a.calls[0].args.p_submission_key, b.calls[0].args.p_submission_key);
});

test("two different products asked about in one chat are two leads, not one", async () => {
  const a = fakeSupabase();
  const b = fakeSupabase();
  await submitChatLead(a.supabase, good);
  await submitChatLead(b.supabase, { ...good, topic: "Paint Protection Film" });
  assert.notEqual(a.calls[0].args.p_submission_key, b.calls[0].args.p_submission_key);
});

test("a different chat is a different lead for the same product", async () => {
  const a = fakeSupabase();
  const b = fakeSupabase();
  await submitChatLead(a.supabase, good);
  await submitChatLead(b.supabase, { ...good, sessionId: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed" });
  assert.notEqual(a.calls[0].args.p_submission_key, b.calls[0].args.p_submission_key);
});

test("a bad name or number is refused with per-field messages and nothing is stored", async () => {
  const { supabase, calls } = fakeSupabase();
  const result = await submitChatLead(supabase, { ...good, name: "", mobile: "123" });
  assert.equal(result.success, false);
  if (!result.success) assert.deepEqual(Object.keys(result.fieldErrors ?? {}).sort(), ["mobile", "name"]);
  assert.equal(calls.length, 0);

  const nameOnly = await submitChatLead(supabase, { ...good, name: "R2D2 <script>" });
  assert.equal(nameOnly.success, false);
  if (!nameOnly.success) assert.deepEqual(Object.keys(nameOnly.fieldErrors ?? {}), ["name"]);
  assert.equal(calls.length, 0);
});

test("the honeypot makes a bot think it worked while storing nothing", async () => {
  const { supabase, calls } = fakeSupabase();
  assert.equal((await submitChatLead(supabase, { ...good, website: "https://spam.example" })).success, true);
  assert.equal(calls.length, 0);
});

test("non-text input is refused rather than coerced", async () => {
  const { supabase, calls } = fakeSupabase();
  for (const bad of [{ name: 42, mobile: "9876543210" }, { name: "Rahul", mobile: 9876543210 }, { name: ["Rahul"], mobile: null }]) {
    assert.equal((await submitChatLead(supabase, bad)).success, false);
  }
  assert.equal(calls.length, 0);
});

test("database limits are explained in plain words", async () => {
  const limited = await submitChatLead(fakeSupabase({ error: { message: "lead_rate_limited", code: "PT429" } }).supabase, good);
  assert.equal(limited.success, false);
  if (!limited.success) assert.match(limited.error, /several requests/);

  const unreachable = await quietly(() => submitChatLead(fakeSupabase({ error: { message: 'relation "blog_leads" does not exist', code: "42P01" } }).supabase, good));
  assert.equal(unreachable.success, false);
  if (!unreachable.success) {
    assert.match(unreachable.error, /WhatsApp/);
    assert.doesNotMatch(unreachable.error, /relation|blog_leads|42P01/);
  }
});
