import { PPF_MEDIA } from "@/lib/ppf-media";
import { ProductFilmBlock } from "@/components/product/product-film-block";

export function PpfFilmBlock() {
  const { brandFilm } = PPF_MEDIA;
  return <ProductFilmBlock videoSrc={brandFilm.videoSrc} fileHintVideo={brandFilm.fileHintVideo} accent="electric" videoPageHref="/videos/ppf" />;
}
