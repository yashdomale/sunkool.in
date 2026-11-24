import Image from "next/image";
import { Logo } from "@/components/cities/shared/logo";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Kolkata's warm and humid weather and intense sunlight in the warmer months" },
  { icon: IconRoad, text: "Daily commutes through Salt Lake, New Town, Park Street and Ballygunge" },
  { icon: IconTrafficLight, text: "Busy roads across Alipore, Rajarhat, Garia and Behala" },
  { icon: IconPin, text: "Daytime drives along EM Bypass and Howrah" },
];

export default function HeatSection() {
  return (
    <section className="kolkata-heat-section nagpur-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">{" Built for Kolkata Roads & Weather "}</Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">{"Kolkata"}</span> <span className="text-heat">Heat?</span>
          </span>
          <span className="mt-2 block">
            <span className="text-gradient-electric">Control It With</span>{" "}
            <Logo
              className="inline-block h-[0.85em] w-auto align-baseline"
            />
          </span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">
          Whether you&apos;re driving into the city, parking your car out in the open throughout the day or
          driving long distances on highways, too much sunlight will certainly create discomfort within the
          interior. SUNKOOL window film aims to solve the three issues most drivers want addressed in their
          car — heat, glare and everyday comfort. There are also high-VLT versions available which don&apos;t
          necessarily have to be too dark.
        </p>
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
            <p className="mt-8 text-sm leading-relaxed text-silver-soft">{"Kolkata's busy roads can mean spending significant time inside your vehicle during daylight hours. Your vehicle may spend considerable time exposed to sunlight and traffic. During warmer periods, direct solar exposure can make the cabin uncomfortable, particularly when the vehicle is stationary in traffic or parked outdoors. A suitable window film can help make everyday driving more comfortable."}</p>
            <p className="mt-6 text-lg font-semibold text-white sm:text-xl">{"Less solar heat. Less glare. More comfortable driving."}</p>
          </div>
          <Reveal className="relative order-2 aspect-[3/2] w-full self-end overflow-hidden rounded-2xl border border-white/10">
            <Image src="/images/cities/kolkata/traffic 2.png" alt="Daytime traffic in Kolkata" fill loading="lazy" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
