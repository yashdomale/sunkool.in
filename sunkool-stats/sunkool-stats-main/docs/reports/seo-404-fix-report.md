# SEO 404 Repair Report — sunkool.in

**Date:** 2026-10-31
**Source:** Google Search Console › Page indexing › *Not found (404)* — last update 23/10/2026, validation failed 17/10/2026, **128 affected URLs** (all 128 read from your screenshots).

> **Status: the SEO repair is complete and verified locally. It is staged on a local branch but not committed, pushed, deployed or merged.** The live site still behaves as it did before (§4). Nothing here shows that Google has indexed, removed or reclassified any URL: that needs a deploy and then Search Console evidence (§10).
>
> **The chatbot is untouched.** It is not part of this repair (§8).

---

## 0. Deployment readiness

Legend: **PASS** = verified and fine · **WARNING** = works, but needs your attention or has a known limit · **FAIL** = does not meet the requirement. *Local* = measured on a local production build on 2026-10-31. *Live* = measured on `https://www.sunkool.in`.

### A. The SEO repair

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | All 17 redirects: relevant destination, HTTP 301, destination 200 | **PASS** (local) | 17 / 17 answer `301` to the exact path in §6, and the destination answers `200` directly. Destinations: `/nagpur` "Car Window Film in Nagpur", `/ppf` "Paint Protection Film (PPF) in Nagpur", `/window-film` "Heat Control Window Film for Cars", `/blog?category=window-film` "Car window film guides for India" (indexable, self-canonical). |
| 2 | No redirect chains, loops or blanket wildcards | **PASS** (local) | Every destination answers 200 directly; unit tests assert that no destination is itself redirected and that no `*`, `(.*)`, `(?!` or `:param+` pattern exists in `redirects()` or the legacy list. |
| 3 | The 105 intentional 404s return a proper 404 | **PASS** (local) | All 105 return `404` (audit). The site's 404 page carries `<meta name="robots" content="noindex">` (checked on a model page, a retired tag and `/ceramic-coating`; the build chunks return a plain-text 404). See row 11 for a cosmetic canonical on these pages. |
| 4 | Gone URLs are out of the sitemap, and nothing links to them | **PASS** (local) | 0 of the 127 on-site old URLs are in `sitemap.xml`; 65 pages crawled (every sitemap page plus 3 more, menus and footers included): 0 links to an old URL, a retired tag/category or the chatbot API route, 0 internal links answering 404, 0 answering a redirect. |
| 5 | Article #27 investigated before deployment | **PASS** — decision: keep the 301 | Archived text read in full and compared with the whole current site. Reasoning in §7.3. |
| 6 | The 66 car-model pages reviewed | **PASS** — none recommended for restoration on content grounds | 65 archived copies analysed; 55 are name-swapped copies of one template. Tiered priority table in §7.4 and Appendix B. |
| 7 | Traffic, backlinks, impressions, rankings for the old URLs | **WARNING — data unavailable** | No Search Console access or export exists in this project or on this machine, and there is no backlink tool. I did **not** estimate any of these. §7.4 and §10 show how to supply the data. |
| 8 | Old content checked for recovery before being discarded | **PASS** | The Internet Archive holds copies of 90 of the 91 non-taxonomy old URLs (Appendix A). Nothing is permanently discarded; the gone URLs can be restored later. |
| 9 | #30 and #120 verified from the full CSV | **WARNING — still unverified** | There is no CSV. #30 is confirmed only by the Internet Archive's index (`…-in-nagpur`); #120 is inferred (`…-in-nagpur-2`: the other archived variants are already rows #7, #38, #60 and #74). Both stay marked "requires verification" in §6. Run the audit with `--gsc-export=` to settle them. |
| 10 | Canonical URLs use `https://www.sunkool.in` | **PASS** (local) | 62 / 62 sitemap URLs checked as Googlebot: HTTP 200, no redirect, a canonical that points to itself on `www.sunkool.in`, no `noindex`. |
| 11 | Canonical tag on the 404 pages | **WARNING — cosmetic, not changed** | Every 404 page carries `<link rel="canonical" href="https://www.sunkool.in/_not-found">`, because the root layout's relative canonical (`"./"`) resolves to Next's internal 404 route. Google ignores canonicals on 404 pages, and the 404 status plus `noindex` decide indexing, so there is no indexing effect. Fixing it needs a new `not-found.tsx`, which would replace the visitor-facing 404 page; I did not do that (your brief: existing design unchanged). |
| 12 | Sitemap, `robots.txt`, indexability, meta robots | **PASS** (local) | Sitemap 62 URLs; `robots.txt` has the sitemap line, disallows `/api/` and `/admin/`, and does **not** block `/_next/`; `verify-blog-seo` 30 / 30 checks. |
| 13 | Next.js assets, stale or broken JS/CSS references | **PASS** (local) | 61 distinct `/_next/static` files referenced by 9 pages, all 200. |
| 14 | Blog metadata and pagination | **PASS** (local) | Covered by `verify-blog-seo.mjs` (canonical, robots, titles, category and `?page=N` handling): all passed. |
| 15 | `npm test` | **PASS** | 356 / 356 — same as the baseline |
| 16 | `npm run build` | **PASS** | Exit 0 (compiled, TypeScript passed, 80/80 pages) — same as the baseline; run again today after the last change |
| 17 | `npm run lint` | **WARNING — unchanged** | 43 findings (36 errors, 7 warnings), identical to the baseline, in 39 files that are identical to `HEAD`: 41 in `src/components/cities/content/**`, 1 in an admin page, 1 in `src/app/opengraph-image.tsx`. 0 in my files. The build does not run lint. |
| 18 | Staged files are exactly the six intended ones | **PASS** | Listed in §9; no chatbot file and no unrelated change is staged. |
| 19 | Live production | **WARNING — not deployed** | `www.sunkool.in` still runs the old rules: the audit reports **35 unexpected results** (7 redirect fixes and 28 retired tags/categories). After your deploy that number must be 0 (§9, §10). |
| 20 | Git and Vercel | **WARNING** | Production is built from `main`; `master` is an **unrelated history** (no common ancestor) and must never be used. The working tree also holds unrelated uncommitted work (warranty files), which stays unstaged. |

### B. The chatbot — unchanged, as instructed

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Chatbot, WhatsApp button, forms, admin, layout, styling, migrations and dependencies unchanged | **PASS** | `git diff HEAD` is empty for `src/chatboat`, `src/app/api`, `src/lib/salesiq.ts`, `src/components/{contact,dealer,layout}`, `src/app/admin`, `src/app/layout.tsx`, `src/app/globals.css`, `src/lib/blog`, `src/types`, `supabase`, `public`, `package.json` and `package-lock.json`. |
| C2 | Nothing chatbot-related staged, no removal branch or commit | **PASS** | The only branch created is `seo/404-repair`; 0 chatbot files in the index. |
| C3 | Chatbot URLs in the sitemap | **PASS** | 0 sitemap entries mention chat, `/api/` or SalesIQ. |
| C4 | `/api/chatbot-leads` | **PASS — by design** | An API endpoint that stays live (`GET` → `200` JSON on the build **and on production**). It is disallowed in `robots.txt`, is `no-store`, is in no sitemap entry and is linked from no page, so it has no search footprint. |
| C5 | None of the 128 Search Console URLs concerns the chatbot | **N/A** | Nothing to classify. |

---

## 1. Result at a glance

| Group | Meaning | URLs |
|---|---|---:|
| **A** Restore (200) | An old page restored | **0** |
| **B** Redirect (301) | The old URL has a same-topic counterpart on the new site | **17** (1 page, 13 old blog posts (12 confirmed from the archive), 3 blog topics) |
| **C** Keep 404 | Permanently gone, no equivalent | **105** |
| **D** Technical | Not an SEO page: stale build chunks, Wix API, another host | **6** |
| | **Total** | **128** |

The 105 that stay 404 are: 66 car-model pages, 28 retired Wix blog tags/categories, 5 old articles, 5 products/services that no longer exist (`/ceramic-coating`, `/graphene-coating`, `/shop`, `/items`, the door-edge guard) and 1 expired promotion.

**The *Not found (404)* count will not drop to zero, and that is correct.** A page that is really gone should return 404. Redirecting 105 unrelated URLs to `/ppf` or `/blog` would make Google classify them as *soft 404s*, which is worse and hides the real gaps.

**Nothing was restored (group A).** Article #27 and the car-model pages were each evaluated against the archived originals (§7.3, §7.4); none met the bar for restoration. They remain recoverable from the Internet Archive.

---

## 2. What changed

