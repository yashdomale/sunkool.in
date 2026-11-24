import { CONTACT, CORPORATE_ADDRESS_LINE } from "@/lib/contact";

export const PPF_BRAND = {
  eyebrow: "Paint Protection Film",
  title: "PPF",
  lead: "High-performance aliphatic polyurethane with a transparent coat and self-adhesive properties — engineered to shield your paint from stone chips, scratches, and UV while keeping a high-gloss, premium finish.",
  address: CORPORATE_ADDRESS_LINE,
  phone: CONTACT.phone,
  phoneHref: CONTACT.phoneHref,
} as const;

export const PPF_CONTENT = {
  headline: "SUNKOOL protects your gloss from being dulled by scratches",
  paragraphs: [
    "Sunkool offers high-performance aliphatic polyurethane film with a transparent coat and self-adhesive properties that help protect your paint against stone chipping and scratching. Our aliphatic polyurethane is highly resistant to the effects of ultraviolet light and is ideal for outdoor automotive use. It is self-healing PPF, enabling the film surface to provide long-term protection against paint chips and scratches.",
    "Sunkool keeps your paint looking new with a sheet of our clear protective film. It is virtually invisible once installed and protects against light scratches and swirl marks while maintaining a high-gloss, premium look.",
  ],
} as const;

export const PPF_STATS = [
  { value: "99", suffix: "%", label: "UV protection" },
  { value: "7", suffix: " mil", label: "Film thickness" },
  { value: "100", suffix: "%", label: "Self-healing*" },
] as const;

export const PPF_ADVANTAGES = [
  {
    title: "Aliphatic Polyurethane",
    body: "UV-stable chemistry built for long-term outdoor automotive exposure — resists yellowing and degradation.",
  },
  {
    title: "Self-Healing Surface",
    body: "Light scratches and swirls recover with heat — the film surface maintains clarity and gloss over time.",
  },
  {
    title: "Virtually Invisible",
    body: "Optically clear once installed. Your factory colour and finish stay true — protection you barely see.",
  },
  {
    title: "Stone-Chip Defence",
    body: "Absorbs impacts from road debris before they reach your paint — long-term protection for every panel.",
  },
] as const;

export const PPF_PERFORMANCE_PILLARS = [
  "Stone-Chip Protection",
  "Scratch Resistance",
  "Self-Healing",
  "UV Stable",
  "Hydrophobic Finish",
  "High-Gloss Look",
] as const;

export const PPF_LAYERS = [
  {
    name: "Self-Healing Top Coat",
    desc: "Elastomeric surface that re-flows with heat — swirls and light marks disappear.",
    color: "#e8e8e8",
  },
  {
    name: "Aliphatic Polyurethane Core",
    desc: "Impact-absorbing TPU layer — stone chips and road debris stop here.",
    color: "#c0c0c0",
  },
  {
    name: "UV-Stabilized Clear Layer",
    desc: "Blocks harmful ultraviolet light — ideal for outdoor automotive use.",
    color: "#a8b4c4",
  },
  {
    name: "Self-Adhesive Bonding Layer",
    desc: "Optically clear adhesive — seamless install with a flawless finish.",
    color: "#8a9bb0",
  },
] as const;

export const HD07_SERIES = {
  eyebrow: "Self-Healing Paint Protection",
  title: "SUNKOOL HD07",
  blurb:
    "Invisible self-healing armour — 7-mil aliphatic polyurethane TPU with a rapid self-healing top coat for daily-driven protection.",
  specialTitle: "What Makes HD07 Special",
  specialBody:
    "HD07 combines a thick aliphatic polyurethane core with a self-healing elastomeric top coat. Stone chips, road debris, and light scratches are absorbed or recovered before they mark your paint. Virtually invisible once installed — your gloss stays factory-fresh.",
  disclaimer:
    "Performance values are based on routine quality control data and may vary between batches (± 5%).",
  warranty:
    "Warranty covers yellowing, cracking, peeling, and loss of self-healing properties under normal use.",
} as const;

export const SIGNATURE_PPF_SERIES = {
  eyebrow: "Flagship Paint Protection",
  title: "SUNKOOL Signature Ultimate",
  subtitle: "Paint Protection Film",
  blurb:
    "Our flagship aliphatic polyurethane paint protection film — heat-healing, hydrophobic, and engineered for a commanding high-gloss finish with amazing optical clarity.",
  specialTitle: "What Makes Signature Ultimate Special",
  specialBody:
    "Signature Ultimate combines super-stretchable TPU with a hydrophobic, stain-resistant top coat for easy installation and a perfect finish. Heat restorative healing at ~70°C, ≥99% UV rejection, and non-yellowing performance — backed by a limited lifetime warranty for the original vehicle owner.",
  disclaimer:
    "Performance values are based on routine quality control data and may vary between batches (± 5%).",
  warranty:
    "Limited Lifetime Warranty is valid only for the first/original owner of the vehicle and is non-transferable.",
} as const;

export const SIGNATURE_PPF_FEATURES = [
  "Heat-healing",
  "High gloss finish",
  "Stain resistance",
  "Hydrophobic properties",
  "Easy install",
  "Limited Lifetime Warranty",
] as const;

