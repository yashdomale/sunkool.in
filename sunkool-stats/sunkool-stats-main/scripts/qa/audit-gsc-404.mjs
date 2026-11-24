// Audit of the 128 URLs in Search Console's "Page indexing > Not found (404)" report (last update
// 23/10/2026, validation failed 17/10/2026). Every URL is classified once, here, and then checked
// against a running server (`next start`, or production after a deploy):
//
//   node scripts/qa/audit-gsc-404.mjs http://127.0.0.1:3100            human-readable run
//   node scripts/qa/audit-gsc-404.mjs http://127.0.0.1:3100 --markdown  rows for SEO_404_FIX_REPORT.md
//
// Groups (the A-D of the repair brief):
//   A  restore (200)   - none: no old page has recoverable content or a route on this site
//   B  301 redirect    - the old page has an exact equivalent: same subject, nothing lost
//   C  stays 404       - no equivalent; redirecting would be a soft 404 that Google ignores
//   D  technical       - not an SEO page (stale deployment chunks, Wix runtime API, other host)
//
// Redirect rules live in src/lib/legacy-redirects.ts (+ two inline in next.config.ts). The sibling
// scripts/qa/verify-legacy-urls.mjs keeps its smaller, hand-picked regression list.
import assert from "node:assert/strict";
import fs from "node:fs";

const markdown = process.argv.includes("--markdown");
const exportFile = process.argv.find((a) => a.startsWith("--gsc-export="))?.slice("--gsc-export=".length);
const base = new URL(process.argv.slice(2).find((a) => !a.startsWith("--")) || "http://127.0.0.1:3100");

const WF = "/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film";
const PPF_SERVICE = "/sunkool-paint-protection-film-for-car-sunkool-paint-protection-film-in-nagpur";
const P = "/sunkool-paint-protection-film-on-";
const WINDOW_FILM_CATEGORY = "/blog?category=window-film";

// Why a URL stays 404 - one sentence per kind, reused in the report.
const WHY = {
  model: "Car-model landing page; no model-specific page exists here, and /ppf or /window-film would be a soft 404",
  article: "Old Wix article with no equivalent post on the new blog (checked all 20 published posts)",
  taxonomy: "Retired Wix blog tag/category; no matching category on the new blog",
  promo: "Expired promotion",
  product: "No such product or service on the new site",
};

