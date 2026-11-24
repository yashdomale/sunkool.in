import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { HTML_LIMITED_BOT_UA_RE } from "next/dist/shared/lib/router/utils/html-bots";
import { legacyRedirects } from "./src/lib/legacy-redirects";
import { assetRedirects } from "./src/lib/asset-redirects";

// Cover images and in-article images uploaded from the admin editor live in
// the "blog-images" Supabase Storage bucket â€” derive the host from the
// project's own env var rather than hardcoding a project ref.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Next's default list of crawlers that get title/canonical/robots in the initial <head> leaves out
  // plain "Googlebot" (it only has Google-InspectionTool and friends), so the indexing crawler gets
  // that metadata streamed into <body> whenever its data is not already cached - and the /blog
  // listing's index/noindex decision depends on data. Adding it makes the tags deterministic for
  // Googlebot and makes Search Console's Live Test show what the real crawl gets. Visitors still
  // stream. Remove this line to go back to Next's default.
  htmlLimitedBots: new RegExp(`${HTML_LIMITED_BOT_UA_RE.source}|Googlebot`, "i"),
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/blog/**" },
      { pathname: "/news/**" },
      { pathname: "/logo.png" },
      { pathname: "/sunkool-wordmark.png", search: "" },
      { pathname: "/sk-icon.png", search: "" },
    ],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/blog-images/**",
          },
        ]
      : [],
  },
  async redirects() {
    // Wix URLs that currently rank â€” must 301 to their new-site equivalents
    // before DNS flips, or search engines lose all existing rankings.
    // /blog/* is intentionally NOT here yet â€” see the launch-blocker report.
    return [
      { source: "/paint-protection-film", destination: "/ppf", permanent: true },
      { source: "/heat-control-glazing", destination: "/window-film", permanent: true },
      { source: "/about-6", destination: "/warranty", permanent: true },
      { source: "/about-1", destination: "/regulations", permanent: true },
      { source: "/about-us", destination: "/our-journey", permanent: true },
      { source: "/check-warranty", destination: "/warranty", permanent: true },
      // Misspelled city slugs that were once live - 308 so Search Console
      // consolidates them into the real city page.
      { source: "/ahemdabad", destination: "/ahmedabad", permanent: true },
      { source: "/hydrabad", destination: "/hyderabad", permanent: true },
      // Customer "where do I buy?" intent â€” routed to the existing dealer
      // authorisation lookup tool on the separate w.sunkool.in app, not
      // merged with /become-dealer (B2B recruitment).
      {
        source: "/authorised-dealer",
        destination: "https://w.sunkool.in/dealer.aspx",
        permanent: true,
      },
      // Old Wix service-page slugs with a direct modern equivalent (per the
      // GSC "Not found (404)" report, 2026-09).
      // statusCode 301, not `permanent: true` (which Next sends as 308), to match legacyRedirects.
      { source: "/heat-control-window-film", destination: "/window-film", statusCode: 301 },
      { source: "/enhance-your-car-with-paint-protection-film", destination: "/ppf", statusCode: 301 },
      // More old Wix pages with an exact equivalent (see src/lib/legacy-redirects.ts) - including
      // the few old blog tags/categories (/blog/categories/x, /blog/tags/x) that have a counterpart
      // among the new ?category= pages. There is deliberately no catch-all for the rest of the old
      // taxonomy: those URLs stay 404 instead of landing on an unrelated page.
      ...legacyRedirects,
      // Old per-city copies of shared images (see src/lib/asset-redirects.ts).
      ...assetRedirects,
    ];
  },
  async headers() {
    const YEAR = "public, max-age=31536000, immutable";
    return [
      { source: "/videos/:path*", headers: [{ key: "Cache-Control", value: YEAR }] },
      { source: "/frames/:path*", headers: [{ key: "Cache-Control", value: YEAR }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: YEAR }] },
      { source: "/blog/:path*.{jpg,jpeg,png,webp,avif}", headers: [{ key: "Cache-Control", value: YEAR }] },
    ];
  },
};

// remark-frontmatter strips YAML --- blocks so @next/mdx doesn't choke on them.
// remark-gfm adds tables, strikethrough, task lists, etc.
// With Turbopack, plugins must be specified as strings (no function references).
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-frontmatter"],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
