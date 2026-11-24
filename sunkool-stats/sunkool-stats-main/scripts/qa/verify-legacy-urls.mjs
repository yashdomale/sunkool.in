// Checks the old Wix URLs against a running server (`next start`, or production after a deploy):
// node scripts/verify-legacy-urls.mjs http://127.0.0.1:3100
// - redirected URLs answer 301 straight to a page that itself answers 200 (no chains),
// - deliberately removed URLs answer 404,
// - redirects that were already live keep their status and target,
// - every sitemap URL answers 200 without redirecting. Article pages (/blog/<slug>) are skipped: each
//   request adds a view in the database the server is connected to. Add --articles to include them,
//   but only against a server started with SKIP_VIEW_COUNT=1 (see src/lib/blog/view-count.ts).
import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "http://127.0.0.1:3100");
const includeArticles = process.argv.includes("--articles");
const WF = "/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film";
const PPF = "/sunkool-paint-protection-film-for-car-sunkool-paint-protection-film-in-nagpur";

// [old path, expected final path] - 301 to exactly that path.
const moved = [
  ["/warranty-checker", "/warranty"],
  ["/warranty-registration", "/warranty"],
  ["/warranty-regestration", "/warranty"],
  [`${WF}-in-nagpur`, "/nagpur"],
  [`${WF}-in-nagpur-2`, "/nagpur"],
  [`${WF}-in-nagpur-3`, "/nagpur"], // reported in Search Console
  [`${WF}-in-nagpur-6`, "/nagpur"],
  ["/sunkool-sun-heat-control-window-film-sunkool-sun-heat-control-window-film-in-nagpur", "/nagpur"],
  ["/sunkool-sun-heat-control-window-safety-glazing-for-car-sunkool-in-nagpur", "/nagpur"],
  ["/sunkool-window-safety-glazing-sunkool-window-safety-glazing-in-nagpur", "/nagpur"],
  ["/heat-control-window-film", "/window-film"],
  ["/enhance-your-car-with-paint-protection-film", "/ppf"],
  ["/blog/categories/car-tint", "/blog?category=window-film"],
  ["/blog/categories/car-window-safety-glazing", "/blog?category=window-film"],
  ["/blog/tags/car-window-safety-glazing", "/blog?category=window-film"],
  [WF, "/window-film"],
  [`${WF}-1`, "/window-film"],
  [PPF, "/ppf"],
  [`${PPF}-2`, "/ppf"],
  ["/paint-protection-film-installation-shop-in-nagpur-sunkool-paint-protection-film-ppf", "/ppf"],
  ["/blog/page/2", "/blog"],
  ["/blog/page/6", "/blog"],
];

// Already redirected before this change (308); must be untouched.
const unchanged = [
  ["/paint-protection-film", "/ppf"],
  ["/about-1", "/regulations"],
];

// No exact equivalent here (car-model pages, other services, Wix app paths): must stay 404.
const gone = [
  "/sunkool-paint-protection-film-on-tata-harrier-sunkool-paint-protection-film-in-nagpur-6",
  "/sunkool-paint-protection-film-on-hyundai-alcazar-sunkool-paint-protection-film-in-nagpur",
  "/sunkool-paint-protection-film-on-kia-carnival-sunkool-paint-protection-film-in-nagpur-5",
  "/sunkool-paint-protection-film-for-kia-carnival-sunkool-paint-protection-film-in-nagpur",
  "/sunkool-paint-protection-film-on-hyundai-creta-sunkool-paint-protection-film-in-nagpur",
  "/sunkool-paint-protection-film-on-mahindra-thar-sunkool-paint-protection-film-in-nagpur-8",
  "/sunkool-sun-heat-control-window-film-on-hyundai-alcazar-sunkool-sun-heat-control-window-film",
  "/sunkool-paint-protection-film-on-mahindra-xuv-700-sunkool-paint-protection-in-nagpur",
  "/sunkool-sun-heat-control-window-safety-glazing-on-hyundai-alcazar-sunkool-window-safety-glazing",
  "/ceramic-coating",
  "/graphene-coating",
  "/car-door-edge-guard-protector-sunkool-door-edge-pro",
  "/door-edge-guard", // used to 308 to /ultra-edge, a different product
  "/shop",
  // Retired Wix tags/categories with no same-subject category on the new blog: no catch-all to /blog.
  "/blog/categories/car-ppf",
  "/blog/categories/cars",
  "/blog/tags/benefits-of-ppf",
  "/blog/tags/automotive",
  "/this-page-never-existed",
];

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
const request = (path) => fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(30000) });

async function expectRedirect(from, to, status) {
  const response = await request(from);
  assert.equal(response.status, status, `HTTP ${response.status}, expected ${status}`);
  const location = new URL(response.headers.get("location") ?? "", base);
  const path = `${location.pathname}${location.search}`;
  assert.equal(path, to, `Location ${path}, expected ${to}`);
  const target = await request(path);
  assert.equal(target.status, 200, `destination ${to} answers ${target.status}, expected 200 (a chain or a dead target)`);
}

for (const [from, to] of moved) await check(`301 ${from} -> ${to}`, () => expectRedirect(from, to, 301));
for (const [from, to] of unchanged) await check(`308 ${from} -> ${to}`, () => expectRedirect(from, to, 308));
for (const path of gone) {
  await check(`404 ${path}`, async () => assert.equal((await request(path)).status, 404));
}

const sitemap = await (await request("/sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
await check(`sitemap has ${urls.length} URLs, none of them an old URL`, () => {
  assert.ok(urls.length > 10, "sitemap looks empty");
  const old = new Set([...moved, ...unchanged].map(([from]) => from).concat(gone));
  assert.deepEqual(urls.filter((url) => old.has(url)), []);
});
const skipped = includeArticles ? [] : urls.filter((url) => /^\/blog\/[^/]+$/.test(url));
for (const url of urls.filter((url) => !skipped.includes(url))) {
  // Posts come from the database; on a build without one they are simply absent from the sitemap.
  await check(`200 sitemap ${url}`, async () => assert.equal((await request(url)).status, 200));
}

if (skipped.length) {
  console.log(`skip  ${skipped.length} article page(s): each request adds a view in the connected database; use --articles with SKIP_VIEW_COUNT=1 on the server`);
}
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