| File | Change |
|---|---|
| `src/lib/legacy-redirects.ts` | +2 rules: the two generic Nagpur **window safety glazing** posts → `/nagpur`. +3 rules: the old blog topics **car-tint**, **car-window-safety-glazing** (category) and **car-window-safety-glazing** (tag) → `/blog?category=window-film`. Comment documents the "same subject, nothing lost" rule. |
| `next.config.ts` | **Removed** the two blanket rules `/blog/categories/:slug*` and `/blog/tags/:slug*` → `/blog`. `/heat-control-window-film` and `/enhance-your-car-with-paint-protection-film` switched from `permanent: true` (sent as **308**) to `statusCode: 301`. |
| `src/lib/legacy-redirects.test.ts` | Handles destinations with a query string; new guards: a blog-category destination must have curated category copy (the precondition for being indexable), and **no wildcard/catch-all redirect may exist**. |
| `scripts/qa/verify-legacy-urls.mjs` | Expectations updated to the new rules; compares path **and** query. |
| `scripts/qa/audit-gsc-404.mjs` *(new)* | The 128 URLs, each classified once, checked against any running server. `--markdown` prints the table in §6. `--gsc-export=<file.csv>` reads a real Search Console export: lists any URL not yet classified, re-tests the exact URL for the two truncated rows, and ranks the still-404 pages by clicks and impressions. |
| `SEO_404_FIX_REPORT.md` *(new)* | This report. |

No website source was changed in the latest round: this round added investigation and documentation only. The generated, git-ignored `.next/dev/types/routes.d.ts` was repaired earlier (it had been half-overwritten, probably by two Next processes at once, and failed one build); your dev server has since regenerated it. Nothing to commit.

### Behaviour changes you should know about

