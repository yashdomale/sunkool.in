import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTACT } from "@/lib/contact";
import { INTERIOR_PROTECTION_FILM, PPF, ULTRA_EDGE, WINDOW_FILM } from "@/lib/products";
import { WARRANTY_PAGE } from "@/lib/warranty-content";
import { alreadyHaveRequest, askForDetails, askMobile, leadThanks, routeMessage, topicInfo, topicMessages, WHATSAPP_URL } from "./flow";
import { NO, YES } from "./keywords";
import { LANGUAGES } from "./language";
import { linkify } from "./linkify";
import { MESSAGES } from "./messages";
import { submitFailed } from "./conversation";
import { CHAT_TOPICS } from "./topics";

const OTHER_LANGUAGES = LANGUAGES.filter((lang) => lang !== "en");

// The English the translations in messages/ were written from. When the website's text changes, this test
// fails: update the translations (messages/*.ts) and then this copy, so the chat never says in Hindi or Tamil
// something the pages no longer say in English.
const TRANSLATED_FROM = {
  "heat-control-glazing": "Nano-ceramic heat rejection films engineered for clarity, comfort and signal-friendly performance.",
  "ultra-edge":
    "Re-imagined by SUNKOOL: sputtered silver Ultra, titanium-nitride Edge, Prism nano multilayer PET, and sunroof & moonroof films for heat rejection and UV protection.",
  "paint-protection-film":
    "High-performance aliphatic polyurethane PPF — self-healing, UV-resistant, virtually invisible protection for a high-gloss finish.",
  "interior-ppf": "Premium interior protection film — 195 micron thickness, 99% UV protection, scratch resistance, anti-yellow coating and stain resistance.",
  "warranty-support": "Every SUNKOOL installation is backed by comprehensive coverage. Check an existing warranty or register a new one in minutes.",
} as const;
const RESPONSE_TIME_FROM = "Usually replies within 2 hours";

test("the translations were written from the website's current text", () => {
  const site = {
    "heat-control-glazing": WINDOW_FILM.description,
    "ultra-edge": ULTRA_EDGE.description,
    "paint-protection-film": PPF.description,
    "interior-ppf": INTERIOR_PROTECTION_FILM.description,
    "warranty-support": WARRANTY_PAGE.description,
  };
  assert.deepEqual(site, TRANSLATED_FROM, "the site's text changed: update messages/*.ts, then TRANSLATED_FROM in this test");
  assert.equal(CONTACT.responseTime, RESPONSE_TIME_FROM, "the site's response time changed: update responseTime in messages/*.ts");
});

test("English is the website's own text, never a copy", () => {
  for (const topic of CHAT_TOPICS) {
    assert.equal(MESSAGES.en.descriptions[topic.id], TRANSLATED_FROM[topic.id]);
  }
});

test("every language has every message, and none is blank", () => {
  for (const lang of LANGUAGES) {
    const m = MESSAGES[lang];
    const url = "https://wa.me/1";
    const samples: [string, string][] = [
      ["name", m.name],
      ["warrantyIntro", m.warrantyIntro],
      ["topicIntro", m.topicIntro("PPF")],
      ["seeRange", m.seeRange(url)],
      ["checkWarranty", m.checkWarranty(url)],
      ["askForDetails", m.askForDetails("PPF")],
      ["alreadyHaveRequest", m.alreadyHaveRequest("PPF")],
      ["askName", m.askName],
      ["askMobile", m.askMobile("Asha")],
      ["invalidName", m.invalidName],
      ["invalidMobile", m.invalidMobile],
      ["picksUp.consent", m.picksUp.consent],
      ["picksUp.name", m.picksUp.name],
      ["picksUp.mobile", m.picksUp.mobile],
      ["leadThanks", m.leadThanks("PPF", "Asha")],
      ["anythingElse", m.anythingElse],
      ["dismiss", m.dismiss(url)],
      ["failed.generic", m.failed.generic],
      ["failed.busy", m.failed.busy],
      ["failed.unavailable", m.failed.unavailable],
      ["price", m.price(url)],
      ["responseTime", m.responseTime],
      ["contact", m.contact("+91 1", url, "https://www.sunkool.in/contact", m.responseTime)],
      ["thanks", m.thanks],
      ["hello", m.hello],
      ["fallback", m.fallback(url)],
      ...Object.entries(m.descriptions).map(([id, text]): [string, string] => [`descriptions.${id}`, text]),
      ...(["subtitle", "typing", "thinking", "exploreAnother", "yes", "notNow", "send", "newChat", "minimise", "close", "yourMessage"] as const).map(
        (key): [string, string] => [`ui.${key}`, m.ui[key]]
      ),
      ["ui.placeholder.general", m.ui.placeholder.general],
      ["ui.placeholder.name", m.ui.placeholder.name],
      ["ui.placeholder.mobile", m.ui.placeholder.mobile],
      ["ui.footer.link", m.ui.footer.link],
    ];
    for (const [key, text] of samples) {
      assert.ok(typeof text === "string" && text.trim().length > 0, `${lang}: ${key} is blank`);
    }
    assert.equal(Object.keys(m.descriptions).length, CHAT_TOPICS.length, `${lang}: a description per product`);
  }
});

