import GlowCard from "@/components/cities/content/mumbai/components/glow-card";
import AnimatedNumber from "@/components/cities/content/mumbai/components/animated-number";
import { Icon } from "@/components/cities/content/mumbai/components/landing-icons";
import { Eyebrow, SectionHeading } from "@/components/cities/content/mumbai/components/landing-blocks";
import { performanceBenefits, heatSpecs } from "@/components/cities/content/mumbai/lib/content";

export default function PerformanceSection() {
  return (
    <>
      {/* 6. Performance */}
      <section className="relative w-full border-t border-white/10 bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28">
          <Eyebrow color="kool">Why Mumbai Car Owners Choose Heat Protection Film</Eyebrow>
          <SectionHeading>
            <span className="text-[#f47521]">Performance</span>{" "}
            <span className="text-gradient-electric">By The Numbers</span>
          </SectionHeading>

          <div className="reveal-stagger mt-10 grid gap-8 border-t border-white/10 pt-10 text-center sm:grid-cols-3">
            <div>
              <p
                className="stat-value font-display text-4xl font-extrabold sm:text-5xl"
                aria-label="Up to 95 percent"
              >
                <span className="static-part">Up to&nbsp;</span>
                <AnimatedNumber end={95} />
                <span className="static-part">%</span>
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">
                IR Rejection
              </p>
            </div>

            <div>
              <p
                className="stat-value font-display text-4xl font-extrabold sm:text-5xl"
                aria-label="99 to 100 percent"
              >
                <AnimatedNumber end={99} />
                <span className="static-part">–</span>
                <AnimatedNumber end={100} />
                <span className="static-part">%</span>
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">
                UV Protection
              </p>
            </div>

            <div>
              <p
                className="stat-value font-display text-4xl font-extrabold sm:text-5xl"
                aria-label="100 percent"
              >
                <AnimatedNumber end={100} />
                <span className="static-part">%</span>
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">
                Signal Safe
              </p>
            </div>
          </div>

          <div className="reveal-stagger mt-10 grid gap-6 pt-10 sm:grid-cols-3">
            {performanceBenefits.map((benefit) => (
              <GlowCard
                key={benefit.title}
                cornerGlow
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center"
              >
                <span className="text-kool mb-3 flex justify-center">
                  <Icon name={benefit.icon} />
                </span>
                <p className="text-gradient-silver font-display text-[15px] font-semibold sm:text-base">
                  {benefit.title}
                </p>
                <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">
                  {benefit.description}
                </p>
              </GlowCard>
            ))}
          </div>

          <div className="reveal-stagger mt-10 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {heatSpecs.map((spec) => (
              <GlowCard
                key={spec.title}
                cornerGlow
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="font-display text-[15px] font-bold text-kool sm:text-base">{spec.title}</p>
                <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">{spec.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
