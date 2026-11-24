import { MIGRATION_FILE_CLASS, SetupNeeded as SetupNotice } from "@/components/admin/setup-needed";

export const BLOG_DATA_DESCRIPTION = "Name, contact number, city and product from the form at the bottom of every blog post.";

/**
 * Shown instead of an error when the database has not had the Blog Data migrations
 * applied yet (a fresh deploy, or a Supabase project that predates the feature).
 */
export function SetupNeeded() {
  return (
    <SetupNotice
      title="Blog Data"
      description={BLOG_DATA_DESCRIPTION}
      heading="One setup step left: add the Blog Data tables"
      intro={
        <>
          This Supabase project doesn&apos;t have the Blog Data database objects yet (or only part of them), so there is nothing to show. The enquiry form on blog posts
          can&apos;t save anything until they exist either.
        </>
      }
      runStep={
        <>
          Run <code className={MIGRATION_FILE_CLASS}>supabase/migrations/0006_blog_leads.sql</code>, then{" "}
          <code className={MIGRATION_FILE_CLASS}>supabase/migrations/0007_blog_leads_security.sql</code> — both, in that order. The second one is what keeps
          the data private to admins.
        </>
      }
      footnote={<>No new environment variables or keys are needed. Details are in SETUP.md under &ldquo;Blog data&rdquo;.</>}
    />
  );
}
