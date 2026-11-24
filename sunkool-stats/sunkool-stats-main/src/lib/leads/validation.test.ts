import { test } from "node:test";
import assert from "node:assert/strict";
import { validateCity, validateLeadFields, validateName } from "./validation";

const valid = { name: "Rahul Sharma", mobile: "98765 43210", city: "Nagpur", productId: "window-film/sapphire" };

test("accepts a complete enquiry and returns the cleaned, normalised values", () => {
  const result = validateLeadFields({ ...valid, name: "  Rahul   Sharma ", city: " Nagpur  " });
  assert.deepEqual(result, {
    ok: true,
    value: { name: "Rahul Sharma", mobile: "+919876543210", city: "Nagpur", productId: "window-film/sapphire", message: null },
  });
});

test("every field is required, and all problems are reported together", () => {
  const result = validateLeadFields({});
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(Object.keys(result.errors).sort(), ["city", "mobile", "name", "productId"]);
});

test("rejects non-string values instead of coercing them", () => {
  const result = validateLeadFields({ name: ["Rahul"], mobile: 9876543210, city: { a: 1 }, productId: 5 });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(Object.keys(result.errors).length, 4);
});

test("names allow real-world punctuation and any script, but not digits, URLs or markup", () => {
  for (const name of ["Rahul Sharma", "Anne-Marie O'Brien", "José Álvarez", "देवेंद्र फड़नवीस", "Dr. K. R. Narayanan", "Mary’s Lamb"]) {
    assert.ok("value" in validateName(name), name);
  }
  for (const name of ["R", "", "   ", "Buy now http://spam.example", "Rahul123", "<script>alert(1)</script>", "x".repeat(81), "=cmd|' /C calc'!A0"]) {
    assert.ok("error" in validateName(name), name);
  }
});

test("cities allow spaces and punctuation, but not digits or URLs", () => {
  for (const city of ["Nagpur", "Navi Mumbai", "St. Thomas Mount", "Bengaluru (Urban)", "Kolkata, WB"]) {
    assert.ok("value" in validateCity(city), city);
  }
  for (const city of ["N", "", "560001", "http://x.example", "x".repeat(61)]) {
    assert.ok("error" in validateCity(city), city);
  }
});

test("product must be present and a sensible length (membership in the catalogue is checked server-side)", () => {
  assert.equal(validateLeadFields({ ...valid, productId: "" }).ok, false);
  assert.equal(validateLeadFields({ ...valid, productId: "   " }).ok, false);
  assert.equal(validateLeadFields({ ...valid, productId: "x".repeat(81) }).ok, false);
});

test("a bad mobile surfaces the phone module's message on the mobile field", () => {
  const result = validateLeadFields({ ...valid, mobile: "12345" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.errors.mobile ?? "", /10-digit Indian mobile/);
});

test("the message is optional, keeps line breaks, and is cleaned and length-limited", () => {
  const ok = (message: unknown) => {
    const result = validateLeadFields({ ...valid, message });
    return result.ok ? result.value.message : `ERROR: ${JSON.stringify(result.errors)}`;
  };
  assert.equal(ok(undefined), null);
  assert.equal(ok(""), null);
  assert.equal(ok("   \n  "), null);
  assert.equal(ok("  Need film for  my SUV\r\n\r\n\r\n\r\nCall after 5  "), "Need film for my SUV\n\nCall after 5");
  assert.equal(ok("hi\u0000\u0007 there"), "hi there");
  assert.equal(ok("x".repeat(500)), "x".repeat(500));
  assert.match(String(ok("x".repeat(501))), /ERROR.*under 500/);
  assert.match(String(ok(42)), /ERROR.*message/);
});
