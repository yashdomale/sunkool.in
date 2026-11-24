import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat } from "@/components/cities/shared/icons";

const cards = [
{ icon: IconHeatThermo, title: "Reduce Cabin Heat During Sunny Drives", body: "Sunlight through the glass can heat the cabin even when it does not feel especially hot outside. SUNKOOL's nano-ceramic film rejects infrared energy at the window, helping reduce heat build-up during Kozhikode's sunny drives and slow traffic." },
{ icon: IconGlare, title: "Reduce Glare on Kozhikode Roads", body: "Glare can be especially tiring near Beach Road, where coastal light is strong. A well-matched film reduces glare during morning, evening and midday drives while preserving road visibility." },
{ icon: IconUVShield, title: "Protect Against UV Exposure", body: "SUNKOOL lists UV rejection up to 99% across its range, depending on the product. Less UV passing through also helps reduce wear on interior materials." },
{ icon: IconSeat, title: "Help Protect Your Car Interior", body: "Constant sun and humidity can age dashboards, seats, upholstery, door panels and other interior materials. Window film adds protection against sun-related wear." },
];

export default function WhyUseSection() {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">
          Kozhikode Heat Protection
        </Reveal>
        <Reveal as="h2" className="text-gradient-sun headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          Why Use Car Window Film <span className="text-gradient-electric">in Kozhikode?</span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"Kozhikode's steady warmth and coastal humidity can make a parked car uncomfortable surprisingly quickly. Drivers regularly face cabin heat, glare, UV exposure, long traffic waits, outdoor parking and fading interiors."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"Commuting along Mavoor Road, Kannur Road, Beach Road and the Kozhikode bypass can leave your car exposed to the sun for much of the day. SUNKOOL nano-ceramic films are built to reduce heat and glare while maintaining clarity and signal performance."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"If you are researching car window film in Kozhikode, ceramic window film, nano ceramic film or car heat rejection film, choose by the balance of heat rejection, visibility, durability and installation quality."}</p>
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
