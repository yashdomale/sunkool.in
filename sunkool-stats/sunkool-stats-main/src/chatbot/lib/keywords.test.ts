import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTACT } from "@/lib/contact";
import { routeMessage, WHATSAPP_URL } from "./flow";
import { extractName, NO, YES } from "./keywords";
import { MESSAGES } from "./messages";

function topicOf(text: string): string | null {
  const routed = routeMessage(text);
  return routed.kind === "topic" ? routed.topic.id : null;
}

test("a product is found by its name in any of the languages", () => {
  const cases: [string, string][] = [
    // paint protection film
    ["PPF की कीमत क्या है", "paint-protection-film"],
    ["पेंट प्रोटेक्शन फिल्म चाहिए", "paint-protection-film"],
    ["ppf lagwana hai", "paint-protection-film"],
    ["પીપીએફ વિશે કહો", "paint-protection-film"],
    ["পেইন্ট প্রোটেকশন ফিল্ম", "paint-protection-film"],
    ["பெயிண்ட் பாதுகாப்பு", "paint-protection-film"],
    ["పెయింట్ ప్రొటెక్షన్", "paint-protection-film"],
    ["ಪೇಂಟ್ ರಕ್ಷಣೆ", "paint-protection-film"],
    // window film / heat control
    ["खिड़की के शीशे पर फिल्म", "heat-control-glazing"],
    ["गाडीच्या काचेसाठी टिंट", "heat-control-glazing"],
    ["gaadi ke sheeshe ki garmi", "heat-control-glazing"],
    ["કારની બારી માટે ફિલ્મ", "heat-control-glazing"],
    ["গাড়ির জানালার কাচ", "heat-control-glazing"],
    ["கார் கண்ணாடி வெப்பம்", "heat-control-glazing"],
    ["కారు గాజు వేడి", "heat-control-glazing"],
    ["ಕಾರಿನ ಕಿಟಕಿ ಶಾಖ", "heat-control-glazing"],
    // interior
    ["इंटीरियर प्रोटेक्शन फिल्म", "interior-ppf"],
    ["डॅशबोर्ड साठी फिल्म", "interior-ppf"],
    ["ઇન્ટિરિયર ફિલ્મ", "interior-ppf"],
    ["ইন্টেরিয়র ফিল্ম", "interior-ppf"],
    ["இன்டீரியர் படலம்", "interior-ppf"],
    ["ఇంటీరియర్ ఫిల్మ్", "interior-ppf"],
    ["ಇಂಟೀರಿಯರ್ ಫಿಲ್ಮ್", "interior-ppf"],
    // ultra edge
    ["अल्ट्रा एज फिल्म", "ultra-edge"],
    ["અલ્ટ્રા એજ", "ultra-edge"],
    ["আল্ট্রা এজ", "ultra-edge"],
    ["அல்ட்ரா எட்ஜ்", "ultra-edge"],
    ["అల్ట్రా ఎడ్జ్", "ultra-edge"],
    ["ಅಲ್ಟ್ರಾ ಎಡ್ಜ್", "ultra-edge"],
    // warranty
    ["मुझे वारंटी चेक करनी है", "warranty-support"],
    ["वॉरंटीची तक्रार", "warranty-support"],
    ["વોરંટી રજિસ્ટર કરવી છે", "warranty-support"],
    ["ওয়ারেন্টি অভিযোগ", "warranty-support"],
    ["வாரண்டி புகார்", "warranty-support"],
    ["వారంటీ ఫిర్యాదు", "warranty-support"],
    ["ವಾರಂಟಿ ದೂರು", "warranty-support"],
    ["warranty ki shikayat", "warranty-support"],
  ];
  for (const [text, expected] of cases) assert.equal(topicOf(text), expected, text);
});

test("the more specific product still wins in other languages", () => {
  // "protection film" alone is paint protection film; with "interior" in front it is the interior film.
  assert.equal(topicOf("इंटीरियर प्रोटेक्शन फिल्म"), "interior-ppf");
  assert.equal(topicOf("ppf की वारंटी"), "warranty-support");
});

test("short words that begin longer, unrelated ones do not trigger a product", () => {
  // "एजेंट" (agent) is not Edge; "दरवाज़ा" (door) is not a price.
  assert.equal(topicOf("एजेंट से बात कराइए"), null);
  assert.equal(routeMessage("दरवाज़ा").kind === "reply" && (routeMessage("दरवाज़ा") as { understood: boolean }).understood, false);
});

test("price questions are answered in every language with no figure and the team's quote", () => {
  for (const text of [
    "कितना खर्च आएगा", "kitna kharcha hoga", "किती खर्च येईल", "કેટલો ખર્ચ થશે", "কত খরচ হবে", "எவ்வளவு ஆகும்", "ఎంత ఖర్చు", "ಎಷ್ಟು ಖರ್ಚು",
    "daam batao", "किंमत सांगा", "सवलत मिळेल का",
  ]) {
    const routed = routeMessage(text, "hi");
    assert.equal(routed.kind, "reply", text);
    if (routed.kind === "reply") {
      assert.equal(routed.understood, true, text);
      assert.equal(routed.text, MESSAGES.hi.price(WHATSAPP_URL), text);
    }
  }
});

