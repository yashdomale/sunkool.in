// Checks the /blog listing URLs from the Search Console "Excluded by 'noindex' tag" report against
// a running server (`next start`, or production after a deploy - it only issues GET requests):
// node scripts/verify-blog-seo.mjs http://127.0.0.1:3100
// - status, robots meta, canonical and X-Robots-Tag of the 9 reported URLs and their edge cases,
// - robots/canonical sit in the server-rendered <head>, once each, never contradicting each other,
// - category and pagination pages list the right articles, with titles/descriptions/H1s of their own,
// - invalid category / page values are never indexable (a 404, or a streamed 200 + noindex),
// - the sitemap lists exactly the indexable category pages and none of the private/internal URLs.
// Expectations come from the pages themselves (article counts, pagination links), so the same run
// works against the bundled seed articles and against the live database.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const base = new URL(process.argv[2] || "http://127.0.0.1:3100");
const ORIGIN = "https://www.sunkool.in"; // metadataBase: canonicals are absolute and never use the request host
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
// Same threshold the app uses (src/lib/blog/listing-seo.ts) - read from the source so they cannot drift.
const MIN_POSTS = Number(
  /MIN_INDEXABLE_CATEGORY_POSTS\s*=\s*(\d+)/.exec(readFileSync(new URL("../../src/lib/blog/listing-seo.ts", import.meta.url), "utf8"))?.[1]
);
assert.ok(MIN_POSTS > 0, "could not read MIN_INDEXABLE_CATEGORY_POSTS");

const failures = [];
const check = async (label, run) => {
  try {
    await run();
    console.log(`ok    ${label}`);
  } catch (error) {
    failures.push(label);
    console.log(`FAIL  ${label}\n      ${error.message}`);
  }
};

const decode = (text) =>
  text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
const strip = (html) => decode(html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim());

const cache = new Map();
/** GET `path` without following redirects, plus everything the checks need parsed out of the HTML. */
async function get(path) {
  if (cache.has(path)) return cache.get(path);
  const response = await fetch(new URL(path, base), {
    redirect: "manual",
    headers: { "user-agent": UA },
    signal: AbortSignal.timeout(60000),
  });
  const raw = await response.text();
  const html = raw.replace(/<!--[\s\S]*?-->/g, "");
  const headEnd = html.indexOf("</head>");
  const tags = (re) => [...html.matchAll(re)].map((m) => ({ value: decode(m[1]), inHead: m.index < headEnd }));
  const articles = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map((m) => {
    const label = strip(/<span class="(?:text-xs uppercase|eyebrow)[^"]*">([\s\S]*?)<\/span>/.exec(m[0])?.[1] ?? "");
    return {
      slug: /href="\/blog\/([a-z0-9-]+)"/.exec(m[0])?.[1],
      featured: label.endsWith("· Featured"), // the hero card above page 1's grid
      label: label.replace(/ · Featured$/, ""),
    };
  });
  const page = {
    path,
    status: response.status,
    location: response.headers.get("location"),
    xRobotsTag: response.headers.get("x-robots-tag"),
    robots: tags(/<meta name="robots" content="([^"]*)"/g),
    canonical: tags(/<link rel="canonical" href="([^"]*)"/g),
    title: strip(/<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? ""),
    description: tags(/<meta name="description" content="([^"]*)"/g)[0]?.value ?? "",
    h1: strip(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? ""),
    articles,
    // /blog?… links in the page body (category filter + pagination)
    links: [...new Set([...html.matchAll(/href="(\/blog(?:\?[^"]*)?)"/g)].map((m) => decode(m[1])))],
  };
  cache.set(path, page);
  return page;
}

/** What every real listing page must satisfy, whatever its robots verdict. */
function expectWellFormed(page, { robots, canonical }) {
  assert.equal(page.status, 200, `HTTP ${page.status}`);
  assert.equal(page.xRobotsTag, null, `unexpected X-Robots-Tag: ${page.xRobotsTag}`);
  assert.equal(page.robots.length, 1, `${page.robots.length} robots meta tags (${page.robots.map((r) => r.value).join(" | ")}), expected exactly 1`);
  assert.equal(page.robots[0].value, robots, `robots "${page.robots[0].value}", expected "${robots}"`);
  assert.ok(page.robots[0].inHead, "robots meta is not in the server-rendered <head>");
  assert.equal(page.canonical.length, 1, `${page.canonical.length} canonical links, expected exactly 1`);
  assert.equal(page.canonical[0].value, `${ORIGIN}${canonical}`, `canonical ${page.canonical[0].value}, expected ${ORIGIN}${canonical}`);
  assert.ok(page.canonical[0].inHead, "canonical is not in the server-rendered <head>");
  assert.ok(page.h1, "no <h1>");
  assert.ok(page.title && page.description, "missing <title> or meta description");
}

