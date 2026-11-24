import { CONTACT } from "@/lib/contact";
import { SOCIAL_LINKS } from "@/lib/social-links";

export const SITE_URL = "https://www.sunkool.in";

const SOCIAL_SAME_AS = SOCIAL_LINKS.map((s) => s.href);

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SUNKOOL",
  url: SITE_URL,
  logo: `${SITE_URL}/sunkool-wordmark.png`,
  sameAs: SOCIAL_SAME_AS,
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SUNKOOL",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const GOOGLE_PLACES_URL = "https://share.google/6xtRNdBUfJSuXOKV8";

export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: "SUNKOOL Solution",
  image: `${SITE_URL}/sunkool-wordmark.png`,
  url: SITE_URL,
  telephone: CONTACT.phoneHref.replace("tel:", ""),
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "32/33, Mayfair, Near AIR, Congress Nagar",
    addressLocality: "Nagpur",
    addressRegion: "Maharashtra",
    postalCode: "440012",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 21.1281984,
    longitude: 79.0825531,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "10:00",
    closes: "19:00",
  },
  sameAs: [...SOCIAL_SAME_AS, GOOGLE_PLACES_URL],
};

export function productSchema({
  name,
  description,
  image,
  properties,
}: {
  name: string;
  description: string;
  image: string;
  properties: { name: string; value: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image.startsWith("http") ? image : `${SITE_URL}${image}`,
    brand: { "@type": "Brand", name: "SUNKOOL" },
    additionalProperty: properties.map((p) => ({
      "@type": "PropertyValue",
      name: p.name,
      value: p.value,
    })),
  };
}

export function videoSchema({
  name,
  description,
  thumbnailUrl,
  contentUrl,
  uploadDate,
  durationSeconds,
  width,
  height,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
  durationSeconds: number;
  width: number;
  height: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: [
      thumbnailUrl.startsWith("http") ? thumbnailUrl : `${SITE_URL}${thumbnailUrl}`,
    ],
    uploadDate,
    duration: `PT${Math.round(durationSeconds)}S`,
    contentUrl: contentUrl.startsWith("http") ? contentUrl : `${SITE_URL}${contentUrl}`,
    width,
    height,
    publisher: {
      "@type": "Organization",
      name: "SUNKOOL",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/sunkool-wordmark.png`,
      },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** A schema.org ItemList of Product entries, one per film, for a range page. */
export function productListSchema({
  name,
  products,
}: {
  name: string;
  products: Parameters<typeof productSchema>[0][];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        ...Object.fromEntries(
          Object.entries(productSchema(product)).filter(([k]) => k !== "@context")
        ),
      },
    })),
  };
}
