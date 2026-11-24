import { test } from "node:test";
import assert from "node:assert/strict";
import { compilePhrase, phraseCouldMatch, phraseSpecsFor } from "./phrases";
import { tokenize } from "./text";
import { pageDestination, post } from "./test-helpers";

const words = (text: string) => new Set(tokenize(text));
const spec = (text: string) => ({ text, source: "post-keyword" as const });
const matches = (phrase: string, text: string) => {
  const { regex } = compilePhrase(spec(phrase));
  regex.lastIndex = 0;
  return regex.test(text);
};

// The prefilter is only a shortcut. It must never say "can't match" for text the real matcher accepts,
// or a legitimate suggestion would silently disappear.
const SHOULD_MATCH: [phrase: string, text: string][] = [
  ["window film", "Our Window Film range"],
  ["window film", "several window films here"],
  ["glass", "tinted glasses are common"],
  ["nano-ceramic window film", "A nano ceramic window film."],
  ["nano ceramic film", "Nano-Ceramic film works"],
  ["Sunkool's warranty", "Check Sunkool's warranty today"],
  ["paint protection film", "paint  protection film is popular"],
  ["IS 2553", "Compliant with IS 2553 for side windows"],
  ["PPF", "Get PPF done"],
  ["café menu", "The Café menu changed"],
  ["heat control glazing", "HEAT-CONTROL GLAZING systems"],
  ["brand & co", "the brand & co deal"],
];

test("the vocabulary prefilter never rules out text the real matcher accepts", () => {
  for (const [phrase, text] of SHOULD_MATCH) {
    assert.ok(matches(phrase, text), `matcher should accept "${phrase}" in "${text}" (test data is wrong)`);
    assert.ok(phraseCouldMatch(phrase, words(text)), `prefilter wrongly rejects "${phrase}" for "${text}"`);
  }
});

test("the prefilter does reject phrases with a word the text lacks", () => {
  assert.equal(phraseCouldMatch("window film", words("only film here")), false);
  assert.equal(phraseCouldMatch("paint protection film", words("paint film")), false);
  assert.equal(phraseCouldMatch("ceramic", words("cerami")), false);
  assert.equal(phraseCouldMatch("windows", words("a window")), false, "a plural on the phrase side is not what the matcher allows");
});

test("acronyms stay case-sensitive in the matcher, which the prefilter then re-checks", () => {
  assert.equal(matches("PPF", "ppf"), false);
  assert.equal(matches("PPF", "PPF"), true);
  assert.equal(matches("PPF", "PPFs"), false);
});

test("compiled phrases are reused, so repeat scans don't rebuild regexes", () => {
  assert.equal(compilePhrase(spec("window film")), compilePhrase(spec("window film")));
  assert.notEqual(compilePhrase({ text: "window film", source: "page-keyword" }), compilePhrase(spec("window film")));
});

test("a destination's phrases are worked out once", () => {
  const destination = post("Ceramic Shield Guide", "ceramic-shield", { keywords: ["ceramic shield"] });
  assert.equal(phraseSpecsFor(destination), phraseSpecsFor(destination));
  const page = pageDestination("/x", "X", ["some keyword"]);
  assert.deepEqual(phraseSpecsFor(page), [{ text: "some keyword", source: "page-keyword" }]);
});

test("post phrases skip generic keywords and keep the strongest source for a repeated phrase", () => {
  const destination = post("Ceramic Shield Guide", "ceramic-shield", { group: "Guides", keywords: ["car", "Guides", "Ceramic Shield", "ceramic shield"] });
  const specs = phraseSpecsFor(destination);
  assert.ok(!specs.some((s) => s.text.toLowerCase() === "car" || s.text.toLowerCase() === "guides"));
  const shield = specs.filter((s) => s.text.toLowerCase() === "ceramic shield");
  assert.equal(shield.length, 1);
  // It is both a keyword and a word run from the title; the keyword is the stronger claim.
  assert.equal(shield[0].source, "post-keyword");
  // The whole title is its own, strongest phrase.
  assert.ok(specs.some((s) => s.text === "Ceramic Shield Guide" && s.source === "post-title"));
});
