export const SOCIAL_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/sunkool_india",
    handle: "@sunkool_india",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1MHPqZzJYL/",
    handle: "Sunkool India",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@sunkool",
    handle: "@sunkool",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sunkool-solution/",
    handle: "Sunkool Solution",
  },
] as const;

export type SocialLinkId = (typeof SOCIAL_LINKS)[number]["id"];
