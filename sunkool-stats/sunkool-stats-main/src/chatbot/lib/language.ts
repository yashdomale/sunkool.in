// Which language a visitor is writing in, worked out from the message itself: first by script (Devanagari,
// Gujarati, Bengali, Tamil, Telugu, Kannada or Latin letters), then, within a script, by a few hundred
// common words. There is no model, no network call and no library; it is a few counts over the text.
// The rule is "switch only on evidence": a message with no clear signal (a name, a number, "ok", a
// product word like "ppf") keeps the language the chat is already in. Pure, so it runs in the browser
// and the unit tests run it as is.

export const LANGUAGES = ["en", "hi", "hinglish", "mr", "gu", "bn", "ta", "te", "kn"] as const;
export type Lang = (typeof LANGUAGES)[number];

export const DEFAULT_LANG: Lang = "en";

/** The value for the HTML `lang` attribute, so screen readers and browsers pick the right voice and font. */
export const HTML_LANG: Record<Lang, string> = {
  en: "en",
  hi: "hi",
  hinglish: "hi-Latn",
  mr: "mr",
  gu: "gu",
  bn: "bn",
  ta: "ta",
  te: "te",
  kn: "kn",
};

export function isLang(value: unknown): value is Lang {
  return (LANGUAGES as readonly unknown[]).includes(value);
}

const SCRIPTS = {
  devanagari: /\p{Script=Devanagari}/gu,
  gu: /\p{Script=Gujarati}/gu,
  bn: /\p{Script=Bengali}/gu,
  ta: /\p{Script=Tamil}/gu,
  te: /\p{Script=Telugu}/gu,
  kn: /\p{Script=Kannada}/gu,
  latin: /\p{Script=Latin}/gu,
} as const;

function count(text: string, pattern: RegExp): number {
  return (text.match(pattern) ?? []).length;
}

/** The word lists and the visitor's text are both put in NFC, so "ज़" typed either way is the same word. */
function words(list: string): Set<string> {
  return new Set(list.split(/\s+/).filter(Boolean).map((word) => word.normalize("NFC")));
}

function tokens(text: string): string[] {
  return text.normalize("NFC").toLowerCase().split(/[^\p{L}\p{M}]+/u).filter(Boolean);
}

function tally(words: string[], set: ReadonlySet<string>): number {
  return words.reduce((sum, word) => sum + (set.has(word) ? 1 : 0), 0);
}

// Hindi written in Latin letters. Only words that are not also English ("to", "do", "me", "main" are left out).
const HINGLISH = words(
  `mujhe mujhko mera meri mere hamara hamari hamare tumhara tumhari aapka aapki aapke apka apki apke aap tum hum
   kya kyu kyun kyon kaise kaisa kaisi kab kahan kahaan kaun kitna kitne kitni kidhar hai hain hoon tha thi hoga
   hogi honge nahi nahin haan theek thik achha accha acha chahiye chahie chahta chahti chahte chahenge batao
   bataiye bataye bataiyega dijiye dijiye karo karna karni karwana karwani lagwana lagwani lagana lagani lagega
   lagegi milega milegi milta ke ka ki ko se mein mei par pe liye lie wala wali wale aur lekin magar toh bhi
   bahut bohot thoda zyada jyada kam sasta mehenga gaadi gadi gaari kimat keemat qeemat daam bhav bhaav paisa
   shukriya dhanyavad dhanyawad namaste kripya krupya jaankari jankari madad sahi galat abhi baad pehle pehla
   kal aaj ghar shehar shahar sakta sakti sakte chaliye zaroor zarur bilkul`
);

// Marathi in Latin letters. Words shared with Hindi ("nahi", "gaadi", "dhanyavad", "namaskar") are left out so
// they do not tip the count.
const MARATHI_ROMAN = words(
  `mala malaa majha majhi majhe mazi maza maze majhya mazya tumhi tumhala tumchi tumcha tumche tumchya aamhi
   amhi aamhala amhala aapan aahe ahe aahet ahet aahes ahes kay kaay kuthe kuthun kasa kashi kase kiti kadhi kon
   pahije pahijet hava havi havay nako ani aani mhanje sang sanga saanga dya dyaa kara karaa karayche
   karaycha karaychi gheu ghyaycha milel hoil honar zala jhala zali jhali hoy hoyy barobar chaan chhan khup jara
   udya aata nantar mi mee`
);

