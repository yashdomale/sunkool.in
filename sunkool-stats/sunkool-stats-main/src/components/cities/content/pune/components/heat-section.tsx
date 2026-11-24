import { Logo } from "@/components/layout/logo";
import Image from "next/image";
import { Eyebrow, SectionHeading, Paragraph } from "@/components/cities/content/pune/components/landing-blocks";
import { Icon } from "@/components/cities/content/pune/components/landing-icons";
import { commuteAreas } from "@/components/cities/content/pune/lib/content";

export default function HeatSection() {
  return (
    <>
      {/* 3. Built for Pune Roads & Weather */}
      <section
        className="relative w-full overflow-hidden border-t border-white/10 bg-black"
        style={{
          isolation: "isolate",
          backgroundColor: "#000",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage:
            "radial-gradient(68% 95% at 50% 42%, #072d46c7 0%, #042034a3 32%, #02142273 55%, #010a1238 70%, transparent 86%)",
        }}
      >
        <div className="container-lux relative z-10 py-16 sm:py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[13fr_12fr] lg:gap-16">
            <div className="reveal-fade-up relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 lg:order-1 lg:aspect-auto lg:min-h-[420px]">
              <Image
                src="/images/cities/pune/pune-expressway-skyline.png"
                alt="Elevated expressway and skyline in Pune at golden hour"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            <div>
              <Eyebrow color="kool">Built for Pune Roads &amp; Weather</Eyebrow>
              <SectionHeading>
                <span className="text-heat">Pune Heat?</span>{" "}
                <span className="text-gradient-electric">Control</span>
                <br className="hidden sm:block" />{" "}
                <span className="text-gradient-electric">It With</span>{" "}
                <span className="relative inline-block h-[0.85em] w-[3.56em] align-middle -translate-y-[0.05em]">
                  <Logo className="absolute inset-0 h-full w-full object-contain object-left" />
                </span>
              </SectionHeading>

              <Paragraph className="mt-6 max-w-[560px]">
                Whether you&rsquo;re driving into the city, parking your car out in the open
                through the day or covering long distances on the expressway, too much
                sunlight quickly turns into discomfort inside the cabin. SUNKOOL window film
                is built to solve the three issues Pune drivers ask about most &mdash; heat,
                glare and everyday comfort. High-VLT versions are also available that
                don&rsquo;t need to look too dark.
              </Paragraph>

              <div className="reveal-stagger mt-8 grid grid-cols-2 gap-6">
                {[
                  { icon: "sun" as const, label: "Intense afternoon sunlight" },
                  { icon: "road" as const, label: "Long drives on the Mumbai-Pune Expressway" },
                  { icon: "traffic" as const, label: "Traffic in Hinjawadi, Baner, Wakad" },
                  {
                    icon: "pin" as const,
                    label: "Daily commutes across Kharadi, Viman Nagar, Hadapsar & beyond",
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
                wider Pune region.
              </p>

              <p className="mt-6 text-lg font-semibold text-white sm:text-xl">
                Heat Reduction. Glare Reduction. Comfort.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
