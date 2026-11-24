import { CORPORATE_ADDRESS_LINE } from "@/lib/contact";
import { ULTRA_EDGE } from "@/lib/products/ultra-edge";
import type { Category, Product } from "@/lib/products/types";

// Copy from the UltraEDGE shade card ("Re-imagined By Sunkool"). Figures live in the catalogue
// (lib/products/ultra-edge.ts) and are read from there, never retyped here.

/** The card's "About Ultra EDGE" text. The hero shows the first paragraph. */
export const ULTRA_EDGE_ABOUT = [
  "Driven by innovation and precision engineering, the UltraEdge range uses advanced multi-layer technology incorporating precious and high-performance metals such as gold, silver, titanium nitride, and other specialized materials. This sophisticated construction is engineered to deliver exceptional heat rejection, optical clarity, durability, and premium aesthetics.",
  "Designed for superior UV protection, infrared heat control, and lasting comfort, UltraEdge films help protect vehicle interiors while maintaining clear visibility and a refined appearance. The result is a premium window film solution that combines advanced material science, functionality, and sophistication for an enhanced driving experience.",
  "Built around quality, durability, and performance, modern window film solutions bring together functionality and sophistication. The result is dependable protection, long-lasting performance, and a premium finish that enhances the overall character of any vehicle.",
] as const;

export const ULTRA_EDGE_BRAND = {
  eyebrow: "Re-imagined By",
  title: "Ultra Edge",
  tagline: "Sputtered with high performance metals",
  intro: ULTRA_EDGE_ABOUT,
  address: CORPORATE_ADDRESS_LINE,
} as const;

/** The card's one-line summary of the Core of Ultra EDGE. */
export const ULTRA_EDGE_CORE =
  "UltraEDGE protects interiors from UV rays, heat, and everyday wear while enhancing privacy, comfort, and visual appeal for a more premium experience.";

export const SOLAR_PARAMETERS = [
  {
    key: "vlt",
    title: "Visible Light Transmission (VLT)",
    summary:
      "The proportion of visible sunlight that passes through the glass.",
    range: "380 to 700 nm (visible light spectrum)",
    importance:
      "Helps regulate the level of natural daylight entering a space. An ideal VLT level ensures a perfect mix of brightness and privacy, contributing to a pleasant and well-lit interior.",
  },
  {
    key: "uvr",
    title: "Ultra Violet Rejected (UV-R)",
    summary:
      "Indicates the level of protection against harmful ultraviolet (UV) radiation from the sun.",
    range: "100–380 nm (UV spectrum)",
    importance:
      "Crucial for protecting skin from direct UV exposure and preventing damage to interiors like flooring and furniture.",
  },
  {
    key: "tser",
    title: "Total Solar Energy Rejected (TSER)",
    summary:
      "The combined amount of solar energy — ultraviolet, visible light, infrared, and other solar rays — that a material blocks from entering a space.",
    range: "Full solar spectrum",
    importance:
      "Represents the overall effectiveness of the material in reducing solar heat gain.",
  },
  {
    key: "irr",
    title: "InfraRed Rejected (IRR)",
    summary: "Indicates how much infrared (IR) energy is blocked.",
    range: "780–2500 nm (within the IR spectrum)",
    importance:
      "Essential for enhancing thermal comfort and reducing electricity or energy costs.",
  },
] as const;

export const ULTRA_ADVANTAGES = [
  {
    title: "Unmatched Heat Rejection",
    body: "Achieve advanced thermal protection that keeps your vehicle consistently cool and comfortable, regardless of external weather conditions.",
  },
  {
    title: "Comprehensive UV Defense",
    body: "Safeguard both your skin and your vehicle's interior with superior protection against harmful ultraviolet rays.",
  },
  {
    title: "Refined Aesthetics",
    body: "Enhance your vehicle's visual appeal with films that deliver exceptional clarity, elegance, and a sophisticated finish.",
  },
  {
    title: "Engineered for Longevity",
    body: "Developed with precision and durability in mind, our films are built to maintain peak performance and reliability over time.",
  },
] as const;

/** The card's "Core of Ultra EDGE" labels. */
export const PERFORMANCE_PILLARS = [
  "Cost Effective",
  "Protect Interiors",
  "Signal Friendly",
  "Block UV & IR Rays",
  "Increase Visibility",
] as const;

export const VALUE_PILLARS = [
  {
    title: "Preserve",
    accent: "sun" as const,
    items: [
      "Cuts electricity usage by up to 10%",
      "Lowers overall power consumption",
      "Contributing to a more sustainable tomorrow",
    ],
  },
  {
    title: "Safeguard",
    accent: "kool" as const,
    items: [
      "Blocks damaging ultraviolet radiation",
      "Boosts cabin privacy with advanced tint technology",
      "Reduces interior heat for a cooler ride",
      "Acts as a barrier against exterior wear and tear",
    ],
  },
  {
    title: "Strengthen",
    accent: "silver" as const,
    items: [
      "Enriches the visual appeal of your environment",
      "Blends luxury with everyday comfort",
      "Transforms ordinary spaces into extraordinary experiences",
    ],
  },
] as const;

export const PRODUCT_FEATURES = [
  "High Heat Rejection",
  "99% UV Block",
  "Crystal Clear Vision",
] as const;

