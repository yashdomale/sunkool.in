import { test } from "node:test";
import assert from "node:assert/strict";
import { checkInternalLinks } from "./server";
import { docJson, linked, para } from "./test-helpers";

type Row = { id: string; slug: string; status: "draft" | "published" };

/** Just enough of the Supabase query builder for `from("posts").select(…).in("slug", […])`. */
function fakeDb(rows: Row[], failWith?: string) {
  const queries: string[][] = [];
  const db = {
    from: (table: string) => {
      assert.equal(table, "posts");
      return {
        select: () => ({
          in: async (column: string, slugs: string[]) => {
            assert.equal(column, "slug");
            queries.push(slugs);
            return failWith
              ? { data: null, error: { message: failWith } }
              : { data: rows.filter((row) => slugs.includes(row.slug)), error: null };
          },
        }),
      };
    },
  };
  return { db: db as unknown as Parameters<typeof checkInternalLinks>[0], queries };
}

const withLinks = (...hrefs: string[]) => docJson(para(...hrefs.map((href, i) => linked(`link ${i}`, href))));
const rows: Row[] = [
  { id: "o1", slug: "other-post", status: "published" },
  { id: "o2", slug: "wip-post", status: "draft" },
  { id: "me", slug: "my-post", status: "published" },
];
const base = { selfId: "me", selfSlug: "my-post", publishing: true };

test("lets a save through when every internal link is real", async () => {
  const { db } = fakeDb(rows);
  assert.equal(await checkInternalLinks(db, { ...base, next: withLinks("/ppf", "/blog/other-post", "https://example.com") }), null);
});

test("only looks up the posts it has to, and skips the query for page links", async () => {
  const { db, queries } = fakeDb(rows);
  await checkInternalLinks(db, { ...base, next: withLinks("/ppf", "/window-film") });
  assert.equal(queries.length, 0);

  await checkInternalLinks(db, { ...base, next: withLinks("/ppf", "/blog/other-post", "/blog/other-post/") });
  assert.deepEqual(queries, [["other-post"]]);
});

test("blocks broken, self and draft links with a message the editor can act on", async () => {
  const { db } = fakeDb(rows);
  const message = await checkInternalLinks(db, { ...base, next: withLinks("/nope", "/blog/my-post", "/blog/wip-post") });
  assert.match(message ?? "", /^Fix the internal links before saving:/);
  assert.match(message ?? "", /\/nope doesn't match any page or post/);
  assert.match(message ?? "", /\/blog\/my-post links to this post itself/);
  assert.match(message ?? "", /\/blog\/wip-post is a draft/);
});

test("a link to a draft is fine while the post is itself a draft", async () => {
  const { db } = fakeDb(rows);
  assert.equal(await checkInternalLinks(db, { ...base, publishing: false, next: withLinks("/blog/wip-post") }), null);
  // …but broken and self links never are.
  assert.notEqual(await checkInternalLinks(db, { ...base, publishing: false, next: withLinks("/nope") }), null);
  assert.notEqual(await checkInternalLinks(db, { ...base, publishing: false, next: withLinks("/blog/my-post") }), null);
});

test("an existing post's stale links don't stop it being saved, but new ones do", async () => {
  const { db } = fakeDb(rows);
  const stored = { status: "published" as const, content: withLinks("/legacy-broken") };
  assert.equal(await checkInternalLinks(db, { ...base, stored, next: withLinks("/legacy-broken", "/ppf") }), null);

  const message = await checkInternalLinks(db, { ...base, stored, next: withLinks("/legacy-broken", "/another-broken") });
  assert.match(message ?? "", /\/another-broken/);
  assert.doesNotMatch(message ?? "", /legacy-broken/);
});

test("a new post can't link to the URL it is about to get", async () => {
  const { db } = fakeDb(rows);
  const message = await checkInternalLinks(db, { selfSlug: "brand-new", publishing: true, next: withLinks("/blog/brand-new") });
  assert.match(message ?? "", /links to this post itself/);
});

test("summarises long lists instead of dumping them", async () => {
  const { db } = fakeDb(rows);
  const message = await checkInternalLinks(db, { ...base, next: withLinks("/a1", "/a2", "/a3", "/a4", "/a5") });
  assert.match(message ?? "", /\(and 2 more\)$/);
});

test("reports a failed lookup instead of silently allowing the save", async () => {
  const { db } = fakeDb(rows, "connection reset");
  const message = await checkInternalLinks(db, { ...base, next: withLinks("/blog/other-post") });
  assert.equal(message, "Couldn't check the post's internal links: connection reset");
});

// ── The baseline for "what's new" is what is LIVE, which only a published post has ────────────
test("publishing a stored draft that links to another draft is blocked, even if the content is unchanged", async () => {
  const { db } = fakeDb(rows);
  const content = withLinks("/blog/wip-post", "/nope");
  // Saved as a draft, the broken /nope still can't be saved, but the draft link can.
  assert.match((await checkInternalLinks(db, { ...base, publishing: false, next: content })) ?? "", /\/nope/);
  const draftOnly = withLinks("/blog/wip-post");
  assert.equal(await checkInternalLinks(db, { ...base, publishing: false, next: draftOnly, stored: { status: "draft", content: draftOnly } }), null);

  // Publishing that same, unchanged content must now fail: nothing about it was ever live.
  const message = await checkInternalLinks(db, { ...base, publishing: true, next: draftOnly, stored: { status: "draft", content: draftOnly } });
  assert.match(message ?? "", /\/blog\/wip-post is a draft/);
});

test("a draft's stale broken or self links are not 'already live', so they block publishing", async () => {
  const { db } = fakeDb(rows);
  const content = withLinks("/legacy-broken", "/blog/my-post");
  const message = await checkInternalLinks(db, { ...base, publishing: true, next: content, stored: { status: "draft", content } });
  assert.match(message ?? "", /\/legacy-broken/);
  assert.match(message ?? "", /links to this post itself/);
});

test("a published post keeps its already-live links when edited", async () => {
  const { db } = fakeDb(rows);
  const live = withLinks("/legacy-broken", "/blog/wip-post");
  // Same content, still published: nothing new, so it can be saved.
  assert.equal(await checkInternalLinks(db, { ...base, publishing: true, next: live, stored: { status: "published", content: live } }), null);
  // Adding one more bad link is still caught.
  const worse = withLinks("/legacy-broken", "/blog/wip-post", "/another-broken");
  assert.match((await checkInternalLinks(db, { ...base, publishing: true, next: worse, stored: { status: "published", content: live } })) ?? "", /\/another-broken/);
});

test("a post that doesn't exist yet has no baseline", async () => {
  const { db } = fakeDb(rows);
  const message = await checkInternalLinks(db, { ...base, publishing: true, next: withLinks("/nope"), stored: null });
  assert.match(message ?? "", /\/nope/);
});

test("only slug-shaped post URLs are looked up, so odd input can't reach the query", async () => {
  const { db, queries } = fakeDb(rows);
  const message = await checkInternalLinks(db, { ...base, next: withLinks('/blog/x","y', "/blog/a(b)", "/blog/UPPER", "/blog/other-post") });
  assert.deepEqual(queries, [["other-post"]], "only the well-formed slug is sent to the database");
  assert.match(message ?? "", /\/blog\/UPPER doesn't match/);
  assert.match(message ?? "", /doesn't match any page or post/);
});
