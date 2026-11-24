import Hero from "@/components/cities/content/bangalore/components/hero";
import WhyUseSection from "@/components/cities/content/bangalore/components/why-use-section";
import HeatSection from "@/components/cities/content/bangalore/components/heat-section";
import ComparisonSection from "@/components/cities/content/bangalore/components/comparison-section";
import NanoSection from "@/components/cities/content/bangalore/components/nano-section";
import PerformanceSection from "@/components/cities/content/bangalore/components/performance-section";
import FilmSelector from "@/components/cities/content/bangalore/components/film-selector";
import InstallationSection from "@/components/cities/content/bangalore/components/installation-section";
import InstallerSection from "@/components/cities/content/bangalore/components/installer-section";
import GetStartedSection from "@/components/cities/content/bangalore/components/get-started-section";
import FAQSection from "@/components/cities/content/bangalore/components/faq-section";

export default function BangalorePage() {
  return (
    <>
      <Hero />
      <WhyUseSection />
      <HeatSection />
      <ComparisonSection />
      <NanoSection />
      <PerformanceSection />

      {/* Choose Your Film */}
      <section className="relative w-full border-t border-white/10 bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28">
          <p className="reveal-fade-up eyebrow text-kool">Choose Your Film</p>
          <h2 className="reveal-fade-up headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]">
            <span className="text-[#f47521]">Choose the Right Window</span>{" "}
            <span className="text-gradient-electric">Film for Your Car in Banglore</span>
          </h2>
          <p className="text-[16px] leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6 max-w-[760px]">
            Different vehicles and driving conditions require different film specifications. Don&rsquo;t
            solely rely on the darkness of the window film when selecting it.
          </p>

          <FilmSelector />
        </div>
      </section>

      <InstallationSection />
      <InstallerSection />
      <GetStartedSection />
      <FAQSection />
    </>
  );
}
