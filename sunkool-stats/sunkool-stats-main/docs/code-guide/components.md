# Components Used in Sunkool.in

This page documents the significant, reusable React components in `src/components/`, grouped by the folder they live in. (Skipped: the ~23 near-identical per-city section files under `src/components/cities/content/<city>/`, and one-line trivial wrapper components — see **project-structure.md** for why the city folders are treated separately.)

For each component: what it does, its props, where it's used, and whether it's a **Server** or **Client** Component (see **nextjs.md** if that distinction is new to you).

---

## `src/components/ui/` — small, generic building blocks

### `MagneticButton`
- **File:** `src/components/ui/button.tsx`
- **What it does:** The site's primary call-to-action button. Follows the cursor with a subtle magnetic spring offset; renders as a `Link` when given an `href`, or a plain `<button>` otherwise.
- **Props:** `children`, `href?`, `onClick?`, `variant?: "primary" | "ghost" | "outline"`, `className?`, `type?`, `target?`, `rel?`
- **Used in:** `home/hero.tsx`, `ppf/ppf-hero.tsx`, `ultra-edge/ultra-edge-cta.tsx`, `app/become-dealer/page.tsx`
- **Client** (needs mouse-position tracking)

### `PageHeader`
- **File:** `src/components/ui/page-header.tsx`
- **What it does:** The standard top-of-page hero block (eyebrow label + title + description) used on most non-home marketing pages.
- **Props:** `eyebrow`, `title`, `description?`, `accent?`, `titleClassName?`, `className?`, `descriptionClassName?`
- **Used in:** `app/our-journey/page.tsx`, `app/compare/page.tsx`, `app/blog/page.tsx`, `warranty/warranty-view.tsx`
- **Server**

### `Reveal` / `RevealGroup` / `revealItem`
- **File:** `src/components/ui/reveal.tsx`
- **What it does:** The scroll-into-view fade/slide-up animation primitive (see **animations.md**). `RevealGroup` staggers a set of children one after another.
- **Props:** `Reveal` — `children`, `className?`, `delay?`, `y?`, `once?`, `as?`. `RevealGroup` — `children`, `className?`, `stagger?`
- **Used in:** `PageHeader`, `SectionHeading`, `warranty/warranty-view.tsx`, `dealer/benefits.tsx` — one of the most reused components in the project
- **Client**

### `SectionHeading`
- **File:** `src/components/ui/section-heading.tsx`
- **What it does:** A reusable section title block (eyebrow/title/description), left- or center-aligned, wrapping each line in `Reveal`.
- **Props:** `eyebrow?`, `title`, `description?`, `align?: "left" | "center"`, `className?`, `titleClassName?`
- **Used in:** `home/categories.tsx`, `product/category-view.tsx`, `ppf/ppf-showcase.tsx`, `app/compare/page.tsx`
- **Server**

### Social icon set
- **File:** `src/components/ui/social-icons.tsx`
- **What it does:** Individual inline-SVG icon components (Instagram, Facebook, YouTube, LinkedIn), plus a lookup map keyed by platform id.
- **Props:** each icon: `{ className? }`
- **Used in:** `social-links.tsx` only
- **Server**

### `SocialLinks`
- **File:** `src/components/ui/social-links.tsx`
- **What it does:** Renders the SUNKOOL social-media icon row from a shared config list.
- **Props:** `className?`, `size?: "sm" | "md" | "lg"`, `showLabels?`
- **Used in:** `layout/footer.tsx`, `contact/contact-bento.tsx`
- **Server**

### `VisibleLoop` / `VisibleLoopSpan`
- **File:** `src/components/ui/visible-loop.tsx`
- **What it does:** Wraps an element so an infinite looping animation only runs while it's actually on-screen and the tab is active (see **hooks.md**'s `useVisibleLoop`).
- **Props:** `animate` (required animation target), `transition?`, plus normal motion props
- **Used in:** `graphics/particles.tsx`, `media/media-slot.tsx`, `journey/journey-about.tsx`, `home/stats-cta.tsx`
- **Client**

## `src/components/layout/` — site-wide chrome

### `ChromeGate`
- **File:** `src/components/layout/chrome-gate.tsx`
- **What it does:** Decides whether the public `Navbar`/`Footer` should wrap a page — hidden on `/admin/*`, shown (with the detected city passed to `Footer`) everywhere else.
- **Props:** `children`
- **Used in:** `app/layout.tsx` (the root layout — its only use)
- **Client** (reads the current URL)

