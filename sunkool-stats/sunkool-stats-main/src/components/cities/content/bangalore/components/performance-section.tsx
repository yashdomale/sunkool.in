import GlowCard from "@/components/cities/shared/glow-card";
import { StatNumber } from "@/components/cities/content/bangalore/components/count-up";
import { IconHeatThermo, IconEye, IconShield } from "@/components/cities/content/bangalore/components/icons";

const highlightCards = [
  {
    icon: IconHeatThermo,
    title: "Cooler Cabin",
    body: "Lower interior temperature on sunny Banglore afternoons.",
  },
  {
    icon: IconEye,
    title: "Clear Visibility",
    body: "Reduced glare for more comfortable day and night driving.",
  },
  {
    icon: IconShield,
    title: "Better Protection",
    body: "Helps protect you and your car's interiors from UV exposure.",
  },
];

const glossary = [
  {
    term: "VLT",
    body: "Visible Light Transmission — how much visible light passes through the glass.",
  },
  {
    term: "TSER",
    body: "Total Solar Energy Rejected — the proportion of solar energy rejected by the glazing system.",
  },
  {
    term: "IR Rejection",
    body: "How effectively the film helps block infrared energy.",
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
        <p className="reveal-fade-up eyebrow text-kool text-center sm:text-left">Performance You Can Feel</p>
        <h2 className="reveal-fade-up headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)] sm:text-left">
          <span className="text-[#f47521]">Performance</span> <span className="text-gradient-electric">By The Numbers</span>
        </h2>

        <div className="reveal-stagger mt-10 grid gap-8 border-t border-white/10 pt-10 text-center sm:grid-cols-3">
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
        </div>

        <div className="reveal-stagger mt-10 grid gap-6 pt-10 sm:grid-cols-3">
          {highlightCards.map(({ icon: Icon, title, body }) => (
            <GlowCard key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <span className="text-kool mb-3 flex justify-center">
                <Icon />
              </span>
              <p className="text-gradient-silver font-display text-[15px] font-semibold sm:text-base">{title}</p>
              <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">{body}</p>
            </GlowCard>
          ))}
        </div>

        <div className="reveal-stagger mt-10 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {glossary.map(({ term, body }) => (
            <GlowCard key={term} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="font-display text-[15px] font-bold text-kool sm:text-base">{term}</p>
              <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">{body}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
