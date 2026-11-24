import { test } from "node:test";
import assert from "node:assert/strict";
import { generateHTML } from "@tiptap/html/server";
import { EditorState } from "@tiptap/pm/state";
import { getTiptapExtensions } from "@/lib/blog/tiptap-extensions";
import { addSuggestedLinks, linkAttrsFor } from "./apply";
import { getSitePageDestinations } from "./site-pages";
import { suggestInternalLinks } from "./suggest";
import { bold, linked, makeDoc, para, schema } from "./test-helpers";

const pages = getSitePageDestinations();
const stateFor = (doc: ReturnType<typeof makeDoc>) => EditorState.create({ doc, schema });

test("adds the link without changing the text or any formatting", () => {
  const doc = makeDoc(para("Choose ", "heat control ", bold("window"), " film for summer, and ", bold("PPF"), " for paint."));
  const suggestions = suggestInternalLinks(doc, pages);
  assert.deepEqual(suggestions.map((s) => s.destination.href).sort(), ["/ppf", "/window-film"]);

  const tr = stateFor(doc).tr;
  const { applied, skipped } = addSuggestedLinks(tr, suggestions);
  assert.equal(applied.length, 2);
  assert.equal(skipped.length, 0);

  assert.equal(tr.doc.textContent, doc.textContent, "text must be untouched");
  const linkMark = schema.marks.link;
  const boldMark = schema.marks.bold;
  for (const { from, to, destination } of applied) {
    assert.ok(tr.doc.rangeHasMark(from, to, linkMark));
    tr.doc.nodesBetween(from, to, (node) => {
      const link = node.marks.find((mark) => mark.type === linkMark);
      if (link) assert.equal(link.attrs.href, destination.href);
    });
  }
  // The bold text inside the anchors is still bold.
  const boldTexts: string[] = [];
  tr.doc.descendants((node) => {
    if (node.isText && node.marks.some((m) => m.type === boldMark)) boldTexts.push(node.text!);
  });
  assert.deepEqual(boldTexts, ["window", "PPF"]);
});

test("internal links render as plain same-tab links in the public HTML", () => {
  const doc = makeDoc(para("Read about paint protection film here."));
  const tr = stateFor(doc).tr;
  addSuggestedLinks(tr, suggestInternalLinks(doc, pages));
  const html = generateHTML(tr.doc.toJSON(), getTiptapExtensions());
  assert.match(html, /<a href="\/ppf">paint protection film<\/a>/);
  assert.doesNotMatch(html, /target=|rel=/);
});

test("applies only what was approved", () => {
  const doc = makeDoc(para("Window film and PPF."), para("Contact us today."));
  const all = suggestInternalLinks(doc, pages);
  assert.equal(all.length, 3);
  const approved = all.filter((s) => s.destination.href === "/contact");

  const tr = stateFor(doc).tr;
  const { applied } = addSuggestedLinks(tr, approved);
  assert.deepEqual(applied.map((s) => s.destination.href), ["/contact"]);
  assert.deepEqual(JSON.stringify(tr.doc.toJSON()).match(/"href":"[^"]+"/g), ['"href":"/contact"']);
});

test("skips a suggestion whose text has changed since the scan", () => {
  const doc = makeDoc(para("Window film is great."));
  const suggestions = suggestInternalLinks(doc, pages);

  const tr = stateFor(doc).tr;
  tr.insertText("Note: ", 1); // shifts everything, as an edit between scan and approval would
  const { applied, skipped } = addSuggestedLinks(tr, suggestions);
  assert.equal(applied.length, 0);
  assert.equal(skipped.length, 1);
  assert.match(skipped[0].reason, /changed/);
  assert.ok(!JSON.stringify(tr.doc.toJSON()).includes("href"));
});

test("skips text that has become a link, and pages the post now already links to", () => {
  const doc = makeDoc(para("Window film here. And more window film there."));
  const suggestions = suggestInternalLinks(doc, pages);
  assert.equal(suggestions.length, 1);

  const alreadyLinked = stateFor(makeDoc(para(linked("Window film", "/compare"), " here. And more window film there."))).tr;
  const text = addSuggestedLinks(alreadyLinked, suggestions);
  assert.match(text.skipped[0].reason, /already a link/);

  const samePage = stateFor(makeDoc(para("Window film here. And ", linked("more", "/window-film"), " window film there."))).tr;
  assert.match(addSuggestedLinks(samePage, suggestions).skipped[0].reason, /already links to that page/);
});

test("two suggestions for the same page produce one link", () => {
  const doc = makeDoc(para("Window film here. And ceramic window film there."));
  const base = stateFor(doc).tr;
  const first = suggestInternalLinks(doc, pages)[0];
  const second = { ...first, id: "dup", from: doc.textContent.indexOf("ceramic") + 1, to: doc.textContent.indexOf("ceramic") + 1 + "ceramic window film".length, anchor: "ceramic window film" };
  const { applied, skipped } = addSuggestedLinks(base, [first, second]);
  assert.equal(applied.length, 1);
  assert.equal(skipped.length, 1);
});

test("link attributes are always spelled out, so editing a link can't inherit the other kind's", () => {
  assert.deepEqual(linkAttrsFor(schema, "/ppf"), { href: "/ppf", target: null, rel: null });
  assert.deepEqual(linkAttrsFor(schema, "https://www.sunkool.in/ppf#x"), { href: "https://www.sunkool.in/ppf#x", target: null, rel: null });
  // External links get the editor's own defaults (not hard-coded here).
  const external = linkAttrsFor(schema, "https://example.com");
  assert.equal(external.target, "_blank");
  assert.equal(external.rel, "noopener noreferrer");
  assert.equal(linkAttrsFor(schema, "mailto:a@b.co").target, "_blank");
  // Both are explicit keys, which is what makes Tiptap's attribute merge harmless.
  for (const attrs of [linkAttrsFor(schema, "/ppf"), external]) assert.ok("target" in attrs && "rel" in attrs);
});

test("rejects a destination that is not a site path", () => {
  const doc = makeDoc(para("Window film here."));
  const [suggestion] = suggestInternalLinks(doc, pages);
  const evil = { ...suggestion, destination: { ...suggestion.destination, href: "https://example.com/x" } };
  const { applied, skipped } = addSuggestedLinks(stateFor(doc).tr, [evil]);
  assert.equal(applied.length, 0);
  assert.equal(skipped.length, 1);
});

test("after applying, a rescan proposes nothing more for those pages", () => {
  const doc = makeDoc(para("Window film and PPF."));
  const tr = stateFor(doc).tr;
  addSuggestedLinks(tr, suggestInternalLinks(doc, pages));
  assert.deepEqual(suggestInternalLinks(tr.doc, pages), []);
});
