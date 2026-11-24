# Important Imports Used in Sunkool.in

This page explains the most important, most frequently-used imports in the codebase — grouped by category. For each one: what it is, why Sunkool uses it, a simple example, where it's used, and what would break if you removed it.

---

## Next.js core

## `Image` from `next/image`

### What is it?
Next.js's built-in, optimized replacement for the plain HTML `<img>` tag.

### Why do we use it?
It automatically resizes images for the visitor's screen, serves modern formats (AVIF/WebP), and prevents the page from jumping around while an image loads.

### Example
```tsx
<Image src="/logo.png" alt="SUNKOOL" width={120} height={40} />
```

### Used in
- `mdx-components.tsx` (renders every image inside a legal `.mdx` page)
- `src/components/layout/logo.tsx`
- `src/components/media/media-slot.tsx`
- Dozens of product/blog components

### What would happen if it were removed?
Every image would have to fall back to a plain `<img>` tag — visitors would download full-size, unoptimized images regardless of their screen size, and pages would be slower and more prone to layout jumps while images load.

---

## `Link` from `next/link`

### What is it?
Next.js's replacement for `<a>`, used for navigating *within* the site.

### Why do we use it?
It preloads the destination page in the background, so clicking feels instant instead of a full page reload.

### Example
```tsx
<Link href="/ppf">Paint Protection Film</Link>
```

### Used in
- `mdx-components.tsx` (internal links inside legal pages)
- `src/components/layout/navbar.tsx`
- `src/components/layout/footer.tsx`
- Nearly every page-to-page link on the site

### What would happen if it were removed?
Internal navigation would need plain `<a>` tags, causing a full-page reload (and a visible flash) on every click instead of an instant, app-like transition.

---

## `type { Metadata }` from `next`

### What is it?
A TypeScript type describing the shape of the SEO metadata object a page can export (title, description, canonical URL, Open Graph data, etc.).

### Why do we use it?
It's a type-only import (see **typescript.md**) — it lets TypeScript check your `metadata` object is shaped correctly, without adding anything to the actual JavaScript sent to the browser.

### Example
```tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Paint Protection Film",
  alternates: { canonical: "/ppf" },
};
```

### Used in
- Every page under `src/app/` that sets its own SEO metadata (`src/app/ppf/page.tsx`, `src/app/[city]/page.tsx`, `src/app/blog/[slug]/page.tsx`, ...)

### What would happen if it were removed?
The page would still technically work, but TypeScript could no longer catch a typo'd metadata field (like `titel` instead of `title`) before the site is even built.

---

## `usePathname`, `useRouter`, `useSearchParams` from `next/navigation`

### What is it?
Client-side hooks for reading the current URL and navigating programmatically. See **hooks.md** for the full breakdown of each.

### Why do we use it?
To highlight the active nav link, redirect a visitor based on their detected city, and read/update the blog's `?q=` search parameter.

### Example
```tsx
"use client";
import { usePathname } from "next/navigation";
const pathname = usePathname(); // e.g. "/ppf"
```

### Used in
- `src/components/layout/navbar.tsx`, `src/components/cities/city-location.tsx`, `src/components/blog/blog-search.tsx`

### What would happen if it were removed?
The navbar couldn't tell which link is "active," the city geolocation redirect couldn't send you to a different page, and the blog search box couldn't read or update the URL.

---

## `redirect`, `permanentRedirect`, `notFound` from `next/navigation`

### What is it?
Functions that stop a Server Component from rendering normally and instead send the visitor to a different URL (`redirect`/`permanentRedirect`) or show a real 404 page (`notFound`).

### Why do we use it?
`redirect` sends a temporary (307) redirect; `permanentRedirect` sends a permanent (308) redirect — important for search engines to correctly understand which old URLs have permanently moved. `notFound()` is used whenever a requested slug (a city, a blog post) doesn't actually exist.

### Example
```tsx
import { notFound } from "next/navigation";
if (!isCitySlug(city)) notFound();
```

### Used in
- `src/app/hydrabad/page.tsx` / `src/app/ahemdabad/page.tsx` (`permanentRedirect`, for old misspelled URLs)
- `src/app/[city]/page.tsx`, `src/app/blog/[slug]/page.tsx` (`notFound`, for unknown slugs)
- `src/app/admin/login/actions.ts` (`redirect`, after a successful login)

