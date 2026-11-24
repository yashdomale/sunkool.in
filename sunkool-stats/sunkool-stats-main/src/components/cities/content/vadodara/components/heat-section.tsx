import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Vadodara's intense, dry summer heat" },
  { icon: IconRoad, text: "Drives along the Vadodara-Halol expressway and toward the GIDC industrial belt" },
  { icon: IconTrafficLight, text: "Traffic through Alkapuri, Sayajigunj and Old Padra Road" },
  { icon: IconPin, text: "Daily commutes across Race Course Road, Fatehgunj and Manjalpur" },
];

export default function HeatSection() {
  return (
    <section className="vadodara-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">
          Where This Matters Most in Vadodara
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">Vadodara</span> <span className="text-heat">Heat?</span>
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
<p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">If your regular driving takes you through Alkapuri, Sayajigunj, Race Course Road, Old Padra Road, Fatehgunj, or Manjalpur, you already know how much time a car spends either parked in open sun or crawling through congested traffic. Add in trips along the Vadodara-Halol expressway or toward the GIDC industrial belt, and the cumulative sun exposure across a normal week builds up fast, even for drivers with a relatively short daily commute.</p>
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

            <p className="mt-6 text-lg font-semibold text-white sm:text-xl">
              Less heat when you get back in. Less glare during peak sun hours. A drive that doesn&apos;t wear you down before you&apos;ve reached your destination.
            </p>
          </div>
          <Reveal className="relative order-2 aspect-[3/2] w-full self-end overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/cities/vadodara/TRAFFIC.png"
              alt="Cars in daytime traffic on a Vadodara road under bright sun"
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