// [crawled, path, group, destination | kind, priority]. Paths exactly as Search Console lists them.
// Rows marked `truncated` had their end hidden by the console's hover icons in the screenshots, so
// the path below is a best reading, not a fact: #30 is confirmed by the Internet Archive's index,
// #120 is only inferred (-in-nagpur, -3, -5 and -6 are already other rows, leaving -2 as the one
// archived variant). The 7th element is the visible prefix. Run with --gsc-export=<file> against the
// real export to replace the reading with the exact URL.
const rows = [
  ["24 Oct", `${P}tata-harrier-sunkool-paint-protection-film-in-nagpur-6`, "C", "model", "Medium"],
  ["23 Oct", "/sunkool-sun-heat-control-window-film-on-range-rover-velar-sunkool-sun-heat-control-window-film", "C", "model", "Medium"],
  ["23 Oct", "/sunkool-paint-protection-film-for-tata-harrier-paint-protection-for-car-in-nagpur", "C", "model", "Medium"],
  ["22 Oct", `${P}toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur-3`, "C", "model", "Medium"],
  ["18 Oct", "/car-door-edge-guard-protector-sunkool-door-edge-pro", "C", "product", "Low"],
  ["18 Oct", `${P}hyundai-venue-sunkool-paint-protection-film-in-nagpur-1`, "C", "model", "Medium"],
  ["12 Oct", `${WF}-in-nagpur-3`, "B", "/nagpur", "High"],
  ["12 Oct", `${P}hyundai-alcazar-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["11 Oct", `${P}kia-carnival-sunkool-paint-protection-film-in-nagpur-5`, "C", "model", "Medium"],
  ["11 Oct", "/sunkool-paint-protection-film-for-kia-carnival-sunkool-paint-protection-film-in-nagpur", "C", "model", "Medium"],
  ["9 Oct", `${P}hyundai-creta-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["9 Oct", `${P}mahindra-thar-sunkool-paint-protection-film-in-nagpur-8`, "C", "model", "Medium"],
  ["8 Oct", "/sunkool-sun-heat-control-window-film-on-hyundai-alcazar-sunkool-sun-heat-control-window-film", "C", "model", "Medium"],
  ["7 Oct", `${P}mahindra-xuv-700-sunkool-paint-protection-in-nagpur`, "C", "model", "Medium"],
  ["6 Oct", "/sunkool-sun-heat-control-window-safety-glazing-on-hyundai-alcazar-sunkool-window-safety-glazing", "C", "model", "Medium"],
  ["6 Oct", "/sunkool-paint-protection-film-for-kia-seltos-car-paint-protection-in-nagpur", "C", "model", "Medium"],
  ["5 Oct", `${P}toyota-fortuner-sunkool-paint-protection-film-in-nagpur-2`, "C", "model", "Medium"],
  ["5 Oct", "/_next/static/chunks/1mjts83nua1b9.js?dpl=dpl_6btLEYU78F7JdCd7bLYadSBs7GVR", "D", "chunk", "Low"],
  ["4 Oct", "/sunkool-paint-protection-film-why-you-need-for-your-car", "C", "article", "Medium"],
  ["3 Oct", "/_next/static/chunks/17m751vdv9dkj.css?dpl=dpl_3N6wby7Rexf3pyKu6o78tHYvQEQE", "D", "chunk", "Low"],
  ["30 Sep", "/paint-protection-film-installation-shop-in-nagpur-sunkool-paint-protection-film-ppf", "B", "/ppf", "High"],
  ["27 Sep", "/_next/static/chunks/15mgj0xt3_mld.js?dpl=dpl_6btLEYU78F7JdCd7bLYadSBs7GVR", "D", "chunk", "Low"],
  ["27 Sep", `${P}tata-punch-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["26 Sep", "/_next/static/chunks/2ag1xe5fixdhj.js?dpl=dpl_6btLEYU78F7JdCd7bLYadSBs7GVR", "D", "chunk", "Low"],
  ["25 Sep", "/items", "C", "product", "Low"],
  ["17 Sep", `${P}mahindra-thar-sunkool-paint-protection-film-in-nagpur-9`, "C", "model", "Medium"],
  ["17 Sep", "/enhance-your-car-with-paint-protection-film", "B", "/ppf", "High"],
  ["17 Sep", `${P}toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["17 Sep", `${P}maruti-suzuki-vitara-brezza-sunkool-paint-protection-film-in-nagp`, "C", "model", "Medium"],
  ["17 Sep", "/sunkool-matte-paint-protection-film-on-tata-safari-sunkool-matte-paint-protection-film-in-nagpur", "C", "model", "Medium", "truncated", "/sunkool-matte-paint-protection-film-on-tata-safari-sunkool-matte-paint-protection-film-i"],
  ["16 Sep", "/sunkool-sun-heat-control-window-safety-glazing-for-car-sunkool-in-nagpur", "B", "/nagpur", "High"],
  ["16 Sep", "/december-delight-offer-is-live-sunkool-paint-protection-film-in-nagpur", "C", "promo", "Low"],
  ["12 Sep", `${P}hyundai-creta-sunkool-paint-protection-film-in-nagpur-1`, "C", "model", "Medium"],
  ["11 Sep", `${P}bmw-m340i-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["11 Sep", "/blog/categories/automobiles", "C", "taxonomy", "Low"],
  ["11 Sep", "/sunkool-signature-paint-protection-film-on-mercedes-glc-300-sunkool-paint-protection-film-in-nagpu", "C", "model", "Medium"],
  ["10 Sep", `${P}jaguar-xe`, "C", "model", "Medium"],
  ["10 Sep", `${WF}-in-nagpur`, "B", "/nagpur", "High"],
  ["10 Sep", `${P}mg-zs-ev-sunkool-paint-protection-film-in-nagpur-1`, "C", "model", "Medium"],
  ["9 Sep", "/heat-control-window-film", "B", "/window-film", "High"],
  ["8 Sep", `${P}kia-carnival-sunkool-paint-protection-film-in-nagpur-6`, "C", "model", "Medium"],
  ["7 Sep", `${WF}-1`, "B", "/window-film", "High"],
  ["6 Sep", `${P}toyota-urban-cruiser-hyryder-sunkool-paint-protection-film-1`, "C", "model", "Medium"],
  ["5 Sep", "/blog/categories/car-window-safety-glazing", "B", WINDOW_FILM_CATEGORY, "Medium"],
  ["4 Sep", "/sunkool-paint-protection-film-for-tata-harrier", "C", "model", "Medium"],
  ["4 Sep", "/sunkool-sun-heat-control-window-film-on-skoda-slavia-sunkool-sun-heat-control-window-film-nagpur", "C", "model", "Medium"],
  ["2 Sep", `${P}mg-gloster-sunkool-paint-protection-film-in-nagpur-3`, "C", "model", "Medium"],
  ["31 Aug", "/sunkool-signature-paint-protection-film-on-range-rover-velar-sunkool-paint-protection-film-in-nagp", "C", "model", "Medium"],
  ["30 Aug", "/_api/v2/dynamicmodel", "D", "wix-api", "Low"],
  ["29 Aug", `${P}audi-q3-sunkool-paint-protection-film-in-nagpur-1`, "C", "model", "Medium"],
  ["28 Aug", "/sunkool-matte-paint-protection-film-on-bmw-x5-sunkool-matte-paint-protection-film-in-nagpur-1", "C", "model", "Medium"],
  ["26 Aug", "/blog/categories/cars", "C", "taxonomy", "Low"],
  ["26 Aug", `${P}toyota-urban-cruiser-hyryder-sunkool-paint-protection-film-nagpur-1`, "C", "model", "Medium"],
  ["21 Aug", "/blog/categories/sunkool", "C", "taxonomy", "Low"],
  ["21 Aug", `${P}byd-sunkool-paint-protection-film-in-nagpur-1`, "C", "model", "Medium"],
  ["18 Aug", "/blog/categories/car-detailing", "C", "taxonomy", "Low"],
  ["18 Aug", `${P}audi-q3-sunkool-paint-protection-film-in-nagpur-2`, "C", "model", "Medium"],
  ["16 Aug", `${P}land-rover-defender-sunkool-paint-protection-film-in-nagpur-1`, "C", "model", "Medium"],
  ["16 Aug", "/sunkool-matte-black-paint-protection-film-on-mercedes-g-wagon-sunkool-paint-protection-film-in-nag", "C", "model", "Medium"],
  ["16 Aug", `${WF}-in-nagpur-6`, "B", "/nagpur", "High"],
  ["15 Aug", "/sunkool-black-paint-protection-film-on-audi-a6-sunkool-black-paint-protection-film-in-nagpur", "C", "model", "Medium"],
  ["15 Aug", `${P}scorpio-classic-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["15 Aug", "/sunkool-sun-heat-control-window-safety-glazing-on-toyota-fortuner", "C", "model", "Medium"],
  ["15 Aug", "/sunkool-sun-heat-control-window-film-sunkool-sun-heat-control-window-film-in-nagpur", "B", "/nagpur", "High"],
  ["14 Aug", "/sunkool-paint-protection-film-for-mahindra-xuv-700-sunkool-paint-protection-film-in-nagpur", "C", "model", "Medium"],
  ["14 Aug", `${P}grand-vitara-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["14 Aug", WF, "B", "/window-film", "High"],
  ["14 Aug", `${P}skoda-kodiaq-sunkool-paint-protection-film-in-nagpur-6`, "C", "model", "Medium"],
  ["14 Aug", "/sunkool-matte-paint-protection-film-on-land-rover-defender-sunkool-paint-protection-film-in-nagpur", "C", "model", "Medium"],
  ["13 Aug", `${P}tata-harrier-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["13 Aug", "/blog/categories/car-tint", "B", WINDOW_FILM_CATEGORY, "Medium"],
  ["12 Aug", "/sunkool-sun-heat-control-window-film-on-toyota-fortuner-sunkool-sun-heat-control-window-film", "C", "model", "Medium"],
  ["12 Aug", `${P}hyundai-tucson-sunkool-paint-protection-film-in-nagpur-1`, "C", "model", "Medium"],
  ["12 Aug", `${WF}-in-nagpur-5`, "B", "/nagpur", "High"],
  ["12 Aug", `${P}byd-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["12 Aug", "/sunkool-paint-protection-film-for-bmw-paint-protection-film-service-in-nagpur", "C", "model", "Medium"],
  ["11 Aug", "/what-are-swirl-marks-on-a-vehicle", "C", "article", "Medium"],
  ["11 Aug", `${P}toyota-urban-cruiser-hyryder-sunkool-paint-protection-film`, "C", "model", "Medium"],
  ["11 Aug", `${P}skoda-kodiaq-sunkool-paint-protection-film-in-nagpur-1`, "C", "model", "Medium"],
  ["10 Aug", PPF_SERVICE, "B", "/ppf", "High"],
  ["9 Aug", "/sunkool-window-safety-glazing-sunkool-window-safety-glazing-in-nagpur", "B", "/nagpur", "High"],
  ["8 Aug", "/sunkool-clear-heat-control-solution-on-mahindra-thar-roxx", "C", "model", "Medium"],
  ["7 Aug", "/sunkool-matte-paint-protection-film-on-mini-cooper-sunkool-paint-protection-film-in-nagpur", "C", "model", "Medium"],
  ["6 Aug", "/blog/tags/detailers", "C", "taxonomy", "Low"],
  ["6 Aug", `${P}mahindra-thar-sunkool-paint-protection-film-in-nagpur-5`, "C", "model", "Medium"],
  ["1 Aug", "/blog/tags/sunkool-paint-protection-film", "C", "taxonomy", "Low"],
  ["1 Aug", "/blog/tags/sunkool-paint-protection-film-3", "C", "taxonomy", "Low"],
  ["1 Aug", "/blog/tags/sunkool-clear-heat-control-solution-on-mahindra-thar-roxx", "C", "taxonomy", "Low"],
  ["1 Aug", "/blog/categories/mahindra-thar-heat-blocking-tint", "C", "taxonomy", "Low"],
  ["1 Aug", "/blog/tags/sunkool-ppf-on-land-rover-defender", "C", "taxonomy", "Low"],
  ["1 Aug", "/blog/tags/sunkool-in-nagpur-1", "C", "taxonomy", "Low"],
  ["31 Jul", "/blog/tags/sunkool", "C", "taxonomy", "Low"],
  ["31 Jul", "/blog/tags/sunkool-paint-protection-film-in-nagpur-2", "C", "taxonomy", "Low"],
  ["31 Jul", "/blog/tags/car-window-safety-glazing", "B", WINDOW_FILM_CATEGORY, "Medium"],
  ["31 Jul", "/blog/categories/mahindra-that-roxx", "C", "taxonomy", "Low"],
  ["31 Jul", "/blog/tags/sunkool-ppf-in-nagpur-1", "C", "taxonomy", "Low"],
  ["31 Jul", "/how-heat-control-window-film-for-car-helps-in-reduce-heat-temperature-in-your-car", "C", "article", "Medium"],
  ["30 Jul", "/blog/tags/car-detailers", "C", "taxonomy", "Low"],
  ["30 Jul", "/blog/tags/benefits-of-ppf", "C", "taxonomy", "Low"],
  ["30 Jul", "/sunkool-clear-heat-control-glazing-on-toyota-fortuner", "C", "model", "Medium"],
  ["30 Jul", "/blog/tags/automobiles", "C", "taxonomy", "Low"],
  ["30 Jul", "/blog/tags/automotive-1", "C", "taxonomy", "Low"],
  ["30 Jul", "/blog/tags/automotive", "C", "taxonomy", "Low"],
  ["29 Jul", "/blog/tags/benefits-of-sunkool-paint-protection-film-4", "C", "taxonomy", "Low"],
  ["29 Jul", "/blog/tags/benefits-of-sunkool-paint-protection-film-1", "C", "taxonomy", "Low"],
  ["28 Jul", "/blog/tags/ppf-installation-in-nagpur", "C", "taxonomy", "Low"],
  ["28 Jul", "/blog/categories/mahindra-thar-window-tint", "C", "taxonomy", "Low"],
  ["28 Jul", "/blog/tags/sunkool-paint-protection-film-in-nagpur-9", "C", "taxonomy", "Low"],
  ["28 Jul", "/blog/categories/toyota-fortuner", "C", "taxonomy", "Low"],
  ["28 Jul", "/blog/tags/sunkool-1", "C", "taxonomy", "Low"],
  ["27 Jul", "/sunkool-matte-paint-protection-film-on-tata-safari-sunkool-paint-protection-film-in-nagpur", "C", "model", "Medium"],
  ["27 Jul", `${P}kia-ev6-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["27 Jul", "/sunkool-paint-protection-film-useful-in-rainy-seasons-to-protect-vehicle-from-scratches", "C", "article", "Medium"],
  ["25 Jul", `${P}hyundai-venue-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["25 Jul", `${P}kia-carnival-sunkool-paint-protection-film-in-nagpur-3`, "C", "model", "Medium"],
  ["24 Jul", `${P}toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur-5`, "C", "model", "Medium"],
  ["23 Jul", "/paint-protection-film-for-mahindra-scorpio-n-the-benefits-of-paint-protection-film", "C", "article", "Medium"],
  ["22 Jul", "/blog/tags/sunkool-clear-heat-control-solution", "C", "taxonomy", "Low"],
  ["22 Jul", "/sunkool-paint-protection-film-on-bmw-5-series-paint-protection-for-bmw-in-nagpur", "C", "model", "Medium"],
  ["19 Jul", `${WF}-in-nagpur-2`, "B", "/nagpur", "High", "truncated", `${WF}-in-n`],
  ["18 Jul", "/sunkool-sun-heat-control-window-film-sunkool-sun-heat-control-window-film-on-bmw-620d", "C", "model", "Medium"],
  ["18 Jul", `${P}toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur-6`, "C", "model", "Medium"],
  ["17 Jul", `${P}mercedes-gla-200-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["17 Jul", `${P}mercedes-g-wagon-sunkool-paint-protection-film-in-nagpur`, "C", "model", "Medium"],
  ["21 Jun", "https://order.sunkool.in/auth-forgot-password-basic.html", "D", "other-host", "Low"],
  ["18 May", "/graphene-coating", "C", "product", "Medium"],
  ["12 May", "/ceramic-coating", "C", "product", "Medium"],
  ["3 May", "/shop", "C", "product", "Low"],
];

const REASON = {
  ...WHY,
  chunk: "Stale Next.js build asset from an old deployment; not a page, never redirected",
  "wix-api": "Wix runtime API path; nothing on this site references it",
  "other-host": "Different host (order.sunkool.in), served by another app; not part of this site",
};

export const audit = rows.map(([crawled, path, group, target, priority, flag, seen], index) => ({
  n: index + 1,
  crawled,
  path,
  group,
  to: group === "B" ? target : undefined,
  kind: group === "B" ? undefined : target,
  priority,
  truncated: flag === "truncated",
  seen,
  reason: group === "B" ? undefined : REASON[target],
}));

assert.equal(audit.length, 128, "the report lists 128 URLs");
assert.equal(new Set(audit.map((row) => row.path)).size, audit.length, "duplicate URL in the audit");

const request = (path) => fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(30000) });
const where = (response) => {
  const location = response.headers.get("location");
  if (!location) return undefined;
  const url = new URL(location, base);
  return `${url.pathname}${url.search}`;
};

async function check(row) {
  if (row.kind === "other-host") {
    return { ok: true, observed: "n/a", verification: "Not served by this app (order.sunkool.in)" };
  }
  const response = await request(row.path);
  if (row.group === "B") {
    const location = where(response);
    const target = location ? await request(location) : undefined;
    const ok = response.status === 301 && location === row.to && target?.status === 200;
    return {
      ok,
      observed: `${response.status}${location ? ` -> ${location}` : ""}`,
      verification: ok
        ? `301 -> ${row.to} -> 200`
        : `FAIL: ${response.status} ${location ?? ""} then ${target?.status ?? "-"}, expected 301 -> ${row.to} -> 200`,
    };
  }
  const ok = response.status === 404;
  return {
    ok,
    observed: String(response.status),
    verification: ok ? "404 (kept on purpose)" : `FAIL: ${response.status}${where(response) ? ` -> ${where(response)}` : ""}, expected 404`,
  };
}

const results = [];
for (const row of audit) results.push({ row, ...(await check(row)) });

if (markdown) {
  const action = (row) =>
    row.group === "B" ? "301 redirect" : row.group === "D" ? "No change (technical)" : "Keep 404";
  const esc = (text) => text.replaceAll("|", "\\|");
  console.log("| # | Old URL | Current status (GSC) | Action | Destination | Verification | Priority |");
  console.log("|---|---|---|---|---|---|---|");
  for (const { row, verification } of results) {
    const url = row.path.startsWith("http") ? row.path : `\`${esc(row.path)}\``;
    const note = row.truncated ? " (end cut off in the screenshot: **requires verification**)" : "";
    console.log(
      `| ${row.n} | ${url}${note} | 404, crawled ${row.crawled} | ${action(row)} | ${row.to ? `\`${row.to}\`` : "-"} | ${esc(verification)} | ${row.priority} |`
    );
  }
} else {
  for (const { row, ok, observed } of results) console.log(`${ok ? "ok  " : "FAIL"} ${String(row.n).padStart(3)} ${row.group} ${observed.padEnd(28)} ${row.path}`);
}

// --gsc-export=<file>: a real Search Console CSV export. Either the Page indexing > Not found (404)
// export (columns URL, Last crawled) or a Performance > Pages export (Top pages, Clicks, Impressions,
// CTR, Position), or both concatenated into one file. It
//  - lists every exported URL this audit has not classified (so nothing is silently unevaluated),
//  - replaces the two truncated screenshot readings with the exact URL and re-checks that URL,
//  - shows clicks/impressions for the pages that stay 404, so you can see which are worth restoring.
// Output goes to stderr so --markdown stays clean.
function parseCsv(text) {
  const out = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch !== '"') {
        field += ch;
      } else if (text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        quoted = false;
      }
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((cell) => cell !== "")) out.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((cell) => cell !== "")) out.push(row);
  return out;
}

if (exportFile) {
  const toPath = (url) => {
    try {
      const parsed = new URL(url, "https://www.sunkool.in");
      return decodeURI(parsed.pathname).replace(/\/+$/, "") + parsed.search;
    } catch {
      return url;
    }
  };
  const table = parseCsv(fs.readFileSync(exportFile, "utf8").replace(/^﻿/, ""));
  // A combined file may hold several tables; each header row starts a new one.
  const isHeader = (cells) => cells.some((cell) => /^(url|page|top pages?|pages)$/i.test(cell.trim()));
  let columns = null;
  const exported = new Map();
  for (const cells of table) {
    if (isHeader(cells)) {
      const find = (...names) => cells.findIndex((cell) => names.includes(cell.trim().toLowerCase()));
      columns = { url: find("url", "page", "top pages", "top page", "pages"), clicks: find("clicks"), impressions: find("impressions"), position: find("position") };
      continue;
    }
    if (!columns || columns.url < 0 || !cells[columns.url]) continue;
    const path = toPath(cells[columns.url].trim());
    const number = (index) => (index >= 0 ? Number(String(cells[index] ?? "").replace(/[,%\s]/g, "")) || 0 : undefined);
    const entry = exported.get(path) ?? {};
    exported.set(path, {
      clicks: Math.max(entry.clicks ?? 0, number(columns.clicks) ?? 0),
      impressions: Math.max(entry.impressions ?? 0, number(columns.impressions) ?? 0),
      hasMetrics: entry.hasMetrics || columns.impressions >= 0 || columns.clicks >= 0,
    });
  }
  console.error(`\n--gsc-export: ${exported.size} distinct URLs read from ${exportFile}`);

  const known = new Set(audit.map((row) => row.path));
  const unevaluated = [...exported.keys()].filter((path) => !known.has(path) && !path.startsWith("/_next/"));
  console.error(`not classified by this audit: ${unevaluated.length}`);
  for (const path of unevaluated.slice(0, 60)) console.error(`  ${path}`);

  for (const row of audit.filter((r) => r.truncated)) {
    const matches = [...exported.keys()].filter((path) => path.startsWith(row.seen));
    console.error(`\n#${row.n} (truncated) visible prefix matches ${matches.length} exported URL(s):`);
    for (const path of matches) {
      const res = await check({ ...row, path });
      console.error(`  ${res.ok ? "ok  " : "FAIL"} ${path}  ${res.verification}${path === row.path ? "" : "   <- differs from the audit's reading"}`);
    }
  }

  const rank = audit
    .filter((row) => ["model", "article", "product", "taxonomy"].includes(row.kind))
    .map((row) => ({ row, ...(exported.get(row.path) ?? {}) }))
    .filter((item) => item.hasMetrics && (item.impressions > 0 || item.clicks > 0))
    .sort((a, b) => b.impressions - a.impressions);
  console.error(`\nstill-404 pages with search traffic in the export: ${rank.length}`);
  for (const { row, clicks, impressions } of rank.slice(0, 40)) console.error(`  #${row.n} ${String(impressions).padStart(6)} impr ${String(clicks).padStart(4)} clicks  ${row.kind}  ${row.path}`);
  if (![...exported.values()].some((value) => value.hasMetrics)) console.error("(this export has no Clicks/Impressions columns - add a Performance > Pages export to rank them)");
}

const failures = results.filter((result) => !result.ok);
const count = (group) => audit.filter((row) => row.group === group).length;
console.error(
  `\n${audit.length} URLs: ${count("B")} redirected (B), ${count("C")} kept 404 (C), ${count("D")} technical (D); ${failures.length} unexpected result(s)`
);
process.exit(failures.length ? 1 : 0);
