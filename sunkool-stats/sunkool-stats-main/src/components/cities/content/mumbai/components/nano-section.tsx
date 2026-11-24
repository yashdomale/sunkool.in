import Image from "next/image";
import GlowCard from "@/components/cities/content/mumbai/components/glow-card";
import StatReveal from "@/components/cities/content/mumbai/components/stat-reveal";
import { Icon } from "@/components/cities/content/mumbai/components/landing-icons";
import { Eyebrow, SectionHeading, Paragraph, CtaLink } from "@/components/cities/content/mumbai/components/landing-blocks";
import { filmLayers, nanoStats, whySunkoolFeatures } from "@/components/cities/content/mumbai/lib/content";

export default function NanoSection() {
  return (
    <>
      {/* 5. SUNKOOL Nano-Ceramic Technology */}
      <section className="relative w-full overflow-hidden border-t border-white/10 bg-black">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 70% at 50% -10%, rgba(58,130,195,0.55) 0%, rgba(40,100,160,0.28) 35%, rgba(0,0,0,0) 75%)",
          }}
        />
        <div className="mx-auto w-full max-w-[1400px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div>
            <Eyebrow color="white">Why SUNKOOL for Car Window Film in Mumbai?</Eyebrow>
            <SectionHeading>
              <span className="text-[#f47521]">More Than Just</span>
              <br />
              <span className="text-gradient-electric">Dark Glass.</span>
            </SectionHeading>

            <Paragraph className="mt-6 w-full max-w-[1200px] text-left font-bold">
              A darker window doesn&rsquo;t necessarily equal superior heat rejection.
              Standard window tinting usually pays more attention to aesthetics, but darkness
              is not the only specification to consider when selecting a film.
            </Paragraph>
            <Paragraph className="mt-4 w-full max-w-[1200px] text-left font-bold">
              Nano-ceramic films are developed in a completely different way &mdash; ceramic
              particles are incorporated into the film structure to achieve infrared heat
              rejection while still allowing transparency and signals to pass through. Important
              specifications include heat rejection, infrared rejection, UV rejection, VLT,
              optical clarity, signal compatibility, film durability and installation quality.
            </Paragraph>

            <div className="content-layout mt-10">
              <div className="summary-grid reveal-stagger">
                {whySunkoolFeatures.map((feature) => (
                  <GlowCard
                    key={feature.title}
                    cornerGlow
                    className="summary-card rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <span className="glow-card-icon text-kool">
                      <Icon name={feature.icon} />
                    </span>
                    <p className="text-gradient-silver mt-3 font-display text-base font-semibold sm:text-lg">
                      {feature.title}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-silver-soft sm:text-sm">
                      {feature.description}
                    </p>
                  </GlowCard>
                ))}
              </div>

              <Image
                src="/images/layer.png"
                alt={`Exploded view of the SUNKOOL nano-ceramic film's five layers: ${filmLayers
                  .map((layer) => layer.title)
                  .join(", ")}`}
                width={500}
                height={410}
                className="summary-image reveal-fade-up border border-white/10"
              />
            </div>
          </div>

          <div className="reveal-stagger mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-12 sm:grid-cols-3 lg:grid-cols-6">
            {nanoStats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-4">
                <span className="text-kool">
                  <Icon name={stat.icon} />
                </span>
                <div>
                  <p className="text-gradient-silver font-display text-base font-semibold sm:text-lg">
                    <StatReveal value={stat.value} index={index} />
                  </p>
                  <p className="text-sm text-silver-soft">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-fog">
            *Values vary based on film series and VLT selected.
          </p>

          <CtaLink href="https://www.sunkool.in/window-film">Explore SUNKOOL Window Films &rarr;</CtaLink>
        </div>
      </section>
    </>
  );
}
