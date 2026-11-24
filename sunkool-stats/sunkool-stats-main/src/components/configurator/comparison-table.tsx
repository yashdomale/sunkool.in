"use client";

import { useState } from "react";
import { ALL_PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

const FILTERS = ["Window Film", "Ultra Edge", "PPF"] as const;

export function ComparisonTable() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Window Film");
  const showSolarMetrics = filter !== "PPF";

  const rows = ALL_PRODUCTS.filter((p) => p.category === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              filter === f
                ? "border-electric bg-electric/10 text-white"
                : "border-white/10 text-white hover:border-white/25 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-white">
              <th className="px-5 py-4 font-medium">Film</th>
              <th className="px-5 py-4 font-medium">Series</th>
              <th className="px-5 py-4 font-medium text-right">VLT</th>
              {showSolarMetrics && (
                <>
                  <th className="px-5 py-4 font-medium text-right">Solar</th>
                  <th className="px-5 py-4 font-medium text-right">IR</th>
                </>
              )}
              <th className="px-5 py-4 font-medium text-right">UV</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr
                key={p.category + p.series + p.slug}
                className={cn(
                  "border-b border-white/5 transition-colors hover:bg-white/[0.03]",
                  i % 2 === 1 && "bg-white/[0.015]"
                )}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: p.accent }}
                    />
                    <span className="font-medium text-white">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-white">{p.series}</td>
                <td className="px-5 py-4 text-right tabular-nums text-silver-soft">
                  {p.vlt}%
                </td>
                {showSolarMetrics && (
                  <>
                    <td className="px-5 py-4 text-right tabular-nums text-silver-soft">
                      {p.tser ? `${p.tser}%` : "—"}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-silver-soft">
                      {p.ir ? `${p.ir}%` : "—"}
                    </td>
                  </>
                )}
                <td className="px-5 py-4 text-right tabular-nums text-silver-soft">
                  {p.uv}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
