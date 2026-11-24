import { PPF_BRAND } from "@/lib/ppf-content";
import { ProductCta } from "@/components/product/product-cta";

export function PpfCta() {
  return (
    <ProductCta
      eyebrow="SUNKOOL PPF"
      title="Why SUNKOOL is the choice of everyone"
      body="Everyone values quality, particularly when it comes to automobiles. Connect with our experienced installers for tailored PPF coverage and outstanding customer service."
      gradientClass="from-white/[0.08] via-black/50 to-sun/10"
      address={PPF_BRAND.address}
      phone={{ label: PPF_BRAND.phone, href: PPF_BRAND.phoneHref, className: "text-silver" }}
      whatsappMessage="Hello SUNKOOL, I'm interested in paint protection film for my vehicle."
    />
  );
}
