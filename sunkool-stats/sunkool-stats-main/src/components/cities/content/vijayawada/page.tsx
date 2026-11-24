import Hero from "@/components/cities/content/vijayawada/components/hero";
import WhyUseSection from "@/components/cities/content/vijayawada/components/why-use-section";
import HeatSection from "@/components/cities/content/vijayawada/components/heat-section";
import ComparisonSection from "@/components/cities/shared/comparison-section";
import NanoSection from "@/components/cities/content/vijayawada/components/nano-section";
import PerformanceSection from "@/components/cities/content/vijayawada/components/performance-section";
import FilmSelector from "@/components/cities/content/vijayawada/components/film-selector";
import InstallationSection from "@/components/cities/content/vijayawada/components/installation-section";
import InstallerSection from "@/components/cities/content/vijayawada/components/installer-section";
import GetStartedSection from "@/components/cities/content/vijayawada/components/get-started-section";
import FAQSection from "@/components/cities/content/vijayawada/components/faq-section";
import { faqs } from "@/components/cities/content/vijayawada/lib/faqs";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://www.sunkool.in/#organization", name: "SUNKOOL", url: "https://www.sunkool.in", logo: "https://www.sunkool.in/sunkool-wordmark.png" },
    { "@type": "Service", name: "Car Window Film in Vijayawada", serviceType: "Nano-Ceramic Car Window Film", provider: { "@id": "https://www.sunkool.in/#organization" }, areaServed: { "@type": "City", name: "Vijayawada" }, description: "SUNKOOL nano-ceramic window film for Vijayawada's heat, glare and UV exposure." },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sunkool.in/" },
      { "@type": "ListItem", position: 2, name: "Vijayawada", item: "https://www.sunkool.in/vijayawada" }
    ] },
    { "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
  ]
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