1. **7 URLs get a new or corrected redirect** (#27, #31, #40, #44, #71, #81, #94). #31 and #81 were 404 and now go to `/nagpur`. #27 and #40 already redirected correctly but as 308, now 301. #44, #71 and #94 went to the generic `/blog` and now go to the matching category page.
2. **28 retired tags and categories change from a 308 redirect to a 404.** Today they all redirect to `/blog` because of the blanket rules added earlier. Your brief says they must stay 404 and that blanket redirects must not come back, so they now return 404. They are absent from the sitemap and from every internal link.
3. **Mapping judgement.** The two safety-glazing sources (#31, #81) are old Wix *blog posts* (Dec 2023 and Jun 2023, about two minutes' reading) on the topic `/window-film` sells as "nanoceramic window safety glazing" (`src/lib/products.ts`); I sent them where their window-film sibling posts already go. *Car tint* and *window safety glazing* are the topics of the new **Window Film** blog category, which has curated copy and several articles, so it is indexable.

---

## 3. Project analysis

- **Framework:** Next.js 16.2.7, App Router (`src/app`), Turbopack, React 19. No Pages Router, no static HTML, **no `vercel.json`**.
- **Redirects:** `redirects()` in `next.config.ts` plus the 301 rules in `src/lib/legacy-redirects.ts`. `src/proxy.ts` (Next 16's middleware) redirects every non-`www.sunkool.in` host to `www` in production and guards `/admin`.
- **Sitemap:** `src/app/sitemap.ts`, generated from the static pages, the city pages, videos, legal pages, every published blog post and only the *indexable* blog categories. 62 URLs in this build.
- **robots:** `src/app/robots.ts` allows everything except `/api/` and `/admin/`. `/_next/` is deliberately **not** blocked (Googlebot needs the chunks to render the site); keep it that way.
- **Canonicals:** per-page `alternates.canonical`; the root layout supplies a relative default (`"./"`); blog listing canonicals are decided in `src/lib/blog/listing-seo.ts`.
- **Blog:** 20 published posts in 7 categories, in Supabase, served at `/blog/<slug>`. None is an old Wix article.
- **Old Wix references:** none. No source file and none of the 20 published posts links to any URL in the 404 report. One post links to the bare `https://sunkool.in` (production redirects it to `www`; not a 404). Pages link to `w.sunkool.in` (warranty and dealer tools), a separate app.

---

## 4. Verification: local versus live

### Local (production build, `next build` + `next start`, port 3100, 2026-10-31)

| Check | Result |
|---|---|
| `npm run build` | **Pass** (exit 0), run four times; the first failed on the corrupted generated types file mentioned in §2 |
| `npm test` | **356 / 356 pass**, including the new guards |
| ESLint, files I changed | **Clean** |
| `npm run lint`, whole project | **43 problems (36 errors, 7 warnings)**, identical to the baseline, in 39 files that are identical to `HEAD` (`react-hooks/set-state-in-effect` ×26, `no-html-link-for-pages` ×10, `no-unused-vars` ×5, `no-img-element` ×1, `incompatible-library` ×1) |
| 128-URL audit | **128 / 128 as expected**: 17 × `301 → destination → 200`, 105 × `404`, 6 technical (5 × 404, 1 on another host, not testable here) |
| `verify-legacy-urls.mjs` | **Pass**, including all 62 sitemap URLs answering 200 without redirecting |
| `verify-blog-seo.mjs` | **Pass** (30 checks) |
| Next.js assets | **61 / 61 return 200** |
| Sitemap as Googlebot | **62 / 62**: 200, no redirect, self-referencing `www` canonical, no `noindex` |
| Internal-link crawl | 65 pages, 47 distinct internal link targets: 0 old URLs, 0 retired tags/categories, 0 chatbot route, 0 answering 404, 0 answering a redirect |
| Query strings | Preserved (`…/car-tint?utm_source=gsc` → `/blog?utm_source=gsc&category=window-film`) |

Baseline comparison: 356 tests, a passing build and 43 lint findings **exactly as before**; the 62 sitemap URLs and 61 assets match the earlier run.

### Live (`https://www.sunkool.in`, read-only requests, 2026-10-31)

| Check | Result |
|---|---|
| Same 128-URL audit | **35 unexpected results**: 10 of the 17 redirects already match; #27 and #40 redirect correctly but as 308; #31 and #81 are 404; #44, #71 and #94 go to `/blog`; all 28 retired tags/categories still get the blanket 308 |
| `/sitemap.xml`, `/robots.txt` | Both `200` |
| `/api/chatbot-leads` | `200` (the chatbot, unchanged) |

The live site is behaving exactly like the code before this repair, as expected before a deploy. **Nothing in the live column proves the repair works on production; the commands in §10 do.**

---

## 5. Technical 404s

| URL | Cause | Action |
|---|---|---|
| `/_next/static/chunks/1mjts83nua1b9.js?dpl=dpl_6btLEYU7…`<br>`/_next/static/chunks/15mgj0xt3_mld.js?dpl=dpl_6btLEYU7…`<br>`/_next/static/chunks/2ag1xe5fixdhj.js?dpl=dpl_6btLEYU7…`<br>`/_next/static/chunks/17m751vdv9dkj.css?dpl=dpl_3N6wby7R…` | Stale build assets. Each filename is the hash of one past deployment (the `dpl_` value is that deployment's ID). Googlebot cached HTML from an old deployment and later asked for its files, which a newer deployment no longer serves. | **No change, and never redirect them to an HTML page.** The current build references only files that exist (61 of 61 return 200). They age out of Search Console by themselves. If they keep appearing after many deploys, look at Vercel's *Skew Protection* setting (availability depends on your plan); I enabled nothing. |
| `/_api/v2/dynamicmodel` | A Wix runtime API path. Nothing in this project references it. | None; correct as 404. |
| `https://order.sunkool.in/auth-forgot-password-basic.html` | A different host (the order portal), served by another app. Search Console shows it because the property is the whole `sunkool.in` domain. | **Outside this repository.** It is a password-reset page and should not be indexable: return `noindex` there (or leave the 404). |

---

## 6. URL-by-URL status

"Current status (GSC)" is what Search Console reported, with the date Google last crawled it; the URLs were crawled before most redirects existed, which is why even redirected URLs show 404 there. "Verification" is the result observed on the **local** production build. **Destination** is only filled for the 17 redirects. Rows #30 and #120 are marked: their end was cut off in the screenshots and **they still require verification** (§0 row 9). **Priority**: *High* = an old post or page now redirected to its same-topic page; *Medium* = would need new content to recover (car-model pages, old articles, the two coating pages; see §7), or a redirected blog topic; *Low* = retired taxonomy, technical assets, the expired promo, and `/shop`, `/items` and the door-edge guard.

| # | Old URL | Current status (GSC) | Action | Destination | Verification | Priority |
|---|---|---|---|---|---|---|
| 1 | `/sunkool-paint-protection-film-on-tata-harrier-sunkool-paint-protection-film-in-nagpur-6` | 404, crawled 24 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 2 | `/sunkool-sun-heat-control-window-film-on-range-rover-velar-sunkool-sun-heat-control-window-film` | 404, crawled 23 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 3 | `/sunkool-paint-protection-film-for-tata-harrier-paint-protection-for-car-in-nagpur` | 404, crawled 23 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 4 | `/sunkool-paint-protection-film-on-toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur-3` | 404, crawled 22 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 5 | `/car-door-edge-guard-protector-sunkool-door-edge-pro` | 404, crawled 18 Oct | Keep 404 | - | 404 (kept on purpose) | Low |
| 6 | `/sunkool-paint-protection-film-on-hyundai-venue-sunkool-paint-protection-film-in-nagpur-1` | 404, crawled 18 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 7 | `/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur-3` | 404, crawled 12 Oct | 301 redirect | `/nagpur` | 301 -> /nagpur -> 200 | High |
| 8 | `/sunkool-paint-protection-film-on-hyundai-alcazar-sunkool-paint-protection-film-in-nagpur` | 404, crawled 12 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 9 | `/sunkool-paint-protection-film-on-kia-carnival-sunkool-paint-protection-film-in-nagpur-5` | 404, crawled 11 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 10 | `/sunkool-paint-protection-film-for-kia-carnival-sunkool-paint-protection-film-in-nagpur` | 404, crawled 11 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 11 | `/sunkool-paint-protection-film-on-hyundai-creta-sunkool-paint-protection-film-in-nagpur` | 404, crawled 9 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 12 | `/sunkool-paint-protection-film-on-mahindra-thar-sunkool-paint-protection-film-in-nagpur-8` | 404, crawled 9 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 13 | `/sunkool-sun-heat-control-window-film-on-hyundai-alcazar-sunkool-sun-heat-control-window-film` | 404, crawled 8 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 14 | `/sunkool-paint-protection-film-on-mahindra-xuv-700-sunkool-paint-protection-in-nagpur` | 404, crawled 7 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 15 | `/sunkool-sun-heat-control-window-safety-glazing-on-hyundai-alcazar-sunkool-window-safety-glazing` | 404, crawled 6 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 16 | `/sunkool-paint-protection-film-for-kia-seltos-car-paint-protection-in-nagpur` | 404, crawled 6 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 17 | `/sunkool-paint-protection-film-on-toyota-fortuner-sunkool-paint-protection-film-in-nagpur-2` | 404, crawled 5 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 18 | `/_next/static/chunks/1mjts83nua1b9.js?dpl=dpl_6btLEYU78F7JdCd7bLYadSBs7GVR` | 404, crawled 5 Oct | No change (technical) | - | 404 (kept on purpose) | Low |
| 19 | `/sunkool-paint-protection-film-why-you-need-for-your-car` | 404, crawled 4 Oct | Keep 404 | - | 404 (kept on purpose) | Medium |
| 20 | `/_next/static/chunks/17m751vdv9dkj.css?dpl=dpl_3N6wby7Rexf3pyKu6o78tHYvQEQE` | 404, crawled 3 Oct | No change (technical) | - | 404 (kept on purpose) | Low |
| 21 | `/paint-protection-film-installation-shop-in-nagpur-sunkool-paint-protection-film-ppf` | 404, crawled 30 Sep | 301 redirect | `/ppf` | 301 -> /ppf -> 200 | High |
| 22 | `/_next/static/chunks/15mgj0xt3_mld.js?dpl=dpl_6btLEYU78F7JdCd7bLYadSBs7GVR` | 404, crawled 27 Sep | No change (technical) | - | 404 (kept on purpose) | Low |
| 23 | `/sunkool-paint-protection-film-on-tata-punch-sunkool-paint-protection-film-in-nagpur` | 404, crawled 27 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 24 | `/_next/static/chunks/2ag1xe5fixdhj.js?dpl=dpl_6btLEYU78F7JdCd7bLYadSBs7GVR` | 404, crawled 26 Sep | No change (technical) | - | 404 (kept on purpose) | Low |
| 25 | `/items` | 404, crawled 25 Sep | Keep 404 | - | 404 (kept on purpose) | Low |
| 26 | `/sunkool-paint-protection-film-on-mahindra-thar-sunkool-paint-protection-film-in-nagpur-9` | 404, crawled 17 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 27 | `/enhance-your-car-with-paint-protection-film` | 404, crawled 17 Sep | 301 redirect | `/ppf` | 301 -> /ppf -> 200 | High |
| 28 | `/sunkool-paint-protection-film-on-toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur` | 404, crawled 17 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 29 | `/sunkool-paint-protection-film-on-maruti-suzuki-vitara-brezza-sunkool-paint-protection-film-in-nagp` | 404, crawled 17 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 30 | `/sunkool-matte-paint-protection-film-on-tata-safari-sunkool-matte-paint-protection-film-in-nagpur` (end cut off in the screenshot: **requires verification**) | 404, crawled 17 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 31 | `/sunkool-sun-heat-control-window-safety-glazing-for-car-sunkool-in-nagpur` | 404, crawled 16 Sep | 301 redirect | `/nagpur` | 301 -> /nagpur -> 200 | High |
| 32 | `/december-delight-offer-is-live-sunkool-paint-protection-film-in-nagpur` | 404, crawled 16 Sep | Keep 404 | - | 404 (kept on purpose) | Low |
| 33 | `/sunkool-paint-protection-film-on-hyundai-creta-sunkool-paint-protection-film-in-nagpur-1` | 404, crawled 12 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 34 | `/sunkool-paint-protection-film-on-bmw-m340i-sunkool-paint-protection-film-in-nagpur` | 404, crawled 11 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 35 | `/blog/categories/automobiles` | 404, crawled 11 Sep | Keep 404 | - | 404 (kept on purpose) | Low |
| 36 | `/sunkool-signature-paint-protection-film-on-mercedes-glc-300-sunkool-paint-protection-film-in-nagpu` | 404, crawled 11 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 37 | `/sunkool-paint-protection-film-on-jaguar-xe` | 404, crawled 10 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 38 | `/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur` | 404, crawled 10 Sep | 301 redirect | `/nagpur` | 301 -> /nagpur -> 200 | High |
| 39 | `/sunkool-paint-protection-film-on-mg-zs-ev-sunkool-paint-protection-film-in-nagpur-1` | 404, crawled 10 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 40 | `/heat-control-window-film` | 404, crawled 9 Sep | 301 redirect | `/window-film` | 301 -> /window-film -> 200 | High |
| 41 | `/sunkool-paint-protection-film-on-kia-carnival-sunkool-paint-protection-film-in-nagpur-6` | 404, crawled 8 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 42 | `/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-1` | 404, crawled 7 Sep | 301 redirect | `/window-film` | 301 -> /window-film -> 200 | High |
| 43 | `/sunkool-paint-protection-film-on-toyota-urban-cruiser-hyryder-sunkool-paint-protection-film-1` | 404, crawled 6 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 44 | `/blog/categories/car-window-safety-glazing` | 404, crawled 5 Sep | 301 redirect | `/blog?category=window-film` | 301 -> /blog?category=window-film -> 200 | Medium |
| 45 | `/sunkool-paint-protection-film-for-tata-harrier` | 404, crawled 4 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 46 | `/sunkool-sun-heat-control-window-film-on-skoda-slavia-sunkool-sun-heat-control-window-film-nagpur` | 404, crawled 4 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 47 | `/sunkool-paint-protection-film-on-mg-gloster-sunkool-paint-protection-film-in-nagpur-3` | 404, crawled 2 Sep | Keep 404 | - | 404 (kept on purpose) | Medium |
| 48 | `/sunkool-signature-paint-protection-film-on-range-rover-velar-sunkool-paint-protection-film-in-nagp` | 404, crawled 31 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 49 | `/_api/v2/dynamicmodel` | 404, crawled 30 Aug | No change (technical) | - | 404 (kept on purpose) | Low |
| 50 | `/sunkool-paint-protection-film-on-audi-q3-sunkool-paint-protection-film-in-nagpur-1` | 404, crawled 29 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 51 | `/sunkool-matte-paint-protection-film-on-bmw-x5-sunkool-matte-paint-protection-film-in-nagpur-1` | 404, crawled 28 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 52 | `/blog/categories/cars` | 404, crawled 26 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 53 | `/sunkool-paint-protection-film-on-toyota-urban-cruiser-hyryder-sunkool-paint-protection-film-nagpur-1` | 404, crawled 26 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 54 | `/blog/categories/sunkool` | 404, crawled 21 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 55 | `/sunkool-paint-protection-film-on-byd-sunkool-paint-protection-film-in-nagpur-1` | 404, crawled 21 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 56 | `/blog/categories/car-detailing` | 404, crawled 18 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 57 | `/sunkool-paint-protection-film-on-audi-q3-sunkool-paint-protection-film-in-nagpur-2` | 404, crawled 18 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 58 | `/sunkool-paint-protection-film-on-land-rover-defender-sunkool-paint-protection-film-in-nagpur-1` | 404, crawled 16 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 59 | `/sunkool-matte-black-paint-protection-film-on-mercedes-g-wagon-sunkool-paint-protection-film-in-nag` | 404, crawled 16 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 60 | `/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur-6` | 404, crawled 16 Aug | 301 redirect | `/nagpur` | 301 -> /nagpur -> 200 | High |
| 61 | `/sunkool-black-paint-protection-film-on-audi-a6-sunkool-black-paint-protection-film-in-nagpur` | 404, crawled 15 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 62 | `/sunkool-paint-protection-film-on-scorpio-classic-sunkool-paint-protection-film-in-nagpur` | 404, crawled 15 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 63 | `/sunkool-sun-heat-control-window-safety-glazing-on-toyota-fortuner` | 404, crawled 15 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 64 | `/sunkool-sun-heat-control-window-film-sunkool-sun-heat-control-window-film-in-nagpur` | 404, crawled 15 Aug | 301 redirect | `/nagpur` | 301 -> /nagpur -> 200 | High |
| 65 | `/sunkool-paint-protection-film-for-mahindra-xuv-700-sunkool-paint-protection-film-in-nagpur` | 404, crawled 14 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 66 | `/sunkool-paint-protection-film-on-grand-vitara-sunkool-paint-protection-film-in-nagpur` | 404, crawled 14 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 67 | `/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film` | 404, crawled 14 Aug | 301 redirect | `/window-film` | 301 -> /window-film -> 200 | High |
| 68 | `/sunkool-paint-protection-film-on-skoda-kodiaq-sunkool-paint-protection-film-in-nagpur-6` | 404, crawled 14 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 69 | `/sunkool-matte-paint-protection-film-on-land-rover-defender-sunkool-paint-protection-film-in-nagpur` | 404, crawled 14 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 70 | `/sunkool-paint-protection-film-on-tata-harrier-sunkool-paint-protection-film-in-nagpur` | 404, crawled 13 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 71 | `/blog/categories/car-tint` | 404, crawled 13 Aug | 301 redirect | `/blog?category=window-film` | 301 -> /blog?category=window-film -> 200 | Medium |
| 72 | `/sunkool-sun-heat-control-window-film-on-toyota-fortuner-sunkool-sun-heat-control-window-film` | 404, crawled 12 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 73 | `/sunkool-paint-protection-film-on-hyundai-tucson-sunkool-paint-protection-film-in-nagpur-1` | 404, crawled 12 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 74 | `/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur-5` | 404, crawled 12 Aug | 301 redirect | `/nagpur` | 301 -> /nagpur -> 200 | High |
| 75 | `/sunkool-paint-protection-film-on-byd-sunkool-paint-protection-film-in-nagpur` | 404, crawled 12 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 76 | `/sunkool-paint-protection-film-for-bmw-paint-protection-film-service-in-nagpur` | 404, crawled 12 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 77 | `/what-are-swirl-marks-on-a-vehicle` | 404, crawled 11 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 78 | `/sunkool-paint-protection-film-on-toyota-urban-cruiser-hyryder-sunkool-paint-protection-film` | 404, crawled 11 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 79 | `/sunkool-paint-protection-film-on-skoda-kodiaq-sunkool-paint-protection-film-in-nagpur-1` | 404, crawled 11 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 80 | `/sunkool-paint-protection-film-for-car-sunkool-paint-protection-film-in-nagpur` | 404, crawled 10 Aug | 301 redirect | `/ppf` | 301 -> /ppf -> 200 | High |
| 81 | `/sunkool-window-safety-glazing-sunkool-window-safety-glazing-in-nagpur` | 404, crawled 9 Aug | 301 redirect | `/nagpur` | 301 -> /nagpur -> 200 | High |
| 82 | `/sunkool-clear-heat-control-solution-on-mahindra-thar-roxx` | 404, crawled 8 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 83 | `/sunkool-matte-paint-protection-film-on-mini-cooper-sunkool-paint-protection-film-in-nagpur` | 404, crawled 7 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 84 | `/blog/tags/detailers` | 404, crawled 6 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 85 | `/sunkool-paint-protection-film-on-mahindra-thar-sunkool-paint-protection-film-in-nagpur-5` | 404, crawled 6 Aug | Keep 404 | - | 404 (kept on purpose) | Medium |
| 86 | `/blog/tags/sunkool-paint-protection-film` | 404, crawled 1 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 87 | `/blog/tags/sunkool-paint-protection-film-3` | 404, crawled 1 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 88 | `/blog/tags/sunkool-clear-heat-control-solution-on-mahindra-thar-roxx` | 404, crawled 1 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 89 | `/blog/categories/mahindra-thar-heat-blocking-tint` | 404, crawled 1 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 90 | `/blog/tags/sunkool-ppf-on-land-rover-defender` | 404, crawled 1 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 91 | `/blog/tags/sunkool-in-nagpur-1` | 404, crawled 1 Aug | Keep 404 | - | 404 (kept on purpose) | Low |
| 92 | `/blog/tags/sunkool` | 404, crawled 31 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 93 | `/blog/tags/sunkool-paint-protection-film-in-nagpur-2` | 404, crawled 31 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 94 | `/blog/tags/car-window-safety-glazing` | 404, crawled 31 Jul | 301 redirect | `/blog?category=window-film` | 301 -> /blog?category=window-film -> 200 | Medium |
| 95 | `/blog/categories/mahindra-that-roxx` | 404, crawled 31 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 96 | `/blog/tags/sunkool-ppf-in-nagpur-1` | 404, crawled 31 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 97 | `/how-heat-control-window-film-for-car-helps-in-reduce-heat-temperature-in-your-car` | 404, crawled 31 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 98 | `/blog/tags/car-detailers` | 404, crawled 30 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 99 | `/blog/tags/benefits-of-ppf` | 404, crawled 30 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 100 | `/sunkool-clear-heat-control-glazing-on-toyota-fortuner` | 404, crawled 30 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 101 | `/blog/tags/automobiles` | 404, crawled 30 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 102 | `/blog/tags/automotive-1` | 404, crawled 30 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 103 | `/blog/tags/automotive` | 404, crawled 30 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 104 | `/blog/tags/benefits-of-sunkool-paint-protection-film-4` | 404, crawled 29 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 105 | `/blog/tags/benefits-of-sunkool-paint-protection-film-1` | 404, crawled 29 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 106 | `/blog/tags/ppf-installation-in-nagpur` | 404, crawled 28 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 107 | `/blog/categories/mahindra-thar-window-tint` | 404, crawled 28 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 108 | `/blog/tags/sunkool-paint-protection-film-in-nagpur-9` | 404, crawled 28 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 109 | `/blog/categories/toyota-fortuner` | 404, crawled 28 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 110 | `/blog/tags/sunkool-1` | 404, crawled 28 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 111 | `/sunkool-matte-paint-protection-film-on-tata-safari-sunkool-paint-protection-film-in-nagpur` | 404, crawled 27 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 112 | `/sunkool-paint-protection-film-on-kia-ev6-sunkool-paint-protection-film-in-nagpur` | 404, crawled 27 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 113 | `/sunkool-paint-protection-film-useful-in-rainy-seasons-to-protect-vehicle-from-scratches` | 404, crawled 27 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 114 | `/sunkool-paint-protection-film-on-hyundai-venue-sunkool-paint-protection-film-in-nagpur` | 404, crawled 25 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 115 | `/sunkool-paint-protection-film-on-kia-carnival-sunkool-paint-protection-film-in-nagpur-3` | 404, crawled 25 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 116 | `/sunkool-paint-protection-film-on-toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur-5` | 404, crawled 24 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 117 | `/paint-protection-film-for-mahindra-scorpio-n-the-benefits-of-paint-protection-film` | 404, crawled 23 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 118 | `/blog/tags/sunkool-clear-heat-control-solution` | 404, crawled 22 Jul | Keep 404 | - | 404 (kept on purpose) | Low |
| 119 | `/sunkool-paint-protection-film-on-bmw-5-series-paint-protection-for-bmw-in-nagpur` | 404, crawled 22 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 120 | `/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur-2` (end cut off in the screenshot: **requires verification**) | 404, crawled 19 Jul | 301 redirect | `/nagpur` | 301 -> /nagpur -> 200 | High |
| 121 | `/sunkool-sun-heat-control-window-film-sunkool-sun-heat-control-window-film-on-bmw-620d` | 404, crawled 18 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 122 | `/sunkool-paint-protection-film-on-toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur-6` | 404, crawled 18 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 123 | `/sunkool-paint-protection-film-on-mercedes-gla-200-sunkool-paint-protection-film-in-nagpur` | 404, crawled 17 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 124 | `/sunkool-paint-protection-film-on-mercedes-g-wagon-sunkool-paint-protection-film-in-nagpur` | 404, crawled 17 Jul | Keep 404 | - | 404 (kept on purpose) | Medium |
| 125 | https://order.sunkool.in/auth-forgot-password-basic.html | 404, crawled 21 Jun | No change (technical) | - | Not served by this app (order.sunkool.in) | Low |
| 126 | `/graphene-coating` | 404, crawled 18 May | Keep 404 | - | 404 (kept on purpose) | Medium |
| 127 | `/ceramic-coating` | 404, crawled 12 May | Keep 404 | - | 404 (kept on purpose) | Medium |
| 128 | `/shop` | 404, crawled 3 May | Keep 404 | - | 404 (kept on purpose) | Low |

---

## 7. Content review and open items

### 7.1 Still unverified

1. **#30 and #120** — the end of the URL was hidden by Search Console's hover icons, and there is no CSV on this machine. **They are not verified.** #30 is confirmed only by the Internet Archive's index (`…-in-nagpur`), not by Search Console; #120 is inferred. The redirect rule matches any trailing number, but a wildcard match does not prove which exact URL Google holds. Run `node scripts/qa/audit-gsc-404.mjs <url> --gsc-export=<Not-found export>`: it re-tests the exact URL for both rows.
2. **#125** `order.sunkool.in/auth-forgot-password-basic.html` — another host and another app; not testable here (§5).
3. **#29, #36, #48 and #59** end abruptly (for example `…-in-nagp`) because Wix cut long slugs at roughly 100 characters; they are recorded exactly as listed. All four are car-model pages and return 404. (#48 is the one model page not in the archive's index.)
4. **Traffic and backlinks for any old URL** — see §7.4.
5. **What Google has indexed**, and when it will recrawl.

### 7.2 The old content can be recovered

The Internet Archive holds copies of **90 of the 91** non-taxonomy old URLs (all 31 retired tag/category pages are archived too): 65 of 66 car-model pages, 5 of 5 articles, 5 of 5 product/service pages, the promo, and all 14 redirected posts. They are full pages with the original text. Appendix A links to each. I restored **nothing**; each candidate was evaluated first (§7.3, §7.4).

### 7.3 Article #27 — `/enhance-your-car-with-paint-protection-film`

**Decision: keep the 301 to `/ppf`. No restoration, no code change.**

What the archived original is (latest capture 2026-05-13): "Benefits of Automotive Paint Protection Film", a first-person blog post by "Sagar Maske", published 10 Dec 2025 (BlogPosting data), about 1,030 words, with a meta description and a self-referencing canonical. Sections: what PPF is and its benefits, how it works, *"Is there a downside to ceramic coating?"*, how to choose a film, maintenance, and "why PPF is a smart investment".

| Question | Finding |
|---|---|
| Is the information unique and useful? | The wording is not copied anywhere: only **2.8 %** of its 4-word phrases appear anywhere on the current site (measured against `/ppf`, `/interior-ppf`, `/window-film`, `/warranty`, `/nagpur` and all 20 published posts). But **every topic is already covered**, in more structured and current form: `/ppf` explains the film, its layers, self-healing, UV and stone-chip protection and installation; the post *7 Powerful Car Paint Protection Tips* covers washing, bird droppings, brush washes and PPF versus ceramic coating; the post *10 Best PPF Brands* covers what PPF is, PPF versus ceramic coating, yellowing, whether it is worth it, and a checklist before installing. The old article adds a personal narrative, not new information. |
| Is it accurate against the current business? | Not safely. It says "brands like Sunkool offer … full coverage kits or partial kits for the front bumper, hood and side mirrors", but the current site sells the HD07 and Signature films and mentions no "kits"; and it promises the film "stays on for years without peeling or yellowing", while `/ppf` is careful to caveat such claims. Restoring it "as it was" would republish product and performance claims nobody has re-checked. I cannot correct them because I do not know the current offer. |
| Can it be restored in the current blog system? | Not at its original URL. Posts live in the database and are served at `/blog/<slug>`; there is no mechanism for a post at the site root. Serving it there would need a new hand-coded route outside the blog (no author record, no listing, no related posts, no enquiry form, not editable in the admin). I also cannot write to the production database. |
| Would restoring it add duplicate or low-quality content? | Yes: a generic, first-person article that repeats topics the site already answers. |
| Known historical SEO value? | **Unknown.** There is no Search Console performance or backlink data. The only evidence is that Google was still requesting the URL (last crawled 17 Sep 2026, per your screenshot), which is not traffic. |

If you have performance data showing it earned real traffic, the right way to bring it back is to publish a **corrected** version as a blog post in the admin (with the product claims checked), then repoint this redirect at that post. Until then the 301 to `/ppf` is a same-topic fallback. If Search Console lists it under *Soft 404* later, delete the rule and let it 404.

### 7.4 The 66 old car-model pages

**Data that is missing:** Search Console performance (clicks, impressions, rankings) and backlink data for these URLs. Neither exists in this project or on this machine, and I did not estimate any of it. Google's "last crawled" dates in your screenshots show it still requests many of these URLs (for example #1 on 24 Oct 2026), but a crawl is not traffic.

**What the archived pages are.** I fetched the latest archived copy of 65 of the 66 (57 PPF, 8 window film or glazing; #48 is not archived) and compared them. They are blog posts of about 380 to 1,320 words (median 677) published between Nov 2022 and early 2026, written from a handful of templates with the car's name swapped in. I masked each car's name and measured how much of each page's text also occurs on the other pages for the same film (its *template share*):

- **55 pages share 85 % to 100 % of their text with other cars' pages (median 99 %)**: one template, only the car name differs.
- **5 pages share 74 % to 85 %** (#119, #46, #82, #63, #100): the same template with some extra sentences.
- **5 pages share 14 % to 59 %** (Tier A below): older, differently worded generic posts (Nov 2022 to Jul 2023). I read all five in full and they contain no specifications, prices or model facts either.
- **I found no information specific to any car.** For the 60 template-based pages that is by construction (the text is identical apart from the name); for the five others I checked by reading them.

**Equivalent pages today:** none for any specific model. The nearest are the generic `/ppf` (PPF in Nagpur), `/window-film` and `/nagpur`.

**Conclusion:** none of the 66 is worth restoring as it was; restoring 60 name-swapped near-duplicates would add low-quality, duplicate content. All 66 stay 404. The table below ranks them for a *future* decision using content and recency only. **It is not a traffic ranking.** Every tier is conditional on Search Console data you have not yet supplied.

| Tier | Meaning | Pages | Suggested action |
|---|---|---:|---|
| **A** | Text mostly not shared with the other model pages | 5 | If the data shows traffic or links, **rewrite** with real model-specific content; do not restore the old text |
| **B** | Template page published in 2025 or later, or whose year Wix did not print (a current-year post at the time of capture) | 5 | Same condition; otherwise leave as 404 |
| **C** | Older (2022 to 2024) template page | 55 | Leave as 404 |

Tier A and B pages (all 65 are in Appendix B):

| Tier | # | Car | Film | Published | Last archived | GSC last crawled | Words | Template share |
|---|---|---|---|---|---|---|---:|---:|
| A | 45 | Tata Harrier | PPF | Nov 30, 2022 | 2026-05 | 4 Sep | 1321 | 14% |
| A | 76 | BMW | PPF | Nov 26, 2022 | 2025-10 | 12 Aug | 1099 | 21% |
| A | 3 | Tata Harrier | PPF | Nov 12, 2022 | 2026-04 | 23 Oct | 663 | 29% |
| A | 16 | Kia Seltos | PPF | Dec 5, 2022 | 2026-05 | 6 Oct | 1004 | 30% |
| A | 121 | BMW 620d | Window film | Jul 8, 2023 | 2026-06 | 18 Jul | 403 | 59% |
| B | 100 | Toyota Fortuner | Window film (Clear heat control) | Mar 16 | 2026-04 | 30 Jul | 379 | 85% |
| B | 36 | Mercedes GLC 300 | PPF (Signature) | Feb 9 | 2026-06 | 11 Sep | 706 | 95% |
| B | 55 | BYD | PPF | Oct 28, 2025 | 2026-06 | 21 Aug | 660 | 97% |
| B | 30 | Tata Safari | PPF (Matte) | Sep 6, 2025 | 2026-05 | 17 Sep | 696 | 97% |
| B | 51 | BMW X5 | PPF (Matte) | Jan 5 | 2026-04 | 28 Aug | 682 | 99% |

### 7.5 The 28 retired blog tags and categories

They return a legitimate **404**; there is no `/blog/categories/*` or `/blog/tags/*` redirect (a unit test rejects wildcards). They are absent from the sitemap and from every internal link (§0 row 4). The current blog has seven categories (`window-film`, `regulations`, `vehicle-care`, `ppf`, `new-cars`, `industry-news`, `technology`); only three old URLs have a same-subject equivalent (*car tint* and *car window safety glazing* → the Window Film category) and are redirected. The `ppf` category has a single article, so it is `noindex` and is not a sensible redirect target.

### 7.6 Decisions that remain yours

| Decision | Options |
|---|---|
| **Search Console data** | Export *Performance › Pages* (16 months), *Not found (404) › Export* and *Links › Top linked pages* and run the audit with `--gsc-export=` (§10). It settles #30 and #120 and ranks any old URL that earned clicks or links. |
| **Article #27 and the car-model pages** | Only if that data shows real traffic or links: publish a corrected or rewritten version as a blog post, then repoint the redirect (§7.3, §7.4). |
| **#97** `/how-heat-control-window-film-for-car-helps-in-reduce-heat-temperature-in-your-car` | Closest new article: `/blog/how-much-heat-does-ceramic-window-film-block` (same broad topic, different angle). Not redirected; one line to add if you disagree. |
| **`/ceramic-coating`, `/graphene-coating`, `/shop`, `/items`** | No such pages exist now. Build the page first if you plan to sell coatings. |

---

## 8. The chatbot — kept unchanged

The chatbot stays on the website, and nothing in this repair touches it. `git diff HEAD` is empty for all of it: `src/chatboat/**` (37 files), `src/app/api/chatbot-leads/route.ts`, `src/lib/salesiq.ts`, the widget mount in `src/components/layout/chrome-gate.tsx`, its stylesheet and the `--fab-*` variables the WhatsApp button uses, `contact-form.tsx` and `dealer-form.tsx`, the admin Blog Data page and `src/lib/blog/leads/*`, `supabase/migrations`, `package.json` and `package-lock.json`. No chatbot file is staged, and no chatbot-removal branch or commit exists.

**Search footprint: none.** The chatbot has no pages. Its one URL, `/api/chatbot-leads`, is an API endpoint that answers `200` JSON (`no-store`), is disallowed in `robots.txt`, is in no sitemap entry and is linked from no page. None of the 128 Search Console URLs concerns it.

---

## 9. Git state and deployment

### What has been prepared

- Branch **`seo/404-repair`** did not exist locally or on the remote. It was created from `main` (`08db353`, in sync with `origin/main`).
- **Exactly six files are staged** (not committed, not pushed, no pull request):

  | Status | File |
  |---|---|
  | M | `next.config.ts` |
  | M | `src/lib/legacy-redirects.ts` |
  | M | `src/lib/legacy-redirects.test.ts` |
  | M | `scripts/qa/verify-legacy-urls.mjs` |
  | A | `scripts/qa/audit-gsc-404.mjs` |
  | A | `SEO_404_FIX_REPORT.md` |

- **Left unstaged on purpose** (not part of this repair): `src/components/warranty/warranty-view.tsx`, `src/lib/warranty-content.ts`, `src/components/warranty/warranty-authenticity.tsx` and `src/lib/warranty-content.test.ts` (your warranty work in progress).
- **Rules followed:** no `git add .` or `git add -A`, nothing discarded, no force-push, no `vercel --prod`, `master` never touched, no merge, no deploy.

> If you edit `SEO_404_FIX_REPORT.md` or any staged file after this point, run `git add <that file>` again before committing.

### Rules for you

- Production is built from **`main`**. `master` is an unrelated history (no common ancestor): never merge, rebase or open a pull request into it, and pass `--base main` to `gh` because the GitHub default branch is `master`.
- Never `git add .`, `git add -A` or `vercel --prod` from this folder: your working tree holds unrelated uncommitted work that a CLI deploy would upload.
- In Vercel, confirm *Project › Settings › Git › Production Branch* is `main`.

### Commit, push and open the pull request (when you approve)

```bash
cd "C:/Users/Yash Domle/Desktop/Projects/sunkool-stats"

git branch --show-current                 # expect: seo/404-repair
git diff --cached --name-status           # expect exactly: 4 x M and 2 x A (the six files above)
git diff --cached --check                 # no whitespace errors

git commit -m "SEO: redirect only real equivalents of the Search Console 404 URLs" \
           -m "17 old Wix URLs get an exact 301; retired tags/categories and car-model pages stay 404 (no catch-all). Adds scripts/qa/audit-gsc-404.mjs and SEO_404_FIX_REPORT.md."

git push -u origin seo/404-repair         # Vercel builds a Preview for the branch

gh pr create --base main --head seo/404-repair \
  --title "SEO: redirect only real equivalents of the Search Console 404 URLs" \
  --body "See SEO_404_FIX_REPORT.md. Retired tags/categories now return 404 instead of redirecting to /blog. Chatbot untouched."
```
If `gh` is not signed in, open the pull request on GitHub and choose **base: `main`**.

### Verify the Vercel Preview (before merging)

Its URL is in the Vercel dashboard or in the comment Vercel posts on the pull request. If the Preview sits behind Vercel Authentication it answers 401 and these checks cannot run; skip to the production steps.

```bash
node scripts/qa/audit-gsc-404.mjs https://<preview-url>
node scripts/qa/verify-legacy-urls.mjs https://<preview-url>
node scripts/qa/verify-blog-seo.mjs https://<preview-url>
```
Expect `0 unexpected result(s)` and `all checks passed`. (A Preview does not apply the production host redirect to `www`, which is expected.)

### Deploy to production (only with your approval)

1. Review the pull request, then **merge it on GitHub** into `main`. Vercel deploys `main` to production; nothing in this repair deploys anything by itself.
2. Run the production verification in §10 immediately.
3. **Rollback** if needed: Vercel *Deployments › previous deployment › Instant Rollback*, or `git revert` the merge commit. That restores the old behaviour, including the blanket redirect to `/blog`.

---

## 10. After deployment: verify on production, then Google Search Console

**Everything below is *live* verification and has not been run: it can only be done after you deploy.** The local results in §4 do not prove production.

### Verify the redirects on `www.sunkool.in`

```bash
node scripts/qa/audit-gsc-404.mjs https://www.sunkool.in
node scripts/qa/verify-legacy-urls.mjs https://www.sunkool.in
node scripts/qa/verify-blog-seo.mjs https://www.sunkool.in
```
Expect `0 unexpected result(s)` (it reports **35** today) and `all checks passed`. By hand:

```bash
# 1-2. Old URL answers 301 to the right place (the line may read HTTP/2 301)
curl -sI https://www.sunkool.in/heat-control-window-film                | head -n 5   # 301, location: /window-film
curl -sI https://www.sunkool.in/blog/categories/car-tint                | head -n 5   # 301, location: /blog?category=window-film
curl -sI https://www.sunkool.in/sunkool-window-safety-glazing-sunkool-window-safety-glazing-in-nagpur | head -n 5   # 301, location: /nagpur
curl -sI https://www.sunkool.in/enhance-your-car-with-paint-protection-film | head -n 5   # 301, location: /ppf

# 3. Every destination answers 200 (and is not itself a redirect)
for p in /window-film /nagpur /ppf "/blog?category=window-film"; do curl -s -o /dev/null -w "$p -> %{http_code}\n" "https://www.sunkool.in$p"; done

# Intentional 404s stay 404 (the tag/category used to be a 308)
curl -s -o /dev/null -w "%{http_code}\n" https://www.sunkool.in/blog/tags/automotive
curl -s -o /dev/null -w "%{http_code}\n" https://www.sunkool.in/ceramic-coating
```

**Verify `sitemap.xml`:** open `https://www.sunkool.in/sitemap.xml`. It should list 62 URLs (the number can change as you publish posts), all on `https://www.sunkool.in`, with none of the old URLs in §6 and no `/api/` or chatbot URL.

### Google Search Console

1. **Submit the sitemap:** *Sitemaps › Add a new sitemap* › `sitemap.xml` (it is already declared in `robots.txt`; resubmitting is optional). Confirm the status is *Success*.
2. **URL Inspection for the pages that replace old ones.** Nothing was restored, so inspect the destinations that now receive the old URLs' signals: `/nagpur`, `/ppf`, `/window-film` and `/blog?category=window-film`. For each, run *Test live URL* and, if it is not already indexed, *Request indexing*. Also inspect three old redirected URLs (`/heat-control-window-film`, `/blog/categories/car-tint`, one `…-in-nagpur-3` URL): *Test live URL* should report a redirect to the destination.
3. **Settle the open items with real data** (§0 rows 7 and 9):
   - *Page indexing › Not found (404) › Export*, then `node scripts/qa/audit-gsc-404.mjs https://www.sunkool.in --gsc-export=<that file>`: lists any URL this audit did not classify and re-tests the exact URL for #30 and #120.
   - *Performance › Search results › Pages* (last 16 months) › Export, then the same command with that file: ranks the still-404 pages by impressions and clicks. (Its "not classified" list includes live pages; ignore it.)
   - *Links › Top linked pages › External › Export*: look for any old path. A page with real backlinks is the strongest reason to restore or rewrite it.
4. **Monitor *Page indexing*.** The *Not found (404)* total should fall as Google recrawls the redirected URLs, which move to *Page with redirect*, and as the rest age out. Allow 4 to 8 weeks. Also check *Soft 404* after a few weeks: if one of the three blog-topic redirects or #27 is listed there, Google does not consider the destination equivalent, so delete that rule.
5. **Why some 404s will stay listed.** The 105 intentionally removed URLs will keep appearing under *Not found (404)* (Search Console reports them as *Not indexed*, which is not an error) until Google stops requesting them. A page that is gone should return 404; Google does not require you to redirect or index it, and neither should you.
6. **Is *Validate fix* appropriate?** It is optional, and it will probably end as *Failed*, because validation re-checks every URL in the issue and 105 intentionally still return 404. That is expected and has no penalty. If you use it, do it once, after the deploy, and read the per-URL results: the 17 redirected URLs are the ones that should clear. Do not expect the issue to disappear.
7. **Do not use the Removals tool** for the gone pages or the build chunks; it is temporary and unnecessary.
8. **`order.sunkool.in`:** make that app return `noindex` on its login and password-reset pages, otherwise similar URLs will keep appearing.

**What would count as evidence that Google has acted:** the redirected URLs appearing under *Page with redirect* in the Page indexing report, and the destinations showing as indexed in URL Inspection. Until you see that in Search Console, nothing in this report should be read as "Google has fixed or reindexed" anything.

---

## Appendix A. Recovery map (Internet Archive)

"First archived" is the earliest capture in the archive's index; the link opens the **most recent** capture. Tag/category archive pages (31 of 31 archived) are not listed. #48 is the only non-taxonomy URL the archive's index does not contain. The index was queried on 2026-10-31; an archived copy is evidence that content existed, not that it ranked.

| # | Kind | First archived | Latest copy |
|---|---|---|---|
| 1 | car-model page | 2023-11-30 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-tata-harrier-sunkool-paint-protection-film-in-nagpur-6) |
| 2 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-on-range-rover-velar-sunkool-sun-heat-control-window-film) |
| 3 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-for-tata-harrier-paint-protection-for-car-in-nagpur) |
| 4 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur-3) |
| 6 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-hyundai-venue-sunkool-paint-protection-film-in-nagpur-1) |
| 8 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-hyundai-alcazar-sunkool-paint-protection-film-in-nagpur) |
| 9 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-kia-carnival-sunkool-paint-protection-film-in-nagpur-5) |
| 10 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-for-kia-carnival-sunkool-paint-protection-film-in-nagpur) |
| 11 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-hyundai-creta-sunkool-paint-protection-film-in-nagpur) |
| 12 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-mahindra-thar-sunkool-paint-protection-film-in-nagpur-8) |
| 13 | car-model page | 2024-02-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-on-hyundai-alcazar-sunkool-sun-heat-control-window-film) |
| 14 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-mahindra-xuv-700-sunkool-paint-protection-in-nagpur) |
| 15 | car-model page | 2023-11-30 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-safety-glazing-on-hyundai-alcazar-sunkool-window-safety-glazing) |
| 16 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-for-kia-seltos-car-paint-protection-in-nagpur) |
| 17 | car-model page | 2024-02-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-toyota-fortuner-sunkool-paint-protection-film-in-nagpur-2) |
| 23 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-tata-punch-sunkool-paint-protection-film-in-nagpur) |
| 26 | car-model page | 2024-04-17 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-mahindra-thar-sunkool-paint-protection-film-in-nagpur-9) |
| 28 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur) |
| 29 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-maruti-suzuki-vitara-brezza-sunkool-paint-protection-film-in-nagp) |
| 30 | car-model page | 2025-10-09 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-matte-paint-protection-film-on-tata-safari-sunkool-matte-paint-protection-film-in-nagpur) |
| 33 | car-model page | 2024-06-17 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-hyundai-creta-sunkool-paint-protection-film-in-nagpur-1) |
| 34 | car-model page | 2024-08-13 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-bmw-m340i-sunkool-paint-protection-film-in-nagpur) |
| 36 | car-model page | 2026-03-15 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-signature-paint-protection-film-on-mercedes-glc-300-sunkool-paint-protection-film-in-nagpu) |
| 37 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-jaguar-xe) |
| 39 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-mg-zs-ev-sunkool-paint-protection-film-in-nagpur-1) |
| 41 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-kia-carnival-sunkool-paint-protection-film-in-nagpur-6) |
| 43 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-toyota-urban-cruiser-hyryder-sunkool-paint-protection-film-1) |
| 45 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-for-tata-harrier) |
| 46 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-on-skoda-slavia-sunkool-sun-heat-control-window-film-nagpur) |
| 47 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-mg-gloster-sunkool-paint-protection-film-in-nagpur-3) |
| 48 | car-model page | not in the archive's index | - |
| 50 | car-model page | 2024-05-30 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-audi-q3-sunkool-paint-protection-film-in-nagpur-1) |
| 51 | car-model page | 2026-01-21 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-matte-paint-protection-film-on-bmw-x5-sunkool-matte-paint-protection-film-in-nagpur-1) |
| 53 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-toyota-urban-cruiser-hyryder-sunkool-paint-protection-film-nagpur-1) |
| 55 | car-model page | 2025-11-17 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-byd-sunkool-paint-protection-film-in-nagpur-1) |
| 57 | car-model page | 2024-09-07 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-audi-q3-sunkool-paint-protection-film-in-nagpur-2) |
| 58 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-land-rover-defender-sunkool-paint-protection-film-in-nagpur-1) |
| 59 | car-model page | 2024-06-17 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-matte-black-paint-protection-film-on-mercedes-g-wagon-sunkool-paint-protection-film-in-nag) |
| 61 | car-model page | 2024-05-30 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-black-paint-protection-film-on-audi-a6-sunkool-black-paint-protection-film-in-nagpur) |
| 62 | car-model page | 2023-11-30 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-scorpio-classic-sunkool-paint-protection-film-in-nagpur) |
| 63 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-safety-glazing-on-toyota-fortuner) |
| 65 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-for-mahindra-xuv-700-sunkool-paint-protection-film-in-nagpur) |
| 66 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-grand-vitara-sunkool-paint-protection-film-in-nagpur) |
| 68 | car-model page | 2024-09-07 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-skoda-kodiaq-sunkool-paint-protection-film-in-nagpur-6) |
| 69 | car-model page | 2024-07-23 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-matte-paint-protection-film-on-land-rover-defender-sunkool-paint-protection-film-in-nagpur) |
| 70 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-tata-harrier-sunkool-paint-protection-film-in-nagpur) |
| 72 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-on-toyota-fortuner-sunkool-sun-heat-control-window-film) |
| 73 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-hyundai-tucson-sunkool-paint-protection-film-in-nagpur-1) |
| 75 | car-model page | 2024-12-14 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-byd-sunkool-paint-protection-film-in-nagpur) |
| 76 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-for-bmw-paint-protection-film-service-in-nagpur) |
| 78 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-toyota-urban-cruiser-hyryder-sunkool-paint-protection-film) |
| 79 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-skoda-kodiaq-sunkool-paint-protection-film-in-nagpur-1) |
| 82 | car-model page | 2025-01-16 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-clear-heat-control-solution-on-mahindra-thar-roxx) |
| 83 | car-model page | 2025-01-16 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-matte-paint-protection-film-on-mini-cooper-sunkool-paint-protection-film-in-nagpur) |
| 85 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-mahindra-thar-sunkool-paint-protection-film-in-nagpur-5) |
| 100 | car-model page | 2026-04-16 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-clear-heat-control-glazing-on-toyota-fortuner) |
| 111 | car-model page | 2024-07-23 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-matte-paint-protection-film-on-tata-safari-sunkool-paint-protection-film-in-nagpur) |
| 112 | car-model page | 2024-10-16 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-kia-ev6-sunkool-paint-protection-film-in-nagpur) |
| 114 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-hyundai-venue-sunkool-paint-protection-film-in-nagpur) |
| 115 | car-model page | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-kia-carnival-sunkool-paint-protection-film-in-nagpur-3) |
| 116 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur-5) |
| 119 | car-model page | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-bmw-5-series-paint-protection-for-bmw-in-nagpur) |
| 121 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-sunkool-sun-heat-control-window-film-on-bmw-620d) |
| 122 | car-model page | 2023-10-03 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-toyota-innova-hycross-sunkool-paint-protection-film-in-nagpur-6) |
| 123 | car-model page | 2024-09-07 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-mercedes-gla-200-sunkool-paint-protection-film-in-nagpur) |
| 124 | car-model page | 2024-05-30 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-on-mercedes-g-wagon-sunkool-paint-protection-film-in-nagpur) |
| 19 | article | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-why-you-need-for-your-car) |
| 77 | article | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/what-are-swirl-marks-on-a-vehicle) |
| 97 | article | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/how-heat-control-window-film-for-car-helps-in-reduce-heat-temperature-in-your-car) |
| 113 | article | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-useful-in-rainy-seasons-to-protect-vehicle-from-scratches) |
| 117 | article | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/paint-protection-film-for-mahindra-scorpio-n-the-benefits-of-paint-protection-film) |
| 5 | product/service | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/car-door-edge-guard-protector-sunkool-door-edge-pro) |
| 25 | product/service | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/items) |
| 126 | product/service | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/graphene-coating) |
| 127 | product/service | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/ceramic-coating) |
| 128 | product/service | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/shop) |
| 32 | promo | 2026-01-21 | [open](https://web.archive.org/web/https://www.sunkool.in/december-delight-offer-is-live-sunkool-paint-protection-film-in-nagpur) |
| 7 | redirected post | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur-3) |
| 21 | redirected post | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/paint-protection-film-installation-shop-in-nagpur-sunkool-paint-protection-film-ppf) |
| 27 | redirected post | 2026-01-21 | [open](https://web.archive.org/web/https://www.sunkool.in/enhance-your-car-with-paint-protection-film) |
| 31 | redirected post | 2024-02-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-safety-glazing-for-car-sunkool-in-nagpur) |
| 38 | redirected post | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur) |
| 40 | redirected post | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/heat-control-window-film) |
| 42 | redirected post | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-1) |
| 60 | redirected post | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur-6) |
| 64 | redirected post | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-sunkool-sun-heat-control-window-film-in-nagpur) |
| 67 | redirected post | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film) |
| 74 | redirected post | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur-5) |
| 80 | redirected post | 2023-03-26 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-paint-protection-film-for-car-sunkool-paint-protection-film-in-nagpur) |
| 81 | redirected post | 2024-07-23 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-window-safety-glazing-sunkool-window-safety-glazing-in-nagpur) |
| 120 | redirected post | 2023-06-04 | [open](https://web.archive.org/web/https://www.sunkool.in/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film-in-nagpur-2) |

---

## Appendix B. Car-model page review (65 archived pages)

Every archived car-model page, ordered by tier, then by template share (lowest first). *Template share* = the part of the page's text (4-word phrases, car name masked) that also appears on other cars' pages for the same film: 100 % means a pure name-swap. *Published* is the date Wix printed on the post (no year means the capture year, 2026). *GSC last crawled* is from your screenshots. **None of these columns is traffic, an impression count, a ranking or a backlink count; no such data was available.** #48 is not in the archive's index and could not be reviewed.

| Tier | # | Car | Film | Published | Last archived | GSC last crawled | Words | Template share |
|---|---|---|---|---|---|---|---:|---:|
| A | 45 | Tata Harrier | PPF | Nov 30, 2022 | 2026-05 | 4 Sep | 1321 | 14% |
| A | 76 | BMW | PPF | Nov 26, 2022 | 2025-10 | 12 Aug | 1099 | 21% |
| A | 3 | Tata Harrier | PPF | Nov 12, 2022 | 2026-04 | 23 Oct | 663 | 29% |
| A | 16 | Kia Seltos | PPF | Dec 5, 2022 | 2026-05 | 6 Oct | 1004 | 30% |
| A | 121 | BMW 620d | Window film | Jul 8, 2023 | 2026-06 | 18 Jul | 403 | 59% |
| B | 100 | Toyota Fortuner | Window film (Clear heat control) | Mar 16 | 2026-04 | 30 Jul | 379 | 85% |
| B | 36 | Mercedes GLC 300 | PPF (Signature) | Feb 9 | 2026-06 | 11 Sep | 706 | 95% |
| B | 55 | BYD | PPF | Oct 28, 2025 | 2026-06 | 21 Aug | 660 | 97% |
| B | 30 | Tata Safari | PPF (Matte) | Sep 6, 2025 | 2026-05 | 17 Sep | 696 | 97% |
| B | 51 | BMW X5 | PPF (Matte) | Jan 5 | 2026-04 | 28 Aug | 682 | 99% |
| C | 119 | BMW 5 Series | PPF | Dec 6, 2022 | 2025-09 | 22 Jul | 823 | 74% |
| C | 46 | car | Window film | Jul 12, 2023 | 2026-04 | 4 Sep | 382 | 77% |
| C | 82 | mahindra thar roxx | Window film (Clear heat control) | Dec 6, 2024 | 2026-05 | 8 Aug | 385 | 83% |
| C | 63 | Toyota Fortuner | Window film | Aug 10, 2023 | 2026-06 | 15 Aug | 449 | 84% |
| C | 70 | Tata Harrier | PPF | Dec 21, 2022 | 2026-06 | 13 Aug | 501 | 88% |
| C | 72 | Toyota Fortuner | Window film | Mar 27, 2023 | 2026-06 | 12 Aug | 486 | 90% |
| C | 10 | Kia Carnival | PPF | Dec 16, 2022 | 2026-04 | 11 Oct | 709 | 90% |
| C | 15 | Hyundai Alcazar | Window film | Nov 16, 2023 | 2026-04 | 6 Oct | 449 | 92% |
| C | 111 | tata safari | PPF (Matte) | Jun 8, 2024 | 2026-04 | 27 Jul | 695 | 94% |
| C | 65 | Mahindra XUV 700 | PPF | Jan 6, 2023 | 2025-09 | 14 Aug | 657 | 94% |
| C | 85 | Mahindra Thar | PPF | Apr 24, 2023 | 2025-07 | 6 Aug | 649 | 95% |
| C | 61 | Audi A6 | PPF (Black) | Apr 22, 2024 | 2026-06 | 15 Aug | 669 | 97% |
| C | 59 | Mercedes G Wagon | PPF (Matte black) | May 27, 2024 | 2026-06 | 16 Aug | 719 | 98% |
| C | 1 | Tata Harrier | PPF | Nov 1, 2023 | 2026-04 | 24 Oct | 679 | 98% |
| C | 17 | Toyota Fortuner | PPF | Jan 6, 2024 | 2026-05 | 5 Oct | 682 | 98% |
| C | 13 | Hyundai Alcazar | Window film | Jun 5, 2023 | 2026-03 | 8 Oct | 461 | 99% |
| C | 28 | Toyota Innova Hycross | PPF | Mar 21, 2023 | 2026-02 | 17 Sep | 714 | 99% |
| C | 8 | Hyundai Alcazar | PPF | Jan 25, 2023 | 2026-05 | 12 Oct | 702 | 99% |
| C | 62 | Scorpio Classic | PPF | Oct 7, 2023 | 2026-04 | 15 Aug | 675 | 99% |
| C | 50 | Audi Q3 | PPF | Apr 6, 2024 | 2026-04 | 29 Aug | 666 | 99% |
| C | 69 | Land Rover Defender | PPF (Matte) | Jul 6, 2024 | 2026-06 | 14 Aug | 696 | 99% |
| C | 83 | Mini Cooper | PPF (Matte) | Dec 20, 2024 | 2026-04 | 7 Aug | 684 | 99% |
| C | 75 | BYD | PPF | Nov 19, 2024 | 2026-04 | 12 Aug | 650 | 99% |
| C | 68 | Skoda Kodiaq | PPF | Aug 12, 2024 | 2026-06 | 14 Aug | 663 | 99% |
| C | 33 | Hyundai Creta | PPF | Feb 8, 2024 | 2026-04 | 12 Sep | 662 | 99% |
| C | 34 | BMW M340i | PPF | Jul 23, 2024 | 2026-06 | 11 Sep | 666 | 99% |
| C | 122 | Toyota Innova Hycross | PPF | Sep 7, 2023 | 2026-06 | 18 Jul | 689 | 99% |
| C | 23 | Tata Punch | PPF | Mar 4, 2023 | 2026-05 | 27 Sep | 634 | 99% |
| C | 2 | Range Rover Velar | PPF | Jul 13, 2023 | 2026-06 | 23 Oct | 687 | 99% |
| C | 112 | Kia EV6 | PPF | Sep 24, 2024 | 2026-04 | 27 Jul | 673 | 99% |
| C | 57 | Audi Q3 | PPF | Aug 23, 2024 | 2026-04 | 18 Aug | 669 | 99% |
| C | 66 | Grand Vitara | PPF | Mar 14, 2023 | 2026-02 | 14 Aug | 687 | 99% |
| C | 123 | Mercedes GLA 200 | PPF | Aug 3, 2024 | 2026-04 | 17 Jul | 689 | 99% |
| C | 79 | Skoda Kodiaq | PPF | Apr 17, 2023 | 2026-06 | 11 Aug | 637 | 99% |
| C | 29 | Maruti Suzuki Vitara Brezza | PPF | Jun 8, 2023 | 2026-05 | 17 Sep | 668 | 99% |
| C | 115 | Kia Carnival | PPF | Mar 29, 2023 | 2026-02 | 25 Jul | 690 | 100% |
| C | 26 | Mahindra Thar | PPF | Mar 9, 2024 | 2026-06 | 17 Sep | 677 | 100% |
| C | 78 | Toyota Urban Cruiser Hyryder | PPF | May 15, 2023 | 2026-05 | 11 Aug | 682 | 100% |
| C | 124 | Mercedes G Wagon | PPF | May 10, 2024 | 2026-05 | 17 Jul | 681 | 100% |
| C | 73 | Hyundai Tucson | PPF | Aug 31, 2023 | 2026-03 | 12 Aug | 688 | 100% |
| C | 6 | Hyundai Venue | PPF | Mar 6, 2023 | 2026-06 | 18 Oct | 635 | 100% |
| C | 114 | Hyundai Venue | PPF | Jan 27, 2023 | 2026-06 | 25 Jul | 653 | 100% |
| C | 4 | Toyota Innova Hycross | PPF | Mar 31, 2023 | 2026-01 | 22 Oct | 738 | 100% |
| C | 39 | MG ZS EV | PPF | Apr 8, 2023 | 2026-05 | 10 Sep | 710 | 100% |
| C | 58 | Land Rover Defender | PPF | Mar 23, 2023 | 2026-05 | 16 Aug | 709 | 100% |
| C | 43 | Toyota Urban Cruiser Hyryder | PPF | Aug 1, 2023 | 2025-09 | 6 Sep | 705 | 100% |
| C | 53 | Toyota Urban Cruiser Hyryder | PPF | Jun 21, 2023 | 2026-05 | 26 Aug | 704 | 100% |
| C | 47 | MG Gloster | PPF | May 23, 2023 | 2026-05 | 2 Sep | 691 | 100% |
| C | 14 | Mahindra XUV 700 | PPF | Jun 3, 2023 | 2026-03 | 7 Oct | 685 | 100% |
| C | 9 | Kia Carnival | PPF | May 26, 2023 | 2025-09 | 11 Oct | 680 | 100% |
| C | 11 | Hyundai Creta | PPF | Jun 19, 2023 | 2026-04 | 9 Oct | 667 | 100% |
| C | 12 | Mahindra Thar | PPF | Jun 29, 2023 | 2026-05 | 9 Oct | 667 | 100% |
| C | 41 | Kia Carnival | PPF | Jun 12, 2023 | 2026-05 | 8 Sep | 665 | 100% |
| C | 116 | Toyota Innova Hycross | PPF | May 30, 2023 | 2026-06 | 24 Jul | 658 | 100% |
| C | 37 | Jaguar XE | PPF | Jan 31, 2023 | 2026-04 | 10 Sep | 637 | 100% |
