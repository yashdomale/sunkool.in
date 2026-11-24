// The words and images that change between the cities rendered by the shared
// Nagpur template (Nagpur, Amritsar, Chennai, Delhi). Everything else on the
// page is the same for all four and lives in the section components.
// One file per city in this folder; add a city by copying one and editing it.

export type TemplateCity = "nagpur" | "chennai" | "delhi" | "amritsar";

type Card = { title: string; body: string };

export type TemplateCopy = {
  hero: { image: string; imageAlt: string; cityName: string; subtext: string };
  whyUse: {
    eyebrow: string;
    headlineTail: string;
    paragraphs: [string, string, string];
    /** In order: heat, glare, UV, interior, signal, safety (the icons are fixed). */
    cards: Card[];
  };
  heat: {
    eyebrow: string;
    cityName: string;
    /** In order: sun, road, traffic, area (the icons are fixed). */
    bullets: [string, string, string, string];
    servedArea: string;
    image: string;
    imageAlt: string;
    imageAspectClass: string;
    imageFitClass: string;
  };
  nano: {
    eyebrow: string;
    intro: string;
    /** In order: heat, UV, clarity, signal, film qualities (the icons are fixed). */
    cards: Card[];
  };
  performance: {
    eyebrow: string;
    uvLabel: string;
    /** In order: cooler cabin, clear visibility, better protection (the icons are fixed). */
    highlights: Card[];
    /** Definitions of TSER, IR Rejection, VLT, UV Rejection, in that order. */
    glossary: [string, string, string, string];
  };
  film: {
    headlineTail: string;
    intro: string;
    descriptions: { hd70: string; sk70: string };
    disclaimer: string;
    clarityNote: string;
    legalQuestion: string;
  };
  installation: { headlineTail: string; intro: string; steps: Card[] };
  installer: { eyebrow: string; intro: string };
  getStarted: { headlineTail: string; intro: string };
  faqs: { q: string; a: string }[];
  /** JSON-LD for the page (schema.org @graph). */
  structuredData: object;
};
