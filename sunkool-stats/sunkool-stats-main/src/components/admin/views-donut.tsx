"use client";

import { useState } from "react";
import type { ViewsByCategory } from "@/lib/blog/analytics";

// One hue, five depths: the admin palette is blue only.
const SHADES = ["#9fdcff", "#58a7e8", "#3d86c6", "#2f6ea8", "#22507f"];
const numberFormat = new Intl.NumberFormat("en-IN");

export function ViewsDonut({ slices, total }: { slices: ViewsByCategory[]; total: number }) {
  const [active, setActive] = useState<number | null>(null);
  const activeSlice = active === null ? null : slices[active];
  const size = 176;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = slices.length > 1 ? 3 : 0;

  if (slices.length === 0) {
    return <p className="py-14 text-center text-sm text-fog">No views recorded yet.</p>;
  }

  // Where each slice starts along the ring (cumulative length of the ones before it).
  const starts = slices.map((_, i) =>
    slices.slice(0, i).reduce((sum, slice) => sum + slice.share * circumference, 0)
  );

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center xl:flex-col">
      <div
        className="relative shrink-0 rounded-full transition-[translate,scale,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_28px_48px_-20px_rgba(0,0,0,0.95),0_12px_32px_-14px_rgba(88,167,232,0.3)]"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Views by category" className="overflow-visible">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="white" strokeOpacity={0.05} strokeWidth={stroke} />
          {slices.map((slice, i) => {
            const length = slice.share * circumference;
            const visible = Math.max(0, length - gap);
            return (
              <circle
                key={slice.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={SHADES[i % SHADES.length]}
                className="transition-[opacity,stroke-width] duration-200 ease-out"
                style={{
                  strokeWidth: active === i ? stroke + 4 : stroke,
                  opacity: active === null || active === i ? 1 : 0.35,
                }}
                strokeDasharray={`${visible} ${circumference - visible}`}
                strokeDashoffset={-starts[i]}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {activeSlice && active !== null ? (
            <>
              <span className="font-display text-2xl font-semibold text-white tabular-nums">{(activeSlice.share * 100).toFixed(1)}%</span>
              <span className="flex max-w-[104px] items-center gap-1.5 text-[11px] text-fog">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SHADES[active % SHADES.length] }} />
                <span className="truncate">{activeSlice.name}</span>
              </span>
            </>
          ) : (
            <>
              <span className="font-display text-2xl font-semibold text-white tabular-nums">{numberFormat.format(total)}</span>
              <span className="text-[11px] text-fog">Total views</span>
            </>
          )}
        </div>
      </div>

      <ul className="w-full max-w-xs space-y-3 sm:max-w-none sm:flex-1 xl:max-w-none">
        {slices.map((slice, i) => (
          <li
            key={slice.name}
            className="flex items-center gap-3 text-sm"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: SHADES[i % SHADES.length] }} />
            <span className={`min-w-0 flex-1 truncate transition-colors duration-200 ${active === i ? "text-white" : "text-fog"}`}>{slice.name}</span>
            <span className="font-medium tabular-nums text-white">{numberFormat.format(slice.views)}</span>
            <span className="w-12 text-right text-xs tabular-nums text-fog">{(slice.share * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
