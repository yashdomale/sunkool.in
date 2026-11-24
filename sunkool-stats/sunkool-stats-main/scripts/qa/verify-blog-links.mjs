// Run against `next start`, not just the renderer's unit tests:
// node --import ./scripts/register-ts-paths.mjs scripts/qa/verify-blog-links.mjs http://127.0.0.1:3017 --articles
// Optional: --snapshot <published-posts.json> --live-origin https://www.sunkool.in --output <directory>
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generateJSON } from "@tiptap/html/server";
import { tiptapJsonToHtml } from "../../src/lib/blog/render.ts";
import { getTiptapExtensions } from "../../src/lib/blog/tiptap-extensions.ts";

const option = (name) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
};
// This fetches every published article, and each request adds a view in the database the server is
// connected to (src/lib/blog/view-count.ts). It refuses to run until you confirm that is harmless:
// start the server with SKIP_VIEW_COUNT=1 and pass --articles.
if (!process.argv.includes("--articles")) {
  console.error("verify-blog-links fetches every published article; each request adds a view in the connected database.");
  console.error("Start the server with SKIP_VIEW_COUNT=1, then run again with --articles.");
  process.exit(2);
}

const base = new URL(process.argv[2] || "http://127.0.0.1:3017");
const live = option("--live-origin");
const output = option("--output");
const snapshot = option("--snapshot");
const posts = snapshot ? JSON.parse(fs.readFileSync(snapshot, "utf8")) : [];
const GLANZA = "/blog/toyota-glanza-facelift-2026-expected-price-features-engine-and-launch-date";
const BALENO = "/blog/maruti-suzuki-baleno-facelift-2026-expected-price";
const HEAT = "/blog/how-much-heat-does-ceramic-window-film-block";
const LEGAL = "/blog/is-window-film-legal-on-your-car-in-india-here-s-what-the-law-actually-says";
const required = new Map([
  [GLANZA, [BALENO, HEAT, LEGAL]],
  [BALENO, [GLANZA, HEAT]],
  ["/blog/car-window-tint-guide-2026-film-types-cost-legal-limits", [HEAT, LEGAL]],
]);
const withoutAnchors = (html) => html.replace(/<\/?a\b[^>]*>/g, "");
const decode = (text) => text.replace(/&(#\d+|#x[\da-f]+|amp|lt|gt|quot|apos);/gi, (_, entity) => {
  if (entity.startsWith("#")) return String.fromCodePoint(entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10));
  return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[entity.toLowerCase()];
});
const metadata = (html) => ({
  title: decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
  canonical: decode(html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*\bhref="([^"]+)"/i)?.[1] ?? ""),
  description: decode(html.match(/<meta\b(?=[^>]*\bname="description")[^>]*\bcontent="([^"]*)"/i)?.[1] ?? ""),
});
async function get(url) {
  const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${url}: HTTP ${response.status}; redirects are not accepted`);
  return response.text();
}

const sitemap = await get(new URL("/sitemap.xml", base));
const routes = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(decode(match[1])).pathname)
  .filter((pathname) => /^\/blog\/[^/]+$/.test(pathname)))];
assert.ok(routes.includes(GLANZA), "The production sitemap must include the CMS-only Toyota Glanza article.");
const published = new Set(routes);
const checked = new Map();
const report = [];
if (output) fs.mkdirSync(output, { recursive: true });

for (const route of routes) {
  const url = new URL(route, base);
  const html = await get(url);
  checked.set(url.href, true);
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
  assert.ok(article, `${route}: article body missing from server-rendered HTML`);
  const links = [...article.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ href: decode(match[1]), anchor: decode(match[2].replace(/<[^>]*>/g, "")) }))
    .filter((link) => link.href.startsWith("/blog/"));
  assert.ok(links.length > 0, `${route}: no contextual blog links inside <article>`);
  assert.ok(new Set(links.map((link) => link.href)).size === links.length, `${route}: repeated destinations`);
  for (const target of required.get(route) ?? []) assert.ok(links.some((link) => link.href === target), `${route}: missing ${target}`);

  const post = posts.find((candidate) => `/blog/${candidate.slug}` === route);
  if (post) {
    assert.deepEqual(
      generateJSON(withoutAnchors(article), getTiptapExtensions()),
      generateJSON(withoutAnchors(tiptapJsonToHtml(post.content)), getTiptapExtensions()),
      `${route}: prose or formatting changed`
    );
    assert.equal(metadata(html).description, post.meta_description || post.excerpt, `${route}: SEO description changed`);
  }
  assert.equal(metadata(html).canonical, `https://www.sunkool.in${route}`, `${route}: canonical URL changed`);

  for (const link of links) {
    assert.ok(link.anchor.trim(), `${route}: empty anchor`);
    assert.notEqual(link.href, route, `${route}: self-link`);
    assert.ok(published.has(link.href), `${route}: ${link.href} is not in the published sitemap`);
    for (const origin of [base, ...(live ? [new URL(live)] : [])]) {
      const destination = new URL(link.href, origin).href;
      if (!checked.has(destination)) {
        await get(destination);
        checked.set(destination, true);
      }
    }
  }
  if (live) {
    const liveHtml = await get(new URL(route, live));
    assert.deepEqual(metadata(html), metadata(liveHtml), `${route}: SEO metadata differs from the current live article`);
  }
  if (output) fs.writeFileSync(path.join(output, `${route.split("/").pop()}.html`), html);
  report.push({ source: url.href, status: 200, links, prosePreserved: Boolean(post), metadataVerified: Boolean(live) });
  console.log(JSON.stringify(report.at(-1)));
}

const result = { pages: report.length, contextualLinks: report.reduce((sum, page) => sum + page.links.length, 0), checkedUrls: checked.size, results: report };
if (output) fs.writeFileSync(path.join(output, "verification.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify({ passed: true, pages: result.pages, contextualLinks: result.contextualLinks, checkedUrls: result.checkedUrls }));