/**
 * An invalid listing URL (unknown category, malformed or out-of-range ?page=) must never be indexable.
 * /blog streams (blog/loading.tsx), so the status line is already 200 when notFound() runs: Next then
 * serves the not-found page as 200 with a noindex tag instead of a 404 (see loading.md, "Status
 * Codes"). Either outcome is accepted, but every robots tag must say noindex - one stray "index" would
 * be a conflicting instruction - and no articles may be listed.
 */
function expectNotFound(page) {
  assert.ok([200, 404].includes(page.status), `HTTP ${page.status}, expected 404 (or 200 + noindex)`);
  assert.equal(page.xRobotsTag, null, `unexpected X-Robots-Tag: ${page.xRobotsTag}`);
  assert.ok(page.robots.length >= 1, "no robots meta on an invalid listing URL");
  assert.ok(page.robots.every((r) => /\bnoindex\b/.test(r.value)), `robots ${page.robots.map((r) => `"${r.value}"`).join(" + ")}, expected only noindex`);
  assert.equal(page.articles.length, 0, `lists ${page.articles.length} article(s)`);
}

// ── The blog listing itself, and what its pagination says about the catalogue ─────────────────
const main = await get("/blog");
const pageNumbers = main.links.map((l) => Number(/[?&]page=(\d+)/.exec(l)?.[1])).filter(Boolean);
const lastPage = Math.max(1, ...pageNumbers);
const categories = [...new Map(main.links.map((l) => [/^\/blog\?category=([a-z0-9-]+)$/.exec(l)?.[1], l]).filter(([slug]) => slug)).keys()];
console.log(`/blog: ${main.articles.length} article cards, ${lastPage} page(s), categories: ${categories.join(", ") || "(none)"}\n`);

await check("/blog is indexable, canonical /blog", () => expectWellFormed(main, { robots: "index, follow", canonical: "/blog" }));

// ── Search Console URLs 1-5: category pages ───────────────────────────────────────────────────
const GSC_CATEGORIES = ["ppf", "regulations", "vehicle-care", "new-cars", "window-film"];
const seen = { title: new Map(), description: new Map(), h1: new Map([[main.h1, "/blog"]]) };
const unique = (kind, page) => {
  const value = page[kind];
  const owner = seen[kind].get(value);
  assert.ok(!owner || owner === page.path, `${kind} "${value}" is also used by ${owner}`);
  seen[kind].set(value, page.path);
};
const indexableCategories = [];

for (const slug of GSC_CATEGORIES) {
  const path = `/blog?category=${slug}`;
  await check(`${path}`, async () => {
    assert.ok(categories.includes(slug), `${slug} is not offered by the category filter on /blog`);
    const page = await get(path);
    const count = page.articles.length;
    assert.ok(count >= 1, "category page lists no articles");
    // Only this category's articles, under this category's own name.
    const labels = new Set(page.articles.map((a) => a.label));
    assert.equal(labels.size, 1, `mixed categories on the page: ${[...labels].join(", ")}`);
    const indexable = count >= MIN_POSTS;
    if (indexable) indexableCategories.push(slug);
    expectWellFormed(page, { robots: indexable ? "index, follow" : "noindex, follow", canonical: path });
    for (const kind of ["title", "description", "h1"]) unique(kind, page);
    assert.notEqual(page.h1, main.h1, "same H1 as /blog");
    console.log(`      ${count} article(s) -> ${indexable ? "INDEX" : "noindex (thin)"}; h1 "${page.h1}"; title "${page.title}"`);
  });
}

// ── Search Console URL 6: pagination ─────────────────────────────────────────────────────────
if (lastPage >= 2) {
  await check("/blog?page=2 is an indexable page of its own with different articles", async () => {
    const page2 = await get("/blog?page=2");
    expectWellFormed(page2, { robots: "index, follow", canonical: "/blog?page=2" });
    assert.ok(page2.articles.length >= 1, "page 2 lists no articles");
    // The featured article is page 1's hero but is also part of the paginated list, in its
    // chronological place (existing behaviour) - so compare against page 1's grid, and note the hero.
    const onFirstGrid = new Set(main.articles.filter((a) => !a.featured).map((a) => a.slug));
    assert.deepEqual(page2.articles.filter((a) => onFirstGrid.has(a.slug)).map((a) => a.slug), [], "page 2 repeats articles of page 1's grid");
    const onFirstAll = new Set(main.articles.map((a) => a.slug));
    assert.ok(page2.articles.some((a) => !onFirstAll.has(a.slug)), "page 2 has no article that is not already on page 1");
    const hero = main.articles.find((a) => a.featured);
    if (hero && page2.articles.some((a) => a.slug === hero.slug)) {
      console.log(`      note: featured article "${hero.slug}" is page 1's hero and also sits in page 2's grid`);
    }
    console.log(`      page 2: ${page2.articles.length} article(s), ${page2.articles.filter((a) => !onFirstAll.has(a.slug)).length} not on page 1`);
    assert.notEqual(page2.title, main.title);
    assert.notEqual(page2.description, main.description);
    assert.ok(page2.links.includes("/blog"), "page 2 has no link back to page 1");
  });
  await check("every pagination link on /blog answers 200", async () => {
    for (const link of main.links.filter((l) => /[?&]page=/.test(l))) assert.equal((await get(link)).status, 200, link);
  });
  await check(`/blog?page=${lastPage + 1} (past the last page) is never indexable`, async () => expectNotFound(await get(`/blog?page=${lastPage + 1}`)));
} else {
  console.log(`skip  /blog?page=2 - this catalogue fits on one page (${main.articles.length} articles), so page 2 must be an invalid URL`);
  await check("/blog?page=2 is never indexable when there is no second page", async () => expectNotFound(await get("/blog?page=2")));
}

