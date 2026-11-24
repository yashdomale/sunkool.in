import { test } from "node:test";
import assert from "node:assert/strict";
import { getSitePageDestinations } from "./site-pages";
import { suggestInternalLinks } from "./suggest";
import { bold, codeBlock, heading, linked, makeDoc, pageDestination, para, post } from "./test-helpers";

const pages = getSitePageDestinations();
const hrefs = (suggestions: { destination: { href: string } }[]) => suggestions.map((s) => s.destination.href);

test("suggests the service page for the phrase it is about, with a preview", () => {
  const doc = makeDoc(para("Many owners ask whether paint protection film is worth it for a daily driver."));
  const [suggestion, ...rest] = suggestInternalLinks(doc, pages);

  assert.equal(rest.length, 0);
  assert.equal(suggestion.destination.href, "/ppf");
  assert.equal(suggestion.anchor, "paint protection film");
  assert.equal(doc.textBetween(suggestion.from, suggestion.to), "paint protection film");
  // The preview is rendered as before + anchor + after, so the spaces around the anchor stay.
  assert.equal(suggestion.before, "Many owners ask whether ");
  assert.equal(suggestion.after, " is worth it for a daily driver.");
  assert.match(suggestion.reason, /paint protection film/i);
});

test("keeps the author's capitalisation and allows plurals and hyphen/space variants", () => {
  const doc = makeDoc(para("Our Window Films block heat. Nano ceramic window film is the premium option."));
  const found = suggestInternalLinks(doc, pages);
  assert.deepEqual(hrefs(found), ["/window-film"]);
  // The longer, more specific phrase wins over the plain "Window Films".
  assert.equal(found[0].anchor, "Nano ceramic window film");
});

test("a destination is linked once, at its best spot, even if the phrase repeats", () => {
  const doc = makeDoc(
    para("Window film is everywhere."),
    para("Why choose window film? Because window film cuts heat."),
    para("Ask about window film today.")
  );
  const found = suggestInternalLinks(doc, pages);
  assert.equal(hrefs(found).filter((href) => href === "/window-film").length, 1);
});

test("never suggests a link to the post being edited, by id or by slug", () => {
  const self = post("Ceramic Shield Guide", "ceramic-shield-guide", { keywords: ["ceramic shield"] });
  const doc = makeDoc(para("Everything about the ceramic shield treatment."));

  assert.deepEqual(suggestInternalLinks(doc, [self], { slug: "ceramic-shield-guide" }), []);
  assert.deepEqual(suggestInternalLinks(doc, [self], { id: "id-ceramic-shield-guide" }), []);
  assert.equal(suggestInternalLinks(doc, [self], { slug: "something-else" }).length, 1);
});

test("never suggests drafts", () => {
  const draft = post("Ceramic Shield Guide", "ceramic-shield-guide", { keywords: ["ceramic shield"], status: "draft" });
  assert.deepEqual(suggestInternalLinks(makeDoc(para("The ceramic shield treatment.")), [draft]), []);
});

test("skips destinations the post already links to, however the link was written", () => {
  const doc = makeDoc(
    para("Read about ", linked("our coating", "https://www.sunkool.in/ppf/"), "."),
    para("Paint protection film and PPF are the same thing. Contact us for a quote.")
  );
  const found = suggestInternalLinks(doc, pages);
  assert.ok(!hrefs(found).includes("/ppf"), "already linked via an absolute URL");
  assert.ok(hrefs(found).includes("/contact"));
});

test("leaves existing links, code, headings and attribute-less link marks alone", () => {
  const doc = makeDoc(
    heading("Why window film matters"),
    para("See ", linked("window film", "/compare"), " for details."),
    para({ text: "window film", marks: [{ type: "code" }] }),
    para({ text: "the window film range", marks: [{ type: "link" }] }),
    codeBlock("window film"),
    para("A plain mention of window film.")
  );
  const found = suggestInternalLinks(doc, pages);
  assert.equal(found.length, 1);
  assert.equal(found[0].before, "A plain mention of ");
});

test("a phrase can span formatting, and the anchor covers all of it", () => {
  const doc = makeDoc(para("Choose ", "heat control ", bold("window"), " film for summer."));
  const [suggestion] = suggestInternalLinks(doc, pages);
  assert.equal(suggestion.anchor, "heat control window film");
  assert.equal(doc.textBetween(suggestion.from, suggestion.to), "heat control window film");
});

test("a phrase is not matched inside a longer word", () => {
  const doc = makeDoc(para("The PPFS standard and ppf lowercase and MYPPF are not it."));
  assert.deepEqual(suggestInternalLinks(doc, pages), []);
  assert.deepEqual(hrefs(suggestInternalLinks(makeDoc(para("Get PPF done.")), pages)), ["/ppf"]);
});

test("no two links share an anchor text, and links never overlap", () => {
  const a = post("Window Tint Basics", "window-tint-basics", { keywords: ["ceramic tint"] });
  const b = post("Tint Care Guide", "tint-care-guide", { keywords: ["ceramic tint"] });
  const doc = makeDoc(para("A ceramic tint lasts years. Ceramic tint is popular."));
  const found = suggestInternalLinks(doc, [a, b]);
  assert.equal(found.length, 1, "the same anchor text must not point at two destinations");

  const overlapping = suggestInternalLinks(makeDoc(para("Buy ceramic window film now.")), pages);
  assert.equal(overlapping.length, 1);
  for (const [i, x] of overlapping.entries()) for (const y of overlapping.slice(i + 1)) assert.ok(x.to <= y.from || y.to <= x.from);
});

