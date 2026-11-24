import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bullets = [
  { icon: IconSun, text: "Indore's dry summer heat, especially through April, May and June" },
  { icon: IconRoad, text: "Everyday drives along AB Road" },
  { icon: IconTrafficLight, text: "Long drives toward Ujjain along MR10" },
  { icon: IconPin, text: "Outdoor parking near Vijay Nagar and Palasia" },
];

export default function HeatSection() {
  return (
    <section className="indore-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">
          Built for Indore Roads &amp; Weather
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">Indore</span> <span className="text-heat">Heat?</span>
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
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"Whether you are driving along AB Road, parking outdoors near Vijay Nagar or Palasia, or covering long stretches toward Ujjain on MR10, too much sunlight can make your car interior uncomfortable. SUNKOOL window film focuses on heat reduction, glare reduction and everyday comfort."}</p>
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
              Higher-VLT film options offer heat protection with a lighter appearance, so your choice does not have to depend on darkness alone.
            </p>
            <p className="mt-6 text-lg font-semibold text-white sm:text-xl">
              Heat Reduction. Glare Reduction. Comfort.
            </p>
          </div>
          <Reveal className="relative order-2 aspect-[1672/941] w-full self-end overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/cities/indore/TRAFFIC.png"
              alt="Indore city traffic in daytime sun, with cars and two-wheelers on the road"
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
