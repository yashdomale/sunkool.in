import Image from "next/image";
import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";

const PHONE = "+91 7028146972";
const EMAIL = "info@sunkool.in";

export default function InstallerSection() {
  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal as="p" className="eyebrow text-kool">
              SUNKOOL Window Film in Bhopal
            </Reveal>
            <Reveal
              as="h2"
              className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
            >
              <span className="text-sun">Talk to</span>{" "}
              <Image
                src="/sunkool-wordmark.png"
                alt="Sunkool"
                width={220}
                height={46}
                loading="lazy"
                className="inline-block h-[0.85em] w-auto align-baseline"
              />{" "}
              <span className="text-kool">About Installation</span>
            </Reveal>
            <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">
              Looking for car window film near you in Bhopal? You can contact the SUNKOOL team for film
              selection, installation queries and vehicle-specific recommendations.
            </p>
          </div>
        </div>

        <Reveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger>
          <GlowCard className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-gradient-silver font-display text-2xl font-bold">Bhopal Installation Enquiries</p>
            <p className="text-sm text-fog">Bhopal, Madhya Pradesh</p>
            <p className="mt-3 text-[15px] font-medium text-silver-soft">Contact SUNKOOL directly to find out what installation options are available in Bhopal.</p>
            <p className="mt-3 text-[15px] font-medium text-silver-soft">Car Window Film Installation</p>
            <p className="mt-3 text-sm text-fog">
              Phone: {PHONE} &middot; Email: {EMAIL}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-kool bg-black/40 px-4 py-2.5 font-display text-sm font-semibold text-kool transition-colors duration-300 ease-[var(--ease-lux)] hover:bg-kool/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                
                Contact SUNKOOL
              </a>
            </div>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}
