import BeforeAfterSlider from "@/components/cities/content/bangalore/components/before-after-slider";
import { Eyebrow, SectionHeading, Paragraph } from "@/components/cities/content/mumbai/components/landing-blocks";

export default function ComparisonSection() {
  return (
    <>
      {/* 4. Before / After */}
      <section className="comparison-section relative w-full border-t border-white/10">
        <div className="comparison-section__inner container-lux py-16 sm:py-20 lg:py-28">
          <div className="comparison-section__content mx-auto max-w-[720px] text-center">
            <Eyebrow color="white">See The Difference</Eyebrow>
            <SectionHeading>
              <span className="text-[#f47521]">Reduced Glare.</span>{" "}
              <span className="text-gradient-electric">Cooler Cabin.</span>
            </SectionHeading>
            <Paragraph className="mx-auto mt-6 max-w-[560px] font-bold">
              Drag the slider to see how SUNKOOL nano-ceramic film changes the light coming
              through the glass.
            </Paragraph>
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
    </>
  );
}
