import { CONTACT } from "@/lib/contact";
import { INTERIOR_PROTECTION_FILM, PPF, ULTRA_EDGE, WINDOW_FILM } from "@/lib/products";
import { WARRANTY_PAGE } from "@/lib/warranty-content";
import { CHAT_SUBTITLE } from "../topics";
import type { Messages } from "./types";

export const en: Messages = {
  name: "English",

  topicIntro: (label) => `Great choice! 😊 Here's a quick look at ${label}.`,
  warrantyIntro: "Of course! 😊 Here's how our warranty and support work.",
  seeRange: (url) => `See the full range: ${url}`,
  checkWarranty: (url) => `Check or register your warranty: ${url}`,
  // The site's own words, never a copy: the English chat cannot drift from the pages.
  descriptions: {
    "heat-control-glazing": WINDOW_FILM.description,
    "ultra-edge": ULTRA_EDGE.description,
    "paint-protection-film": PPF.description,
    "interior-ppf": INTERIOR_PROTECTION_FILM.description,
    "warranty-support": WARRANTY_PAGE.description,
  },

  // English asks for the name straight away (see DIRECT_ASK in conversation.ts); the other languages still ask the yes/no question first.
  askForDetails: (label) => `May I have your name, please, so our team can get in touch with you about ${label}?`,
  alreadyHaveRequest: (label) =>
    `We already have your request for ${label}, so our team will contact you shortly. Anything else you would like to know about?`,
  askName: "Wonderful! 😊 May I have your name, please?",
  askMobile: (first) => `Nice to meet you, ${first}! What's the best mobile number for our team to reach you on?`,
  invalidName: "Sorry, I didn't quite catch that. Could you type just your name, using letters only?",
  invalidMobile:
    "Hmm, that doesn't look like a valid number. Could you type your 10-digit mobile number, like 98765 43210? (Add the country code for an international number.)",
  picksUp: {
    consent: "Whenever you're ready, just let me know if you'd like our team to get in touch. 😊",
    name: "Whenever you're ready, may I have your name so our team knows who to ask for?",
    mobile: "Whenever you're ready, what's the best mobile number for our team to reach you on?",
  },
  leadThanks: (label, name) => `Thank you, ${name}! ✅ I've passed your request for ${label} to our team, and they'll contact you shortly.`,
  anythingElse: "Is there anything else I can help you with? You can explore another product below.",
  dismiss: (url) => `No problem at all! 😊 Pick another product below, or message us on WhatsApp whenever you like: ${url}`,
  failed: {
    generic: "We couldn't send that just now. Please try again, or message us on WhatsApp.",
    busy: "We've already received several requests from this number. Our team will be in touch shortly.",
    unavailable: "Call-back requests aren't available right now. Please message us on WhatsApp instead.",
  },

  price: (url) =>
    `Good question! The price depends on your vehicle and the film you choose, so our team prepares an exact quote for you. Pick a product below and leave your name and mobile number, or message us on WhatsApp: ${url}`,
  responseTime: `${CONTACT.responseTime} on WhatsApp.`,
  contact: (display, url, page, responseTime) =>
    `Of course! You can reach our team on WhatsApp or phone at ${display} (${url}). ${responseTime} More ways to get in touch: ${page}`,
  thanks: "You're welcome! 😊 Is there anything else you would like to know about?",
  hello: "Hello! 👋 Welcome to SUNKOOL. Which product would you like to know about?",
  fallback: (url) =>
    `Sorry, I'm not sure about that one! I can tell you all about our products and warranty, so please choose one below, or message our team on WhatsApp for anything else: ${url}`,

  ui: {
    subtitle: CHAT_SUBTITLE,
    typing: "typing…",
    thinking: "Thinking…",
    exploreAnother: "Explore another product",
    submit: "Submit",
    chatEnded: "Chat ended",
    yes: "Yes, please",
    notNow: "Not now",
    placeholder: {
      general: "Ask about films, PPF or warranty…",
      name: "Type your name…",
      mobile: "Type your mobile number…",
    },
    footer: { before: "For quotes or urgent help, ", link: "message us on WhatsApp", after: "." },
    send: "Send message",
    newChat: "Start a new chat",
    minimise: "Minimise chat",
    close: "Close chat",
    yourMessage: "Your message",
  },
};
