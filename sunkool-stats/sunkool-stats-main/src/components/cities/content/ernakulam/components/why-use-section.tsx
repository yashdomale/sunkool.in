import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat } from "@/components/cities/shared/icons";

const cards = [
{ icon: IconHeatThermo, title: "Cooler Cabin, Faster", body: "Most of the heat inside your car comes through the glass, not the body. SUNKOOL's nano-ceramic films are built to block infrared energy right at the window, so the cabin doesn't heat up as quickly, even after sitting parked near Marine Drive or in an open lot for a few hours." },
{ icon: IconGlare, title: "Less Glare, Even Near the Water", body: "Light bouncing off open roads and near the backwaters can be sharper than it looks, especially during early morning and late afternoon drives. A well-matched film cuts that glare down without compromising the visibility you actually need on the road." },
{ icon: IconUVShield, title: "Real UV Protection", body: "SUNKOOL's films carry UV rejection ratings up to 99% depending on the grade. For anyone driving daily in Ernakulam's near-constant sun and humidity, that adds up to a meaningful reduction in cumulative UV exposure." },
{ icon: IconSeat, title: "Interior That Holds Up Longer", body: "Heat and humidity together are rougher on car interiors than dry heat alone — dashboards crack, upholstery fades, and trim dulls faster. A film that blocks UV and cuts the heat load slows all of that down considerably." },
];

export default function WhyUseSection() {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">
          Ernakulam Heat Protection
        </Reveal>
        <Reveal as="h2" className="text-gradient-sun headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          What Window Film <span className="text-gradient-electric">Actually Improves</span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"Kerala's climate keeps things warm and humid for most of the year, and car glass absorbs a lot of that heat over the course of a day. Window film addresses a fairly specific set of problems: a cabin that heats up quickly and stays sticky even after the AC kicks in, glare that gets sharper along open stretches and near the backwaters, UV exposure that builds up steadily on a daily commute, and dashboards, seats and upholstery wearing out faster under constant heat and moisture."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"If you're looking into car window film, ceramic window film, nano ceramic film or car heat protection film in Ernakulam, here's what's actually worth knowing before you pick one."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"None of this calls for the darkest film you can find. It calls for one that's actually matched to the problem."}</p>
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
