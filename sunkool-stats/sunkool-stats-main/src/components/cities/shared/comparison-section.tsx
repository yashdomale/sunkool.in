import Reveal from "./reveal";
import ComparisonSlider from "./comparison-slider";

/** `glareClassName` colours "Reduced Glare." - a few cities use the raw brand orange instead of text-sun. */
export default function ComparisonSection({ glareClassName = "text-sun" }: { glareClassName?: string }) {
  return (
    <section className="comparison-section relative w-full border-t border-white/10">
      <div className="comparison-section__inner container-lux py-16 sm:py-20 lg:py-28">
        <div className="comparison-section__content mx-auto max-w-[720px] text-center">
          <Reveal as="p" className="eyebrow text-white">
            See The Difference
          </Reveal>
          <Reveal
            as="h2"
            className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
          >
            <span className={glareClassName}>Reduced Glare.</span> <span className="text-gradient-electric">Cooler Cabin.</span>
          </Reveal>
          <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mx-auto mt-6 max-w-[560px]">
            Drag the slider to see how SUNKOOL nano-ceramic film changes the light coming through the glass.
          </p>
        </div>
        <div className="comparison-section__slider-wrapper mt-10">
          <ComparisonSlider />
        </div>
      </div>
    </section>
  );
}
