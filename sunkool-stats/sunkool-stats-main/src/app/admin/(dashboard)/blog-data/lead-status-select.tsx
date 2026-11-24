"use client";

import { useState } from "react";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { isLeadStatus, LEAD_STATUS_LABEL, LEAD_STATUSES, type LeadStatus } from "@/lib/blog/leads/status";
import { cn } from "@/lib/utils";
import { setLeadStatus } from "./actions";

// Class names are written out in full on purpose: Tailwind only generates classes it can read literally.
const TONE: Record<LeadStatus, string> = {
  pending: "border-amber-400/40! bg-amber-400/10 text-amber-300",
  completed: "border-emerald-400/40! bg-emerald-400/10 text-emerald-300",
};

/**
 * The Status cell: a dropdown that saves as soon as a value is picked. The new value shows
 * immediately; if saving fails it snaps back and says why.
 *
 * After a save the page does a full reload so the counts, the list and the pagination all show the
 * new state. That is deliberate: in a production build the soft alternatives (the action's own
 * revalidatePath, or router.refresh()) left this page stale with a spinner that never stopped in
 * roughly half of the changes, while the save itself always went through. The URL — filter and
 * page number — survives the reload.
 */
export function LeadStatusSelect({ id, name, status }: { id: string; name: string; status: LeadStatus }) {
  const [shown, setShown] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function change(next: string) {
    if (!isLeadStatus(next) || next === shown || saving) return;
    const previous = shown;
    setError(null);
    setShown(next);
    setSaving(true);
    try {
      const result = await setLeadStatus(id, next);
      if (result.success) {
        window.location.reload();
        return; // keep the spinner up until the reload replaces the page
      }
      setShown(previous);
      setError(result.error);
    } catch {
      setShown(previous);
      setError("Couldn't reach the server. Check your connection and try again.");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="relative inline-block">
        <select
          aria-label={`Status of ${name}`}
          aria-busy={saving}
          disabled={saving}
          value={shown}
          onChange={(event) => void change(event.target.value)}
          className={cn(
            "h-8 cursor-pointer appearance-none rounded-full border py-0 pl-3 pr-8 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric disabled:cursor-wait",
            TONE[shown],
            saving && "opacity-70"
          )}
        >
          {LEAD_STATUSES.map((value) => (
            <option key={value} value={value} className="bg-carbon-3 text-white">
              {LEAD_STATUS_LABEL[value]}
            </option>
          ))}
        </select>
        {saving ? (
          <LoaderCircle aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin opacity-80" />
        ) : (
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-80" />
        )}
      </div>
      {error && (
        <p role="alert" className="mt-1 max-w-[12rem] text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
