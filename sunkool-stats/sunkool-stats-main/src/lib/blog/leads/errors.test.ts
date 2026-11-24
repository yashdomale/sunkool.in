import { test } from "node:test";
import assert from "node:assert/strict";
import { BlogLeadsError, isBlogLeadsNotSetUp, toBlogLeadsError } from "./errors";

// The shapes below are what PostgREST really returns (captured from a live PostgREST 16).
const missingFunction = {
  code: "PGRST202",
  details: "Searched for the function public.blog_lead_stats without parameters or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache.",
  hint: null,
  message: "Could not find the function public.blog_lead_stats without parameters in the schema cache",
};
const missingTable = {
  code: "PGRST205",
  details: null,
  hint: null,
  message: "Could not find the table 'public.blog_leads' in the schema cache",
};

test("a PostgREST error object becomes a real Error with a readable message and its code", () => {
  const error = toBlogLeadsError(missingTable);
  assert.ok(error instanceof Error);
  assert.equal(error.code, "PGRST205");
  assert.equal(error.message, "Could not find the table 'public.blog_leads' in the schema cache (PGRST205)");
});

test("odd inputs still produce a usable Error", () => {
  assert.equal(toBlogLeadsError(null).message, "Unknown database error");
  assert.equal(toBlogLeadsError({}).message, "Unknown database error");
  assert.equal(toBlogLeadsError({ message: "boom" }).message, "boom");
  assert.equal(toBlogLeadsError({ message: "boom" }).code, undefined);
});

test("an error that is already ours is returned unchanged", () => {
  const original = new BlogLeadsError("x", "42P01");
  assert.equal(toBlogLeadsError(original), original);
});

test("recognises a database where the migrations have not been applied — before and after wrapping", () => {
  for (const error of [missingFunction, missingTable, { code: "42P01" }, { code: "42883" }, { code: "42501" }]) {
    assert.equal(isBlogLeadsNotSetUp(error), true, JSON.stringify(error));
    assert.equal(isBlogLeadsNotSetUp(toBlogLeadsError(error)), true, "still recognised once wrapped");
  }
});

test("other failures are not mistaken for a missing setup", () => {
  for (const error of [{ code: "PGRST103" }, { code: "XX000" }, { message: "boom" }, new Error("x"), null, undefined, "PGRST202"]) {
    assert.equal(isBlogLeadsNotSetUp(error), false, String(JSON.stringify(error)));
  }
});
