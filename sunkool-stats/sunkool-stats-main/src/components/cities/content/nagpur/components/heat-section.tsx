import type { TemplateCopy } from "@/components/cities/content/nagpur/copy";
import Image from "next/image";
import { Logo } from "@/components/layout/logo";
import Reveal from "@/components/cities/shared/reveal";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/shared/icons";

const bulletIcons = [IconSun, IconRoad, IconTrafficLight, IconPin];

export default function HeatSection({ copy }: { copy: TemplateCopy["heat"] }) {
  return (
    <section className="nagpur-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-center text-kool">{copy.eyebrow}</Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]"
        >
          <span className="block">
            <span className="text-heat">{copy.cityName}</span> <span className="text-heat">Heat?</span>
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
              {copy.bullets.map((text, i) => {
                const Icon = bulletIcons[i];
                return (
                <div key={text}>
                  <span className="text-kool">
                    <Icon />
                  </span>
                  <p className="mt-3 text-[15px] leading-relaxed text-silver-soft sm:text-base">{text}</p>
                </div>
                );
              })}
            </Reveal>
            <p className="mt-8 text-sm leading-relaxed text-silver-soft">{copy.servedArea}</p>
            <p className="mt-6 text-lg font-semibold text-white sm:text-xl">
              Heat Reduction. Glare Reduction. Comfort.
            </p>
          </div>
          <Reveal className={`relative order-2 ${copy.imageAspectClass} w-full self-end overflow-hidden rounded-2xl border border-white/10`}>
            <Image
              src={copy.image}
              alt={copy.imageAlt}
              loading="lazy"
              fill
              sizes="100vw"
              className={copy.imageFitClass}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
