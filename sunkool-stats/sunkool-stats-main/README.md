# sunkool.in

Marketing site, city landing pages, blog + admin CMS, and on-site chatbot for SUNKOOL (heat-control window film and paint protection film).

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Supabase (Postgres, Auth, Storage), Tiptap (admin editor), MDX (legal pages), motion / GSAP (animation). Deployed on Vercel.

> This Next.js version has breaking changes from older releases. See `AGENTS.md` and `node_modules/next/dist/docs/` before relying on older patterns.

## Getting started

```bash
npm ci
cp .env.example .env.local   # fill in the Supabase values (see SETUP.md)
npm run dev                  # http://localhost:3000
```

Without Supabase keys the public site still works (the blog falls back to the bundled articles); `/admin` needs a connected project. Full Supabase, admin and chatbot setup is in [SETUP.md](SETUP.md).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Develop, build, serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (`src/**/*.test.ts`, Node test runner) |
| `npm run qa:legacy-urls -- <url>` | Old Wix URLs redirect / 404 as expected |
| `npm run qa:gsc-404 -- <url>` | The 128 Search Console 404 URLs (see `docs/reports/seo-404-fix-report.md`) |
| `npm run qa:blog-seo -- <url>` | Blog listing/article index, canonical, structured data |
| `npm run qa:blog-links -- <url> --articles` | Internal links inside blog articles resolve |
| `npm run qa:city-schema -- <url>` | JSON-LD on every city page |
| `npm run qa:city-pages` | City pages render on mobile/desktop (Playwright; `CITY_TEST_ORIGIN` sets the server) |

Run QA scripts against `npm run start` or a Vercel preview URL. Others live in `scripts/qa/` (mobile audits, performance smoke tests).

## Folder map

```
src/
  app/                 Routes (App Router). [city]/ = all city landing pages, blog/, admin/, api/
  components/
    cities/            City landing pages: registry (city-content.ts), per-city content/<slug>/,
                       shared/ (building blocks every template city uses)
    <page-name>/       Sections for one page (ppf/, window-film/, ultra-edge/, warranty/ …)
    layout/ ui/ common/ Shared header, footer, primitives
    admin/ blog/       Admin CMS and public blog UI
  chatbot/             On-site SUNKOOL Assistant (UI, conversation flow, lead capture)
  lib/
    cities.ts          List of served cities (drives routes + sitemap)
    blog/              Blog data, rendering, SEO, internal links, blog leads
    leads/             Phone + form validation shared by blog and chatbot leads
    supabase/          Supabase clients (browser, server, static, proxy)
    *-content.ts       Page copy/data;  *-media.ts  page media paths
    legacy-redirects.ts Old Wix URL redirects (used by next.config.ts)
  hooks/ types/
  proxy.ts             Request proxy (formerly middleware): www.sunkool.in host redirect, admin auth
content/legal/         Privacy, terms, disclaimer (MDX)
public/                Images, videos, scroll frames, icons
supabase/migrations/   SQL migrations, applied in order (see SETUP.md; there is no 0009)
scripts/               register-ts-paths (test loader), generate-touch-icons, qa/
docs/                  code-guide/ (onboarding), reports/ (SEO and performance write-ups)
```

## City pages

There are three kinds of city page:

| Kind | Cities | Where the words live |
|---|---|---|
| Nagpur template | nagpur, amritsar, chennai, delhi | One data file per city: `content/nagpur/copy/<city>.ts` |
| Own section components | ahmedabad, bhopal, bhubaneswar, ernakulam, hyderabad, indore, jaipur, jamshedpur, kolkata, kozhikode, raipur, rajkot, ranchi, surat, vadodara, vijayawada | `content/<city>/components/*-section.tsx`, built from `cities/shared/` |
| Custom designs | bangalore, mumbai, pune | `content/<city>/components/*-section.tsx` and `lib/content.ts` |

To change wording on Amritsar, Chennai, Delhi or Nagpur, edit that city's copy file: nothing else derives from it.

The 16 cities in the second row look alike but are intentionally individual: the client has tailored each page, so their sections differ in wording, headings and layout. Edit them per city, and don't merge them into one template without the client's agreement (decided 2026-11).

Styling: the rules all 16 share are in `cities/shared/individual-city/base.css` (scoped to `.city-individual`, which the `[city]` route adds); each city's own additions are in `content/<city>/styles.css`, loaded after the base by `shared/individual-city/index.css`. A new individually built city goes in `individualCities` (`cities/city-content.ts`) and in that index file.

## Adding a city

The quickest route is the Nagpur template: copy `content/nagpur/copy/amritsar.ts` to `<slug>.ts`, edit it, add it to `copy/types.ts` and `copy/index.ts`, and give the city a `content/<slug>/page.tsx` like `content/amritsar/page.tsx` (it picks up Nagpur's styles automatically). Then:

1. Add it to `src/lib/cities.ts` (this also adds it to the sitemap).
2. Register its page in `src/components/cities/city-content.ts`.
3. Put its own images in `public/images/cities/<slug>/`. Photos every city uses (windshield before/after, installation, film layers) are already in `public/images/`, and those used by several cities are in `public/images/cities/_shared/`: point at those instead of copying them.

## Conventions

- File names are kebab-case everywhere (city pages included); import through the `@/` alias (`@/lib/...`, `@/components/...`).
- Contact details come from `lib/contact.ts`, brand wording from `lib/brand.ts`, the animation curve from `lib/motion.ts`: don't copy their values into components.
- Redirects go in `next.config.ts` (or `src/lib/legacy-redirects.ts` for old Wix URLs), not in route files.
- Supabase migrations are append-only: never edit a migration that has already run; add a new one.
