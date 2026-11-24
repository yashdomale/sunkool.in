import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTACT } from "@/lib/contact";
import { WARRANTY_AUTHENTICITY, WARRANTY_SUPPORT } from "./warranty-content";

test("the verification guide has its four checks, a tip, and four next steps, none blank", () => {
  assert.equal(WARRANTY_AUTHENTICITY.checks.length, 4);
  for (const check of WARRANTY_AUTHENTICITY.checks) {
    assert.ok(check.title.trim() && check.points.length > 0, check.title);
    for (const point of check.points) assert.ok(point.label.trim() && point.text.trim(), point.label);
  }
  assert.equal(WARRANTY_AUTHENTICITY.next.steps.length, 4);
  for (const step of WARRANTY_AUTHENTICITY.next.steps) assert.ok(step.title.trim() && step.text.trim(), step.title);
  assert.ok(WARRANTY_AUTHENTICITY.tip.text.trim() && WARRANTY_AUTHENTICITY.note.trim());
});

test("the support phone number on the warranty page is the site's own number", () => {
  assert.equal(WARRANTY_SUPPORT.phone.replace(/\D/g, ""), CONTACT.whatsappNumber);
  assert.equal(WARRANTY_SUPPORT.phoneHref, CONTACT.phoneHref);
  assert.equal(WARRANTY_SUPPORT.emailHref, `mailto:${WARRANTY_SUPPORT.email}`);
});

test("exactly one next step carries the support links, and no other text has stray markers", () => {
  const withMarkers = WARRANTY_AUTHENTICITY.next.steps.filter((step) => /\{(email|phone)\}/.test(step.text));
  assert.equal(withMarkers.length, 1);
  assert.match(withMarkers[0].text, /\{email\}/);
  assert.match(withMarkers[0].text, /\{phone\}/);
  const others = [
    WARRANTY_AUTHENTICITY.intro,
    WARRANTY_AUTHENTICITY.tip.text,
    WARRANTY_AUTHENTICITY.counterfeit.text,
    WARRANTY_AUTHENTICITY.note,
    ...WARRANTY_AUTHENTICITY.checks.flatMap((check) => check.points.map((point) => point.text)),
    ...WARRANTY_AUTHENTICITY.next.steps.filter((step) => step !== withMarkers[0]).map((step) => step.text),
  ];
  for (const text of others) assert.doesNotMatch(text, /[{}]/);
});