export const SIGNATURE_PPF_INSTALL_ADVANTAGES = [
  {
    title: "Super Stretchable",
    body: "Film conforms around complex curves and deep recesses without fighting the panel.",
  },
  {
    title: "Almost No Stretch Marks",
    body: "Uniform tension distribution keeps the surface clean during and after install.",
  },
  {
    title: "Super Glue",
    body: "Strong initial tack with reliable 1800–2000 gf peel adhesion after bonding.",
  },
  {
    title: "Easy Installation",
    body: "Installer-friendly handling for faster, more consistent coverage.",
  },
  {
    title: "Perfect Finish",
    body: "≥140 GU gloss at 60° for a wet-look, factory-plus presentation.",
  },
  {
    title: "Amazing Optical Clarity",
    body: "TPU haze ≤0.5% — protection that stays virtually invisible on the paint.",
  },
] as const;

export type PpfSpecRow = {
  property: string;
  method: string;
  result: string;
};

export const SIGNATURE_PPF_SPEC_TABLE: {
  category: string;
  rows: PpfSpecRow[];
}[] = [
  {
    category: "Physical Properties",
    rows: [
      { property: "TPU Haze", method: "Haze Meter", result: "≤ 0.5%" },
      {
        property: "Total thickness",
        method: "GB/T 6672-2001",
        result: "200 µm (8 mil)",
      },
      { property: "Glossiness", method: "Gloss Meter @60°", result: "≥ 140 GU" },
      { property: "Width", method: "Tape Measure", result: "1.52 m" },
      { property: "Length", method: "Meter Counter", result: "15 m" },
    ],
  },
  {
    category: "Mechanical Properties",
    rows: [
      {
        property: "Tensile Strength",
        method: "PT-6081G / ASTM D638",
        result: "≥ 45 MPa",
      },
      {
        property: "Coating Elongation",
        method: "PT-6081G",
        result: "≥ 450%",
      },
      { property: "Tear strength", method: "GB/T 529", result: "≥ 100 kN/m" },
      { property: "100% modulus", method: "PT-6081G", result: "~ 8 MPa" },
    ],
  },
  {
    category: "Other Properties",
    rows: [
      { property: "UV Rejection", method: "LS182 Detector", result: "≥ 99%" },
      {
        property: "Adhesive tape peel",
        method: "GB/T 2792-2014 (20-min)",
        result: "1800–2000 gf",
      },
      {
        property: "QUV ageing resistance",
        method: "ASTM G154-16",
        result: "≤ 0.1 (no change)",
      },
      {
        property: "Hydrophilic / Hydrophobic",
        method: "Marker Pen Stroke",
        result: "Hydrophobic (contact angle ≥ 110°)",
      },
      {
        property: "Accelerated Weathering",
        method: "1000 h QUV",
        result: "(NDE) No Detrimental Effect",
      },
      {
        property: "Yellowing rate",
        method: "QUV / Xenon Arc (Δb)",
        result: "Δb ≤ 1 (Non-yellowing)",
      },
      {
        property: "Restorative",
        method: "Hot water / air ~70°C",
        result: "Heat repaired",
      },
    ],
  },
];

export const PPF_PROTECTION_PARAMETERS = [
  {
    abbr: "TPU",
    name: "Thermoplastic Urethane",
    range: "Aliphatic grade",
    body: "The core impact layer — flexible, durable, and highly resistant to yellowing from UV exposure.",
  },
  {
    abbr: "UV",
    name: "Ultraviolet Stability",
    range: "Outdoor rated",
    body: "Aliphatic chemistry resists UV degradation — ideal for long-term automotive outdoor protection.",
  },
  {
    abbr: "SH",
    name: "Self-Healing",
    range: "Heat activated",
    body: "The top coat re-flows to recover light scratches and swirl marks — maintaining a premium gloss.",
  },
  {
    abbr: "OC",
    name: "Optical Clarity",
    range: "99% transmission",
    body: "Virtually invisible once installed — colour, depth, and factory finish remain true.",
  },
] as const;

export const PPF_WHY_ADVANTAGES = [
  {
    title: "Experienced Installers",
    body: "Certified professionals deliver the finest installation outcomes for every type of vehicle.",
  },
  {
    title: "Tailored Coverage",
    body: "From partial panels to full-body wraps — protection designed around your car and your drive.",
  },
  {
    title: "Outstanding Service",
    body: "We strive to provide exceptional customer service at every step — from quote to install.",
  },
  {
    title: "Premium Finish",
    body: "High-gloss, virtually invisible film that keeps your paint looking new for years.",
  },
] as const;

export const PPF_ABOUT = [
  "Everyone values quality, particularly when it comes to automobiles. Sunkool paint protection film is engineered for owners who refuse to compromise on gloss, clarity, or long-term durability.",
  "Our aliphatic polyurethane films combine self-healing technology with UV-stable chemistry — protecting against stone chips, scratches, and environmental damage while maintaining a factory-fresh appearance.",
  "With experienced installers and a commitment to outstanding customer service, SUNKOOL continues to be the choice of discerning owners across India.",
] as const;
