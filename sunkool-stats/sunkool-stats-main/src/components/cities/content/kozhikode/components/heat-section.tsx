import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Kozhikode's year-round warmth, coastal humidity and outdoor parking" },
  { icon: IconRoad, text: "Daily routes along Mavoor Road, Kannur Road and Beach Road" },
  { icon: IconTrafficLight, text: "Traffic through Palayam, Mankavu, Thondayad and Eranhipalam" },
  { icon: IconPin, text: "Commutes through West Hill, Medical College Road and Kozhikode Bypass" },
];

export default function HeatSection() {
  return (
    <section className="kozhikode-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">
          Built for Kozhikode Roads &amp; Weather
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">Kozhikode</span> <span className="text-heat">Heat?</span>
          </span>
          <span className="mt-2 block">
            <span className="text-gradient-electric">Control It With</span>{" "}
            <Image
              src="/sunkool-wordmark.png"
              alt="Sunkool"
              width={220}
              height={46}
              loading="lazy"
              className="inline-block h-[0.85em] w-auto align-baseline"
            />
          </span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"For many Kozhikode drivers, it is less about the weather changing and more about the time spent in it. Routes through Mavoor Road, Kannur Road, Beach Road, Palayam, West Hill, Medical College Road, Eranhipalam, Kozhikode Bypass, Mankavu and Thondayad can mean long stretches inside the car."}</p>
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
            <p className="mt-8 text-sm leading-relaxed text-silver-soft">
              Even when the car is not moving, direct sunlight keeps entering through the side windows. A well-matched film can help make those daily waits more comfortable.
            </p>
            <p className="mt-6 text-lg font-semibold text-white sm:text-xl">
              Less solar heat. Less glare. More comfortable driving.
            </p>
          </div>
          <Reveal className="relative order-2 aspect-[1672/941] w-full self-end overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/cities/kozhikode/traffic.png"
              alt="Cars in daytime traffic on a Kozhikode road under bright sun"
              loading="lazy"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
