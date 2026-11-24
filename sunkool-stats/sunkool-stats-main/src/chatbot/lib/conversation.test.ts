import { test } from "node:test";
import assert from "node:assert/strict";
import { choose, openTopic, respond, submitFailed, submitted, toAsciiDigits, type Capture } from "./conversation";
import { INVALID_MOBILE, INVALID_NAME, topicMessages, typingDelayMs, WHATSAPP_URL } from "./flow";
import { MESSAGES } from "./messages";
import { CHAT_GREETING, CHAT_TOPICS, findTopicById } from "./topics";

const ppf = findTopicById("paint-protection-film")!;
const texts = (turn: { replies: { text: string }[] }) => turn.replies.map((r) => r.text);

test("the chat opens with a short greeting, one message at a time", () => {
  assert.equal(CHAT_GREETING.length, 2);
  assert.match(CHAT_GREETING[0], /Welcome to SUNKOOL/);
  assert.match(CHAT_GREETING[1], /How can I help you today/);
});

test("the typing dots last longer for longer messages, within limits", () => {
  const short = typingDelayMs("Hi! 👋");
  const long = typingDelayMs("x".repeat(160));
  assert.ok(short >= 650 && short < long, `${short} < ${long}`);
  assert.equal(typingDelayMs("x".repeat(5000)), 1600);
  assert.equal(typingDelayMs(""), 650);
});

test("a product arrives as separate messages: a lead-in, the site's description, then the link", () => {
  for (const topic of CHAT_TOPICS) {
    const messages = topicMessages(topic);
    assert.equal(messages.length, 3, topic.id);
    assert.equal(messages[1].title, topic.label);
    assert.match(messages[2].text, /https:\/\/www\.sunkool\.in\/|warranty/i);
    // The lead-in is friendly but states nothing about the product.
    assert.doesNotMatch(messages[0].text, /\d/);
  }
});

test("choosing a product shows it and then asks straight away for the name and mobile number", () => {
  const turn = choose(ppf, []);
  assert.equal(turn.replies.length, 4);
  // The last message follows the link; it asks for the name, not whether the team may get in touch.
  assert.match(turn.replies[2].text, /https:\/\/www\.sunkool\.in\/ppf/);
  assert.equal(turn.replies[3].text, "May I have your name, please, so our team can get in touch with you about Paint Protection Film?");
  assert.doesNotMatch(turn.replies[3].text, /Would you like/);
  assert.deepEqual(turn.capture, { topicId: "paint-protection-film", step: "name" });
  assert.equal(turn.ended, undefined);
});

test("a product this chat already filed a request for is shown without asking again", () => {
  const turn = openTopic(ppf, true);
  assert.equal(turn.capture, null);
  assert.match(turn.replies[turn.replies.length - 1].text, /already have your request/);
});

test("name, then number: the request is ready to file, with no yes/no question in between", () => {
  let turn = choose(ppf, []);
  assert.equal(turn.capture?.step, "name");

  turn = respond(turn.capture, "Asha Patel", []);
  assert.equal(turn.capture?.step, "mobile");
  assert.equal(turn.capture?.name, "Asha Patel");
  assert.match(turn.replies[0].text, /Nice to meet you, Asha!/);
  assert.doesNotMatch(turn.replies[0].text, /Patel/);

  turn = respond(turn.capture, "98765 43210", []);
  assert.deepEqual(turn.replies, []);
  assert.deepEqual(turn.submit, { topic: ppf, name: "Asha Patel", mobile: "+919876543210" });
});

test("'not now' ends the request at any step and points to WhatsApp", () => {
  const steps: Capture[] = [
    { topicId: "paint-protection-film", step: "consent" }, // the other languages still ask first
    { topicId: "paint-protection-film", step: "name" },
    { topicId: "paint-protection-film", step: "mobile", name: "Asha" },
  ];
  for (const capture of steps) {
    const turn = respond(capture, "Not now", []);
    assert.equal(turn.capture, null, capture.step);
    assert.ok(turn.replies[0].text.includes(WHATSAPP_URL));
    assert.equal(turn.submit, undefined);
  }
});

