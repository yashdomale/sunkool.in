import { test } from "node:test";
import assert from "node:assert/strict";
import { linkify } from "./linkify";

test("our own pages and WhatsApp become links; the sentence's punctuation does not", () => {
  assert.deepEqual(linkify("See https://www.sunkool.in/window-film. Or chat: https://wa.me/917028146972!"), [
    { type: "text", text: "See " },
    { type: "link", text: "https://www.sunkool.in/window-film", href: "https://www.sunkool.in/window-film" },
    { type: "text", text: ". Or chat: " },
    { type: "link", text: "https://wa.me/917028146972", href: "https://wa.me/917028146972" },
    { type: "text", text: "!" },
  ]);
});

test("the warranty portal is allowed", () => {
  const segments = linkify("Check https://w.sunkool.in/ now");
  assert.equal(segments.filter((s) => s.type === "link").length, 1);
});

test("any other address stays plain text, so a reply can never send a visitor elsewhere", () => {
  for (const text of [
    "Visit https://evil.example/phish",
    "Visit http://www.sunkool.in/page",
    "Visit https://www.sunkool.in.evil.example/",
    "Visit https://evil.example/?next=https://www.sunkool.in",
    "Visit https://sunkool.in@evil.example/",
    "Visit javascript:alert(1)",
  ]) {
    assert.ok(linkify(text).every((s) => s.type === "text"), text);
  }
});

test("plain text without addresses comes back unchanged", () => {
  assert.deepEqual(linkify("Hello there"), [{ type: "text", text: "Hello there" }]);
  assert.deepEqual(linkify(""), [{ type: "text", text: "" }]);
});

test("the text is preserved exactly around links", () => {
  const text = "A https://www.sunkool.in/ppf B https://www.sunkool.in/warranty C";
  assert.equal(linkify(text).map((s) => s.text).join(""), text);
});
