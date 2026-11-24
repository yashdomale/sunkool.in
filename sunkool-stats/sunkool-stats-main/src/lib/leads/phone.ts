// Mobile-number handling shared by the public form (inline validation), the
// server (authoritative validation) and the admin dashboard (display, tel:, WhatsApp).
// Pure and dependency-free so it can ship in the client bundle.
//
// Numbers are stored as E.164 ("+919876543210"). The form accepts what people
// actually type — "98765 43210", "09876543210", "+91 98765-43210", "0091…" —
// and normalises it. Indian numbers get strict validation (Sunkool's market);
// numbers with an explicit other country code are accepted if they are
// plausibly E.164, so NRI customers are not turned away.

export type MobileResult = { ok: true; e164: string } | { ok: false; error: string };

const INDIA_MOBILE = /^[6-9]\d{9}$/;
const INVALID_INDIA = "Enter a valid 10-digit Indian mobile number, like 98765 43210.";

export function normalizeMobile(input: string): MobileResult {
  const raw = input.trim();
  if (!raw) return { ok: false, error: "Enter your mobile number." };
  if (!/^\+?[\d\s().-]+$/.test(raw)) {
    return { ok: false, error: "Use digits only, like 98765 43210 (a leading + is fine)." };
  }

  let digits = raw.replace(/\D/g, "");
  let international = raw.startsWith("+");
  if (!international && digits.startsWith("00")) {
    digits = digits.slice(2);
    international = true;
  }

  if (international) {
    if (digits.startsWith("91")) {
      const national = digits.slice(2);
      return INDIA_MOBILE.test(national) && !isRepeated(national)
        ? { ok: true, e164: `+91${national}` }
        : { ok: false, error: INVALID_INDIA };
    }
    // Any other country: E.164 allows 8–15 digits and never starts with 0.
    return /^[1-9]\d{7,14}$/.test(digits)
      ? { ok: true, e164: `+${digits}` }
      : { ok: false, error: "Enter a valid number with country code, like +1 303 555 0100." };
  }

  // No country code given: a local Indian number, optionally with the trunk 0 or a bare 91.
  let national: string | null = null;
  if (digits.length === 10) national = digits;
  else if (digits.length === 11 && digits.startsWith("0")) national = digits.slice(1);
  else if (digits.length === 12 && digits.startsWith("91")) national = digits.slice(2);

  return national && INDIA_MOBILE.test(national) && !isRepeated(national)
    ? { ok: true, e164: `+91${national}` }
    : { ok: false, error: INVALID_INDIA };
}

/** 9999999999 and friends are never real; they are what bots and impatient visitors type. */
function isRepeated(national: string): boolean {
  return /^(\d)\1+$/.test(national);
}

/** "+919876543210" → "+91 98765 43210". Other countries are shown as stored. */
export function formatMobile(e164: string): string {
  const india = /^\+91(\d{5})(\d{5})$/.exec(e164);
  return india ? `+91 ${india[1]} ${india[2]}` : e164;
}

/** Dialler link: `tel:` needs the leading + to dial internationally. */
export function telHref(e164: string): string {
  return `tel:${e164}`;
}

/** wa.me wants the full international number with no "+", spaces or punctuation. */
export function whatsappHref(e164: string, message?: string): string {
  const base = `https://wa.me/${e164.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
