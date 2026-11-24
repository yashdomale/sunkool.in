import { PPF_LAYERS } from "@/lib/ppf-content";
import { PPF_MEDIA } from "@/lib/ppf-media";
import { LayerStack } from "@/components/product/layer-stack";

export function PpfLayerStack() {
  return (
    <LayerStack
      layers={PPF_LAYERS}
      eyebrow="SUNKOOL Technology"
      title={
        <>
          Four engineered layers.{" "}
          <span className="text-gradient-electric">Flawless gloss.</span>
        </>
      }
      description="Every SUNKOOL PPF is a precision-built aliphatic polyurethane stack. Scroll to separate the layers and see how your paint stays protected."
      diagram={{
        ...PPF_MEDIA.layerDiagram,
        accent: "#c0c0c0",
        label: "PPF layer diagram",
        className: "rounded-3xl bg-black shadow-[0_24px_60px_-20px_rgba(192,192,192,0.25)]",
      }}
      sectionClass="relative border-y border-white/5 bg-white/[0.02] py-14 sm:py-20"
      gridClass="mt-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
    />
  );
}
