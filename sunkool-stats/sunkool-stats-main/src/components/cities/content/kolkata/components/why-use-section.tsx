import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat, IconSignalBars, IconBaby } from "@/components/cities/shared/icons";

const cards = [
  {
    icon: IconHeatThermo,
    title: "Reduce Cabin Heat",
    body: "The heat caused by the sunlight entering the vehicle through the window can cause an increase in cabin temperature when the vehicle is standing still outside or traveling. The SUNKOOL nano-ceramic window film reflects infrared radiation, thereby reducing solar heat entering the vehicle. This can help in making the cabin cool during summer in Kolkata.",
  },
  {
    icon: IconGlare,
    title: "Reduce Glare While Driving",
    body: "Uncomfortable glare could be caused by strong sunshine, reflections off the other cars, roads, and buildings nearby. Proper window tint can help in reducing brightness levels without compromising on visibility. This is helpful especially when driving at dawn and dusk times.",
  },
  {
    icon: IconUVShield,
    title: "Protect Against UV Exposure",
    body: "SUNKOOL lists UV rejection of up to 99% across its window film range, depending on the product. Reducing UV transmission can provide additional protection for occupants and vehicle interior surfaces exposed to sunlight.",
  },
  {
    icon: IconSeat,
    title: "Help Protect Your Car Interior",
    body: "Repeated exposure to strong sunlight can contribute to fading and deterioration of dashboard materials, seats, upholstery, door panels and other interior surfaces. Window film provides an additional layer of protection from solar exposure.",
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
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">{" Kolkata Heat Protection "}</Reveal>
        <Reveal as="h2" className="text-[#f47521] headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          Why Use Car <span className="text-gradient-electric">{"Window Film in Kolkata?"}</span>
        </Reveal>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"The combination of the warm and humid weather in Kolkata along with the intense sunlight in the warmer months is a surefire way to make the car cabin uncomfortable while driving in the daytime. With drivers navigating through city streets in congested traffic, or parking their cars out in the sun, the effect of the sunlight is bound to have an adverse impact. SUNKOOL nano-ceramic window films are made to assist in cutting down infrared heat, solar glare and UV exposure without compromising on optics and signals."}</p>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"When you’re considering car window film, ceramic window film, nano ceramic film or car heat protection film in Kolkata, SUNKOOL provides different grades of films according to heat rejection and visibility."}</p>
        <p className="text-[16px] font-normal leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"In light of the extreme heat, humidity, and sunshine in Kolkata, the issue of solar heat control is something that the owner of the vehicle might want to consider. Some of the issues that can be solved using an appropriate window film include cabin heat, sunshine, glare when driving, UV, parking your car outside, fading of interior and uncomfortable day time drives. An appropriate film can offer solar heat control benefits without necessarily being very dark."}</p>
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
