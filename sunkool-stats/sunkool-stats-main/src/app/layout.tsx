import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@/chatbot/styles/floating-chat.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ChromeGate } from "@/components/layout/chrome-gate";
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from "@/lib/schema";
import { getLatestPublishedAt } from "@/lib/blog/queries";

const display = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sunkool.in"),
  title: {
    default: "SUNKOOL — Engineered to Defeat Heat",
    template: "%s — SUNKOOL",
  },
  description:
    "SUNKOOL builds premium automotive window films, paint protection films and nano-ceramic heat rejection technology engineered for extreme conditions.",
  alternates: {
    canonical: "./",
  },
  verification: {
    google: "XcutMqrkzAgFBo-Mlr7-pKLUs-3CVsG3UnDTUDWCISQ",
    other: {
      "msvalidate.01": "E7AA8EF6E17AFC3AE58FBD1D902CE4A1",
    },
  },
  openGraph: {
    title: "SUNKOOL — Engineered to Defeat Heat",
    description:
      "Premium automotive films built for extreme conditions. Heat rejection, UV protection and engineering excellence.",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
  },
  // One favicon declaration with one stable URL. favicon.ico lives in public/ on purpose: as
  // src/app/favicon.ico, Next's file convention emits a second <link rel="icon"> (the same logo as
  // /sk-icon.png) pointing at /favicon.ico?favicon.<hash>.ico, and on prerendered pages appends
  // "?dpl=<deployment>" to that, giving a malformed URL with two "?". Google then crawled and
  // reported each variant separately.
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: "/sk-apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const latestUpdateAt = await getLatestPublishedAt();
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-silver-soft">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll>
          <ChromeGate latestUpdateAt={latestUpdateAt}>{children}</ChromeGate>
        </SmoothScroll>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H4ND18PXY6"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-H4ND18PXY6');`}
        </Script>
      </body>
    </html>
  );
}
