// Audits the structured data (JSON-LD) of every city landing page on a running server (`next start`,
// or production after a deploy). It only requests city pages, which are static, so it is safe against
// a server connected to the real database.
//   node scripts/audit-city-schema.mjs http://127.0.0.1:3100
//
// A page may say SUNKOOL serves a city (areaServed) without saying SUNKOOL has a business there.
// A postal address, a phone number on a LocalBusiness, geo-coordinates or opening hours assert a
// physical presence, and the only one the repository supports is the head office in Nagpur
// (src/lib/contact.ts). Coverage claims (areaServed, "installation in <city>") are reported, not
// failed: whether SUNKOOL serves a city is for the business to confirm, not for a script to decide.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const base = new URL(process.argv[2] || "http://127.0.0.1:3100");
const HEAD_OFFICE = "nagpur";
const slugs = [...readFileSync(new URL("../../src/lib/cities.ts", import.meta.url), "utf8").matchAll(/slug: "([a-z]+)"/g)].map((m) => m[1]);
assert.ok(slugs.length >= 23, `expected the 23 cities, found ${slugs.length}`);

// Properties that assert a physical presence or a reputation the repository has no evidence for.
const PRESENCE = ["address", "geo", "openingHours", "openingHoursSpecification", "aggregateRating", "review", "branchOf", "hasMap"];
const NAGPUR_ONLY = /Nagpur|Maharashtra|Wardha|Sitabuldi|Zero Mile|Congress Nagar/i;

function* objects(node) {
  if (Array.isArray(node)) for (const item of node) yield* objects(item);
  else if (node && typeof node === "object") {
    yield node;
    for (const value of Object.values(node)) yield* objects(value);
  }
}
const typesOf = (node) => [node["@type"]].flat().filter(Boolean);

const failures = [];
const rows = [];
for (const slug of slugs) {
  const response = await fetch(new URL(`/${slug}`, base), { signal: AbortSignal.timeout(60000) });
  const html = await response.text();
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const all = blocks.flatMap((block) => [...objects(block)]);
  const fail = (message) => failures.push(`${slug}: ${message}`);

  if (response.status !== 200) fail(`HTTP ${response.status}`);
  const presence = all.filter((node) => PRESENCE.some((key) => key in node) || typesOf(node).includes("LocalBusiness"));
  if (slug !== HEAD_OFFICE && presence.length) {
    fail(`asserts a business presence (${presence.map((n) => typesOf(n).join("/") || "node").join(", ")}) with no evidence for it`);
  }
  if (slug !== HEAD_OFFICE && NAGPUR_ONLY.test(JSON.stringify(blocks))) fail("carries Nagpur wording from the shared template");
  for (const node of all) {
    const area = node.areaServed;
    if (area?.name && area.name.toLowerCase() !== slug) fail(`areaServed is ${area.name}, not this page's city`);
  }
  for (const node of all) {
    for (const value of Object.values(node)) {
      if (typeof value === "string" && /^https?:\/\/(?!www\.sunkool\.in)(sunkool\.in)\b/.test(value)) fail(`URL on the bare host: ${value}`);
    }
  }

  const service = all.find((node) => typesOf(node).includes("Service"));
  rows.push({
    city: slug,
    presence: slug === HEAD_OFFICE ? "head office" : presence.length ? "CLAIMED" : "none",
    areaServed: all.some((node) => node.areaServed?.name) ? "yes" : "no",
    service: !service ? "no Service node" : /installation in/i.test(`${service.name} ${service.description}`) ? "installation in city" : "product only",
  });
}

console.table(rows);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):`);
  for (const line of failures) console.error(`  FAIL  ${line}`);
  process.exit(1);
}
console.log(`\nall ${slugs.length} city pages: no unsupported business-presence claims`);
