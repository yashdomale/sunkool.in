import { Logo } from "@/components/layout/logo";
import Link from "next/link";
import GlowCard from "@/components/cities/content/pune/components/glow-card";
import { Eyebrow, SectionHeading, CtaLink } from "@/components/cities/content/pune/components/landing-blocks";
import { Icon } from "@/components/cities/content/pune/components/landing-icons";
import { installerAreas } from "@/components/cities/content/pune/lib/content";

export default function InstallerSection() {
  return (
    <>
      {/* 9. Find SUNKOOL in Pune */}
      <section className="relative w-full border-t border-white/10 bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow color="kool">Find SUNKOOL in Pune</Eyebrow>
              <SectionHeading className="lg:!text-[76px] xl:!text-[88px] lg:whitespace-nowrap">
                <span className="text-[#f47521]">Authorised</span>{" "}
                <Logo className="inline-block h-[0.85em] w-auto -translate-y-[0.05em] object-contain align-middle brightness-110" />{" "}
                <span className="text-kool">Installers</span>
              </SectionHeading>
            </div>
            <CtaLink href="/contact">Contact for full list &rarr;</CtaLink>
          </div>

          <div className="reveal-stagger mt-10 grid gap-6 sm:grid-cols-3">
            {installerAreas.map((installer) => (
              <GlowCard
                key={installer.area}
                cornerGlow
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="inline-flex items-center rounded-full border border-kool/30 bg-kool/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-kool">
                  SUNKOOL Authorised Installer
                </span>
                <h3 className="text-gradient-silver mt-4 font-display text-lg font-semibold sm:text-xl">
                  {installer.name}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-silver-soft">
                  Car Window Film Installation
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href={installer.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get directions to ${installer.name}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-kool bg-black/40 px-4 py-2.5 font-display text-sm font-semibold text-kool transition-colors duration-300 ease-[var(--ease-lux)] hover:bg-kool/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <Icon name="gmap" className="h-5 w-5" />
                    Directions
                  </Link>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