### What would happen if it were removed?
Old URLs and invalid slugs would either error or silently render a broken/empty page instead of correctly redirecting or showing a real 404.

---

## `cookies` from `next/headers`

### What is it?
Server-only access to the current request's cookies.

### Why do we use it?
Supabase's server-side client (see below) needs to read/write the visitor's auth session cookies to know if an admin is logged in.

### Example
```ts
const cookieStore = await cookies();
cookieStore.getAll();
```

### Used in
- `src/lib/supabase/server.ts`

### What would happen if it were removed?
The server would have no way to check whether the current visitor is a logged-in admin, breaking the entire `/admin` authentication system.

---

## Animation

## `motion`, `AnimatePresence`, `useInView`, `useScroll`, `useTransform` from `motion/react`

### What is it?
The main animation library used across the site (see **libraries.md** and **animations.md** for the full picture).

### Why do we use it?
To fade/slide elements in as they scroll into view, animate the mobile menu opening/closing, and drive scroll-linked parallax effects.

### Example
```tsx
"use client";
import { motion } from "motion/react";
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
```

### Used in
- `src/components/ui/reveal.tsx`, `src/components/ui/button.tsx`, `src/components/layout/navbar.tsx`, and roughly 70 files total

### What would happen if it were removed?
Every fade-in, slide-up, magnetic button hover, and mobile-menu transition on the main site would disappear — elements would just snap into place instantly instead.

---

## `gsap` (+ `ScrollTrigger`) from `gsap`

### What is it?
A separate, older animation library, used here specifically for scroll-linked reveal animations.

### Why do we use it?
Only used to drive the reveal animations on the `/[city]` page template.

### Example
```ts
gsap.registerPlugin(ScrollTrigger);
gsap.from(".reveal-fade-up", { opacity: 0, y: 24, scrollTrigger: { once: true } });
```

### Used in
- `src/components/cities/city-animations.tsx` and a couple of per-city files (see **animations.md**)

### What would happen if it were removed?
Every `/[city]` page (e.g. `/delhi`, `/mumbai`) would lose its scroll-reveal animations — content would just appear immediately instead of fading/sliding in.

---

## `Lenis` (default import) from `lenis`

### What is it?
A smooth-scrolling library.

### Why do we use it?
Gives select pages an eased, glide-like scroll feel instead of the browser's default stepped scrolling.

### Example
```ts
const { default: Lenis } = await import("lenis");
const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
```

### Used in
- `src/components/providers/smooth-scroll.tsx`

### What would happen if it were removed?
The homepage, `/ppf`, `/window-film`, `/ultra-edge`, `/regulations`, and `/our-journey` would fall back to the browser's normal, slightly less smooth native scrolling.

---

## Forms & validation

## `z` from `zod`

### What is it?
A schema/validation library — you describe the exact shape data must have.

### Why do we use it?
Defines the validation rules for the admin blog/category/author forms before they're allowed to save.

### Example
```ts
import { z } from "zod";
const schema = z.object({ title: z.string().min(1, "Title is required") });
```

### Used in
- `src/lib/blog/validation.ts`

### What would happen if it were removed?
The admin forms would have no server-verified validation rules — a blog post could be saved with, say, an empty title or an invalid slug format.

---

## `useForm`, `Controller`, `useFieldArray` from `react-hook-form`

### What is it?
A library for managing form state and validation without lots of manual `useState`.

### Why do we use it?
Powers the admin blog-post editor form, which has many fields (title, slug, content, FAQs, SEO fields).

### Example
```tsx
const { register, handleSubmit } = useForm({ resolver: zodResolver(postFormSchema) });
```

### Used in
- `src/app/admin/(dashboard)/blogs/blog-form.tsx`

### What would happen if it were removed?
The blog editor form would need hand-written `useState` + manual validation for every single field, which is exactly what this library avoids.

---

## `zodResolver` from `@hookform/resolvers/zod`

### What is it?
A small adapter connecting a Zod schema to `react-hook-form`.

### Why do we use it?
So the same Zod rules used to validate a blog post double as the form's live validation, with zero duplicated logic.

### Example
```ts
useForm({ resolver: zodResolver(postFormSchema) });
```

