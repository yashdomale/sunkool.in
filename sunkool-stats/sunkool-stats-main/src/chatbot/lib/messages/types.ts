import type { ChatTopic } from "../topics";

export type TopicId = ChatTopic["id"];

/**
 * Everything the SUNKOOL Assistant says or labels, in one language. Every language file must provide every
 * key (the compiler enforces it), so adding a language, or a message, cannot leave a gap. Product names are
 * not translated: they are brand names and they are what a lead is filed under. Numbers, links and the
 * contact details are passed in, never retyped, so a translation cannot quote something the site does not.
 */
export type Messages = {
  /** The language's own name. */
  name: string;

  // A product is chosen
  topicIntro: (label: string) => string;
  warrantyIntro: string;
  seeRange: (url: string) => string;
  checkWarranty: (url: string) => string;
  /** The site's description of each product (English: the site's own text; see messages.test.ts for how the rest are kept in step). */
  descriptions: Record<TopicId, string>;

  // The request for a call back
  askForDetails: (label: string) => string;
  alreadyHaveRequest: (label: string) => string;
  askName: string;
  askMobile: (firstName: string) => string;
  invalidName: string;
  invalidMobile: string;
  /** Said after a question that came up part-way through, to pick the thread back up. */
  picksUp: { consent: string; name: string; mobile: string };
  leadThanks: (label: string, name: string) => string;
  anythingElse: string;
  dismiss: (whatsappUrl: string) => string;
  /** Why a request could not be filed. The web address is added after `generic`. */
  failed: { generic: string; busy: string; unavailable: string };

  // Typed questions
  price: (whatsappUrl: string) => string;
  /** "Usually replies within 2 hours" (the website's wording), said about WhatsApp. */
  responseTime: string;
  contact: (display: string, whatsappUrl: string, contactPage: string, responseTime: string) => string;
  thanks: string;
  hello: string;
  fallback: (whatsappUrl: string) => string;

  // The chat window itself
  ui: {
    subtitle: string;
    typing: string;
    thinking: string;
    exploreAnother: string;
    /** The button on the in-chat name / number form. Only the languages that use that form (see DIRECT_ASK in conversation.ts) define it; the others answer in the message box. */
    submit?: string;
    /** Shown once the request is filed and the chat is over. Where a language has none, a "Start a new chat" button is shown instead. */
    chatEnded?: string;
    yes: string;
    notNow: string;
    placeholder: { general: string; name: string; mobile: string };
    /** "For quotes or urgent help, [message us on WhatsApp]." */
    footer: { before: string; link: string; after: string };
    send: string;
    newChat: string;
    minimise: string;
    close: string;
    yourMessage: string;
  };
};
