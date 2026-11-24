// Runs the whole pipeline over the 13 real articles bundled in seed-data.json,
// which is the messiest content available offline: imported keywords like
// "car" and "windw film", link marks with no href, existing internal links.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { generateHTML } from "@tiptap/html/server";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";
import { getTiptapExtensions } from "@/lib/blog/tiptap-extensions";
import { addSuggestedLinks } from "./apply";
import { collectSitePaths } from "./doc-links";
import { getSitePageDestinations, getSitePaths } from "./site-pages";
import { schema } from "./test-helpers";
import { suggestInternalLinks } from "./suggest";
import type { LinkDestination } from "./types";
import { findLinkIssues } from "./validate";

type SeedPost = { id: string; slug: string; title: string; excerpt: string; keywords: string[]; category: { name: string } | null; content: unknown };
const seed = JSON.parse(readFileSync(new URL("../seed-data.json", import.meta.url), "utf8")) as { posts: SeedPost[] };

const postDestinations: LinkDestination[] = seed.posts.map((p) => ({
  kind: "post",
  href: `/blog/${p.slug}`,
  title: p.title,
  description: p.excerpt,
  keywords: p.keywords ?? [],
  status: "published",
  id: p.id,
  group: p.category?.name ?? "Uncategorized",
}));
const destinations = [...getSitePageDestinations(), ...postDestinations];
const known = new Set(destinations.map((d) => d.href));

test("the seed articles load, and their existing internal links are all valid", () => {
  const posts = new Map(seed.posts.map((p) => [p.slug, { id: p.id, status: "published" as const }]));
  for (const p of seed.posts) {
    assert.doesNotThrow(() => ProseMirrorNode.fromJSON(schema, p.content), p.slug);
    const issues = findLinkIssues(p.content, { selfId: p.id, selfSlug: p.slug, sitePaths: getSitePaths(), posts });
    assert.deepEqual(issues, [], `${p.slug} would be blocked from saving`);
  }
});

test("suggestions for every seed article are well-formed, unique and safe to apply", () => {
  let total = 0;
  for (const p of seed.posts) {
    const doc = ProseMirrorNode.fromJSON(schema, p.content);
    const suggestions = suggestInternalLinks(doc, destinations, { id: p.id, slug: p.slug });
    const alreadyLinked = new Set(collectSitePaths(p.content));
    total += suggestions.length;

    const seenHrefs = new Set<string>();
    const seenAnchors = new Set<string>();
    const perParagraph = new Map<unknown, number>();
    for (const s of suggestions) {
      const where = `${p.slug}: "${s.anchor}" -> ${s.destination.href}`;
      assert.equal(doc.textBetween(s.from, s.to), s.anchor, where);
      assert.ok(known.has(s.destination.href), `${where} is not a known page or post`);
      assert.notEqual(s.destination.href, `/blog/${p.slug}`, `${where} links the post to itself`);
      assert.ok(!alreadyLinked.has(s.destination.href), `${where} is already linked from this post`);
      assert.ok(!seenHrefs.has(s.destination.href), `${where} repeats a destination`);
      assert.ok(!seenAnchors.has(s.anchor.toLowerCase()), `${where} repeats an anchor`);
      assert.ok(!doc.rangeHasMark(s.from, s.to, schema.marks.link), `${where} sits on existing link text`);
      assert.ok(!doc.rangeHasMark(s.from, s.to, schema.marks.code), `${where} sits on code`);
      assert.notEqual(doc.resolve(s.from).parent.type.name, "heading", `${where} is in a heading`);
      seenHrefs.add(s.destination.href);
      seenAnchors.add(s.anchor.toLowerCase());
      const parent = doc.resolve(s.from).parent;
      perParagraph.set(parent, (perParagraph.get(parent) ?? 0) + 1);
    }
    assert.ok(suggestions.length <= 10, `${p.slug}: too many suggestions`);
    for (const count of perParagraph.values()) assert.ok(count <= 2, `${p.slug}: too many links in one paragraph`);
    for (const [i, a] of suggestions.entries()) for (const b of suggestions.slice(i + 1)) assert.ok(a.to <= b.from, `${p.slug}: overlapping suggestions`);

    // Approve everything: nothing is skipped, text is unchanged, the result renders, and a rescan is quiet.
    const tr = EditorState.create({ doc, schema }).tr;
    const { applied, skipped } = addSuggestedLinks(tr, suggestions);
    assert.equal(skipped.length, 0, `${p.slug}: ${JSON.stringify(skipped.map((s) => s.reason))}`);
    assert.equal(applied.length, suggestions.length);
    assert.equal(tr.doc.textContent, doc.textContent, `${p.slug}: text changed`);

    const html = generateHTML(tr.doc.toJSON(), getTiptapExtensions());
    const before = (generateHTML(p.content as Record<string, unknown>, getTiptapExtensions()).match(/<a[\s>]/g) ?? []).length;
    assert.equal((html.match(/<a[\s>]/g) ?? []).length, before + applied.length, `${p.slug}: unexpected number of links in the HTML`);

    const rescanned = suggestInternalLinks(tr.doc, destinations, { id: p.id, slug: p.slug });
    for (const s of applied) assert.ok(!rescanned.some((r) => r.destination.href === s.destination.href), `${p.slug}: rescan re-suggests ${s.destination.href}`);

    // Everything we added passes the same check the server runs on save.
    const posts = new Map(seed.posts.map((x) => [x.slug, { id: x.id, status: "published" as const }]));
    const issues = findLinkIssues(tr.doc.toJSON(), { selfId: p.id, selfSlug: p.slug, sitePaths: getSitePaths(), posts });
    assert.deepEqual(issues, [], `${p.slug}: applied links fail validation`);
  }
  assert.ok(total > 5, "expected the real articles to produce some suggestions");
});

test("existing links in the seed articles are never proposed again", () => {
  const heat = seed.posts.find((p) => p.slug === "how-much-heat-does-ceramic-window-film-block")!;
  assert.ok(collectSitePaths(heat.content).includes("/compare"));
  const doc = ProseMirrorNode.fromJSON(schema, heat.content);
  const hrefs = suggestInternalLinks(doc, destinations, { id: heat.id, slug: heat.slug }, { limit: 50, perParagraph: 50 }).map((s) => s.destination.href);
  for (const existing of collectSitePaths(heat.content)) assert.ok(!hrefs.includes(existing), existing);
});