test("a translation keeps the facts: numbers, the product's name, the links and the contact details", () => {
  for (const lang of OTHER_LANGUAGES) {
    const m = MESSAGES[lang];
    // The numbers in the site's description are quoted as they are.
    assert.ok(m.descriptions["interior-ppf"].includes("195") && m.descriptions["interior-ppf"].includes("99%"), `${lang}: interior film numbers`);
    assert.ok(m.responseTime.includes("2"), `${lang}: response time`);
    // The example number and the digits asked for.
    assert.ok(m.invalidMobile.includes("98765 43210") && m.invalidMobile.includes("10"), `${lang}: number example`);
    // Each template says what it was given.
    assert.ok(m.topicIntro("Ultra Edge").includes("Ultra Edge"), `${lang}: topicIntro`);
    assert.ok(m.askForDetails("Ultra Edge").includes("Ultra Edge"), `${lang}: askForDetails`);
    assert.ok(m.alreadyHaveRequest("Ultra Edge").includes("Ultra Edge"), `${lang}: alreadyHaveRequest`);
    assert.ok(m.askMobile("Asha").includes("Asha"), `${lang}: askMobile`);
    const thanks = m.leadThanks("Ultra Edge", "Asha");
    assert.ok(thanks.includes("Asha") && thanks.includes("Ultra Edge"), `${lang}: leadThanks`);
    const contact = m.contact(CONTACT.whatsappDisplay, WHATSAPP_URL, "https://www.sunkool.in/contact", m.responseTime);
    assert.ok(contact.includes(CONTACT.whatsappDisplay) && contact.includes(WHATSAPP_URL) && contact.includes("/contact"), `${lang}: contact`);
    for (const text of [m.price(WHATSAPP_URL), m.dismiss(WHATSAPP_URL), m.fallback(WHATSAPP_URL)]) {
      assert.ok(text.includes(WHATSAPP_URL), `${lang}: WhatsApp link`);
    }
    // No price is ever quoted.
    assert.doesNotMatch(m.price(WHATSAPP_URL).replace(WHATSAPP_URL, ""), /₹|\bRs\.?\s?\d|\d+\s?(rupees|रुपये)/i, `${lang}: price`);
  }
});

test("product names are never translated: they are brand names and what a lead is filed under", () => {
  for (const lang of LANGUAGES) {
    for (const topic of CHAT_TOPICS) {
      assert.equal(topicMessages(topic, lang)[1].title, topic.label, `${lang}: ${topic.id}`);
      assert.equal(topicInfo(topic, lang).title, topic.label);
    }
  }
});

test("every link the chat writes, in every language, is one the widget makes clickable and ends where the link ends", () => {
  const texts: string[] = [];
  for (const lang of LANGUAGES) {
    for (const topic of CHAT_TOPICS) {
      texts.push(...topicMessages(topic, lang).map((message) => message.text), askForDetails(topic, lang), alreadyHaveRequest(topic, lang));
      texts.push(leadThanks(topic, "Asha", lang), askMobile("Asha Patel", lang));
    }
    for (const said of ["what is the price", "where is your dealer", "xyzzy", "thanks", "hello"]) {
      const routed = routeMessage(said, lang);
      if (routed.kind === "reply") texts.push(routed.text);
    }
    const capture = { topicId: "paint-protection-film", step: "mobile", name: "Asha" } as const;
    for (const failure of [{ error: "x" }, { error: "x", reason: "busy" as const }, { error: "x", reason: "unavailable" as const }]) {
      texts.push(...submitFailed(capture, failure, lang).replies.map((reply) => reply.text));
    }
  }
  for (const text of texts) {
    const urls = text.match(/https?:\/\/[^\s<>"]+/g) ?? [];
    const links = linkify(text).filter((segment) => segment.type === "link");
    assert.equal(links.length, urls.length, text);
    for (const url of urls) {
      // A web address is followed by a space, a bracket or the end: never by the next word glued on.
      assert.match(url.replace(/[.,;:!?)\]'"]+$/, ""), /^https?:\/\/[\x21-\x7E]+$/, text);
    }
  }
});

test("the chips are answers the chat understands: 'yes' and 'not now' in every language", () => {
  for (const lang of LANGUAGES) {
    const { yes, notNow } = MESSAGES[lang].ui;
    assert.ok(YES.test(yes) && !NO.test(yes), `${lang}: "${yes}" is a yes`);
    assert.ok(NO.test(notNow) && !YES.test(notNow), `${lang}: "${notNow}" is a no`);
  }
});
