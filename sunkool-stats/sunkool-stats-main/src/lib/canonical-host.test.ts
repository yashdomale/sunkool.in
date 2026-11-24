// Regression tests for the host rules in canonical-host.ts, run through the real src/proxy.ts.
// The bug these pin: the proxy used to 308 every host except www.sunkool.in to www whenever
// VERCEL_ENV was "production", which made the project's *.vercel.app production URL unreachable.
// Every proxy case below runs with VERCEL_ENV=production, the environment the bug appeared in.
import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { CANONICAL_HOST, canonicalRedirectUrl, normalizeHost, shouldNoindex } from "./canonical-host";

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

/** Runs the proxy for `path` as if it arrived on `host` (empty string = no Host header). */
function request(host: string, path = "/", init: { protocol?: string; headers?: Record<string, string> } = {}) {
  const origin = `${init.protocol ?? "https"}://${host || "localhost"}`;
  const headers = new Headers(init.headers);
  if (host) headers.set("host", host);
  return withEnv({ VERCEL_ENV: "production" }, () => proxy(new NextRequest(`${origin}${path}`, { headers })));
}

const TEST_DOMAIN = "sunkool-in-v5re.vercel.app";
const PREVIEW_DOMAIN = "sunkool-in-git-fix-branch-yashdomale.vercel.app";

// ── Through the proxy ────────────────────────────────────────────────────────────────────────

test("sunkool.in 308-redirects to https://www.sunkool.in, keeping path and query", async () => {
  const res = await request("sunkool.in", "/ppf?utm_source=x");
  assert.equal(res.status, 308);
  assert.equal(res.headers.get("location"), "https://www.sunkool.in/ppf?utm_source=x");
});

test("sunkool.in over http, with a port or in upper case still lands on https://www.sunkool.in", async () => {
  for (const [host, protocol] of [["sunkool.in", "http"], ["sunkool.in:443", "https"], ["SUNKOOL.IN", "https"]]) {
    const res = await request(host, "/", { protocol });
    assert.equal(res.status, 308, host);
    assert.equal(res.headers.get("location"), "https://www.sunkool.in/", host);
  }
});

test("www.sunkool.in is served as-is, with no noindex header", async () => {
  for (const path of ["/", "/blog", "/nagpur", "/robots.txt", "/sitemap.xml"]) {
    const res = await request(CANONICAL_HOST, path);
    assert.equal(res.status, 200, path);
    assert.equal(res.headers.get("location"), null, path);
    assert.equal(res.headers.get("x-robots-tag"), null, path);
  }
});

test("the *.vercel.app production URL is served, not redirected, and marked noindex", async () => {
  for (const path of ["/", "/blog", "/robots.txt"]) {
    const res = await request(TEST_DOMAIN, path);
    assert.equal(res.status, 200, path);
    assert.equal(res.headers.get("location"), null, path);
    assert.equal(res.headers.get("x-robots-tag"), "noindex", path);
  }
});

test("preview deployment URLs are served, not redirected, and marked noindex", async () => {
  const res = await request(PREVIEW_DOMAIN, "/window-film");
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("location"), null);
  assert.equal(res.headers.get("x-robots-tag"), "noindex");
});

test("localhost is served as-is, with no noindex header", async () => {
  for (const host of ["localhost:3000", "127.0.0.1:3000", "[::1]:3000"]) {
    const res = await request(host, "/", { protocol: "http" });
    assert.equal(res.status, 200, host);
    assert.equal(res.headers.get("location"), null, host);
    assert.equal(res.headers.get("x-robots-tag"), null, host);
  }
});

test("a request with no Host header (Next's image-optimizer self-fetch) is left alone", async () => {
  const res = await request("", "/images/logo.png");
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("location"), null);
  assert.equal(res.headers.get("x-robots-tag"), null);
});

test("a spoofed X-Forwarded-Host cannot redirect away from sunkool.in or steer the destination", async () => {
  const onTest = await request(TEST_DOMAIN, "/", { headers: { "x-forwarded-host": "sunkool.in" } });
  assert.equal(onTest.headers.get("location"), null);
  const onApex = await request("sunkool.in", "//evil.example/x", { headers: { "x-forwarded-host": "evil.example" } });
  assert.equal(new URL(onApex.headers.get("location")!).host, CANONICAL_HOST);
});

test("admin pages still send signed-out visitors to /admin/login, on www and on the test domain", async () => {
  // No session cookie, so Supabase answers "no user" without a network call.
  const supabase = { NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:1", NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon" };
  for (const host of [CANONICAL_HOST, TEST_DOMAIN]) {
    const res = await withEnv(supabase, () => request(host, "/admin/dashboard"));
    assert.equal(res.status, 307, host);
    const location = new URL(res.headers.get("location")!);
    assert.equal(location.host, host, host);
    assert.equal(`${location.pathname}${location.search}`, "/admin/login?next=%2Fadmin%2Fdashboard", host);
  }
});

// ── The helpers on their own ─────────────────────────────────────────────────────────────────

test("normalizeHost lower-cases and strips port and trailing dot", () => {
  assert.equal(normalizeHost("WWW.Sunkool.IN.:443"), "www.sunkool.in");
  assert.equal(normalizeHost("localhost:3000"), "localhost");
  assert.equal(normalizeHost("[::1]:3000"), "[::1]");
  assert.equal(normalizeHost(null), "");
  assert.equal(normalizeHost(""), "");
});

test("only the bare apex is redirected", () => {
  for (const host of [CANONICAL_HOST, TEST_DOMAIN, PREVIEW_DOMAIN, "localhost:3000", "w.sunkool.in", "evilsunkool.in", "sunkool.in.evil.example", "", null]) {
    assert.equal(canonicalRedirectUrl(host, "https://example.test/"), null, String(host));
  }
  assert.equal(canonicalRedirectUrl("sunkool.in.", "https://sunkool.in/x")?.href, "https://www.sunkool.in/x");
});

test("noindex applies to every non-production host and never to www or local hosts", () => {
  for (const host of [TEST_DOMAIN, PREVIEW_DOMAIN, "sunkool-stats.vercel.app", "192.168.31.182:3000"]) {
    assert.equal(shouldNoindex(host), true, host);
  }
  for (const host of [CANONICAL_HOST, "WWW.SUNKOOL.IN:443", "localhost:3000", "127.0.0.1", "[::1]:3000", "", null]) {
    assert.equal(shouldNoindex(host), false, String(host));
  }
});
