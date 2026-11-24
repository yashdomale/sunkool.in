// Pins the indexing policy for the /blog listing URLs that Search Console reported under
// "Excluded by 'noindex' tag" (see listing-seo.ts), without a server. What the running site
// really answers for them - status, headers, tags in the HTML - is checked end to end by
// scripts/qa/verify-blog-seo.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import robots from "../../app/robots";
import { getCategoryCopy } from "./category-copy";
import {
  BLOG_DESCRIPTION,
  BLOG_TITLE,
  MIN_INDEXABLE_CATEGORY_POSTS,
  categorySitemapEntries,
  describeListing,
  isIndexableCategory,
  listingPath,
  parseListingParams,
  validateListingParams,
  type CategoryRef,
  type ListingSeo,
  type RawListingParams,
} from "./listing-seo";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const PAGE_SIZE = 9;

const CATEGORIES: CategoryRef[] = [
  { slug: "new-cars", name: "New Cars" },
  { slug: "window-film", name: "Window Film" },
  { slug: "industry-news", name: "Industry News" },
  { slug: "vehicle-care", name: "Vehicle Care" },
  { slug: "ppf", name: "PPF" },
  { slug: "regulations", name: "Regulations" },
  { slug: "technology", name: "Technology" },
];
// What production served when the audit was done (2026-10-16): 16 articles, so page 2 has 7.
const PUBLISHED: Record<string, number> = {
  "window-film": 7,
  regulations: 2,
  "vehicle-care": 2,
  "new-cars": 2,
  ppf: 1,
  "industry-news": 1,
  technology: 1,
};
const TOTAL = 16;

/** Next hands `searchParams` over as an object, with an array for a repeated key. */
function rawParams(search: string): RawListingParams {
  const params = new URLSearchParams(search);
  const raw: Record<string, string | string[]> = {};
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    raw[key] = values.length > 1 ? values : values[0];
  }
  return raw;
}

/** The decision for `/blog?<search>`, with the catalogue above standing in for the database. */
function listing(search: string, published: Record<string, number> = PUBLISHED, total = TOTAL) {
  const check = validateListingParams(rawParams(search), CATEGORIES);
  if (!check.ok) return { kind: "not-found" } as const;
  const count = check.request.category ? (published[check.request.category] ?? 0) : total;
  return describeListing(check.request, check.category, { total: count, pageSize: PAGE_SIZE });
}

function ok(search: string): ListingSeo {
  const outcome = listing(search);
  assert.equal(outcome.kind, "ok", `/blog?${search} should be a real page`);
  return outcome as ListingSeo;
}

const robotsTag = (seo: ListingSeo) => (seo.robots.index ? "index, follow" : "noindex, follow");

// ── The 9 URLs from the Search Console report ──────────────────────────────────

test("GSC 1-4: qualifying category pages are indexable with their own canonical", () => {
  for (const slug of ["regulations", "vehicle-care", "new-cars", "window-film"]) {
    const seo = ok(`category=${slug}`);
    assert.equal(robotsTag(seo), "index, follow", slug);
    assert.equal(seo.canonical, `/blog?category=${slug}`, slug);
  }
});

test("GSC 5: the PPF category stays noindex while it has a single article", () => {
  const seo = ok("category=ppf");
  assert.equal(robotsTag(seo), "noindex, follow");
  assert.equal(seo.canonical, "/blog?category=ppf", "noindex pages still canonicalise to themselves, not to /blog");
  // ...and becomes indexable by itself once a second article is published.
  const grown = listing("category=ppf", { ...PUBLISHED, ppf: 2 });
  assert.equal(grown.kind === "ok" && grown.robots.index, true);
});

test("the main /blog listing has a descriptive title, not the bare word \"Blog\"", () => {
  const { title } = ok("");
  assert.equal(title, BLOG_TITLE);
  assert.notEqual(title, "Blog");
  assert.match(title, /window film/i);
  // Same budget as the category titles: the brand suffix still has to fit.
  assert.ok(title.length <= 50, `title is ${title.length} chars`);
});

