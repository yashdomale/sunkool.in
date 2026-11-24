"use client";

import Image from "next/image";
import Link from "next/link";
import { FloatingParticles } from "@/components/graphics/particles";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { WARRANTY_PAGE } from "@/lib/warranty-content";
import { WarrantyActionHub } from "./warranty-action-hub";
import { WarrantyAuthenticity } from "./warranty-authenticity";
import { WarrantyHelpCta } from "./warranty-help-cta";
import { WarrantyPromiseGrid } from "./warranty-promise-grid";
import { WarrantyRegistrationSteps } from "./warranty-registration-steps";

const QUICK_LINKS = [
  { href: "#verify", label: "Verify" },
  { href: "#portal", label: "Check" },
  { href: "#register-portal", label: "Register" },
  { href: "#register", label: "Steps" },
] as const;

export function WarrantyView() {
  return (
    <>
      <PageHeader
        eyebrow={WARRANTY_PAGE.eyebrow}
        className="pt-28 pb-10 sm:pt-36 sm:pb-16"
        titleClassName="headline max-w-4xl text-balance text-4xl sm:text-5xl lg:text-7xl"
        descriptionClassName="mt-5 max-w-2xl text-base leading-relaxed text-white sm:mt-6 sm:text-lg"
        title={
          <>
            <span className="text-gradient-silver">{WARRANTY_PAGE.titleLead}</span>{" "}
            <span className="text-gradient-electric">
              {WARRANTY_PAGE.titleAccent}
            </span>
          </>
        }
        description={WARRANTY_PAGE.description}
      />

      {/* Mobile only: hero photo under the intro, above the quick-link buttons. */}
      <div className="container-lux -mt-4 pb-8 lg:hidden">
        <Reveal>
          <Image
            src="/images/MOONROOF/secure.png"
            alt="Friends smiling on a sunny drive, protected by SUNKOOL window film"
            width={1583}
            height={993}
            sizes="100vw"
            priority
            className="h-auto w-full rounded-3xl border border-white/10 shadow-[0_24px_80px_-20px_rgba(88,167,232,0.35)]"
          />
        </Reveal>
      </div>

      <nav
        aria-label="Warranty page sections"
        className="sticky top-[3.25rem] z-40 border-b border-white/8 bg-black/80 backdrop-blur-md lg:hidden"
      >
        <div className="container-lux flex gap-2 py-2.5">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring flex-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-silver-soft transition-colors hover:border-electric/40 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="relative border-t border-white/5 bg-gradient-to-b from-black via-white/[0.015] to-black">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <FloatingParticles />
          <div className="absolute left-0 top-0 h-[40vh] w-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(88,167,232,0.14),transparent)]" />
          <div className="absolute right-0 top-1/3 h-[35vh] w-[45vw] bg-[radial-gradient(circle,rgba(246,177,26,0.08),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative flex flex-col">
          <section
            id="verify"
            className="relative order-1 scroll-mt-24 py-8 sm:scroll-mt-28 sm:py-14 lg:order-2"
          >
            <WarrantyAuthenticity />
          </section>

          <section
            id="portal"
            className="relative order-2 scroll-mt-24 py-8 sm:scroll-mt-28 sm:py-14 lg:order-3"
          >
            <div className="container-lux">
              <Reveal>
                <p className="eyebrow mb-3 text-center sm:text-left">
                  Warranty portal
                </p>
                <h2 className="headline mx-auto max-w-2xl text-balance text-center text-2xl sm:mx-0 sm:text-left sm:text-4xl">
                  <span className="text-gradient-silver">Check or register</span>{" "}
                  <span className="text-gradient-kool">in one place</span>
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-white sm:mx-0 sm:mt-4 sm:text-left sm:text-base">
                  Use the official SUNKOOL warranty portal for instant lookups
                  and new registrations. Every option opens securely in a new tab.
                </p>
              </Reveal>
              <div className="mt-8 sm:mt-10">
                <WarrantyActionHub />
              </div>
            </div>
          </section>

          <section className="relative order-3 pb-4 pt-2 sm:pb-6 sm:pt-4 lg:order-1">
            <div className="container-lux">
              <WarrantyPromiseGrid />
            </div>
          </section>

          <div className="relative order-4 border-t border-white/5">
            <WarrantyRegistrationSteps />
          </div>

          <div className="relative order-5">
            <WarrantyHelpCta />
          </div>
        </div>
      </div>
    </>
  );
}
