import Link from "next/link";
import { FooterMapVideo } from "./footer-map-video";
import { Logo } from "./logo";
import { BRAND } from "@/lib/brand";
import { CONTACT } from "@/lib/contact";
import { LEGAL_PAGES } from "@/lib/legal-pages";
import { SocialLinks } from "@/components/ui/social-links";
import { cities, cityLocation, servedCitySlugs, type CitySlug } from "@/lib/cities";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { href: "/window-film", label: "Window Film" },
      { href: "/ppf", label: "Paint Protection" },
      { href: "/interior-ppf", label: "Interior PPF" },
      { href: "/ultra-edge", label: "Ultra Edge" },
      { href: "/compare", label: "Compare & Configure" },
    ],
  },
  {
    title: "Ownership",
    links: [
      { href: "/warranty", label: "Warranty" },
      { href: "/contact", label: "Contact" },
      { href: "/regulations", label: "Regulations" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/our-journey", label: "Our Journey" },
      { href: "/blog", label: "Updates" },
      { href: "/videos", label: "Videos" },
      { href: "/become-dealer", label: "Become a Dealer" },
    ],
  },
];

export function Footer({ city }: { city?: CitySlug } = {}) {
  const showOffice = !city || city === "nagpur";
  return (
    <footer className="relative border-t border-white/5 bg-carbon">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
      <div className="container-lux py-16">
        {/* Mobile: 3 columns — Products, Ownership and Company side by side;
            everything else spans the full row. */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 md:grid-cols-2 md:gap-12 lg:grid-cols-5">
          <Link href="/" aria-label="SUNKOOL home" className="focus-ring col-span-3 -order-2 w-fit rounded-lg md:hidden">
            <Logo className="h-auto w-20" />
          </Link>
          <div className="col-span-3 min-w-0 md:col-span-1 lg:col-span-2 lg:row-span-2">
            <Link href="/" aria-label="SUNKOOL home" className="focus-ring hidden rounded-lg md:inline-block">
              <Logo className="h-auto w-20" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white md:mt-5">
              {BRAND.tagline} Premium automotive films and nano-ceramic heat
              rejection technology, engineered for extreme conditions.
            </p>
            <div className="mt-6 space-y-1 text-sm text-white">
              <p><a href={CONTACT.phoneHref} className="focus-ring rounded-sm hover:text-electric">{CONTACT.phone}</a></p>
              <p><a href={CONTACT.emailHref} className="focus-ring break-words rounded-sm hover:text-electric">{CONTACT.email}</a></p>
              <address className="break-words not-italic">
                {showOffice ? CONTACT.corporateAddress.lines.join(" ") : cityLocation(city!)}
              </address>
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90">
                Follow us
              </p>
              <SocialLinks className="mt-3" size="sm" />
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className={col.title === "Products" ? "min-w-0 lg:row-span-2" : "min-w-0"}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white md:text-xs md:tracking-[0.25em]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 md:mt-5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="focus-ring rounded-sm text-sm text-silver-soft transition-colors hover:text-electric"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {showOffice && <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.corporateAddress.lines.join(" "))}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open SUNKOOL's address in Google Maps (opens in a new tab)"
            className="focus-ring group relative -order-1 block min-w-0 cursor-pointer overflow-hidden rounded-xl bg-carbon shadow-[0_0_30px_4px_rgba(88,167,232,0.4),0_0_80px_12px_rgba(88,167,232,0.25)] col-span-3 md:order-none md:col-span-2 lg:col-start-4 lg:row-start-2"
          >
            <FooterMapVideo />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-carbon/90 px-4 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
            >
              View on map ↗
            </span>
          </a>}
        </div>

        <nav aria-labelledby="footer-cities" className="mt-12 border-t border-white/10 pt-10">
          <h3
            id="footer-cities"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-white md:text-xs md:tracking-[0.25em]"
          >
            Cities We Serve
          </h3>
          {/* Grid so the city names line up in straight columns, with vertical dividers between
              columns. The list is shifted left by the divider + padding and clipped, so the
              leftmost column has no line and its text stays aligned with the heading. */}
          <div className="mt-4 overflow-hidden">
          <ul className="-ml-[17px] grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {servedCitySlugs.map((slug) => (
              <li key={slug} className="border-l border-white/15 pl-4">
                <Link
                  href={`/${slug}`}
                  aria-current={slug === city ? "page" : undefined}
                  className="focus-ring inline-block rounded-sm py-1.5 text-sm text-silver-soft transition-colors hover:text-electric"
                >
                  {cities[slug].name}
                </Link>
              </li>
            ))}
          </ul>
          </div>
        </nav>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SUNKOOL. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_PAGES.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="focus-ring rounded-sm hover:text-silver-soft"
              >
                {page.title}
              </Link>
            ))}
            <Link href="/contact" className="focus-ring rounded-sm hover:text-silver-soft">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
