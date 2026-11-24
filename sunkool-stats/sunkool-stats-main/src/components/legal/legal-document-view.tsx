import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { LEGAL_PAGES, type LegalPageSlug } from "@/lib/legal-pages";

type LegalDocumentViewProps = {
  slug: LegalPageSlug;
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
};

export function LegalDocumentView({
  slug,
  title,
  effectiveDate,
  children,
}: LegalDocumentViewProps) {
  const otherPages = LEGAL_PAGES.filter((p) => p.slug !== slug);

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={title}
        description={`Effective ${effectiveDate}`}
      />

      <section className="pb-28">
        <div className="container-lux max-w-4xl">
          <article className="prose-sunkool">{children}</article>

          <div className="mt-16 border-t border-white/10 pt-10">
            <p className="eyebrow mb-4">Related legal pages</p>
            <div className="flex flex-wrap gap-3">
              {otherPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-white transition-colors hover:border-electric hover:text-white"
                >
                  {page.title}
                </Link>
              ))}
              <Link
                href="/contact"
                className="rounded-full border border-white/15 px-5 py-2 text-sm text-white transition-colors hover:border-electric hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
