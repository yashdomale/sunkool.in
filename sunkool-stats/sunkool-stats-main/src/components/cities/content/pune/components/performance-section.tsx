import GlowCard from "@/components/cities/content/pune/components/glow-card";
import StatReveal from "@/components/cities/content/pune/components/stat-reveal";
import { Eyebrow, SectionHeading } from "@/components/cities/content/pune/components/landing-blocks";
import { Icon } from "@/components/cities/content/pune/components/landing-icons";
import { performanceStats, performanceBenefits, heatSpecs } from "@/components/cities/content/pune/lib/content";

export default function PerformanceSection() {
  return (
    <>
      {/* 6. Performance */}
      <section className="relative w-full border-t border-white/10 bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28">
          <Eyebrow color="kool">Performance You Can Feel</Eyebrow>
          <SectionHeading>
            <span className="text-[#f47521]">Performance</span>{" "}
            <span className="text-gradient-electric">By The Numbers</span>
          </SectionHeading>

          <div className="reveal-stagger mt-10 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
            {performanceStats.map((stat, index) => (
              <div key={stat.label}>
                <p className="text-gradient-electric font-display text-4xl font-extrabold sm:text-5xl">
                  <StatReveal value={stat.value} index={index} />
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal-stagger mt-10 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-3">
            {performanceBenefits.map((benefit) => (
              <GlowCard
                key={benefit.title}
                cornerGlow
                className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center"
              >
                <span className="glow-card-icon text-kool">
                  <Icon name={benefit.icon} />
                </span>
                <p className="mt-3 font-display text-[15px] font-semibold text-white sm:text-base">
                  {benefit.title}
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-silver-soft">
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
                <p className="mt-1 text-[15px] leading-relaxed text-silver-soft">{spec.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
