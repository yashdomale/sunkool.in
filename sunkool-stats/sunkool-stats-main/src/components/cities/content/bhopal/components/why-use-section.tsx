import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat } from "@/components/cities/shared/icons";

const cards = [
{ icon: IconHeatThermo, title: "Faster Recovery", body: "SUNKOOL's nano-ceramic films are engineered to block infrared energy right at the window, helping the cabin heat up less quickly after parking outdoors near the lakes or in an open market lot." },
{ icon: IconGlare, title: "Noticeably Less Glare", body: "Bhopal's east-west roads can put commuters in direct sun during morning and evening drives, particularly along Hoshangabad Road and VIP Road. A properly matched film reduces glare while maintaining visibility." },
{ icon: IconUVShield, title: "UV Protection That Actually Lasts", body: "SUNKOOL films block up to 99% of UV rays, depending on the grade. Daily driving through Bhopal's long, sunny stretches makes UV protection a practical priority." },
{ icon: IconSeat, title: "Your Interior Stays Newer, Longer", body: "Constant sun can crack dashboards, fade seat covers and dull trim. A film that blocks UV and cuts heat helps slow that wear over the years." },
];

export default function WhyUseSection() {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-gradient-sun">
          Bhopal Heat Protection
        </Reveal>
        <Reveal as="h2" className="text-gradient-sun headline text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          What Window Film <span className="text-gradient-electric">Actually Improves</span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"Bhopal summers don't wait. By late March, a car parked for a few minutes already feels like an oven. With traffic around MP Nagar and Hoshangabad Road, cars spend long stretches exposed to direct sun."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"SUNKOOL's nano-ceramic film is built to reduce heat, glare and UV before they enter the cabin. If you're researching car window film, ceramic window film, nano ceramic film or car heat protection film in Bhopal, these are the everyday benefits that matter."}</p>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">{"Choose by heat rejection, visibility and optical clarity, with installation quality and your vehicle's original glass in mind."}</p>
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
