// Dates are shown in India time whatever zone the server or browser runs in.
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatLongDate, formatMonthYear, formatShortDate, formatTime } from "./format-date";

// 14 Oct 2026, 19:00 UTC = 15 Oct 2026, 00:30 in India.
const lateEvening = "2026-10-14T19:00:00Z";

test("a timestamp after 18:30 UTC shows the next day, as it is in India", () => {
  assert.equal(formatShortDate(lateEvening), "15 Oct 2026");
  assert.equal(formatLongDate(lateEvening), "15 October 2026");
  assert.equal(formatTime(lateEvening), "12:30 am");
});

test("month boundaries follow India time too", () => {
  // 31 Oct 2026, 20:00 UTC = 1 Nov 2026 in India.
  assert.equal(formatMonthYear("2026-10-31T20:00:00Z"), "Nov 2026");
});

test("accepts a string, a timestamp or a Date", () => {
  const d = new Date("2026-01-05T06:00:00Z");
  assert.equal(formatShortDate(d), "5 Jan 2026");
  assert.equal(formatShortDate(d.getTime()), "5 Jan 2026");
  assert.equal(formatShortDate(d.toISOString()), "5 Jan 2026");
});