test("limits links per paragraph and overall, and returns them in reading order", () => {
  const doc = makeDoc(para("Window film, PPF, Ultra Edge, contact us, our journey, film configurator."));
  assert.equal(suggestInternalLinks(doc, pages).length, 2);
  assert.equal(suggestInternalLinks(doc, pages, {}, { perParagraph: 10 }).length, 6);
  assert.equal(suggestInternalLinks(doc, pages, {}, { perParagraph: 10, limit: 3 }).length, 3);

  const found = suggestInternalLinks(doc, pages, {}, { perParagraph: 10 });
  assert.deepEqual(found.map((s) => s.from), [...found.map((s) => s.from)].sort((x, y) => x - y));
});

test("ignores generic post keywords such as 'car', 'india' and 'Window Film'", () => {
  const messy = post("How much heat does ceramic window film actually block?", "how-much-heat", {
    group: "Technology",
    keywords: ["car", "india", "Technology", "Window Film", "upcoming car", "window glazing"],
  });
  const doc = makeDoc(para("A car in India with window film and an upcoming car launch and Technology news."));
  assert.deepEqual(suggestInternalLinks(doc, [messy]), []);
});

test("title words only count when the post is actually about that topic", () => {
  const baleno = post("Maruti Suzuki Baleno Facelift 2026: Expected Price", "baleno-facelift");

  const offTopic = makeDoc(para("Maruti Suzuki sells many cars across the country."));
  assert.deepEqual(suggestInternalLinks(offTopic, [baleno]), []);

  const onTopic = makeDoc(para("The Maruti Suzuki Baleno is getting a refresh."));
  const [suggestion] = suggestInternalLinks(onTopic, [baleno]);
  assert.equal(suggestion.destination.href, "/blog/baleno-facelift");
  assert.equal(suggestion.anchor, "Maruti Suzuki Baleno");
});

test("a post's own keyword is a valid anchor without extra evidence", () => {
  const shield = post("7 Powerful Reasons Why the Best Ceramic Shield for a Car Is Worth Every Rupee!", "ceramic-shield", {
    keywords: ["Best Ceramic Shield for a Car", "Ceramic Shield"],
  });
  const doc = makeDoc(para("A ceramic shield protects paint differently."));
  const [suggestion] = suggestInternalLinks(doc, [shield]);
  assert.equal(suggestion.anchor, "ceramic shield");
  assert.match(suggestion.reason, /keyword/i);
});

test("the service page wins over a blog post for the page's own phrase", () => {
  const brands = post("10 Best PPF Brands in India 2026", "ppf-brands", { keywords: ["Paint Protection Film", "best PPF brands in India 2026"] });
  const doc = makeDoc(para("Paint protection film is popular."));
  const found = suggestInternalLinks(doc, [brands, ...pages]);
  assert.deepEqual(hrefs(found), ["/ppf"]);
});

test("a post can't take over a phrase that belongs to a site page, even when that page is already linked", () => {
  const brands = post("10 Best PPF Brands in India 2026", "ppf-brands", { keywords: ["Paint Protection Film"] });
  const doc = makeDoc(para("See ", linked("our PPF range", "/ppf"), ". Paint protection film is popular."));
  assert.deepEqual(suggestInternalLinks(doc, [brands, ...pages]), []);
});

test("singular, plural and hyphenated spellings of a phrase count as one anchor", () => {
  const a = post("Paint Protection Basics", "basics", { keywords: ["paint sealant"] });
  const b = post("Sealant Care", "care", { keywords: ["paint sealants"] });
  const found = suggestInternalLinks(makeDoc(para("Paint sealant is one thing. Paint sealants are another.")), [a, b]);
  assert.equal(found.length, 1);
});

test("a short title is enough when the phrase is the title's whole topic", () => {
  const glazing = post("Safety Glazing for Cars Explained | Sunkool", "safety-glazing", { keywords: ["Window film", "window glazing"] });
  const [suggestion] = suggestInternalLinks(makeDoc(para("Courts treat safety glazing differently.")), [glazing]);
  assert.equal(suggestion.anchor, "safety glazing");
});

test("the brand name is not evidence that a post is on topic", () => {
  const baleno = post("Maruti Suzuki Baleno Facelift 2026: Expected Price | Sunkool", "baleno");
  assert.deepEqual(suggestInternalLinks(makeDoc(para("Maruti Suzuki and Sunkool both exist.")), [baleno]), []);
});

test("returns nothing for empty documents, no destinations, or no matches", () => {
  assert.deepEqual(suggestInternalLinks(makeDoc(para("Hello world.")), pages), []);
  assert.deepEqual(suggestInternalLinks(makeDoc(para("window film")), []), []);
  assert.deepEqual(suggestInternalLinks(makeDoc(), pages), []);
  assert.deepEqual(suggestInternalLinks(makeDoc(para("window film")), [pageDestination("/x", "X", [])]), []);
});
