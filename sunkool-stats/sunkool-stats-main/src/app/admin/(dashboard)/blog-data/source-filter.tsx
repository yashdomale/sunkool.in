"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LoaderCircle } from "lucide-react";

export type SourceOption = {
  value: string;
  /** Already includes the lead count, e.g. "Chatbot (12)". */
  label: string;
  /** The page URL that shows this source. */
  href: string;
};

/**
 * The "Show" dropdown above the leads table: pick where the leads came from and the list switches
 * to just those. The choice lives in the URL (the server renders the list), so the new value
 * shows at once while the page loads, and a refresh or a shared link keeps it.
 */
export function SourceFilter({ value, options }: { value: string; options: SourceOption[] }) {
  const router = useRouter();
  const [shown, setShown] = useOptimistic(value);
  const [pending, startTransition] = useTransition();

  function change(next: string) {
    const option = options.find((o) => o.value === next);
    if (!option || option.value === shown) return;
    startTransition(() => {
      setShown(option.value);
      router.push(option.href);
    });
  }

  return (
    <label className="inline-flex items-center gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-fog">Show</span>
      <span className="relative">
        <select
          value={shown}
          onChange={(event) => change(event.target.value)}
          aria-busy={pending}
          className="cursor-pointer appearance-none rounded-full border border-electric/45! bg-electric/[0.16] py-2.5 pl-5 pr-11 text-sm font-semibold text-glow outline-none transition-colors [color-scheme:dark] hover:bg-electric/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric aria-busy:cursor-progress"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-carbon-3 font-normal text-white">
              {option.label}
            </option>
          ))}
        </select>
        {pending ? (
          <LoaderCircle className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-glow" />
        ) : (
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-glow" />
        )}
      </span>
    </label>
  );
}