export type UltraEdgeLine = {
  slug: string;
  name: string;
  material: string;
  materialLabel: string;
  mediaKey: "ultra" | "edge" | "prism" | "sunroof" | "moonroof";
  shimmer: "silver" | "gold" | "violet" | "sky" | "indigo";
  accent: string;
  accentGlow: string;
  cta: string;
  paragraphs: readonly string[];
  /** Films on this line, read from the catalogue (lib/products/ultra-edge.ts). */
  variants: readonly Product[];
  applyNote?: string;
};

export const ULTRA_FILM_LAYERS = [
  {
    name: "Scratch-Resistant Top Coat",
    desc: "Hardened outer surface for lasting optical clarity.",
    color: "#e8f4ff",
  },
  {
    name: "UV Absorbing Layer",
    desc: "Blocks harmful UVA and UVB before they reach the cabin.",
    color: "#8b5cf6",
  },
  {
    name: "IR Reflective Silver",
    desc: "Magnetron-sputtered silver reflects infrared heat outward.",
    color: "#c0d8f0",
  },
  {
    name: "Gold Enhancement",
    desc: "Premium noble-metal layer for elite solar control.",
    color: "#f47521",
  },
  {
    name: "Optical Adhesive",
    desc: "Distortion-free bonding for crystal-clear vision.",
    color: "#94a3b8",
  },
] as const;

function seriesProducts(category: Category, slug: string): readonly Product[] {
  const series = category.series.find((s) => s.slug === slug);
  if (!series) throw new Error(`UltraEDGE series missing from catalogue: ${slug}`);
  return series.products;
}

export const ULTRA_EDGE_LINES: readonly UltraEdgeLine[] = [
  {
    slug: "ultra",
    name: "Ultra",
    material: "Silver",
    materialLabel: "Ultra Made of Silver",
    mediaKey: "ultra",
    shimmer: "silver",
    accent: "#58a7e8",
    accentGlow: "#7dd3ff",
    cta: "Experience the Ultra Advantage",
    paragraphs: [
      "UltraEdge window films combine luxury with advanced Infra-Red Reflective Technology. Built with silver, indium oxide and gold, they deliver exceptional clarity, heat rejection, durability and UV protection. UltraEdge keeps interiors cooler, reduces AC load, and ensures premium comfort without compromising visibility. UltraEDGE, where elegance meets performance.",
    ],
    variants: seriesProducts(ULTRA_EDGE, "ultra"),
  },
  {
    slug: "edge",
    name: "Edge",
    material: "Titanium Nitride",
    materialLabel: "Edge Sputtered with Titanium Nitride",
    mediaKey: "edge",
    shimmer: "gold",
    accent: "#f47521",
    accentGlow: "#ffbf96",
    cta: "Experience the Edge Advantage",
    paragraphs: [
      "EDGE combines Titanium Nitride (TiN) and advanced nano-ceramic technology for superior heat rejection, UV protection, and crystal-clear visibility. Its dye-free, multi-layer construction reduces glare, ensures lasting colour stability, and delivers exceptional durability and driving comfort.",
    ],
    variants: seriesProducts(ULTRA_EDGE, "edge"),
  },
  {
    slug: "prism",
    name: "Prism",
    material: "Nano Multilayer PET",
    materialLabel: "Prism 150+ Nano Multilayers of Advanced PET",
    mediaKey: "prism",
    shimmer: "violet",
    accent: "#a78bfa",
    accentGlow: "#c4b5fd",
    cta: "Experience the Prism Advantage",
    paragraphs: [
      "Prism is a premium window film crafted with 150+ nano multilayers of advanced PET, designed for exceptional comfort, protection, and clarity. It blocks 99% of harmful UV rays, rejects intense infrared heat, and maintains crystal-clear visibility with uninterrupted signal performance making it an ideal choice for those seeking advanced window film technology.",
    ],
    variants: seriesProducts(ULTRA_EDGE, "prism"),
  },
  {
    slug: "sunroof",
    name: "Sunroof Special Series",
    material: "Sunroof Protection",
    materialLabel: "Sunroof Protection Film",
    mediaKey: "sunroof",
    shimmer: "sky",
    accent: "#38bdf8",
    accentGlow: "#7dd3fc",
    cta: "What Makes the Sunroof Series Special",
    applyNote: "With heat rejection properties and applied from outside",
    paragraphs: [
      "The Sunroof Series is designed specifically for panoramic glass roofs and sunroofs, delivering superior heat rejection and UV protection. This advanced film significantly reduces interior heat and glare while keeping the cabin bright and clear. With high infrared rejection, it helps maintain a cooler interior and protects against prolonged sun exposure without compromising openness or visibility.",
    ],
    variants: seriesProducts(ULTRA_EDGE, "sunroof"),
  },
  {
    slug: "moonroof",
    name: "Moonroof Special Series",
    material: "Moonroof Protection",
    materialLabel: "Moonroof Protection Film",
    mediaKey: "moonroof",
    shimmer: "indigo",
    accent: "#818cf8",
    accentGlow: "#a5b4fc",
    cta: "What Makes the Moonroof Series Special",
    paragraphs: [
      "The Moonroof Series is specially engineered for glass moonroofs, delivering superior heat rejection and advanced UV protection. This high-performance film reduces heat buildup and glare while keeping the cabin bright and naturally lit. Its high infrared rejection helps maintain a cooler interior and protects against prolonged sun exposure. All this is achieved without affecting visibility or the open, airy feel of the moonroof.",
    ],
    variants: seriesProducts(ULTRA_EDGE, "moonroof"),
  },
];
