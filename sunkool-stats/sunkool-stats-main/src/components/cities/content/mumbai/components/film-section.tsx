import FilmSelector from "@/components/cities/content/mumbai/components/film-selector";
import { Eyebrow, SectionHeading, SubHeading, Paragraph, CtaLink } from "@/components/cities/content/mumbai/components/landing-blocks";
import { films } from "@/components/cities/content/mumbai/lib/content";

export default function FilmSection() {
  return (
    <>
      {/* 7. Choose Your Film */}
      <section className="relative w-full border-t border-white/10 bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28">
          <Eyebrow color="kool">Choose Your Film</Eyebrow>
          <SectionHeading>
            <span className="text-[#f47521]">Choose the Right Window</span>{" "}
            <span className="text-gradient-electric">Film for Your Car in Mumbai</span>
          </SectionHeading>

          <Paragraph className="mt-6 max-w-[760px] font-bold">
            There isn&rsquo;t one window film that is automatically right for every car. Your
            choice should depend on your vehicle&rsquo;s existing glass, required VLT, driving
            conditions and preferred level of heat rejection &mdash; not darkness alone.
          </Paragraph>

          <FilmSelector films={films} />

          <p className="mt-4 text-sm leading-relaxed text-fog">
            The published specifications are based on SUNKOOL&rsquo;s product information and
            may vary between batches.
          </p>

          <div className="mt-14 sm:mt-16 lg:mt-20">
            <SubHeading>Prefer a lighter appearance?</SubHeading>
            <Paragraph className="mt-3">
              HD 70 or SK 70 may be considered when visibility and a lighter appearance are
              important.
            </Paragraph>
          </div>

          <CtaLink href="https://www.sunkool.in/contact">
            Not sure which film suits your car? Get a recommendation from SUNKOOL &rarr;
          </CtaLink>

          <div className="reveal-fade-up mt-8 rounded-2xl border border-sun/30 bg-gradient-to-r from-black via-sun/10 to-sun/25 p-6 sm:p-7">
            <p className="text-[15px] leading-loose text-silver-soft sm:text-base sm:leading-loose">
              <span className="font-semibold text-sun">Is Car Window Film Legal in Mumbai?</span>{" "}
              SUNKOOL&rsquo;s regulations information references CMVR Rule 100 and IS 2553
              (Part 2): 2019 (Revision 1) for vehicle glazing and VLT standards. The VLT of your
              vehicle&rsquo;s glass itself is important, and not just the VLT advertised on the
              film packet &mdash; choosing window tint based on the film&rsquo;s VLT alone may be
              incorrect. Vehicle-glass regulations and enforcement requirements can change, so
              confirm the current applicable requirements and the final VLT of your vehicle
              glass before installation.
            </p>
          </div>

          <CtaLink href="https://www.sunkool.in/window-film">
            Check the latest regulations before installation &rarr;
          </CtaLink>
        </div>
      </section>
    </>
  );
}
