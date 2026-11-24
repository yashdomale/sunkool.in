import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET, HEAD, POST } from "@/app/api/chatbot-leads/route";

// Only the paths that finish before the database is touched are covered here (the handler reads
// the request's cookies to build its Supabase client, which needs a real request scope). Storing a
// lead is covered by chatbot.test.ts at the function level and, end to end, against a real
// Postgres + PostgREST stack.

const SECRET = "0123456789abcdef0123456789abcdef";

function post(body: string, init: { headers?: Record<string, string>; query?: string } = {}) {
  return new NextRequest(`http://localhost/api/chatbot-leads${init.query ?? ""}`, {
    method: "POST",
    body,
    headers: { "content-type": "application/json", ...init.headers },
  });
}

/** Runs `run` with the given environment variables set, then puts them back. */
async function withEnv<T>(env: Record<string, string | undefined>, run: () => Promise<T>): Promise<T> {
  const before = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await run();
  } finally {
    for (const [key, value] of Object.entries(before)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

const configured = { CHATBOT_LEAD_SECRET: SECRET, NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:1", NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon" };

test("HEAD answers 200 with no body (Zoho checks a webhook URL this way) and GET reports the service is up", async () => {
  const head = HEAD();
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  const get = GET();
  assert.equal(get.status, 200);
  assert.deepEqual(await get.json(), { ok: true, service: "chatbot-leads" });
});

test("without CHATBOT_LEAD_SECRET the endpoint stores nothing and says it is not configured", async () => {
  await withEnv({ ...configured, CHATBOT_LEAD_SECRET: undefined }, async () => {
    const response = await POST(post("{}", { headers: { "x-chatbot-secret": SECRET } }));
    assert.equal(response.status, 503);
  });
  // Too short to be a secret: treated the same as not set, even when the caller sends it.
  await withEnv({ ...configured, CHATBOT_LEAD_SECRET: "short" }, async () => {
    assert.equal((await POST(post("{}", { headers: { "x-chatbot-secret": "short" } }))).status, 503);
  });
});

test("without the Supabase variables it is not configured either", async () => {
  await withEnv({ ...configured, NEXT_PUBLIC_SUPABASE_URL: undefined }, async () => {
    assert.equal((await POST(post("{}", { headers: { "x-chatbot-secret": SECRET } }))).status, 503);
  });
});

test("a missing or wrong secret is refused with 401", async () => {
  await withEnv(configured, async () => {
    for (const init of [{}, { headers: { "x-chatbot-secret": "wrong-wrong-wrong-wrong" } }, { query: "?token=nope" }]) {
      const response = await POST(post('{"name":"Rahul","mobile":"9876543210"}', init));
      assert.equal(response.status, 401, JSON.stringify(init));
      assert.deepEqual(await response.json(), { ok: false, error: "Unauthorized." });
    }
  });
});

test("an oversized body is refused with 413", async () => {
  await withEnv(configured, async () => {
    const response = await POST(post(JSON.stringify({ name: "x".repeat(20_000) }), { headers: { "x-chatbot-secret": SECRET } }));
    assert.equal(response.status, 413);
  });
});

test("a body that is not JSON is refused with 400", async () => {
  await withEnv(configured, async () => {
    for (const body of ["", "name=Rahul", "{not json", "<xml/>"]) {
      const response = await POST(post(body, { headers: { "x-chatbot-secret": SECRET } }));
      assert.equal(response.status, 400, JSON.stringify(body));
    }
  });
});

test("the secret is checked before the body is looked at", async () => {
  await withEnv(configured, async () => {
    assert.equal((await POST(post("{not json"))).status, 401);
  });
});

test("every response is marked no-store", async () => {
  await withEnv(configured, async () => {
    assert.equal(HEAD().headers.get("cache-control"), "no-store");
    assert.equal(GET().headers.get("cache-control"), "no-store");
    assert.equal((await POST(post("{}"))).headers.get("cache-control"), "no-store");
  });
});