### `FooterMapVideo`
- **File:** `src/components/layout/footer-map-video.tsx`
- **What it does:** The autoplaying, muted map video shown in the footer's "view on map" tile; only assigns its poster image once it nears the viewport.
- **Props:** none
- **Used in:** `layout/footer.tsx` only
- **Client**

### `Footer`
- **File:** `src/components/layout/footer.tsx`
- **What it does:** The site-wide footer — logo, tagline, contact details, social links, nav columns, legal links, and (except on non-Nagpur city pages) the map tile.
- **Props:** `city?: CitySlug`
- **Used in:** via `ChromeGate`
- **Server**

### `Logo`
- **File:** `src/components/layout/logo.tsx`
- **What it does:** Renders the SUNKOOL wordmark image, falling back to a placeholder badge if the image fails to load.
- **Props:** `className?`
- **Used in:** `Navbar`, `Footer`, `admin/sidebar.tsx`
- **Client** (tracks image-load error state)

### `Navbar`
- **File:** `src/components/layout/navbar.tsx`
- **What it does:** The fixed top navigation — shrinks on scroll, has desktop dropdown submenus, a "More" menu, and a full mobile drawer; hides itself during the homepage's immersive hero via `useImmersiveChrome`.
- **Props:** none
- **Used in:** via `ChromeGate`
- **Client**

## `src/components/common/`

### `CountUp`
- **File:** `src/components/common/count-up.tsx`
- **What it does:** Animates a number counting up from 0 to a target value once it scrolls into view.
- **Props:** `target: number`, `suffix?`, `duration?`
- **Used in:** `journey/journey-about.tsx`, `window-film/window-film-product-card.tsx`, `ppf/ppf-product-card.tsx`
- **Client**

## `src/components/providers/`

### `SmoothScroll`
- **File:** `src/components/providers/smooth-scroll.tsx`
- **What it does:** Conditionally loads the Lenis smooth-scroll library (see **animations.md**) only on a specific set of routes.
- **Props:** `children`
- **Used in:** `app/layout.tsx` (root layout)
- **Client**

## `src/components/cities/` — shared city-page machinery (top level only)

### `CityAnimations`
- **File:** `src/components/cities/city-animations.tsx`
- **What it does:** Registers the GSAP `ScrollTrigger` reveal animations scoped to `.city-landing`. Renders nothing itself — purely a side-effect component.
- **Props:** none
- **Used in:** `app/[city]/page.tsx`
- **Client**

### `CityLocation`
- **File:** `src/components/cities/city-location.tsx`
- **What it does:** Shows the "Use your location?" dialog on a city page; if allowed, geolocates the visitor and redirects them to whichever covered city is nearest.
- **Props:** `city: CitySlug`
- **Used in:** `app/[city]/page.tsx`
- **Client**

### `cityContent` (not a component)
- **File:** `src/components/cities/city-content.ts`
- **What it is:** A lookup object mapping each city slug to a lazy `import()` of that city's page content — this is how each city's bundle stays code-split rather than all 23 being bundled together.
- **Used in:** `app/[city]/page.tsx`

## `src/components/blog/`

### `BlogGrid`
- **File:** `src/components/blog/blog-grid.tsx` — the blog index grid, with an optional large "featured" card. **Props:** `posts`, `featured?`. **Used in:** `app/blog/page.tsx`. **Client**.

### `BlogSearch`
- **File:** `src/components/blog/blog-search.tsx` — the debounced search box that updates the `?q=` URL param. **Props:** none. **Used in:** `app/blog/page.tsx`. **Client**.

### `CategoryFilter`
- **File:** `src/components/blog/category-filter.tsx` — pill-style category filter links. **Props:** `categories`, `active?`, `q?`. **Used in:** `app/blog/page.tsx`. **Server**.

### `FaqSection`
- **File:** `src/components/blog/faq-section.tsx` — renders a post's FAQ list as `<details>` accordions (or nothing, if there are none). **Props:** `faqs`. **Used in:** `app/blog/[slug]/page.tsx`. **Server**.

### `Pagination`
- **File:** `src/components/blog/pagination.tsx` — numbered page links, preserving the current filters. **Props:** `page`, `totalPages`, `category?`, `q?`. **Used in:** `app/blog/page.tsx`. **Server**.

### `RelatedPosts`
- **File:** `src/components/blog/related-posts.tsx` — a "related reading" grid at the end of a post. **Props:** `posts`. **Used in:** `app/blog/[slug]/page.tsx`. **Server**.

