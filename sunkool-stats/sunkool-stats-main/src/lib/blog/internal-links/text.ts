const FUNCTION_WORDS = new Set(
  (
    "a an the and or but nor of for to in on at by with from into over under about as is are was were be been being " +
    "it its it's this that these those your you our we they their his her not no do does did can could should would " +
    "will may might must has have had how what whats why when where which who whom whose than then so if here here's " +
    "there s t re ve ll d m much many some any just also very too only own other another each both few lot lots"
  ).split(" ")
);

// Words that describe nearly every post on a car-film blog. A phrase made only
// of these ("window film", "best guide") says nothing about what a post is
// about, so it's never used to pick a blog post as a link target.
const GENERIC_WORDS = new Set(
  (
    "best top new good great guide guides tip tips complete ultimate need know everything actually really vs versus " +
    "explained worth every proven powerful essential reasons reason myths myth facts fact india indian car cars " +
    "vehicle vehicles auto automotive window windows film films expected price specs launch early more most all " +
    "right wrong things thing way ways list review reviews update updates news full latest official " +
    "owner owners follow sunkool sun kool"
  ).split(" ")
);

export const normalizeSpaces = (value: string) => value.replace(/[\s ]+/g, " ").trim();

/** Lowercased letter/number runs: "Nano-Ceramic Film, 2026" → [nano, ceramic, film, 2026]. */
export function tokenize(value: string): string[] {
  return value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

export function isGenericToken(token: string): boolean {
  return token.length < 2 || /^\d+$/.test(token) || FUNCTION_WORDS.has(token) || GENERIC_WORDS.has(token);
}

/** The tokens of `value` that actually carry topic information. */
export function contentTokens(value: string): string[] {
  return tokenize(value).filter((token) => !isGenericToken(token));
}

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