test("contact questions get the team's real number in every language", () => {
  for (const text of ["आपका नंबर क्या है", "डीलर कहाँ है", "मला संपर्क करायचा आहे", "dealer kahan hai", "ફોન નંબર આપો", "যোগাযোগ করতে চাই", "தொடர்பு எண் என்ன", "డీలర్ ఎక్కడ", "ಸಂಪರ್ಕ ಸಂಖ್ಯೆ"]) {
    const routed = routeMessage(text, "mr");
    assert.equal(routed.kind, "reply", text);
    if (routed.kind === "reply") {
      assert.ok(routed.text.includes(CONTACT.whatsappDisplay) && routed.text.includes(WHATSAPP_URL), text);
    }
  }
});

test("thanks and greetings are understood in every language and answered in the chosen one", () => {
  for (const text of ["धन्यवाद", "shukriya", "நன்றி", "ధన్యవాదాలు", "ಧನ್ಯವಾದ", "આભાર", "ধন্যবাদ"]) {
    const routed = routeMessage(text, "ta");
    assert.ok(routed.kind === "reply" && routed.text === MESSAGES.ta.thanks, text);
  }
  for (const text of ["नमस्ते", "नमस्कार", "namaste", "வணக்கம்", "నమస్కారం", "ನಮಸ್ಕಾರ", "નમસ્તે", "নমস্কার"]) {
    const routed = routeMessage(text, "te");
    assert.ok(routed.kind === "reply" && routed.text === MESSAGES.te.hello, text);
  }
});

test("a language we do not answer in, or nonsense, gets the catch-all in the chat's language", () => {
  for (const text of ["മലയാളം", "ਪੰਜਾਬੀ", "zzz", "😀"]) {
    const routed = routeMessage(text, "kn");
    assert.ok(routed.kind === "reply" && !routed.understood && routed.text === MESSAGES.kn.fallback(WHATSAPP_URL), text);
  }
});

test("yes and no are understood in every language, and are not mistaken for each other", () => {
  const yes = ["Yes please", "haan", "Haan ji", "zaroor", "ok", "okay", "हाँ", "जी हाँ", "ज़रूर", "जरूर", "होय", "हो, कृपया", "હા", "হ্যাঁ", "ஆம்", "అవును", "ಹೌದು"];
  const no = ["no", "not now", "nahi", "abhi nahi", "नहीं", "अभी नहीं", "नाही", "आत्ता नको", "ના", "না", "வேண்டாம்", "వద్దు", "ಬೇಡ"];
  for (const text of yes) assert.ok(YES.test(text) && !NO.test(text), text);
  for (const text of no) assert.ok(NO.test(text) && !YES.test(text), text);
});

test("a word that merely starts like a yes or a no is neither", () => {
  for (const text of ["Nora", "Noah", "Nandini", "नमन", "નામ", "નહીંતર", "हालत", "Okayama", "Hanuman"]) {
    assert.equal(YES.test(text), false, `${text} is not a yes`);
    assert.equal(NO.test(text), false, `${text} is not a no`);
  }
});

test("the same letter typed as one character or as two is the same word", () => {
  // "ज़" is U+095B, or ज (U+091C) followed by the nukta (U+093C): keyboards produce either.
  const joined = "ज़रूर";
  const split = "ज़रूर";
  assert.notEqual(joined, split);
  assert.ok(YES.test(joined.normalize("NFC")) && YES.test(split.normalize("NFC")));
  assert.equal(extractName("नाम ज़रूर").length > 0, true);
});

test("'my name is …' is taken off a name, in every language, and a plain name is left alone", () => {
  const cases: [string, string][] = [
    ["my name is Asha Patel", "Asha Patel"],
    ["I am Asha Patel", "Asha Patel"],
    ["I'm Asha", "Asha"],
    ["mera naam Rahul hai", "Rahul"],
    ["main Rahul hoon", "Rahul"],
    ["मेरा नाम राहुल है", "राहुल"],
    ["मैं राहुल हूँ", "राहुल"],
    ["माझे नाव राहुल आहे", "राहुल"],
    ["मी राहुल", "राहुल"],
    ["મારું નામ રાહુલ છે", "રાહુલ"],
    ["আমার নাম রাহুল", "রাহুল"],
    ["என் பெயர் ராகுல்", "ராகுல்"],
    ["నా పేరు రాహుల్", "రాహుల్"],
    ["ನನ್ನ ಹೆಸರು ರಾಹುಲ್", "ರಾಹುಲ್"],
    // Plain names, including ones that begin like a lead-in word
    ["Asha Patel", "Asha Patel"],
    ["Imran", "Imran"],
    ["Namrata", "Namrata"],
    ["Maitri Shah", "Maitri Shah"],
  ];
  for (const [text, expected] of cases) assert.equal(extractName(text), expected, text);
  // Nothing left after the lead-in: the original text, so the name check can still say what is wrong.
  assert.equal(extractName("my name is"), "my name is");
});
