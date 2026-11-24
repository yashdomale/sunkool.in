import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat, IconSignalBars, IconBaby } from "@/components/cities/shared/icons";

const cards = [
  {
    icon: IconHeatThermo,
    title: "Reduce Cabin Heat",
    body: "Most of the heat inside a parked or moving car comes straight through the glass. SUNKOOL's nano-ceramic films are built to reject infrared energy at the window, so less of it ever makes it inside. In a city where summer temperatures regularly climb into the low 40s, that's not a small difference.",
  },
  {
    icon: IconGlare,
    title: "Reduce Glare While Driving",
    body: "Ahmedabad's east-west arterial roads mean a lot of drivers face the sun directly during morning and evening commutes. A properly chosen film cuts that glare down without turning your windows into a dark tunnel, so visibility stays sharp exactly when you need it.",
  },
  {
    icon: IconUVShield,
    title: "Protect Against UV Exposure",
    body: "SUNKOOL's films are rated for UV rejection up to 99% depending on the grade. For anyone doing a daily commute, that adds up to a meaningful reduction in the UV dose you're getting just from driving.",
  },
  {
    icon: IconSeat,
    title: "Help Protect Your Car Interior",
    body: "Ahmedabad's sun doesn't just heat the cabin, it works on the materials inside it. Dashboards, seats, and door panels all take the hit over time, cracking or fading faster under constant UV exposure. A good film slows that process down considerably.",
  },
  {
    icon: IconSignalBars,
    title: "Signal Safe",
    body: "The nano-ceramic technology of SUNKOOL window films provides signal safety for maintaining GPS and mobile connections.",
  },
  {
    icon: IconBaby,
    title: "Accident Safety Protection",
    body: "SUNKOOL window films help hold shattered glass together, reducing the risk of glass fragments flying into the cabin and potentially injuring children during an accident.",
  },
];

export default function WhyUseSection() {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">{" Ahmedabad Heat Protection "}</Reveal>
        <Reveal as="h2" className="text-[#f47521] headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          Why Use Car <span className="text-gradient-electric">{"Window Film in Ahmedabad?"}</span>
        </Reveal>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"By April, an Ahmedabad afternoon can turn a parked car into something you'd rather not sit in. Between the SG Highway crawl and the open-sky parking that's common across the city, your windows spend most of the day absorbing heat you'll feel the moment you get back in. SUNKOOL's nano ceramic window films are built to cut that heat down, along with glare and UV exposure, before it reaches you."}</p>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"The lineup spans several film grades, so whether you're after maximum heat rejection or a lighter, more visible finish, there's a version built for it. If you're searching for car window film, ceramic window film, or heat protection film in Ahmedabad, this is where to start."}</p>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"Ahmedabad doesn't do mild summers. The heat builds early and stays late, and a car sitting in it, whether outside your office or in an open lot, absorbs that heat fast. Window film gives you a way to push back against a fairly specific set of problems that come with this climate: A cabin that feels like an oven within minutes Glare that makes late-afternoon drives genuinely tiring UV rays working on your skin the whole time you're behind the wheel Interior surfaces fading faster than they should None of this requires the darkest tint you can find. It requires the right film."}</p>
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
