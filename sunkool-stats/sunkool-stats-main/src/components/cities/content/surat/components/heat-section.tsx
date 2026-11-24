import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Surat's strong summer heat, with humidity rolling in off the Tapi" },
  { icon: IconRoad, text: "Daily drives through Ring Road, Vesu, Adajan, City Light and Piplod" },
  { icon: IconTrafficLight, text: "Traffic around the diamond and textile market areas of Ved Road and Katargam" },
  { icon: IconPin, text: "Trips out toward Hazira or across the Tapi bridges" },
];

export default function HeatSection() {
  return (
    <section className="surat-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">
          Where This Matters Most in Surat
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">Surat</span> <span className="text-heat">Heat?</span>
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
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">
          If your regular driving takes you through Ring Road, Vesu, Adajan, City Light, Piplod, or the diamond and
          textile market areas around Ved Road and Katargam, you already know how much time a car spends either
          parked in open sun or crawling through traffic. Add in trips out toward Hazira or across the Tapi bridges,
          and the cumulative heat and humidity exposure across a normal week builds up fast, even on a fairly short
          daily commute.
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
            <p className="mt-8 text-lg font-semibold text-white sm:text-xl">
              Less heat when you get back in. Less glare during peak sun hours. A drive that doesn&apos;t wear you
              down before you&apos;ve reached your destination.
            </p>
          </div>
          <Reveal className="relative order-2 aspect-[1672/941] w-full self-end overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/cities/surat/traffic.png"
              alt="Traffic in Surat"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
