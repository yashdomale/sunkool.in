# Animations in Sunkool.in

This page only documents animation technology **confirmed to actually be in the code** — nothing here is assumed. There are four separate animation systems in this project, each with a different, mostly non-overlapping job.

## 1. `motion` — the main animation library (site-wide)

**What it is:** `motion` (imported as `from "motion/react"`) is the current package name for what used to be called Framer Motion — same animation library, same creators, just renamed. It's the dominant animation tool in this codebase, showing up in roughly **70 files**.

**Why it's used:** It lets you describe an animation as "what should this look like before, during, and after" instead of writing manual CSS keyframes or timing code by hand, and it plays nicely with React state (an element can animate in only once it's actually in the DOM).

**Where it's used / what it controls:**

- **Scroll-reveal animations** — `src/components/ui/reveal.tsx`'s `Reveal`/`RevealGroup` components use `motion`'s `useInView` to fade+slide an element up the first time it scrolls into view. This one small file is reused across dozens of sections (`page-header.tsx`, `section-heading.tsx`, `warranty-view.tsx`, `dealer/benefits.tsx`, and more) — it's the site's single most-reused animation.
- **Mount/unmount transitions** — `AnimatePresence` (paired with `motion`) is used for the mobile nav menu (`navbar.tsx`), the admin notification popovers, tooltips/HUD elements, and the configurator's step-by-step quiz.
- **Scroll-linked parallax** — `useScroll` + `useTransform` drive effects that move or fade as you scroll *past* an element (not just "is it visible yet"), used in the homepage hero and the PPF/Window Film/Ultra Edge page heroes.
- **Physics-based interactivity** — `useMotionValue` + `useSpring` + `useTransform` power the "magnetic" hover effect on the main call-to-action button (`src/components/ui/button.tsx`) and card-tilt effects on product cards.
- **Animated counters** — `src/components/common/count-up.tsx` uses `motion`'s `useInView` to know when to start counting a number up from 0.

**Simple example:**
```tsx
import { motion, useInView } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 28 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.9 }}
>
  This fades and slides up once it's visible.
</motion.div>
```

## 2. `gsap` (GreenSock) — scoped only to the city pages

**What it is:** A separate, older, very established animation library, used here specifically for its **ScrollTrigger** plugin (scroll-position-linked animation).

**Why it's used:** ScrollTrigger is particularly good at "start/scrub this animation based on exactly where the element is on screen," which the city landing page template leans on for its reveal effects.

**⚠️ Important scope note:** this is **not** a site-wide animation library. It is only imported in:
- `src/components/cities/city-animations.tsx` — the shared driver behind every `/[city]` page. It animates the hero headline/subtext in on load, fades+slides up any `.reveal-fade-up` element the first time it's scrolled into view, staggers groups of `.reveal-stagger` children (cards, stat pills, table rows), and does a slow scale-down on `.reveal-image` elements as you scroll past them.
- A couple of per-city files, e.g. `src/components/cities/content/pune/components/StatReveal.tsx` and `.../mumbai/components/StatReveal.tsx`, `.../pune/components/NanoLayerStack.tsx`.

If you're working on the homepage, `/ppf`, `/window-film`, or any other main marketing page, you will **not** find GSAP there — that's all `motion`.

**Simple example (conceptually, what `city-animations.tsx` does):**
```ts
gsap.registerPlugin(ScrollTrigger);
gsap.from(".reveal-fade-up", {
  opacity: 0, y: 24,
  scrollTrigger: { trigger: ".reveal-fade-up", once: true },
});
```

## 3. `lenis` — smooth scrolling

**What it is:** A library that intercepts the browser's normal mouse-wheel/trackpad scrolling and replays it with eased, physics-like motion, so the page glides instead of moving in the small discrete jumps a browser does by default.

**Why it's used:** Gives a handful of key pages a more premium, cinematic feel when scrolling.

**Where it's used:** Set up in `src/components/providers/smooth-scroll.tsx`, which wraps the whole app (from `src/app/layout.tsx`) but only actually turns Lenis on when **all** of these are true:
- The current route is one of: `/`, `/ppf`, `/window-film`, `/ultra-edge`, `/regulations`, `/our-journey` (or a sub-path of one) — **except** `/` itself is explicitly excluded, because the homepage's own 400vh scroll-scrubbed hero (see below) works better with the browser's native scroll instead of Lenis fighting it.
- The visitor hasn't requested reduced motion.
- The visitor isn't on a touch device (Lenis and touch momentum scrolling don't mix well).

When active, it's created with custom easing/duration settings (`src/lib/lenis-instance.ts` holds the current instance so other code — like in-page anchor links — can call `lenis.scrollTo(...)`).

## 4. Plain CSS animations (`src/app/globals.css`)

Four `@keyframes` animations are defined; only **two** are actually wired up to a CSS class that gets used:

| Keyframe | Used? | What it does |
|---|---|---|
| `float-slow` | ✅ Used (`.animate-float-slow`, in `src/components/home/hero.tsx`) | A gentle, slow up-and-down bob — applied to a glowing orb behind the homepage hero. |
| `spin-slow` | ✅ Used (`.animate-spin-slow`, also in `home/hero.tsx`) | A very slow (26-second) full rotation, for a decorative ring. |
| `shimmer` | ⚠️ **Defined but currently unused** — no `.animate-shimmer` class or matching usage was found anywhere. | Would sweep a highlight across a background (a common "loading skeleton" or "shine" effect), but nothing on the site currently triggers it. |
| `pulse-ring` | ⚠️ **Defined but currently unused** — same as above. | Would scale and fade out like a radar ping/sonar pulse, but nothing currently uses it. |

There's also a global rule that respects the visitor's OS-level accessibility setting, shrinking **every** CSS animation/transition on the page down to virtually nothing if they've asked for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

Separately, Tailwind's `motion-safe:` prefix is used for a couple of purely decorative inline spins (e.g. a slow rotating ring on the Window Film and Ultra Edge hero sections) — `motion-safe:animate-[spin_40s_linear_infinite]` only applies that spin if the visitor has **not** asked for reduced motion, without needing any JavaScript check.

## How the four systems fit together

```text
motion (motion/react)   → everywhere except the city pages: reveals, parallax, menus, buttons
gsap + ScrollTrigger     → ONLY the /[city] pages' scroll reveal effects
lenis                    → smooth-scrolls the mouse wheel itself, on 6 specific routes
plain CSS @keyframes     → 2 small decorative loops on the homepage hero only
```

They don't fight each other because they each own a different job: `lenis` changes *how scrolling itself feels*, while `motion`/`gsap`/CSS all animate *individual elements* in response to scroll position, visibility, or user interaction — and no page mixes `motion` and `gsap` together for the same element.