### `SocialShare`
- **File:** `src/components/blog/social-share.tsx` — share links (X/LinkedIn/WhatsApp) plus copy-link. **Props:** `url`, `title`. **Used in:** `app/blog/[slug]/page.tsx`. **Client**.

## `src/components/admin/` — the CMS dashboard

### `StatusBadge`
`src/components/admin/badge.tsx` — a small "published"/"draft" pill. **Props:** `status`. **Server**.

### `ConfirmButton` / `ConfirmDialog`
`src/components/admin/confirm-button.tsx` — a button that opens a confirmation modal (with a pending state via `useTransition`) before running a destructive action. **Props:** `label`, `confirmLabel?`, `message`, `onConfirm`, `className?`, `variant?`. Used for every delete action in the CMS. **Client**.

### `PostGrowthChart` / `ViewsTrendChart`
`src/components/admin/dashboard-charts.tsx` — hand-built SVG charts (posts-per-month bar chart; views-per-month line/area chart) with hover tooltips and a screen-reader-only data table. **Props:** `series`. **Client**.

### `DashboardView`
`src/components/admin/dashboard-view.tsx` — assembles the full dashboard page: stat cards, charts, top posts, recent posts table. **Props:** `analytics`, `recentPosts`, `topPosts`, `displayName`. **Server** (composes client charts inside it).

### `FormField` / `Input` / `Textarea` / `Select`
`src/components/admin/form.tsx` — shared styled form primitives reused by every admin create/edit form. **Server**.

### `Popover`
`src/components/admin/popover.tsx` — a portal-based dropdown menu with outside-click/Escape/scroll handling and arrow-key navigation. **Props:** `anchorRef`, `open`, `onClose`, `label`, `role?`, `className?`, `children`. **Client**.

### `AdminSidebar`
`src/components/admin/sidebar.tsx` — the CMS navigation sidebar (desktop rail + mobile drawer). **Client**.

### `MiniBars` / `MiniLine` / `ProgressRing`
`src/components/admin/sparkline.tsx` — tiny inline SVG sparklines drawn on stat cards. **Props:** `values` (bars/line) or `value` (ring). **Server**.

### `TiptapEditor`
`src/components/admin/tiptap-editor.tsx` — the rich-text editor for writing blog posts, with a formatting toolbar and Supabase image upload. **Props:** `value`, `onChange`. **Client**.

### `AdminTopbar`
`src/components/admin/topbar.tsx` — the CMS top bar: search, a Ctrl/Cmd+K shortcut, notifications, and the account menu. **Props:** `name`. **Client**.

### `Panel` / `StatCard` / `Thumb` / admin `PageHeader`
`src/components/admin/ui.tsx` — the shared admin UI kit (card surface, stat card, image thumbnail with fallback, admin page header). **Server**.

### `ViewsDonut`
`src/components/admin/views-donut.tsx` — an interactive SVG donut chart of views-by-category. **Props:** `slices`, `total`. **Client**.

## `src/components/webgl/` — the 3D car scenes (react-three-fiber)

This folder also contains several **non-component** helper files (shader materials like `hero-material.ts`, `film-glass-material.ts`, and config files like `vehicle-config.ts`) consumed internally by the components below.

- **`GltfVehicle`** (`gltf-vehicle.tsx`) — loads the real 3D car model (`public/models/porsche-taycan.glb`) and swaps in custom heat/film/scan materials per part.
- **`VehicleModel`** / **`ProceduralSuv`** (`vehicle-model.tsx`) and **`VehicleCar`** / **`ProceduralCar`** (`procedural-car.tsx`) — try the real GLTF model first, and fall back to a hand-built procedural car mesh if the model fails to load.
- **`XrayCanvas`** (`xray-canvas.tsx`) — the `<Canvas>` root for the homepage's interactive x-ray/thermal viewer.
- **`SunBattleCanvas`** / **`SunBattleScene`** (`sun-battle-canvas.tsx` / `sun-battle-scene.tsx`) — the `<Canvas>` root and scene for the homepage's cinematic hero (camera orbit synced to scroll progress).
- **`HeroEnvironment`** (`hero-environment.tsx`, aliased as the deprecated `HeroSky`), **`NanoLayerStack`**, **`RadiationRays`**, **`SolarParticles`**, **`SolarRayBeams`**, **`HeatDistortionEffect`**, **`SafeEffectComposer`** — supporting visual-effect pieces for the 3D scenes (sun glow, film-layer visualization, particle/ray effects, heat-shimmer post-processing).
- **`VehicleLoading`** — the "Loading vehicle…" fallback shown while a 3D model streams in.
- **Not currently used anywhere:** `RadiationRays`, `SolarParticles`, `SunEnemyCanvas`/`SunEnemyScene` — an alternate, more elaborate 3D hero treatment that exists in the code but isn't currently mounted by any page (the live homepage hero uses the image-sequence `ScrollScrubFrames` approach below instead).