await check("/blog?page=1 canonicalises to /blog", async () =>
  expectWellFormed(await get("/blog?page=1"), { robots: "index, follow", canonical: "/blog" }));

for (const value of ["999", "0", "-1", "1.5", "abc", "01", "2abc"]) {
  await check(`/blog?page=${value} is never indexable (no 500, no empty indexable 200)`, async () => expectNotFound(await get(`/blog?page=${value}`)));
}

// ── Unknown categories, tracking parameters, internal search ──────────────────────────────────
await check("/blog?category=bogus is never indexable", async () => expectNotFound(await get("/blog?category=bogus")));
await check("/blog?category=ppf&page=2 is never indexable (past the end of the category)", async () => expectNotFound(await get("/blog?category=ppf&page=2")));
await check("tracking parameters never reach the canonical", async () => {
  const page = await get("/blog?category=window-film&utm_source=newsletter&fbclid=abc");
  assert.equal(page.canonical.length, 1);
  assert.equal(page.canonical[0].value, `${ORIGIN}/blog?category=window-film`);
});
await check("internal search results are noindex,follow and not canonicalised to /blog", async () => {
  const page = await get("/blog?q=film");
  assert.equal(page.status, 200);
  assert.equal(page.xRobotsTag, null);
  assert.deepEqual(page.robots.map((r) => r.value), ["noindex, follow"]);
  assert.equal(page.canonical.length, 1);
  assert.notEqual(page.canonical[0].value, `${ORIGIN}/blog`, "noindex page canonicalised to another URL");
});

// ── Search Console URLs 7-9: must never be an indexable 200 ───────────────────────────────────
await check("/blog/tags/ppf-on-bmw-x5 redirects to /blog or is gone - never an indexable 200", async () => {
  const page = await get("/blog/tags/ppf-on-bmw-x5");
  if ([301, 308].includes(page.status)) {
    assert.equal(new URL(page.location, base).pathname, "/blog", `redirects to ${page.location}`);
    assert.equal((await get("/blog")).status, 200);
    console.log(`      ${page.status} -> ${page.location}`);
  } else {
    assert.ok([404, 410].includes(page.status), `HTTP ${page.status}`);
  }
});
await check("/profile/crm/profile is not served (404/410, or 401/403)", async () => {
  const page = await get("/profile/crm/profile");
  assert.ok([401, 403, 404, 410].includes(page.status), `HTTP ${page.status}`);
});
await check("/search?q={search_term} is not an indexable page", async () => {
  const page = await get("/search?q=%7Bsearch_term%7D");
  assert.ok([404, 410].includes(page.status) || page.robots.some((r) => /noindex/.test(r.value)), `HTTP ${page.status}, robots ${page.robots.map((r) => r.value)}`);
});

// ── Sitemap and robots.txt ────────────────────────────────────────────────────────────────────
const sitemap = await (await fetch(new URL("/sitemap.xml", base), { signal: AbortSignal.timeout(60000) })).text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
await check(`sitemap (${locs.length} URLs) lists the indexable categories and nothing private or internal`, () => {
  const categoryLocs = locs.filter((u) => u.includes("?")).sort();
  assert.deepEqual(categoryLocs, indexableCategories.map((s) => `${ORIGIN}/blog?category=${s}`).sort());
  for (const url of locs) {
    assert.ok(!/[?&](q|page)=/.test(url), `${url} is a search/pagination URL`);
    assert.ok(!/\/(search|profile|crm|admin|api|tags)(\/|\?|$)/.test(new URL(url).pathname + new URL(url).search), `${url} is private or internal`);
  }
  assert.ok(locs.includes(`${ORIGIN}/blog`));
});
for (const url of locs.filter((u) => u.includes("?"))) {
  await check(`sitemap category ${url} answers 200, index,follow, self-canonical`, async () => {
    const { pathname, search } = new URL(url);
    expectWellFormed(await get(pathname + search), { robots: "index, follow", canonical: pathname + search });
  });
}
await check("robots.txt keeps /blog crawlable and points at the sitemap", async () => {
  const text = await (await fetch(new URL("/robots.txt", base), { signal: AbortSignal.timeout(30000) })).text();
  assert.ok(/^Disallow: \/admin\/$/m.test(text) && /^Disallow: \/api\/$/m.test(text));
  assert.ok(!/^Disallow: \/blog/m.test(text), "robots.txt blocks /blog");
  assert.ok(text.includes(`Sitemap: ${ORIGIN}/sitemap.xml`));
});

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
