import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat } from "@/components/cities/shared/icons";

const cards = [
{ icon: IconHeatThermo, title: "Cooler Cabin, Faster Recovery", body: "SUNKOOL's nano-ceramic films are engineered to block infrared energy right at the window, so the cabin doesn't climb to oven-like temperatures as quickly, even after hours parked near Hawa Mahal or in an open market lot." },
{ icon: IconGlare, title: "Noticeably Less Glare", body: "Jaipur's road layout puts a lot of commuters facing direct sun during both morning and evening drive times, particularly along Tonk Road and JLN Marg. A properly matched film cuts that glare down meaningfully without compromising visibility." },
{ icon: IconUVShield, title: "UV Protection That Holds Up", body: "SUNKOOL films carry UV rejection ratings up to 99% depending on the grade chosen. For someone driving daily through Jaipur's long, intense summer, that's a real, cumulative reduction in UV exposure, not just a spec on a brochure." },
{ icon: IconSeat, title: "Interior That Ages Slower", body: "Continuous sun exposure is what actually cracks dashboards, fades seat covers and dulls trim over a few years. A film that blocks UV and cuts down heat load slows that wear considerably." },
];

export default function WhyUseSection() {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">
          Jaipur Heat Protection
        </Reveal>
        <Reveal as="h2" className="text-gradient-sun headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          What Window Film <span className="text-gradient-electric">Actually Improves</span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"Jaipur's climate is dry, hot and sun-heavy for a large part of the year, and car glass absorbs a lot of that energy over the course of a day. A cabin can heat up well past outside temperature within minutes, and dashboard, seat and upholstery material wears out faster than it should."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"SUNKOOL's nano-ceramic film is built to reduce heat, glare and UV before they enter the cabin. If you're researching car window film, ceramic window film, nano ceramic film or car heat protection film in Jaipur, these are the everyday benefits that matter."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"None of this requires the darkest tint on the shelf. It requires a film matched to what you actually need."}</p>
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
