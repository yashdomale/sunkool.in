import type { Category } from "./types";

/**
 * What the chatbot says about the interior film; the same facts as the /interior-ppf page. Deliberately
 * not in CATEGORIES: the comparison tool, the home page and the blog enquiry form's product list are
 * built from that list and stay as they are.
 */
export const INTERIOR_PROTECTION_FILM: Category = {
  slug: "interior-ppf",
  name: "Interior Protection Film",
  short: "Interior cabin protection",
  description:
    "Premium interior protection film — 195 micron thickness, 99% UV protection, scratch resistance, anti-yellow coating and stain resistance.",
  series: [
    {
      slug: "interior",
      name: "Interior Protection",
      blurb:
        "Invisible cabin protection engineered to preserve premium interiors.",
      products: [
        {
          slug: "interior-protection-film",
          name: "Interior Protection Film",
          tagline: "195 micron cabin protection",
          vlt: 99,
          tser: 0,
          ir: 0,
          uv: 99,
          accent: "#d4af37",
          note: "195 micron film with 99% UV protection, scratch resistance, anti-yellow coating and stain resistance.",
          thickness: "195 micron",
          highlightFeatures: [
            "3-Year Warranty",
            "99% UV Protection",
            "Scratch Resistant",
            "Anti-Yellow Coating",
            "Stain Resistant",
          ],
        },
      ],
    },
  ],
};
