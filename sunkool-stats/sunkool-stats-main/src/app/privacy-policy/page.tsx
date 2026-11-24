import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { getLegalPage } from "@/lib/legal-pages";

const page = getLegalPage("privacy-policy")!;

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

export default async function PrivacyPolicyPage() {
  const { default: Content } = (await import(
    "@content/legal/privacy-policy.mdx"
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
