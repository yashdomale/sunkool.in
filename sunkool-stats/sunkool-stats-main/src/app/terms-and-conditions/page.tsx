import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { getLegalPage } from "@/lib/legal-pages";

const page = getLegalPage("terms-and-conditions")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: `/${page.slug}` },
  openGraph: {
    title: `${page.title} — SUNKOOL`,
    description: page.description,
    images: ["/opengraph-image"],
  },
};

export default async function TermsAndConditionsPage() {
  const { default: Content } = (await import(
    "@content/legal/terms-and-conditions.mdx"
  )) as { default: React.ComponentType };

  return (
    <LegalDocumentView
      slug={page.slug}
      title={page.title}
      effectiveDate={page.effectiveDate}
    >
      <Content />
    </LegalDocumentView>
  );
}