test("a name or number that does not check out is asked for again, politely", () => {
  const name = respond({ topicId: "paint-protection-film", step: "name" }, "1234", []);
  assert.deepEqual(texts(name), [INVALID_NAME]);
  assert.equal(name.capture?.step, "name");

  const mobile: Capture = { topicId: "paint-protection-film", step: "mobile", name: "Asha" };
  for (const text of ["12345", "abc xyz", "99999 99999"]) {
    const turn = respond(mobile, text, []);
    assert.deepEqual(texts(turn), [INVALID_MOBILE], text);
    assert.equal(turn.capture?.step, "mobile");
    assert.equal(turn.submit, undefined);
  }
});

test("a question part-way through is answered and the request is picked back up", () => {
  const capture: Capture = { topicId: "paint-protection-film", step: "name" };
  const turn = respond(capture, "what is the price?", []);
  assert.equal(turn.replies.length, 2);
  assert.match(turn.replies[0].text, /exact quote/);
  assert.match(turn.replies[1].text, /your name/);
  assert.deepEqual(turn.capture, capture);
});

test("asking about another product part-way through switches to it", () => {
  const turn = respond({ topicId: "paint-protection-film", step: "mobile", name: "Asha" }, "tell me about window tint", []);
  assert.deepEqual(turn.capture, { topicId: "heat-control-glazing", step: "name" });
});

test("a greeting typed when asked for the name is answered, not taken as a name", () => {
  const turn = respond({ topicId: "paint-protection-film", step: "name" }, "hello", []);
  assert.equal(turn.capture?.step, "name");
  assert.match(turn.replies[0].text, /Welcome to SUNKOOL/);
});

test("a bare yes typed when asked for the name is not filed as a name", () => {
  for (const text of ["yes", "Yes, please", "ok", "Sure!"]) {
    const turn = respond({ topicId: "paint-protection-film", step: "name" }, text, []);
    assert.deepEqual(texts(turn), [INVALID_NAME], text);
    assert.equal(turn.capture?.step, "name", text);
  }
  // Names that merely start like a yes are still names.
  const han = respond({ topicId: "paint-protection-film", step: "name" }, "Han Solo", []);
  assert.equal(han.capture?.step, "mobile");
  assert.equal(han.capture?.name, "Han Solo");
});

test("the other languages still ask the yes/no question first", () => {
  const turn = respond(null, "ppf ka rate kya hai", [], "en");
  assert.equal(turn.lang, "hinglish");
  assert.deepEqual(turn.capture, { topicId: "paint-protection-film", step: "consent" });
});

test("with no request open, a typed message is routed as before and nothing is asked", () => {
  const price = respond(null, "what is the price?", []);
  assert.equal(price.capture, null);
  assert.equal(price.replies.length, 1);

  const product = respond(null, "ppf", ["paint-protection-film"]);
  assert.equal(product.capture, null);
  assert.match(product.replies[product.replies.length - 1].text, /already have your request/);
});

test("after the request is filed the chat thanks the visitor and ends", () => {
  const turn = submitted(ppf, "Asha");
  assert.equal(turn.capture, null);
  assert.equal(turn.ended, true);
  assert.equal(turn.replies.length, 1);
  assert.ok(turn.replies[0].text.includes("Asha") && turn.replies[0].text.includes(ppf.label));
});

test("when filing fails, the chat says so and asks again for whatever was wrong", () => {
  const capture: Capture = { topicId: "paint-protection-film", step: "mobile", name: "Asha" };

  const bad = submitFailed(capture, { error: "Please check the highlighted fields.", fieldErrors: { mobile: "Please check this number." } });
  assert.deepEqual(texts(bad), [INVALID_MOBILE]);
  assert.equal(bad.capture?.step, "mobile");

  const name = submitFailed(capture, { error: "Please check the highlighted fields.", fieldErrors: { name: "Enter your full name." } });
  assert.equal(name.capture?.step, "name");
  assert.equal(name.capture?.name, undefined);

  const down = submitFailed(capture, { error: "We couldn't send that just now. Please try again." });
  assert.ok(down.replies[0].text.includes("We couldn't send that just now"));
  assert.ok(down.replies[0].text.includes(WHATSAPP_URL));
  assert.deepEqual(down.capture, capture);
});

