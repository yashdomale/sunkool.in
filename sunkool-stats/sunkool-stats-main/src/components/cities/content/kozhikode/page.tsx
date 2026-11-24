import Hero from "@/components/cities/content/kozhikode/components/hero";
import WhyUseSection from "@/components/cities/content/kozhikode/components/why-use-section";
import HeatSection from "@/components/cities/content/kozhikode/components/heat-section";
import ComparisonSection from "@/components/cities/shared/comparison-section";
import NanoSection from "@/components/cities/content/kozhikode/components/nano-section";
import PerformanceSection from "@/components/cities/content/kozhikode/components/performance-section";
import FilmSelector from "@/components/cities/content/kozhikode/components/film-selector";
import InstallationSection from "@/components/cities/content/kozhikode/components/installation-section";
import InstallerSection from "@/components/cities/content/kozhikode/components/installer-section";
import GetStartedSection from "@/components/cities/content/kozhikode/components/get-started-section";
import FAQSection from "@/components/cities/content/kozhikode/components/faq-section";
import { faqs } from "@/components/cities/content/kozhikode/lib/faqs";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://www.sunkool.in/#organization", name: "SUNKOOL", url: "https://www.sunkool.in", logo: "https://www.sunkool.in/sunkool-wordmark.png" },
    { "@type": "Service", name: "Car Window Film in Kozhikode", serviceType: "Nano-Ceramic Car Window Film", provider: { "@id": "https://www.sunkool.in/#organization" }, areaServed: { "@type": "City", name: "Kozhikode" }, description: "SUNKOOL nano-ceramic window film for Kozhikode's heat, humidity and UV exposure." },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sunkool.in/" },
      { "@type": "ListItem", position: 2, name: "Kozhikode", item: "https://www.sunkool.in/kozhikode" }
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
