import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { generateJSON } from "@tiptap/html/server";
import { tiptapJsonToHtml } from "../render";
import { getTiptapExtensions } from "../tiptap-extensions";
import { contextualDestinations } from "./contextual";
import { bold, codeBlock, docJson, heading, linked, para, post } from "./test-helpers";
import type { LinkDestination } from "./types";

const GLANZA = "toyota-glanza-facelift-2026-expected-price-features-engine-and-launch-date";
const BALENO = "maruti-suzuki-baleno-facelift-2026-expected-price";
const HEAT = "how-much-heat-does-ceramic-window-film-block";
const LEGAL = "is-window-film-legal-on-your-car-in-india-here-s-what-the-law-actually-says";
const GUIDE = "car-window-tint-guide-2026-film-types-cost-legal-limits";
const destinations = [
  post("Toyota Glanza Facelift 2026: Expected Price, Features, Engine and Launch Date", GLANZA),
  post("Maruti Suzuki Baleno Facelift 2026: Expected Price", BALENO),
  post("How much heat does ceramic window film actually block?", HEAT),
  post("Is Window Film Legal on Your Car in India? Here's What the Law Actually Says", LEGAL),
  post("Car Window Tint Guide 2026 – Film Types, Cost & Legal Limits", GUIDE),
];

const withoutAnchors = (html: string) => html.replace(/<\/?a\b[^>]*>/g, "");
const hrefs = (html: string) => [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1]);
const render = (content: unknown, slug = GLANZA, available = destinations) =>
  tiptapJsonToHtml(content, { source: { slug }, destinations: available });

test("Toyota Glanza's public HTML links natural phrases to Baleno, heat and legal articles", () => {
  // Phrases present in the real CMS article, which is not bundled in seed-data.json.
  const content = docJson(
    para("Toyota Glanza facelift vs ", bold("Maruti Baleno facelift"), ". Good film cuts heat inside the cabin."),
    para("The windows must let through at least 70 percent of visible light.")
  );
  const html = render(content);
  for (const slug of [BALENO, HEAT, LEGAL]) assert.ok(hrefs(html).includes(`/blog/${slug}`), slug);
  assert.match(html, /<a href="[^"]+"><strong>Maruti Baleno facelift<\/strong><\/a>|<strong><a href="[^"]+">Maruti Baleno facelift<\/a><\/strong>/);
  assert.ok(!html.includes('target="_blank"') && !html.includes('rel="nofollow"'));
  assert.equal(withoutAnchors(html), withoutAnchors(tiptapJsonToHtml(content)));
});

test("Baleno links back to the published Toyota Glanza article", () => {
  const html = render(docJson(para("The Baleno competes with the Toyota Glanza.")), BALENO);
  assert.deepEqual(hrefs(html), [`/blog/${GLANZA}`]);
  assert.match(html, />Toyota Glanza<\/a>/);
});

test("the tint guide links its heat and visibility explanations to the relevant posts", () => {
  const html = render(docJson(para("Solar energy rejection reduces heat."), para("Check visible light transmission and legal limits.")), GUIDE);
  assert.ok(hrefs(html).includes(`/blog/${HEAT}`));
  assert.ok(hrefs(html).includes(`/blog/${LEGAL}`));
});

test("the renderer never mutates stored content or its existing formatting and links", () => {
  const content = docJson(para(bold("Maruti Baleno facelift"), " and ", linked("the original source", "https://example.com/source")));
  const before = JSON.stringify(content);
  const plain = tiptapJsonToHtml(content);
  const html = render(content);
  assert.equal(JSON.stringify(content), before);
  assert.equal(withoutAnchors(html), withoutAnchors(plain));
  assert.match(html, /href="https:\/\/example.com\/source"/);
});

test("headings, code and already-linked text are not relinked", () => {
  const content = docJson(
    heading("Maruti Baleno facelift"),
    codeBlock("infrared heat"),
    para(linked("visible light", "https://example.com/explanation"))
  );
  assert.deepEqual(hrefs(render(content)), ["https://example.com/explanation"]);
});

test("drafts, missing posts, page destinations and unrelated posts are never added", () => {
  const draft = post("Maruti Suzuki Baleno Facelift", BALENO, { status: "draft" });
  const page = { ...destinations[2], kind: "page" as const };
  const unrelated = post("Unrelated article", "unrelated", { keywords: ["Maruti Baleno facelift"] });
  const content = docJson(para("Maruti Baleno facelift, infrared heat and visible light."));
  assert.deepEqual(contextualDestinations(GLANZA, [draft, page, unrelated]), []);
  assert.deepEqual(hrefs(render(content, GLANZA, [draft, page, unrelated])), []);
});

test("an existing destination is not duplicated and a post never links to itself", () => {
  const content = docJson(
    para(linked("Existing Baleno reference", `/blog/${BALENO}`)),
    para("Maruti Baleno facelift and Maruti Baleno facelift. Toyota Glanza facelift.")
  );
  assert.deepEqual(hrefs(render(content)), [`/blog/${BALENO}`]);
});

test("without a published destination catalogue the article still renders unchanged", () => {
  const content = docJson(para("Maruti Baleno facelift and visible light."));
  assert.equal(render(content, GLANZA, []), tiptapJsonToHtml(content));
  assert.equal(render(content, "an-unreviewed-new-post"), tiptapJsonToHtml(content));
});

test("real bundled articles preserve all prose and markup while gaining working blog anchors", () => {
  const seed = JSON.parse(readFileSync(new URL("../seed-data.json", import.meta.url), "utf8")) as {
    posts: { id: string; slug: string; title: string; excerpt: string; keywords: string[]; status: "published"; content: unknown }[];
  };
  const available: LinkDestination[] = seed.posts.map((p) => post(p.title, p.slug, { id: p.id, description: p.excerpt, keywords: p.keywords }));
  available.push(destinations[0]);
  const known = new Set(available.map((d) => d.href));
  let linkedArticles = 0;
  for (const p of seed.posts) {
    const before = JSON.stringify(p);
    const original = tiptapJsonToHtml(p.content);
    const html = render(p.content, p.slug, available);
    const added = hrefs(html).filter((href) => href.startsWith("/blog/"));
    if (added.length) linkedArticles++;
    // Linking part of a bold phrase can split one <strong> into adjacent
    // <strong> elements. Parse both to compare their text, structure and marks.
    assert.deepEqual(
      generateJSON(withoutAnchors(html), getTiptapExtensions()),
      generateJSON(withoutAnchors(original), getTiptapExtensions()),
      p.slug
    );
    assert.equal(JSON.stringify(p), before, p.slug);
    for (const href of added) {
      assert.ok(known.has(href), `${p.slug}: unknown destination ${href}`);
      assert.notEqual(href, `/blog/${p.slug}`);
    }
    assert.ok(added.length <= 4, p.slug);
  }
  assert.equal(linkedArticles, seed.posts.length);
});
