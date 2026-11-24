// The words the chat listens for, in every language it answers in. Matching is by keyword, not by
// understanding: a visitor may write "PPF की कीमत क्या है", "ppf ka rate kya hai" or "PPF ಬೆಲೆ ಎಷ್ಟು" and get the
// same product or price answer. Each rule has two halves:
//   - Latin letters (English, Hinglish, Marathi): matched with word boundaries, as before;
//   - other scripts: matched anywhere inside a word, because Marathi, Gujarati, Tamil, Telugu and Kannada
//     attach endings to the word ("वारंटीचे", "வாரண்டியை"). A few short words that begin longer, unrelated words
//     carry an explicit "not followed by another letter of the script" guard.
// All patterns are tested against lower-cased text. Letters such as "ज़" can be typed as one character or as
// two (a letter and a nukta), so both the patterns and the visitor's text are put in the same form (NFC)
// first. Pure and dependency-free (client bundle).
import type { ChatTopic } from "./topics";

function rule(latin: string, native: string): RegExp {
  return new RegExp(`${latin}|${native}`.normalize("NFC"));
}

/** Checked in this order: the first rule that matches wins, so the more specific words come first. */
export const TOPIC_RULES: { id: ChatTopic["id"]; pattern: RegExp }[] = [
  {
    id: "warranty-support",
    pattern: rule(
      "warrant|support|claim|register|complain|\\bqr\\b|after[- ]?sales|guarant|gurant|shikayat",
      "वारंटी|वारन्टी|वॉरंटी|वॉरन्टी|वारंटि|गारंटी|हमी|शिकायत|सहायता|सपोर्ट|तक्रार|रजिस्टर|पंजीकरण|नोंदणी|" +
        "વોરંટી|વૉરંટી|વોરન્ટી|ગેરંટી|ફરિયાદ|રજિસ્ટર|" +
        "ওয়ারেন্টি|ওয়ারেণ্টি|গ্যারান্টি|অভিযোগ|" +
        "உத்தரவாதம்|வாரண்டி|வாரன்டி|புகார்|" +
        "వారంటీ|హామీ|ఫిర్యాదు|" +
        "ವಾರಂಟಿ|ಖಾತರಿ|ದೂರು"
    ),
  },
  {
    id: "interior-ppf",
    pattern: rule(
      "interior|cabin|dashboard",
      "इंटीरियर|इंटिरियर|इन्टीरियर|केबिन|डैशबोर्ड|डॅशबोर्ड|आतील|" +
        "ઇન્ટિરિયર|ઈન્ટીરિયર|ડેશબોર્ડ|" +
        "ইন্টেরিয়র|ইন্টিরিয়র|ড্যাশবোর্ড|" +
        "உட்புற|இன்டீரியர்|இண்டீரியர்|டாஷ்|டேஷ்|" +
        "ఇంటీరియర్|డాష్|డ్యాష్|" +
        "ಇಂಟೀರಿಯರ್|ಡ್ಯಾಶ್|ಡ್ಯಾಷ್"
    ),
  },
  {
    id: "ultra-edge",
    pattern: rule(
      "\\bultra\\b|\\bedge\\b|prism|titanium|metal|reflective",
      "अल्ट्रा|एज(?![ऀ-ॿ])|टाइटेनियम|टाइटैनियम|टायटॅनियम|प्रिज़्म|प्रिझम|" +
        "અલ્ટ્રા|એજ(?![઀-૿])|" +
        "আল্ট্রা|এজ(?![ঀ-৿])|" +
        "அல்ட்ரா|எட்ஜ்|" +
        "అల్ట్రా|ఎడ్జ్|" +
        "ಅಲ್ಟ್ರಾ|ಎಡ್ಜ್"
    ),
  },
  {
    id: "paint-protection-film",
    pattern: rule(
      "\\bppf\\b|paint|protection film|self[- ]?heal|scratch|stone ?chip|gloss",
      "पीपीएफ|पेंट|पेन्ट|प्रोटेक्शन|स्क्रैच|स्क्रॅच|खरोंच|ओरखडे|" +
        "પીપીએફ|પેઇન્ટ|પેન્ટ|પ્રોટેક્શન|" +
        "পিপিএফ|পেইন্ট|পেন্ট|প্রোটেকশন|" +
        "பிபிஎஃப்|பிபிஎப்|பெயிண்ட்|" +
        "పీపీఎఫ్|పెయింట్|" +
        "ಪಿಪಿಎಫ್|ಪೇಂಟ್"
    ),
  },
  {
    id: "heat-control-glazing",
    pattern: rule(
      "window|tint|film|glaz|heat|ceramic|glass|sapphire|onyx|emerald|diamond|graphite|topaz|hd70|sk70|sk50|sk35|ch70|gy70|sunroof|moonroof|sheesh|kaanch|khidki|garmi|dhoop|dhup",
      "खिड़की|खिडकी|शीशा|शीशे|कांच|काँच|काच|टिंट|फिल्म|फ़िल्म|विंडो|गर्मी|गरमी|उष्णता|धूप|सनरूफ|मूनरूफ|" +
        "બારી|કાચ|ટિન્ટ|ફિલ્મ|ગરમી|" +
        "জানালা|কাচ|টিন্ট|ফিল্ম|গরম|তাপ|" +
        "ஜன்னல்|கண்ணாடி|டின்ட்|பிலிம்|வெப்பம்|சன்ரூஃப்|" +
        "కిటికీ|గాజు|టింట్|ఫిల్మ్|వేడి|" +
        "ಕಿಟಕಿ|ಗಾಜು|ಟಿಂಟ್|ಫಿಲ್ಮ್|ಶಾಖ"
    ),
  },
];

