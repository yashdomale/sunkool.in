// How the chat talks a visitor through a request: show the product, then ask for a name and a mobile
// number one message at a time, the way a person would. In English the name is asked for right after the
// product; the other languages still ask first whether the team may get in touch. Every
// turn is a pure function of (where we are, what was said), so the unit tests run it as is and the
// hook (use-chat.ts) only has to display the result. Still no AI: it is the rule-based routing in
// flow.ts plus the same name and number checks the website's enquiry form uses.
//
// The chat answers in the language the visitor writes in (language.ts): every typed message is checked,
// and the language switches as soon as the visitor does. A turn reports the language it answered in.
import { normalizeMobile } from "@/lib/leads/phone";
import { validateName } from "@/lib/leads/validation";
import {
  alreadyHaveRequest,
  askForDetails,
  askMobile,
  askName,
  dismissText,
  invalidMobile,
  invalidName,
  leadThanks,
  picksUp,
  routeMessage,
  topicMessages,
  WHATSAPP_URL,
  type Message,
} from "./flow";
import { extractName, NO, YES } from "./keywords";
import { DEFAULT_LANG, detectLanguage, type Lang } from "./language";
import { messagesFor } from "./messages";
import { findTopicById, type ChatTopic } from "./topics";

/** Where a request for a product has got to. Null (no capture) means no request is open. */
export type Capture = { topicId: ChatTopic["id"]; step: "consent" | "name" | "mobile"; name?: string };

export type LeadDraft = { topic: ChatTopic; name: string; mobile: string };

export type Turn = {
  /** What the assistant says next, in order. */
  replies: Message[];
  /** Where the request stands after this turn. */
  capture: Capture | null;
  /** The language the chat is in after this turn (the visitor's, if they switched). */
  lang: Lang;
  /** Set once both details are in: the caller files the lead, then continues with `submitted` / `submitFailed`. */
  submit?: LeadDraft;
  /** Set once the request is filed: the conversation is over, and a new chat has to be started to say more. */
  ended?: true;
};

export type SubmitFailure = { error: string; fieldErrors?: { name?: string; mobile?: string }; reason?: "busy" | "unavailable" };

// Languages whose askForDetails already asks for the name, so the request starts at the name step. The others
// have not been moved over: their askForDetails is still the yes/no question, so they start at "consent".
const DIRECT_ASK: readonly Lang[] = ["en"];

// A bare "yes" typed to "may I have your name?" is an answer to the wrong question, not a name.
const BARE_YES = /^\s*(?:yes|yeah|yep|yup|ok|okay|sure|please|of course)\s*[.!]*\s*$/i;

// Only digits and the punctuation people put in a phone number: whatever this matches was meant as one.
const LOOKS_LIKE_NUMBER = /^[+\d\s().-]+$/;

// Digits written in Devanagari (also Marathi), Bengali, Gujarati, Tamil, Telugu or Kannada: each script's
// zero sits at the same place in its block, so the digit is the distance from there.
const INDIC_DIGIT = /[०-९০-৯૦-૯௦-௯౦-౯೦-೯]/g;

/** "९८७६५ ४३२१०" -> "98765 43210", so a number typed in the visitor's own digits is still a number. */
export function toAsciiDigits(text: string): string {
  return text.replace(INDIC_DIGIT, (digit) => {
    const low = (digit.codePointAt(0) ?? 0) & 0xff;
    return String(low >= 0xe6 ? low - 0xe6 : low - 0x66);
  });
}

/** The product's information, then the request for details (in English, straight for the name). */
export function openTopic(topic: ChatTopic, alreadySent: boolean, lang: Lang = DEFAULT_LANG): Turn {
  return {
    replies: [...topicMessages(topic, lang), { text: alreadySent ? alreadyHaveRequest(topic, lang) : askForDetails(topic, lang) }],
    capture: alreadySent ? null : { topicId: topic.id, step: DIRECT_ASK.includes(lang) ? "name" : "consent" },
    lang,
  };
}

function declined(lang: Lang): Turn {
  return { replies: [{ text: dismissText(lang) }], capture: null, lang };
}

