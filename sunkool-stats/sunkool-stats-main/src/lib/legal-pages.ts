export const LEGAL_PAGES = [
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    description:
      "Terms and conditions governing use of the Sun Kool Solution website and services.",
    effectiveDate: "16 June 2026",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "How Sun Kool Solution collects, uses, and protects your personal information.",
    effectiveDate: "16 June 2026",
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    description:
      "Disclaimer regarding information, products, and services on the Sun Kool Solution website.",
    effectiveDate: "16 June 2026",
  },
] as const;

export type LegalPageSlug = (typeof LEGAL_PAGES)[number]["slug"];

export function getLegalPage(slug: string) {
  return LEGAL_PAGES.find((p) => p.slug === slug);
}
