import Image from "next/image";
import GlowCard from "@/components/cities/content/mumbai/components/glow-card";
import { Paragraph } from "@/components/cities/content/mumbai/components/landing-blocks";
import { installSteps } from "@/components/cities/content/mumbai/lib/content";

export default function InstallationSection() {
  return (
    <>
      {/* 8. Professional Installation Process */}
      <section className="section-glow-bg relative w-full border-t border-white/10">
        <div className="mx-auto w-full max-w-[1500px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* Text column */}
            <div>
              <p className="reveal-fade-up eyebrow font-bold text-kool">
                Professional Installation Process
              </p>
              <h2 className="reveal-fade-up headline text-gradient-silver text-balance mt-4 text-[clamp(2.5rem,4.5vw,4.25rem)]">
                <span className="text-[#f47521]">Professional Car Window</span>
                <br />
                <span className="text-gradient-electric">Film Installation in Mumbai</span>
              </h2>

              <Paragraph className="mt-6 max-w-[680px] font-bold lg:max-w-none">
                A good film application relies not only on the film itself but on every step
                around it. The installation affects the look of the film, its optical
                properties and its durability.
              </Paragraph>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href="https://www.sunkool.in/contact"
                  className="inline-flex items-center justify-center rounded-full bg-kool px-8 py-3.5 font-display text-base font-semibold text-black transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-lux)] hover:-translate-y-0.5 hover:bg-glow hover:shadow-xl hover:shadow-kool/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Book Professional Installation
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=917028146972&text=Hi+SUNKOOL%2C+I%E2%80%99m+interested+in+professional+window+film+installation+for+my+car.+Please+share+the+details.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-sm text-base font-semibold text-kool transition-colors hover:text-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Talk to SUNKOOL About Installation &rarr;
                </a>
              </div>
            </div>

            {/* Photo column */}
            <div className="installation-photo reveal-fade-up relative aspect-[16/10] w-full">
              <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/10">
                <Image
                  src="/images/installation-hero.jpg"
                  alt="Professional technician installing window film on a car."
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="reveal-stagger mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {installSteps.map((step, index) => (
              <GlowCard
                key={step.title}
                cornerGlow
                className="reveal-card reveal-card-kool rounded-[18px] border border-white/10 bg-white/[0.03] p-7"
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
              </GlowCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
