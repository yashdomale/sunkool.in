import { test } from "node:test";
import assert from "node:assert/strict";
import { TimeoutError, withTimeout } from "./with-timeout";

const later = <T>(value: T, ms: number) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

test("resolves with the value when the promise settles in time", async () => {
  assert.equal(await withTimeout(later("done", 5), 200), "done");
});

test("passes through the promise's own rejection", async () => {
  const failing = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("boom")), 5));
  await assert.rejects(withTimeout(failing, 200), { message: "boom" });
});

test("rejects with a TimeoutError when the promise never settles in time", async () => {
  await assert.rejects(withTimeout(new Promise(() => {}), 20), (error) => error instanceof TimeoutError);
});

test("ignores a result that arrives after the timeout", async () => {
  const slow = later("late", 60);
  await assert.rejects(withTimeout(slow, 10), TimeoutError);
  // The slow promise still settles later without causing an unhandled rejection or a second settle.
  assert.equal(await slow, "late");
});
