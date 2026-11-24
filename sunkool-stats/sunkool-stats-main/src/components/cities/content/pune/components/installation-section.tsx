import Link from "next/link";
import Image from "next/image";
import SpotlightCard from "@/components/cities/content/pune/components/spotlight-card";
import SpotlightGrid from "@/components/cities/content/pune/components/spotlight-grid";
import { Eyebrow, SectionHeading, Paragraph, CtaLink } from "@/components/cities/content/pune/components/landing-blocks";
import { installSteps } from "@/components/cities/content/pune/lib/content";

export default function InstallationSection() {
  return (
    <>
      {/* 8. Professional Installation Process */}
      <section className="section-glow-bg relative w-full border-t border-white/10 bg-black">
        <div className="mx-auto w-full max-w-[1500px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <Eyebrow color="kool" bold>
                Professional Installation Process
              </Eyebrow>
              <SectionHeading>
                <span className="text-[#f47521]">Professional Car Window</span>
                <br />
                <span className="text-gradient-electric">Film Installation in Pune</span>
              </SectionHeading>

              <Paragraph className="mt-6 max-w-[680px] lg:max-w-none">
                Even high-quality film can deliver a poor result if it is incorrectly installed.
                Professional installation helps ensure proper glass preparation, accurate film
                positioning, clean edges, minimal visual distortion and a consistent finish.
              </Paragraph>

              <div className="mt-8 flex flex-row flex-wrap items-center gap-4 sm:gap-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-kool px-8 py-3.5 font-display text-base font-semibold text-black transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-lux)] hover:-translate-y-0.5 hover:bg-glow hover:shadow-xl hover:shadow-kool/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Book Professional Installation
                </Link>
                <CtaLink href="/contact" className="">
                  Talk to SUNKOOL About Installation &rarr;
                </CtaLink>
              </div>
            </div>

            <div className="reveal-fade-up relative aspect-[16/10] w-full">
              <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/10">
                <Image
                  src="/images/cities/pune/professional.png"
                  alt="Professional technician installing SUNKOOL window film on a car"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
                  style={{
                    background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
              </div>
            </div>
          </div>

          <SpotlightGrid className="mt-14">
            <div className="reveal-stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {installSteps.map((step, index) => (
                <SpotlightCard
                  key={step.title}
                  className="reveal-card reveal-card-kool rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <span className="reveal-card-icon text-gradient-electric font-display text-3xl font-extrabold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-gradient-silver mt-3 font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-silver-soft">
                    {step.description}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </SpotlightGrid>
        </div>
      </section>
    </>
  );
}
