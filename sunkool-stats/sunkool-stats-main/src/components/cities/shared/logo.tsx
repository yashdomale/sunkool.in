"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded border border-dashed border-white/25 px-3 text-[10px] uppercase tracking-widest text-white/80",
          className
        )}
        style={{ height: "1.75rem", minWidth: "90px" }}
      >
        sunkool-wordmark.png
      </span>
    );
  }

  return (
    <Image
      src="/sunkool-wordmark.png"
      alt="SUNKOOL"
      width={220}
      height={46}
      className={cn("w-auto object-contain", className)}
      onError={() => setMissing(true)}
    />
  );
}
