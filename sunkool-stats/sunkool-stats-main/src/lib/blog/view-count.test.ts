import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldCountView } from "./view-count";

test("a published article counts a view by default", () => {
  assert.equal(shouldCountView({ status: "published" }, {}), true);
  assert.equal(shouldCountView({ status: "published" }, { SKIP_VIEW_COUNT: "" }), true);
  assert.equal(shouldCountView({ status: "published" }, { SKIP_VIEW_COUNT: "0" }), true);
});

test("SKIP_VIEW_COUNT=1 switches counting off, so verification runs leave the database alone", () => {
  assert.equal(shouldCountView({ status: "published" }, { SKIP_VIEW_COUNT: "1" }), false);
});

test("a draft never counts a view, whatever the switch says", () => {
  assert.equal(shouldCountView({ status: "draft" }, {}), false);
  assert.equal(shouldCountView({ status: "draft" }, { SKIP_VIEW_COUNT: "1" }), false);
});

test("it reads the real environment when none is passed", () => {
  const before = process.env.SKIP_VIEW_COUNT;
  try {
    delete process.env.SKIP_VIEW_COUNT;
    assert.equal(shouldCountView({ status: "published" }), true);
    process.env.SKIP_VIEW_COUNT = "1";
    assert.equal(shouldCountView({ status: "published" }), false);
  } finally {
    if (before === undefined) delete process.env.SKIP_VIEW_COUNT;
    else process.env.SKIP_VIEW_COUNT = before;
  }
});
