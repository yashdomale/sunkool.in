/** The five feature points shown directly below the home page statistics, in display order. */
export const HOME_FEATURES = [
  {
    id: "heat-control",
    title: "Advanced Heat Control",
    description: "Reduces solar heat for a cooler, more comfortable drive.",
  },
  {
    id: "uv-protection",
    title: "UV Protection",
    description: "Blocks up to 99% of harmful UV rays.",
  },
  {
    id: "visibility",
    title: "Crystal-Clear Visibility",
    description: "Enjoy clear views with balanced heat control.",
  },
  {
    id: "no-dark-tint",
    title: "Comfort Without Dark Tint",
    description: "High-visibility options, including 70% VLT.",
  },
  {
    id: "nano-ceramic",
    title: "Nano-Ceramic Technology",
    description: "Advanced heat control with signal-safe performance.",
  },
] as const;

export type HomeFeatureId = (typeof HOME_FEATURES)[number]["id"];
