import { test } from "node:test";
import assert from "node:assert/strict";
import { rankDestinations } from "./rank";
import { getSitePageDestinations } from "./site-pages";
import { post } from "./test-helpers";

const pages = getSitePageDestinations();
const posts = [
  post("Is Window Film Legal on Your Car in India?", "is-window-film-legal", { description: "What the law says about tint darkness." }),
  post("Car Window Film Myths vs Facts", "window-film-myths", { keywords: ["myth", "fact"] }),
  post("10 Best PPF Brands in India 2026", "best-ppf-brands"),
];
const all = [...pages, ...posts];
const top = (query: string, n = 1) => rankDestinations(query, all).slice(0, n).map((d) => d.href);

test("selecting 'Window Film' puts the Window Film page first, then related posts", () => {
  const ranked = rankDestinations("Window Film", all).map((d) => d.href);
  assert.equal(ranked[0], "/window-film");
  assert.ok(ranked.includes("/blog/is-window-film-legal") && ranked.includes("/blog/window-film-myths"));
  assert.ok(!ranked.includes("/blog/best-ppf-brands"), "unrelated posts are filtered out");
});

test("matches a post by a word from its title, description or URL", () => {
  assert.deepEqual(top("legal"), ["/blog/is-window-film-legal"]);
  assert.equal(top("darkness")[0], "/blog/is-window-film-legal");
  assert.equal(top("best-ppf")[0], "/blog/best-ppf-brands");
});

test("finds pages by keyword and by a city name", () => {
  assert.equal(top("ppf")[0], "/ppf");
  assert.equal(top("warranty check")[0], "/warranty");
  assert.equal(top("nagpur")[0], "/nagpur");
});

test("requires every word typed to be present", () => {
  assert.deepEqual(rankDestinations("zzzz window", all), []);
  assert.ok(rankDestinations("film legal", all).some((d) => d.href === "/blog/is-window-film-legal"));
});

test("an empty query returns everything in the given order", () => {
  assert.equal(rankDestinations("  ", all), all);
});
