"use client";

import { useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";
import { handleDialogKeys } from "@/components/admin/dialog-keys";
import type { LinkSuggestion } from "@/lib/blog/internal-links/types";
import { cn } from "@/lib/utils";

/**
 * The review step for suggested internal links. Every suggestion shows the
 * sentence as it will read (the new link underlined), where it points and why,
 * and nothing is applied until it's ticked and confirmed. Mounted only while
 * open, so its selection always starts empty.
 */
export function LinkSuggestionsDialog({
  suggestions,
  checkedCount,
  onApply,
  onClose,
}: {
  suggestions: LinkSuggestion[];
  /** How many pages and published posts were compared against. */
  checkedCount: number;
  onApply: (approved: LinkSuggestion[]) => void;
  onClose: () => void;
}) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [approved, setApproved] = useState<ReadonlySet<string>>(new Set());

  const allApproved = approved.size === suggestions.length;
  const toggle = (suggestionId: string) =>
    setApproved((current) => {
      const next = new Set(current);
      if (!next.delete(suggestionId)) next.add(suggestionId);
      return next;
    });
  const apply = () => onApply(suggestions.filter((s) => approved.has(s.id)));

  return createPortal(
    <div
      data-shortcut-scope="editor"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 p-4 pt-[8vh] backdrop-blur-sm"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        onKeyDown={(event) => handleDialogKeys(event, panelRef.current, onClose)}
        className="flex max-h-[84vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-carbon-2 bg-linear-to-b from-white/[0.04] to-transparent p-5 shadow-2xl"
      >
        <h2 id={`${id}-title`} className="text-sm font-medium text-white">
          Suggested internal links
        </h2>
        <p id={`${id}-desc`} className="mb-4 mt-1 text-xs text-fog">
          Compared this post with {checkedCount} pages and published posts. Pages it already links to, drafts and the post itself are
          skipped. Tick the links you want.
        </p>

        {suggestions.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-8 text-center text-sm text-fog">
            No new internal link opportunities found in this post.
          </div>
        ) : (
          <ul className="-mr-1 flex min-h-0 flex-col gap-2 overflow-y-auto pr-1">
            {suggestions.map((suggestion, index) => {
              const checked = approved.has(suggestion.id);
              return (
                <li key={suggestion.id}>
                  <label
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors",
                      checked ? "border-electric/40 bg-electric/[0.07]" : "border-white/10 bg-black/30 hover:border-white/20"
                    )}
                  >
                    <input
                      type="checkbox"
                      autoFocus={index === 0}
                      checked={checked}
                      onChange={() => toggle(suggestion.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-electric"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-relaxed text-fog">
                        {suggestion.before}
                        <span className="font-medium text-electric underline decoration-electric/60 underline-offset-2">
                          {suggestion.anchor}
                        </span>
                        {suggestion.after}
                      </span>
                      <span className="mt-2 flex items-center gap-2 text-xs text-white">
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-fog" />
                        <span className="min-w-0 truncate">{suggestion.destination.title}</span>
                        <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-fog">
                          {suggestion.destination.kind === "page" ? "Page" : "Post"}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate pl-[22px] text-xs text-fog/70">{suggestion.destination.href}</span>
                      <span className="mt-1 block pl-[22px] text-xs text-fog/70">{suggestion.reason}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
          {suggestions.length > 0 && (
            <button
              type="button"
              onClick={() => setApproved(allApproved ? new Set() : new Set(suggestions.map((s) => s.id)))}
              className="mr-auto rounded-lg px-3 py-2 text-sm text-fog transition-colors hover:bg-white/5 hover:text-white"
            >
              {allApproved ? "Clear selection" : "Select all"}
            </button>
          )}
          <button
            type="button"
            autoFocus={suggestions.length === 0}
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-fog transition-colors hover:bg-white/5 hover:text-white"
          >
            {suggestions.length === 0 ? "Close" : "Cancel"}
          </button>
          {suggestions.length > 0 && (
            <button
              type="button"
              disabled={approved.size === 0}
              onClick={apply}
              className="rounded-lg bg-electric px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-glow disabled:cursor-not-allowed disabled:opacity-40"
            >
              {approved.size === 0 ? "Add links" : `Add ${approved.size} ${approved.size === 1 ? "link" : "links"}`}
            </button>
          )}
        </div>
        {suggestions.length > 0 && (
          <p className="mt-3 text-right text-xs text-fog/70">
            Links are added to the editor only. Nothing is saved or published until you save the post, and Ctrl/⌘+Z undoes them.
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}
