import type { LinkDestination } from "./types";
import { postHref } from "./urls";

// Editorial relationships for the existing library. Anchors wrap words already
// in the article; they never add copy or invent a destination. A rule is usable
// only while its destination is returned by the published-post query.
const ARTICLES = {
  glanza: "toyota-glanza-facelift-2026-expected-price-features-engine-and-launch-date",
  baleno: "maruti-suzuki-baleno-facelift-2026-expected-price",
  sorento: "kia-sorento-india-launch-expected-price-specs-powertrains-everything-we-know-early-september-2026",
  guide: "car-window-tint-guide-2026-film-types-cost-legal-limits",
  legal: "is-window-film-legal-on-your-car-in-india-here-s-what-the-law-actually-says",
  laws: "window-tint-laws-india-2026",
  rules: "car-window-films-legal-rules-in-india-2026-complete-guide",
  safety: "safety-glazing-for-cars-explained-sunkool",
  myths: "car-window-film-myths-vs-facts-sunkool",
  heat: "how-much-heat-does-ceramic-window-film-block",
  climate: "best-car-window-film-for-indian-climate",
  elnino: "how-does-el-ni-o-affect-cars-in-india",
  tips: "7-powerful-car-paint-protection-tips-in-india-every-car-owner-should-follow-in-2026",
  brands: "10-best-ppf-brands-in-india-2026-every-car-owner-should-know",
  shield: "7-powerful-reasons-why-the-best-ceramic-shield-for-a-car-is-worth-every-rupee",
  care: "9-proven-ceramic-coating-maintenance-tips-every-car-owner-in-india-should-know-in-2026",
} as const;

type Topic = keyof typeof ARTICLES;

const ANCHORS: Partial<Record<Topic, string[]>> = {
  glanza: ["Toyota Glanza", "Toyota Glanza facelift"],
  baleno: ["Maruti Baleno facelift", "Baleno facelift", "Maruti Suzuki Baleno"],
  guide: ["nano-ceramic film", "nano-ceramic window film", "professional installation", "installation quality"],
  legal: ["legal limits", "visible light", "legal VLT limit"],
  laws: ["visible light transmission", "VLT requirements"],
  safety: ["safety glazing", "certified safety glass"],
  myths: ["dark tint", "darker tint", "GPS navigation", "GPS and FASTag"],
  heat: ["heat rejection", "infrared rejection", "infrared heat", "cabin heat", "heat inside the cabin", "solar energy rejection"],
  tips: ["paint protection", "bird droppings", "tree sap", "UV damage", "sun damage"],
  brands: ["PPF brands", "paint protection film brands"],
  shield: ["ceramic coating", "ceramic coatings", "ceramic shield"],
  care: ["pH-neutral shampoo", "maintenance routine", "regular washing"],
};

const RELATED: Record<Topic, Topic[]> = {
  glanza: ["baleno", "heat", "legal"],
  baleno: ["glanza", "heat", "guide"],
  sorento: ["heat", "guide", "legal"],
  guide: ["heat", "legal", "safety", "myths"],
  legal: ["safety", "laws", "guide"],
  laws: ["safety", "guide", "heat"],
  rules: ["safety", "laws", "guide"],
  safety: ["guide", "myths"],
  myths: ["heat", "legal", "guide"],
  heat: ["laws", "guide", "myths"],
  climate: ["heat", "legal", "myths"],
  elnino: ["heat", "legal", "tips"],
  tips: ["brands", "shield", "care"],
  brands: ["tips", "shield", "care"],
  shield: ["care", "tips", "brands"],
  care: ["shield", "tips"],
};

const SOURCE_ANCHORS: Partial<Record<Topic, Partial<Record<Topic, string[]>>>> = {
  safety: {
    guide: ["heat and glare", "tint package"],
    myths: ["heat blocking", "shade of tint"],
  },
};

/** Only the published, editorially related posts are eligible for public linking. */
export function contextualDestinations(sourceSlug: string | undefined, destinations: LinkDestination[]): LinkDestination[] {
  const topic = (Object.keys(ARTICLES) as Topic[]).find((key) => ARTICLES[key] === sourceSlug);
  if (!topic) return [];

  return RELATED[topic].flatMap((target) => {
    const destination = destinations.find(
      (candidate) => candidate.kind === "post" && candidate.status === "published" && candidate.href === postHref(ARTICLES[target])
    );
    if (!destination) return [];

    // These two phrases describe the distinction the safety-glazing article
    // makes between tint and security film, rather than suggesting they are equal.
    const keywords = SOURCE_ANCHORS[topic]?.[target] ?? ANCHORS[target] ?? [];
    return [{ ...destination, keywords }];
  });
}
