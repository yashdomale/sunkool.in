import type { Category } from "./types";

// Figures are exactly as printed on the SUNKOOL UltraEDGE shade card (2026): VLT, IR, UV and
// TSER. Never recompute TSER; the card is the brand's published figure. ultra-edge.test.ts
// locks every value in. Product slugs are stable identifiers (stored blog enquiries and the
// lead form refer to them); only names and figures change.
// The UltraEDGE card has no warranty for any film, so none is listed here.

export const ULTRA_EDGE: Category = {
  slug: "ultra-edge",
  name: "Ultra Edge",
  short: "Sputtered metal & nitride films",
  description:
    "Re-imagined by SUNKOOL: sputtered silver Ultra, titanium-nitride Edge, Prism nano multilayer PET, and sunroof & moonroof films for heat rejection and UV protection.",
  series: [
    {
      slug: "ultra",
      name: "Ultra — Made of Silver",
      blurb:
        "Sputtered with high performance metals: Ultra Max with 11 layers of gold and silver, and Ultra 70 and 50 with 7 layers of silver.",
      products: [
        {
          slug: "ultra-max",
          name: "Ultra Max",
          tagline: "11 layers of Gold + Silver",
          vlt: 75,
          tser: 60,
          ir: 96,
          uv: 99,
          accent: "#E0E1DF",
          family: "ultra",
          note: "The highest-VLT Ultra film, with gold and silver layers for heat rejection.",
        },
        {
          slug: "ultra-70",
          name: "Ultra 70",
          tagline: "7 layers of Silver",
          vlt: 70,
          tser: 54,
          ir: 95,
          uv: 99,
          accent: "#C9CDBC",
          family: "ultra",
          note: "Silver-sputtered heat rejection with clear visibility.",
        },
        {
          slug: "ultra-50",
          name: "Ultra 50",
          tagline: "7 layers of Silver",
          vlt: 50,
          tser: 75,
          ir: 99,
          uv: 99,
          accent: "#737D7F",
          family: "ultra",
          note: "A deeper silver shade with high infrared rejection.",
        },
      ],
    },
    {
      slug: "edge",
      name: "Edge — Sputtered with Titanium Nitride",
      blurb:
        "Titanium nitride and nano-ceramic: dye-free, multi-layer construction with excellent colour stability.",
      products: [
        {
          slug: "edge-max",
          name: "Edge Max",
          tagline: "3 layers of silver, sputtered with titanium nitride",
          vlt: 70,
          tser: 61,
          ir: 97,
          uv: 99,
          accent: "#B5BFC0",
          family: "edge",
          note: "Three silver layers sputtered with titanium nitride for durable heat control.",
        },
        {
          slug: "edge-70",
          name: "Edge 70",
          tagline: "Titanium nitride + nano-ceramic",
          vlt: 70,
          tser: 60,
          ir: 99,
          uv: 99,
          accent: "#B7C7CA",
          family: "edge",
          note: "Titanium nitride and nano-ceramic layers for clarity and infrared rejection.",
        },
        {
          slug: "edge-50",
          name: "Edge 50",
          tagline: "Titanium nitride + nano-ceramic",
          vlt: 50,
          tser: 74,
          ir: 99,
          uv: 99,
          accent: "#8D8D89",
          family: "edge",
          note: "A deeper titanium nitride shade with high solar energy rejection.",
        },
      ],
    },
    {
      slug: "prism",
      name: "Prism — Nano Multilayer PET",
      blurb:
        "150+ nano multilayers of advanced PET: practically invisible, with 99% UV rejection and strong infrared rejection.",
      products: [
        {
          slug: "prism-90",
          name: "Prism 90",
          tagline: "150+ nano multilayers of advanced PET",
          vlt: 88,
          tser: 55,
          ir: 97,
          uv: 99,
          accent: "#EDEFF0",
          family: "prism",
          note: "The clearest Prism: practically invisible, with strong IR and UV rejection.",
        },
        {
          slug: "prism",
          name: "Prism 70",
          tagline: "150+ nano multilayers of advanced PET",
          vlt: 70,
          tser: 60,
          ir: 98,
          uv: 99,
          accent: "#D2DDDE",
          family: "prism",
          note: "Crystal-clear visibility, signal-friendly, with elite UV and IR rejection.",
        },
        {
          slug: "prism-40",
          name: "Prism 40",
          tagline: "150+ nano multilayers of advanced PET",
          vlt: 40,
          tser: 78,
          ir: 99,
          uv: 99,
          accent: "#63625A",
          family: "prism",
          note: "The deepest Prism shade, with the highest solar energy rejection of the line.",
        },
      ],
    },
    {
      slug: "sunroof",
      name: "Sunroof Special Series",
      blurb:
        "Panoramic roof protection, applied from outside with 7.5 mil thickness.",
      products: [
        {
          slug: "sunroof",
          name: "Sunroof Protection Film",
          tagline: "Applied from outside",
          vlt: 70,
          tser: 60,
          ir: 95,
          uv: 99,
          accent: "#BEE9F2",
          note: "7.5 mil film for panoramic glass roofs and sunroofs.",
          thickness: "7.5 mil",
          applyNote: "Applied from outside",
        },
      ],
    },
    {
      slug: "moonroof",
      name: "Moonroof Special Series",
      blurb:
        "Engineered for glass moonroofs: heat and UV control without losing the open, airy feel.",
      products: [
        {
          slug: "moonroof",
          name: "Moonroof Protection Film",
          tagline: "Glass moonroof heat control",
          vlt: 50,
          tser: 74,
          ir: 99,
          uv: 99,
          accent: "#787874",
          note: "High infrared rejection for moonroof glass, with the cabin kept bright.",
        },
      ],
    },
  ],
};
