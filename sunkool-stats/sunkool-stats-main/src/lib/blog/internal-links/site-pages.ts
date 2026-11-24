import { cities, cityMetadata, type CitySlug } from "@/lib/cities";
import { LEGAL_PAGES } from "@/lib/legal-pages";
import { VIDEOS } from "@/lib/videos";
import type { LinkDestination } from "./types";

/**
 * Every page a blog post may link to. Nothing here is invented: each static
 * path is a real route under src/app, each title/description is copied from
 * that page's own metadata (site-pages.test.ts fails if a route file is
 * missing or its text has drifted), and the city, legal and video pages are
 * generated from the same registries the site itself routes from.
 * Redirect-only URLs (/paint-protection-film, /ahemdabad…) are deliberately
 * absent — links should point at the final URL.
 *
 * `keywords` are the phrases that make the scanner suggest a page. Keep them
 * specific: a generic word like "warranty" would match half the blog, and a
 * link on the wrong phrase is worse than no link. Pages without keywords are
 * still searchable from the link dialog.
 */
type StaticPage = Pick<LinkDestination, "title" | "description"> & {
  path: string;
  /** The route file this page is served from, relative to src/app. */
  file: string;
  keywords?: string[];
};

export const STATIC_PAGES: StaticPage[] = [
  {
    path: "/",
    file: "page.tsx",
    title: "Heat Control Glazing & Paint Protection Film",
    description:
      "SUNKOOL builds premium automotive window films, paint protection films and nano-ceramic heat rejection technology engineered for extreme conditions. Serving Nagpur, Maharashtra.",
  },
  {
    path: "/window-film",
    file: "window-film/page.tsx",
    title: "Heat Control Window Film for Cars",
    description:
      "SUNKOOL nano-ceramic automotive window films: the Legend, Elite, SK and Sunroof Special series and the Signature range, engineered for heat rejection, clarity and UV protection.",
    keywords: [
      "heat control window film",
      "nano-ceramic window film",
      "ceramic window film",
      "car window film",
      "heat control glazing",
      "car window tint",
      "window film",
      "window tint",
    ],
  },
  {
    path: "/ppf",
    file: "ppf/page.tsx",
    title: "Paint Protection Film (PPF) in Nagpur — HD07 & Signature",
    description:
      "SUNKOOL PPF — self-healing aliphatic polyurethane film that protects your paint from stone chips, scratches and UV. Virtually invisible, high-gloss finish.",
    keywords: ["paint protection film", "PPF"],
  },
  {
    path: "/interior-ppf",
    file: "interior-ppf/page.tsx",
    title: "Interior PPF | Premium Interior Protection Film",
    description:
      "Sunkool Interior PPF offers 3-year warranty, 195 micron thickness, 99% UV protection, scratch resistance, anti-yellow coating, stain resistance, and long-lasting interior protection.",
    keywords: ["interior PPF", "interior protection film"],
  },
  {
    path: "/ultra-edge",
    file: "ultra-edge/page.tsx",
    title: "SUNKOOL Ultra Edge — Sunroof & Moonroof Films",
    description:
      "SUNKOOL Ultra Edge, re-imagined: sputtered silver Ultra, titanium-nitride Edge, Prism nano multilayer PET, and sunroof & moonroof films for heat rejection, UV protection and crystal-clear vision.",
    keywords: ["Ultra Edge", "sunroof film", "moonroof film", "sunroof and moonroof film"],
  },
  {
    path: "/compare",
    file: "compare/page.tsx",
    title: "Compare & Configure — SUNKOOL Films",
    description:
      "Find your perfect SUNKOOL film with the interactive configurator, then compare every grade side by side.",
    keywords: ["film configurator", "compare window films", "compare films"],
  },
  {
    path: "/warranty",
    file: "warranty/page.tsx",
    title: "SUNKOOL Warranty & Product Authenticity Check",
    description:
      "Verify your SUNKOOL warranty or register a new installation. Check coverage by mobile, chassis, or car number and follow our step-by-step registration guide.",
    keywords: ["Sunkool warranty", "warranty check", "check your warranty", "warranty registration"],
  },
  {
    path: "/regulations",
    file: "regulations/page.tsx",
    title: "Window Film Regulations & Compliance — SUNKOOL",
    description:
      "SUNKOOL CMVR certificate, IS 2553 side-window compliance, and transparency checks for road-legal window film in India.",
    keywords: ["window film regulations", "window tint laws", "window film laws", "CMVR certificate", "IS 2553"],
  },
  {
    path: "/contact",
    file: "contact/page.tsx",
    title: "Contact SUNKOOL Nagpur — PPF & Window Film",
    description:
      "Get in touch with SUNKOOL on WhatsApp for paint protection film, car heat control glazing, and window film solutions across India and the US.",
    keywords: ["contact us", "contact Sunkool", "get in touch"],
  },
  {
    path: "/become-dealer",
    file: "become-dealer/page.tsx",
    title: "Become a SUNKOOL Dealer",
    description:
      "Join the SUNKOOL network — exclusive territory, marketing support, training and premium product access.",
    keywords: ["become a dealer", "become a Sunkool dealer", "Sunkool dealer network"],
  },
  {
    path: "/our-journey",
    file: "our-journey/page.tsx",
    title: "Our Journey — SUNKOOL",
    description:
      "About Sunkool Solution — India's trusted window film and paint protection partner since 2005.",
    keywords: ["our journey", "about Sunkool"],
  },
  {
    path: "/videos",
    file: "videos/page.tsx",
    title: "Watch SUNKOOL Videos",
    description:
      "Watch SUNKOOL's brand films for Paint Protection Film, Ultra Edge and nano-ceramic Window Film.",
  },
  {
    path: "/blog",
    file: "blog/page.tsx",
    title: "SUNKOOL Journal — Window Film, PPF & Heat Rejection Insights",
    description:
      "Materials science, ownership guides and industry perspective — written by the people who engineer the film.",
  },
];

function page(path: string, title: string, description: string, keywords: string[] = []): LinkDestination {
  return { kind: "page", href: path, title, description, keywords, status: "published", group: "Page" };
}

function cityPage(slug: CitySlug): LinkDestination {
  const { name } = cities[slug];
  const seo = cityMetadata(slug);
  return page(`/${slug}`, seo.title.split(" | ")[0], seo.description, [
    `car window film in ${name}`,
    `window film in ${name}`,
    `window tinting in ${name}`,
    `window tint in ${name}`,
  ]);
}

/** All site pages a post can link to, in the order the link dialog lists them. */
export function getSitePageDestinations(): LinkDestination[] {
  const legal = LEGAL_PAGES.map((p) => page(`/${p.slug}`, p.title, p.description));
  const videos = Object.values(VIDEOS).map((v) => page(`/videos/${v.slug}`, v.title, v.description));
  const cityPages = (Object.keys(cities) as CitySlug[]).map(cityPage);

  return [
    ...STATIC_PAGES.map((p) => page(p.path, p.title, p.description, p.keywords)),
    ...cityPages,
    ...videos,
    ...legal,
  ];
}

/** Every site path that exists, for checking a typed or pasted link. */
export function getSitePaths(): Set<string> {
  return new Set(getSitePageDestinations().map((destination) => destination.href));
}
