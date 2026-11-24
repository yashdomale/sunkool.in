import { WINDOW_FILM_BRAND } from "@/lib/window-film-content";
import { ProductCta } from "@/components/product/product-cta";

export function WindowFilmCta() {
  return (
    <ProductCta
      eyebrow="SUNKOOL Window Film"
      title="Find your perfect shade"
      body="Connect with our team for film selection, installation guidance, and dealer partnerships across India and the US."
      gradientClass="from-electric/10 via-black/50 to-sun/10"
      address={WINDOW_FILM_BRAND.address}
      phone={{ label: WINDOW_FILM_BRAND.phone, href: WINDOW_FILM_BRAND.phoneHref, className: "text-electric" }}
      showCompare
      whatsappMessage="Hello SUNKOOL, I'm interested in your window films for my vehicle."
    />
  );
}
