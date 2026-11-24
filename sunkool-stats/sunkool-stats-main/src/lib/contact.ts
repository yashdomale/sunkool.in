import { SOCIAL_LINKS } from "@/lib/social-links";

export const CONTACT = {
  email: "info@sunkool.in",
  emailHref: "mailto:info@sunkool.in",
  phone: "+91 7028146972",
  phoneHref: "tel:+917028146972",
  whatsappNumber: "917028146972",
  whatsappDisplay: "+91 7028146972",
  defaultWhatsAppMessage:
    "Hello SUNKOOL! I'd like to know more about your window film / heat control glazing / PPF solutions.",
  responseTime: "Usually replies within 2 hours",
  usAddress: {
    title: "US Address",
    region: "United States",
    code: "US",
    lines: [
      "3034 E 143rd Dr,",
      "Thornton, CO 80602,",
      "United States.",
    ],
  },
  corporateAddress: {
    title: "Corporate Office",
    region: "India",
    code: "IN",
    lines: [
      "Sunkool Solution",
      "32/33, Mayfair, Near AIR,",
      "Congress Nagar, Nagpur - 440012,",
      "Maharashtra",
    ],
  },
  social: SOCIAL_LINKS.map(({ label, href }) => ({ label, href })),
} as const;

/** The corporate office address on one line, e.g. for product page footers. */
export const CORPORATE_ADDRESS_LINE = CONTACT.corporateAddress.lines.slice(1).join(" ");

export function buildWhatsAppUrl(message?: string) {
  const text = encodeURIComponent(
    message?.trim() || CONTACT.defaultWhatsAppMessage
  );
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${text}`;
}

export function buildEnquiryWhatsAppUrl(fields: {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  interest?: string;
  tab?: string;
  message?: string;
}) {
  const lines = [
    "Hello SUNKOOL! I'd like to connect regarding:",
    "",
    fields.tab ? `Enquiry: ${fields.tab}` : null,
    fields.name ? `Name: ${fields.name}` : null,
    fields.email ? `Email: ${fields.email}` : null,
    fields.phone ? `Phone: ${fields.phone}` : null,
    fields.city ? `City: ${fields.city}` : null,
    fields.interest ? `Vehicle / Interest: ${fields.interest}` : null,
    fields.message ? `\nMessage:\n${fields.message}` : null,
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join("\n"));
}

export function buildDealerApplicationWhatsAppUrl(fields: {
  businessName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  city?: string;
  yearsInBusiness?: string;
}) {
  const lines = [
    "Hello SUNKOOL! New dealer partnership application:",
    "",
    fields.businessName ? `Business name: ${fields.businessName}` : null,
    fields.contactPerson ? `Contact person: ${fields.contactPerson}` : null,
    fields.email ? `Email: ${fields.email}` : null,
    fields.phone ? `Phone: ${fields.phone}` : null,
    fields.city ? `City: ${fields.city}` : null,
    fields.yearsInBusiness
      ? `Years in business: ${fields.yearsInBusiness}`
      : null,
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join("\n"));
}
