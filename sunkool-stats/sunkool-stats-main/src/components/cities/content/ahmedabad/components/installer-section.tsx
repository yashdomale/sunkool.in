import { Logo } from "@/components/cities/shared/logo";
import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { cityLocation } from "@/lib/cities";

const PHONE = "+91 7028146972";
const EMAIL = "info@sunkool.in";

export default function InstallerSection() {
  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal as="p" className="eyebrow text-kool">{" SUNKOOL Window Film in Ahmedabad "}</Reveal>
            <Reveal
              as="h2"
              className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)] md:whitespace-nowrap"
            >
              <span className="text-[#f47521]">Authorised</span>{" "}
              <Logo
                className="inline-block h-[0.85em] w-auto align-baseline"
              />{" "}
              <span className="text-kool">Installer</span>
            </Reveal>
            <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"Looking for car window film near you in Ahmedabad? Contact the SUNKOOL team for film selection, installation queries and vehicle-specific recommendations."}</p>
          </div>
        </div>

        <Reveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger>
          <GlowCard className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-gradient-silver font-display text-2xl font-bold">{cityLocation("ahmedabad")}</p>
            <p className="mt-3 text-[15px] font-medium text-silver-soft">Car Window Film Installation</p>
            <p className="mt-3 text-sm text-fog">
              Phone: {PHONE} &middot; Email: {EMAIL}
            </p>

          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}
