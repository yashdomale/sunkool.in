import Hero from "@/components/cities/content/surat/components/hero";
import WhyUseSection from "@/components/cities/content/surat/components/why-use-section";
import HeatSection from "@/components/cities/content/surat/components/heat-section";
import ComparisonSection from "@/components/cities/shared/comparison-section";
import NanoSection from "@/components/cities/content/surat/components/nano-section";
import PerformanceSection from "@/components/cities/content/surat/components/performance-section";
import FilmSelector from "@/components/cities/content/surat/components/film-selector";
import InstallationSection from "@/components/cities/content/surat/components/installation-section";
import InstallerSection from "@/components/cities/content/surat/components/installer-section";
import GetStartedSection from "@/components/cities/content/surat/components/get-started-section";
import FAQSection from "@/components/cities/content/surat/components/faq-section";
import { faqs } from "@/components/cities/content/surat/lib/faqs";

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
      name: "Car Window Film in Surat",
      serviceType: "Nano-Ceramic Car Window Film",
      provider: { "@id": "https://www.sunkool.in/#organization" },
      areaServed: { "@type": "City", name: "Surat" },
      description:
        "SUNKOOL nano-ceramic window film for Surat's heat, humidity and UV exposure, helping reduce cabin heat and glare while maintaining clarity and signal safety.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sunkool.in/" },
        { "@type": "ListItem", position: 2, name: "Window Film", item: "https://www.sunkool.in/window-film" },
        { "@type": "ListItem", position: 3, name: "Surat", item: "https://www.sunkool.in/surat" },
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