test("the main /blog title does not compete with a category page's title", () => {
  const wordsOf = (text: string) => new Set(text.toLowerCase().match(/[a-z0-9]+/g));
  const overlap = (a: string, b: string) => {
    const [x, y] = [wordsOf(a), wordsOf(b)];
    return [...x].filter((word) => y.has(word)).length / new Set([...x, ...y]).size;
  };
  const main = ok("").title;
  for (const { slug } of CATEGORIES) {
    const other = getCategoryCopy(slug)?.title;
    if (other) assert.ok(overlap(main, other) < 0.5, `"${main}" is too close to "${other}" (${slug})`);
  }
});

test("GSC 6: /blog?page=2 is an indexable page of its own, not a copy of page 1", () => {
  const seo = ok("page=2");
  assert.equal(robotsTag(seo), "index, follow");
  assert.equal(seo.canonical, "/blog?page=2");
  const first = ok("");
  assert.notEqual(seo.title, first.title);
  assert.notEqual(seo.description, first.description);
  assert.equal(seo.totalPages, 2);
});

test("GSC 7-9: the tag, CRM and search URLs have no page in this app", () => {
  const pages = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? [entry.name, ...pages(full)] : [];
    });
  const routeDirs = new Set(pages(path.join(root, "src/app")));
  for (const segment of ["tags", "profile", "crm", "search"]) {
    assert.ok(!routeDirs.has(segment), `src/app has a "${segment}" route; it would answer a URL that must not be indexable`);
  }
});

// ── Category pages ─────────────────────────────────────────────────────────────

test("the indexing threshold is exactly MIN_INDEXABLE_CATEGORY_POSTS", () => {
  assert.equal(isIndexableCategory("window-film", MIN_INDEXABLE_CATEGORY_POSTS - 1), false);
  assert.equal(isIndexableCategory("window-film", MIN_INDEXABLE_CATEGORY_POSTS), true);
  assert.equal(isIndexableCategory("window-film", 0), false);
});

test("a category without curated copy is never indexable, however many articles it has", () => {
  assert.equal(getCategoryCopy("some-new-category"), undefined);
  assert.equal(isIndexableCategory("some-new-category", 50), false);
  const outcome = describeListing(
    { category: "some-new-category", page: 1 },
    { slug: "some-new-category", name: "Some New Category" },
    { total: 12, pageSize: PAGE_SIZE }
  );
  assert.equal(outcome.kind, "ok");
  assert.equal(outcome.kind === "ok" && outcome.robots.index, false);
});

test("curated copy is unique per category and different from the main blog page", () => {
  const seen = { title: new Set<string>(), description: new Set<string>(), heading: new Set<string>(), intro: new Set<string>() };
  for (const { slug } of CATEGORIES) {
    const copy = getCategoryCopy(slug);
    assert.ok(copy, `${slug} has no curated copy`);
    assert.ok(copy.title.length <= 50, `${slug} title is ${copy.title.length} chars; the brand suffix needs room`);
    assert.ok(copy.description.length >= 70 && copy.description.length <= 160, `${slug} description is ${copy.description.length} chars`);
    for (const field of ["title", "description", "heading", "intro"] as const) {
      assert.ok(!seen[field].has(copy[field]), `${slug} repeats another category's ${field}`);
      seen[field].add(copy[field]);
    }
    assert.notEqual(copy.description, BLOG_DESCRIPTION);
    assert.notEqual(copy.title, "Blog");
  }
});

test("each category page carries its own title, description, heading and intro", () => {
  for (const { slug } of CATEGORIES) {
    const seo = ok(`category=${slug}`);
    const copy = getCategoryCopy(slug)!;
    assert.equal(seo.title, copy.title);
    assert.equal(seo.description, copy.description);
    assert.deepEqual(seo.heading, { title: copy.heading, intro: copy.intro });
  }
  assert.equal(ok("").heading, undefined, "the main blog keeps its own header");
});

// ── Pagination ─────────────────────────────────────────────────────────────────

test("?page=1 is the same page as /blog and canonicalises to it", () => {
  assert.equal(ok("page=1").canonical, "/blog");
  assert.equal(ok("page=1").title, ok("").title);
  assert.equal(ok("").canonical, "/blog");
});

