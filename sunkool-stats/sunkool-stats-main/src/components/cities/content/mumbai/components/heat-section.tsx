import { Logo } from "@/components/layout/logo";
import Image from "next/image";
import { Icon } from "@/components/cities/content/mumbai/components/landing-icons";
import { Eyebrow, SectionHeading, Paragraph } from "@/components/cities/content/mumbai/components/landing-blocks";
import { commuteAreas } from "@/components/cities/content/mumbai/lib/content";

export default function HeatSection() {
  return (
    <>
      {/* 3. Built for Mumbai Roads & Weather */}
      <section className="mumbai-heat-section relative w-full border-t border-white/10">
        <div className="container-lux relative py-16 sm:py-20 lg:py-28">
          <div className="text-center">
            <Eyebrow color="kool" className="text-center">Built for Mumbai Roads &amp; Weather</Eyebrow>
            <SectionHeading className="text-center">
              <span className="text-heat">Mumbai</span>{" "}
              <span className="text-heat">Heat?</span>
              <br />
              <span className="text-gradient-electric">Control It With</span>{" "}
              <Logo className="inline-block h-[0.85em] w-auto align-baseline" />
            </SectionHeading>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-end lg:gap-16">
            <Paragraph className="w-full max-w-[1200px] mx-auto text-left font-bold lg:col-span-full">
              Whether you&rsquo;re commuting through Mumbai&rsquo;s busy roads, driving in the
              afternoon or leaving your vehicle parked outdoors, solar heat can quickly make the
              cabin uncomfortable. A good window film addresses heat, glare and UV exposure
              together &mdash; and you don&rsquo;t necessarily need an extremely dark film to
              get meaningful heat rejection.
            </Paragraph>

            <div className="lg:mb-8">
              <div className="reveal-stagger grid grid-cols-2 gap-6">
                {[
                  { icon: "sun" as const, label: "Intense coastal sunlight and humidity through peak daytime hours" },
                  { icon: "road" as const, label: "Long drives along the Western Express Highway & Eastern Express Highway" },
                  { icon: "traffic" as const, label: "Traffic through Andheri, Bandra and Lower Parel" },
                  {
                    icon: "pin" as const,
                    label: "Daily commutes across Powai, BKC, Goregaon & beyond",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <span className="text-kool">
                      <Icon name={item.icon} />
                    </span>
                    <p className="mt-3 text-[15px] leading-relaxed text-silver-soft sm:text-base">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm leading-relaxed text-silver-soft">
                SUNKOOL also serves drivers across {commuteAreas.slice(5).join(", ")} and the
                wider Mumbai region.
              </p>

              <p className="mt-6 text-lg font-semibold text-white sm:text-xl">
                Less solar heat. Less glare. More comfortable driving.
              </p>
            </div>

            <div className="reveal-fade-up relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 lg:aspect-auto lg:min-h-[420px]">
              <Image
                src="/images/cities/mumbai/mumbai-skyline-traffic.png"
                alt="Mumbai coastal skyline and expressway traffic near the Bandra-Worli Sea Link under intense midday sun"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
