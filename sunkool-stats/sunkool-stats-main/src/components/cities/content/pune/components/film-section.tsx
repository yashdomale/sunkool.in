import FilmSelector from "@/components/cities/content/pune/components/film-selector";
import { Eyebrow, SectionHeading, SubHeading, Paragraph, CtaLink } from "@/components/cities/content/pune/components/landing-blocks";
import { films } from "@/components/cities/content/pune/lib/content";

export default function FilmSection() {
  return (
    <>
      {/* 7. Choose Your Film */}
      <section className="relative w-full border-t border-white/10 bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28">
          <Eyebrow color="kool">Choose Your Film</Eyebrow>
          <SectionHeading>
            <span className="text-[#f47521]">Choose the Right Window</span>{" "}
            <span className="text-gradient-electric">Film for Your Car in Pune</span>
          </SectionHeading>

          <Paragraph className="mt-6 max-w-[760px]">
            Different vehicles and driving conditions require different film specifications.
            Don&rsquo;t solely rely on the darkness of the window film when selecting it.
          </Paragraph>

          <FilmSelector films={films} />

          <p className="mt-4 text-sm leading-relaxed text-fog">
            The published specifications are product-level figures and may vary between
            batches.
          </p>

          <div className="mt-14 sm:mt-16 lg:mt-20">
            <SubHeading>Prefer a lighter appearance?</SubHeading>
            <Paragraph className="mt-3">
              HD 70 or SK 70 may be considered when visibility and a lighter appearance are
              important.
            </Paragraph>
          </div>

          <div className="reveal-fade-up mt-8 rounded-2xl border border-sun/30 bg-gradient-to-r from-black via-sun/10 to-sun/25 p-6 sm:p-7">
            <p className="text-[15px] leading-loose text-silver-soft sm:text-base sm:leading-loose">
              <span className="font-semibold text-sun">VLT &amp; Regulations:</span> SUNKOOL&rsquo;s
              regulations information references CMVR Rule 100 and IS 2553 (Part 2): 2019
              (Revision 1) for vehicle glazing and VLT requirements. The final VLT is
              determined by the combination of the original vehicle glass and the applied
              film — a film labelled with a particular VLT percentage does not necessarily
              mean the finished vehicle glass will have the same VLT. Confirm current
              applicable requirements before installing window film.
            </p>
          </div>

          <CtaLink href="/contact">
            Not sure which film is suitable for your vehicle? Ask SUNKOOL &rarr;
          </CtaLink>
        </div>
      </section>
    </>
  );
}
