# Styling in Sunkool.in

## Tailwind CSS (v4) — the main styling approach

Almost all styling in this project is done with **Tailwind CSS**, using small utility class names directly in the JSX instead of writing separate `.css` files per component.

```tsx
<div className="rounded-3xl border border-white/10 bg-carbon p-8">
```

Each class does one small thing (`rounded-3xl` = rounded corners, `border` = a border, `bg-carbon` = a background color, `p-8` = padding) and you combine as many as you need.

This project uses **Tailwind v4**, which configures itself differently from older Tailwind versions you might have seen — there's no `tailwind.config.js` file here. Instead, configuration lives directly inside the CSS file itself:

```css
/* src/app/globals.css */
@import "tailwindcss" source("../");

@theme {
  --color-void: #000000;
  --color-electric: #58a7e8;
  --font-display: var(--font-sora), "Segoe UI", sans-serif;
  --spacing-section: 8rem;
}
```

Anything defined inside `@theme` automatically becomes a usable Tailwind class. Defining `--color-electric` here means `bg-electric`, `text-electric`, and `border-electric` all become valid class names everywhere in the project, without any extra setup.

`postcss.config.mjs` is the (very short) file that actually plugs Tailwind into the build process:
```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
```

## The design system: SUN vs KOOL

The color palette (defined in that same `@theme` block) directly reflects the brand: "SUN" colors (orange/amber — heat) and "KOOL" colors (blue — cooling), plus a set of near-black "carbon" tones for the site's dark background.

```css
--color-sun: #f47521;      /* heat / energy */
--color-kool: #58a7e8;     /* cooling / protection (also called "electric") */
--color-carbon: #0b0d0f;   /* near-black background */
--color-silver: #c0c0c0;
```

There's no light-mode/dark-mode toggle — the site is **always dark** (`viewport.colorScheme = "dark"` in `src/app/layout.tsx`), matching a premium/automotive aesthetic.

## One global stylesheet, no CSS Modules

There is exactly **one** global CSS file: `src/app/globals.css`. This project does **not** use CSS Modules (there are no `*.module.css` files) — every visual style is either a Tailwind utility class in the JSX, or one of the custom classes defined once in `globals.css` and reused everywhere via `className`.

## Custom utility classes

Beyond Tailwind's built-in classes, `globals.css` defines several of its own, using Tailwind v4's `@utility` syntax and a plain `@layer utilities` block:

```css
@utility container-lux {
  width: 100%;
  margin-inline: auto;
  max-width: 80rem;
  padding-inline: 1.5rem;
}
```

- **`container-lux`** — the standard centered, max-width page container used on nearly every section.
- **`prose-sunkool`** — typography styling applied to the `<article>` wrapping a rendered blog post.
- **`headline`**, **`eyebrow`** — the site's two recurring typography treatments (a large cinematic heading style, and the small uppercase "label" text above section titles).
- **`text-gradient-silver`**, **`text-gradient-electric`**, **`text-gradient-sun`**, **`text-gradient-kool`**, **`text-sunkool`** — gradient text effects, each clipping a `linear-gradient` background to the text shape.
- **`glass`**, **`glass-strong`** — frosted-glass/backdrop-blur card effects.
- **`focus-ring`** — a consistent, accessible keyboard-focus outline used on every interactive element.
- **`skip-link`** — the "Skip to main content" accessibility link, hidden until it receives keyboard focus.
- **`climate-slider`** — custom-styled `<input type="range">` (used in the film configurator).
- **`bg-grid`**, **`mask-fade-y`**, **`noise`** — decorative background effects (a faint grid pattern, a top/bottom fade mask, and a subtle film-grain-style noise texture).

## Conditionally combining classes: `cn()`

Because Tailwind classes are just strings, this project has a small shared helper, `cn()`, for building a `className` conditionally without ending up with duplicate or conflicting classes:

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
<Link
  className={cn(
    "rounded-full px-4 py-2",
    active ? "text-black bg-white" : "text-white/85"
  )}
/>
```

`clsx` handles the "only include this class if that condition is true" logic; `tailwind-merge` then cleans up the result so that if two classes both try to set, say, the text color, only the *last* one wins (the way you'd expect), instead of both ending up in the final HTML and fighting each other.

## Responsive styles

Standard Tailwind responsive prefixes are used throughout — `sm:`, `md:`, `lg:` — to change layout at different screen widths, e.g. `hidden lg:flex` (hide on mobile, show as a flex row on large screens, used to swap the desktop nav for the mobile hamburger menu).

## Animations and transitions

Simple hover/focus transitions use Tailwind's built-in `transition-colors`, `transition-transform`, etc. classes directly (used **314 times** across 205 files — by far the most common animation-related pattern in the project). Bigger, scroll-driven, or physics-based animation is handled by the `motion` and `gsap` libraries instead of CSS — see **animations.md** for the full breakdown, including two custom `@keyframes` animations (`float-slow`, `spin-slow`) also defined in `globals.css`.

## In simple words

If you want to change how something *looks*, you're almost always looking for a `className="..."` string directly on the element in its `.tsx` file — not a separate stylesheet. If you want to change a *color, font, or spacing value used sitewide*, you're looking at the `@theme` block near the top of `src/app/globals.css`.