test("a page past the last one is a 404, including inside a category", () => {
  assert.equal(listing("page=3").kind, "not-found");
  assert.equal(listing("page=999").kind, "not-found");
  assert.equal(listing("category=window-film&page=2").kind, "not-found"); // 7 articles fit on one page
  assert.equal(listing("category=ppf&page=2").kind, "not-found");
});

test("paginated category pages keep their category in the canonical and are never canonicalised to page 1", () => {
  const many = { ...PUBLISHED, "window-film": 12 };
  const second = listing("category=window-film&page=2", many);
  assert.equal(second.kind, "ok");
  if (second.kind !== "ok") return;
  assert.equal(second.canonical, "/blog?category=window-film&page=2");
  assert.equal(second.robots.index, true);
  assert.match(second.title, /Page 2$/);
});

test("malformed ?page= values are 404s, not empty pages or server errors", () => {
  for (const value of ["abc", "0", "-1", "1.5", "01", "2abc", "1e3", "%20", "99999", "NaN", "Infinity"]) {
    assert.equal(listing(`page=${value}`).kind, "not-found", `page=${value}`);
  }
  assert.equal(ok("page=").canonical, "/blog", "an empty value means no page parameter");
});

test("a repeated parameter uses its first value, so duplicates cannot spawn extra canonicals", () => {
  assert.equal(ok("page=2&page=3").canonical, "/blog?page=2");
  assert.equal(ok("category=ppf&category=regulations").canonical, "/blog?category=ppf");
});

// ── Unknown categories, search and tracking parameters ─────────────────────────

test("parseListingParams normalises the query without needing the category list", () => {
  assert.equal(parseListingParams({})?.page, 1);
  assert.deepEqual(parseListingParams({ category: " PPF ", q: " film ", page: "2" }), { category: "ppf", q: "film", page: 2 });
  assert.deepEqual(parseListingParams({ category: ["ppf", "regulations"], page: ["3", "4"] }), { category: "ppf", q: undefined, page: 3 });
  assert.equal(parseListingParams({ category: "   ", q: "" })?.category, undefined);
  assert.equal(parseListingParams({ page: "abc" }), null);
  assert.equal(parseListingParams({ category: "bogus" })?.category, "bogus", "an unknown category is only rejected by validateListingParams");
});

test("an unknown category is a 404", () => {
  for (const value of ["bogus", "ppf%2F", "ppf%20x", "', drop table posts"]) {
    assert.equal(listing(`category=${value}`).kind, "not-found", value);
  }
});

test("category slugs are case-insensitive but the canonical is lower-case", () => {
  assert.equal(ok("category=PPF").canonical, "/blog?category=ppf");
  assert.equal(ok("category=Window-Film").canonical, "/blog?category=window-film");
});

test("internal search results are noindex,follow and never claim to be /blog", () => {
  for (const search of ["q=ppf", "q=ppf&category=window-film", "q=ppf&page=1"]) {
    const seo = ok(search);
    assert.equal(robotsTag(seo), "noindex, follow", search);
    assert.notEqual(seo.canonical, "/blog", `${search}: noindex combined with a canonical to another URL is a contradictory signal`);
    assert.match(seo.canonical, /q=ppf/);
  }
});

test("tracking and unknown parameters never reach the canonical", () => {
  assert.equal(ok("category=ppf&utm_source=newsletter&fbclid=x").canonical, "/blog?category=ppf");
  assert.equal(ok("utm_medium=cpc").canonical, "/blog");
  assert.equal(ok("page=1&gclid=abc&category=window-film").canonical, "/blog?category=window-film");
});

test("listingPath builds one stable URL regardless of parameter order", () => {
  assert.equal(listingPath({}), "/blog");
  assert.equal(listingPath({ page: 1 }), "/blog");
  assert.equal(listingPath({ page: 2, category: "ppf" }), "/blog?category=ppf&page=2");
  assert.equal(listingPath({ q: "heat rejection" }), "/blog?q=heat+rejection");
});

// ── Robots tags: consistency and no contradictions ─────────────────────────────

