# Hooks Used in Sunkool.in

A **hook** is just a function whose name starts with `use` that lets a component tap into something React (or Next.js) manages for it — like "remember this value between renders" or "run this code after the page loads." This page only documents hooks that are **actually used** in this codebase, with a real example from the project for each one.

## Built-in React hooks

### `useState`
Remembers a value across re-renders, and re-renders the component whenever you change it.

```ts
// src/components/layout/navbar.tsx
const [scrolled, setScrolled] = useState(false);
const [open, setOpen] = useState(false);
```
**In simple words:** tracks whether the page has been scrolled (to shrink the navbar) and whether the mobile menu is currently open.

### `useEffect`
Runs some code *after* the component has rendered — typically to talk to something outside React, like the browser window, and clean up after itself.

```ts
// src/components/layout/navbar.tsx
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```
**In simple words:** listens for the browser's scroll event so the navbar knows when to change style, and removes that listener if the component ever goes away.

### `useRef`
Holds onto a value (often a reference to a real DOM element) that **doesn't** trigger a re-render when it changes.

```ts
// src/components/common/count-up.tsx
const ref = useRef<HTMLSpanElement>(null);
const hasAnimated = useRef(false);
```
**In simple words:** `ref` points at the actual `<span>` element on the page (so it can be watched for visibility), and `hasAnimated` is a silent on/off switch remembering "has the counting-up animation already played," without needing to trigger a re-render just to remember that.

### `useMemo`
Re-runs an expensive calculation **only** when its inputs actually change, instead of on every single render.

```ts
// src/components/configurator/configurator.tsx
const result = useMemo(
  () => (complete ? recommend(answers) : null),
  [complete, answers]
);
```
**In simple words:** only re-runs the "which film matches your answers" scoring logic when the quiz answers actually change.

### `useCallback`
Like `useMemo`, but for a *function* instead of a value — it keeps the exact same function around between renders unless its inputs change.

```ts
// src/components/admin/topbar.tsx
const closeBell = useCallback(() => setBellOpen(false), []);
```
**In simple words:** gives the "close this dropdown" function a stable identity so other code that depends on it (like a click-outside-to-close listener) doesn't re-subscribe on every render.

### `useTransition`
Marks an update as "not urgent" so the UI can show a pending/loading state instead of freezing while something async runs.

```ts
// src/components/admin/confirm-button.tsx
const [isPending, startTransition] = useTransition();
onClick={() => startTransition(async () => {
  await onConfirm();
  onClose();
})}
```
**In simple words:** used on every "delete this" confirmation button in the admin dashboard, so the button can show a "Working…" state while the delete finishes, without the whole page feeling frozen.

### `useActionState`
Connects a `<form>` directly to a Server Action (see **nextjs.md**) and tracks that action's returned state (like an error message) plus whether it's still running.

```ts
// src/app/admin/login/login-form.tsx
const [state, formAction, isPending] = useActionState(login, null);
```
**In simple words:** wires the admin login form straight to the `login` server function, so `state.error` automatically holds "Invalid email or password" if the sign-in attempt fails — no manual `fetch` call or extra state needed.

> This is the modern replacement for the older `useFormState` hook — if you've seen tutorials mention `useFormState`, this project uses its newer name instead.

### `useId`
Generates a unique ID string that's safe to use even when the same component renders more than once on a page.

```ts
// src/components/admin/dashboard-charts.tsx
const id = useId().replace(/:/g, "");
```
**In simple words:** makes sure that if the dashboard shows two charts side by side, their internal SVG gradient definitions don't clash with each other by accidentally sharing an ID.

### `useSyncExternalStore`
Safely reads a value that lives *outside* React (like a browser setting) and re-renders whenever that outside value changes.

```ts
// src/hooks/use-reduced-motion.ts
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```
**In simple words:** reads the visitor's OS-level "reduce motion" accessibility preference. This is the correct/safe way to read a browser API like this in a framework that also renders on the server (where there's no browser to check) — `getServerSnapshot` just returns a safe default (`false`) for that case.

## Built-in Next.js hooks

These come from `next/navigation`, not React itself — they only work in a Client Component.

### `usePathname`
Returns the current URL's path (e.g. `"/ppf"`), and re-runs your component whenever the visitor navigates.