export const GREETING = rule(
  "^\\s*(hi+|hello+|hey+|hola|namaste|namaskar|namaskara|pranam|ram ram|vanakkam|kem cho|good (morning|afternoon|evening))\\b",
  "^\\s*(नमस्ते|नमस्कार|हेलो|हैलो|हॅलो|हाय|प्रणाम|राम राम|सुप्रभात|शुभ प्रभात|શુભ સવાર|નમસ્તે|નમસ્કાર|કેમ છો|હેલો|" +
    "নমস্কার|হ্যালো|হাই|শুভ সকাল|வணக்கம்|ஹலோ|నమస్కారం|నమస్తే|హలో|ನಮಸ್ಕಾರ|ಹಲೋ)"
);

export const THANKS = rule(
  "\\b(thanks|thank you|thx|shukriya|dhanyavad|dhanyawad|aabhar|thanku)\\b",
  "धन्यवाद|शुक्रिया|आभार|थैंक|थँक|આભાર|ધન્યવાદ|ধন্যবাদ|থ্যাংক|நன்றி|ధన్యవాద|థాంక్స్|ಧನ್ಯವಾದ|ಥ್ಯಾಂಕ್ಸ್"
);

export const PRICE = rule(
  "\\b(price|prices|pricing|cost|rate|rates|quote|quotation|how much|discount|offer|budget|kimat|keemat|qeemat|kimmat|daam|bhav|bhaav|kitna|kitne|kitni|kiti|paisa|paise|kharch|kharcha|chhut|chhoot)\\b|₹|\\brs\\b",
  "कीमत|क़ीमत|किमत|दाम|भाव(?![ऀ-ॿ])|रेट(?![ऀ-ॿ])|कितना|कितने|कितनी|मूल्य|खर्च|कोटेशन|छूट|डिस्काउंट|ऑफर|बजट|किंमत|किती|दर(?![ऀ-ॿ])|सवलत|" +
    "કિંમત|ભાવ|કેટલો|કેટલું|કેટલા|કેટલી|ડિસ્કાઉન્ટ|" +
    "দাম|মূল্য|কত|ছাড়|খরচ|" +
    "விலை|எவ்வளவு|கட்டணம்|தள்ளுபடி|" +
    "ధర|ఎంత|ఖరీదు|డిస్కౌంట్|" +
    "ಬೆಲೆ|ಎಷ್ಟು|ದರ|ರಿಯಾಯಿತಿ"
);

export const CONTACT_WORDS = rule(
  "\\b(contact|call|phone|number|whatsapp|email|address|location|visit|dealer|installer|near me|nearest|store|showroom|sampark|kahan|kahaan|kidhar|nazdeek|najdik|nambar)\\b",
  "संपर्क|सम्पर्क|कॉल|फोन|फ़ोन|नंबर|नम्बर|व्हाट्सएप|व्हाट्सऐप|व्हॉट्सअॅप|व्हॉट्सॲप|ईमेल|पते|पत्ता|एड्रेस|क्रमांक|डीलर|दुकान|शोरूम|नज़दीक|नजदीक|जवळ|इंस्टॉल|इन्स्टॉल|" +
    "સંપર્ક|કોલ|ફોન|નંબર|સરનામું|ડીલર|નજીક|" +
    "যোগাযোগ|কল|ফোন|নম্বর|ঠিকানা|ডিলার|কাছে|" +
    "தொடர்பு|அழைப்பு|தொலைபேசி|முகவரி|டீலர்|அருகில்|" +
    "సంప్రదించ|కాల్|ఫోన్|నంబర్|చిరునామా|డీలర్|దగ్గర|" +
    "ಸಂಪರ್ಕ|ಕರೆ|ಫೋನ್|ಸಂಖ್ಯೆ|ವಿಳಾಸ|ಡೀಲರ್|ಹತ್ತಿರ"
);

