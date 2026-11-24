// Runs the REAL server actions in blogs/actions.ts against an in-memory fake of the Supabase
// client, so the auth gate and the link checks on save/publish are exercised end to end
// without any network or database. Needs --experimental-test-module-mocks (set in `npm test`).
import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
import type { PostFormValues } from "@/lib/blog/validation";
import { docJson, linked, para } from "./test-helpers";

type Row = Record<string, unknown> & { id: string; slug: string; status: "draft" | "published"; content: unknown };
type World = { user: { id: string } | null; admins: Set<string>; posts: Row[]; revalidated: string[]; expiredTags: string[] };

const world: World = { user: null, admins: new Set(), posts: [], revalidated: [], expiredTags: [] };

/** The slice of the Supabase query builder the actions use, over `world`. */
function fakeClient() {
  return {
    auth: { getUser: async () => ({ data: { user: world.user } }) },
    from(table: "posts" | "admins") {
      const filters: ((row: Record<string, unknown>) => boolean)[] = [];
      let op: "select" | "update" | "insert" | "delete" = "select";
      let payload: Record<string, unknown> = {};
      const rows = () => (table === "admins" ? [...world.admins].map((id) => ({ id })) : world.posts);
      const run = () => {
        if (op === "insert") {
          const row = { id: `new-${world.posts.length + 1}`, ...payload } as Row;
          if (world.posts.some((p) => p.slug === row.slug)) return { data: [], error: { code: "23505", message: "duplicate" } };
          world.posts.push(row);
          return { data: [row], error: null };
        }
        const matched = rows().filter((row) => filters.every((f) => f(row)));
        if (op === "update") matched.forEach((row) => Object.assign(row, payload));
        if (op === "delete") world.posts = world.posts.filter((p) => !matched.includes(p));
        return { data: matched, error: null };
      };
      const builder = {
        select: () => builder,
        update: (p: Record<string, unknown>) => ((op = "update"), (payload = p), builder),
        insert: (p: Record<string, unknown>) => ((op = "insert"), (payload = p), builder),
        delete: () => ((op = "delete"), builder),
        eq: (col: string, value: unknown) => (filters.push((r) => r[col] === value), builder),
        in: (col: string, values: unknown[]) => (filters.push((r) => values.includes(r[col])), builder),
        maybeSingle: async () => ({ data: run().data[0] ?? null, error: null }),
        single: async () => {
          const { data, error } = run();
          return data[0] ? { data: data[0], error } : { data: null, error: error ?? { message: "no rows" } };
        },
        then: (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) => Promise.resolve(run()).then(resolve, reject),
      };
      return builder;
    },
  };
}

// Node 24's mock.module takes `exports` (`namedExports` is deprecated there), but this project's
// @types/node 20 predates it, so the options are passed through a cast.
const mockModule = (specifier: string, exports: Record<string, unknown>) => mock.module(specifier, { exports } as never);
mockModule(new URL("../../supabase/server.ts", import.meta.url).href, { createClient: async () => fakeClient() });
// "next/cache" resolves to node_modules/next/cache.js via scripts/register-ts-paths.mjs, so mocking that
// file mocks the very module actions.ts imports.
mockModule("next/cache.js", {
  revalidatePath: (path: string) => world.revalidated.push(path),
  updateTag: (tag: string) => world.expiredTags.push(tag),
});
const { createPost, updatePost, setPostStatus } = await import("../../../app/admin/(dashboard)/blogs/actions");

const ADMIN = { id: "admin-1" };
const content = (...hrefs: string[]) => docJson(para("Text ", ...hrefs.map((href, i) => linked(`link${i}`, href)))) as PostFormValues["content"];
const post = (id: string, slug: string, status: Row["status"], ...hrefs: string[]): Row => ({ id, slug, status, title: slug, content: content(...hrefs) });
const form = (slug: string, status: "draft" | "published", ...hrefs: string[]): PostFormValues => ({
  title: "A title", slug, excerpt: "An excerpt", content: content(...hrefs), coverImage: "", authorId: "", categoryId: "",
  status, featured: false, metaTitle: "", metaDescription: "", keywords: [], faqs: [],
});
const find = (id: string) => world.posts.find((p) => p.id === id)!;

beforeEach(() => {
  world.user = ADMIN;
  world.admins = new Set([ADMIN.id]);
  world.revalidated = [];
  world.expiredTags = [];
  world.posts = [
    post("p-other", "other-post", "published"),
    post("p-wip", "wip-post", "draft"),
    post("p-me", "my-post", "published", "/legacy-broken"), // a live post that already has a stale link
    post("p-draft", "my-draft", "draft"),
  ];
});

// ── authentication & authorization ──────────────────────────────────────────────────────────
test("every write refuses an anonymous caller, and changes nothing", async () => {
  world.user = null;
  await assert.rejects(updatePost("p-me", form("my-post", "published")), /signed in as an admin/);
  await assert.rejects(createPost(form("brand-new", "published")), /signed in as an admin/);
  await assert.rejects(setPostStatus("p-draft", "published"), /signed in as an admin/);
  assert.equal(world.posts.length, 4);
  assert.equal(find("p-draft").status, "draft");
  assert.deepEqual(world.revalidated, []);
});

