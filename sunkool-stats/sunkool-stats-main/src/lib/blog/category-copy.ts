// Editorial copy for the public blog category pages (/blog?category=<slug>).
//
// A category is only offered to search engines when it has an entry here: each
// indexable page needs its own title, meta description, H1 and intro, not a
// template filled with the category name. A category created in the admin
// without an entry still works for visitors but stays noindex until copy is
// added (see listing-seo.ts).
//
// `title` is the bare page title - the root layout's template appends the
// brand. Keep it under ~50 characters and `description` under ~160.

export type CategoryCopy = {
  title: string;
  description: string;
  /** The page's H1. */
  heading: string;
  /** The paragraph under the H1. */
  intro: string;
};

const COPY: Record<string, CategoryCopy> = {
  "window-film": {
    title: "Car Window Film Guides for India",
    description:
      "Guides to car window film in India: how the film types compare, what tinting costs, what is legal and how to choose. From the SUNKOOL Journal.",
    heading: "Car window film guides for India",
    intro:
      "How car window film works, how the main film types compare, what it costs and what to check before you buy. Practical guides from the team that engineers SUNKOOL film.",
  },
  regulations: {
    title: "Window Tint Laws & Rules in India",
    description:
      "Plain-English guides to the rules on tinted car windows in India: what is permitted, what is not and what to check before you fit film.",
    heading: "Window tint laws and regulations in India",
    intro:
      "Plain-English guides to what Indian law says about tinted car windows: what is permitted, what is not, and what to check before you fit film.",
  },
  "vehicle-care": {
    title: "Car Care & Paint Protection Tips",
    description:
      "Practical car care advice for Indian conditions: protecting paint, maintaining ceramic coating and keeping your car looking new. From the SUNKOOL Journal.",
    heading: "Car care and paint protection tips",
    intro:
      "Practical advice for keeping paint, coatings and glass in good shape on Indian roads and in Indian weather, from the team behind SUNKOOL.",
  },
  ppf: {
    title: "Paint Protection Film (PPF) Guides",
    description:
      "Guides to paint protection film in India: what PPF does, how brands compare and what to look for before you book an installation. From the SUNKOOL Journal.",
    heading: "Paint protection film (PPF) guides",
    intro:
      "What paint protection film does, how the brands on sale in India compare, and what to look for before you book an installation.",
  },
  "new-cars": {
    title: "New Car Launches in India",
    description:
      "Upcoming and newly launched cars in India: expected prices, specifications and powertrains, with notes from the SUNKOOL team.",
    heading: "New car launches in India",
    intro:
      "Expected prices, specifications and powertrains for upcoming and newly launched cars in India.",
  },
  "industry-news": {
    title: "Car Protection Industry News",
    description:
      "News and perspective on car protection, window film and coatings from the SUNKOOL Journal.",
    heading: "Industry news and insights",
    intro: "News and perspective on car protection, window film and coatings.",
  },
  technology: {
    title: "Window Film & Heat-Rejection Technology",
    description:
      "How ceramic window film and heat-rejection technology work, and how much heat they block. From the SUNKOOL Journal.",
    heading: "Window film and heat-rejection technology",
    intro:
      "How ceramic window film and heat-rejection technology work, and how much heat they block.",
  },
};

export function getCategoryCopy(slug: string): CategoryCopy | undefined {
  return Object.hasOwn(COPY, slug) ? COPY[slug] : undefined;
}
