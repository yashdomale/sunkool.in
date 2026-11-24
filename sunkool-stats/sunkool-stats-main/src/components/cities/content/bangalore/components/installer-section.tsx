import { Logo } from "@/components/layout/logo";
import { cityLocation } from "@/lib/cities";
import GlowCard from "@/components/cities/shared/glow-card";
import { IconGoogleMapsPin } from "@/components/cities/content/bangalore/components/icons";

const installerAreas = [
  { name: "Glamour Car Accessories", area: "Koramangala", region: "Banglore South" },
  { name: "Unique Car Accessories", area: "HSR Layout", region: "Banglore South" },
  { name: "GMS Car Modifiers", area: "KR Puram", region: "Banglore East" },
  { name: "Auto Customize", area: "HSR Layout", region: "Banglore South" },
];

export default function InstallerSection() {
  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <div>
          <p className="reveal-fade-up eyebrow text-kool">Find SUNKOOL in Banglore</p>
          <h2 className="reveal-fade-up headline text-gradient-silver mt-4 whitespace-nowrap text-[clamp(15px,6vw,64px)]">
            <span className="text-[#f47521]">Authorised </span>
            <Logo className="mr-[0.4em] inline-block h-[0.85em] w-auto align-baseline" />
            <span className="text-gradient-electric">Installers</span>
          </h2>
        </div>
        <p className="mt-4 text-[16px] leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px]">
          Looking for car window film near you in Banglore? You can contact the SUNKOOL team for film
          selection, installation queries and vehicle-specific recommendations.
        </p>

        <div className="reveal-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {installerAreas.map((installer) => (
            <GlowCard
              key={installer.name}
              variant="reveal-card"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
            >
              <span className="reveal-card-icon inline-flex items-center rounded-full border border-kool/30 bg-kool/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-kool">
                SUNKOOL Authorised Installer
              </span>
              <p className="text-gradient-silver mt-4 font-display text-xl font-bold">{installer.name}</p>
              <p className="text-sm text-fog">
                {cityLocation("bangalore")}
              </p>
              <p className="mt-3 text-[15px] font-medium text-silver-soft">Car Window Film Installation</p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${installer.name} ${installer.area} Banglore`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get directions to ${installer.name}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-kool bg-black/40 px-4 py-2.5 font-display text-sm font-semibold text-kool transition-colors duration-300 ease-[var(--ease-lux)] hover:bg-kool/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <IconGoogleMapsPin />
                  Directions
                </a>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