### Used in
- `src/app/admin/(dashboard)/blogs/blog-form.tsx`

### What would happen if it were removed?
`react-hook-form` and `zod` would have no way to talk to each other automatically — you'd have to manually call the Zod schema yourself on every form submission.

---

## Styling utilities

## `clsx` from `clsx` / `twMerge` from `tailwind-merge`

### What is it?
Two small utilities for building a `className` string conditionally and safely.

### Why do we use it?
Combined into the shared `cn()` helper (see **styling.md**) used across almost every styled component.

### Example
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

### Used in
- `src/lib/utils.ts`, then imported (as `cn`) throughout the whole component tree

### What would happen if it were removed?
Conditional styling (`isActive ? "bg-white" : "bg-transparent"`) would have to be written out by hand everywhere, and conflicting Tailwind classes could silently both end up in the final markup, causing inconsistent styling.

---

## Icons

## Named icons (e.g. `Menu`, `X`, `ChevronDown`) from `lucide-react`

### What is it?
A large library of ready-made SVG icon components.

### Why do we use it?
Provides a consistent icon set without hand-drawing SVGs for every menu, chevron, or social icon.

### Example
```tsx
import { Menu, X } from "lucide-react";
{open ? <X /> : <Menu />}
```

### Used in
- `src/components/layout/navbar.tsx`, `src/components/admin/sidebar.tsx`, and 60+ other files

### What would happen if it were removed?
Every icon in the UI (menu toggles, chevrons, chart icons, social icons) would need to be replaced with hand-written SVGs or a different icon source.

---

## Backend / database

## `createServerClient` from `@supabase/ssr` and `createClient` from `@supabase/supabase-js`

### What is it?
Client objects for talking to the Supabase database from different environments (server vs. browser — see **nextjs.md** and **data-flow.md**).

### Why do we use it?
This is how the app reads/writes blog posts, categories, authors, and checks admin logins.

### Example
```ts
const supabase = await createClient(); // src/lib/supabase/server.ts
const { data } = await supabase.from("posts").select("*");
```

### Used in
- `src/lib/supabase/server.ts`, `client.ts`, `static.ts`, `middleware.ts`
- `src/lib/blog/queries.ts`, every admin `actions.ts` file

### What would happen if it were removed?
The blog and the entire admin CMS would have no way to read or save data — there is no other database connection in the project.

---

## Rich text (blog editor)

## `useEditor`, `EditorContent` from `@tiptap/react`

### What is it?
The React bindings for the Tiptap rich-text editor.

### Why do we use it?
Powers the "Word-processor-style" box an admin types a blog post into.

### Example
```tsx
const editor = useEditor({ extensions: [StarterKit], content: value });
<EditorContent editor={editor} />
```

### Used in
- `src/components/admin/tiptap-editor.tsx`

### What would happen if it were removed?
Admins would have no visual editor for blog content — they'd need to write raw HTML or JSON by hand.

---

## 3D graphics

## `Canvas` from `@react-three/fiber`, helpers from `@react-three/drei`, `THREE` from `three`

### What is it?
The React-based 3D rendering stack (see **libraries.md**).

### Why do we use it?
Renders the interactive 3D car model and the homepage's cinematic hero scene.

### Example
```tsx
import { Canvas } from "@react-three/fiber";
<Canvas><GltfVehicle variant="hero" /></Canvas>
```

### Used in
- `src/components/webgl/` (18+ files)

### What would happen if it were removed?
The interactive 3D car / x-ray viewer and the 3D homepage hero scene would have no rendering engine — those features couldn't exist at all in their current form.

---

## MDX (legal pages)

## `type { MDXComponents }` from `mdx/types`

### What is it?
A TypeScript type describing the object that customizes how Markdown elements render inside MDX content.

### Why do we use it?
Type-checks the `useMDXComponents` function that gives every legal page's Markdown its Sunkool-specific look.

### Example
```tsx
import type { MDXComponents } from "mdx/types";
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { h1: ({ children }) => <h1 className="...">{children}</h1>, ...components };
}
```

### Used in
- `mdx-components.tsx` (the only place this type is used)

### What would happen if it were removed?
The legal pages' Markdown would render with completely unstyled, default browser HTML (a plain black-on-white `<h1>`, `<p>`, etc.) instead of matching the site's design.
