import { Logo } from "@/components/layout/logo";
import Image from "next/image";
import { IconSun, IconRoad, IconTrafficLight, IconPin } from "@/components/cities/content/bangalore/components/icons";

const bullets = [
  { icon: IconSun, text: "Direct sunlight during peak daytime hours" },
  { icon: IconRoad, text: "Long drives along the Outer Ring Road" },
  { icon: IconTrafficLight, text: "Traffic in Koramangala, HSR Layout, Indiranagar" },
  { icon: IconPin, text: "Daily commutes across Whitefield, Electronic City, Marathahalli & beyond" },
];

const commuteAreas = [
  "Whitefield",
  "Marathahalli",
  "Electronic City",
  "Outer Ring Road",
  "Koramangala",
  "HSR Layout",
  "Indiranagar",
  "Bellandur",
  "Sarjapur Road",
  "Hebbal",
];

export default function HeatSection() {
  return (
    <section className="city-heat-section relative w-full border-t border-white/10">
      <div className="container-lux relative py-16 sm:py-20 lg:py-28">
        <p className="reveal-fade-up eyebrow text-center text-kool">Built for Banglore Roads &amp; Weather</p>
        <h2 className="reveal-fade-up headline text-gradient-silver text-balance mt-4 text-center text-[clamp(42px,4vw,64px)]">
          <span className="text-heat">Banglore</span> <span className="text-heat">Heat?</span>
          <br />
          <span className="text-gradient-electric">Control It With</span>{" "}
          <Logo className="mr-1 inline-block h-[0.85em] w-auto align-baseline" />
        </h2>
        <p className="reveal-fade-up mt-6 text-[15px] font-semibold leading-relaxed text-silver-soft sm:text-base">
          Whether you&rsquo;re driving into the city, parking your car out in the open throughout the day or
          driving long distances on highways, too much sunlight will certainly create discomfort within the
          interior. SUNKOOL window film aims to solve the three issues most drivers want addressed in their
          car — heat, glare and everyday comfort. There are also high-VLT versions available which
          don&rsquo;t necessarily have to be too dark.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[13fr_12fr] lg:gap-16">
          <div className="flex flex-col lg:h-full">
            <div className="reveal-stagger grid grid-cols-2 gap-6">
              {bullets.map(({ icon: Icon, text }) => (
                <div key={text}>
                  <span className="text-kool">
                    <Icon />
                  </span>
                  <p className="mt-3 text-[15px] leading-relaxed text-silver-soft sm:text-base">{text}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-silver-soft">
              SUNKOOL also serves drivers across {commuteAreas.slice(5).join(", ")} and the wider Banglore
              region.
            </p>
            <p className="mt-6 text-lg font-semibold text-white sm:text-xl lg:mt-auto">
              Less solar heat. Less glare. More comfortable driving.
            </p>
          </div>
          <div className="reveal-fade-up relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/cities/bangalore/bangalore.png"
              alt="Banglore skyline with metro train and busy highway traffic at sunset"
              loading="lazy"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
