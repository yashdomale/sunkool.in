import type { ReactNode } from "react";
import { DatabaseZap } from "lucide-react";
import { PageHeader, Panel } from "@/components/admin/ui";

/** Class for a migration file name inside the steps. */
export const MIGRATION_FILE_CLASS = "rounded-md border border-electric/25! bg-electric/10 px-1.5 py-0.5 font-mono text-xs text-glow";

/**
 * Shown on an admin page instead of an error when its Supabase migrations haven't been applied yet.
 * The steps are always: open the SQL Editor, run `runStep`'s migrations, refresh.
 */
export function SetupNeeded({
  title,
  description,
  heading,
  intro,
  runStep,
  footnote,
}: {
  title: string;
  description: string;
  heading: string;
  intro: ReactNode;
  runStep: ReactNode;
  footnote: ReactNode;
}) {
  return (
    <div>
      <PageHeader eyebrow="Sunkool CMS" title={title} description={description} />
      <Panel className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/40! bg-amber-400/10 text-amber-300">
            <DatabaseZap className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold text-white">{heading}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog">{intro}</p>
            <ol className="mt-5 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white marker:text-fog">
              <li>
                Open your project in Supabase and go to <strong className="font-medium">SQL Editor</strong>.
              </li>
              <li>{runStep}</li>
              <li>Refresh this page.</li>
            </ol>
            <p className="mt-5 text-xs text-fog">{footnote}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
