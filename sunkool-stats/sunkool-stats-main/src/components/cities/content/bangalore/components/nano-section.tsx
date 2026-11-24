import Image from "next/image";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconUVShield, IconEye, IconSignalBars, IconHexagon, IconShield } from "@/components/cities/content/bangalore/components/icons";

const cards = [
  {
    icon: IconHeatThermo,
    title: "Engineered for Heat Rejection",
    body: "The nano-ceramic films of SUNKOOL are manufactured for heat rejection without using metal technology.",
  },
  {
    icon: IconUVShield,
    title: "High UV Rejection",
    body: "Based on the quality of the film, the company claims 99% UV rejection in their films.",
  },
  {
    icon: IconEye,
    title: "Excellent Optical Clarity",
    body: "There are high-VLT films in the range of the company that are meant for customers seeking heat protection without a highly tinted appearance.",
  },
  {
    icon: IconSignalBars,
    title: "Signal Safe Technology",
    body: "This is because of the non-metallic construction of the films which helps allow vehicle signals to connect.",
  },
];

const fifthCard = {
  icon: IconHexagon,
  title: "Multiple Film Qualities",
  body: "There are multiple qualities in the range of SUNKOOL films to choose from.",
};

const nanoStats: { icon: typeof IconHexagon; label: string; sub: string }[] = [
  { icon: IconHexagon, sub: "Advanced", label: "Nano-Ceramic" },
  { icon: IconHeatThermo, sub: "Upto 95%*", label: "Heat Rejection" },
  { icon: IconUVShield, sub: "Upto 99%*", label: "UV Protection" },
  { icon: IconEye, sub: "Crystal Clear", label: "Visibility" },
  { icon: IconSignalBars, sub: "Signal-safe", label: "Technology" },
  { icon: IconShield, sub: "Long Lasting", label: "Durability" },
];

const filmLayers = [
  "Scratch Resistant Layer",
  "UV Protection Layer",
  "Nano-Ceramic IR Layer",
  "Optical Adhesive Layer",
  "Safety Base Film",
];

export default function NanoSection() {
  return (
    <section className="section-glow-bg relative w-full overflow-hidden border-t border-white/10 bg-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 50% -10%, rgba(58,130,195,0.55) 0%, rgba(40,100,160,0.28) 35%, rgba(0,0,0,0) 75%)",
        }}
      />
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
        <p className="reveal-fade-up eyebrow text-white">SUNKOOL Nano-Ceramic Technology</p>
        <h2 className="reveal-fade-up headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]">
          <span className="text-[#f47521]">More Than Just</span>
          <br />
          <span className="text-gradient-electric">Dark Glass.</span>
        </h2>
        <p className="reveal-fade-up mt-6 text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px]">
          Customers in Bangalore can contact the SUNKOOL team for assistance in selecting their preferred
          films and installing them.
        </p>
        <p className="reveal-fade-up mt-4 text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px]">
          Dark glass tint is not the same as the new age nano-ceramic window film. Nano-ceramic films
          incorporate ceramic nanoparticles into the film itself in order to block IR rays. SUNKOOL refers
          to their window films as a multi-layer film, consisting of an anti-scratch coating, UV absorber
          coating, nano-ceramic IR coating and optical adhesive coating.
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-[43fr_57fr] lg:gap-16">
          <div>
            <div className="reveal-stagger grid gap-4 sm:grid-cols-2">
              {cards.map(({ icon: Icon, title, body }) => (
                <GlowCard
                  key={title}
                  variant="reveal-card"
                  kool
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06]"
                >
                  <span className="reveal-card-icon text-kool">
                    <Icon />
                  </span>
                  <p className="text-gradient-silver mt-4 font-display text-lg font-semibold">{title}</p>
                  <p className="mt-2 text-[15px] font-bold leading-relaxed text-white/85">{body}</p>
                </GlowCard>
              ))}
              <div className="sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.5rem)]">
                <GlowCard
                  variant="reveal-card"
                  kool
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06]"
                >
                  <span className="reveal-card-icon text-kool">
                    <fifthCard.icon />
                  </span>
                  <p className="text-gradient-silver mt-4 font-display text-lg font-semibold">
                    {fifthCard.title}
                  </p>
                  <p className="mt-2 text-[15px] font-bold leading-relaxed text-white/85">{fifthCard.body}</p>
                </GlowCard>
              </div>
            </div>
          </div>

          <div className="nano-image-frame relative flex w-full items-center justify-center self-start overflow-hidden rounded-3xl border border-white/10 bg-black p-4 sm:p-8 lg:p-10">
            <div className="nano-image-inner relative aspect-[759/641] w-full max-w-[820px]">
              <Image
                src="/images/layer.png"
                alt={`Exploded view of the SUNKOOL nano-ceramic film's five layers: ${filmLayers.join(", ")}`}
                loading="lazy"
                fill
                sizes="(min-width: 1024px) 57vw, 95vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="reveal-stagger mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-12 sm:grid-cols-3 lg:grid-cols-6">
          {nanoStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <span className="text-kool">
                <stat.icon />
              </span>
              <div>
                <p className="text-gradient-silver font-display text-base font-semibold sm:text-lg">{stat.sub}</p>
                <p className="text-sm text-silver-soft">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-fog">*Values vary based on film series and VLT selected.</p>
      </div>
    </section>
  );
}
