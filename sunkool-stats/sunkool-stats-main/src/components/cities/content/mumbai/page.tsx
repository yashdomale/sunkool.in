import { faqs } from "@/components/cities/content/mumbai/lib/content";
import Hero from "@/components/cities/content/mumbai/components/hero";
import WhyUseSection from "@/components/cities/content/mumbai/components/why-use-section";
import HeatSection from "@/components/cities/content/mumbai/components/heat-section";
import ComparisonSection from "@/components/cities/content/mumbai/components/comparison-section";
import NanoSection from "@/components/cities/content/mumbai/components/nano-section";
import PerformanceSection from "@/components/cities/content/mumbai/components/performance-section";
import FilmSection from "@/components/cities/content/mumbai/components/film-section";
import InstallationSection from "@/components/cities/content/mumbai/components/installation-section";
import InstallerSection from "@/components/cities/content/mumbai/components/installer-section";
import GetStartedSection from "@/components/cities/content/mumbai/components/get-started-section";
import FaqSection from "@/components/cities/content/mumbai/components/faq-section";

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
      name: "Car Window Film Installation in Mumbai",
      serviceType: "Nano-Ceramic Car Window Film",
      provider: { "@id": "https://www.sunkool.in/#organization" },
      areaServed: { "@type": "City", name: "Mumbai" },
      description:
        "SUNKOOL nano-ceramic car window film installation in Mumbai, helping reduce cabin heat, glare and UV exposure while maintaining optical clarity and signal safety.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sunkool.in/" },
        { "@type": "ListItem", position: 2, name: "Window Film", item: "https://www.sunkool.in/window-film" },
        { "@type": "ListItem", position: 3, name: "Mumbai", item: "https://www.sunkool.in/mumbai" },
      ],
    },
    {
      "@type": "ImageObject",
      contentUrl: "https://www.sunkool.in/images/cities/mumbai/mumbai-skyline-traffic.png",
      description:
        "Mumbai coastal skyline and expressway traffic near the Bandra-Worli Sea Link at golden hour",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <WhyUseSection />
      <HeatSection />
      <ComparisonSection />
      <NanoSection />
      <PerformanceSection />
      <FilmSection />
      <InstallationSection />
      <InstallerSection />
      <GetStartedSection />
      <FaqSection />
    </>
  );
}
