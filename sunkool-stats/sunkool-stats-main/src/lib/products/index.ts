/* ------------------------------------------------------------------ */
/*  SUNKOOL product catalogue                                          */
/*  Single source of truth used across product pages, nav & compare.  */
/* ------------------------------------------------------------------ */
/*  One file per product line; this file assembles the catalogue.     */

import type { Category, Product } from "./types";
import { WINDOW_FILM } from "./window-film";
import { PPF } from "./ppf";
import { ULTRA_EDGE } from "./ultra-edge";

export type { Product, Series, Category } from "./types";
export { WINDOW_FILM, PPF, ULTRA_EDGE };
export { INTERIOR_PROTECTION_FILM } from "./interior";

export const CATEGORIES: Category[] = [WINDOW_FILM, PPF, ULTRA_EDGE];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Flat list of every distinct product for the comparison tool. */
export const ALL_PRODUCTS: (Product & { category: string; series: string })[] =
  CATEGORIES.flatMap((c) =>
    c.series.flatMap((s) =>
      s.products.map((p) => ({
        ...p,
        category: c.name,
        series: s.name,
      }))
    )
  );
