import { test } from "node:test";
import assert from "node:assert/strict";
import { isFreshUpdate, newestOf, NEW_UPDATE_WINDOW_DAYS } from "./latest-update";

const NOW = Date.parse("2026-10-29T12:00:00Z");
const daysAgo = (days: number) => new Date(NOW - days * 24 * 60 * 60 * 1000).toISOString();

test("a post published a moment ago is new", () => {
  assert.equal(isFreshUpdate(daysAgo(0), NOW), true);
});

test("a post stays new until the window ends, then stops", () => {
  assert.equal(isFreshUpdate(daysAgo(NEW_UPDATE_WINDOW_DAYS - 0.01), NOW), true);
  assert.equal(isFreshUpdate(daysAgo(NEW_UPDATE_WINDOW_DAYS), NOW), false);
  assert.equal(isFreshUpdate(daysAgo(60), NOW), false);
});

test("no published post, or an unreadable timestamp, is never new", () => {
  assert.equal(isFreshUpdate(null, NOW), false);
  assert.equal(isFreshUpdate(undefined, NOW), false);
  assert.equal(isFreshUpdate("", NOW), false);
  assert.equal(isFreshUpdate("not a date", NOW), false);
});

test("newestOf picks the later instant even when the two are formatted differently", () => {
  const postgres = "2026-10-29T08:00:00.123456+00:00";
  const js = "2026-10-29T08:00:01.000Z";
  assert.equal(newestOf(postgres, js), js);
  assert.equal(newestOf(js, postgres), js);
  assert.equal(newestOf("2026-10-29T08:00:00+00:00", "2026-10-29T13:30:00+05:30"), "2026-10-29T08:00:00+00:00");
});

test("newestOf falls back to whichever timestamp is usable", () => {
  assert.equal(newestOf(null, "2026-10-29T08:00:00Z"), "2026-10-29T08:00:00Z");
  assert.equal(newestOf("2026-10-29T08:00:00Z", undefined), "2026-10-29T08:00:00Z");
  assert.equal(newestOf("garbage", "2026-10-29T08:00:00Z"), "2026-10-29T08:00:00Z");
  assert.equal(newestOf(null, null), null);
});

test("a timestamp a little in the future (clock skew) still counts as new", () => {
  assert.equal(isFreshUpdate(daysAgo(-0.01), NOW), true);
});
