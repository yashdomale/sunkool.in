import { Logo } from "@/components/cities/shared/logo";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Ahmedabad's hot summers and strong sunlight" },
  { icon: IconRoad, text: "Daily commutes through SG Highway, Prahlad Nagar and Satellite" },
  { icon: IconTrafficLight, text: "Busy roads across Bodakdev, Navrangpura and Vastrapur" },
  { icon: IconPin, text: "Daytime drives through Maninagar, Bopal, CG Road and Science City Road" },
];

export default function HeatSection() {
  return (
    <section className="ahmedabad-heat-section nagpur-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">{" Built for Ahmedabad Roads & Weather "}</Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">{"Ahmedabad"}</span> <span className="text-heat">Heat?</span>
          </span>
          <span className="mt-2 block">
            <span className="text-gradient-electric">Control It With</span>{" "}
            <Logo
              className="inline-block h-[0.85em] w-auto align-baseline"
            />
          </span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"If your commute runs through SG Highway, Prahlad Nagar, or Satellite, you already know how much time your car spends sitting in direct sun, whether crawling in traffic or parked outside an office. The same goes for routes through Bodakdev, Navrangpura, Vastrapur, Maninagar, Bopal, CG Road, or Science City Road. None of these are short hops, and the cumulative sun exposure across a normal week adds up. Less heat. Less glare. A commute that doesn't wear you down before you've even arrived."}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[13fr_12fr] lg:gap-16">
          <div className="order-1 self-end">
            <Reveal className="grid grid-cols-2 gap-6" stagger>
              {bullets.map(({ icon: Icon, text }) => (
                <div key={text}>
                  <span className="text-kool">
                    <Icon />
                  </span>
                  <p className="mt-3 text-[15px] leading-relaxed text-silver-soft sm:text-base">{text}</p>
                </div>
              ))}
            </Reveal>
            <p className="mt-8 text-sm leading-relaxed text-silver-soft">{"Ahmedabad's open-sky parking and daily traffic expose vehicles to strong sunlight throughout the warmer months."}</p>
            <p className="mt-6 text-lg font-semibold text-white sm:text-xl">{"Less heat. Less glare. A commute that doesn't wear you down before you've even arrived."}</p>
          </div>
          <Reveal className="relative order-2 aspect-[3/2] w-full self-end overflow-hidden rounded-2xl border border-white/10">
            <Image src="/images/cities/ahmedabad/traffic.png" alt="Daytime traffic in Ahmedabad" fill loading="lazy" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
import Image from "next/image";
