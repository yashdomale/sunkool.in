import SpotlightCard from "@/components/cities/content/pune/components/spotlight-card";
import NanoLayerStack from "@/components/cities/content/pune/components/nano-layer-stack";
import StatReveal from "@/components/cities/content/pune/components/stat-reveal";
import { Eyebrow, SectionHeading, Paragraph } from "@/components/cities/content/pune/components/landing-blocks";
import { Icon } from "@/components/cities/content/pune/components/landing-icons";
import { filmLayers, nanoStats, whySunkoolFeatures } from "@/components/cities/content/pune/lib/content";

export default function NanoSection() {
  return (
    <>
      {/* 5. SUNKOOL Nano-Ceramic Technology */}
      <section className="section-glow-bg relative w-full overflow-hidden border-t border-white/10 bg-black">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 70% at 50% -10%, rgba(58,130,195,0.55) 0%, rgba(40,100,160,0.28) 35%, rgba(0,0,0,0) 75%)",
          }}
        />
        <div className="mx-auto w-full max-w-[1400px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <Eyebrow color="white">SUNKOOL Nano-Ceramic Technology</Eyebrow>
          <SectionHeading>
            <span className="text-[#f47521]">More Than Just</span>{" "}
            <span className="text-gradient-electric">Dark Glass.</span>
          </SectionHeading>

          <Paragraph className="mt-6">
            A common misconception is that darker window film automatically provides better heat
            protection. It doesn&rsquo;t. The darkness of a film is primarily related to its VLT,
            while heat rejection depends on the film&rsquo;s optical and material properties.
            Nano-ceramic films use ceramic particles within the film structure to help reject
            infrared energy while maintaining optical clarity and signal performance.
          </Paragraph>

          <div className="mt-12 grid gap-12 lg:grid-cols-[43fr_57fr] lg:gap-16">
            <div className="reveal-stagger grid gap-5 sm:grid-cols-2">
              {whySunkoolFeatures.map((feature, index, arr) => {
                const isLastOdd = index === arr.length - 1 && arr.length % 2 === 1;
                return (
                  <SpotlightCard
                    key={feature.title}
                    className={`rounded-2xl border p-7 ${
                      isLastOdd ? "sm:col-span-2 sm:flex sm:items-center sm:gap-6" : ""
                    }`}
                  >
                    <span className="text-kool">
                      <Icon name={feature.icon} />
                    </span>
                    <div className={isLastOdd ? "sm:mt-0" : ""}>
                      <p className="text-gradient-silver mt-4 font-display text-lg font-semibold sm:text-xl">
                        {feature.title}
                      </p>
                      <p
                        className={`mt-2 text-[15px] leading-relaxed text-silver-soft sm:text-base ${
                          feature.bold ? "font-bold" : ""
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>

            <NanoLayerStack layers={filmLayers} />
          </div>

          <div className="reveal-stagger mt-14 grid grid-cols-2 gap-x-6 gap-y-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3 sm:p-8 lg:grid-cols-6">
            {nanoStats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-4">
                <span className="text-kool">
                  <Icon name={stat.icon} />
                </span>
                <div>
                  <p className="text-gradient-silver-cyan font-display text-base font-semibold sm:text-lg">
                    <StatReveal value={stat.value} index={index} />
                  </p>
                  <p className="text-sm text-silver-soft">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-fog">
            *SUNKOOL states that these values are based on routinely accumulated quality-control
            data and may vary between batches.
          </p>
        </div>
      </section>
    </>
  );
}
