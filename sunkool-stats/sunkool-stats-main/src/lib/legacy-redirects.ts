// Old Wix URLs that Google still crawls (Search Console "Not found (404)") and
// that have an exact equivalent on this site. Spread into redirects() in
// next.config.ts.
//
// The bar is "same subject, nothing lost": a page about PPF in Nagpur may point
// at /ppf, but a page about PPF on one car model may not - there is no
// model-specific page here, and redirecting it to a generic one is a soft 404
// that Google ignores. Those model pages (sunkool-...-on-<model>-...) are
// intentionally NOT listed: they stay 404. Wix numbered duplicated pages with
// a "-N" suffix, hence the `:n(\\d+)` variants.
//
// /door-edge-guard (a physical door guard) is also deliberately unlisted: it
// must not point at /ultra-edge, which is a sunroof/window-film line.
//
// The same bar applies to Wix's blog tags and categories: a redirect needs a new category
// with the same subject, and there is deliberately no /blog/tags/* or /blog/categories/*
// catch-all. Only the window-film topics below have one; every other old tag and category
// (model names, "sunkool", "automobiles"...) stays 404 rather than landing on an unrelated
// listing. src/lib/legacy-redirects.test.ts rejects wildcard sources.
//
// statusCode 301 (not `permanent: true`, which Next sends as 308) so the
// response is the plain permanent redirect Search Console documents.

export type LegacyRedirect = { source: string; destination: string; statusCode: 301 };

const to = (destination: string, ...sources: string[]): LegacyRedirect[] =>
  sources.map((source) => ({ source, destination, statusCode: 301 }));

const WINDOW_FILM_CAR = "/sunkool-sun-heat-control-window-film-for-car-sunkool-sun-heat-control-window-film";
const PPF_CAR_NAGPUR = "/sunkool-paint-protection-film-for-car-sunkool-paint-protection-film-in-nagpur";

export const legacyRedirects: LegacyRedirect[] = [
  // The old "Warranty Checker" / "Warranty Registration" pages are what /warranty now does.
  ...to("/warranty", "/warranty-checker", "/warranty-registration", "/warranty-regestration"),

  // Generic (no car model) sun-heat-control window film pages, with and without the city.
  ...to(
    "/nagpur",
    `${WINDOW_FILM_CAR}-in-nagpur`,
    `${WINDOW_FILM_CAR}-in-nagpur-:n(\\d+)`,
    "/sunkool-sun-heat-control-window-film-sunkool-sun-heat-control-window-film-in-nagpur",
  ),
  ...to("/window-film", WINDOW_FILM_CAR, `${WINDOW_FILM_CAR}-:n(\\d+)`),

  // /window-film sells this same film as "nanoceramic window safety glazing" (products.ts), so
  // the two generic Nagpur safety-glazing pages go where their window-film siblings go.
  ...to(
    "/nagpur",
    "/sunkool-sun-heat-control-window-safety-glazing-for-car-sunkool-in-nagpur",
    "/sunkool-window-safety-glazing-sunkool-window-safety-glazing-in-nagpur",
  ),

  // Generic (no car model) PPF pages for Nagpur; /ppf is the Nagpur PPF page.
  ...to(
    "/ppf",
    PPF_CAR_NAGPUR,
    `${PPF_CAR_NAGPUR}-:n(\\d+)`,
    "/paint-protection-film-installation-shop-in-nagpur-sunkool-paint-protection-film-ppf",
  ),

  // Wix's blog pagination (/blog/page/2): the same article list, now a noindexed ?page=N of /blog.
  ...to("/blog", "/blog/page/:n(\\d+)"),

  // Old Wix topics that are the new "Window Film" category: car tint and window safety glazing.
  // Its guides cover tint types, cost, legality and safety glazing; the page is indexable
  // (curated copy, several articles - see category-copy.ts and listing-seo.ts).
  ...to(
    "/blog?category=window-film",
    "/blog/categories/car-tint",
    "/blog/categories/car-window-safety-glazing",
    "/blog/tags/car-window-safety-glazing",
  ),
];
