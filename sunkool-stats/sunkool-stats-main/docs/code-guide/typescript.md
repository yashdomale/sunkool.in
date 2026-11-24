# TypeScript Patterns Used in Sunkool.in

TypeScript is JavaScript with an extra layer that checks your code's *shapes* before it ever runs — catching mistakes like "you forgot this field" or "you passed a number where a string was expected" while you're still writing the code, instead of when a visitor hits an error in production.

This project is 100% TypeScript (every file is `.ts` or `.tsx`) with `"strict": true` in `tsconfig.json`, which is the strictest, most careful setting.

## `type` (the main way shapes are described here)

Most shapes in this codebase are described with `type`, not `interface`. A `type` gives a name to a shape you can reuse everywhere.

```ts
// src/lib/blog/types.ts
export type Category = {
  id: string;
  name: string;
  slug: string;
};
```

Anywhere in the code that needs "a category," it can just say `Category` instead of repeating those three fields.

## `interface` (used, but rare here)

An `interface` does almost the same job as `type` for describing an object's shape. This codebase mostly prefers `type`, but `interface` does show up occasionally — usually for a component's props:

```ts
// src/components/webgl/hero-environment.tsx
interface HeroEnvironmentProps {
  heatRef?: React.MutableRefObject<number>;
  sunScale?: number;
}
```

**In simple words:** `type` and `interface` both just describe "what fields does this thing have." If you see one, mentally treat it the same as the other.

## Props types

Every React component's props get their own `type` (or inline object type), so TypeScript can catch a typo or a missing prop before the app even runs.

```ts
// src/components/ui/reveal.tsx
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "span" | "li";
};

export function Reveal({ children, className, delay = 0, y = 28, once = true }: RevealProps) {
  // ...
}
```

If someone tried to use `<Reveal delay="soon" />` (a string instead of a number), TypeScript would flag it immediately.

## Optional properties (`prop?: type`)

A `?` after a property name means "this field is allowed to be missing entirely" — different from a field that's allowed to be `null`.

```ts
// src/lib/warranty-content.ts
export type WarrantyRegistrationStep = {
  title: string;
  body: string;
  details?: string[]; // some steps have extra detail bullets, most don't
  success?: boolean;
};
```

## Union types (`A | B`)

A union type says "this value is one of these specific options, and nothing else."

```ts
// src/lib/tech-demo-chapters.ts
export type NarrativeScene =
  | "cold_open"
  | "assault"
  | "penetration"
  | "protection";
```

This is used constantly for status-style fields, e.g. `export type PostStatus = "draft" | "published";` in `src/lib/blog/types.ts` — a blog post can only ever be one of those two words, and TypeScript will refuse to compile code that tries to assign anything else.

## Discriminated unions

A "discriminated union" is a union type where every option shares one common field with a different literal value, which TypeScript can use to figure out exactly which shape you're dealing with.

```ts
// src/app/admin/(dashboard)/categories/actions.ts
type ActionResult = { success: true } | { success: false; error: string };
```

Because `success` is either literally `true` or literally `false`, TypeScript automatically knows that inside `if (!result.success) { ... }`, the `error` field is guaranteed to exist — you don't have to check for it separately.

## Generics (`<T>`)

A generic is a type or function that can work with *any* type you give it, while still keeping full type-safety — instead of writing the same hook three times for three different HTML elements, you write it once with a placeholder.

```ts
// src/components/ui/visible-loop.tsx
function useVisibleLoop<T extends HTMLElement>(target: TargetAndTransition) {
  const ref = useRef<T>(null);
  // ...
  return { ref, controls };
}
```

`<T extends HTMLElement>` means "you can use this with any kind of HTML element (a `div`, a `span`, ...), and whichever one you pick, `ref` will correctly be typed as a ref to *that* element" — not a generic, useless `HTMLElement`.

## `import type`

