import type { Messages } from "./types";

// Hindi written in Latin letters, the way most customers actually type it. Product and technical terms
// stay in English (as they do in everyday Hinglish); the assistant's own lines are gender-neutral.
export const hinglish: Messages = {
  name: "Hinglish",

  topicIntro: (label) => `Bahut badhiya! 😊 Chaliye, ${label} ke baare mein ek chhoti si jaankari dekhte hain.`,
  warrantyIntro: "Bilkul! 😊 Dekhiye hamari warranty aur support kaise kaam karte hain.",
  seeRange: (url) => `Poori range dekhein: ${url}`,
  checkWarranty: (url) => `Apni warranty check ya register karein: ${url}`,
  descriptions: {
    "heat-control-glazing": "Clarity, comfort aur signal-friendly performance ke liye bani nano-ceramic heat rejection films.",
    "ultra-edge":
      "Sputtered silver Ultra, titanium-nitride Edge, Prism nano multilayer PET, aur sunroof & moonroof ke liye khaas films — garmi ko lagataar reflect karke bahar rakhne ke liye.",
    "paint-protection-film":
      "High-performance aliphatic polyurethane PPF — self-healing, UV-resistant aur lagbhag invisible protection, jo aapki gaadi ko high-gloss finish deta hai.",
    "interior-ppf":
      "Premium interior protection film — 195 micron thickness, 99% UV protection, scratch resistance, anti-yellow coating aur stain resistance.",
    "warranty-support":
      "Har SUNKOOL installation ke saath comprehensive coverage milta hai. Apni maujooda warranty check karein ya kuch hi minute mein nayi warranty register karein.",
  },

  askForDetails: (label) =>
    `Kya aap chahenge ki hamari team ${label} ke baare mein aapse contact kare? Bas ek minute lagega — mujhe sirf aapka naam aur mobile number chahiye.`,
  alreadyHaveRequest: (label) =>
    `${label} ke liye aapki request hamare paas pehle se hai, hamari team jaldi hi aapse contact karegi. Kya aap kuch aur jaanna chahenge?`,
  askName: "Badhiya! 😊 Kripya apna naam bataiye.",
  askMobile: (first) => `Aapse milkar achha laga, ${first}! Hamari team aapko kaun se mobile number par call kare?`,
  invalidName: "Sorry, mujhe yeh samajh nahi aaya. Kripya sirf apna naam likhiye (sirf letters mein).",
  invalidMobile:
    "Hmm, yeh number sahi nahi lag raha. Kripya apna 10-digit mobile number likhiye, jaise 98765 43210. (International number ke liye country code bhi likhein.)",
  picksUp: {
    consent: "Jab aap ready hon, bas bata dijiye ki kya aap chahte hain ki hamari team aapse contact kare. 😊",
    name: "Jab aap ready hon, kripya apna naam bataiye taaki hamari team ko pata rahe ki kisse baat karni hai.",
    mobile: "Jab aap ready hon, bataiye ki hamari team aapko kaun se mobile number par call kare.",
  },
  leadThanks: (label, name) => `Dhanyavad, ${name}! ✅ Maine ${label} ke liye aapki request hamari team ko bhej di hai, woh jaldi hi aapse contact karenge.`,
  anythingElse: "Kya aapko kisi aur cheez ke baare mein jaanna hai? Aap neeche se doosra product bhi dekh sakte hain.",
  dismiss: (url) => `Koi baat nahi! 😊 Neeche se koi doosra product chuniye, ya jab chahein hamein WhatsApp par message kijiye: ${url}`,
  failed: {
    generic: "Hum abhi yeh bhej nahi paaye. Kripya dobara try karein, ya hamein WhatsApp par message karein.",
    busy: "Is number se hamein pehle hi kai requests mil chuki hain. Hamari team jaldi hi aapse contact karegi.",
    unavailable: "Call-back requests abhi available nahi hain. Kripya hamein WhatsApp par message karein.",
  },

  price: (url) =>
    `Achha sawaal! Price aapki gaadi aur chuni hui film par depend karta hai, isliye hamari team aapke liye exact quote taiyaar karti hai. Neeche se koi product chuniye aur apna naam aur mobile number dijiye, ya hamein WhatsApp par message kijiye: ${url}`,
  responseTime: "WhatsApp par aam taur par 2 ghante ke andar jawab mil jaata hai.",
  contact: (display, url, page, responseTime) =>
    `Zaroor! Aap hamari team se WhatsApp ya phone par ${display} (${url}) par contact kar sakte hain. ${responseTime} Contact ke aur tareeke: ${page}`,
  thanks: "Aapka swagat hai! 😊 Kya aap kuch aur jaanna chahenge?",
  hello: "Hello! 👋 SUNKOOL mein aapka swagat hai. Aap kis product ke baare mein jaanna chahenge?",
  fallback: (url) =>
    `Sorry, yeh mujhe samajh nahi aaya! Hamare products aur warranty ki jaankari dene ke liye main yahan hoon, isliye neeche se koi ek chuniye, ya kisi aur baat ke liye hamari team ko WhatsApp par message kijiye: ${url}`,

  ui: {
    subtitle: "Aapka Premium Protection Advisor",
    typing: "typing…",
    thinking: "Soch rahe hain…",
    exploreAnother: "Koi aur product dekhein",
    yes: "Haan, zaroor",
    notNow: "Abhi nahi",
    placeholder: {
      general: "Films, PPF ya warranty ke baare mein poochhein…",
      name: "Apna naam likhiye…",
      mobile: "Apna mobile number likhiye…",
    },
    footer: { before: "Quote ya zaroori madad ke liye, ", link: "hamein WhatsApp par message karein", after: "." },
    send: "Message bhejein",
    newChat: "Nayi chat shuru karein",
    minimise: "Chat chhoti karein",
    close: "Chat band karein",
    yourMessage: "Aapka message",
  },
};
