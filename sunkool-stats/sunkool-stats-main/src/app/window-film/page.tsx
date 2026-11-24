import type { Metadata } from "next";
import { WindowFilmView } from "@/components/window-film/window-film-view";
import { WINDOW_FILM } from "@/lib/products";
import { SIGNATURE_PRODUCT_HIGHLIGHTS } from "@/lib/window-film-content";
import { WINDOW_FILM_MEDIA } from "@/lib/window-film-media";
import { productSchema, productListSchema, breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION =
  "SUNKOOL nano-ceramic automotive window films: the Legend, Elite, SK and Sunroof Special series and the Signature range, engineered for heat rejection, clarity and UV protection.";

const WINDOW_FILM_PRODUCT_SCHEMA = productSchema({
  name: "SUNKOOL Nano-Ceramic Window Film",
  description: DESCRIPTION,
  image: WINDOW_FILM_MEDIA.hero.src,
  properties: [
    { name: "UV Protection", value: "99%" },
    { name: "Peak IR Rejection", value: "99%" },
    { name: "Signal Interference", value: "Signal-safe" },
  ],
});

const HIGHLIGHTS: Record<string, { body: string }> = SIGNATURE_PRODUCT_HIGHLIGHTS;

/** Every film on the page with its printed figures, so search engines get the same numbers visitors see. */
const WINDOW_FILM_RANGE_SCHEMA = productListSchema({
  name: "SUNKOOL window films",
  products: WINDOW_FILM.series.flatMap((series) =>
    series.products.map((product) => ({
      name: `SUNKOOL ${product.name}`,
      description: (product.family && HIGHLIGHTS[product.family]?.body) || `${series.name}: ${product.note || product.tagline}`,
      image: WINDOW_FILM_MEDIA.hero.src,
      properties: [
        { name: "Series", value: series.name },
        { name: "Visible Light Transmission (VLT)", value: `${product.vlt}%` },
        { name: "IR Rejection", value: `${product.ir}%` },
        { name: "UV Rejection", value: `${product.uv}%` },
        { name: "Total Solar Energy Rejected (TSER)", value: `${product.tser}%` },
        ...(product.warrantyMonths ? [{ name: "Warranty", value: `${product.warrantyMonths} months` }] : []),
      ],
    }))
  ),
});

const WINDOW_FILM_BREADCRUMB_SCHEMA = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Window Film", path: "/window-film" },
]);

export const metadata: Metadata = {
  title: {
    absolute: "Heat Control Window Film for Cars | SUNKOOL",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/window-film" },
  openGraph: {
    title: "Heat Control Window Film for Cars — SUNKOOL Nano-Ceramic",
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function WindowFilmPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WINDOW_FILM_PRODUCT_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WINDOW_FILM_RANGE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(WINDOW_FILM_BREADCRUMB_SCHEMA),
        }}
      />
      <WindowFilmView />
    </>
  );
}
