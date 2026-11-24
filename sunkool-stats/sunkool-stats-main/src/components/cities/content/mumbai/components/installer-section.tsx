import { Logo } from "@/components/layout/logo";
import { cityLocation } from "@/lib/cities";
import GlowCard from "@/components/cities/content/mumbai/components/glow-card";
import { Icon } from "@/components/cities/content/mumbai/components/landing-icons";
import { Eyebrow, SectionHeading } from "@/components/cities/content/mumbai/components/landing-blocks";
import { installerLocations } from "@/components/cities/content/mumbai/lib/content";

export default function InstallerSection() {
  return (
    <>
      {/* 8.5 Find SUNKOOL in Mumbai */}
      <section className="relative w-full border-t border-white/10 bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow color="kool">Authorised SUNKOOL Installers</Eyebrow>
              <SectionHeading>
                <span className="text-[#f47521]">Authorised</span>{" "}
                <Logo className="inline-block h-[0.85em] w-auto align-baseline" />{" "}
                <span className="text-gradient-electric">Installers</span>
              </SectionHeading>
            </div>
          </div>

          <div className="reveal-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {installerLocations.map((loc) => (
              <GlowCard
                key={loc.area}
                cornerGlow
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="inline-flex items-center rounded-full border border-kool/30 bg-kool/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-kool">
                  SUNKOOL Authorised Installer
                </span>

                <p className="text-gradient-silver mt-4 font-display text-2xl font-bold">
                  {cityLocation("mumbai")}
                </p>

                <p className="mt-3 text-[15px] font-medium text-silver-soft">
                  Car Window Film Installation
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `SUNKOOL authorised installer ${loc.area} Mumbai`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-kool bg-black/40 px-4 py-2.5 font-display text-sm font-semibold text-kool transition-colors duration-300 ease-[var(--ease-lux)] hover:bg-kool/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <Icon name="gmapPin" className="h-4 w-4" />
                    Directions
                  </a>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
