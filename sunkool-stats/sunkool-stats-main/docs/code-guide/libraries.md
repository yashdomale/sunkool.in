# Libraries Used in Sunkool.in

This page covers the important npm packages listed in `package.json` that are **actually used** in the code, what job each one does, and roughly where to find it in use. Packages that are installed but not actually called from anywhere are listed separately at the bottom, clearly marked — see that section before assuming a package matters.

---

```
Library: next
Purpose: The core web framework — pages, routing, image optimization, server rendering.
Why Sunkool uses it: It's the foundation the entire site is built on.
Where it is used: Everywhere — every file under src/app/, most of src/components/.
Simple explanation: This is the "engine" of the whole website. See nextjs.md for details.
```

```
Library: react / react-dom
Purpose: The UI library Next.js is built on — components, state, rendering.
Why Sunkool uses it: You can't use Next.js without React; it's what actually builds the UI.
Where it is used: Every single .tsx component in the project.
Simple explanation: React is how the site is built out of small, reusable pieces ("components").
```

```
Library: motion
Purpose: Animation library for React (this package is the current name for what used to
  be called "Framer Motion" — same creators, renamed package).
Why Sunkool uses it: Drives almost every animation on the marketing site — fade-ins as you
  scroll, the mobile menu sliding open, buttons that magnetically follow your cursor,
  parallax hero effects.
Where it is used: ~70 files, including src/components/ui/reveal.tsx, src/components/ui/button.tsx,
  src/components/layout/navbar.tsx, src/components/home/hero.tsx.
Simple explanation: This is why things on the site fade, slide, and move smoothly instead
  of just snapping into place. See animations.md for the full breakdown.
```

```
Library: gsap
Purpose: A different, older animation library (GreenSock), specialized in scroll-triggered
  and complex timeline animations.
Why Sunkool uses it: Used specifically for the ScrollTrigger plugin's scroll-linked reveal
  animations on the city landing pages.
Where it is used: ONLY src/components/cities/city-animations.tsx and a couple of per-city
  files like content/pune/components/StatReveal.tsx. Not used anywhere else in the app.
Simple explanation: A second animation engine, but scoped narrowly to the /[city] pages —
  don't expect to find it on the main marketing pages, those use "motion" instead.
```

```
Library: lenis
Purpose: Smooth-scrolling library — makes mouse-wheel/trackpad scrolling glide instead of
  jumping in the browser's default, slightly jerky steps.
Why Sunkool uses it: Gives a more premium, cinematic scroll feel on a handful of key pages.
Where it is used: src/lib/lenis-instance.ts (holds the current instance),
  src/components/providers/smooth-scroll.tsx (turns it on/off).
Simple explanation: Only active on "/", "/ppf", "/window-film", "/ultra-edge", "/regulations",
  and "/our-journey" — and even then, it's skipped for touch devices and anyone who has
  "reduce motion" turned on. The homepage itself opts out too, since its 400vh scroll-scrubbed
  hero works better with the browser's plain, native scroll.
```

```
Library: three / @react-three/fiber / @react-three/drei / @react-three/postprocessing
Purpose: A full 3D graphics stack. "three" (Three.js) is the underlying 3D engine;
  "@react-three/fiber" lets you build a 3D scene using React components instead of
  imperative Three.js code; "drei" is a toolbox of ready-made helpers (loading a 3D
  model, lighting presets); "postprocessing" adds camera-lens-style visual effects
  (glow, blur) on top of the rendered scene.
Why Sunkool uses it: Powers the interactive 3D car model on the homepage and the
  "x-ray"/thermal viewer that shows how the film blocks heat through the car's glass.
Where it is used: src/components/webgl/ (18+ files — the 3D scenes, materials, and the
  car model itself, loaded from public/models/porsche-taycan.glb).
Simple explanation: This is what lets you see and interact with an actual spinning 3D
  car in the browser, instead of just a photo or video.
```

```
Library: @supabase/supabase-js / @supabase/ssr
Purpose: The official client libraries for Supabase — a hosted Postgres database plus
  built-in authentication and file storage.
Why Sunkool uses it: This is the entire backend for the blog and the admin CMS — where
  blog posts, categories, authors, and admin logins actually live.
Where it is used: src/lib/supabase/ (three different "flavors" of client: server.ts for
  Server Components/Actions, client.ts for the browser, static.ts for build-time data
  fetching), plus src/proxy.ts (checks who's logged in on every /admin request).
Simple explanation: Supabase is where the blog's actual data is stored; these two
  packages are how the Next.js code talks to that database.
```

```
Library: @tiptap/react, @tiptap/starter-kit, @tiptap/extension-image,
  @tiptap/extension-table, @tiptap/extension-placeholder, @tiptap/html
Purpose: Tiptap is a rich-text editor toolkit — the same category of tool as the
  formatting toolbar in Google Docs or WordPress, but built for React.
Why Sunkool uses it: Lets an admin write a blog post with bold text, headings, lists,
  tables, and inline images through a visual toolbar, instead of writing raw HTML.
Where it is used: src/components/admin/tiptap-editor.tsx (the editor itself),
  src/lib/blog/render.ts (converts the saved content into HTML for the public blog page).
Simple explanation: This is the "Word-processor-style" box an admin types a blog post
  into, in the /admin/blogs area.
```

