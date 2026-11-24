import type { TemplateCopy } from "@/components/cities/content/nagpur/copy";
import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { StatNumber } from "@/components/cities/shared/count-up";
import { IconHeatThermo, IconEye, IconShield } from "@/components/cities/shared/icons";

const highlightIcons = [IconHeatThermo, IconEye, IconShield];

const glossaryTerms = ["TSER", "IR Rejection", "VLT", "UV Rejection"];

export default function PerformanceSection({ copy }: { copy: TemplateCopy["performance"] }) {
  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-kool">{copy.eyebrow}</Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
        >
          <span className="text-[#f47521]">Performance</span> <span className="text-gradient-electric">By The Numbers</span>
        </Reveal>

        <Reveal className="mt-10 grid gap-8 border-t border-white/10 pt-10 text-center sm:grid-cols-3" stagger>
          <div>
            <StatNumber target={95} prefix="Up to " suffix="%" ariaLabel="Up to 95 percent" className="text-4xl font-extrabold sm:text-5xl" />
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">IR Rejection</p>
          </div>
          <div>
            <StatNumber target={99} suffix="%" ariaLabel="99 percent" className="text-4xl font-extrabold sm:text-5xl" />
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">{copy.uvLabel}</p>
          </div>
          <div>
            <StatNumber target={100} suffix="%" ariaLabel="100 percent" minWidth="3ch" className="text-4xl font-extrabold sm:text-5xl" />
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">Signal Safe</p>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-6 pt-10 sm:grid-cols-3" stagger>
          {copy.highlights.map(({ title, body }, i) => {
            const Icon = highlightIcons[i];
            return (
            <GlowCard key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <span className="text-kool mb-3 flex justify-center">
                <Icon />
              </span>
              <p className="text-gradient-silver font-display text-[15px] font-bold sm:text-base">{title}</p>
              <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">{body}</p>
            </GlowCard>
            );
          })}
        </Reveal>

        <Reveal className="mt-10 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4" stagger>
          {glossaryTerms.map((term, i) => (
            <GlowCard key={term} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="font-display text-[15px] font-bold text-kool sm:text-base">{term}</p>
              <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">{copy.glossary[i]}</p>
            </GlowCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
