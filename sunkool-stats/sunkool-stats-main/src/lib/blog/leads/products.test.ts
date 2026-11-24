import { test } from "node:test";
import assert from "node:assert/strict";
import { CATEGORIES, ULTRA_EDGE } from "@/lib/products";
import { findLeadProduct, getLeadProductGroups, leadProductId } from "./products";

// Every category once, in order (Ultra Edge is listed in CATEGORIES in some shapes of the catalogue, not in others).
const catalogue = [...CATEGORIES, ULTRA_EDGE].filter(
  (category, index, all) => all.findIndex((other) => other.slug === category.slug) === index
);

const everyCatalogueProduct = catalogue.flatMap((category) =>
  category.series.flatMap((series) => series.products.map((product) => ({ category, product })))
);

test("the dropdown is built from the product catalogue — every catalogue product, nothing else", () => {
  const listed = getLeadProductGroups().flatMap((group) => group.products.map((p) => p.id));
  assert.deepEqual(
    [...listed].sort(),
    everyCatalogueProduct.map(({ category, product }) => leadProductId(category.slug, product.slug)).sort()
  );
});

test("includes the live Ultra Edge line", () => {
  assert.ok(findLeadProduct("ultra-edge/ultra-70"));
  assert.ok(findLeadProduct("ultra-edge/prism"));
});

test("ids are unique even though some product slugs repeat across categories", () => {
  const ids = getLeadProductGroups().flatMap((group) => group.products.map((p) => p.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(findLeadProduct("ppf/signature"), "PPF signature");
  assert.ok(findLeadProduct("window-film/sapphire"));
  assert.notEqual(findLeadProduct("ultra-edge/sunroof")?.category, findLeadProduct("window-film/sunroof-protection")?.category);
});

test("groups follow the catalogue's category order and carry the display names", () => {
  const groups = getLeadProductGroups();
  assert.deepEqual(
    groups.map((g) => g.category),
    catalogue.map((c) => c.name)
  );
  // The name shown is whatever the catalogue calls it (including its brand casing), never a copy.
  const catalogueName = catalogue
    .find((c) => c.slug === "ppf")
    ?.series.flatMap((s) => s.products)
    .find((p) => p.slug === "hd07")?.name;
  assert.ok(catalogueName);
  assert.equal(groups.find((g) => g.category === "PPF")?.products.find((p) => p.id === "ppf/hd07")?.name, catalogueName);
});

test("resolves a submitted id to the catalogue's own name and category", () => {
  assert.deepEqual(findLeadProduct("window-film/sapphire"), { id: "window-film/sapphire", name: "Sapphire", category: "Window Film" });
});

test("rejects ids that are not real products, or not strings", () => {
  for (const id of ["", "sapphire", "window-film/", "window-film/nope", "WINDOW-FILM/SAPPHIRE", "ppf/sapphire", undefined, null, 5, {}]) {
    assert.equal(findLeadProduct(id), null, String(id));
  }
});
