// Field validation for the public enquiry form. The same functions run in the
// browser (inline feedback) and on the server (authoritative), so the two can
// never disagree. Dependency-free on purpose: this ships in the public blog bundle.
import { normalizeMobile } from "./phone";

export type LeadField = "name" | "mobile" | "city" | "productId" | "message";
export type LeadFieldErrors = Partial<Record<LeadField, string>>;
export type ValidLeadFields = {
  name: string;
  /** E.164. */
  mobile: string;
  city: string;
  productId: string;
  /** What the visitor wrote, or null when they left the box empty (it is optional). */
  message: string | null;
};

export const MESSAGE_MAX_LENGTH = 500;
export type LeadValidation = { ok: true; value: ValidLeadFields } | { ok: false; errors: LeadFieldErrors };

// Letters (any script), combining marks, spaces and the punctuation real names
// and places use. Digits, slashes and colons are excluded, which also keeps URLs
// and other spam out of the free-text fields.
const NAME = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
const CITY = /^[\p{L}\p{M}][\p{L}\p{M} .,'’()-]*$/u;

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function text(value: unknown): string {
  return typeof value === "string" ? collapseSpaces(value) : "";
}

export function validateName(input: unknown): { value: string } | { error: string } {
  const value = text(input);
  if (value.length < 2) return { error: "Enter your full name." };
  if (value.length > 80) return { error: "Keep your name under 80 characters." };
  if (!NAME.test(value)) return { error: "Use letters only in your name." };
  return { value };
}

export function validateCity(input: unknown): { value: string } | { error: string } {
  const value = text(input);
  if (value.length < 2) return { error: "Enter your city." };
  if (value.length > 60) return { error: "Keep your city under 60 characters." };
  if (!CITY.test(value)) return { error: "Use letters only for your city." };
  return { value };
}

/**
 * The optional free-text message. Line breaks are kept (at most one blank line in a row); every other
 * control character is dropped. Empty or whitespace-only means "no message", which is valid.
 */
export function validateMessage(input: unknown): { value: string | null } | { error: string } {
  if (input === undefined || input === null || input === "") return { value: null };
  if (typeof input !== "string") return { error: "Enter your message as text." };
  const value = input
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (value.length > MESSAGE_MAX_LENGTH) return { error: `Keep your message under ${MESSAGE_MAX_LENGTH} characters.` };
  return { value: value || null };
}

export function validateLeadFields(input: {
  name?: unknown;
  mobile?: unknown;
  city?: unknown;
  productId?: unknown;
  message?: unknown;
}): LeadValidation {
  const errors: LeadFieldErrors = {};

  const name = validateName(input.name);
  if ("error" in name) errors.name = name.error;

  const mobile = normalizeMobile(typeof input.mobile === "string" ? input.mobile : "");
  if (!mobile.ok) errors.mobile = mobile.error;

  const city = validateCity(input.city);
  if ("error" in city) errors.city = city.error;

  const productId = typeof input.productId === "string" ? input.productId.trim() : "";
  if (!productId || productId.length > 80) errors.productId = "Choose the product you're interested in.";

  const message = validateMessage(input.message);
  if ("error" in message) errors.message = message.error;

  if ("error" in name || !mobile.ok || "error" in city || errors.productId || "error" in message) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    value: { name: name.value, mobile: mobile.e164, city: city.value, productId, message: message.value },
  };
}
