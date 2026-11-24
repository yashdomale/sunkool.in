import { Logo } from "@/components/cities/shared/logo";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Hyderabad's hot summers and strong sunlight" },
  { icon: IconRoad, text: "Daily commutes through HITEC City, Madhapur, Gachibowli and Kondapur" },
  { icon: IconTrafficLight, text: "Busy roads across Banjara Hills, Jubilee Hills, Begumpet and Secunderabad" },
  { icon: IconPin, text: "Daytime drives through Kukatpally and Financial District" },
];

export default function HeatSection() {
  return (
    <section className="hyderabad-heat-section nagpur-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">{" Built for Hyderabad Roads & Weather "}</Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">{"Hyderabad"}</span> <span className="text-heat">Heat?</span>
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
            <p className="mt-8 text-sm leading-relaxed text-silver-soft">{"Hyderabad's expanding business and technology corridors mean many drivers spend considerable time commuting during daylight hours. Whether you're travelling through: - HITEC City - Madhapur - Gachibowli - Kondapur - Banjara Hills - Jubilee Hills - Begumpet - Secunderabad - Kukatpally - Financial District your vehicle may spend significant time exposed to direct sunlight and traffic. During summer, the effect can be particularly noticeable when the car is parked outdoors or remains stationary in traffic. A suitable window film can help make everyday driving more comfortable. Less solar heat. Less glare. More comfortable driving."}</p>
            <p className="mt-6 text-lg font-semibold text-white sm:text-xl">{"Less solar heat. Less glare. More comfortable driving."}</p>
          </div>
          <Reveal className="relative order-2 aspect-[3/2] w-full self-end overflow-hidden rounded-2xl border border-white/10">
            <Image src="/images/cities/hyderabad/traffic.png" alt="Daytime traffic in Hyderabad" fill loading="lazy" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
import Image from "next/image";