```
Library: react-hook-form
Purpose: A library for managing form state (what the visitor has typed, which fields
  have errors) without a lot of manual useState wiring.
Why Sunkool uses it: Powers the more complex admin forms (creating/editing a blog post),
  where there are many fields and real validation rules.
Where it is used: src/app/admin/(dashboard)/blogs/blog-form.tsx.
Simple explanation: Handles "what did the admin type, and is it valid?" for the blog
  editor form. Note: the simpler public-facing forms (Contact, Become a Dealer) do NOT
  use this — they just use plain React state, since they don't need real validation
  (they just build a WhatsApp link, see data-flow.md).
```

```
Library: @hookform/resolvers
Purpose: A small adapter that lets react-hook-form use a Zod schema (see below) as its
  validation rules.
Why Sunkool uses it: Connects the "what shape should this data be" rules (Zod) to the
  "track what the user typed" library (react-hook-form) in one line.
Where it is used: src/app/admin/(dashboard)/blogs/blog-form.tsx (zodResolver(postFormSchema)).
Simple explanation: The glue between the next two libraries.
```

```
Library: zod
Purpose: A schema/validation library — you describe the exact shape data should have,
  and it checks (and can reject) anything that doesn't match.
Why Sunkool uses it: Defines the rules a blog post/category/author must follow before
  it's allowed to be saved (e.g. "title can't be empty," "slug must be lowercase with
  hyphens only").
Where it is used: src/lib/blog/validation.ts.
Simple explanation: The "rulebook" the admin blog form checks itself against before
  letting you hit save.
```

```
Library: clsx + tailwind-merge
Purpose: Two small utilities almost always used together — clsx lets you conditionally
  combine class names ("only add this class if X is true"); tailwind-merge intelligently
  resolves conflicts when two Tailwind classes both try to set the same CSS property.
Why Sunkool uses it: Every component that needs conditional or overridable styling uses
  the shared cn() helper built from these two.
Where it is used: src/lib/utils.ts (defines cn()), then used all over the component tree.
Simple explanation: cn("base-classes", condition && "extra-class", props.className) — a
  clean way to combine styling classes without them stepping on each other.
```

```
Library: lucide-react
Purpose: An icon library — hundreds of ready-made SVG icons as React components.
Why Sunkool uses it: Every icon in the UI (menu, close, chevrons, social icons, chart
  icons in the admin dashboard) comes from here rather than being hand-drawn per use.
Where it is used: 60+ files, e.g. src/components/layout/navbar.tsx (Menu, X, ChevronDown),
  src/components/admin/sidebar.tsx.
Simple explanation: A big box of consistent, ready-to-use icons.
```

```
Library: @next/mdx, remark-gfm, remark-frontmatter
Purpose: Lets Next.js treat .mdx files (Markdown + React) as real pages/components, with
  extra Markdown features (remark-gfm adds tables/strikethrough; remark-frontmatter lets
  a file start with a --- ... --- metadata block without breaking the MDX compiler).
Why Sunkool uses it: The three legal pages are written as content/legal/*.mdx files
  instead of hand-coded JSX.
Where it is used: next.config.ts (wires the plugins in), content/legal/*.mdx,
  mdx-components.tsx (styles the rendered Markdown elements).
Simple explanation: Lets legal text be written in plain, readable Markdown instead of
  dense JSX, while still looking like the rest of the site.
```

---

## Installed but currently unused

These packages are listed in `package.json`, but no code in this project actually imports them directly. They're not necessarily "safe to delete" — some are required behind the scenes by another package — but you shouldn't go looking for a place where the app calls them itself.

```
Library: gray-matter
Status: Installed but currently unused.
Why it looks like it should be used: It's the standard tool for reading a Markdown
  file's "---" frontmatter metadata block (title, date, etc.), and the legal .mdx files
  do have that block.
What actually happens instead: next.config.ts uses the remark-frontmatter plugin only to
  strip that block out so the MDX compiler doesn't choke on it — the block's content is
  discarded. The actual page title/date shown to visitors is a separate, hand-written
  object in src/lib/legal-pages.ts. gray-matter itself is never imported anywhere.
```

```
Library: @mdx-js/loader, @mdx-js/react
Status: Installed but currently unused (no direct import found in this project's code).
Why they're still in package.json: @next/mdx (which IS used, in next.config.ts) relies on
  these two packages internally to do its job — they're "peer dependencies," required to
  be installed, but this project's own code never imports them by name.
```

```
Library: @tiptap/pm
Status: Installed but currently unused (no direct import found).
Why it's still in package.json: This is ProseMirror, the lower-level engine that Tiptap
  itself is built on. It's a required peer dependency of @tiptap/react and
  @tiptap/starter-kit (which ARE used directly), not something this project's own code
  imports.
```
