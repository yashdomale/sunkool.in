// Shapes of the SUNKOOL product catalogue (see ./index.ts).

export type Product = {
  slug: string;
  name: string;
  /** marketing one-liner */
  tagline: string;
  /** Visible Light Transmission (%) — how much light passes through */
  vlt: number;
  /** Total Solar Energy Rejected (%) */
  tser: number;
  /** Infrared Rejection (%) */
  ir: number;
  /** UV Rejection (%) */
  uv: number;
  /** dominant accent colour for the card / page */
  accent: string;
  /** short positioning note */
  note: string;
  /** film thickness when specified (e.g. "7.5 mil") */
  thickness?: string;
  /** install orientation or application note */
  applyNote?: string;
  /** warranty period in months when applicable */
  warrantyMonths?: number;
  /** short feature badges shown on premium cards */
  highlightFeatures?: string[];
  /** groups variants that share one description, e.g. Topaz 70 and Topaz 50 → "topaz" */
  family?: string;
};

export type Series = {
  slug: string;
  name: string;
  blurb: string;
  products: Product[];
};

export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  series: Series[];
};
