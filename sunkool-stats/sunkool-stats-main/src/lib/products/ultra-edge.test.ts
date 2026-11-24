// The UltraEDGE catalogue must match the SUNKOOL UltraEDGE shade card exactly. If a figure here
// changes, it is because a new card was printed: update both sides together.
import { test } from "node:test";
import assert from "node:assert/strict";
import { ULTRA_EDGE } from "./ultra-edge";

// series slug -> [name, VLT, IR, UV, TSER]. The card prints no warranty for any film.
const CARD: Record<string, [string, number, number, number, number][]> = {
  ultra: [
    ["Ultra Max", 75, 96, 99, 60],
    ["Ultra 70", 70, 95, 99, 54],
    ["Ultra 50", 50, 99, 99, 75],
  ],
  edge: [
    ["Edge Max", 70, 97, 99, 61],
    ["Edge 70", 70, 99, 99, 60],
    ["Edge 50", 50, 99, 99, 74],
  ],
  prism: [
    ["Prism 90", 88, 97, 99, 55],
    ["Prism 70", 70, 98, 99, 60],
    ["Prism 40", 40, 99, 99, 78],
  ],
  sunroof: [["Sunroof Protection Film", 70, 95, 99, 60]],
  moonroof: [["Moonroof Protection Film", 50, 99, 99, 74]],
};

test("the UltraEDGE series are the card's lines, in order", () => {
  assert.deepEqual(ULTRA_EDGE.series.map((s) => s.slug), Object.keys(CARD));
});

test("every film carries exactly the printed VLT, IR, UV and TSER", () => {
  for (const series of ULTRA_EDGE.series) {
    const actual = series.products.map((p) => [p.name, p.vlt, p.ir, p.uv, p.tser]);
    assert.deepEqual(actual, CARD[series.slug], series.name);
  }
});

test("no UltraEDGE film carries a warranty", () => {
  for (const series of ULTRA_EDGE.series) {
    for (const p of series.products) {
      assert.equal(p.warrantyMonths, undefined, p.name);
    }
  }
});

test("product slugs that existed before the card update are kept", () => {
  const slugs = new Set(ULTRA_EDGE.series.flatMap((s) => s.products.map((p) => p.slug)));
  for (const slug of ["ultra-70", "ultra-50", "edge-70", "edge-50", "prism", "sunroof", "moonroof"]) {
    assert.ok(slugs.has(slug), `${slug} is missing`);
  }
  assert.equal(slugs.size, ULTRA_EDGE.series.reduce((n, s) => n + s.products.length, 0), "slugs are unique");
});
