import { ULTRA_FILM_LAYERS } from "@/lib/ultra-edge-content";
import { ULTRA_EDGE_MEDIA } from "@/lib/ultra-edge-media";
import { LayerStack } from "@/components/product/layer-stack";

export function UltraEdgeFilmStack() {
  return (
    <LayerStack
      layers={ULTRA_FILM_LAYERS}
      eyebrow="Multi-Layer Construction"
      title={
        <>
          Silver stack.{" "}
          <span className="text-gradient-sun">Elite reflection.</span>
        </>
      }
      description="Scroll to peel apart Ultra Edge's engineered layers — from scratch-resistant top coat to optical adhesive."
      diagram={{
        ...ULTRA_EDGE_MEDIA.layerCrossSection,
        accent: "#f47521",
        label: "Film cross-section",
        className: "rounded-3xl shadow-[0_24px_60px_-20px_rgba(246,177,26,0.25)]",
      }}
      sectionClass="relative py-20 sm:py-28"
      gridClass="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      spread={72}
      tilt={-18}
      fadeFrom={0.5}
    />
  );
}
