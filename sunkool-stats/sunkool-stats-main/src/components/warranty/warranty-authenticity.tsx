import type { ReactNode } from "react";
import { Info, Lightbulb, PackageCheck, QrCode, ScanLine, TriangleAlert, Layers } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { WARRANTY_AUTHENTICITY, WARRANTY_SUPPORT } from "@/lib/warranty-content";

const CHECK_ICONS = {
  box: PackageCheck,
  qr: QrCode,
  scan: ScanLine,
  film: Layers,
} as const;

const linkClass =
  "font-semibold text-glow underline decoration-glow/40 underline-offset-2 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-electric";

/** Turns the {email} and {phone} markers in a step's text into links to the support details. */
function withSupportLinks(text: string): ReactNode[] {
  return text.split(/(\{email\}|\{phone\})/).map((part, index) => {
    if (part === "{email}") {
      return (
        <a key={index} href={WARRANTY_SUPPORT.emailHref} className={linkClass}>
          {WARRANTY_SUPPORT.email}
        </a>
      );
    }
    if (part === "{phone}") {
      return (
        <a key={index} href={WARRANTY_SUPPORT.phoneHref} className={linkClass}>
          {WARRANTY_SUPPORT.phone}
        </a>
      );
    }
    return part;
  });
}

/**
 * "How to verify your genuine Sunkool product": the four things to check on the packaging and film, a buying tip,
 * and what to do about a suspected counterfeit. Sits above the warranty portal; the words are in
 * WARRANTY_AUTHENTICITY (lib/warranty-content.ts).
 */
export function WarrantyAuthenticity() {
  const { eyebrow, titleLead, titleAccent, intro, checks, tip, counterfeit, next, note } = WARRANTY_AUTHENTICITY;

  return (
    <div className="container-lux">
      <Reveal>
        <p className="eyebrow mb-3 text-center sm:text-left">{eyebrow}</p>
        <h2 className="headline mx-auto max-w-3xl text-balance text-center text-2xl sm:mx-0 sm:text-left sm:text-4xl">
          <span className="text-gradient-silver">{titleLead}</span>{" "}
          <span className="text-gradient-kool">{titleAccent}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-white sm:mx-0 sm:mt-4 sm:text-left sm:text-base">
          {intro}
        </p>
      </Reveal>

      <ol className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2">
        {checks.map((check, index) => {
          const Icon = CHECK_ICONS[check.icon];
          return (
            <li key={check.title}>
              <Reveal delay={index * 0.06} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-electric">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-base font-semibold text-white sm:text-[1.05rem]">
                      <span className="mr-2 text-electric">{index + 1}.</span>
                      {check.title}
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {check.points.map((point) => (
                      <li key={point.label} className="flex gap-3 text-sm leading-relaxed text-white">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" aria-hidden="true" />
                        <p>
                          <strong className="font-semibold text-glow">{point.label}:</strong> {point.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <Reveal className="mt-4">
        <div className="flex items-start gap-4 rounded-2xl border border-electric/25 bg-gradient-to-br from-electric/10 via-black/40 to-black/60 p-5 sm:p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric text-black">
            <Lightbulb className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-white sm:text-base">
            <strong className="font-semibold text-glow">{tip.label}:</strong> {tip.text}
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-10 sm:mt-14">
        <div className="rounded-3xl border border-sun/30 bg-gradient-to-br from-sun/[0.08] via-black/40 to-black/60 p-5 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sun/40 bg-sun/10 text-sun">
              <TriangleAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{counterfeit.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white sm:text-base">{counterfeit.text}</p>
            </div>
          </div>

          <h4 className="mt-8 font-display text-lg font-semibold text-white">{next.title}</h4>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {next.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sun/40 bg-sun/10 text-sm font-semibold text-sun">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-white">
                  <strong className="font-semibold text-white">{step.title}:</strong> {withSupportLinks(step.text)}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-white/85">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-white">Note:</strong> {note}
            </span>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
