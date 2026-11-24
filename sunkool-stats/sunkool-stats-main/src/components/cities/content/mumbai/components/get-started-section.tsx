import ProtectionStats from "@/components/cities/content/mumbai/components/protection-stats";
import { Eyebrow, Paragraph } from "@/components/cities/content/mumbai/components/landing-blocks";

export default function GetStartedSection() {
  return (
    <>
      {/* 9. Get Car Window Film in Mumbai */}
      <section className="get-started-section relative w-full overflow-hidden border-y border-white/10 bg-black">
        <div className="container-lux relative z-[1] py-16 sm:py-20 lg:py-28">
          <div className="grid gap-12 md:grid-cols-[47fr_45fr] md:items-center md:gap-10 lg:gap-16">
            <div className="reveal-fade-up">
              <Eyebrow color="kool">Get Started</Eyebrow>
              <h2 className="headline mt-3 text-balance text-[clamp(36px,6.5vw,68px)] leading-[1.05] sm:mt-4">
                <span className="text-[#f47521]">Get Car Window</span>
                <br />
                <span className="text-gradient-electric">Film in Mumbai</span>
              </h2>
              <Paragraph className="mt-6 max-w-[620px] font-bold">
                Wanting to install car window film in Mumbai? SUNKOOL provides nano-ceramic
                window films tailored to their heat rejection, UV blocking, visibility and signal
                safety properties. Don&rsquo;t just choose a film by judging its darkness &mdash;
                go by its VLT, TSER, IR rejection, UV rejection and vehicle suitability. Tell us
                about your car type, your needs and your preferred visibility level.
              </Paragraph>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                <a
                  href="https://www.sunkool.in/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-kool px-8 py-3.5 font-display text-base font-semibold text-black transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-lux)] hover:-translate-y-0.5 hover:bg-glow hover:shadow-xl hover:shadow-kool/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
                >
                  Get a Film Recommendation &rarr;
                </a>
              </div>
            </div>

            <ProtectionStats />
          </div>
        </div>
      </section>
    </>
  );
}
