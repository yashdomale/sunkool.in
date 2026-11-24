export const HOME_HERO = {
  eyebrow: "Advanced Nanoceramic Glazing",
  headline: ["Exceptional heat reduction.", "Crystal-clear visibility."],
  lead: "Advanced nanoceramic window safety glazing — exceptional heat reduction, crystal-clear visibility, and a premium aesthetic across every shade.",
  subline:
    "Engineered for superior heat rejection, UV protection, and optical clarity — protection and elegance in every shade.",
  mobileLead:
    "Nanoceramic window safety glazing with exceptional heat reduction and crystal-clear visibility.",
  backdropTagline: "Precision-engineered window film technology",
  scrollHint: "Scroll to feel the difference",
} as const;

export const HOME_HERO_SPECS = [
  "Heat Rejection",
  "UV Protection",
  "Optical Clarity",
] as const;

export const HOME_HERO_STATS = [
  { value: "99.9", suffix: "%", label: "UV block", accent: "electric" as const },
  { value: "96", suffix: "%", label: "IR reject", accent: "sun" as const },
] as const;

export const HOME_HERO_CTAS = [
  { href: "/window-film", label: "Window Film", accent: "sun" as const },
  { href: "/ppf", label: "Paint Protection (PPF)", accent: "kool" as const },
] as const;
