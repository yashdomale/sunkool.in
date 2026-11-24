"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import type { LeadProductGroup } from "@/lib/blog/leads/products";
import { cn } from "@/lib/utils";

const LIST_MAX = 288; // px — about eight rows, then the list scrolls
const LIST_MIN = 160;
const LIST_PAD = 4; // matches the list's p-1
const FLIP_BELOW = 220; // open upwards when there is less room than this under the field and more above
const EDGE_GAP = 20; // keeps the popup off the viewport edge, including the 8px gap to the field
const TYPEAHEAD_MS = 600;

/**
 * A styled stand-in for the native <select>: the browser draws a native dropdown itself, so its
 * colours, group headings and highlight can't follow the site's theme. This follows the WAI-ARIA
 * "select-only combobox" pattern — focus stays on the button and the highlighted option is
 * announced through aria-activedescendant.
 */
export function ProductSelect({
  id,
  label,
  groups,
  value,
  onChange,
  onBlur,
  invalid,
  describedBy,
  placeholder = "Select a product",
  className,
}: {
  id: string;
  label: string;
  groups: LeadProductGroup[];
  value: string;
  onChange: (productId: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
  placeholder?: string;
  className?: string;
}) {
  const uid = useId();
  const listId = `${uid}-list`;
  const optionId = (index: number) => `${uid}-option-${index}`;
  const headingId = (index: number) => `${uid}-group-${index}`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState({ above: false, maxHeight: LIST_MAX });
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const options = groups.flatMap((group, g) => group.products.map((product, i) => ({ ...product, group: g, first: i === 0 })));
  const offsets = groups.map((_, g) => groups.slice(0, g).reduce((count, group) => count + group.products.length, 0));
  const selectedIndex = options.findIndex((option) => option.id === value);
  const selected = options[selectedIndex];
  const activeStartsGroup = options[active]?.first ?? false;

  // Keep the highlighted row visible; a group's first row brings its heading into view too.
  useEffect(() => {
    if (!open) return;
    const box = list.current;
    const row = document.getElementById(optionId(active));
    if (!box || !row) return;
    const top = (activeStartsGroup ? (row.parentElement as HTMLElement).offsetTop : row.offsetTop) - LIST_PAD;
    const bottom = row.offsetTop + row.offsetHeight + LIST_PAD;
    if (top < box.scrollTop) box.scrollTop = top;
    else if (bottom > box.scrollTop + box.clientHeight) box.scrollTop = bottom - box.clientHeight;
    // optionId only depends on uid, which never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active, activeStartsGroup]);

  // Mouse and touch outside close it; keyboard focus leaving is covered by the button's onBlur.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function openList(index = selectedIndex) {
    const rect = trigger.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom - EDGE_GAP;
      const above = rect.top - EDGE_GAP;
      const flip = below < FLIP_BELOW && above > below;
      setPlacement({ above: flip, maxHeight: Math.max(LIST_MIN, Math.min(LIST_MAX, flip ? above : below)) });
    }
    setActive(Math.max(index, 0));
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.id);
    setOpen(false);
  }

  function typeahead(key: string) {
    const now = Date.now();
    if (now - typed.current.at > TYPEAHEAD_MS) typed.current.text = "";
    typed.current = { text: typed.current.text + key.toLowerCase(), at: now };
    const { text } = typed.current;
    // A single letter pressed again moves on to the next match; a longer word is matched from the current row.
    const from = (open ? active : selectedIndex) + (text.length === 1 ? 1 : 0);
    for (let step = 0; step < options.length; step++) {
      const index = (Math.max(from, 0) + step) % options.length;
      if (options[index].name.toLowerCase().startsWith(text)) {
        if (open) setActive(index);
        else openList(index);
        return;
      }
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.min(last, Math.max(0, i + (event.key === "ArrowDown" ? 1 : -1))));
        return;
      }
      case "Home":
      case "End": {
        event.preventDefault();
        const index = event.key === "Home" ? 0 : last;
        if (open) setActive(index);
        else openList(index);
        return;
      }
      case "Enter":
      case " ": {
        if (event.key === " " && typed.current.text && Date.now() - typed.current.at <= TYPEAHEAD_MS) {
          event.preventDefault();
          typeahead(" "); // a space inside a product name, not "choose"
          return;
        }
        event.preventDefault();
        if (open) choose(active);
        else openList();
        return;
      }
      case "Escape": {
        if (!open) return;
        event.preventDefault();
        setOpen(false);
        return;
      }
      default:
        if (event.key.length === 1) typeahead(event.key);
    }
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-required="true"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={(event) => {
          event.currentTarget.focus(); // Safari doesn't focus a button on click
          if (open) setOpen(false);
          else openList();
        }}
        onKeyDown={onKeyDown}
        // Space activates a button on key-up; the key-down handler has already dealt with it.
        onKeyUp={(event) => {
          if (event.key === " ") event.preventDefault();
        }}
        onBlur={() => {
          setOpen(false);
          onBlur?.();
        }}
        className={cn("block pr-10 text-left", className)}
      >
        <span className={cn("block truncate", !selected && "text-white/40")}>{selected?.name ?? placeholder}</span>
      </button>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className={cn(
          "pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70 transition-transform duration-200",
          open && "rotate-180"
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {open && (
        <div
          ref={list}
          id={listId}
          role="listbox"
          aria-label={label}
          // Keep focus on the button while the pointer works the list (clicks, scrollbar drags).
          onMouseDown={(event) => event.preventDefault()}
          style={{ maxHeight: placement.maxHeight }}
          className={cn(
            "absolute inset-x-0 z-30 overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-carbon-2 p-1 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] [scrollbar-color:var(--color-ash)_transparent] [scrollbar-width:thin]",
            placement.above ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          {groups.map((group, g) => (
            <div
              key={group.category}
              role="group"
              aria-labelledby={headingId(g)}
              className="not-first:mt-1 not-first:border-t not-first:border-white/10 not-first:pt-1"
            >
              <div
                id={headingId(g)}
                role="presentation"
                className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50"
              >
                {group.category}
              </div>
              {group.products.map((product, p) => {
                const index = offsets[g] + p;
                return (
                  <div
                    key={product.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === active}
                    onMouseMove={() => {
                      if (index !== active) setActive(index);
                    }}
                    onClick={() => choose(index)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-3 text-base text-white/85 sm:py-2 sm:text-sm",
                      index === active && "bg-electric/15 text-white"
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{product.name}</span>
                    {product.id === value && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-electric" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