// ---- Languages --------------------------------------------------------------------------------------


test("the chat answers in the language the visitor writes in, and follows when they switch", () => {
  // Hinglish in: the product arrives in Hinglish.
  let turn = respond(null, "ppf ka rate kya hai", [], "en");
  assert.equal(turn.lang, "hinglish");
  assert.equal(turn.replies[0].text, MESSAGES.hinglish.topicIntro(ppf.label));
  assert.equal(turn.replies[1].text, MESSAGES.hinglish.descriptions["paint-protection-film"]);

  // Then English: the answer, and the request that is still open, switch too.
  turn = respond(turn.capture, "what is the price?", [], turn.lang);
  assert.equal(turn.lang, "en");
  assert.match(turn.replies[0].text, /exact quote/);
  assert.equal(turn.replies[1].text, MESSAGES.en.picksUp.consent);
  assert.equal(turn.capture?.step, "consent"); // opened in Hinglish, which still asks yes/no first

  // Then Marathi.
  turn = respond(turn.capture, "किंमत किती आहे", [], turn.lang);
  assert.equal(turn.lang, "mr");
  assert.equal(turn.replies[0].text, MESSAGES.mr.price(WHATSAPP_URL));
});

test("a whole request in Hindi: the product, yes, a name, a number", () => {
  let turn = respond(null, "PPF की कीमत क्या है", [], "en");
  assert.equal(turn.lang, "hi");
  assert.equal(turn.replies[1].title, "Paint Protection Film");
  assert.equal(turn.replies[1].text, MESSAGES.hi.descriptions["paint-protection-film"]);

  // The chip is in Hindi too, and tapping it is a yes.
  turn = respond(turn.capture, MESSAGES.hi.ui.yes, [], turn.lang, true);
  assert.deepEqual(texts(turn), [MESSAGES.hi.askName]);

  turn = respond(turn.capture, "मेरा नाम आशा पटेल है", [], turn.lang);
  assert.equal(turn.capture?.name, "आशा पटेल");
  assert.match(turn.replies[0].text, /आशा/);
  assert.doesNotMatch(turn.replies[0].text, /पटेल/);

  turn = respond(turn.capture, "9876543210", [], turn.lang);
  assert.deepEqual(turn.submit, { topic: ppf, name: "आशा पटेल", mobile: "+919876543210" });
  assert.equal(turn.lang, "hi");

  const done = submitted(ppf, "आशा पटेल", turn.lang);
  assert.equal(done.replies[0].text, MESSAGES.hi.leadThanks(ppf.label, "आशा पटेल"));
  assert.equal(done.replies.length, 1);
  assert.equal(done.ended, true);
});

test("the same request in every language reaches the same lead", () => {
  const first: Record<string, { say: string; name: string }> = {
    hi: { say: "PPF की कीमत क्या है", name: "आशा" },
    mr: { say: "PPF ची किंमत किती आहे", name: "आशा" },
    hinglish: { say: "ppf ka rate kya hai", name: "Asha" },
    gu: { say: "PPF ની કિંમત કેટલી છે", name: "આશા" },
    bn: { say: "PPF এর দাম কত", name: "আশা" },
    ta: { say: "PPF விலை என்ன", name: "ஆஷா" },
    te: { say: "PPF ధర ఎంత", name: "ఆశా" },
    kn: { say: "PPF ಬೆಲೆ ಎಷ್ಟು", name: "ಆಶಾ" },
  };
  for (const [lang, { say, name }] of Object.entries(first)) {
    let turn = respond(null, say, [], "en");
    assert.equal(turn.lang, lang, say);
    // Whatever the language, the lead is for the same product (the brand name) and the number is normalised alike.
    assert.equal(turn.capture?.topicId, "paint-protection-film");
    turn = respond(turn.capture, MESSAGES[turn.lang].ui.yes, [], turn.lang, true);
    assert.equal(turn.capture?.step, "name", lang);
    turn = respond(turn.capture, name, [], turn.lang);
    assert.equal(turn.capture?.step, "mobile", lang);
    assert.equal(turn.lang, lang, "a name alone does not change the language");
    turn = respond(turn.capture, "98765 43210", [], turn.lang);
    assert.deepEqual(turn.submit, { topic: ppf, name, mobile: "+919876543210" }, lang);
  }
});

