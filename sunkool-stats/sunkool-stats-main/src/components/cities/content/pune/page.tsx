import Hero from "@/components/cities/content/pune/components/hero";
import WhyUseSection from "@/components/cities/content/pune/components/why-use-section";
import HeatSection from "@/components/cities/content/pune/components/heat-section";
import ComparisonSection from "@/components/cities/content/pune/components/comparison-section";
import NanoSection from "@/components/cities/content/pune/components/nano-section";
import PerformanceSection from "@/components/cities/content/pune/components/performance-section";
import FilmSection from "@/components/cities/content/pune/components/film-section";
import InstallationSection from "@/components/cities/content/pune/components/installation-section";
import InstallerSection from "@/components/cities/content/pune/components/installer-section";
import GetStartedSection from "@/components/cities/content/pune/components/get-started-section";
import FAQSection from "@/components/cities/content/pune/components/faq-section";

export default function PunePage() {
  return (
    <>
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
      <FAQSection />
    </>
  );
}
