# Sunkool.in — Code Guide

This folder is a **beginner-friendly guide to the actual Sunkool.in codebase** — what technology is used, why it's used, where it's used, and what it does. It was written by inspecting the real code (not from memory or guesswork), so every file path, component name, and code snippet you'll find here should match what's actually in the repository.

If you're new to this codebase (or new to Next.js/React/TypeScript in general), start with **project-structure.md**, then **nextjs.md** — everything else builds on those two.

## What's in here

1. **[project-structure.md](./project-structure.md)** — A map of every important folder and file in the project, and what each one is responsible for. Start here.
2. **[nextjs.md](./nextjs.md)** — The Next.js concepts actually used: pages, layouts, the `[city]`/`[slug]` dynamic routes, Server vs. Client Components, metadata/SEO, `proxy.ts`, and Server Actions.
3. **[imports.md](./imports.md)** — The most important individual `import` statements in the project, explained one by one: what each thing is, why Sunkool uses it, a simple example, where it's used, and what would break without it.
4. **[components.md](./components.md)** — Every significant reusable React component, grouped by folder (UI, layout, blog, admin, 3D/WebGL, and more), with its props and where it's used.
5. **[hooks.md](./hooks.md)** — Every React/Next.js hook actually used in the code — both built-in ones (`useState`, `useEffect`, `usePathname`, ...) and the project's own custom hooks — explained in plain English with real examples.
6. **[libraries.md](./libraries.md)** — Every meaningful npm package the project depends on: what it does, why Sunkool uses it, and where. Also honestly flags a few packages that are installed but not actually used anywhere.
7. **[typescript.md](./typescript.md)** — The TypeScript patterns actually used in the code (`type`, `interface`, generics, unions, `as const`, `satisfies`, and more), each with a real example pulled from the project.
8. **[styling.md](./styling.md)** — How styling works: Tailwind CSS v4, the SUN/KOOL color system, the site's custom utility classes, and the `cn()` helper.
9. **[animations.md](./animations.md)** — Every animation technology actually in use (`motion`, GSAP, Lenis smooth-scroll, and plain CSS keyframes), what each one is responsible for, and — importantly — where each one is *not* used, so you don't go looking for GSAP on the homepage.
10. **[data-flow.md](./data-flow.md)** — Step-by-step diagrams of how data actually moves through the app for real scenarios: viewing a marketing page, reading the blog, publishing a blog post, logging into `/admin`, the homepage's 3D hero, city geolocation, and the WhatsApp-based contact forms.

## How to use this folder

Each page is written to answer the same three questions for whatever it's covering: **what is this, why did Sunkool use it, and where/how is it actually used?** You can read the pages in order top-to-bottom, or jump straight to whichever one matches what you're currently looking at in the code.

A few conventions used throughout:
- File paths are always given relative to the project root (e.g. `src/components/layout/navbar.tsx`).
- If something is installed but not actually used anywhere, it's clearly labeled **"Installed but currently unused"** rather than being left out or documented as if it mattered.
- The top-level `cities/` folder (separate standalone city sub-apps, distinct from `src/components/cities/`) is intentionally **out of scope** for this guide — see the note at the bottom of **project-structure.md** for why.

## What this folder is *not*

This documentation only describes the codebase as it exists today. It doesn't change any code, design, or functionality — it's purely explanatory, written and maintained separately from the application itself.
