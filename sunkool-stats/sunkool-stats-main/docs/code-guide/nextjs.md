# Next.js Concepts Used in Sunkool.in

Next.js is a framework built on top of React. React lets you build UI out of components; Next.js adds the things every real website needs on top of that: pages/URLs, navigation, image optimization, SEO metadata, and a place to run server-side code.

This project uses **Next.js 16**, with the **App Router** (the `src/app/` folder). There is no "Pages Router" (the older `pages/` folder style) anywhere in this project.

> ⚠️ **Heads up if you've used Next.js before:** version 16 renamed a couple of things you might expect to see under their old names. This doc calls both out where relevant.

## App Router: pages, routes and layouts

### Pages

Every folder inside `src/app/` that contains a `page.tsx` becomes a real URL. The file's default export is the component that renders for that URL.

```tsx
// src/app/contact/page.tsx  →  https://sunkool.in/contact
export default function ContactPage() {
  return <ContactHero />;
}
```

### Layouts

A `layout.tsx` file wraps every page underneath it in the folder tree. This project has one, at the very top: `src/app/layout.tsx`. It renders the `<html>`/`<body>` tags, loads the two fonts (Sora and Inter), injects the site's structured-data (`<script type="application/ld+json">`), and wraps every page in `SmoothScroll` and `ChromeGate` (see **components.md**).

```tsx
// src/app/layout.tsx (simplified)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <ChromeGate>{children}</ChromeGate>
        </SmoothScroll>
      </body>
    </html>
  );
}
```

Everything a visitor sees — the homepage, `/contact`, `/blog`, a city page — gets rendered as `{children}` inside this one layout.

### Dynamic routes (`[city]` and `[slug]`)

Square brackets in a folder name mean "this part of the URL can be anything, and Next.js will hand you the actual value."

- `src/app/[city]/page.tsx` serves `/delhi`, `/mumbai`, `/nagpur`, and every other supported city from **one file**. Inside, it reads `params.city` to know which city was requested:

  ```tsx
  export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
    const { city } = await params;
    if (!isCitySlug(city)) notFound(); // not one of our 23 cities → real 404
    // ...render that city's content
  }
  ```

- `src/app/blog/[slug]/page.tsx` works the same way for `/blog/any-post-title`.

Note that `params` is a **Promise** you have to `await` — that's a Next.js 15/16 change (older tutorials show `params.city` directly, without `await`).

### Route groups: `(dashboard)`

`src/app/admin/(dashboard)/` — a folder name wrapped in **parentheses** is a *route group*. It lets you apply a shared layout (here, the admin sidebar + top bar) to a set of pages (`/admin/dashboard`, `/admin/blogs`, `/admin/categories`, ...) **without** the word "dashboard" showing up in the actual URL.

### Static generation (`generateStaticParams`)

Instead of rebuilding a city page from scratch every time someone visits it, Next.js can generate all 23 city pages **once, at build time**, and serve the pre-built HTML instantly after that.

```tsx
// src/app/[city]/page.tsx
export const dynamicParams = false; // reject any city slug NOT in the list below
export function generateStaticParams() {
  return Object.keys(cities).map((city) => ({ city }));
}
```

`dynamicParams = false` is important: it means if someone requests `/notarealcity`, Next.js won't even try to render a page for it — it goes straight to a real 404, instead of silently trying (and failing) to generate one on the fly.

## Server Components vs. Client Components

This is the single biggest new idea in the App Router.

- **Server Components** run only on the server and send finished HTML to the browser. They can directly read a database, use secret keys, and never ship their own JavaScript to the visitor. **Every component in this project is a Server Component by default** — you don't have to opt in.
- **Client Components** run in the browser too, so they can use things a server can't: `useState`, `onClick`, `window`, browser APIs, animation libraries. You opt in with the `"use client"` line at the very top of the file.

```tsx
"use client"; // ← without this line, useState below would be a build error

import { useState } from "react";
export function ContactForm() {
  const [fields, setFields] = useState({ name: "", email: "" });
  // ...
}
```

Practical examples from this codebase:
- `src/components/layout/footer.tsx` has **no** `"use client"` — it's a Server Component, because it's just static markup plus a `city` prop.
- `src/components/layout/navbar.tsx` **does** have `"use client"` — it needs `useState` (mobile menu open/closed) and `usePathname` (to highlight the active link).
- A Server Component (like `Footer`) can render a Client Component fine, but a Server Component can't itself use `useState`/`useEffect`.

## `next/image`

`next/image`'s `<Image>` component replaces the plain HTML `<img>` tag. It automatically resizes images for the visitor's screen, converts them to modern formats (this project explicitly enables AVIF/WebP in `next.config.ts`), and prevents layout shift while the image loads.

