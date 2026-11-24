import Hero from "@/components/cities/content/bhopal/components/hero";
import WhyUseSection from "@/components/cities/content/bhopal/components/why-use-section";
import HeatSection from "@/components/cities/content/bhopal/components/heat-section";
import ComparisonSection from "@/components/cities/shared/comparison-section";
import NanoSection from "@/components/cities/content/bhopal/components/nano-section";
import PerformanceSection from "@/components/cities/content/bhopal/components/performance-section";
import FilmSelector from "@/components/cities/content/bhopal/components/film-selector";
import InstallationSection from "@/components/cities/content/bhopal/components/installation-section";
import InstallerSection from "@/components/cities/content/bhopal/components/installer-section";
import GetStartedSection from "@/components/cities/content/bhopal/components/get-started-section";
import FAQSection from "@/components/cities/content/bhopal/components/faq-section";
import { faqs } from "@/components/cities/content/bhopal/lib/faqs";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://www.sunkool.in/#organization", name: "SUNKOOL", url: "https://www.sunkool.in", logo: "https://www.sunkool.in/sunkool-wordmark.png" },
    { "@type": "Service", name: "Car Window Film in Bhopal", serviceType: "Nano-Ceramic Car Window Film", provider: { "@id": "https://www.sunkool.in/#organization" }, areaServed: { "@type": "City", name: "Bhopal" }, description: "SUNKOOL nano-ceramic window film for Bhopal's heat, sun and city traffic." },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sunkool.in/" },
      { "@type": "ListItem", position: 2, name: "Bhopal", item: "https://www.sunkool.in/bhopal" }
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