// Function words that mark a sentence as English. The strong ones count double, so a short question
// ("what price", "thanks") is enough, while "ok" or "please" alone is not.
const ENGLISH_STRONG = words("what how which where when why can could would should tell want need thanks thank");
const ENGLISH = words(
  `the is are was were be who will do does did you your i me my we our it this that these those show give about
   for of in on at with from to and or if please have has there any some much many`
);

// Devanagari is Hindi or Marathi. These common words tell them apart.
const HINDI_DEVA = words(
  `है हैं हूँ हूं नहीं नही क्या मुझे मुझको मेरा मेरी मेरे आप आपका आपकी आपके चाहिए चाहिये चाहता चाहती कीजिए
   कीजिये कितना कितने कितनी कैसे कैसा कहाँ कहां कब कौन बताइए बताइये बताओ बताएं और लेकिन के को में से पर लिए
   गाड़ी कीमत हाँ हां जी सकते सकता सकती करें करो मिलेगा मिलेगी यह वह हम अभी बहुत थोड़ा`
);
const MARATHI_DEVA = words(
  `आहे आहेत आहात आहेस नाही काय मला माझा माझी माझे माझ्या तुम्ही तुमचा तुमची तुमचे तुमच्या पाहिजे हवे हवी हवा
   हवेत किती कुठे कसे कसा कशी कधी कोण सांगा सांगू द्या आणि पण होय हो मी आम्ही आपण गाडी किंमत मिळेल मिळते
   करायचे करायचा करायची घ्यायचे खूप थोडे आता नंतर म्हणजे च्या मध्ये साठी`
);

function latinLanguage(words: string[], current: Lang): Lang {
  const hinglish = tally(words, HINGLISH);
  const marathi = tally(words, MARATHI_ROMAN);
  const english = words.reduce((sum, word) => sum + (ENGLISH_STRONG.has(word) ? 2 : ENGLISH.has(word) ? 1 : 0), 0);

  if (hinglish === 0 && marathi === 0) {
    // English needs two points of evidence, or one in a sentence of three words or more.
    return english >= 2 || (english >= 1 && words.length >= 3) ? "en" : current;
  }
  if (english > hinglish && english > marathi) return "en";
  // Tie goes to Hinglish: far more people write Hindi than Marathi in Latin letters.
  return marathi > hinglish ? "mr" : "hinglish";
}

function devanagariLanguage(words: string[], current: Lang): Lang {
  const hindi = tally(words, HINDI_DEVA);
  const marathi = tally(words, MARATHI_DEVA);
  if (marathi > hindi) return "mr";
  if (hindi > marathi) return "hi";
  // No evidence either way: stay with Marathi if that is what the chat is in, otherwise Hindi.
  return current === "mr" ? "mr" : "hi";
}

/**
 * The language to answer a message in: the one it is written in when that is clear, otherwise `current`
 * (the language the chat is already in). Scripts we have no translations for (Gurmukhi, Malayalam, Odia,
 * Arabic...) also keep `current`.
 */
export function detectLanguage(raw: string, current: Lang = DEFAULT_LANG): Lang {
  // Digits belong to every language ("९८७६५ ४३२१०" is a phone number, not a switch to Hindi).
  const text = raw.replace(/\p{Nd}/gu, " ");
  const counts = {
    devanagari: count(text, SCRIPTS.devanagari),
    gu: count(text, SCRIPTS.gu),
    bn: count(text, SCRIPTS.bn),
    ta: count(text, SCRIPTS.ta),
    te: count(text, SCRIPTS.te),
    kn: count(text, SCRIPTS.kn),
    latin: count(text, SCRIPTS.latin),
  };
  const [script, size] = (Object.entries(counts) as [keyof typeof counts, number][]).reduce((best, entry) => (entry[1] > best[1] ? entry : best));
  if (size < 2) return current;

  const words = tokens(text);
  if (script === "latin") return latinLanguage(words, current);
  if (script === "devanagari") return devanagariLanguage(words, current);
  return script;
}