```tsx
import Image from "next/image";

<Image src="/logo.png" alt="SUNKOOL" width={120} height={40} />
```

Used everywhere a real photo appears — see **imports.md** for the full write-up.

## `next/link`

`<Link>` replaces `<a>` for navigating *within* the site. It preloads the destination page in the background so clicking feels instant, instead of a full page reload.

```tsx
import Link from "next/link";
<Link href="/ppf">Paint Protection Film</Link>
```

Used throughout `Navbar`, `Footer`, and any component that links to another internal page.

## Metadata (SEO)

Instead of hand-writing `<title>` and `<meta>` tags, Next.js lets a page export a `metadata` object (for a fixed page) or a `generateMetadata()` function (when the content depends on data, like a specific blog post or city).

```tsx
// A fixed page — src/app/ppf/page.tsx
export const metadata: Metadata = {
  title: "Paint Protection Film",
  alternates: { canonical: "/ppf" },
};

// A data-dependent page — src/app/[city]/page.tsx
export async function generateMetadata({ params }) {
  const { city } = await params;
  const seo = cityMetadata(city); // looks up that city's title/description
  return { title: seo.title, alternates: { canonical: `/${city}` } };
}
```

The root layout also sets `metadataBase` (the site's real domain) so every other page's relative URLs resolve correctly, plus Google/Bing site-verification codes and the default Open Graph preview image.

## Special "file convention" routes

Next.js treats a few specific filenames in `app/` as generators for non-HTML files instead of pages:

- `src/app/robots.ts` → generates `/robots.txt`
- `src/app/sitemap.ts` → generates `/sitemap.xml`
- `src/app/manifest.ts` → generates the PWA manifest file
- `src/app/opengraph-image.tsx` → generates the image shown when a link is shared on social media

## Routing/proxy file (`src/proxy.ts`)

In most Next.js projects and tutorials, this file is called **`middleware.ts`**. Next.js 16 renamed the convention to **`proxy.ts`** (the exported function is also renamed from `middleware` to `proxy`) — this project already uses the new name.

It runs before almost every request reaches a page, and here it does two things:

1. **Canonical domain redirect** — a visitor on the bare `sunkool.in` is 308-redirected to `https://www.sunkool.in`. Any other host (the project's `*.vercel.app` URL, preview deployments) is served normally so it can be tested, but with an `X-Robots-Tag: noindex` header so search engines never index it; `www.sunkool.in` and `localhost` get no header. The rules live in `src/lib/canonical-host.ts` (tests: `canonical-host.test.ts`).
2. **Admin protection** — for any `/admin/*` route, it refreshes the visitor's Supabase login session and redirects them to `/admin/login` if they're not signed in.

```ts
// src/proxy.ts (simplified)
export async function proxy(request: NextRequest) {
  // ...canonical-domain check...
  if (!isAdminRoute) return NextResponse.next();
  const { user } = await updateSession(request);
  if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));
}
```

## Server Actions (instead of API routes)

If you go looking for a typical REST API (`src/app/api/.../route.ts`), you won't find one — **this project has zero API routes.** Instead, every form submission that needs to save data (creating a blog post, logging in, deleting a category) calls a **Server Action**: a plain async function marked `"use server"` that runs on the server but is called directly from a Client Component, like a regular function call.

```ts
// src/app/admin/login/actions.ts
"use server";

export async function login(_prevState, formData: FormData) {
  const email = String(formData.get("email"));
  // ...check credentials against Supabase...
  redirect("/admin/dashboard");
}
```

```tsx
// called from a Client Component via useActionState — see hooks.md
const [state, formAction] = useActionState(login, null);
<form action={formAction}>...</form>
```

This pattern is used across every admin form: `src/app/admin/(dashboard)/blogs/actions.ts`, `.../categories/actions.ts`, `.../authors/actions.ts`, `src/app/admin/login/actions.ts`, `src/app/admin/actions.ts`.

## MDX

MDX is Markdown that can also embed React components. This project uses it for the three legal pages (`content/legal/*.mdx`). `next.config.ts` wires up `@next/mdx` (with the `remark-gfm` and `remark-frontmatter` plugins) so `.mdx` files can be imported like any other page component, and the root `mdx-components.tsx` file defines how plain Markdown elements (`h1`, `p`, `a`, `table`, ...) should actually look, using the site's own design system.

## What this project does *not* use

To avoid confusion if you go looking for these: there's no Pages Router, no `getServerSideProps`/`getStaticProps` (those are Pages Router-only), no API routes, and no i18n/multi-language routing.
