import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMobile, normalizeMobile, telHref, whatsappHref } from "./phone";

const e164 = (input: string) => {
  const result = normalizeMobile(input);
  return result.ok ? result.e164 : `ERROR: ${result.error}`;
};

test("normalises every way people type an Indian mobile number to E.164", () => {
  for (const input of [
    "9876543210",
    "98765 43210",
    "98765-43210",
    "(98765) 43210",
    "09876543210",
    "919876543210",
    "+919876543210",
    "+91 98765 43210",
    "+91-98765-43210",
    "0091 98765 43210",
    "  +91 9876543210  ",
  ]) {
    assert.equal(e164(input), "+919876543210", input);
  }
});

test("accepts Indian numbers starting 6, 7, 8 and 9 only", () => {
  for (const first of ["6", "7", "8", "9"]) assert.match(e164(`${first}123456789`), /^\+91/);
  for (const first of ["0", "1", "2", "3", "4", "5"]) assert.match(e164(`${first}123456789`), /^ERROR/, first);
});

test("rejects empty, malformed and wrong-length Indian numbers with a helpful message", () => {
  assert.equal(e164(""), "ERROR: Enter your mobile number.");
  assert.equal(e164("   "), "ERROR: Enter your mobile number.");
  for (const input of ["98765", "98765432101", "987654321", "+91 98765", "+91 98765432101", "abcdefghij", "98765 4321a", "98765#43210"]) {
    assert.match(e164(input), /^ERROR/, input);
  }
  assert.match(e164("98765"), /10-digit Indian mobile/);
  assert.match(e164("98765 4321a"), /digits only/);
});

test("rejects numbers made of one repeated digit, the usual fake", () => {
  for (const input of ["9999999999", "8888888888", "+91 7777777777", "6666666666"]) {
    assert.match(e164(input), /^ERROR/, input);
  }
});

test("accepts a number with another country code when it is plausibly E.164", () => {
  assert.equal(e164("+1 303 555 0100"), "+13035550100");
  assert.equal(e164("+44 7911 123456"), "+447911123456");
  assert.equal(e164("0044 7911 123456"), "+447911123456");
  assert.match(e164("+0 303 555 0100"), /^ERROR/);
  assert.match(e164("+1 303"), /^ERROR/);
  assert.match(e164("+1234567890123456"), /^ERROR/, "more than 15 digits");
});

test("a bare number with another country's prefix but no + is not guessed at", () => {
  assert.match(e164("13035550100"), /^ERROR/);
});

test("formats for display, dialling and WhatsApp", () => {
  assert.equal(formatMobile("+919876543210"), "+91 98765 43210");
  assert.equal(formatMobile("+13035550100"), "+13035550100");
  assert.equal(telHref("+919876543210"), "tel:+919876543210");
  assert.equal(whatsappHref("+919876543210"), "https://wa.me/919876543210");
  assert.equal(whatsappHref("+13035550100"), "https://wa.me/13035550100");
});

test("WhatsApp links carry an encoded pre-filled message", () => {
  const href = whatsappHref("+919876543210", "Hi Rahul & team — it's Sunkool");
  const url = new URL(href);
  assert.equal(url.origin + url.pathname, "https://wa.me/919876543210");
  assert.equal(url.searchParams.get("text"), "Hi Rahul & team — it's Sunkool");
});
