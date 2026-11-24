import Image from "next/image";
import GlowCard from "@/components/cities/shared/glow-card";

const steps = [
  {
    n: "01",
    title: "Vehicle Evaluation",
    body: "Your car's make, glass configuration and heat-protection needs are assessed to recommend a suitable film grade.",
  },
  {
    n: "02",
    title: "Film Selection",
    body: "Our staff will assist in picking the right film grade based on visibility, heat rejection and aesthetics.",
  },
  {
    n: "03",
    title: "Glass Preparation",
    body: "The glass surface is thoroughly prepared prior to application.",
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
    body: "SUNKOOL will register your warranty through its official program.",
  },
];

export default function InstallationSection() {
  return (
    <section className="section-glow-bg relative w-full border-t border-white/10">
      <div className="mx-auto w-full max-w-[1500px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="reveal-fade-up eyebrow font-bold text-kool">Professional Installation Process</p>
            <h2 className="reveal-fade-up headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]">
              <span className="text-[#f47521]">Professional Car Window</span>
              <br />
              <span className="text-gradient-electric">Film Installation in Banglore</span>
            </h2>
            <p className="text-[16px] leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6 max-w-[680px] lg:max-w-none">
              Even high-quality film can deliver a poor result if it is incorrectly installed. Professional
              installation helps ensure proper glass preparation, accurate film positioning, clean edges,
              minimal visual distortion and a consistent finish.
            </p>
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
                href="https://api.whatsapp.com/send/?phone=917028146972&text=Hi+SUNKOOL%2C+I%E2%80%99m+interested+in+professional+window+film+installation+for+my+car.+Please+share+the+details.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-sm text-base font-semibold text-kool transition-colors hover:text-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Talk to SUNKOOL →
              </a>
            </div>
          </div>
          <div className="installation-photo reveal-fade-up relative aspect-[16/10] w-full">
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
          </div>
        </div>

        <div className="reveal-stagger mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <GlowCard key={step.n} variant="reveal-card" kool className="rounded-[18px] border border-white/10 bg-white/[0.03] p-7">
              <span className="reveal-card-icon text-gradient-electric font-display text-3xl font-extrabold">{step.n}</span>
              <h3 className="text-gradient-silver mt-3 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-[15px] font-bold leading-relaxed text-silver-soft">{step.body}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
