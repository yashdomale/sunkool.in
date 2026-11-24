import { WINDOW_FILM_MEDIA } from "@/lib/window-film-media";
import { ProductFilmBlock } from "@/components/product/product-film-block";

export function WindowFilmFilmBlock() {
  const { brandFilm } = WINDOW_FILM_MEDIA;
  return <ProductFilmBlock videoSrc={brandFilm.videoSrc} fileHintVideo={brandFilm.fileHintVideo} accent="electric" videoPageHref="/videos/window-film" />;
}
