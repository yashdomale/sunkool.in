import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";

const steps = [
  {
    n: "01",
    title: "Vehicle Evaluation",
    body: "We assess your car model, glass type and heat protection needs.",
  },
  {
    n: "02",
    title: "Film Selection",
    body: "The SUNKOOL team helps select a film based on visibility, heat rejection and appearance.",
  },
  {
    n: "03",
    title: "Glass Preparation",
    body: "Every glass surface is thoroughly prepared before application.",
  },
  {
    n: "04",
    title: "Precision Application",
    body: "The film is cut, shaped and installed on the vehicle glass.",
  },
  {
    n: "05",
    title: "Post-Installation Checks",
    body: "The installation is inspected for clarity, edges, bubbles and overall quality.",
  },
  {
    n: "06",
    title: "Support After Sale",
    body: "SUNKOOL registers your warranty through its official program, subject to the selected product's terms.",
  },
];

export default function InstallationSection() {
  return (
    <section className="section-glow-bg relative w-full border-t border-white/10">
      <div className="mx-auto w-full max-w-[1500px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <Reveal as="p" className="eyebrow font-bold text-kool">
              Professional Installation Process
            </Reveal>
            <Reveal as="h2" className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]">
              <span className="text-sun">Professional Car Window</span>
              <br />
              <span className="text-gradient-electric">Film Installation in Indore</span>
            </Reveal>
            <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6 max-w-[680px] lg:max-w-none">{"Film selection is only one part of the process. Professional installation is just as important for optical clarity and durability. SUNKOOL's process covers vehicle evaluation, film selection, glass preparation, precision application, inspection and after-sales support."}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <a
                href="https://www.sunkool.in/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-kool px-8 py-3.5 font-display text-base font-semibold text-black transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-lux)] hover:-translate-y-0.5 hover:bg-glow hover:shadow-xl hover:shadow-kool/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Book Professional Installation
              </a>
              <a
                href={`https://wa.me/917028146972?text=${encodeURIComponent(
                  "Hi SUNKOOL, I’m interested in professional window film installation for my car. Please share the details."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-sm text-base font-semibold text-kool transition-colors hover:text-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Talk to SUNKOOL About Installation →
              </a>
            </div>
          </div>
          <Reveal className="installation-photo relative aspect-[16/10] w-full">
            <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/10">
              <Image
                src="/images/installation-hero.jpg"
                alt="Professional technician installing window film on a car."
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
                style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)" }}
              />
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger>
          {steps.map((step) => (
            <GlowCard key={step.n} variant="reveal-card" kool className="rounded-[18px] border border-white/10 bg-white/[0.03] p-7">
              <span className="reveal-card-icon text-gradient-electric font-display text-3xl font-extrabold">{step.n}</span>
              <h3 className="text-gradient-silver mt-3 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-[15px] font-bold leading-relaxed text-silver-soft">{step.body}</p>
            </GlowCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
