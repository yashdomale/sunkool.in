import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import BulletList from "@/components/cities/content/surat/components/bullet-list";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat } from "@/components/cities/shared/icons";

const highlights = [
  "Surat combines strong summer heat with real humidity off the Tapi river, a tougher mix than dry heat alone",
  "SUNKOOL nano-ceramic film blocks up to 99% UV and rejects infrared right at the glass",
  "Four film grades (HD 70, SK 70, SK 50, SK 35), from max visibility to max heat rejection",
  "Final tint darkness depends on your car's original glass plus the film, not the film's VLT alone",
  "Governed under CMVR Rule 100 and IS 2553 (Part 2): 2019 — confirm current requirements before installing",
];

const problems = [
  "A cabin that heats up fast and stays humid even with the AC running",
  "Glare that gets sharper on open stretches like the Surat-Hazira road and along the Ring Road flyovers",
  "UV exposure that builds up steadily on a daily commute, cloud cover or not",
  "Dashboard, seats, and upholstery wearing out faster under the combined heat and moisture",
];

const cards = [
  {
    icon: IconHeatThermo,
    title: "Cooler Cabin, Faster",
    body: "Most of the heat inside your car comes through the glass, not the body panels. SUNKOOL's nano-ceramic films are built to block infrared energy right at the window, so the cabin doesn't turn into a sauna as fast, even after sitting parked near Adajan or in an open lot off Vesu for a couple of hours.",
  },
  {
    icon: IconGlare,
    title: "Less Glare on Surat's Roads",
    body: "Bright sun bouncing off the windshield and side windows gets tiring quickly, especially along the Ring Road stretch and near City Light during peak sun hours. A well-matched film cuts that glare down without taking away the visibility you actually need in Surat's dense traffic.",
  },
  {
    icon: IconUVShield,
    title: "Real UV Protection",
    body: "SUNKOOL's films carry UV rejection ratings up to 99% depending on the grade. For anyone driving daily through Surat's long, humid summer stretch, that adds up to a meaningful reduction in cumulative UV exposure over time.",
  },
  {
    icon: IconSeat,
    title: "Interior That Holds Up Longer",
    body: "Heat and humidity together are rougher on car interiors than dry heat alone — dashboards crack faster, upholstery fades quicker, trim dulls sooner. A film that blocks UV and cuts the heat load slows all of that down considerably, which matters if you're planning to keep the car a while.",
  },
];

export default function WhyUseSection() {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">
          Surat Heat Protection
        </Reveal>
        <Reveal as="h2" className="text-gradient-sun headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          Why Use Car <span className="text-gradient-electric">Window Film in Surat?</span>
        </Reveal>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
          <p className="eyebrow text-kool">Quick Highlights</p>
          <BulletList items={highlights} className="mt-5" />
        </div>

        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-8">
          Surat runs hot for a good chunk of the year, and it&apos;s not the dry kind of heat either. Between the
          humidity rolling in off the Tapi and long traffic waits on Ring Road or around Ved Road, a car here spends
          a lot of time trapping both heat and moisture at once. SUNKOOL&apos;s nano ceramic window films are built to
          deal with exactly that combination, cutting down heat, glare, and UV before any of it reaches the cabin.
        </p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">
          The lineup covers several film grades, each built around a different mix of heat rejection, visibility, and
          appearance. If you&apos;re checking out car window film, ceramic window film, nano ceramic film, or car heat
          protection film in Surat, here&apos;s what actually matters before you settle on one.
        </p>
        <a
          href="https://www.sunkool.in/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center text-base font-semibold text-kool transition-colors hover:text-glow"
        >
          Get a Film Recommendation →
        </a>

        <h3 className="mt-14 text-gradient-silver font-display text-xl font-bold sm:mt-16 sm:text-2xl">
          What Car Window Film Solves in Surat
        </h3>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-3">
          Surat&apos;s climate stays warm and sticky for a large part of the year, and car glass takes the brunt of
          that combination. Window film addresses a fairly specific set of problems that comes with it:
        </p>
        <BulletList items={problems} className="mt-5" />
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-5">
          None of this calls for the darkest film you can find. It calls for one actually built to handle what
          Surat&apos;s weather throws at it.
        </p>

        <h3 className="mt-14 text-gradient-silver font-display text-xl font-bold sm:mt-16 sm:text-2xl">
          What Window Film Actually Improves
        </h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
