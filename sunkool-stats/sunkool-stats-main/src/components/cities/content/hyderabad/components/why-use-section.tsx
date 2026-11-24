import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat, IconSignalBars, IconBaby } from "@/components/cities/shared/icons";

const cards = [
  {
    icon: IconHeatThermo,
    title: "Reduce Cabin Heat",
    body: "Solar energy coming directly into your car through the glass windows will cause heating inside your vehicle. SUNKOOL nano-ceramic films are designed such that they reject infrared energy. This would reduce the heat energy coming into the vehicle through the glass windows. This will be especially helpful during the hot summer days in Hyderabad.",
  },
  {
    icon: IconGlare,
    title: "Reduce Glare While Driving",
    body: "Too much sunshine will make one suffer from glares that come off the glass. It becomes easier to control glare by having the correct film on the windows without losing clarity of vision. This works best during the morning or evening times while driving.",
  },
  {
    icon: IconUVShield,
    title: "Protect Against UV Exposure",
    body: "According to SUNKOOL, its range of window films has UV rejection properties of up to 99%. Reducing UV transmission could offer extra protection for occupants and interiors from sun exposure.",
  },
  {
    icon: IconSeat,
    title: "Help Protect Your Car Interior",
    body: "Repeated exposure to strong sunlight can contribute to fading and deterioration of: - Dashboard materials - Seats - Upholstery - Door panels - Other interior surfaces Window film provides an additional layer of protection from solar exposure.",
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
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">{" Hyderabad Heat Protection "}</Reveal>
        <Reveal as="h2" className="text-[#f47521] headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          Why Use Car <span className="text-gradient-electric">{"Window Film in Hyderabad?"}</span>
        </Reveal>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"Hyderabad has hot summers and a lot of sunlight, which may cause discomfort in a car interior. This becomes an issue especially if one is stuck in traffic or is traveling around the commercial and technological corridors of Hyderabad. SUNKOOL nano ceramic window films help one reduce heat, solar glare, and UV rays inside the car interior."}</p>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"The company manufactures different film grades, depending on heat rejection, visibility and appearance. If you need car window film, ceramic window film, nano ceramic film, or car heat protection film in Hyderabad, then SUNKOOL can assist you in your choice."}</p>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"Hyderabad's hot climate requires special attention towards solar heat regulation in many vehicle owners. An automobile when exposed to direct sunlight may become extremely uncomfortable very quickly, either because it is parked under the open sky or is stuck in a traffic jam. Window tinting can take care of some common issues like: - Heat inside the car - Sunlight - Glare while driving - UV rays - Open-parking - Interior fading Being uncomfortable during day drives Good window tinting can ensure solar protection without the need for very dark tinting."}</p>
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