test("every listing outcome follows links and has exactly one robots verdict", () => {
  const searches = ["", "page=2", "page=1", "q=x", "category=ppf", ...CATEGORIES.map((c) => `category=${c.slug}`)];
  for (const search of searches) {
    const seo = ok(search);
    assert.equal(seo.robots.follow, true, search);
    assert.equal(typeof seo.robots.index, "boolean", search);
  }
});

test("indexable canonicals are absolute-path, self-referencing and carry no search term", () => {
  for (const { slug } of CATEGORIES) {
    const seo = ok(`category=${slug}`);
    if (!seo.robots.index) continue;
    assert.equal(seo.canonical, listingPath({ category: slug }));
    assert.ok(!seo.canonical.includes("q="));
  }
});

// ── Sitemap ────────────────────────────────────────────────────────────────────

const BASE = "https://www.sunkool.in";
const stats = Object.entries(PUBLISHED).map(([slug, count]) => ({ slug, count, updatedAt: "2026-09-04T00:00:00.000Z" }));

test("the sitemap lists exactly the category pages that are indexable", () => {
  const urls = categorySitemapEntries(stats, BASE).map((entry) => entry.url);
  assert.deepEqual(urls, [
    `${BASE}/blog?category=new-cars`,
    `${BASE}/blog?category=regulations`,
    `${BASE}/blog?category=vehicle-care`,
    `${BASE}/blog?category=window-film`,
  ]);
  assert.ok(!urls.some((url) => url.includes("category=ppf")), "thin PPF category must not be listed");
});

test("the sitemap and the robots tag can never disagree about a category", () => {
  for (const { slug } of CATEGORIES) {
    for (let count = 0; count <= 12; count++) {
      const listed = categorySitemapEntries([{ slug, count }], BASE).length === 1;
      const published = { ...PUBLISHED, [slug]: count };
      const outcome = count === 0 ? undefined : listing(`category=${slug}`, published);
      const indexable = outcome?.kind === "ok" && outcome.robots.index;
      assert.equal(listed, Boolean(indexable), `${slug} with ${count} articles`);
    }
  }
});

test("the sitemap never lists pagination, search, tag, CRM or unknown-category URLs", () => {
  const withJunk = [...stats, { slug: "bogus", count: 9 }, { slug: "tags", count: 9 }];
  for (const { url } of categorySitemapEntries(withJunk, BASE)) {
    assert.match(url, /^https:\/\/www\.sunkool\.in\/blog\?category=[a-z-]+$/);
    assert.ok(!/page=|q=|tags|crm|profile|search/.test(url.replace("/blog?category=", "")), url);
  }
});

// ── robots.txt and stray directives ────────────────────────────────────────────

test("robots.txt keeps the public blog crawlable and only blocks private paths", () => {
  const config = robots();
  const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
  const disallowed = rules.flatMap((rule) => [rule.disallow ?? []].flat());
  assert.deepEqual(disallowed.sort(), ["/admin/", "/api/"]);
  for (const rule of rules) {
    for (const blocked of [rule.disallow ?? []].flat()) assert.ok(!"/blog".startsWith(blocked), `robots.txt blocks ${blocked}`);
  }
  assert.equal(config.sitemap, `${BASE}/sitemap.xml`);
});

/** Source files under `dir` (relative to the repo root) whose text matches `pattern`. */
function filesMatching(dir: string, pattern: RegExp): string[] {
  const hits: string[] = [];
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx?|mjs|jsx?|mdx?)$/.test(entry.name) && !/\.test\./.test(entry.name) && pattern.test(fs.readFileSync(full, "utf8"))) {
        hits.push(path.relative(root, full).replaceAll("\\", "/"));
      }
    }
  };
  walk(path.join(root, dir));
  return hits;
}

test("no layout or page outside /admin hard-codes a noindex, so a parent cannot leak it onto the blog", () => {
  assert.deepEqual(filesMatching("src/app", /index:\s*false|["'`][^"'`\n]*noindex/i), ["src/app/admin/layout.tsx"]);
});

test("nothing sets an X-Robots-Tag header", () => {
  assert.deepEqual(filesMatching("src", /x-robots-tag/i), []);
  assert.ok(!/x-robots-tag/i.test(fs.readFileSync(path.join(root, "next.config.ts"), "utf8")));
});
