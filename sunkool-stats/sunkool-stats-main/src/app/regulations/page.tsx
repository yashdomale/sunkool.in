import type { Metadata } from "next";
import { RegulationsView } from "@/components/regulations/regulations-view";

export const metadata: Metadata = {
  title: "Regulations",
  description:
    "SUNKOOL CMVR certificate, IS 2553 side-window compliance, and transparency checks for road-legal window film in India.",
  alternates: { canonical: "/regulations" },
  openGraph: {
    title: "Window Film Regulations & Compliance — SUNKOOL",
    description:
      "SUNKOOL CMVR certificate, IS 2553 side-window compliance, and transparency checks for road-legal window film in India.",
    images: ["/opengraph-image"],
  },
};

export default function RegulationsPage() {
  return <RegulationsView />;
}
