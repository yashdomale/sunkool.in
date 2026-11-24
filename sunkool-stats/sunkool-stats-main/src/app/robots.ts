import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // NOTE: `/_next/` is intentionally NOT disallowed. Googlebot must be
        // able to fetch the JS/CSS chunks under `/_next/static/` and the
        // optimized images under `/_next/image` to render and index this
        // (heavily client-rendered) site — blocking them causes "Crawled –
        // currently not indexed". Only genuinely private/no-value paths are
        // disallowed here.
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://www.sunkool.in/sitemap.xml",
    host: "https://www.sunkool.in",
  };
}