When you're only importing something to use as a *type* (never as an actual value at runtime), writing `import type` instead of a plain `import` makes that explicit — and lets the build tool safely strip the import out of the final JavaScript, since types don't exist anymore once the code is compiled.

```ts
// src/app/[city]/page.tsx
import type { Metadata } from "next";
```

```ts
// src/app/admin/(dashboard)/authors/author-form.tsx
import type { Author } from "@/lib/blog/types";
```

## `as const`

`as const` locks a value down to its most specific possible type, instead of the general one TypeScript would normally guess.

```ts
// src/lib/blog/types.ts
export const ADMIN_POST_SORTS = [
  { value: "updated", label: "Recently updated" },
  { value: "oldest", label: "Least recently updated" },
  { value: "views", label: "Most viewed" },
  { value: "title", label: "Title A–Z" },
] as const;

export type AdminPostSort = (typeof ADMIN_POST_SORTS)[number]["value"];
// → the exact union type: "updated" | "oldest" | "views" | "title"
```

Without `as const`, TypeScript would just see `value: string` for every entry — a plain, generic string. **With** `as const`, it knows `value` is literally `"updated"`, `"oldest"`, `"views"`, or `"title"` and nothing else — and the line below it can *derive* a precise union type straight from that array, instead of maintaining the same four options twice by hand.

## `satisfies`

`satisfies` checks that a value matches a shape, **without** widening or hiding the value's own, more specific type the way a normal type annotation would.

```ts
// src/components/cities/city-content.ts
export const cityContent = {
  indore: () => import("./content/indore/page"),
  vijayawada: () => import("./content/vijayawada/page"),
  // ...one entry per city...
} satisfies Record<CitySlug, () => Promise<{ default: React.ComponentType }>>;
```

This tells TypeScript "double-check that every single city in `CitySlug` has an entry here, and every entry returns the right kind of thing" — but if you forgot a city, or added an extra one that isn't a real `CitySlug`, TypeScript errors immediately. Using a plain `: Record<...>` annotation instead would also catch a *missing* key, but `satisfies` additionally still lets each individual entry keep its own precise inferred type (rather than every value collapsing down to the exact same generic type).

## Utility types (`Record`, `Partial`, `Omit`, `ReturnType`)

TypeScript ships several built-in helpers that build a new type out of an existing one:

```ts
// src/lib/blog/queries.ts — Record<Keys, Value>: an object with a fixed set of keys
const ADMIN_SORT_ORDER: Record<AdminPostSort, { column: string; ascending: boolean }> = {
  updated: { column: "updated_at", ascending: false },
  // ...
};
```

```ts
// src/lib/immersive-store.ts — Partial<T>: every field of T, but all optional
export function setImmersiveChrome(next: Partial<ImmersiveChrome>) {
  // caller can pass just { navVisible: false } without the other two fields
}
```

```ts
// src/types/lucide-react.d.ts — Omit<T, Keys>: T, but with some fields removed
export interface LucideProps extends Omit<SVGProps<SVGSVGElement>, "ref"> { /* ... */ }
```

```ts
// src/components/blog/blog-search.tsx — ReturnType<T>: "whatever this function returns"
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

## Where the schemas double as types: Zod's `z.infer`

This isn't a plain TypeScript feature, but it's used constantly in this codebase alongside these patterns: the validation library **Zod** (see **libraries.md**) can generate a matching TypeScript type straight from a validation schema, so the "rules a form must follow" and "the shape of that form's data" can never accidentally drift apart.

```ts
// src/lib/blog/validation.ts
export const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  status: z.enum(["draft", "published"]),
  // ...
});

export type PostFormValues = z.infer<typeof postFormSchema>;
```

## In simple words

If you're new to TypeScript, the short version is: everywhere you see `type` or `interface`, someone is just writing down "here's exactly what fields this piece of data has" — so that a mistake shows up immediately, right in the editor, instead of turning into a bug a visitor discovers on the live site.
