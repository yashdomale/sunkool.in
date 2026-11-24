import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat } from "@/components/cities/shared/icons";

const cards = [
  { icon: IconHeatThermo, title: "Cooler Cabin, Faster Recovery", body: "Most heat entering a parked or moving car comes through the glass, not the body panels. SUNKOOL's nano-ceramic films are engineered to block infrared energy right at the window, so the cabin doesn't heat up as quickly, even after hours parked near Firayalal or in an open lot off Ratu Road." },
  { icon: IconGlare, title: "Noticeably Less Glare", body: "Ranchi's road layout puts a lot of commuters facing direct sun during both morning and evening drive times, particularly along Main Road and Circular Road. A properly matched film cuts that glare down meaningfully without compromising the visibility you need at a busy signal." },
  { icon: IconUVShield, title: "UV Protection That Holds Up", body: "SUNKOOL films carry UV rejection ratings up to 99% depending on the grade chosen. For someone driving daily through Ranchi's sunny stretches, that's a real, cumulative reduction in UV exposure, not just a spec on a brochure." },
  { icon: IconSeat, title: "Interior That Ages Slower", body: "Sun exposure and monsoon humidity together are what actually crack dashboards, fade seat covers, and dull trim over a few years. A film that blocks UV and cuts down heat load slows that wear considerably, which matters if you plan to keep the car for the long haul or protect its resale value." },
];

export default function WhyUseSection() {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">
          Ranchi Heat Protection
        </Reveal>
        <Reveal as="h2" className="text-gradient-sun headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          What Car Window Film <span className="text-gradient-electric">Solves in Ranchi</span>
        </Reveal>
<p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">Ranchi doesn&apos;t get the punishing dry heat that some plains cities do, but don&apos;t let that fool you. Between April and June, direct sun still builds up fast inside a parked car, and once the monsoon rolls in, humidity adds its own layer of discomfort. A car sitting near Albert Ekka Chowk or stuck in traffic on Kanke Road spends a fair amount of time dealing with both. SUNKOOL&apos;s nano ceramic window films are built to cut down that heat, glare, and UV before any of it reaches the cabin.</p>
<p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">The range includes multiple film grades, each built around a different balance of heat rejection, visibility, and appearance. If you&apos;re researching car window film, ceramic window film, nano ceramic film, or car heat protection film in Ranchi, here&apos;s what actually matters before choosing one.</p>
<div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h3 className="font-display text-xl font-bold text-heat">Quick Highlights</h3><ul className="mt-4 list-disc space-y-3 pl-5"><li>Ranchi&apos;s plateau location keeps it slightly cooler than the plains, but summer sun and monsoon humidity still take a real toll on a parked car</li><li>SUNKOOL nano-ceramic film blocks up to 99% UV and rejects infrared right at the glass, not just visible light.</li><li>HD 70 offers 70% VLT, 58% TSER, 95% IR rejection and 99% UV rejection.</li><li>Final tint darkness depends on your car&apos;s factory glass combined with the film, not the film&apos;s VLT alone.</li><li>Always confirm current local requirements before installing.</li></ul></div>
<p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">Ranchi&apos;s climate swings between a warm, sun-heavy summer and a humid monsoon stretch, and car glass takes the brunt of both. Window film is aimed at a specific set of problems that comes with it:</p>
<ul className="mt-4 list-disc space-y-3 pl-5"><li>A cabin that heats up faster than you&apos;d expect, even on a day that doesn&apos;t feel extreme outside</li><li>Glare that gets sharper on open stretches like the Ranchi-Ramgarh road and Harmu bypass</li><li>UV exposure that builds up steadily over months of daily driving, sun or overcast</li><li>Dashboard, seat, and upholstery material wearing out faster under heat and humidity combined</li></ul>
<p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">None of this requires the darkest tint on the shelf. It requires a film matched to what you actually need.</p>
<a href="https://www.sunkool.in/contact" className="focus-ring mt-6 inline-flex rounded-full bg-heat px-6 py-3 font-semibold text-black">Get a Film Recommendation →</a>
<h3 className="mt-10 font-display text-2xl font-bold text-white">What Window Film Actually Improves</h3>
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
