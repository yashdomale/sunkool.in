import BeforeAfterSlider from "@/components/cities/content/bangalore/components/before-after-slider";

export default function ComparisonSection() {
  return (
    <section className="comparison-section relative w-full border-t border-white/10">
      <div className="comparison-section__inner container-lux py-16 sm:py-20 lg:py-28">
        <div className="comparison-section__content mx-auto max-w-[720px] text-center">
          <p className="reveal-fade-up eyebrow text-sun">See The Difference</p>
          <h2 className="reveal-fade-up headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]">
            <span className="text-[#f47521]">Reduced Glare.</span> <span className="text-gradient-electric">Cooler Cabin.</span>
          </h2>
          <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mx-auto mt-6 max-w-[560px]">
            Drag the slider to see how SUNKOOL nano-ceramic film changes the light coming through the glass.
          </p>
        </div>
        <div className="comparison-section__slider-wrapper mt-10">
          <BeforeAfterSlider
            beforeSrc="/images/windshield-before.jpg"
            afterSrc="/images/windshield-after.jpg"
            beforeAlt="Harsh sunlight and glare through a car windshield without SUNKOOL window film"
            afterAlt="Reduced glare and a cooler cabin through a car windshield with SUNKOOL nano-ceramic window film"
          />
        </div>
      </div>
    </section>
  );
}
