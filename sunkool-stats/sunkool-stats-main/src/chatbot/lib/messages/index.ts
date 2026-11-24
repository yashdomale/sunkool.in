// The chatbot's words, one file per language. `MESSAGES` has to hold every language in `LANGUAGES`, and each
// language has to hold every message in `Messages` (types.ts), so a gap is a compile error, not a blank bubble.
import type { Lang } from "../language";
import { bn } from "./bn";
import { en } from "./en";
import { gu } from "./gu";
import { hi } from "./hi";
import { hinglish } from "./hinglish";
import { kn } from "./kn";
import { mr } from "./mr";
import { ta } from "./ta";
import { te } from "./te";
import type { Messages } from "./types";

export type { Messages } from "./types";

export const MESSAGES: Record<Lang, Messages> = { en, hi, hinglish, mr, gu, bn, ta, te, kn };

export function messagesFor(lang: Lang): Messages {
  return MESSAGES[lang];
}
