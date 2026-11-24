import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_LANG, detectLanguage, HTML_LANG, isLang, LANGUAGES, type Lang } from "./language";

test("a message is recognised in the language it is written in", () => {
  const cases: [string, Lang][] = [
    // English
    ["what is the price of ppf", "en"],
    ["do you have window tint for my car", "en"],
    ["Can you tell me about the warranty", "en"],
    // Hinglish: Hindi in Latin letters
    ["mujhe ppf chahiye", "hinglish"],
    ["ppf ka rate kya hai", "hinglish"],
    ["kitne ka padega window film", "hinglish"],
    ["mera naam Rahul hai", "hinglish"],
    ["PPF ki kimat kya hai", "hinglish"],
    // Hindi
    ["PPF की कीमत क्या है", "hi"],
    ["मुझे विंडो फिल्म चाहिए", "hi"],
    ["वारंटी कैसे चेक करें", "hi"],
    // Marathi, in Devanagari and in Latin letters
    ["PPF ची किंमत किती आहे", "mr"],
    ["मला गाडीसाठी फिल्म हवी आहे", "mr"],
    ["mala ppf pahije", "mr"],
    ["tumchi kiti kimmat aahe", "mr"],
    // One script each
    ["પીપીએફની કિંમત કેટલી છે", "gu"],
    ["পিপিএফের দাম কত", "bn"],
    ["பிபிஎஃப் விலை என்ன", "ta"],
    ["పీపీఎఫ్ ధర ఎంత", "te"],
    ["ಪಿಪಿಎಫ್ ಬೆಲೆ ಎಷ್ಟು", "kn"],
  ];
  for (const [text, expected] of cases) {
    assert.equal(detectLanguage(text, "en"), expected, text);
    // The same answer whatever language the chat was in before: it is the message that decides.
    assert.equal(detectLanguage(text, "ta"), expected, `${text} (from Tamil)`);
  }
});

test("the language switches the moment the visitor does, and back again", () => {
  let lang: Lang = DEFAULT_LANG;
  for (const [text, expected] of [
    ["PPF की कीमत क्या है", "hi"],
    ["what is the price", "en"],
    ["ppf ka rate kya hai", "hinglish"],
    ["ಪಿಪಿಎಫ್ ಬೆಲೆ ಎಷ್ಟು", "kn"],
    ["do you have tint", "en"],
  ] as const) {
    lang = detectLanguage(text, lang);
    assert.equal(lang, expected, text);
  }
});

test("a message with no clear signal keeps the language the chat is in", () => {
  for (const text of ["ppf", "Yash Domle", "98765 43210", "+91 98765 43210", "ok", "please", "😀", "", "  "]) {
    for (const current of LANGUAGES) {
      assert.equal(detectLanguage(text, current), current, `${JSON.stringify(text)} in ${current}`);
    }
  }
});

test("thanks is English evidence on its own; a bare 'ok' or 'please' is not", () => {
  assert.equal(detectLanguage("thanks", "hi"), "en");
  assert.equal(detectLanguage("thank you so much", "mr"), "en");
  assert.equal(detectLanguage("ok", "hi"), "hi");
  assert.equal(detectLanguage("please", "hi"), "hi");
});

test("Devanagari with no telling word stays Marathi if the chat is Marathi, otherwise Hindi", () => {
  assert.equal(detectLanguage("नमस्ते", "en"), "hi");
  assert.equal(detectLanguage("नमस्ते", "mr"), "mr");
  assert.equal(detectLanguage("नमस्ते", "hinglish"), "hi");
});

test("a script we have no translations for keeps the current language", () => {
  for (const text of ["മലയാളം എന്താണ് വില", "ਕੀਮਤ ਕੀ ਹੈ", "ଦାମ କେତେ", "السعر كم"]) {
    assert.equal(detectLanguage(text, "hi"), "hi", text);
    assert.equal(detectLanguage(text, "en"), "en", text);
  }
});

test("a message in two scripts goes with the one that has most of the letters", () => {
  assert.equal(detectLanguage("PPF की कीमत", "en"), "hi");
  assert.equal(detectLanguage("ppf ka rate kya hai ट", "en"), "hinglish");
});

test("every language has a name for the HTML lang attribute", () => {
  for (const lang of LANGUAGES) {
    assert.ok(HTML_LANG[lang], lang);
    assert.equal(isLang(lang), true);
  }
  assert.equal(HTML_LANG.hinglish, "hi-Latn");
  assert.equal(isLang("xx"), false);
  assert.equal(isLang(undefined), false);
});
