"use client";
import { VisibleLoop } from "@/components/ui/visible-loop";

import { MagneticButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const MARQUEE = [
  "99.9% UV REJECTION",
  "NANO-CERAMIC",
  "SIGNAL-SAFE",
  "SELF-HEALING PPF",
  "LIMITED LIFETIME WARRANTY",
  "98% IR REJECTION",
  "ENGINEERED IN-HOUSE",
];

const STATS = [
  { value: "98%", label: "Peak infrared rejection" },
  { value: "99.9%", label: "UV radiation blocked" },
  { value: "15°C", label: "Typical cabin cool-down" },
  { value: "12+", label: "Premium film grades" },
];

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

/**
 * Press logos in /public/news (07 is a duplicate Tribune logo, so it is left out).
 * w/h are the PNGs' pixel sizes, used to give every logo a similar visual weight.
 */
const PRESS = [
  { file: "01_www.tribuneindia.com.png", name: "The Tribune", w: 324, h: 80 },
  { file: "02_www.theweek.in.png", name: "The Week", w: 274, h: 81 },
  { file: "03_thewire.in.png", name: "The Wire", w: 995, h: 345 },
  {
    file: "04_www.outlookbusiness.com.png",
    name: "Outlook Business",
    w: 432,
    h: 42,
  },
  {
    file: "05_www.ahmedabadmirror.com.png",
    name: "Ahmedabad Mirror",
    w: 996,
    h: 129,
  },
  { file: "06_firstindia.co.in.png", name: "First India", w: 1420, h: 182 },
  { file: "09_www.uniindia.com.png", name: "UNI India", w: 997, h: 455 },
  {
    file: "10_www.indianeconomicobserver.com.png",
    name: "Indian Economic Observer",
    w: 532,
    h: 55,
  },
  {
    file: "11_indianpulsemedia.co.in.png",
    name: "Indian Pulse Media",
    w: 1132,
    h: 176,
  },
  { file: "12_m.dailyhunt.in.png", name: "Dailyhunt", w: 999, h: 325 },
  {
    file: "13_newsstreamline.com.png",
    name: "News Streamline",
    w: 2765,
    h: 376,
  },
  { file: "14_pioneernews.co.in.png", name: "Pioneer News", w: 279, h: 65 },
  { file: "15_thenewswatch.in.png", name: "The News Watch", w: 301, h: 92 },
  { file: "16_indianscoops.com.png", name: "Indian Scoops", w: 280, h: 52 },
  {
    file: "17_tribunenewsline.co.png",
    name: "Tribune Newsline",
    w: 182,
    h: 63,
  },
  { file: "18_rkdlive.com.png", name: "RKD Live", w: 214, h: 47 },
  { file: "19_countryfirst.co.in.png", name: "Country First", w: 251, h: 51 },
  { file: "20_bharatherald.com.png", name: "Bharat Herald", w: 216, h: 40 },
  { file: "21_newsraconteur.com.png", name: "News Raconteur", w: 382, h: 74 },
  {
    file: "22_youthnewsexpress.com.png",
    name: "Youth News Express",
    w: 205,
    h: 69,
  },
  { file: "23_newshead.in.png", name: "Newshead", w: 290, h: 80 },
  { file: "24_vibgyortimes.com.png", name: "Vibgyor Times", w: 249, h: 40 },
];

/**
 * Desktop width in px: scaling by the square root of the aspect ratio gives wide
 * wordmarks more width and compact marks more height, so they read as equal size.
 * Height is capped so square-ish logos don't tower over the rest.
 */
function logoWidth({ w, h }: { w: number; h: number }) {
  const ratio = w / h;
  return Math.round(Math.min(135 * Math.sqrt(ratio), 96 * ratio));
}

function FeaturedOnRail() {
  return (
    <>
      <h2 className="container-lux mb-8 text-center font-display text-xl font-bold uppercase tracking-[0.12em] text-gradient-silver sm:mb-10 sm:text-3xl">
        Trusted &amp; Featured by Leading Media
      </h2>
      <div
        data-featured-rail
        className="border-b border-[#3a3d42] bg-white py-10 sm:py-14"
      >
        <p className="sr-only">{PRESS.map((p) => p.name).join(", ")}</p>
        <div
          className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          aria-hidden="true"
        >
          <VisibleLoop
            className="flex w-max items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {[...PRESS, ...PRESS].map((p, i) => {
              const lw = logoWidth(p);
              return (
                <Image
                  key={i}
                  src={`/news/${p.file}`}
                  alt=""
                  width={p.w}
                  height={p.h}
                  sizes={`(min-width: 640px) ${lw}px, ${Math.round(lw * 0.6)}px`}
                  style={{ "--lw": `${lw}px` } as CSSProperties}
                  className="mr-12 h-auto w-[calc(var(--lw)*0.6)] max-w-none shrink-0 sm:mr-20 sm:w-[var(--lw)]"
                />
              );
            })}
          </VisibleLoop>
        </div>
      </div>
    </>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-4 lg:grid-cols-4">
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08}>
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-gradient-silver sm:text-5xl lg:text-6xl">
              {s.value}
            </p>
            <p className="mt-2 text-sm text-white">{s.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * `features` (the pinned feature timeline) replaces the plain stats row: it is
 * given <StatsGrid /> as its `lead`, so the stats stay on screen above the
 * points while they play.
 */
export function StatsCTA({ features }: { features?: ReactNode }) {
  return (
    <section className="relative">
      {/* marquee */}
      <div
        className="border-y border-white/5 py-6 overflow-hidden"
        aria-hidden="true"
      >
        <VisibleLoop
          className="flex w-max gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span
              key={i}
              className="font-display text-sm uppercase tracking-[0.3em] text-white/90"
            >
              {m}
              <span className="ml-10 text-electric">✦</span>
            </span>
          ))}
        </VisibleLoop>
      </div>

      <div className="container-lux py-16 sm:py-28 lg:py-36">
        {features ?? <StatsGrid />}

        {/* CTA */}
        <Reveal>
          <div className="relative mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(120%_140%_at_50%_-20%,rgba(88,167,232,0.25),transparent_60%)] p-8 text-center sm:mt-24 sm:p-20">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-fade-y" />
            <h2 className="headline relative text-3xl text-gradient-silver sm:text-5xl lg:text-6xl">
              Feel the difference Sunkool makes.
            </h2>
            <p className="relative mx-auto mt-6 max-w-xl text-lg text-white">
              Get in touch with our team, or build your perfect film in the
              configurator.
            </p>
            <div className="relative mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <div className="w-full sm:w-auto [&>a]:block [&>a]:w-full sm:[&>a]:w-auto">
                <MagneticButton
                  href="/contact"
                  className="w-full justify-center sm:w-auto"
                >
                  Contact Us
                </MagneticButton>
              </div>
              <div className="w-full sm:w-auto [&>a]:block [&>a]:w-full sm:[&>a]:w-auto">
                <MagneticButton
                  href="/compare"
                  variant="outline"
                  className="w-full justify-center sm:w-auto"
                >
                  Configure Your Film
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <FeaturedOnRail />
    </section>
  );
}
