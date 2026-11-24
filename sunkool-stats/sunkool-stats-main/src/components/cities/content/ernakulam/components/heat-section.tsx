import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Ernakulam's warm, humid climate and open-sun parking" },
  { icon: IconRoad, text: "Long drives along NH66 and toward Fort Kochi" },
  { icon: IconTrafficLight, text: "Traffic through MG Road, Marine Drive and Vyttila" },
  { icon: IconPin, text: "Daily commutes across Kakkanad, Edappally and near the backwaters" },
];

export default function HeatSection() {
  return (
    <section className="ernakulam-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">
          Built for Ernakulam Roads &amp; Weather
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">Ernakulam</span> <span className="text-heat">Heat?</span>
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
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"If your regular driving takes you through MG Road, Marine Drive, Kakkanad, Edappally, Vyttila, or along NH66, you know the drill — your car spends half its life either baking in open sun or inching through traffic. Throw in the odd trip toward the backwaters or Fort Kochi, and even a short weekly commute adds up to a lot of heat exposure."}</p>
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
          <Reveal className="relative order-2 aspect-[1670/942] w-full self-end overflow-hidden rounded-2xl border border-white/10">
            <Image src="/images/cities/ernakulam/traffic.png" alt="Cars and buses in Ernakulam traffic under bright sunlight" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
