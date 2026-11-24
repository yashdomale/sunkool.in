import type { Metadata } from "next";
import { TechDemoExperience } from "@/components/experience/tech-demo-experience";
import { LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";
import { Categories } from "@/components/home/categories";
import { StatsCTA, StatsGrid } from "@/components/home/stats-cta";
import { FeatureHighlights } from "@/components/home/feature-highlights";
import { HomeFaq } from "@/components/home/home-faq";
import { WINDOW_FILM } from "@/lib/products";

// Home "collection" cards: the window film series, each linking to its section
// on /window-film (those sections carry id={series.slug}).
const HOME_SERIES_SLUGS = ["legend", "elite", "sk-series", "signature"] as const;
const HOME_CATEGORIES = HOME_SERIES_SLUGS.map((slug) => {
  const series = WINDOW_FILM.series.find((s) => s.slug === slug)!;
  return {
    slug,
    href: `/${WINDOW_FILM.slug}#${slug}`,
    name: series.name,
    description: series.blurb,
    productCount: series.products.length,
  };
});
export const metadata: Metadata = {
  title: {
    absolute: "Heat Control Glazing & Paint Protection Film | SUNKOOL",
  },
  description:
    "SUNKOOL builds premium automotive window films, paint protection films and nano-ceramic heat rejection technology engineered for extreme conditions. Serving Nagpur, Maharashtra.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Heat Control Glazing & Paint Protection Film",
    description:
      "Premium automotive window films, paint protection films and nano-ceramic heat rejection technology — Nagpur, Maharashtra.",
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <TechDemoExperience>
        <Categories categories={HOME_CATEGORIES} />
        <StatsCTA features={<FeatureHighlights lead={<StatsGrid />} />} />
        <HomeFaq />
      </TechDemoExperience>
    </>
  );
}
