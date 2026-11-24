import { MIGRATION_FILE_CLASS, SetupNeeded as SetupNotice } from "@/components/admin/setup-needed";

/** Shown instead of an error when migration 0011 has not been applied to this Supabase project yet. */
export function SetupNeeded() {
  return (
    <SetupNotice
      title="Updates"
      description="Announcements shown on the public Updates page."
      heading="One setup step left: add the announcements table"
      intro={<>This Supabase project doesn&apos;t have the announcements table yet, so there is nothing to show and nothing can be saved.</>}
      runStep={
        <>
          Run <code className={MIGRATION_FILE_CLASS}>supabase/migrations/0011_announcements.sql</code>.
        </>
      }
      footnote="No new environment variables or keys are needed."
    />
  );
}