```ts
// src/components/layout/navbar.tsx
const pathname = usePathname();
```
**In simple words:** used to highlight whichever nav link matches the page you're currently on, and to hide the navbar specifically on the homepage.

### `useRouter`
Lets you navigate to a different page **from code** (a click handler, a `useEffect`, etc.) instead of the visitor clicking a `<Link>`.

```ts
// src/components/cities/city-location.tsx
const router = useRouter();
router.replace(`/${match}`, { scroll: false });
```
**In simple words:** when a visitor allows location access on a city page and their GPS position matches a *different* covered city, this sends them to that city's page automatically.

### `useSearchParams`
Reads the `?...` query-string part of the current URL.

```ts
// src/components/blog/blog-search.tsx
const searchParams = useSearchParams();
const [q, setQ] = useState(searchParams.get("q") ?? "");
```
**In simple words:** lets the blog search box start pre-filled with whatever `?q=` is already in the URL (e.g. if you shared a link to search results).

## Custom hooks written specifically for this project

### `useImmersiveChrome`
📄 Defined in `src/lib/immersive-store.ts`

```ts
export function useImmersiveChrome(): ImmersiveChrome {
  const [, tick] = useState(0);
  useEffect(() => {
    const listener = () => tick((n) => n + 1);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);
  return chrome;
}
```
Returns `{ navVisible, hudVisible, badgeVisible }`. **In simple words:** the homepage's cinematic scroll hero needs to hide the navbar/footer/floating badges at certain moments. Rather than passing that state down through many layers of components, this hook lets `Navbar` (way up in the layout) and the hero experience (deep inside the page) both read/write the same shared on/off switches directly.

### `useVisibleVideo`
📄 Defined in `src/hooks/use-visible-video.ts` — returns `{ videoRef, inView }`.

**In simple words:** attaches a background/brand video to `videoRef`, and only actually loads and plays it once it scrolls into view — then pauses it again if the browser tab is hidden or it scrolls back off-screen. Saves bandwidth and battery on a page with several such videos.

### `useReducedMotion`
📄 Defined in `src/hooks/use-reduced-motion.ts` (shown above under the built-in `useSyncExternalStore` section, since that's what it's built from). Used by animated components (`CountUp`, `VisibleLoop`, the 3D hero) to skip their animation entirely for visitors who've asked their operating system to reduce motion.

### `useVisibleLoop`
📄 Defined in `src/components/ui/visible-loop.tsx` (not exported outside that file — it's an internal helper for the `VisibleLoop`/`VisibleLoopSpan` components).

**In simple words:** starts an *infinite, looping* animation (like ambient floating particles), but automatically pauses it the moment the element scrolls off-screen, the browser tab is backgrounded, or the visitor has reduced motion turned on — so a decorative background loop never wastes CPU/battery when nobody can even see it.

### A few small, single-file internal hooks

These aren't exported for reuse elsewhere — each lives inside the one component that needs it, but they're worth knowing about if you're reading that file:

- **`useChartSize`** (inside `src/components/admin/dashboard-charts.tsx`) — watches its container's size with a `ResizeObserver` so the admin dashboard's SVG charts stay responsive.
- **`useSuvBodyGeometry` / `useBodyGeometry`** (inside `src/components/webgl/vehicle-model.tsx` and `procedural-car.tsx`) — builds and memoizes the 3D car body shape used by the WebGL hero.
- **`useAnimatedNumber`** (inside each city's `CountUp.tsx`) — runs the easing loop that animates a stat counter from 0 up to its target value.

## ⚠️ A naming trap to know about

You'll see **two completely different things** both called `useInView` in this codebase:

1. **The one from the `motion` library** (`import { useInView } from "motion/react"`) — used in the shared `src/components/ui/reveal.tsx` and `src/components/common/count-up.tsx`. This is the one used everywhere on the main marketing pages.
2. **A hand-written custom hook**, duplicated across each city's own folder (e.g. `src/components/cities/content/bangalore/lib/useInView.ts`), doing the same *kind* of job (detect when an element scrolls into view) with a hand-rolled `IntersectionObserver` instead of the library.

If you're inside `src/components/cities/content/<any-city>/`, you're looking at the second one. Everywhere else, it's the library's.
