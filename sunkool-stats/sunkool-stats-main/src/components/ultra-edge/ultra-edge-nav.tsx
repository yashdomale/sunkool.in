import { NAV_ITEMS } from "@/lib/ultra-edge-media";
import { SectionNav } from "@/components/product/section-nav";

export function UltraEdgeNav() {
  return (
    <SectionNav
      items={NAV_ITEMS}
      initial="ultra"
      label="Ultra Edge product lines"
      layoutId="ultra-edge-nav-pill"
      pillClass="bg-electric/15 ring-1 ring-electric/30"
      widthClass="max-w-5xl"
      centered={false}
      itemPadClass="px-4 sm:px-5"
    />
  );
}
