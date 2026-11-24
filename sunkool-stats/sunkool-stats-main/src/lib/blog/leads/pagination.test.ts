import { test } from "node:test";
import assert from "node:assert/strict";
import { pageWindow } from "./pagination";

test("a single page is just that page", () => {
  assert.deepEqual(pageWindow(1, 1), [1]);
});

test("short ranges show every page with no gaps", () => {
  assert.deepEqual(pageWindow(1, 3), [1, 2, 3]);
  assert.deepEqual(pageWindow(2, 4), [1, 2, 3, 4]);
  assert.deepEqual(pageWindow(4, 5), [1, 2, 3, 4, 5]);
});

test("long ranges collapse the middle into gaps", () => {
  assert.deepEqual(pageWindow(1, 10), [1, 2, null, 10]);
  assert.deepEqual(pageWindow(5, 10), [1, null, 4, 5, 6, null, 10]);
  assert.deepEqual(pageWindow(10, 10), [1, null, 9, 10]);
  assert.deepEqual(pageWindow(5, 5), [1, null, 4, 5]);
});

test("a gap that would hide only one page shows that page instead", () => {
  assert.deepEqual(pageWindow(4, 10), [1, 2, 3, 4, 5, null, 10]);
  assert.deepEqual(pageWindow(7, 10), [1, null, 6, 7, 8, 9, 10]);
});

test("a gap is only inserted where at least two pages are skipped", () => {
  assert.deepEqual(pageWindow(3, 10), [1, 2, 3, 4, null, 10]);
  assert.deepEqual(pageWindow(8, 10), [1, null, 7, 8, 9, 10]);
});

test("every page number is in range, unique and ascending", () => {
  for (let last = 1; last <= 30; last++) {
    for (let page = 1; page <= last; page++) {
      const numbers = pageWindow(page, last).filter((p): p is number => p !== null);
      assert.ok(numbers.includes(page) && numbers.includes(1) && numbers.includes(last), `${page}/${last}`);
      assert.deepEqual(numbers, [...new Set(numbers)].sort((a, b) => a - b));
      assert.ok(numbers.every((p) => p >= 1 && p <= last));
    }
  }
});
