import { test } from "node:test";
import assert from "node:assert/strict";
import { EDGE_MARGIN, fractionFromPoint, nudge, panelPlacement, pointFromFraction } from "./placement";

const SIZE = 64;
const VW = 1440;
const VH = 900;

test("the corners of the screen map to the edges, with a margin", () => {
  assert.deepEqual(pointFromFraction({ fx: 0, fy: 0 }, VW, VH, SIZE), { left: EDGE_MARGIN, top: EDGE_MARGIN });
  assert.deepEqual(pointFromFraction({ fx: 1, fy: 1 }, VW, VH, SIZE), { left: VW - SIZE - EDGE_MARGIN, top: VH - SIZE - EDGE_MARGIN });
});

test("a position is turned into pixels and back without drifting", () => {
  for (const f of [{ fx: 0.25, fy: 0.75 }, { fx: 0.5, fy: 0.5 }, { fx: 0.99, fy: 0.01 }]) {
    const back = fractionFromPoint(pointFromFraction(f, VW, VH, SIZE), VW, VH, SIZE);
    assert.ok(Math.abs(back.fx - f.fx) < 1e-9 && Math.abs(back.fy - f.fy) < 1e-9, JSON.stringify({ f, back }));
  }
});

test("dragging past an edge stops at the edge: the button can never leave the screen", () => {
  const off = fractionFromPoint({ left: -500, top: 5000 }, VW, VH, SIZE);
  assert.deepEqual(off, { fx: 0, fy: 1 });
  const point = pointFromFraction(off, VW, VH, SIZE);
  assert.ok(point.left >= 0 && point.top + SIZE <= VH);
  // Out-of-range stored values (hand-edited storage) are clamped too.
  assert.deepEqual(pointFromFraction({ fx: -3, fy: 9 }, VW, VH, SIZE), { left: EDGE_MARGIN, top: VH - SIZE - EDGE_MARGIN });
});

test("a saved position stays in the same relative spot when the window is resized", () => {
  const f = { fx: 0.8, fy: 0.9 };
  const big = pointFromFraction(f, 1440, 900, SIZE);
  const small = pointFromFraction(f, 800, 600, SIZE);
  assert.ok(small.left < big.left && small.top < big.top);
  assert.ok(small.left + SIZE <= 800 && small.top + SIZE <= 600, "and still on the smaller screen");
});

test("a screen too small for the button does not produce NaN or negative room", () => {
  const f = fractionFromPoint({ left: 10, top: 10 }, 60, 60, SIZE);
  assert.deepEqual(f, { fx: 0, fy: 0 });
  const p = pointFromFraction({ fx: 1, fy: 1 }, 60, 60, SIZE);
  assert.ok(Number.isFinite(p.left) && Number.isFinite(p.top));
});

test("arrow-key nudges move by the step and stop at the edge", () => {
  const start = { fx: 0.5, fy: 0.5 };
  const p0 = pointFromFraction(start, VW, VH, SIZE);
  const p1 = pointFromFraction(nudge(start, 16, -16, VW, VH, SIZE), VW, VH, SIZE);
  assert.ok(Math.abs(p1.left - p0.left - 16) < 1e-6 && Math.abs(p1.top - p0.top + 16) < 1e-6);
  assert.deepEqual(nudge({ fx: 1, fy: 0 }, 500, -500, VW, VH, SIZE), { fx: 1, fy: 0 });
});

const within = (box: { left: number; top: number; width: number; height: number }, vw: number, vh: number) =>
  box.left >= 0 && box.top >= 0 && box.left + box.width <= vw && box.top + box.height <= vh;

test("a button in the lower right opens its window above it, lined up with its right edge", () => {
  const button = { left: 1344, top: 724 };
  const p = panelPlacement(button, SIZE, VW, VH);
  assert.equal(p.origin, "bottom right");
  assert.equal(p.left + p.width, button.left + SIZE, "right edges line up");
  assert.equal(p.top + p.height, button.top - 12, "12px above the button");
  assert.ok(within(p, VW, VH));
  assert.equal(p.width, 380);
});

test("a button high on the screen opens its window below it", () => {
  const button = { left: 700, top: 20 };
  const p = panelPlacement(button, SIZE, VW, VH);
  assert.equal(p.top, button.top + SIZE + 12);
  assert.ok(p.origin.startsWith("top"));
  assert.ok(within(p, VW, VH));
});

test("a button on the left half opens its window from its left edge", () => {
  const button = { left: 40, top: 500 };
  const p = panelPlacement(button, SIZE, VW, VH);
  assert.equal(p.left, button.left);
  assert.ok(p.origin.endsWith("left"));
  assert.ok(within(p, VW, VH));
});

test("the window never leaves the screen, wherever the button is", () => {
  for (const [vw, vh] of [[1440, 900], [1280, 650], [1024, 700], [700, 600], [640, 480]]) {
    for (let fx = 0; fx <= 1; fx += 0.25) {
      for (let fy = 0; fy <= 1; fy += 0.25) {
        const button = pointFromFraction({ fx, fy }, vw, vh, SIZE);
        const p = panelPlacement(button, SIZE, vw, vh);
        assert.ok(within(p, vw, vh), JSON.stringify({ vw, vh, fx, fy, p }));
        assert.ok(p.height >= 200 || vh < 480, `usable height ${p.height} at ${vw}x${vh} ${fx},${fy}`);
      }
    }
  }
});

test("where there is room beside the button the window does not cover it", () => {
  const button = { left: 1344, top: 724 };
  const p = panelPlacement(button, SIZE, VW, VH);
  const overlaps = p.left < button.left + SIZE && p.left + p.width > button.left && p.top < button.top + SIZE && p.top + p.height > button.top;
  assert.equal(overlaps, false);
});

test("the window is at most 500px tall and shrinks to the room that is left", () => {
  assert.equal(panelPlacement({ left: 1344, top: 1500 }, SIZE, VW, 2000).height, 500);
  const tight = panelPlacement({ left: 1344, top: 400 }, SIZE, VW, 650);
  assert.ok(tight.height < 500 && tight.height > 0);
});

test("a button near the bottom gets a full-size window above it", () => {
  const p = panelPlacement({ left: 1368, top: 828 }, SIZE, VW, 900);
  assert.equal(p.height, 500);
  assert.equal(p.top + p.height, 828 - 12);
});

test("on a very short screen the window takes the full height rather than a sliver", () => {
  const p = panelPlacement({ left: 700, top: 150 }, SIZE, VW, 360);
  assert.equal(p.top, 16);
  assert.equal(p.height, 360 - 32);
});

test("on a narrow screen the window is as wide as the screen allows, and never over 380px", () => {
  const narrow = panelPlacement({ left: 300, top: 400 }, SIZE, 390, 800);
  assert.equal(narrow.width, 390 - 32);
  assert.ok(within(narrow, 390, 800));
  assert.equal(panelPlacement({ left: 400, top: 400 }, SIZE, 480, 800).width, 380);
});
