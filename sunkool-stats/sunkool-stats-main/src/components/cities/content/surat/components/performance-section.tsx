import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { StatNumber } from "@/components/cities/shared/count-up";

const glossary = [
  {
    term: "TSER – Total Solar Energy Rejected",
    body: "The combined percentage of solar energy blocked by your glass and film together.",
  },
  {
    term: "IR Rejection",
    body: "How much infrared heat specifically gets stopped by the film.",
  },
  {
    term: "VLT – Visible Light Transmission",
    body: "How much visible light passes through the window.",
  },
  {
    term: "UV Rejection",
    body: "How effectively the film blocks ultraviolet rays.",
  },
];

const priorities = [
  {
    title: "Visibility",
    body: "Some drivers will prioritize visibility with a higher-VLT film.",
  },
  {
    title: "Solar Rejection",
    body: "Others will want maximum solar rejection with a darker grade.",
  },
  {
    title: "Your Vehicle & Local Rules",
    body: "Both approaches are reasonable, depending on your vehicle and the applicable local rules.",
  },
];

export default function PerformanceSection() {
  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-kool">
          Car Heat Protection for Surat
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
        >
          <span className="text-sun">The Numbers That Actually</span> <span className="text-gradient-electric">Matter for Heat</span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">
          If cutting cabin heat is your main goal, shop by these figures instead of by shade alone:
        </p>

        <Reveal className="mt-10 grid gap-8 border-t border-white/10 pt-10 text-center sm:grid-cols-3" stagger>
          <div>
            <StatNumber target={95} prefix="Up to " suffix="%" ariaLabel="Up to 95 percent" className="text-4xl font-extrabold sm:text-5xl" />
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">IR Rejection</p>
          </div>
          <div>
            <StatNumber target={99} suffix="%" ariaLabel="99 percent" className="text-4xl font-extrabold sm:text-5xl" />
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">UV Protection</p>
          </div>
          <div>
            <StatNumber target={100} suffix="%" ariaLabel="100 percent" minWidth="3ch" className="text-4xl font-extrabold sm:text-5xl" />
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-fog sm:text-base">Signal Safe</p>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4" stagger>
          {glossary.map(({ term, body }) => (
            <GlowCard key={term} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="font-display text-[15px] font-bold text-kool sm:text-base">{term}</p>
              <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">{body}</p>
            </GlowCard>
          ))}
        </Reveal>

        <h3 className="mt-14 text-gradient-silver font-display text-xl font-bold sm:mt-16 sm:text-2xl">
          Choosing Film for Surat&apos;s Climate
        </h3>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-3">
          Surat&apos;s mix of heat and humidity makes the instinct to go as dark as possible understandable, but the
          smarter approach weighs all five factors together:
        </p>
        <p className="mt-4 font-display text-lg font-semibold text-white sm:text-xl">
          Heat Rejection + IR Rejection + UV Protection + Visibility + VLT
        </p>
        <Reveal className="mt-8 grid gap-6 sm:grid-cols-3" stagger>
          {priorities.map(({ title, body }) => (
            <GlowCard key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-gradient-silver font-display text-[15px] font-bold sm:text-base">{title}</p>
              <p className="mt-1 text-[15px] font-bold leading-relaxed text-silver-soft">{body}</p>
            </GlowCard>
          ))}
        </Reveal>
        <a
          href="https://www.sunkool.in/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center text-base font-semibold text-kool transition-colors hover:text-glow"
        >
          Not sure which film suits your car? Get a recommendation →
        </a>

        <Reveal className="mt-10 rounded-2xl border border-sun/30 bg-gradient-to-r from-black via-sun/10 to-sun/25 p-6 sm:p-7">
          <h3 className="font-display text-xl font-semibold text-sun">Window Tint Rules in Surat</h3>
          <p className="mt-4 text-base leading-relaxed text-silver-soft">
            Before booking an installation, it&apos;s worth knowing what actually governs vehicle glass in India.
            SUNKOOL&apos;s guidance references CMVR Rule 100 and IS 2553 (Part 2): 2019 (Revision 1), which set the
            requirements around vehicle glass and VLT.
          </p>
          <p className="mt-4 text-base leading-relaxed text-silver-soft">
            Here&apos;s the part people often miss: the final VLT on your window isn&apos;t just the film&apos;s rated
            VLT — it&apos;s the combination of your car&apos;s original glass and whatever film gets added. A film
            rated at 70% VLT won&apos;t necessarily read 70% once it&apos;s actually installed.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-silver-soft">
            <span className="font-semibold text-white">Important:</span> Regulatory requirements and enforcement can
            change over time. Confirm the current applicable rules and your car&apos;s final VLT before installation.
          </p>
          <a
            href="https://www.sunkool.in/regulations"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex font-semibold text-kool transition-colors hover:text-glow"
          >
            Check Window Film Regulations →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
