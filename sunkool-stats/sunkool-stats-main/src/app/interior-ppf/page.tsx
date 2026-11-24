import type { Metadata } from "next";
import { InteriorPpfView } from "@/components/interior-ppf/interior-ppf-view";
import { productSchema, breadcrumbSchema } from "@/lib/schema";

const INTERIOR_PPF_PRODUCT_SCHEMA = productSchema({
  name: "SUNKOOL Interior PPF",
  description:
    "Premium interior protection film — 195 micron thickness, 99% UV protection, scratch resistance, anti-yellow coating and stain resistance.",
  image: "/images/interior-ppf/hero.jpg",
  properties: [
    { name: "UV Protection", value: "99%" },
    { name: "Thickness", value: "195 micron" },
    { name: "Warranty", value: "3 years" },
  ],
});

const INTERIOR_PPF_BREADCRUMB_SCHEMA = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Interior PPF", path: "/interior-ppf" },
]);

export const metadata: Metadata = {
  title: {
    absolute: "Interior PPF | Premium Interior Protection Film | Sunkool",
  },
  description:
    "Sunkool Interior PPF offers 3-year warranty, 195 micron thickness, 99% UV protection, scratch resistance, anti-yellow coating, stain resistance, and long-lasting interior protection.",
  alternates: { canonical: "/interior-ppf" },
  openGraph: {
    title: "Interior PPF | Premium Interior Protection Film | Sunkool",
    description:
      "Sunkool Interior PPF offers 3-year warranty, 195 micron thickness, 99% UV protection, scratch resistance, anti-yellow coating, stain resistance, and long-lasting interior protection.",
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function InteriorPpfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(INTERIOR_PPF_PRODUCT_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(INTERIOR_PPF_BREADCRUMB_SCHEMA),
        }}
      />
      <InteriorPpfView />
    </>
  );
}
