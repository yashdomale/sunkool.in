"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Bell, ChevronDown, ExternalLink, LogOut, Search } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { Popover, menuItemClass } from "@/components/admin/popover";

const noopSubscribe = () => () => {};
const pillClass =
  "border border-electric/25! bg-carbon-2/80 backdrop-blur transition-colors hover:border-electric/50!";

export function AdminTopbar({ name }: { name: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLButtonElement>(null);
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const closeBell = useCallback(() => setBellOpen(false), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  // Server render and hydration agree on "Ctrl"; a Mac swaps to ⌘ right after.
  const isMac = useSyncExternalStore(noopSubscribe, () => /Mac|iPhone|iPad/.test(navigator.userAgent), () => false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      // The blog editor owns Ctrl/⌘+K (insert link). Its handler runs first and
      // calls preventDefault, but the scope check also covers keys it doesn't
      // handle (Ctrl+K on a Mac is the native kill-line, not a shortcut).
      if (event.defaultPrevented) return;
      if (event.target instanceof Element && event.target.closest("[data-shortcut-scope='editor']")) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mb-7 flex items-center gap-3">
      {/* Plain GET form into the existing posts search, so it works without JS. */}
      <form action="/admin/blogs" method="get" role="search" className="relative min-w-0 flex-1 sm:max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-fog" />
        <input
          ref={inputRef}
          name="q"
          type="search"
          placeholder="Search posts…"
          aria-label="Search posts"
          className="w-full rounded-full border border-electric/25! bg-carbon-2/80 py-3 pl-11 pr-20 text-sm text-white outline-none backdrop-blur transition-colors placeholder:text-fog/60 focus:border-electric/70! focus:ring-1 focus:ring-electric/30"
        />
        <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-fog sm:block">
          {isMac ? "⌘ K" : "Ctrl K"}
        </kbd>
      </form>

      <div className="ml-auto flex items-center gap-2.5">
        <button
          ref={bellRef}
          type="button"
          aria-label="Notifications"
          aria-haspopup="dialog"
          aria-expanded={bellOpen}
          onClick={() => setBellOpen((open) => !open)}
          className={`${pillClass} flex h-11 w-11 items-center justify-center rounded-full text-fog hover:text-white`}
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <Popover anchorRef={bellRef} open={bellOpen} onClose={closeBell} label="Notifications" role="dialog" className="w-72">
          <p className="px-3 pb-1 pt-2 text-sm font-medium text-white">Notifications</p>
          <p className="px-3 pb-3 text-sm text-fog">You&apos;re all caught up.</p>
        </Popover>

        <Link
          href="/blog"
          target="_blank"
          className={`${pillClass} hidden h-11 items-center gap-2 rounded-full px-4 text-sm text-fog hover:text-white md:flex`}
        >
          <ExternalLink className="h-4 w-4" />
          View Site
        </Link>

        <button
          ref={profileRef}
          type="button"
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          onClick={() => setProfileOpen((open) => !open)}
          className={`${pillClass} flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-electric/20 text-sm font-semibold text-electric">
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block max-w-[9rem] truncate text-sm font-medium text-white">{name}</span>
            <span className="block text-[11px] text-fog">Admin</span>
          </span>
          <ChevronDown className="h-4 w-4 text-fog" />
        </button>
        <Popover anchorRef={profileRef} open={profileOpen} onClose={closeProfile} label="Account">
          <p className="truncate px-3 pb-2 pt-1.5 text-xs text-fog">Signed in as {name}</p>
          <form action={signOut}>
            <button type="submit" role="menuitem" className={menuItemClass}>
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </Popover>
      </div>
    </div>
  );
}