All WebGL components are **Client Components** — 3D rendering only happens in the browser.

## `src/components/graphics/`

- **`CarSilhouette`** (`car-silhouette.tsx`) — a static inline SVG car side-profile with individually highlightable glass panels. **Server**.
- **`FloatingParticles`** (`particles.tsx`) — a deterministic (SSR-safe, non-random) ambient floating-dot background effect. **Client**.

## `src/components/experience/` — the homepage's cinematic scroll hero

- **`TechDemoExperience`** (`tech-demo-experience.tsx`) — the main orchestrator: measures scroll progress and renders the pieces below; swaps to a static `MobileHeroPhoto` on small screens. **Used in:** `app/page.tsx` (the homepage). **Client**.
- **`ColdOpen`** — the full-screen opening title cards shown before scrolling starts.
- **`ScrollScrubFrames`** — draws the correct JPEG frame from `public/frames/` for the current scroll position (a canvas-based "fake video" — see **animations.md**/**data-flow.md**).
- **`RevealTaglinePanel`**, **`SceneHeadline`**, **`SceneCaption`** — headline/caption copy timed to specific moments in the scroll sequence.
- **`TempHud`** — the animated exterior/cabin temperature readout overlay.
- **`TechDemoProgress`** — the thin progress bar at the bottom of the hero.
- **`MobileHeroPhoto`** — a static photo hero shown on mobile instead of the heavy scroll-scrub sequence.
- **Not currently used:** `EarnedLogo`, `SunkoolLogoMorph` (alternate logo-reveal treatments kept in the code but not wired into the current hero).

## `src/components/configurator/`

- **`Configurator`** (`configurator.tsx`) — the "find your film" quiz (vehicle/climate/privacy/budget) that scores every product and recommends a match. **Used in:** `app/compare/page.tsx`. **Client**.
- **`ComparisonTable`** (`comparison-table.tsx`) — a filterable spec comparison table across all film product lines. **Used in:** `app/compare/page.tsx`. **Client**.

## `src/components/media/`

- **`AutoplayBrandVideo`** (`autoplay-brand-video.tsx`) — an autoplaying background brand video, built on the `useVisibleVideo` hook. **Client**.
- **`MediaSlot`** (`media-slot.tsx`) — the site's general-purpose image/video placeholder frame, with a graceful fallback if the asset is missing. **Props:** `src`, `alt`, `aspect?`, `accent?`, `videoSrc?`, and several more display options. Used across the PPF/Window Film/Ultra Edge galleries. **Client**.

## `src/components/dealer/`

- **`DealerBenefits`** (`benefits.tsx`) — the 4-card benefits grid on Become a Dealer.
- **`DealerForm`** (`dealer-form.tsx`) — the dealer application form; submits by opening a pre-filled WhatsApp chat (see **data-flow.md**).
- **`GrowthChart`** (`growth-chart.tsx`) — a simple animated "+180% dealer growth" bar chart.

All **Client**; all used only in `app/become-dealer/page.tsx`.

## `src/components/contact/`

- **`ContactHero`**, **`ContactBento`**, **`ContactForm`**, **`ContactWhatsAppFab`**, **`WhatsAppIcon`** — the full Contact page: hero, bento-grid office/contact cards, the tabbed enquiry form, and a floating WhatsApp button. All used only in `app/contact/page.tsx`. All **Client** except `WhatsAppIcon` (**Server**).

## `src/components/journey/`

- **`JourneyAbout`** (`journey-about.tsx`) — the whole "Our Journey" page body: stat highlights, a scroll-linked milestone timeline, and a closing CTA. **Used in:** `app/our-journey/page.tsx`. **Client**.

## `src/components/legal/`

- **`LegalDocumentView`** (`legal-document-view.tsx`) — the shared shell for the three legal pages (page header + prose content + cross-links to the other two). **Props:** `slug`, `title`, `effectiveDate`, `children`. **Server**.
