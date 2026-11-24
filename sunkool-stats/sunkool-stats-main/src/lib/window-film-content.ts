import { CONTACT, CORPORATE_ADDRESS_LINE } from "@/lib/contact";
export const WINDOW_FILM_BRAND = {
  eyebrow: "Automotive Window Film",
  title: "Window Film",
  lead: "Nano-ceramic films that reject infrared heat without dulling clarity or blocking signal. From the trusted Legend Series to flagship Signature performance, there is a SUNKOOL grade for every drive.",
  address: CORPORATE_ADDRESS_LINE,
  phone: CONTACT.phone,
  phoneHref: CONTACT.phoneHref,
} as const;

// Product copy below follows the 2026 shade cards ("sunkool shade card" and "Signature shade card");
// the figures are in src/lib/products/window-film.ts.

/** The main range: the shade card's Legend, Elite and SK Series, shown as groups in one section. */
export const FOUNDATION_SERIES = {
  title: "Window Film Series",
  eyebrow: "Nano-Ceramic Window Glazing",
  blurb:
    "Advanced nanoceramic window safety glazing — exceptional heat reduction, crystal-clear visibility, and a premium aesthetic across every shade.",
} as const;

/** Text for each group in the main section, keyed by the catalogue's series slug. */
export const FOUNDATION_GROUPS: Record<string, {
  label: string;
  headline?: string;
  body: readonly string[];
  link?: { label: string; href: string };
  /** Product cards show only the name (no specs/tagline). */
  nameOnly?: boolean;
  /** Shown below the body paragraphs, above the product cards. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Per-product text shown directly above that product's card, keyed by product slug. */
  productIntros?: Record<string, string>;
  /** Per-product image shown between that product's intro text and its card, keyed by product slug. */
  productImages?: Record<string, { src: string; alt: string; width: number; height: number }>;}> = {
  legend: {
    label: "Legend Series",
    headline: "Sunkool's Most Famous Products",
    body: [],
    productIntros: {
      hd70: "HD 70: A trusted Sunkool favourite, known for reliable heat rejection, UV protection and lasting comfort. Its elegant blue tint adds a premium look while keeping the cabin cooler and more comfortable.",
      sk70: "SK 70: Featuring a subtle green tint, SK 70 delivers effective heat reduction, UV protection and crystal-clear visibility, ensuring a fresh, premium look and comfortable cabin.",
    },
    productImages: {
      hd70: {
        src: "/images/FAMILY.png",
        alt: "Smiling family driving under bright sun in a car with SUNKOOL window film, cabin cool and clear",
        width: 1199,
        height: 1312,
      },
      sk70: {
        src: "/images/DEFENDER.png",
        alt: "Family on a sunny road trip in an SUV with SUNKOOL SK 70 window film, cabin cool and clear",
        width: 1254,
        height: 1254,
      },
    },
  },
  elite: {
    label: "Elite Series",
    body: [
      "For those who expect more from every detail, Sunkool brings you CH 70 and GY 70, premium shades designed to create a more refined and luxurious cabin experience. CH 70 comes with a rich charcoal tint that gives the glass a deep and sophisticated look. GY 70 features a distinctive Royal Iron Grey tint, created for those who prefer understated luxury.",
    ],
  },
  "sk-series": {
    label: "SK Series",
    body: [
      "Every space has its own style, and everyone has a different preference. SK 50 features a unique olive grey tint, giving the surroundings a warm and distinctive feel. SK 35 comes with a deeper grey tint, offering a bold and elegant appearance that helps reduce glare and heat.",
    ],
    link: { label: "SK 70 is in the Legend Series", href: "#legend" },
    nameOnly: true,
  },
};

export const FOUNDATION_PRODUCT_HIGHLIGHTS = {
  sunroof: {
    title: "Sunroof Special Series",
    intro:
      "The Sunroof Series specializes in panoramic glass roofs and sunroofs, offering exceptional heat rejection and UV protection. This innovative film effectively minimizes cabin heat while preserving natural light and visibility. With its outstanding infrared blocking capabilities, it keeps the interior cooler and safeguards against long-term sun damage.",
    specialTitle: "What Makes the Sunroof Series Special",
  },
} as const;

/** "About SUNKOOL" on the window film page, from the shade card. */
export const WINDOW_FILM_STATS = [
  { value: "99", suffix: "%", label: "UV protection" },
  { value: "99", suffix: "%", label: "Peak IR rejection" },
  { value: "100", suffix: "%", label: "Signal-safe" },
] as const;

export const WINDOW_FILM_ADVANTAGES = [
  {
    title: "Nano-Ceramic Heat Rejection",
    body: "Thousands of ceramic particles reflect and absorb infrared energy — keeping cabin temperatures down without metallic interference.",
  },
  {
    title: "Crystal Clarity",
    body: "Optically tuned layers preserve visibility day and night, with minimal colour shift across every shade grade.",
  },
  {
    title: "Signal-Safe Performance",
    body: "Non-metallic construction won't block GPS, mobile, or toll-tag signals — engineered for modern connected vehicles.",
  },
  {
    title: "Interior Protection",
    body: "Blocks harmful UV rays that fade leather, dash materials, and upholstery while protecting occupants.",
  },
] as const;

