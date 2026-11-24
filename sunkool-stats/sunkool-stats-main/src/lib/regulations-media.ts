const IMG = "/images/regulations";

/** Bump when replacing files under public/images/regulations/ */
export const REGULATIONS_ASSET_VERSION = "2";

export const REGULATIONS_MEDIA = {
  cmvr: {
    src: `${IMG}/cmvr-certificate.jpg`,
    alt: "SUNKOOL CMVR certificate",
    fileHint: "public/images/regulations/cmvr-certificate.jpg",
  },
  transparencyCheck: {
    src: `${IMG}/transparency-check.jpg`,
    alt: "SUNKOOL transparency check compliance chart",
    fileHint: "public/images/regulations/transparency-check.jpg",
  },
} as const;
