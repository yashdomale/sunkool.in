import { test } from "node:test";
import assert from "node:assert/strict";
import { articleMetaDescription, restatesTitle } from "./meta-description";

const TITLE = "Is Window Film Legal on Your Car in India? Here's What the Law Actually Says";
const EXCERPT =
  "Safety Glazing is basically a plastic layer that meets a specific Indian Standard, IS 2553 Part 2, first revision, 2019.";

const post = (overrides: Partial<Parameters<typeof articleMetaDescription>[0]>) => ({
  title: TITLE,
  metaTitle: null,
  metaDescription: null,
  excerpt: EXCERPT,
  ...overrides,
});

test("a meta description that is the start of the title gives way to the excerpt (as published on production)", () => {
  // Exactly what production had: the first sentence of the title, with a trailing space.
  const description = articleMetaDescription(post({ metaDescription: "Is Window Film Legal on Your Car in India? " }));
  assert.equal(description, EXCERPT);
});

test("a meta description that is the whole title, or the title plus a brand, gives way to the excerpt", () => {
  assert.equal(articleMetaDescription(post({ metaDescription: TITLE })), EXCERPT);
  assert.equal(articleMetaDescription(post({ metaDescription: `${TITLE} | SUNKOOL` })), EXCERPT);
  assert.equal(articleMetaDescription(post({ metaDescription: "  IS WINDOW FILM LEGAL on your car in India  " })), EXCERPT);
});

test("it also compares against the SEO title when the article has one", () => {
  const description = articleMetaDescription(
    post({ metaTitle: "Window Tint Legality in India", metaDescription: "Window tint legality in India." })
  );
  assert.equal(description, EXCERPT);
});

test("an editor's real description is used exactly as written", () => {
  const own = "Is car window film legal in India? The VLT limits, what safety glazing means and how to choose a compliant film. ";
  assert.equal(articleMetaDescription(post({ metaDescription: own })), own);
});

test("a description that merely starts with the title's words but goes on to say more is kept", () => {
  const own = "Is window film legal on your car in India? Yes, within the VLT limits set under the Central Motor Vehicles Rules.";
  assert.equal(articleMetaDescription(post({ metaDescription: own })), own);
});

test("an empty or missing meta description still falls back to the excerpt, as before", () => {
  assert.equal(articleMetaDescription(post({ metaDescription: null })), EXCERPT);
  assert.equal(articleMetaDescription(post({ metaDescription: "" })), EXCERPT);
});

test("restatesTitle ignores case, punctuation and spacing, and does not mistake unrelated text for a restatement", () => {
  assert.equal(restatesTitle("is window film legal on your car in india", TITLE), true);
  assert.equal(restatesTitle("Best ceramic window film for Indian summers.", TITLE), false);
  assert.equal(restatesTitle("Anything at all", ""), false, "with no title there is nothing to restate");
});