export const SIGNATURE_SERIES = {
  eyebrow: "Premium Heat Control Glazing",
  title: "Signature Series",
  specialTitle: "What Makes the Sunkool Signature So Special",
  specialBody: [
    "The SUNKOOL Signature Series is crafted for those who seek luxury, comfort, and sophistication in every journey. Designed to reduce heat, maintain crystal-clear visibility, and create a cooler, more refined cabin, it delivers premium protection and lasting comfort for you and your family.",
  ],
} as const;

/** The Signature card's sunroof films, shown in a box like the main range's sunroof box. */
export const SIGNATURE_SUNROOF = {
  title: "Signature Sunroof Glazing",
  intro:
    "The Sunroof Series specializes in panoramic glass roofs and sunroofs, offering exceptional heat rejection and UV protection. This innovative film effectively minimizes cabin heat and glare while preserving natural light and visibility. With its outstanding infrared blocking capabilities, it keeps the interior cooler and safeguards against long-term sun damage.",
  specialTitle: "What Makes the Sunroof Glazing Special",
} as const;

export const SOLAR_PARAMETERS = [
  {
    abbr: "VLT",
    name: "Visible Light Transmission",
    range: "380–700 nm",
    body: "Measures visible light passing through glass, balancing brightness and privacy.",
  },
  {
    abbr: "UV-R",
    name: "Ultraviolet Rejection",
    range: "100–380 nm",
    body: "Blocks harmful UV rays, protecting skin and vehicle interiors.",
  },
  {
    abbr: "TSER",
    name: "Total Solar Energy Rejected",
    range: "Full Solar Spectrum",
    body: "Measures overall solar energy rejection for effective heat reduction.",
  },
  {
    abbr: "IRR",
    name: "Infrared Rejection",
    range: "780–2500 nm",
    body: "Measures infrared heat rejection for a cooler, more comfortable cabin.",
  },
] as const;

export const SIGNATURE_ADVANTAGES = [
  {
    title: "Unmatched Heat Rejection",
    body: "Advanced heat protection for a cooler, more comfortable cabin.",
  },
  {
    title: "Comprehensive UV Defense",
    body: "Protects your skin and vehicle interiors from harmful UV rays.",
  },
  {
    title: "Refined Aesthetics",
    body: "Crystal-clear visibility with an elegant, premium finish.",
  },
  {
    title: "Engineered for Longevity",
    body: "Built for lasting durability and reliable performance.",
  },
] as const;

export const SIGNATURE_PRODUCT_HIGHLIGHTS = {
  emerald: {
    title: "What Makes The Emerald Special",
    body: "EMERALD is inspired by the richness, elegance and timeless character of the emerald stone. Designed for those who value refined protection and quiet luxury, it features an advanced nano-ceramic layer that helps reduce heat for a cooler, more comfortable environment. Its high-performance UV coating filters harmful rays, including UV-A, UV-B and high-energy violet light. Combining clarity, comfort and sophisticated protection, EMERALD delivers a beautifully engineered finish with an unmistakably premium presence.",
  },
  topaz: {
    title: "Topaz Series",
    body: "TOPAZ combines advanced magnetron silver, Titanium Nitride (TiN), and Japanese nano-ceramic technology for exceptional heat control with over 92% infrared rejection. Its dye-free multi-layer construction delivers crystal-clear visibility, UV protection, reduced glare, and lasting colour stability, ensuring superior durability, comfort, and luxury in every journey.",
  },
  diamond: {
    title: "Diamond Series",
    body: "The DIAMOND Series features over 150 advanced PET nano-layers, delivering exceptional heat rejection, 99% UV protection, and around 70% visible light transmission. Designed for crystal-clear visibility and uninterrupted signal connectivity, it combines advanced technology, lasting comfort, and invisible luxury with uncompromising performance.",
  },
} as const;

export const NANO_LAYERS = [
  {
    name: "Scratch-Resistant Top Coat",
    desc: "Hardened nano-coating that keeps clarity flawless for years.",
    color: "#cfe9ff",
  },
  {
    name: "UV Absorbing Layer",
    desc: "Blocks 99.9% of UVA and UVB to protect skin and interiors.",
    color: "#8b5cf6",
  },
  {
    name: "Nano-Ceramic IR Layer",
    desc: "Ceramic particles reject infrared heat — not signal.",
    color: "#58a7e8",
  },
  {
    name: "Adhesive & Optical Layer",
    desc: "Crystal-clear bonding tuned for distortion-free vision.",
    color: "#ffbf96",
  },
] as const;

export const PERFORMANCE_PILLARS = [
  "Improves Visibility",
  "Blocks Heat",
  "Reduces Glare",
  "Blocks UV Rays",
  "Signal Enabling",
  "Improves Performance",
] as const;
