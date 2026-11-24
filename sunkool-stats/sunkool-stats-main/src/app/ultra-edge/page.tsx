import type { Metadata } from "next";
import { UltraEdgeView } from "@/components/ultra-edge/ultra-edge-view";
import { ULTRA_EDGE } from "@/lib/products/ultra-edge";
import { productSchema, productListSchema, breadcrumbSchema } from "@/lib/schema";
import { ULTRA_EDGE_MEDIA } from "@/lib/ultra-edge-media";

const DESCRIPTION =
  "SUNKOOL Ultra Edge, re-imagined: sputtered silver Ultra, titanium-nitride Edge, Prism nano multilayer PET, and sunroof & moonroof films for heat rejection, UV protection and crystal-clear vision.";

const ULTRA_EDGE_PRODUCT_SCHEMA = productSchema({
  name: "SUNKOOL Ultra Edge",
  description: DESCRIPTION,
  image: ULTRA_EDGE_MEDIA.hero.src,
  properties: [
    { name: "UV Protection", value: "99%" },
    { name: "Peak IR Rejection", value: "99%" },
  ],
});

/** Every UltraEDGE film with its printed figures, so search engines get the same numbers visitors see. */
const ULTRA_EDGE_RANGE_SCHEMA = productListSchema({
  name: "SUNKOOL Ultra Edge window films",
  products: ULTRA_EDGE.series.flatMap((series) =>
    series.products.map((product) => ({
      name: `SUNKOOL ${product.name}`,
      description: `${series.name}: ${product.note}`,
      image: ULTRA_EDGE_MEDIA.hero.src,
      properties: [
        { name: "Series", value: series.name },
        { name: "Visible Light Transmission (VLT)", value: `${product.vlt}%` },
        { name: "IR Rejection", value: `${product.ir}%` },
        { name: "UV Rejection", value: `${product.uv}%` },
        { name: "Total Solar Energy Rejected (TSER)", value: `${product.tser}%` },
      ],
    }))
  ),
});

const ULTRA_EDGE_BREADCRUMB_SCHEMA = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Ultra Edge", path: "/ultra-edge" },
]);

export const metadata: Metadata = {
  title: "Ultra Edge",
  description: DESCRIPTION,
  alternates: { canonical: "/ultra-edge" },
  openGraph: {
    title: "SUNKOOL Ultra Edge — Sunroof & Moonroof Films",
    description:
      "Sputtered silver Ultra, titanium-nitride Edge, and Prism nano multilayer PET films for superior heat rejection, UV protection, and crystal-clear vision.",
    images: ["/opengraph-image"],
  },
};

export default function UltraEdgePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ULTRA_EDGE_PRODUCT_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ULTRA_EDGE_RANGE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ULTRA_EDGE_BREADCRUMB_SCHEMA),
        }}
      />
      <UltraEdgeView />
    </>
  );
}
