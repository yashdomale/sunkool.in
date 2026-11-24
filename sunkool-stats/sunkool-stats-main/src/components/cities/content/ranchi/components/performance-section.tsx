import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { StatNumber } from "@/components/cities/shared/count-up";
import { IconHeatThermo, IconEye, IconShield } from "@/components/cities/shared/icons";

const highlightCards = [
  {
    icon: IconHeatThermo,
    title: "Cooler Cabin",
    body: "Lower interior temperature during Ranchi's sunny summer afternoons and long parking hours.",
  },
  {
    icon: IconEye,
    title: "Clear Visibility",
    body: "Reduced glare on Ranchi's sunlit roads for more comfortable day and night driving.",
  },
  {
    icon: IconShield,
    title: "Better Protection",
    body: "Helps protect you and your car's interiors from Ranchi's year-round UV exposure and heat.",
  },
];

const glossary = [
  { term: "TSER – Total Solar Energy Rejected", body: "The combined percentage of solar energy blocked by your glass and film together." },
  { term: "IR Rejection", body: "How much infrared heat specifically gets stopped by the film." },
  { term: "VLT – Visible Light Transmission", body: "How much visible light passes through the window." },
  { term: "UV Rejection", body: "How effectively the film blocks ultraviolet rays." },
];

export default function PerformanceSection() {
  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-kool">
          The Numbers That Actually Matter for Heat
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
        >
          <span className="text-sun">Performance</span> <span className="text-gradient-electric">By The Numbers</span>
        </Reveal>

        <p className="mt-6 text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px]">If cutting cabin heat is your main goal, shop by these figures instead of by shade alone.</p>
        <Reveal className="mt-10 grid gap-8 border-t border-white/10 pt-10 text-center sm:grid-cols-3" stagger>
          <div>
            <StatNumber target={95} prefix="Up to " suffix="%" ariaLabel="Up to 95 percent" className="text-4xl font-extrabold sm:text-5xl" />
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">IR Rejection</p>
          </div>
          <div>
            <StatNumber target={99} suffix="%" ariaLabel="99 percent" className="text-4xl font-extrabold sm:text-5xl" />
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">UV Protection</p>
          </div>
          <div>
            <StatNumber target={100} suffix="%" ariaLabel="100 percent" minWidth="3ch" className="text-4xl font-extrabold sm:text-5xl" />
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">Signal Safe</p>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-6 pt-10 sm:grid-cols-3" stagger>
          {highlightCards.map(({ icon: Icon, title, body }) => (
            <GlowCard key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <span className="text-kool mb-3 flex justify-center">
                <Icon />
              </span>
              <p className="text-gradient-silver font-display text-[15px] font-bold sm:text-base">{title}</p>
              <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">{body}</p>
            </GlowCard>
          ))}
        </Reveal>

        <Reveal className="mt-10 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4" stagger>
          {glossary.map(({ term, body }) => (
            <GlowCard key={term} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="font-display text-[15px] font-bold text-kool sm:text-base">{term}</p>
              <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">{body}</p>
            </GlowCard>
          ))}
        </Reveal>
        <h3 className="mt-10 font-display text-2xl font-bold text-heat">Choosing Film for Ranchi&apos;s Climate</h3>
<p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">Ranchi&apos;s mix of sunny summer stretches and humid monsoon months makes the instinct to go as dark as possible understandable, but the smarter approach weighs all five factors together: Heat Rejection + IR Rejection + UV Protection + Visibility + VLT.</p>
<p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">Some drivers will prioritize visibility with a higher-VLT film. Others will want maximum solar rejection with a darker grade. Both approaches are reasonable, depending on your vehicle and the applicable local rules.</p>
      </div>
    </section>
  );
}
