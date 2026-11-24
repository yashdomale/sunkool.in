import { test } from "node:test";
import assert from "node:assert/strict";
import { collectLinkHrefs, collectSitePaths } from "./doc-links";
import { normalizeUrl, slugFromPath, splitSiteHref, toSitePath, typedAddress } from "./urls";

test("relative and own-domain links resolve to the same site path", () => {
  assert.equal(toSitePath("/ppf"), "/ppf");
  assert.equal(toSitePath("/ppf/"), "/ppf");
  assert.equal(toSitePath("https://www.sunkool.in/ppf"), "/ppf");
  assert.equal(toSitePath("http://sunkool.in/ppf/?a=1#b"), "/ppf");
  assert.equal(toSitePath("https://www.sunkool.in"), "/");
  assert.equal(toSitePath("https://sunkool.in?x=1"), "/");
  assert.deepEqual(splitSiteHref("/blog?category=ppf#top"), { path: "/blog", suffix: "?category=ppf#top" });
});

test("anything that leaves the site, or isn't a path, is not a site path", () => {
  for (const href of ["", "   ", "#section", "mailto:a@b.co", "tel:+911234", "https://example.com/ppf", "//cdn.example.com/x", "https://sunkool.in.evil.com/ppf", "https://notsunkool.in/ppf", "javascript:alert(1)"]) {
    assert.equal(toSitePath(href), null, `expected ${JSON.stringify(href)} to be off-site`);
  }
});

test("slugFromPath only accepts /blog/<slug>", () => {
  assert.equal(slugFromPath("/blog/my-post"), "my-post");
  assert.equal(slugFromPath("/blog"), null);
  assert.equal(slugFromPath("/blog/"), null);
  assert.equal(slugFromPath("/blog/a/b"), null);
  assert.equal(slugFromPath("/ppf"), null);
});

test("normalizeUrl keeps its existing behaviour", () => {
  assert.equal(normalizeUrl("example.com"), "https://example.com");
  assert.equal(normalizeUrl("https://example.com/a"), "https://example.com/a");
  assert.equal(normalizeUrl("/ppf"), "/ppf");
  assert.equal(normalizeUrl("#top"), "#top");
  assert.equal(normalizeUrl("mailto:a@b.co"), "mailto:a@b.co");
  assert.equal(normalizeUrl("localhost:3000"), "https://localhost:3000");
  assert.equal(normalizeUrl("javascript:alert(1)"), null);
  assert.equal(normalizeUrl("data:text/html,x"), null);
  assert.equal(normalizeUrl("//evil.example"), "https://evil.example");
  assert.equal(normalizeUrl("two words"), null);
  assert.equal(normalizeUrl("nodots"), null);
  assert.equal(normalizeUrl(""), null);
});

test("typedAddress recognises an address typed into the search box, and nothing else", () => {
  assert.equal(typedAddress("https://www.sunkool.in"), "https://www.sunkool.in");
  assert.equal(typedAddress("  http://sunkool.in/ppf?a=1#b "), "http://sunkool.in/ppf?a=1#b");
  assert.equal(typedAddress("www.sunkool.in"), "https://www.sunkool.in");
  assert.equal(typedAddress("sunkool.in"), "https://sunkool.in");
  assert.equal(typedAddress("example.com/films"), "https://example.com/films");
  assert.equal(typedAddress("mailto:hello@sunkool.in"), "mailto:hello@sunkool.in");
  assert.equal(typedAddress("tel:+911234567890"), "tel:+911234567890");
  // Searches for a page or post stay searches.
  for (const query of ["", "Sunkool", "window film", "PPF", "interior-ppf", "/ppf", "v2.0", "e.g", "10 best ppf brands", "sunkool in"]) {
    assert.equal(typedAddress(query), null, `expected ${JSON.stringify(query)} to be a search`);
  }
  // Unsafe or unusable schemes never become an address.
  for (const query of ["javascript:alert(1)", "data:text/html,x", "https://nodots"]) {
    assert.equal(typedAddress(query), null, `expected ${JSON.stringify(query)} to be rejected`);
  }
});

test("link collection skips link marks that have no href", () => {
  const doc = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          { type: "text", text: "a", marks: [{ type: "link", attrs: { href: "/ppf" } }] },
          { type: "text", text: "b", marks: [{ type: "link" }] },
          { type: "text", text: "c", marks: [{ type: "link", attrs: { href: "" } }] },
          { type: "text", text: "d", marks: [{ type: "bold" }] },
          { type: "text", text: "e", marks: [{ type: "link", attrs: { href: "https://www.sunkool.in/ppf/" } }] },
          { type: "text", text: "f", marks: [{ type: "link", attrs: { href: "https://example.com" } }] },
        ],
      },
    ],
  };
  assert.deepEqual(collectLinkHrefs(doc), ["/ppf", "https://www.sunkool.in/ppf/", "https://example.com"]);
  assert.deepEqual(collectSitePaths(doc), ["/ppf"]);
  assert.deepEqual(collectLinkHrefs(null), []);
  assert.deepEqual(collectLinkHrefs({ type: "doc" }), []);
});
