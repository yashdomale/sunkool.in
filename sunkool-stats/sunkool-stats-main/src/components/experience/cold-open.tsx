"use client";

import { COLD_OPEN_LINES } from "@/lib/narrative-script";

export function ColdOpen({ progress }: { progress: number }) {
  if (progress >= 0.08) return null;

  const blockIndex = progress >= 0.035 ? 1 : 0;
  const block = COLD_OPEN_LINES[blockIndex];

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-black px-5 sm:px-8">
      <div className="max-w-2xl text-center">
        {block.lines.map((line, i) => (
          <p
            key={`${blockIndex}-${line}`}
            className={`font-display font-medium tracking-tight text-white ${
              blockIndex === 0 && i === 0
                ? "text-2xl sm:text-3xl"
                : blockIndex === 0 && i === 1
                  ? "mt-3 text-3xl sm:text-4xl lg:text-5xl"
                  : blockIndex === 0
                    ? "mt-4 text-lg text-white sm:text-xl"
                    : "text-2xl sm:text-3xl lg:text-4xl"
            }`}
          >
            {line}
          </p>
        ))}
      </div>

      <p className="absolute bottom-20 text-[10px] uppercase tracking-[0.28em] text-white/80 max-sm:tracking-[0.2em]">
        Scroll to begin
      </p>
    </div>
  );
}
