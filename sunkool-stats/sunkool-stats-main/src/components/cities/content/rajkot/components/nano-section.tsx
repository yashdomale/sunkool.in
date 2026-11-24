import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import {
  IconHeatThermo,
  IconUVShield,
  IconEye,
  IconSignalBars,
  IconHexagon,
  IconShield,
} from "@/components/cities/shared/icons";

const cards = [
  { icon: IconHeatThermo, title: "Built on Nano-Ceramic Technology", body: "The films use ceramic particles specifically engineered to block infrared energy, a different mechanism entirely from simply darkening the glass." },
  { icon: IconUVShield, title: "Strong UV Performance Across Every Grade", body: "Every film in the lineup is built for solid UV rejection, so choosing a lighter film doesn't mean giving up protection." },
  { icon: IconEye, title: "Clarity Without Losing Performance", body: "Higher VLT grades deliver solar protection while keeping the glass close to its factory-clear look." },
  { icon: IconSignalBars, title: "No Signal Interference", body: "Because the film carries no metallic layer, GPS, mobile network signal, and FASTag all continue functioning exactly as before." },
  { icon: IconHexagon, title: "A Grade Built for Every Priority", body: "Whether the priority is maximum darkness or maximum visibility, there's a specific film in the range built around that need." },
];

const bottomStats: { icon: typeof IconHexagon; label: string; sub: string }[] = [
  { icon: IconHexagon, sub: "Advanced", label: "Nano-Ceramic" },
  { icon: IconHeatThermo, sub: "Upto 95%*", label: "IR Rejection" },
  { icon: IconUVShield, sub: "Upto 99%*", label: "UV Protection" },
  { icon: IconEye, sub: "Crystal Clear", label: "Visibility" },
  { icon: IconSignalBars, sub: "Signal-safe", label: "Technology" },
  { icon: IconShield, sub: "Long Lasting", label: "Durability" },
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
        <Reveal as="p" className="eyebrow text-white">
          Why SUNKOOL&apos;s Film Range Is Built the Way It Is
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
        >
          <span className="text-sun">Dark Isn&apos;t the Same</span>
          <br />
          <span className="text-gradient-electric">as Effective</span>
        </Reveal>

<p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">A common assumption is that the darkest film available must be best at blocking heat. That&apos;s not how it works. VLT measures how much light passes through, not how much heat is blocked. Nano-ceramic technology is specifically engineered to reject infrared energy, which means a lighter film with the right ceramic composition can outperform a much darker film that lacks it.</p><p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-4">Most buyers judge a film purely by how dark it looks. The parameters that actually determine performance are Total Solar Energy Rejected (TSER), infrared rejection, UV rejection, Visible Light Transmission (VLT), optical clarity, signal safety, durability and installation quality.</p>
        <h3 className="mt-8 font-display text-xl font-bold text-white">What good nano-ceramic film actually gets you</h3>
        <ul className="mt-4 grid list-disc gap-3 pl-5 sm:grid-cols-2">
          <li>Genuine infrared heat rejection</li>
          <li>Strong UV blocking</li>
          <li>Reduced glare</li>
          <li>A noticeably cooler cabin</li>
          <li>Clear, undistorted visibility</li>
          <li>Zero signal interference</li>
          <li>Longer-lasting interior materials</li>
          <li>A choice of VLT levels to match the finish you actually want</li>
        </ul>
        <div className="mt-10 grid gap-12 lg:grid-cols-[54fr_46fr] lg:gap-16">
          <Reveal className="grid gap-5 sm:grid-cols-2" stagger>
            {cards.map(({ icon: Icon, title, body }, index) => (
              <GlowCard
                key={title}
                className={`rounded-2xl border border-white/10 bg-white/[0.03] p-7 ${
                  index === cards.length - 1 ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-10px)]" : ""
                }`}
              >
                <span className="glow-card-icon text-kool">
                  <Icon />
                </span>
                <p className="text-gradient-silver mt-4 font-display text-lg font-bold sm:text-xl">{title}</p>
                <p className="mt-2 text-[15px] font-bold leading-relaxed text-silver-soft sm:text-base">
                  {body}
                </p>
              </GlowCard>
            ))}
          </Reveal>
          <div className="nano-image-frame relative h-[473px] w-full max-w-[840px] self-start overflow-hidden rounded-3xl border border-white/10 bg-black lg:justify-self-center">
            <Image
              src="/images/layer.png"
              alt="Exploded view of the SUNKOOL nano-ceramic film's layers: anti-scratch coating, UV absorber coating, nano-ceramic IR coating and optical adhesive coating"
              loading="lazy"
              fill
              sizes="(min-width: 1024px) 56vw, 90vw"
              className="object-contain"
            />
          </div>
        </div>

        <Reveal className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-12 sm:grid-cols-3 lg:grid-cols-6" stagger>
          {bottomStats.map((stat) => (
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
        </Reveal>
        <p className="mt-4 text-sm leading-relaxed text-fog">
          *SUNKOOL states that these values are based on routinely accumulated quality-control data and may vary
          between batches.
        </p>
        <a
          href="https://www.sunkool.in/window-film"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center text-base font-semibold text-kool transition-colors hover:text-glow"
        >
          Explore SUNKOOL Window Films →
        </a>
      </div>
    </section>
  );
}
