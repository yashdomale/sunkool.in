// What the SUNKOOL Assistant says. There is no AI model behind the chat: every reply is written in
// messages/ (one file per language) or generated from the same modules the website pages render
// (products.ts, warranty-content.ts, contact.ts), so the chat cannot quote a description or a number the
// site does not show. Every function takes the language to answer in and defaults to English. Pure and
// dependency-light on purpose: it runs in the browser, and the unit tests run it as is.
import { CONTACT } from "@/lib/contact";
import { INTERIOR_PROTECTION_FILM, PPF, ULTRA_EDGE, WINDOW_FILM, type Category } from "@/lib/products";
import { WARRANTY_PORTAL_URL } from "@/lib/warranty-content";
import { CONTACT_WORDS, GREETING, PRICE, THANKS, TOPIC_RULES } from "./keywords";
import { DEFAULT_LANG, type Lang } from "./language";
import { messagesFor } from "./messages";
import { findTopicById, type ChatTopic } from "./topics";

const SITE = "https://www.sunkool.in";
export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}`;

/** The website category each product button stands for. Warranty / Support has none. */
const CATEGORY_BY_TOPIC: Partial<Record<ChatTopic["id"], Category>> = {
  "heat-control-glazing": WINDOW_FILM,
  "ultra-edge": ULTRA_EDGE,
  "paint-protection-film": PPF,
  "interior-ppf": INTERIOR_PROTECTION_FILM,
};

/** One chat bubble. `title` is the bold first line of a product's information (its name). */
export type Message = { text: string; title?: string };

export type TopicInfo = { title: string; text: string };

/** The product's name (never translated), its description, and the line that says where to read more. */
function topicParts(topic: ChatTopic, lang: Lang): { title: string; description: string; more: string } {
  const m = messagesFor(lang);
  const category = CATEGORY_BY_TOPIC[topic.id];
  return {
    title: topic.label,
    description: m.descriptions[topic.id],
    more: category ? m.seeRange(`${SITE}/${category.slug}`) : m.checkWarranty(WARRANTY_PORTAL_URL),
  };
}

/** The product's name (shown as a heading) and a short description of it, then where to read more. */
export function topicInfo(topic: ChatTopic, lang: Lang = DEFAULT_LANG): TopicInfo {
  const { title, description, more } = topicParts(topic, lang);
  return { title, text: `${description}\n${more}` };
}

/**
 * What the assistant says when a product is chosen, as separate messages so they arrive one by one:
 * a friendly lead-in (it states no fact about the product), the description, then the link.
 */
export function topicMessages(topic: ChatTopic, lang: Lang = DEFAULT_LANG): Message[] {
  const m = messagesFor(lang);
  const { title, description, more } = topicParts(topic, lang);
  const intro = topic.id === "warranty-support" ? m.warrantyIntro : m.topicIntro(topic.label);
  return [{ text: intro }, { title, text: description }, { text: more }];
}

/** The request that follows the product information: in English it asks for the name straight away; the other languages ask a yes/no question first (answered with the chips under it, or typed). */
export function askForDetails(topic: ChatTopic, lang: Lang = DEFAULT_LANG): string {
  return messagesFor(lang).askForDetails(topic.label);
}

/** Shown instead of asking again when this chat has already sent the visitor's details for the topic. */
export function alreadyHaveRequest(topic: ChatTopic, lang: Lang = DEFAULT_LANG): string {
  return messagesFor(lang).alreadyHaveRequest(topic.label);
}

export const askName = (lang: Lang = DEFAULT_LANG) => messagesFor(lang).askName;
export const invalidName = (lang: Lang = DEFAULT_LANG) => messagesFor(lang).invalidName;
export const invalidMobile = (lang: Lang = DEFAULT_LANG) => messagesFor(lang).invalidMobile;
export const dismissText = (lang: Lang = DEFAULT_LANG) => messagesFor(lang).dismiss(WHATSAPP_URL);

/** First name only: "Nice to meet you, Asha!" reads better than a full name. */
export function askMobile(name: string, lang: Lang = DEFAULT_LANG): string {
  const first = name.split(" ")[0] ?? name;
  return messagesFor(lang).askMobile(first);
}

/** Said after a question that came up while details were being collected, to pick the thread back up. */
export function picksUp(step: "consent" | "name" | "mobile", lang: Lang = DEFAULT_LANG): string {
  return messagesFor(lang).picksUp[step];
}

export function leadThanks(topic: ChatTopic, name: string, lang: Lang = DEFAULT_LANG): string {
  return messagesFor(lang).leadThanks(topic.label, name);
}

// The English wording, for callers (and tests) that do not care about the language.
export const ASK_NAME = askName();
export const INVALID_NAME = invalidName();
export const INVALID_MOBILE = invalidMobile();
export const DISMISS_TEXT = dismissText();

/**
 * How long the typing dots show before a message appears. Short lines come quickly and long ones take
 * a moment, the way something being written would; capped so a chat never feels slow.
 */
export function typingDelayMs(text: string): number {
  return Math.min(1600, Math.max(650, 400 + text.length * 10));
}

/** `understood` is false only for the catch-all reply, so a caller can tell a real answer from "no idea". */
export type Routed = { kind: "topic"; topic: ChatTopic } | { kind: "reply"; text: string; understood: boolean };

/**
 * What to do with a typed message: open the product it is about, or answer it (in `lang`). This is keyword
 * matching, not understanding, and the keywords are in keywords.ts in every supported language; anything
 * unrecognised is pointed back at the buttons and WhatsApp.
 */
export function routeMessage(raw: string, lang: Lang = DEFAULT_LANG): Routed {
  const text = raw.normalize("NFC").toLowerCase();
  const m = messagesFor(lang);

  for (const rule of TOPIC_RULES) {
    if (rule.pattern.test(text)) {
      const topic = findTopicById(rule.id);
      if (topic) return { kind: "topic", topic };
    }
  }
  if (PRICE.test(text)) return { kind: "reply", understood: true, text: m.price(WHATSAPP_URL) };
  if (CONTACT_WORDS.test(text)) {
    return { kind: "reply", understood: true, text: m.contact(CONTACT.whatsappDisplay, WHATSAPP_URL, `${SITE}/contact`, m.responseTime) };
  }
  if (THANKS.test(text)) return { kind: "reply", understood: true, text: m.thanks };
  if (GREETING.test(text)) return { kind: "reply", understood: true, text: m.hello };

  return { kind: "reply", understood: false, text: m.fallback(WHATSAPP_URL) };
}
