import { ULTRA_EDGE_MEDIA } from "@/lib/ultra-edge-media";
import { ProductFilmBlock } from "@/components/product/product-film-block";
import { Reveal } from "@/components/ui/reveal";

export function UltraEdgeFilmBlock() {
  const { brandFilm } = ULTRA_EDGE_MEDIA;
  return (
    <>
      {/* Mobile only: the Ultra Edge video at its natural shape (not cropped). */}
      <section className="relative py-8 lg:hidden">
        <div className="container-lux">
          <Reveal>
            <video
              className="block h-auto w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_24px_80px_-20px_rgba(246,177,26,0.25)]"
              src="/images/videos/ULTRA%20EDGE.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="SUNKOOL Ultra Edge window film"
            />
          </Reveal>
        </div>
      </section>

      {/* Desktop: the full-width brand film, unchanged. */}
      <div className="hidden lg:block">
        <ProductFilmBlock
          videoSrc={brandFilm.videoSrc}
          fileHintVideo={brandFilm.fileHintVideo}
          accent="sun"
          videoPageHref="/videos/ultra-edge"
        />
      </div>
    </>
  );
}
