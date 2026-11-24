# How Data Flows Through Sunkool.in

Sunkool.in isn't one single pattern — different parts of the site get their data in different ways. This page walks through each real flow that actually exists in the codebase.

## 1. A static marketing page (e.g. `/ppf`, `/window-film`)

Most of the site's content isn't stored in a database at all — it's written directly in TypeScript "content" files and imported straight into the page.

```text
User visits /ppf
      ↓
src/app/ppf/page.tsx           (a Server Component)
      ↓
imports from src/lib/ppf-content.ts and src/lib/ppf-media.ts
      (plain, hand-written text + image paths — no database, no API call)
      ↓
passed as props into section components, e.g. src/components/ppf/ppf-hero.tsx
      ↓
those sections render the HTML, and Client Components inside them
(Reveal, MagneticButton, motion elements) hydrate in the browser to animate
      ↓
UI the visitor sees
```

**In simple words:** for a page like this, "the data" is just TypeScript objects living in `src/lib/*-content.ts` — a developer edits that file directly to change the page's copy. There's no CMS or database involved for these pages.

## 2. The blog

The blog is the one part of the public site backed by a real database (Supabase), with a safety-net fallback.

```text
User visits /blog
      ↓
src/app/blog/page.tsx  (Server Component, runs on the server)
      ↓
calls src/lib/blog/queries.ts → getPublishedPosts()
      ↓
   ┌─────────────────────────────┐
   │ Is Supabase configured/reachable? │
   └─────────────────────────────┘
      ↓ yes                              ↓ no / build-time fallback
queries the real Supabase database    reads the bundled
(posts, categories, authors tables)   src/lib/blog/seed-data.json instead
      ↓                                  ↓
             both paths return the same shape: { posts, total, page, pageSize }
      ↓
passed as props to <BlogGrid>, <CategoryFilter>, <Pagination> (Client Components)
      ↓
UI the visitor sees
```

Visiting one specific post (`/blog/some-post-title`) follows the same pattern through `src/app/blog/[slug]/page.tsx` → `getPostBySlug()`, then converts the post's rich-text content (stored as Tiptap JSON) into real HTML via `src/lib/blog/render.ts` before rendering it.

## 3. Publishing a blog post from the admin dashboard

This is the one place in the app where a visitor's action actually **writes** to the database.

```text
Admin fills out the form at /admin/blogs/new
      ↓
src/app/admin/(dashboard)/blogs/blog-form.tsx  (Client Component)
      — react-hook-form tracks what's typed
      — zodResolver + the schema in src/lib/blog/validation.ts checks it's valid
      ↓
on submit, calls a Server Action: createPost() in
src/app/admin/(dashboard)/blogs/actions.ts   ("use server")
      ↓
that Server Action calls the Supabase client (src/lib/supabase/server.ts)
and INSERTs the new row into the "posts" table
      ↓
revalidates the blog's cached pages, then redirect()s the admin back
to the posts list
      ↓
next time ANY visitor loads /blog, the new post shows up
```

**In simple words:** the admin's browser never talks to Supabase directly — it calls a function that *looks* local (`createPost(...)`) but actually runs securely on the server, which is the only place allowed to write to the database.

## 4. Logging into `/admin`

```text
Visitor requests any /admin/* page
      ↓
src/proxy.ts runs FIRST, before the page (this project's version of "middleware")
      ↓
   ┌───────────────────────────┐
   │ Does a valid Supabase session cookie exist? │
   └───────────────────────────┘
      ↓ no                                  ↓ yes
redirected to /admin/login          request continues to the real page
      ↓
admin submits the login form
      ↓
login() Server Action (src/app/admin/login/actions.ts)
      — checks email/password against Supabase Auth
      — ALSO checks the visitor is listed in the "admins" table
        (so a random Supabase account can't get in just by signing up)
      ↓
on success: redirect() to /admin/dashboard
on failure: returns { error: "Invalid email or password." },
            read via useActionState() back in the login form
```

## 5. The homepage's cinematic 3D hero

```text
User scrolls the homepage
      ↓
src/components/experience/tech-demo-experience.tsx measures scroll position
      ↓
converts scroll position into a 0→1 "progress" value, stored in a ref
(not React state — this needs to update every single frame without
triggering a full re-render each time)
      ↓
that progress value feeds TWO different rendering systems at once, depending
on screen size:
      ↓                                              ↓
DESKTOP: <ScrollScrubFrames>                    MOBILE: <MobileHeroPhoto>
draws the matching JPEG frame from              (a single static, finished
public/frames/ onto a <canvas> for              photo — the frame-by-frame
the current scroll position (a cheap            scrub effect is skipped on
"fake video" instead of a real video file)      touch devices where it's janky)
      ↓
also drives src/components/webgl/sun-battle-scene.tsx (a react-three-fiber
3D scene) — camera angle, "heat" and "film applied" amounts all update every
frame based on that same progress ref
      ↓
UI the visitor sees: a scroll-controlled cinematic sequence
```

## 6. A visitor being redirected to their city

```text
Visitor on /indore clicks "Yes" on the "Use your location?" popup
(src/components/cities/city-location.tsx)
      ↓
browser's built-in Geolocation API returns { latitude, longitude }
      ↓
nearestCity(lat, lon) in src/lib/cities.ts
      — calculates the real-world distance to all 23 covered cities
      — returns whichever one is closest, but ONLY if it's within 75km
        (otherwise returns null — no confident match, stay put)
      ↓
if the matched city is different from the current page:
router.replace(`/${matchedCity}`)
      ↓
visitor lands on the correct city's page
```

## 7. Simple public forms (Contact, Become a Dealer)

Unlike the admin blog form, these do **not** talk to a database or a Server Action at all:

```text
User fills out the Contact or Dealer form
      ↓
plain React useState tracks the field values (no react-hook-form/zod here —
these forms don't need strict validation, since nothing gets saved)
      ↓
on submit: buildEnquiryWhatsAppUrl() / buildDealerApplicationWhatsAppUrl()
(src/lib/contact.ts) builds a wa.me link with the form's answers pre-filled
      ↓
window.open(url) — opens a real WhatsApp chat with SUNKOOL, pre-filled
      ↓
the actual conversation happens in WhatsApp, not on the website
```

**In simple words:** these two forms never send data to Sunkool's own servers — they hand the visitor off to a pre-filled WhatsApp conversation instead, which is why they don't need the heavier validation stack the admin CMS uses.
