import Hero from "@/components/cities/content/rajkot/components/hero";
import WhyUseSection from "@/components/cities/content/rajkot/components/why-use-section";
import HeatSection from "@/components/cities/content/rajkot/components/heat-section";
import ComparisonSection from "@/components/cities/shared/comparison-section";
import NanoSection from "@/components/cities/content/rajkot/components/nano-section";
import PerformanceSection from "@/components/cities/content/rajkot/components/performance-section";
import FilmSelector from "@/components/cities/content/rajkot/components/film-selector";
import InstallationSection from "@/components/cities/content/rajkot/components/installation-section";
import InstallerSection from "@/components/cities/content/rajkot/components/installer-section";
import GetStartedSection from "@/components/cities/content/rajkot/components/get-started-section";
import FAQSection from "@/components/cities/content/rajkot/components/faq-section";
import { faqs } from "@/components/cities/content/rajkot/lib/faqs";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.sunkool.in/#organization",
      name: "SUNKOOL",
      url: "https://www.sunkool.in",
      logo: "https://www.sunkool.in/sunkool-wordmark.png",
    },
    {
      "@type": "Service",
      name: "Car Window Film Installation in Rajkot",
      serviceType: "Nano-Ceramic Car Window Film",
      provider: { "@id": "https://www.sunkool.in/#organization" },
      areaServed: { "@type": "City", name: "Rajkot" },
      description:
        "SUNKOOL nano-ceramic car window film installation in Rajkot, helping reduce cabin heat, glare and UV exposure while maintaining optical clarity and signal safety.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sunkool.in/" },
        { "@type": "ListItem", position: 2, name: "Window Film", item: "https://www.sunkool.in/window-film" },
        { "@type": "ListItem", position: 3, name: "Rajkot", item: "https://www.sunkool.in/rajkot" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <WhyUseSection />
      <HeatSection />
      <ComparisonSection />
      <NanoSection />
      <PerformanceSection />
      <FilmSelector />
      <InstallationSection />
      <InstallerSection />
      <GetStartedSection />
      <FAQSection />
    </>
  );
}
