// Guards the invariants of the legacy Wix redirects without a server: every target is a real page
// (so a 301 never lands on a 404), no target is itself redirected (no chains or loops), and every
// rule is a plain 301. Whether each pattern actually matches the old URLs is covered end to end by
// scripts/qa/verify-legacy-urls.mjs against a running build.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cities } from "@/lib/cities";
import { getCategoryCopy } from "@/lib/blog/category-copy";
import { legacyRedirects } from "./legacy-redirects";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** URL paths of the static pages under src/app (route groups removed; dynamic segments kept). */
function appPages(dir = path.join(root, "src/app"), prefix = ""): string[] {
  const pages: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const segment = /^\(.*\)$/.test(entry.name) ? "" : `/${entry.name}`;
      pages.push(...appPages(path.join(dir, entry.name), prefix + segment));
    } else if (/^page\.(tsx?|mdx?)$/.test(entry.name)) {
      pages.push(prefix || "/");
    }
  }
  return pages;
}

/** `source` values of the redirects already declared inline in next.config.ts. */
function configSources(): string[] {
  const config = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  return [...config.matchAll(/source:\s*"([^"]+)"/g)].map((match) => match[1]);
}

const pages = new Set(appPages());
/** A destination's path without its query (`/blog?category=x` is the page `/blog`). */
const pathOf = (destination: string) => destination.split("?")[0];
const isRealPage = (destination: string) => {
  const path = pathOf(destination);
  return pages.has(path) || (/^\/[^/]+$/.test(path) && Object.hasOwn(cities, path.slice(1)));
};

test("every legacy redirect is a plain 301", () => {
  assert.ok(legacyRedirects.length > 0);
  for (const rule of legacyRedirects) assert.equal(rule.statusCode, 301, rule.source);
});

test("legacy redirect sources are unique and do not clash with the inline rules", () => {
  const sources = legacyRedirects.map((rule) => rule.source);
  assert.equal(new Set(sources).size, sources.length, "duplicate source");
  const inline = new Set(configSources());
  for (const source of sources) assert.ok(!inline.has(source), `${source} is also declared in next.config.ts`);
});

test("every legacy redirect points at a real page", () => {
  for (const rule of legacyRedirects) {
    assert.ok(isRealPage(rule.destination), `${rule.source} -> ${rule.destination} is not a page of this app`);
  }
});

test("no redirect destination is itself redirected (no chains, no loops)", () => {
  const sources = new Set([...configSources(), ...legacyRedirects.map((rule) => rule.source)]);
  for (const rule of legacyRedirects) {
    assert.ok(!sources.has(pathOf(rule.destination)), `${rule.source} -> ${rule.destination} is redirected again`);
  }
});

test("a blog category in a destination is one that has its own indexable page", () => {
  for (const rule of legacyRedirects) {
    const category = new URL(rule.destination, "https://www.sunkool.in").searchParams.get("category");
    if (category === null) continue;
    assert.ok(getCategoryCopy(category), `${rule.source} -> ${rule.destination}: "${category}" has no category copy, so the page is noindex`);
  }
});

test("no blanket wildcard: every redirect names one specific old URL", () => {
  // Retired Wix tags/categories and car-model pages stay 404 unless they have an exact equivalent;
  // a catch-all would send them all to one unrelated page, which Google treats as a soft 404.
  // Only redirects() - the headers() rules below it legitimately use :path*.
  const config = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  const redirectsBlock = config.slice(config.indexOf("async redirects()"), config.indexOf("async headers()"));
  const inline = [...redirectsBlock.matchAll(/source:\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(inline.length > 0, "found no inline redirects");
  for (const source of [...inline, ...legacyRedirects.map((rule) => rule.source)]) {
    // `:n(\\d+)` (a trailing Wix duplicate number) is a single-segment digit match, not a catch-all.
    const withoutDigitSuffix = source.replace(/\(\\d\+\)/g, "");
    assert.ok(!/\*|\(\.\*\)|\(\?!|:\w+[+?]/.test(withoutDigitSuffix), `${source} is a wildcard pattern`);
  }
});
