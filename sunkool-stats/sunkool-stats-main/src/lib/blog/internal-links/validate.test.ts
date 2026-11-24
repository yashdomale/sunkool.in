import { test } from "node:test";
import assert from "node:assert/strict";
import { findLinkIssues, newLinkIssues, type LinkCheckContext } from "./validate";
import { getSitePaths } from "./site-pages";
import { docJson, linked, para } from "./test-helpers";

const context: LinkCheckContext = {
  selfId: "me",
  selfSlug: "my-post",
  sitePaths: getSitePaths(),
  posts: new Map([
    ["my-post", { id: "me", status: "published" }],
    ["other-post", { id: "o1", status: "published" }],
    ["wip-post", { id: "o2", status: "draft" }],
  ]),
};
const doc = (...hrefs: string[]) => docJson(para(...hrefs.map((href, i) => linked(`link ${i}`, href))));
const problems = (...hrefs: string[]) => findLinkIssues(doc(...hrefs), context).map((issue) => `${issue.problem}:${issue.path}`);

test("accepts links to real pages and published posts", () => {
  assert.deepEqual(problems("/ppf", "/window-film", "/pune", "/videos/ppf", "/blog", "/", "/blog/other-post"), []);
  assert.deepEqual(problems("https://www.sunkool.in/ppf/", "/ppf?utm=x#top"), []);
});

test("ignores links that leave the site", () => {
  assert.deepEqual(problems("https://example.com/blog/nope", "mailto:a@b.co", "tel:+911234", "#top"), []);
});

test("flags a link to the post itself, by slug or by id, in any spelling", () => {
  assert.deepEqual(problems("/blog/my-post"), ["self:/blog/my-post"]);
  assert.deepEqual(problems("https://www.sunkool.in/blog/my-post/"), ["self:/blog/my-post"]);
  assert.deepEqual(findLinkIssues(doc("/blog/renamed"), { ...context, selfSlug: "new-slug", posts: new Map([["renamed", { id: "me", status: "published" }]]) }).map((i) => i.problem), ["self"]);
});

test("a brand-new post can't link to its own future URL either", () => {
  const issues = findLinkIssues(doc("/blog/fresh"), { ...context, selfId: undefined, selfSlug: "fresh", posts: new Map() });
  assert.deepEqual(issues.map((i) => i.problem), ["self"]);
});

test("flags broken URLs: unknown pages, unknown posts, and legacy redirect paths", () => {
  assert.deepEqual(problems("/nope", "/blog/does-not-exist", "/blog/a/b", "/paint-protection-film", "/blog/categories/ppf"), [
    "missing:/nope",
    "missing:/blog/does-not-exist",
    "missing:/blog/a/b",
    "missing:/paint-protection-film",
    "missing:/blog/categories/ppf",
  ]);
});

test("flags links to drafts", () => {
  assert.deepEqual(problems("/blog/wip-post"), ["draft:/blog/wip-post"]);
});

test("only problems a save would add are reported, so existing posts stay saveable", () => {
  const before = findLinkIssues(doc("/legacy-broken"), context);
  const unchanged = findLinkIssues(doc("/legacy-broken"), context);
  assert.deepEqual(newLinkIssues(before, unchanged), []);

  const worse = findLinkIssues(doc("/legacy-broken", "/also-broken", "/blog/my-post"), context);
  assert.deepEqual(newLinkIssues(before, worse).map((i) => i.path), ["/also-broken", "/blog/my-post"]);
});

test("link marks with no href are not reported", () => {
  const withBare = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "x", marks: [{ type: "link" }] }] }] };
  assert.deepEqual(findLinkIssues(withBare, context), []);
});
