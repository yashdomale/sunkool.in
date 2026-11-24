"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { FileText, Globe } from "lucide-react";
import { handleDialogKeys } from "@/components/admin/dialog-keys";
import { Input } from "@/components/admin/form";
import { rankDestinations } from "@/lib/blog/internal-links/rank";
import type { LinkDestination } from "@/lib/blog/internal-links/types";
import { normalizeUrl, postHref, splitSiteHref, toSitePath, typedAddress } from "@/lib/blog/internal-links/urls";
import { cn } from "@/lib/utils";

type Mode = "site" | "url";

/** Most results drawn at once; typing narrows the rest. */
const MAX_RESULTS = 60;

/**
 * The Insert/Edit link popup. "Pages & posts" searches the site's real pages
 * and published posts (stored as relative URLs); "External URL" takes anything
 * else — but a typed address on this site is held to the same rules, so it
 * can't sneak in a broken, draft or self link. Mounted only while open, so its
 * state always starts fresh from the props.
 */
export function LinkDialog({
  initialHref,
  selectedText,
  askForText,
  destinations,
  linkedPaths,
  selfSlug,
  onSubmit,
  onRemove,
  onClose,
}: {
  /** The link being edited; "" for a new one. */
  initialHref: string;
  /** What is selected in the editor; pre-fills the search so "Window Film" finds the Window Film page. */
  selectedText: string;
  /** No text is selected, so also collect the text to link. */
  askForText: boolean;
  destinations: LinkDestination[];
  /** Site paths this post already links to. */
  linkedPaths: string[];
  /** The slug of the post being edited, which it must not link to. */
  selfSlug: string;
  onSubmit: (result: { href: string; text: string }) => void;
  /** Only passed when editing an existing link. */
  onRemove?: () => void;
  onClose: () => void;
}) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const selfPath = selfSlug ? postHref(selfSlug) : null;
  const candidates = useMemo(() => destinations.filter((d) => d.href !== selfPath), [destinations, selfPath]);
  const alreadyLinked = useMemo(() => new Set(linkedPaths), [linkedPaths]);
  const initialPath = toSitePath(initialHref);
  // Editing a link to a page of this site opens with that page found, so applying without
  // changes keeps the link instead of re-pointing it at whichever page is listed first.
  const initialDestination = candidates.find((d) => d.href === initialPath);
  const initialQuery = initialDestination?.title ?? (
    initialHref || askForText ? "" : selectedText.replace(/\s+/g, " ").trim().slice(0, 80)
  );

  const [mode, setMode] = useState<Mode>(
    candidates.some((d) => d.href === initialPath) || (!initialHref && candidates.length > 0) ? "site" : "url"
  );
  const [text, setText] = useState("");
  const [url, setUrl] = useState(initialHref);
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState(0);
  const [error, setError] = useState<string | null>(null);
  /** The destination the editor has been warned is already linked, and confirmed. */
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [warned, setWarned] = useState<LinkDestination | null>(null);
  // The Text field (when shown) owns first focus; after that, switching tabs focuses the new panel's input.
  const [tabSwitched, setTabSwitched] = useState(false);

  // A web address typed into the search box is linked as typed; ranking it
  // against page titles would silently point the text at whichever post matched.
  const searchAddress = useMemo(() => typedAddress(query), [query]);
  const matches = useMemo(
    () => (searchAddress ? [] : rankDestinations(query, candidates).slice(0, MAX_RESULTS)),
    [query, candidates, searchAddress]
  );
  const activeIndex = Math.min(active, matches.length - 1);
  const listId = `${id}-results`;
  const optionId = (index: number) => `${listId}-${index}`;

  const isDraft = (destination: LinkDestination) => destination.status !== "published";
  const isDuplicate = (destination: LinkDestination) => destination.href !== initialPath && alreadyLinked.has(destination.href);

  /** Links to a destination, unless it's a draft or already linked (which needs a second, deliberate click). */
  function choose(
    destination: LinkDestination | undefined,
    // Re-applying the link's own destination keeps its address exactly as stored
    // (an absolute URL, a trailing slash, a ?query or #hash all stay).
    href = destination && destination.href === initialPath ? initialHref.trim() : (destination?.href ?? "")
  ) {
    if (!destination) {
      setError("Choose a page or post to link to.");
      return;
    }
    if (isDraft(destination)) {
      setError(`"${destination.title}" is a draft, so the link would be a 404. Publish it first.`);
      return;
    }
    if (isDuplicate(destination) && confirmed !== destination.href) {
      setWarned(destination);
      setConfirmed(destination.href);
      setError(null);
      return;
    }
    onSubmit({ href, text: text.trim() || destination.title });
  }

  function submitUrl(raw: string) {
    const normalized = normalizeUrl(raw);
    if (!normalized) {
      setError("Enter a valid URL, like https://example.com");
      return;
    }
    const site = splitSiteHref(normalized);
    if (!site) {
      // mailto:, tel:, #anchors and other websites aren't ours to check.
      onSubmit({ href: normalized, text: text.trim() || normalized });
      return;
    }
    if (site.path === selfPath) {
      setError("A post can't link to itself.");
      return;
    }
    const destination = candidates.find((d) => d.href === site.path);
    if (!destination) {
      setError(`There's no page or post at ${site.path}. Pick one from "Pages & posts" so the link doesn't break.`);
      return;
    }
    // Checked against the site's real pages above, but saved as the author typed it.
    choose(destination, normalized);
  }

  function submit() {
    if (mode === "site" && !searchAddress) choose(matches[activeIndex]);
    else submitUrl(mode === "site" ? query : url);
  }

  function selectMode(next: Mode) {
    setMode(next);
    setTabSwitched(true);
    setError(null);
    setWarned(null);
  }

  function onSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
      return;
    }
    if ((event.key !== "ArrowDown" && event.key !== "ArrowUp") || matches.length === 0) return;
    event.preventDefault();
    const next = (activeIndex + (event.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length;
    setActive(next);
    setWarned(null);
    document.getElementById(optionId(next))?.scrollIntoView({ block: "nearest" });
  }

  function onEnter(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    submit();
  }

  const title = initialHref ? "Edit link" : "Insert link";
  const tabClass = (selected: boolean) =>
    cn(
      "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
      selected ? "bg-electric/15 text-electric" : "text-fog hover:text-white"
    );
  const badge = "shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider";

  return createPortal(
    <div
      data-shortcut-scope="editor"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        onKeyDown={(event) => handleDialogKeys(event, panelRef.current, onClose)}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-carbon-2 bg-linear-to-b from-white/[0.04] to-transparent p-5 shadow-2xl"
      >
        <h2 id={`${id}-title`} className="mb-4 text-sm font-medium text-white">
          {title}
        </h2>

        {askForText && (
          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor={`${id}-text`} className="text-xs font-medium uppercase tracking-[0.15em] text-fog">
              Text
            </label>
            <Input
              id={`${id}-text`}
              autoFocus
              value={text}
              placeholder="Text to display"
              onChange={(event) => setText(event.target.value)}
              onKeyDown={onEnter}
            />
          </div>
        )}

        <div role="tablist" aria-label="Link type" className="mb-3 flex gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
          <button type="button" role="tab" aria-selected={mode === "site"} onClick={() => selectMode("site")} className={tabClass(mode === "site")}>
            <FileText className="h-4 w-4" />
            Pages &amp; posts
          </button>
          <button type="button" role="tab" aria-selected={mode === "url"} onClick={() => selectMode("url")} className={tabClass(mode === "url")}>
            <Globe className="h-4 w-4" />
            External URL
          </button>
        </div>

        {mode === "site" ? (
          <div key="site" role="tabpanel" className="flex flex-col gap-2">
            <Input
              autoFocus={!askForText || tabSwitched}
              role="combobox"
              aria-label="Find a page or post to link"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={searchAddress || matches.length > 0 ? optionId(Math.max(activeIndex, 0)) : undefined}
              value={query}
              placeholder="Search pages and posts…"
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
                setError(null);
                setWarned(null);
              }}
              onKeyDown={onSearchKeyDown}
            />
            <ul
              id={listId}
              role="listbox"
              aria-label="Pages and posts"
              className="max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-1"
            >
              {matches.map((destination, index) => {
                const draft = isDraft(destination);
                return (
                  <li
                    key={destination.href}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    aria-disabled={draft || undefined}
                    onMouseMove={() => setActive(index)}
                    onClick={() => choose(destination)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                      draft ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                      index === activeIndex ? "bg-electric/10 text-white" : "text-fog"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{destination.title}</span>
                      <span className="block truncate text-xs text-fog/70">{destination.href}</span>
                    </span>
                    {draft && <span className={cn(badge, "border-white/10 text-fog")}>Draft</span>}
                    {!draft && isDuplicate(destination) && <span className={cn(badge, "border-amber-400/30 text-amber-300")}>Already linked</span>}
                    <span className={cn(badge, "border-white/10 text-fog")}>{destination.kind === "page" ? "Page" : "Post"}</span>
                  </li>
                );
              })}
              {searchAddress && (
                <li
                  id={optionId(0)}
                  role="option"
                  aria-selected
                  onClick={() => submitUrl(query)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-electric/10 px-3 py-2 text-sm text-white"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">Link to this web address</span>
                    <span className="block truncate text-xs text-fog/70">{searchAddress}</span>
                  </span>
                  <span className={cn(badge, "border-white/10 text-fog")}>URL</span>
                </li>
              )}
              {matches.length === 0 && !searchAddress && (
                <li role="presentation" className="px-3 py-6 text-center text-sm text-fog">
                  {candidates.length === 0
                    ? "There are no pages or posts to link to yet."
                    : `Nothing matches “${query.trim()}”. Try fewer words.`}
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div key="url" role="tabpanel" className="flex flex-col gap-1.5">
            <Input
              autoFocus={!askForText || tabSwitched}
              type="text"
              inputMode="url"
              aria-label="URL"
              aria-invalid={error ? true : undefined}
              value={url}
              placeholder="https://example.com"
              onChange={(event) => {
                setUrl(event.target.value);
                setError(null);
                setWarned(null);
              }}
              onKeyDown={onEnter}
            />
          </div>
        )}

        {warned && (
          <p role="status" className="mt-2 text-xs text-amber-300">
            This post already links to “{warned.title}”. A second link is rarely useful — press Link anyway to add it.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="mt-5 flex items-center justify-end gap-3">
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="mr-auto rounded-lg px-3 py-2 text-sm text-fog transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              Remove link
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-fog transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-lg bg-electric px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-glow"
          >
            {warned ? "Link anyway" : "Apply"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
