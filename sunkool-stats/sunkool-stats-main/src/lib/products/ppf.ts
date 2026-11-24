import type { Category } from "./types";

export const PPF: Category = {
  slug: "ppf",
  name: "PPF",
  short: "Paint protection film",
  description:
    "High-performance aliphatic polyurethane PPF — self-healing, UV-resistant, virtually invisible protection for a high-gloss finish.",
  series: [
    {
      slug: "core",
      name: "Paint Protection",
      blurb:
        "Clear aliphatic polyurethane film — self-adhesive, self-healing, and engineered to keep your gloss flawless.",
      products: [
        {
          slug: "hd07",
          name: "SUNKOOL HD07",
          tagline: "Invisible self-healing armour",
          vlt: 99,
          tser: 0,
          ir: 0,
          uv: 99,
          accent: "#c0c0c0",
          note: "7-mil TPU with rapid self-healing top coat.",
        },
        {
          slug: "signature",
          name: "SUNKOOL Signature Ultimate",
          tagline: "Limited lifetime warranty flagship PPF",
          vlt: 99,
          tser: 0,
          ir: 0,
          uv: 99,
          accent: "#f47521",
          note: "8-mil TPU · ≥140 GU gloss · hydrophobic (≥110° contact angle) · heat restorative healing.",
          thickness: "8 mil",
          highlightFeatures: [
            "Heat-Healing",
            "High Gloss Finish",
            "Hydrophobic",
            "Limited Lifetime Warranty",
          ],
        },
      ],
    },
  ],
};
