import { Audiowide } from "next/font/google";

/**
 * Squared tech face used for the Signature and sunroof/moonroof product names (shown slanted via `italic`;
 * Audiowide has no italic file, so the browser slants it). Exposed as a CSS variable so it can sit
 * on the element itself without fighting the site's `font-display` class.
 */
export const signatureNameFont = Audiowide({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-signature-name",
});
