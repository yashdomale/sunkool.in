import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Bhopal's long, dry summers and open-sun parking" },
  { icon: IconRoad, text: "Long drives along Hoshangabad Road and the Bhopal-Indore Highway" },
  { icon: IconTrafficLight, text: "Traffic through MP Nagar, New Market and Bairagarh" },
  { icon: IconPin, text: "Daily commutes across Arera Colony, VIP Road and the lakes" },
];

export default function HeatSection() {
  return (
    <section className="bhopal-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">
          Built for Bhopal Roads &amp; Weather
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">Bhopal</span> <span className="text-heat">Heat?</span>
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
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"If your regular driving takes you through MP Nagar, New Market, Arera Colony, Hoshangabad Road, Bairagarh or the Upper and Lower Lakes, you know how much time a car spends in open sun or congested traffic. Trips along the Bhopal-Indore Highway add to that exposure across the week."}</p>
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
              Less heat when you get back in. Less glare during peak sun hours. A drive that does not wear you down before you reach your destination.
            </p>
            <p className="mt-6 text-lg font-semibold text-white sm:text-xl">
              Heat Reduction. Glare Reduction. Comfort.
            </p>
          </div>
          <Reveal className="relative order-2 aspect-[1672/941] w-full self-end overflow-hidden rounded-2xl border border-white/10">
            <Image src="/images/cities/bhopal/traffic 3.png" alt="Cars, buses and auto-rickshaws in Bhopal traffic under bright sunlight" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
