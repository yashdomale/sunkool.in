import type { TemplateCopy } from "@/components/cities/content/nagpur/copy";
import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat, IconSignalBars, IconBaby } from "@/components/cities/shared/icons";

const cardIcons = [IconHeatThermo, IconGlare, IconUVShield, IconSeat, IconSignalBars, IconBaby];

export default function WhyUseSection({ copy }: { copy: TemplateCopy["whyUse"] }) {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">{copy.eyebrow}</Reveal>
        <Reveal as="h2" className="text-[#f47521] headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          Why Use Car <span className="text-gradient-electric">{copy.headlineTail}</span>
        </Reveal>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{copy.paragraphs[0]}</p>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{copy.paragraphs[1]}</p>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{copy.paragraphs[2]}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {copy.cards.map(({ title, body }, i) => {
            const Icon = cardIcons[i];
            return (
            <GlowCard key={title} variant="reveal-card" kool className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] sm:p-6">
              <span className="reveal-card-icon text-kool">
                <Icon />
              </span>
              <p className="text-gradient-silver mt-4 font-display text-lg font-semibold sm:text-xl">{title}</p>
              <p className="mt-2 text-[15px] font-bold leading-relaxed text-white/85 sm:text-base">{body}</p>
            </GlowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
