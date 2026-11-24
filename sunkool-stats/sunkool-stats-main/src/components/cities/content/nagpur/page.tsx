import { templateCopy, type TemplateCity } from "@/components/cities/content/nagpur/copy";
import Hero from "@/components/cities/content/nagpur/components/hero";
import WhyUseSection from "@/components/cities/content/nagpur/components/why-use-section";
import HeatSection from "@/components/cities/content/nagpur/components/heat-section";
import ComparisonSection from "@/components/cities/shared/comparison-section";
import NanoSection from "@/components/cities/content/nagpur/components/nano-section";
import PerformanceSection from "@/components/cities/content/nagpur/components/performance-section";
import FilmSelector from "@/components/cities/content/nagpur/components/film-selector";
import InstallationSection from "@/components/cities/content/nagpur/components/installation-section";
import InstallerSection from "@/components/cities/content/nagpur/components/installer-section";
import GetStartedSection from "@/components/cities/content/nagpur/components/get-started-section";
import FAQSection from "@/components/cities/content/nagpur/components/faq-section";

/** Renders Nagpur, Amritsar, Chennai and Delhi; each city's words and images are in ./copy/<city>.ts. */
export default function Home({ city = "nagpur" }: { city?: TemplateCity }) {
  const copy = templateCopy[city];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(copy.structuredData) }} />
      <Hero copy={copy.hero} />
      <WhyUseSection copy={copy.whyUse} />
      <HeatSection copy={copy.heat} />
      <ComparisonSection glareClassName="text-[#f47521]" />
      <NanoSection copy={copy.nano} />
      <PerformanceSection copy={copy.performance} />
      <FilmSelector copy={copy.film} />
      <InstallationSection copy={copy.installation} />
      <InstallerSection city={city} copy={copy.installer} />
      <GetStartedSection copy={copy.getStarted} />
      <FAQSection faqs={copy.faqs} />
    </>
  );
}
