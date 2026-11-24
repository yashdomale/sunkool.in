import type { CitySlug } from "@/lib/cities";

/**
 * Cities with their own section components (not the Nagpur template, not a custom design). They share
 * the styles in shared/individual-city/base.css; keep this list in step with shared/individual-city/index.css.
 */
export const individualCities: readonly CitySlug[] = [
  "ahmedabad", "bhopal", "bhubaneswar", "ernakulam", "hyderabad", "indore", "jaipur", "jamshedpur",
  "kolkata", "kozhikode", "raipur", "rajkot", "ranchi", "surat", "vadodara", "vijayawada",
];

export const cityContent = {
  indore: () => import("./content/indore/page"),
  vijayawada: () => import("./content/vijayawada/page"),
  kozhikode: () => import("./content/kozhikode/page"),
  bhopal: () => import("./content/bhopal/page"),
  bhubaneswar: () => import("./content/bhubaneswar/page"),
  amritsar: () => import("./content/amritsar/page"),
  ahmedabad: () => import("./content/ahmedabad/page"),
  hyderabad: () => import("./content/hyderabad/page"),
  kolkata: () => import("./content/kolkata/page"),
  delhi: () => import("./content/delhi/page"),
  nagpur: () => import("./content/nagpur/page"),
  chennai: () => import("./content/chennai/page"),
  pune: () => import("./content/pune/page"),
  bangalore: () => import("./content/bangalore/page"),
  mumbai: () => import("./content/mumbai/page"),
  jaipur: () => import("./content/jaipur/page"),
  ernakulam: () => import("./content/ernakulam/page"),
  surat: () => import("./content/surat/page"),
  vadodara: () => import("./content/vadodara/page"),
  rajkot: () => import("./content/rajkot/page"),
  ranchi: () => import("./content/ranchi/page"),
  jamshedpur: () => import("./content/jamshedpur/page"),
  raipur: () => import("./content/raipur/page"),
} satisfies Record<CitySlug, () => Promise<{ default: React.ComponentType }>>;
