import Hero from "@/components/cities/content/ahmedabad/components/hero";
import WhyUseSection from "@/components/cities/content/ahmedabad/components/why-use-section";
import HeatSection from "@/components/cities/content/ahmedabad/components/heat-section";
import ComparisonSection from "@/components/cities/shared/comparison-section";
import NanoSection from "@/components/cities/content/ahmedabad/components/nano-section";
import PerformanceSection from "@/components/cities/content/ahmedabad/components/performance-section";
import FilmSelector from "@/components/cities/content/ahmedabad/components/film-selector";
import InstallationSection from "@/components/cities/content/ahmedabad/components/installation-section";
import InstallerSection from "@/components/cities/content/ahmedabad/components/installer-section";
import GetStartedSection from "@/components/cities/content/ahmedabad/components/get-started-section";
import FAQSection from "@/components/cities/content/ahmedabad/components/faq-section";
import { faqs } from "@/components/cities/content/ahmedabad/lib/faqs";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.sunkool.in/#organization",
      name: "SUNKOOL",
      url: "https://www.sunkool.in",
      logo: "https://www.sunkool.in/logo.png",
    },
    {
      "@type": "Service",
      name: "Car Window Film Installation in Ahmedabad",
      serviceType: "Nano-Ceramic Car Window Film",
      provider: { "@id": "https://www.sunkool.in/#organization" },
      areaServed: { "@type": "City", name: "Ahmedabad" },
      description:
        "SUNKOOL nano-ceramic car window film installation in Ahmedabad, helping reduce cabin heat, glare and UV exposure while maintaining optical clarity and signal safety.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sunkool.in/" },
        { "@type": "ListItem", position: 2, name: "Window Film", item: "https://www.sunkool.in/window-film" },
        { "@type": "ListItem", position: 3, name: "Ahmedabad", item: "https://www.sunkool.in/ahmedabad" },
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
      <ComparisonSection glareClassName="text-[#f47521]" />
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
