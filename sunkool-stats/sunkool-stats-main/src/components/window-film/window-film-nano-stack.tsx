import { NANO_LAYERS } from "@/lib/window-film-content";
import { WINDOW_FILM_MEDIA } from "@/lib/window-film-media";
import { LayerStack } from "@/components/product/layer-stack";

export function WindowFilmNanoStack() {
  return (
    <LayerStack
      layers={NANO_LAYERS}
      eyebrow="SUNKOOL Technology"
      title={
        <>
          Four engineered layers.{" "}
          <span className="text-gradient-electric">One mission.</span>
        </>
      }
      description="Every SUNKOOL nano-ceramic film is a precision-built stack. Scroll to separate the layers and see how heat is stopped before it reaches you."
      diagram={{
        ...WINDOW_FILM_MEDIA.nanoDiagram,
        accent: "#58a7e8",
        label: "Nano-ceramic diagram",
        className: "rounded-3xl shadow-[0_24px_60px_-20px_rgba(88,167,232,0.3)]",
      }}
      sectionClass="relative border-y border-white/5 bg-white/[0.02] py-20 sm:py-28"
      gridClass="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
    />
  );
}
