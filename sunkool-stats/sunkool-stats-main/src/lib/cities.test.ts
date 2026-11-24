import { test } from "node:test";
import assert from "node:assert/strict";
import { cities, isCitySlug, servedCitySlugs } from "./cities";

test("every city in the footer's \"Cities We Serve\" list has a landing page, and none is listed twice", () => {
  for (const slug of servedCitySlugs) assert.ok(isCitySlug(slug), `${slug} is not in the city registry`);
  assert.equal(new Set(servedCitySlugs).size, servedCitySlugs.length);
});

test("the served list never exceeds the city registry and always includes Nagpur", () => {
  assert.ok(servedCitySlugs.length <= Object.keys(cities).length);
  // SUNKOOL's own corporate office is in Nagpur (src/lib/contact.ts).
  assert.ok((servedCitySlugs as readonly string[]).includes("nagpur"));
});
