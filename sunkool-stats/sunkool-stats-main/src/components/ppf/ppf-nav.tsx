import { PPF_NAV } from "@/lib/ppf-media";
import { SectionNav } from "@/components/product/section-nav";

export function PpfNav() {
  return (
    <SectionNav
      items={PPF_NAV}
      initial="hd07"
      label="PPF series"
      layoutId="ppf-nav-pill"
      pillClass="bg-white/10 ring-1 ring-white/25"
    />
  );
}
