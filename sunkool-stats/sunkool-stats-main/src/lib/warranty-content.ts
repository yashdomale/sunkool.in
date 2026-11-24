import { CONTACT } from "@/lib/contact";

export type WarrantyRegistrationStep = {
  title: string;
  body: string;
  details?: string[];
  success?: boolean;
  icon:
    | "qr"
    | "badge"
    | "package"
    | "form"
    | "camera"
    | "review"
    | "send"
    | "success";
};

export const WARRANTY_PORTAL_URL = "https://w.sunkool.in/";
export const WARRANTY_DEALER_URL = "https://w.sunkool.in/Dealer.aspx";

export const WARRANTY_PAGE = {
  eyebrow: "Ownership",
  titleLead: "Your protection,",
  titleAccent: "secured.",
  description:
    "Every SUNKOOL installation is backed by comprehensive coverage. Check an existing warranty or register a new one in minutes.",
} as const;

export const WARRANTY_PROMISES = [
  {
    title: "Comprehensive Coverage",
    desc: "Protection against bubbling, peeling, cracking, and discoloration.",
    icon: "shield" as const,
  },
  {
    title: "Transferable",
    desc: "Your warranty adds resale value — it moves with the vehicle.",
    icon: "transfer" as const,
  },
  {
    title: "Certified Network",
    desc: "Backed by trained, authorised SUNKOOL installers nationwide.",
    icon: "network" as const,
  },
] as const;

export const WARRANTY_ACTIONS = [
  {
    id: "check",
    eyebrow: "Existing warranty",
    title: "Check your coverage",
    description:
      "Already registered? Enter your mobile number, chassis number, or car number to view your warranty status and coverage details.",
    cta: "Check Warranty",
    href: WARRANTY_PORTAL_URL,
    featured: true,
  },
  {
    id: "register",
    eyebrow: "New installation",
    title: "Register your film",
    description:
      "Scan the QR code on your Sunkool product or warranty card to register your window film and activate protection.",
    cta: "Open Registration Portal",
    href: WARRANTY_PORTAL_URL,
    featured: false,
  },
  {
    id: "dealer",
    eyebrow: "Authorised dealers",
    title: "Check authorised dealer",
    description:
      "Planning an installation? Enter a dealer's mobile number or dealer code to confirm they are an authorised Sunkool partner.",
    cta: "Check Authorised Dealer",
    href: WARRANTY_DEALER_URL,
    featured: false,
  },
] as const;

export const WARRANTY_PHASES = [
  { label: "Get started", steps: [0, 1, 2] },
  { label: "Your details", steps: [3, 4] },
  { label: "Confirm & complete", steps: [5, 6, 7] },
] as const;

export const WARRANTY_REGISTRATION_STEPS: WarrantyRegistrationStep[] = [
  {
    icon: "qr",
    title: "Scan the QR Code",
    body: "Locate the QR code on your Sunkool Window Film product or warranty card and scan it using your smartphone.",
  },
  {
    icon: "badge",
    title: "Verify the Product Code",
    body: "The system will automatically verify the product's authenticity and eligibility for warranty registration.",
  },
  {
    icon: "package",
    title: "Add Your Product",
    body: "Confirm the detected product or select it from the available list.",
  },
  {
    icon: "form",
    title: "Complete the Registration Form",
    body: "Fill in your personal details, including:",
    details: [
      "Full Name",
      "Mobile Number",
      "Email Address",
      "Installation Address",
      "Purchase Date",
      "Dealer/Installer Name",
    ],
  },
  {
    icon: "camera",
    title: "Upload Required Images",
    body: "Upload clear photos of:",
    details: ["Installed Window Film"],
  },
  {
    icon: "review",
    title: "Review Your Information",
    body: "Verify that all entered details and uploaded documents are correct.",
  },
  {
    icon: "send",
    title: "Submit Registration",
    body: 'Click the "Register Warranty" button to submit your warranty request.',
  },
  {
    icon: "success",
    title: "Warranty Successfully Registered",
    body: "Your warranty is now registered successfully.",
    details: [
      "Your warranty registration is complete. Save your Warranty ID from the portal for future reference.",
    ],
    success: true,
  },
];

export const WARRANTY_HELP = {
  title: "Need help with your warranty?",
  body: "Our team can guide you through registration, coverage questions, or dealer verification.",
  cta: "Contact Support",
  href: "/contact",
} as const;

export type AuthenticityCheck = {
  title: string;
  icon: "box" | "qr" | "scan" | "film";
  points: { label: string; text: string }[];
};

/** Where to send a suspected counterfeit. The number is the site's own (CONTACT), spaced the way it is printed. */
export const WARRANTY_SUPPORT = {
  email: "service@sunkool.in",
  emailHref: "mailto:service@sunkool.in",
  phone: "+91 7028 146 972",
  phoneHref: CONTACT.phoneHref,
} as const;

/** "How to verify your genuine Sunkool product": shown above the warranty portal on /warranty. */
export const WARRANTY_AUTHENTICITY = {
  eyebrow: "Product authenticity",
  titleLead: "How to verify your",
  titleAccent: "genuine Sunkool product",
  intro:
    "To ensure you have purchased an authentic Sunkool product, please check for the following security and branding markers on our packaging and window film:",
  checks: [
    {
      title: "Outer Box Security Seals",
      icon: "box",
      points: [
        {
          label: "Holographic Flap Seal",
          text: "Check for a genuine Sunkool hologram sticker securing the flap of the outer box.",
        },
        {
          label: "Side & Roll Holograms",
          text: "Look for the holographic security sticker applied at the beginning of the film roll as well as on the side of the roll.",
        },
      ],
    },
    {
      title: "QR Code & Unique Product ID",
      icon: "qr",
      points: [
        {
          label: "Verification Details",
          text: "Locate the printed QR code and unique Product ID on the inner flap of the box and the packaging cap.",
        },
      ],
    },
    {
      title: "Instant Online Verification",
      icon: "scan",
      points: [
        {
          label: "Scan to Verify",
          text: "Simply scan the QR code using your smartphone camera or any QR scanner to instantly verify the authenticity of your product on our official portal.",
        },
      ],
    },
    {
      title: "Authenticity Branding on Film",
      icon: "film",
      points: [
        {
          label: "Branded Window Film",
          text: "Every genuine Sunkool window film features the official company and product name subtly printed directly on the film itself.",
        },
      ],
    },
  ] as AuthenticityCheck[],
  tip: {
    label: "Buying Tip",
    text: "Always purchase Sunkool products through authorized dealers and distributors to ensure 100% genuine quality and full warranty coverage.",
  },
  counterfeit: {
    title: "Suspect a Counterfeit Product?",
    text: "Your safety, privacy, and satisfaction are our top priorities. If your packaging is missing any of the security features above, or if the QR code verification fails, please let us know immediately so we can assist you.",
  },
  next: {
    title: "What to Do Next",
    steps: [
      {
        title: "Stop Installation",
        text: "Do not apply or use the product if you suspect it may be counterfeit.",
      },
      {
        title: "Gather Information",
        text: "Take clear photos of the packaging, outer box, inner flaps, QR code, film roll, and your purchase receipt.",
      },
      {
        title: "Report to Us",
        // {email} and {phone} become links to WARRANTY_SUPPORT in the page.
        text: "Contact our support team directly at {email} or call {phone} with your details and photos.",
      },
      {
        title: "Notify Your Retailer",
        text: "Reach out to the store or installer where you purchased the item to request clarification or a resolution.",
      },
    ],
  },
  note: "Sunkool warranty coverage and performance guarantees apply exclusively to verified, genuine products purchased through authorized dealers.",
} as const;
