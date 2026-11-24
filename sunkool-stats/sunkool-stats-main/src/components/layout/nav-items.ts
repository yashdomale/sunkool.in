import { PPF_NAV } from "@/lib/ppf-media";
import { NAV_ITEMS } from "@/lib/ultra-edge-media";

/** Links in the "More" menu. */
export const MORE: { href: string; label: string; showsNewBadge?: true }[] = [
  { href: "/contact", label: "Contact" },
  { href: "/regulations", label: "Regulations" },
  { href: "/our-journey", label: "Our Journey" },
  { href: "/blog", label: "Updates", showsNewBadge: true },
  { href: "/become-dealer", label: "Become a Dealer" },
];

const WINDOW_FILM_SERIES = [
  { slug: "foundation", label: "Legend, Elite & SK Series" },
  { slug: "signature", label: "Signature Series" },
] as const;

/** Top-level product links; `seriesLinks` become the dropdown / mobile sub-menu. */
export const PRIMARY = [
  {
    href: "/window-film",
    label: "Window Film",
    seriesLinks: WINDOW_FILM_SERIES,
  },
  { href: "/ppf", label: "PPF", seriesLinks: PPF_NAV },
  { href: "/interior-ppf", label: "Interior PPF" },
  {
    href: "/ultra-edge",
    label: "Ultra Edge",
    seriesLinks: NAV_ITEMS,
  },
  { href: "/warranty", label: "Warranty" },
] as const;

export const navSpring = { type: "spring" as const, stiffness: 420, damping: 34 };

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