test("a signed-in user who is not on the admins list is refused too", async () => {
  world.user = { id: "random-auth-user" };
  await assert.rejects(updatePost("p-me", form("my-post", "published")), /signed in as an admin/);
  await assert.rejects(createPost(form("brand-new", "draft")), /signed in as an admin/);
  await assert.rejects(setPostStatus("p-draft", "published"), /signed in as an admin/);
  assert.equal(world.posts.length, 4);
  assert.equal(find("p-draft").status, "draft");
});

// ── updatePost / createPost ─────────────────────────────────────────────────────────────────
test("saving a published post with a newly added broken, self or draft link is refused", async () => {
  for (const [href, expected] of [["/nope", /\/nope/], ["/blog/my-post", /itself/], ["/blog/wip-post", /is a draft/]] as const) {
    const result = await updatePost("p-me", form("my-post", "published", "/legacy-broken", href));
    assert.equal(result.success, false, href);
    assert.match(result.success ? "" : result.error, expected);
  }
  assert.deepEqual(find("p-me").content, content("/legacy-broken"), "stored content must be untouched");
});

test("an already-live stale link does not stop a published post from being edited", async () => {
  const result = await updatePost("p-me", form("my-post", "published", "/legacy-broken", "/ppf", "/blog/other-post"));
  assert.deepEqual(result, { success: true, id: "p-me" });
  assert.deepEqual(find("p-me").content, content("/legacy-broken", "/ppf", "/blog/other-post"));
});

test("a successful save expires the cached public blog reads, a refused one does not", async () => {
  // The public blog serves published posts from a tag-keyed cache; without this an admin's save would
  // not show on the site until the hourly refresh.
  const refused = await updatePost("p-me", form("my-post", "published", "/legacy-broken", "/nope"));
  assert.equal(refused.success, false);
  assert.deepEqual(world.expiredTags, []);

  const saved = await updatePost("p-me", form("my-post", "published", "/legacy-broken"));
  assert.equal(saved.success, true);
  // "latest-update" is the nav's "New" badge on Updates, which reads the newest publish time.
  assert.deepEqual(world.expiredTags, ["blog", "latest-update"]);
});

test("PUBLISHING a draft via the editor is judged on all its links, not just the ones that changed", async () => {
  // The draft already has a link to another draft stored; saving it as a draft is allowed.
  find("p-draft").content = content("/blog/wip-post");
  const asDraft = await updatePost("p-draft", form("my-draft", "draft", "/blog/wip-post"));
  assert.equal(asDraft.success, true);

  // Publishing it unchanged must be refused: nothing in it was ever live.
  const published = await updatePost("p-draft", form("my-draft", "published", "/blog/wip-post"));
  assert.equal(published.success, false);
  assert.match(published.success ? "" : published.error, /is a draft/);
  assert.equal(find("p-draft").status, "draft");

  // Fix the link and it goes through.
  assert.equal((await updatePost("p-draft", form("my-draft", "published", "/blog/other-post"))).success, true);
  assert.equal(find("p-draft").status, "published");
});

test("a new post can't be published linking to itself or to a made-up page", async () => {
  assert.equal((await createPost(form("fresh", "published", "/blog/fresh"))).success, false);
  assert.equal((await createPost(form("fresh", "published", "/made-up"))).success, false);
  assert.equal(world.posts.some((p) => p.slug === "fresh"), false);
  assert.equal((await createPost(form("fresh", "published", "/ppf", "/blog/other-post"))).success, true);
});

// ── setPostStatus (the Publish / Unpublish row action) ──────────────────────────────────────
test("the publish toggle refuses a draft that links to another draft", async () => {
  find("p-draft").content = content("/blog/wip-post");
  await assert.rejects(setPostStatus("p-draft", "published"), /is a draft/);
  assert.equal(find("p-draft").status, "draft");
  assert.deepEqual(world.revalidated, []);
});

test("the publish toggle refuses broken and self-referencing links", async () => {
  find("p-draft").content = content("/does-not-exist");
  await assert.rejects(setPostStatus("p-draft", "published"), /doesn't match any page or post/);
  find("p-draft").content = content("/blog/my-draft");
  await assert.rejects(setPostStatus("p-draft", "published"), /links to this post itself/);
  assert.equal(find("p-draft").status, "draft");
});

test("the publish toggle also refuses a draft carrying a stale legacy link", async () => {
  // Nothing was live for a draft, so an old broken link is not "already exposed".
  find("p-draft").content = content("/legacy-broken");
  await assert.rejects(setPostStatus("p-draft", "published"), /\/legacy-broken/);
  assert.equal(find("p-draft").status, "draft");
});

test("the publish toggle publishes a draft whose links are all real", async () => {
  find("p-draft").content = content("/ppf", "/pune", "/blog/other-post", "https://example.com");
  await setPostStatus("p-draft", "published");
  assert.equal(find("p-draft").status, "published");
  assert.ok(world.revalidated.includes("/blog/my-draft"));
});

test("publishing an already-published post, or unpublishing, needs no link check", async () => {
  await setPostStatus("p-me", "published"); // has a stale link but is already live: no change in exposure
  assert.equal(find("p-me").status, "published");
  await setPostStatus("p-me", "draft");
  assert.equal(find("p-me").status, "draft");
});

test("the toggle rejects a status that isn't draft or published, before touching anything", async () => {
  await assert.rejects(setPostStatus("p-draft", "archived" as never), /Invalid post status/);
  await assert.rejects(setPostStatus("p-draft", undefined as never), /Invalid post status/);
  assert.equal(find("p-draft").status, "draft");
});
