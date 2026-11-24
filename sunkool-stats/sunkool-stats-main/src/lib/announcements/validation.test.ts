import { test } from "node:test";
import assert from "node:assert/strict";
import { announcementFormSchema, resolvePublishedAt } from "./validation";

const NOW = "2026-10-29T12:00:00.000Z";
const EARLIER = "2026-10-01T09:30:00.000Z";

test("a title is required and surrounding whitespace is trimmed", () => {
  assert.equal(announcementFormSchema.safeParse({ title: "   ", body: "", published: true }).success, false);
  const parsed = announcementFormSchema.parse({ title: "  New store  ", body: "  Now open.  ", published: true });
  assert.deepEqual(parsed, { title: "New store", body: "Now open.", published: true });
});

test("the message may be empty but not longer than 1000 characters", () => {
  assert.equal(announcementFormSchema.safeParse({ title: "Hi", body: "", published: false }).success, true);
  assert.equal(announcementFormSchema.safeParse({ title: "Hi", body: "x".repeat(1001), published: false }).success, false);
  assert.equal(announcementFormSchema.safeParse({ title: "x".repeat(121), body: "", published: false }).success, false);
});

test("a first publish is dated now", () => {
  assert.equal(resolvePublishedAt(null, true, NOW), NOW);
  assert.equal(resolvePublishedAt({ published: false, publishedAt: null }, true, NOW), NOW);
});

test("editing something already live keeps its original publish date", () => {
  assert.equal(resolvePublishedAt({ published: true, publishedAt: EARLIER }, true, NOW), EARLIER);
});

test("hiding clears the date, and publishing again restarts it", () => {
  assert.equal(resolvePublishedAt({ published: true, publishedAt: EARLIER }, false, NOW), null);
  assert.equal(resolvePublishedAt({ published: false, publishedAt: null }, false, NOW), null);
  assert.equal(resolvePublishedAt({ published: false, publishedAt: null }, true, NOW), NOW);
});
