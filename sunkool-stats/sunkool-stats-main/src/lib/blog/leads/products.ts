import { CATEGORIES, ULTRA_EDGE, type Category } from "@/lib/products";

// The lead form's product list is derived from the site's one product
// catalogue (src/lib/products.ts) — there is deliberately no second list here.
// ULTRA_EDGE is a live product line (/ultra-edge). The catalogue has been shaped
// both ways — kept out of CATEGORIES (and so out of the compare tool) and
// included in it — so it is added explicitly and categories are de-duplicated by
// slug: the line appears in the dropdown exactly once either way.
const CATALOGUE: readonly Category[] = [...CATEGORIES, ULTRA_EDGE].filter(
  (category, index, all) => all.findIndex((other) => other.slug === category.slug) === index
);

export type LeadProduct = {
  /** "<category-slug>/<product-slug>": product slugs alone repeat across categories. */
  id: string;
  name: string;
  category: string;
};

export type LeadProductGroup = {
  category: string;
  products: Pick<LeadProduct, "id" | "name">[];
};

export function leadProductId(categorySlug: string, productSlug: string): string {
  return `${categorySlug}/${productSlug}`;
}

function listProducts(): LeadProduct[] {
  const seen = new Set<string>();
  const products: LeadProduct[] = [];
  for (const category of CATALOGUE) {
    for (const series of category.series) {
      for (const product of series.products) {
        const id = leadProductId(category.slug, product.slug);
        if (seen.has(id)) continue;
        seen.add(id);
        products.push({ id, name: product.name, category: category.name });
      }
    }
  }
  return products;
}

/** Products grouped by category, in catalogue order — what the form's <select> renders. */
export function getLeadProductGroups(): LeadProductGroup[] {
  const groups: LeadProductGroup[] = [];
  for (const product of listProducts()) {
    let group = groups.find((g) => g.category === product.category);
    if (!group) {
      group = { category: product.category, products: [] };
      groups.push(group);
    }
    group.products.push({ id: product.id, name: product.name });
  }
  return groups;
}

/** Resolves a submitted product id against the catalogue; null when it is not a real product. */
export function findLeadProduct(id: unknown): LeadProduct | null {
  if (typeof id !== "string") return null;
  return listProducts().find((product) => product.id === id) ?? null;
}
