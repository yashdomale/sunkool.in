import type { Metadata } from "next";
import { WarrantyView } from "@/components/warranty/warranty-view";

export const metadata: Metadata = {
  title: {
    absolute: "SUNKOOL Warranty & Product Authenticity Check",
  },
  description:
    "Verify your SUNKOOL warranty or register a new installation. Check coverage by mobile, chassis, or car number and follow our step-by-step registration guide.",
  alternates: { canonical: "/warranty" },
  openGraph: {
    title: "SUNKOOL Warranty & Product Authenticity Check",
    description:
      "Verify your SUNKOOL warranty or register a new installation. Check coverage by mobile, chassis, or car number.",
    images: ["/opengraph-image"],
  },
};

export default function WarrantyPage() {
  return <WarrantyView />;
}
