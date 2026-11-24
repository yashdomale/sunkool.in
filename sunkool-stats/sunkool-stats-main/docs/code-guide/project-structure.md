# Project Structure

This page explains **where things live** in the Sunkool.in codebase and what each folder is responsible for. It only covers the **main website app** (the root project) — the `cities/` folder is a set of separate, standalone mini-projects and is explained at the bottom in its own section.

## Top-level folders (repo root)

```text
sunkool.in-origin/
├── src/              ← the actual website (see below)
├── public/           ← static files served as-is (images, videos, models)
├── content/          ← MDX text content for legal pages
├── docs/             ← you are here (this documentation)
├── scripts/          ← one-off Node.js scripts (not part of the running site)
├── supabase/         ← database schema/migrations for the blog + admin CMS
├── cities/           ← SEPARATE standalone sub-apps, not part of this app
├── next.config.ts    ← Next.js configuration (redirects, image settings, MDX)
├── package.json      ← the list of npm libraries the project depends on
├── tsconfig.json     ← TypeScript configuration
├── postcss.config.mjs← wires up Tailwind CSS
├── mdx-components.tsx← styling rules for content written in MDX
└── eslint.config.mjs ← code-style/lint rules
```

### `src/` — the website itself

Everything the browser actually runs comes from here.

```text
src/
├── app/         ← every PAGE and ROUTE of the site (Next.js "App Router")
├── components/  ← reusable React components, grouped by topic
├── hooks/       ← small reusable pieces of "React logic" (see hooks.md)
├── lib/         ← non-visual code: data, helper functions, database access
├── types/       ← extra TypeScript type declarations
└── proxy.ts     ← code that runs before almost every request (see nextjs.md)
```

#### `src/app/` — pages and routes

In the Next.js **App Router**, a *folder* under `app/` becomes a *URL*, and a `page.tsx` file inside it becomes the content of that URL. For example:

```text
src/app/
├── page.tsx                 → https://sunkool.in/            (homepage)
├── layout.tsx               → the HTML shell wrapping every page (<html>, <body>, fonts, nav)
├── globals.css              → the one global stylesheet for the whole site
├── window-film/page.tsx     → /window-film
├── ppf/page.tsx              → /ppf
├── ultra-edge/page.tsx       → /ultra-edge
├── interior-ppf/page.tsx     → /interior-ppf
├── compare/page.tsx          → /compare (the film configurator/comparison tool)
├── contact/page.tsx          → /contact
├── become-dealer/page.tsx    → /become-dealer
├── our-journey/page.tsx      → /our-journey
├── warranty/page.tsx         → /warranty
├── regulations/page.tsx      → /regulations
├── disclaimer/, privacy-policy/, terms-and-conditions/  → the legal pages
├── [city]/page.tsx          → /delhi, /mumbai, /nagpur, ... (ONE page template
│                               that serves all 23 supported cities — the [square
│                               brackets] mean "this part of the URL is a variable")
├── blog/
│   ├── page.tsx             → /blog (the article list)
│   └── [slug]/page.tsx      → /blog/any-post-title (one article)
├── admin/                   → the password-protected CMS dashboard (/admin/...)
├── ahemdabad/, hydrabad/    → old misspelled URLs that redirect to the correct
│                               /ahmedabad and /hyderabad pages
├── robots.ts                → generates /robots.txt (tells search engines what
│                               they may crawl)
├── sitemap.ts               → generates /sitemap.xml (lists every real page for
│                               search engines)
├── manifest.ts              → generates the PWA manifest (icons, app name)
└── opengraph-image.tsx      → generates the preview image shown when a link to
                                the site is shared on social media
```

See **nextjs.md** for what "page", "layout", dynamic routes like `[city]`, and the special files (`robots.ts`, `sitemap.ts`) actually mean.

#### `src/components/` — reusable UI, grouped by topic

Each subfolder groups components that belong to one part of the site:

| Folder | What's in it |
|---|---|
| `ui/` | Small, generic building blocks used everywhere — buttons, page headers, the scroll-reveal animation wrapper, social icons |
| `layout/` | The site chrome that wraps every page — `Navbar`, `Footer`, the logo, the component that hides them on `/admin` |
| `common/` | Small shared widgets like the animated `CountUp` number |
| `providers/` | Components that set up something global (here: the `SmoothScroll` provider) |
| `home/` | Sections used only on the homepage |
| `window-film/`, `ppf/`, `interior-ppf/`, `ultra-edge/`, `warranty/`, `regulations/` | Sections used only on that one product/info page |
| `product/` | Shared product-card / category-view pieces used across the film product pages |
| `configurator/` | The "find your film" quiz and the spec comparison table (used on `/compare`) |
| `blog/` | Blog list, search, category filter, pagination, related posts, FAQ, sharing |
| `admin/` | The whole CMS dashboard UI — sidebar, top bar, charts, forms, rich-text editor |
| `cities/` | The shared machinery behind every `/[city]` page — the geolocation popup, GSAP scroll animations, and (inside `cities/content/<cityname>/`) each city's own text/sections |
| `webgl/`, `graphics/`, `experience/` | The 3D car model and the cinematic scroll-driven homepage hero (see hooks.md/animations.md) |
| `dealer/`, `contact/`, `journey/`, `legal/` | Page-specific sections for Become a Dealer, Contact, Our Journey, and the legal pages |
| `media/` | The reusable image/video "slot" placeholder component used across product pages |

#### `src/lib/` — non-visual logic

Anything that isn't a React component lives here: plain data, helper functions, and database access.

- `cities.ts` — the list of all 23 covered cities (name, state, GPS coordinates) and the geolocation-matching function
- `schema.ts` — the structured data (JSON-LD) that helps Google understand the business
- `utils.ts` — the `cn()` className helper (see styling.md)
- `*-content.ts` and `*-media.ts` files (e.g. `ppf-content.ts`, `window-film-media.ts`) — hand-written copy/text and image paths for each product page, kept separate from the JSX that renders them
- `supabase/` — the three different ways the app talks to the Supabase database (server, browser, and "static build time" — see nextjs.md)
- `blog/` — everything blog-specific: fetching posts (`queries.ts`), the TypeScript shapes of a post (`types.ts`), the Zod validation rules for the admin blog form (`validation.ts`), converting the rich-text editor's content to HTML (`render.ts`)
- `climate-model.ts`, `tech-demo-*.ts` — the physics-ish numbers and narrative script driving the homepage's animated hero and the film-comparison quiz

#### `src/hooks/` and `src/types/`

- `hooks/` holds small, genuinely reusable pieces of logic used by more than one component (see **hooks.md**) — there are only two files here (`use-reduced-motion.ts`, `use-visible-video.ts`); most other custom hooks live right next to the one component that uses them.
- `types/` holds hand-written TypeScript type declarations for a package that doesn't ship its own (`lucide-react.d.ts`).

#### `src/proxy.ts`

One file that runs on (almost) every incoming request before any page renders. In most Next.js tutorials you'll see this called `middleware.ts` — this project uses a newer Next.js version (16) that renamed the file to `proxy.ts`. See **nextjs.md** for what it actually does here (redirecting the wrong domain, and protecting `/admin`).

### `public/` — files served exactly as-is

Anything in here is available at the matching URL with no processing, e.g. `public/logo.png` is served at `/logo.png`.

- `images/` — photos and graphics, organized by page/city
- `videos/` — background/brand videos
- `frames/` — hundreds of individual JPEG frames (`ezgif-frame-001.jpg`, `002`, ...) used to fake a smooth scroll-scrubbed video on the homepage hero without needing an actual video file (see **animations.md**)
- `models/` — a 3D car model (`porsche-taycan.glb`) used by the WebGL hero
- `blog/` — cover images uploaded through the admin CMS

### `content/` — long-form text content

Currently just `content/legal/` — the three legal pages (Terms & Conditions, Privacy Policy, Disclaimer) written as `.mdx` files (Markdown that can also contain React components). See **nextjs.md** for what MDX is.

### `supabase/` — the database definition

SQL migration files that define the blog's database tables (posts, categories, authors), permissions, and seed data. This is what actually creates the Supabase database structure that `src/lib/blog/queries.ts` reads from.

### `scripts/` — developer tooling, not part of the live site

Node.js scripts a developer runs manually from the terminal (auditing pages, generating icons, porting a new city's content). None of this code ships to visitors — it's here purely to help build the site.

### `cities/` — separate, standalone sub-projects (out of scope)

This folder contains **entirely separate Next.js applications** (each with its own `package.json`, `node_modules`, and `next.config.ts`), one per city, used during development to preview/build a city's design before its content gets copied into the main app's `src/components/cities/content/<city>/` folder. They are excluded from this app's TypeScript config (`tsconfig.json`'s `"exclude"`) and from linting. This documentation folder does not cover their internals.
