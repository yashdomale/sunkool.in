"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FolderOpen, Inbox, LayoutDashboard, LogOut, Megaphone, Menu, Newspaper, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/admin/actions";
import { Logo } from "@/components/layout/logo";

type NavItem = { href: string; label: string; icon: typeof Newspaper };

const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blogs", label: "Posts", icon: Newspaper },
  { href: "/admin/updates", label: "Updates", icon: Megaphone },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/authors", label: "Authors", icon: Users },
  { href: "/admin/blog-data", label: "Blog Data", icon: Inbox },
];

const footerLinkClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fog transition-colors hover:bg-electric/[0.06] hover:text-white";

const rowClass ="relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors";

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/admin/dashboard" onClick={onNavigate} className="flex items-center gap-2 whitespace-nowrap px-2">
      <Logo className="h-6 w-auto shrink-0" />
      <span className="font-display text-2xl font-semibold leading-none text-electric">CMS</span>
    </Link>
  );
}

function NavRow({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const { href, label, icon: Icon } = item;
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        rowClass,
        active
          ? "border-electric/40! bg-electric/15 text-white"
          : "border-transparent! text-fog hover:bg-electric/[0.06] hover:text-white"
      )}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute -left-px top-2 bottom-2 w-[3px] rounded-r-full bg-electric"
        />
      )}
      <Icon className={cn("h-4 w-4", active && "text-electric")} />
      {label}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  // The clicked item lights up immediately instead of waiting for the new page
  // to arrive; it only counts while we're still on the page it was clicked from.
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null);
  const target = pending && pending.from === pathname ? pending.href : null;

  return (
    <>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
        <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.2em] text-fog/60">Menu</p>
        {NAV_ITEMS.map((item) => (
          <NavRow
            key={item.href}
            item={item}
            active={target ? item.href === target : pathname === item.href || pathname.startsWith(`${item.href}/`)}
            onClick={() => {
              setPending({ href: item.href, from: pathname });
              onNavigate?.();
            }}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-electric/[0.18]! pt-4">
        <Link href="/blog" target="_blank" onClick={onNavigate} className={footerLinkClass}>
          <ExternalLink className="h-4 w-4" />
          View Site
        </Link>
        <form action={signOut}>
          <button type="submit" className={footerLinkClass}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Mobile / tablet top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-electric/[0.16]! bg-void/85 px-4 backdrop-blur lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-fog transition-colors hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile / tablet drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-white/[0.08] admin-sidebar-backdrop p-5 pt-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Brand onNavigate={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-fog transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-electric/[0.18]! admin-sidebar-backdrop p-5 pt-8 shadow-[28px_0_48px_-32px_rgba(2,8,18,0.7)] lg:flex">
        <div className="mb-8">
          <Brand />
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}
