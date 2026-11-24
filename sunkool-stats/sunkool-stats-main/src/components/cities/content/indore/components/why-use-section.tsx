import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat, IconSignalBars } from "@/components/cities/shared/icons";

const cards = [
{ icon: IconHeatThermo, title: "Heat Reduction in the Car", body: "Ceramic film helps reject infrared energy entering through the glass, creating a more comfortable cabin during Indore's sunny drives." },
{ icon: IconGlare, title: "Glare Reduction", body: "Window film helps reduce uncomfortable sun glare and reflections while driving in bright conditions, especially on open stretches such as AB Road." },
{ icon: IconUVShield, title: "UV Protection", body: "SUNKOOL window films offer strong UV protection. HD 70 has a published UV rejection of 99%." },
{ icon: IconSeat, title: "Interior Protection", body: "Continuous sun exposure can fade and deteriorate dashboards, seats and upholstery. Window film helps provide extra protection for these materials." },
{ icon: IconSignalBars, title: "Signal Safe", body: "SUNKOOL's non-metallic nano-ceramic technology maintains GPS, mobile and toll-tag connectivity." },
];

export default function WhyUseSection() {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">
          Indore Heat Protection
        </Reveal>
        <Reveal as="h2" className="text-gradient-sun headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          Why Use Car Window Film <span className="text-gradient-electric">in Indore?</span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"Indore's dry heat, especially through April, May and June, makes heat management an everyday driving concern. Parking outdoors or driving during the hottest part of the day can raise cabin temperatures, increase glare and contribute to interior fading."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"SUNKOOL nano-ceramic window films are designed to reject solar heat and infrared energy without compromising visibility or signal performance."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"For drivers searching for car window film in Indore, ceramic window film or heat rejection car film, choose according to your vehicle's glass, visibility preferences and heat protection needs."}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {cards.map(({ icon: Icon, title, body }) => (
            <GlowCard key={title} variant="reveal-card" kool className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] sm:p-6">
              <span className="reveal-card-icon text-kool">
                <Icon />
              </span>
              <p className="text-gradient-silver mt-4 font-display text-lg font-semibold sm:text-xl">{title}</p>
              <p className="mt-2 text-[15px] font-bold leading-relaxed text-white/85 sm:text-base">{body}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