/** Something a person typing their name or number would not say: a question, a product, a greeting. */
function isQuestion(text: string): boolean {
  if (text.includes("?") || text.includes("？")) return true;
  const routed = routeMessage(text);
  return routed.kind === "topic" || routed.understood;
}

/** The turn for a message typed while a request is open, or null when it is a question to answer instead. */
function collecting(capture: Capture, topic: ChatTopic, text: string, lang: Lang): Turn | null {
  if (NO.test(text)) return declined(lang);

  if (capture.step === "consent") {
    return YES.test(text) ? { replies: [{ text: askName(lang) }], capture: { ...capture, step: "name" }, lang } : null;
  }

  if (capture.step === "name") {
    if (isQuestion(text)) return null;
    if (BARE_YES.test(text)) return { replies: [{ text: invalidName(lang) }], capture, lang };
    const name = validateName(extractName(text));
    if ("error" in name) return { replies: [{ text: invalidName(lang) }], capture, lang };
    return { replies: [{ text: askMobile(name.value, lang) }], capture: { ...capture, step: "mobile", name: name.value }, lang };
  }

  // The number. Anything that looks like one is taken as one (and checked); anything else may be a question.
  const digits = toAsciiDigits(text);
  if (!LOOKS_LIKE_NUMBER.test(digits) && isQuestion(text)) return null;
  const mobile = normalizeMobile(digits);
  if (!mobile.ok || !capture.name) return { replies: [{ text: invalidMobile(lang) }], capture, lang };
  return { replies: [], capture, lang, submit: { topic, name: capture.name, mobile: mobile.e164 } };
}

/**
 * What to do with a typed message (or a chip, which is just its label). `sent` holds the products this
 * chat has already filed a request for; `current` is the language the chat is in. The reply is in the
 * language the message is written in when that is clear, otherwise in `current`. A chip never changes the
 * language: its label is already in the chat's language.
 */
export function respond(capture: Capture | null, said: string, sent: readonly string[], current: Lang = DEFAULT_LANG, fromChip = false): Turn {
  const text = said.trim().normalize("NFC");
  const lang = fromChip ? current : detectLanguage(text, current);
  const topic = capture ? findTopicById(capture.topicId) : null;
  if (capture && topic) {
    const turn = collecting(capture, topic, text, lang);
    if (turn) return turn;
  }

  const routed = routeMessage(text, lang);
  if (routed.kind === "topic") return openTopic(routed.topic, sent.includes(routed.topic.id), lang);
  // A question in the middle of a request does not cancel it: answer, then pick the thread back up.
  return {
    replies: [{ text: routed.text }, ...(capture ? [{ text: picksUp(capture.step, lang) }] : [])],
    capture,
    lang,
  };
}

/** The visitor tapped a product button. */
export function choose(topic: ChatTopic, sent: readonly string[], lang: Lang = DEFAULT_LANG): Turn {
  return openTopic(topic, sent.includes(topic.id), lang);
}

/** The request went through: the visitor is thanked and the chat is over. */
export function submitted(topic: ChatTopic, name: string, lang: Lang = DEFAULT_LANG): Turn {
  return { replies: [{ text: leadThanks(topic, name, lang) }], capture: null, lang, ended: true };
}

/** The request did not go through: say why and ask again for whatever was wrong. */
export function submitFailed(capture: Capture, failure: SubmitFailure, lang: Lang = DEFAULT_LANG): Turn {
  const m = messagesFor(lang);
  if (failure.fieldErrors?.name) return { replies: [{ text: invalidName(lang) }], capture: { ...capture, step: "name", name: undefined }, lang };
  if (failure.fieldErrors?.mobile) return { replies: [{ text: invalidMobile(lang) }], capture: { ...capture, step: "mobile" }, lang };
  if (failure.reason === "busy") return { replies: [{ text: m.failed.busy }], capture, lang };
  if (failure.reason === "unavailable") return { replies: [{ text: `${m.failed.unavailable}\n${WHATSAPP_URL}` }], capture, lang };
  return { replies: [{ text: `${m.failed.generic}\n${WHATSAPP_URL}` }], capture, lang };
}