// A "yes" or a "no" at the start of a message. The chips' own labels (in every language) are among them,
// so tapping a chip and typing the same words are the same thing (conversation.test.ts checks every label).
const END = "(?![\\p{L}\\p{M}])";

function answer(alternatives: string): RegExp {
  return new RegExp(`^\\s*(?:${alternatives})${END}`.normalize("NFC"), "iu");
}

export const YES = answer(
  "yes|yeah|yep|yup|ya|sure|ok|okay|please|of course|go ahead|definitely|sounds good|" +
    "haan|han|haa|ji haan|ji|zaroor|zarur|bilkul|theek hai|thik hai|kar do|karo|chalega|" +
    "हाँ|हां|जी हाँ|जी|ज़रूर|जरूर|बिल्कुल|ठीक है|कर दो|करो|चलेगा|" +
    "hoy|ho|nakki|nakkich|होय|हो|नक्की|नक्कीच|चालेल|ठीक आहे|" +
    "હા|જરૂર|ચોક્કસ|બરાબર|ઠીક છે|" +
    "হ্যাঁ|হাঁ|অবশ্যই|ঠিক আছে|করুন|" +
    "ஆம்|சரி|நிச்சயமாக|ஓகே|தயவுசெய்து|" +
    "అవును|సరే|తప్పకుండా|ఓకే|దయచేసి|" +
    "ಹೌದು|ಸರಿ|ಖಂಡಿತ|ಓಕೆ|ದಯವಿಟ್ಟು"
);

export const NO = answer(
  "no|nope|nah|not now|not really|later|maybe later|skip|cancel|stop|" +
    "nahi|nahin|nai|abhi nahi|baad mein|rehne do|rahne do|mat karo|" +
    "नहीं|नही|अभी नहीं|बाद में|रहने दो|मत करो|" +
    "नाही|नको|आत्ता नको|नंतर|राहू द्या|" +
    "ના|નહીં|હમણાં નહીં|પછી|" +
    "না|এখন নয়|পরে|থাক|" +
    "வேண்டாம்|இல்லை|இப்போது வேண்டாம்|பிறகு|" +
    "వద్దు|లేదు|ఇప్పుడు వద్దు|తర్వాత|" +
    "ಬೇಡ|ಇಲ್ಲ|ಈಗ ಬೇಡ|ನಂತರ"
);

// "My name is Asha", "mera naam Asha hai", "मेरा नाम आशा है", "माझे नाव आशा आहे", "என் பெயர் ஆஷா"...
// Only the phrase around the name is stripped; what is left still goes through the same name check.
const NAME_LEAD = new RegExp(
  (
    "^\\s*(?:my name is|my name's|name is|i am|i'm|im|this is|it's|its|mera naam|mera nam|meraa naam|mera name|naam|main|mai|majha naav|maza naav|" +
    "मेरा नाम|मेरा नाम है|नाम|मैं|मै|माझं नाव|माझे नाव|माझं नांव|माझे नांव|नाव|मी|" +
    "મારું નામ|મારૂ નામ|નામ|હું|আমার নাম|নাম|আমি|என் பெயர்|பெயர்|நான்|నా పేరు|పేరు|నేను|ನನ್ನ ಹೆಸರು|ಹೆಸರು|ನಾನು)(?![\\p{L}\\p{M}])\\s*"
  ).normalize("NFC"),
  "iu"
);
const NAME_TAIL = new RegExp(
  "\\s+(?:hai|hain|hoon|hun|hu|है|हूँ|हूं|हैं|आहे|છે|છું|ஆகும்|ఉంది|ಆಗಿದೆ|please|pls)\\s*[.!]*$".normalize("NFC"),
  "iu"
);

/** What a visitor typed with the "my name is" wrapper taken off; the text itself when there is none. */
export function extractName(raw: string): string {
  const text = raw.normalize("NFC");
  const stripped = text.replace(NAME_LEAD, "").replace(NAME_TAIL, "").trim();
  return stripped || text;
}
