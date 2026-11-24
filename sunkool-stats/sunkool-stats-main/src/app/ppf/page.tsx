import type { Metadata } from "next";
import { PpfView } from "@/components/ppf/ppf-view";
import { productSchema, breadcrumbSchema } from "@/lib/schema";

const PPF_PRODUCT_SCHEMA = productSchema({
  name: "SUNKOOL Paint Protection Film (PPF)",
  description:
    "Self-healing aliphatic polyurethane PPF — HD07 and Signature Ultimate series — protecting paint from stone chips, scratches and UV.",
  image: "/images/ppf/signature-hero.jpg",
  properties: [
    { name: "UV Protection", value: "99%" },
    { name: "Film Thickness", value: "7 mil" },
    { name: "Self-Healing", value: "100%" },
  ],
});

const PPF_BREADCRUMB_SCHEMA = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Paint Protection Film", path: "/ppf" },
]);

export const metadata: Metadata = {
  title: {
    absolute: "Paint Protection Film (PPF) in Nagpur — HD07 & Signature | SUNKOOL",
  },
  description:
    "SUNKOOL PPF — self-healing aliphatic polyurethane film that protects your paint from stone chips, scratches and UV. Virtually invisible, high-gloss finish.",
  alternates: { canonical: "/ppf" },
  openGraph: {
    title: "Paint Protection Film (PPF) in Nagpur — SUNKOOL HD07 & Signature",
    description:
      "Self-healing aliphatic polyurethane PPF that shields your paint from stone chips, scratches and UV — virtually invisible, high-gloss finish.",
    images: ["/opengraph-image"],
  },
};

export default function PpfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PPF_PRODUCT_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PPF_BREADCRUMB_SCHEMA) }}
      />
      <PpfView />
    </>
  );
}
