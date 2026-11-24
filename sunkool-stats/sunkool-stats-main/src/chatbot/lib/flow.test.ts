import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTACT } from "@/lib/contact";
import { INTERIOR_PROTECTION_FILM, PPF, ULTRA_EDGE, WINDOW_FILM } from "@/lib/products";
import { WARRANTY_PAGE, WARRANTY_PORTAL_URL } from "@/lib/warranty-content";
import { linkify } from "./linkify";
import { alreadyHaveRequest, askForDetails, DISMISS_TEXT, leadThanks, routeMessage, topicInfo, WHATSAPP_URL } from "./flow";
import { CHAT_TOPICS, findTopicById, findTopicByLabel } from "./topics";

const CATEGORY_FOR = {
  "heat-control-glazing": WINDOW_FILM,
  "ultra-edge": ULTRA_EDGE,
  "paint-protection-film": PPF,
  "interior-ppf": INTERIOR_PROTECTION_FILM,
} as const;

test("every product button shows its name, the website's own description and a link to its page", () => {
  for (const [id, category] of Object.entries(CATEGORY_FOR)) {
    const topic = findTopicById(id);
    assert.ok(topic, id);
    const info = topicInfo(topic);
    assert.equal(info.title, topic.label, `${id}: titled with the product name`);
    assert.ok(info.text.includes(category.description), `${id}: carries the site's description`);
    assert.ok(info.text.includes(`https://www.sunkool.in/${category.slug}`), `${id}: links to its page`);
  }
});

test("Warranty / Support explains the warranty and links to the warranty portal", () => {
  const info = topicInfo(findTopicById("warranty-support")!);
  assert.equal(info.title, "Warranty / Support");
  assert.ok(info.text.includes(WARRANTY_PAGE.description));
  assert.ok(info.text.includes(WARRANTY_PORTAL_URL));
});

test("every link the chat writes is one the widget will make clickable", () => {
  const texts = [
    ...CHAT_TOPICS.map((topic) => topicInfo(topic).text),
    DISMISS_TEXT,
    (routeMessage("what is the price") as { text: string }).text,
    (routeMessage("where is your dealer") as { text: string }).text,
    (routeMessage("zzz") as { text: string }).text,
  ];
  for (const text of texts) {
    const links = linkify(text).filter((segment) => segment.type === "link");
    const urls = text.match(/https?:\/\/[^\s]+/g) ?? [];
    assert.equal(links.length, urls.length, text);
  }
});

test("the follow-up messages name the product", () => {
  for (const topic of CHAT_TOPICS) {
    assert.ok(askForDetails(topic).includes(topic.label));
    assert.ok(alreadyHaveRequest(topic).includes(topic.label));
    const thanks = leadThanks(topic, "Piyush");
    assert.ok(thanks.includes("Piyush") && thanks.includes(topic.label));
  }
});

test("the thank-you promises a call and never makes a claim about prices or timing", () => {
  const text = leadThanks(findTopicByLabel("Ultra Edge")!, "Asha");
  assert.match(text, /contact you shortly/);
  assert.doesNotMatch(text, /₹|\d+ (min|hour)/i);
});

function topicOf(text: string): string | null {
  const routed = routeMessage(text);
  return routed.kind === "topic" ? routed.topic.id : null;
}

test("typed words open the matching product", () => {
  assert.equal(topicOf("Tell me about PPF"), "paint-protection-film");
  assert.equal(topicOf("paint protection film for my Creta"), "paint-protection-film");
  assert.equal(topicOf("does it self heal scratches"), "paint-protection-film");
  assert.equal(topicOf("I want window tint"), "heat-control-glazing");
  assert.equal(topicOf("car glass heat is too much"), "heat-control-glazing");
  assert.equal(topicOf("what is sapphire"), "heat-control-glazing");
  assert.equal(topicOf("price of topaz 70"), "heat-control-glazing");
  assert.equal(topicOf("is ch70 legal"), "heat-control-glazing");
  assert.equal(topicOf("ultra edge films"), "ultra-edge");
  assert.equal(topicOf("titanium nitride"), "ultra-edge");
  assert.equal(topicOf("interior protection film"), "interior-ppf");
  assert.equal(topicOf("protect my dashboard"), "interior-ppf");
  assert.equal(topicOf("I need to claim my warranty"), "warranty-support");
  assert.equal(topicOf("how do I register"), "warranty-support");
});

test("the more specific product wins when a message could be two", () => {
  // "protection film" alone would be paint protection film.
  assert.equal(topicOf("interior protection film please"), "interior-ppf");
  assert.equal(topicOf("warranty on ppf"), "warranty-support");
});

test("price questions get an honest answer: no figure, a quote from the team", () => {
  for (const text of ["what is the price?", "how much for ppf in Pune", "need a quote", "discount milega?"]) {
    const routed = routeMessage(text);
    // Questions that also name a product open that product; the rest get the price answer.
    if (routed.kind === "reply") {
      assert.match(routed.text, /exact quote/);
      assert.doesNotMatch(routed.text, /₹\s?\d|\bRs\.?\s?\d/);
    }
  }
  const plain = routeMessage("what is the price?");
  assert.equal(plain.kind, "reply");
});

test("contact questions get the team's real number", () => {
  const routed = routeMessage("where can I find a dealer near me");
  assert.equal(routed.kind, "reply");
  if (routed.kind === "reply") {
    assert.ok(routed.text.includes(CONTACT.whatsappDisplay));
    assert.ok(routed.text.includes(WHATSAPP_URL));
  }
});

test("greetings and thanks are answered; anything else is pointed at the buttons and WhatsApp", () => {
  const hello = routeMessage("Hello");
  assert.equal(hello.kind === "reply" && /Welcome to SUNKOOL/.test(hello.text), true);
  const thanks = routeMessage("thanks a lot");
  assert.equal(thanks.kind === "reply" && /welcome/i.test(thanks.text), true);

  for (const text of ["asdf qwerty", "what is the capital of France", "😀", ""]) {
    const routed = routeMessage(text);
    assert.equal(routed.kind, "reply", text);
    if (routed.kind === "reply") {
      assert.match(routed.text, /choose one below/);
      assert.ok(routed.text.includes(WHATSAPP_URL));
    }
  }
});

test("a visitor's text can never become markup or a link of ours", () => {
  // Replies never repeat what was typed.
  const routed = routeMessage("<img src=x onerror=alert(1)> https://evil.example");
  assert.equal(routed.kind, "reply");
  if (routed.kind === "reply") {
    assert.doesNotMatch(routed.text, /evil|onerror|<img/);
  }
});
