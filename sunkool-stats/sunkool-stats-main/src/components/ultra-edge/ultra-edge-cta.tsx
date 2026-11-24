import { ULTRA_EDGE_BRAND } from "@/lib/ultra-edge-content";
import { ProductCta } from "@/components/product/product-cta";

export function UltraEdgeCta() {
  return (
    <ProductCta
      eyebrow="Ultra Edge by SUNKOOL"
      title="Experience the Ultra Advantage"
      body="Connect with our team for film selection, installation guidance, and dealer partnerships across India and the US."
      gradientClass="from-sun/10 via-black/50 to-electric/10"
      address={ULTRA_EDGE_BRAND.address}
      showCompare
      whatsappMessage="Hello SUNKOOL, I'm interested in Ultra Edge window films for my vehicle."
    />
  );
}
