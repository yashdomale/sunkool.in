"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Drop the real hero photo at public/images/interior-ppf/hero.jpg
 * (recommended: vertical/landscape shot of a premium vehicle cabin,
 * min. 1600x2000px). Until that file exists, this renders a designed
 * placeholder instead of a broken image icon.
 */
const HERO_IMAGE_SRC = "/images/interior-ppf/hero.jpg";

export function InteriorPpfHeroImage({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Designed placeholder — visible until the real photo loads */}
      <div
        className={cn(
          "noise absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/[0.06] via-carbon-2/60 to-black text-center transition-opacity duration-700",
          loaded && "opacity-0"
        )}
      >
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 26px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 26px)",
          }}
        />
        <div className="relative flex flex-col items-center gap-3 px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-silver">
            <ImagePlus className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Hero photography coming soon
          </p>
          <p className="max-w-[220px] text-[11px] leading-relaxed text-white/90">
            Add the cabin photo to{" "}
            <code className="text-silver-soft">
              public/images/interior-ppf/hero.jpg
            </code>
          </p>
        </div>
      </div>

      <Image
        src={HERO_IMAGE_SRC}
        alt="Sunkool Interior PPF protecting a premium vehicle cabin"
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={cn(
          "object-cover transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {children}
    </div>
  );
}
