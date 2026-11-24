import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { StatNumber } from "@/components/cities/shared/count-up";
import { IconHeatThermo, IconEye, IconShield } from "@/components/cities/shared/icons";

const highlightCards = [
  {
    icon: IconHeatThermo,
    title: "Cooler Cabin",
    body: "Lower interior temperature during Bhopal's intense summer afternoons and long parking hours.",
  },
  {
    icon: IconEye,
    title: "Clear Visibility",
    body: "Reduced glare on Bhopal's sunlit roads for more comfortable day and night driving.",
  },
  {
    icon: IconShield,
    title: "Better Protection",
    body: "Helps protect you and your car's interiors from Bhopal's year-round UV exposure and heat.",
  },
];

const glossary = [
  {
    term: "TSER",
    body: "Total Solar Energy Rejected — the proportion of solar energy rejected by the glazing system.",
  },
  {
    term: "IR Rejection",
    body: "How effectively the film helps block infrared energy.",
  },
  {
    term: "VLT",
    body: "Visible Light Transmission — how much visible light passes through the glass.",
  },
  {
    term: "UV Rejection",
    body: "The film's ability to reduce ultraviolet transmission.",
  },
];

export default function PerformanceSection() {
  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-kool">
          Choosing Film for Bhopal&apos;s Climate
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
        >
          <span className="text-sun">The Numbers That Actually</span> <span className="text-gradient-electric">Matter for Heat</span>
        </Reveal>
        <p className="mt-6 text-base leading-relaxed text-silver-soft">Bhopal&apos;s long, dry summer makes the instinct to go dark understandable. Weigh heat rejection, IR rejection, UV protection, visibility and VLT together. Choose for your vehicle and the applicable rules, rather than shade alone.</p>

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
        <Reveal className="mt-10 rounded-2xl border border-sun/30 bg-gradient-to-r from-black via-sun/10 to-sun/25 p-6 sm:p-7">
          <h3 className="font-display text-xl font-semibold text-sun">Window Tint Rules That Apply in Bhopal</h3>
          <p className="mt-4 text-base leading-relaxed text-silver-soft">Before booking an installation, review SUNKOOL&apos;s guidance on CMVR Rule 100 and IS 2553 (Part 2): 2019 (Revision 1). Your window&apos;s final VLT combines the original factory glass and the applied film. A film rated at 70% VLT does not mean the finished window will read 70%.</p>
          <p className="mt-4 text-sm leading-relaxed text-silver-soft">Regulatory requirements and enforcement can change. Confirm the current applicable rules and your car&apos;s final VLT before installation.</p>
          <a href="https://www.sunkool.in/regulations" className="mt-6 inline-flex font-semibold text-kool hover:text-glow">Check Window Film Regulations &rarr;</a>
        </Reveal>
      </div>
    </section>
  );
}
