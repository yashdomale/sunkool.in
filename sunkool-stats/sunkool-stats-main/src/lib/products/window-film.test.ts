// The window film catalogue must match the SUNKOOL shade cards exactly (2026 "sunkool shade
// card" and "Signature shade card"). If a figure here changes, it is because a new card was
// printed: update both sides together.
import { test } from "node:test";
import assert from "node:assert/strict";
import { WINDOW_FILM } from "./window-film";

// series slug -> [name, VLT, IR, UV, TSER, warranty months or undefined]
const CARD: Record<string, [string, number, number, number, number, number?][]> = {
  legend: [
    ["HD 70", 70, 95, 99, 58],
    ["SK 70", 70, 93, 99, 55],
  ],
  elite: [
    ["CH 70", 70, 93, 99, 55],
    ["GY 70", 70, 93, 99, 55],
  ],
  "sk-series": [
    ["SK 50", 45, 95, 99, 71],
    ["SK 35", 35, 93, 99, 75],
  ],
  "sunroof-special": [
    ["Moonroof Heat Control Glazing", 45, 95, 99, 71, 36],
    ["Sunroof Protection Film", 70, 92, 99, 60, 36],
  ],
  signature: [
    ["Sapphire", 70, 99, 99, 60],
    ["Emerald", 70, 92, 99, 55],
    ["Onyx", 50, 99, 99, 74],
    ["Graphite", 35, 99, 99, 80],
    ["Topaz 70", 70, 97, 99, 61],
    ["Topaz 50", 50, 99, 99, 75],
    ["Diamond 90", 88, 97, 99, 55],
    ["Diamond 70", 70, 98, 99, 60],
    ["Diamond 40", 40, 99, 99, 78],
  ],
  "signature-sunroof": [
    ["Signature Moonroof Heat Control Glazing", 50, 99, 99, 74, 60],
    ["Signature Sunroof Protection Film", 70, 95, 99, 60, 60],
  ],
};

test("the window film series are the shade cards' series, in card order", () => {
  assert.deepEqual(WINDOW_FILM.series.map((s) => s.slug), Object.keys(CARD));
});

test("every film carries exactly the printed VLT, IR, UV and TSER, and the printed warranty", () => {
  for (const series of WINDOW_FILM.series) {
    const actual = series.products.map((p) => [p.name, p.vlt, p.ir, p.uv, p.tser, p.warrantyMonths]);
    const expected = CARD[series.slug].map(([n, vlt, ir, uv, tser, w]) => [n, vlt, ir, uv, tser, w]);
    assert.deepEqual(actual, expected, series.name);
  }
});

test("product slugs that existed before the shade card update are kept", () => {
  const slugs = new Set(WINDOW_FILM.series.flatMap((s) => s.products.map((p) => p.slug)));
  for (const slug of ["hd70", "sk70", "sk50", "moonroof-heat-control", "sunroof-protection", "sapphire", "onyx", "emerald", "diamond", "graphite"]) {
    assert.ok(slugs.has(slug), `${slug} is missing`);
  }
  assert.equal(slugs.size, WINDOW_FILM.series.reduce((n, s) => n + s.products.length, 0), "slugs are unique");
});

