export type ComplianceStatus = "pass" | "fail";

export const REGULATIONS_PAGE = {
  eyebrow: "Legal & Compliance",
  titleLead: "Stay cool.",
  titleAccent: "Stay legal.",
  description:
    "SUNKOOL window films are engineered for Indian road compliance — CMVR certified and aligned with IS 2553 visible light transmission standards.",
} as const;

export const SIDE_WINDOWS_REGULATION = {
  title: "Side Windows",
  standard: "IS 2553 (Part 2): 2019 (Revision 1)",
  highlight: "fifty percent visible light transmission",
  body: "The glass used for the driver and front passenger windows of every motor vehicle must be manufactured to allow at least fifty percent visible light transmission, in compliance with Indian Standard IS 2553 (Part 2): 2019 (Revision 1), as updated periodically.",
} as const;

export const TRANSPARENCY_CHECK = {
  title: "Transparency Check",
  subtitle: "SUNKOOL film compliance across window positions",
  columns: [
    { id: "windshield", label: "Windshield" },
    { id: "front_side", label: "Front Side Windows" },
    { id: "rear", label: "Rear Windows" },
  ],
  rows: [
    {
      label: "SUNKOOL Film",
      status: ["pass", "pass", "pass"] as ComplianceStatus[],
    },
  ],
} as const;

export const REGULATION_CERTIFICATES = [
  {
    id: "cmvr",
    title: "CMVR Certificate",
    description: "Central Motor Vehicles Rules compliance documentation for SUNKOOL films.",
  },
] as const;

export const REGULATIONS_DISCLAIMER =
  "Regulations may be updated by authorities from time to time. Always confirm current local limits with your certified SUNKOOL installer before finalising a grade. This page is informational and not legal advice.";
