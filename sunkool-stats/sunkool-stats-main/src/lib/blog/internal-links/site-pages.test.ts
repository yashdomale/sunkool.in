import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cities } from "@/lib/cities";
import { getSitePageDestinations, getSitePaths, STATIC_PAGES } from "./site-pages";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const appFile = (relative: string) => path.join(root, "src", "app", relative);

test("every static page is a real route file, and its title and description match that file", () => {
  for (const page of STATIC_PAGES) {
    const file = appFile(page.file);
    assert.ok(existsSync(file), `${page.path}: ${page.file} does not exist`);
    const source = readFileSync(file, "utf8");
    assert.ok(source.includes(page.title), `${page.path}: title "${page.title}" is not in ${page.file}`);
    assert.ok(source.includes(page.description), `${page.path}: description is not in ${page.file}`);
  }
});

test("every city page has the content the [city] route loads", () => {
  const cityPages = getSitePageDestinations().filter((d) => d.keywords.some((k) => k.startsWith("car window film in")));
  assert.equal(cityPages.length, Object.keys(cities).length);
  for (const slug of Object.keys(cities)) {
    const file = path.join(root, "src", "components", "cities", "content", slug, "page.tsx");
    assert.ok(existsSync(file), `city "${slug}" is registered but has no content at ${file}`);
    assert.ok(cityPages.some((d) => d.href === `/${slug}`), `city "${slug}" is missing from the link registry`);
  }
});

test("video and legal pages point at routes that exist", () => {
  const hrefs = getSitePaths();
  for (const href of ["/videos/ppf", "/videos/ultra-edge", "/videos/window-film"]) assert.ok(hrefs.has(href), href);
  assert.ok(existsSync(appFile("videos/[slug]/page.tsx")));
  for (const slug of ["terms-and-conditions", "privacy-policy", "disclaimer"]) {
    assert.ok(hrefs.has(`/${slug}`), slug);
    assert.ok(existsSync(appFile(`${slug}/page.tsx`)), slug);
  }
});

test("no destination is listed twice, and none is a redirect-only URL", () => {
  const all = getSitePageDestinations();
  const hrefs = all.map((d) => d.href);
  assert.equal(new Set(hrefs).size, hrefs.length, "duplicate hrefs in the registry");

  const config = readFileSync(path.join(root, "next.config.ts"), "utf8");
  const redirectSources = [...config.matchAll(/source:\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(redirectSources.length > 5, "expected to find the redirect list in next.config.ts");
  for (const href of hrefs) assert.ok(!redirectSources.includes(href), `${href} is a redirect, link to its target instead`);

  // Typo'd slugs that exist only to redirect.
  assert.ok(!hrefs.includes("/ahemdabad") && !hrefs.includes("/hydrabad"));
});

test("every destination is a published page with a title and an absolute path", () => {
  for (const d of getSitePageDestinations()) {
    assert.equal(d.kind, "page");
    assert.equal(d.status, "published");
    assert.ok(d.href.startsWith("/"), d.href);
    assert.ok(d.href === "/" || !d.href.endsWith("/"), `${d.href} should have no trailing slash`);
    assert.ok(d.title.trim().length > 0, d.href);
  }
});