test("a chip never changes the language, even when its label could be read as another", () => {
  for (const lang of ["hi", "mr", "hinglish", "gu", "bn", "ta", "te", "kn"] as const) {
    const turn = respond({ topicId: "paint-protection-film", step: "consent" }, MESSAGES[lang].ui.yes, [], lang, true);
    assert.equal(turn.lang, lang);
    assert.deepEqual(texts(turn), [MESSAGES[lang].askName]);
    const no = respond({ topicId: "paint-protection-film", step: "consent" }, MESSAGES[lang].ui.notNow, [], lang, true);
    assert.equal(no.capture, null, lang);
    assert.ok(no.replies[0].text.includes(WHATSAPP_URL));
  }
});

test("a name or number typed in the visitor's own language and digits is understood", () => {
  const mobile: Capture = { topicId: "paint-protection-film", step: "mobile", name: "आशा" };
  const turn = respond(mobile, "९८७६५ ४३२१०", [], "hi");
  assert.deepEqual(turn.submit, { topic: ppf, name: "आशा", mobile: "+919876543210" });
  assert.equal(turn.lang, "hi", "digits alone are not a switch of language");

  assert.equal(toAsciiDigits("૯૮૭૬૫ ૪૩૨૧૦"), "98765 43210");
  assert.equal(toAsciiDigits("৯৮৭৬৫৪৩২১০"), "9876543210");
  assert.equal(toAsciiDigits("௯௮௭௬௫௪௩௨௧௦"), "9876543210");
  assert.equal(toAsciiDigits("౯౮౭౬౫౪౩౨౧౦"), "9876543210");
  assert.equal(toAsciiDigits("೯೮೭೬೫೪೩೨೧೦"), "9876543210");
  assert.equal(toAsciiDigits("+91 98765 43210"), "+91 98765 43210");
});

test("a question asked in another language part-way through is answered in that language", () => {
  const capture: Capture = { topicId: "paint-protection-film", step: "name" };
  const turn = respond(capture, "कीमत क्या है?", [], "en");
  assert.equal(turn.lang, "hi");
  assert.equal(turn.replies[0].text, MESSAGES.hi.price(WHATSAPP_URL));
  assert.equal(turn.replies[1].text, MESSAGES.hi.picksUp.name);
  assert.deepEqual(turn.capture, capture);
});

test("an unsupported language keeps the chat in its language, with the catch-all", () => {
  const turn = respond(null, "മലയാളം അറിയാമോ", [], "hi");
  assert.equal(turn.lang, "hi");
  assert.equal(turn.replies[0].text, MESSAGES.hi.fallback(WHATSAPP_URL));
});

test("failures are explained in the chat's language", () => {
  const capture: Capture = { topicId: "paint-protection-film", step: "mobile", name: "Asha" };
  assert.equal(submitFailed(capture, { error: "x", reason: "busy" }, "mr").replies[0].text, MESSAGES.mr.failed.busy);
  assert.ok(submitFailed(capture, { error: "x", reason: "unavailable" }, "ta").replies[0].text.startsWith(MESSAGES.ta.failed.unavailable));
  assert.ok(submitFailed(capture, { error: "x" }, "kn").replies[0].text.startsWith(MESSAGES.kn.failed.generic));
  assert.equal(submitFailed(capture, { error: "x", fieldErrors: { mobile: "bad" } }, "gu").replies[0].text, MESSAGES.gu.invalidMobile);
});
