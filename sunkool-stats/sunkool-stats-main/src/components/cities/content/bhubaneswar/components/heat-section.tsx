import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Bhubaneswar's summer heat and coastal humidity" },
  { icon: IconRoad, text: "Trips along NH16 and toward Cuttack" },
  { icon: IconTrafficLight, text: "Traffic through Master Canteen and Jaydev Vihar" },
  { icon: IconPin, text: "Daily commutes across Patia, Chandrasekharpur, Saheed Nagar and Old Town" },
];

export default function HeatSection() {
  return (
    <section className="bhubaneswar-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">
          Where This Matters Most in Bhubaneswar
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">Bhubaneswar</span> <span className="text-heat">Heat?</span>
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
<p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">If your regular driving takes you through Master Canteen, Jaydev Vihar, Patia, Chandrasekharpur, Saheed Nagar, or Old Town near the temple area, you already know how much time a car spends either parked in open sun or crawling through traffic. Add in trips out along NH16 or toward Cuttack, and the cumulative heat and humidity exposure across a normal week builds up fast, even for a relatively short daily commute.</p>
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
              src="/images/traffic.png"
              alt="Cars in daytime traffic on a Bhubaneswar road under bright sun"
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
