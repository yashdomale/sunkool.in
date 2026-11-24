import type { Announcement } from "@/lib/announcements/types";
import { MegaphoneIcon } from "./megaphone-icon";
import { formatLongDate } from "@/lib/format-date";

/** Admin-posted announcements, shown under the intro text of the Updates page. Not tied to blog posts. */
export function AnnouncementsSection({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;

  return (
    <section aria-labelledby="announcements-heading" className="mb-14">
      <h2 id="announcements-heading" className="eyebrow mb-5 flex items-center gap-3">
        <MegaphoneIcon className="h-9 w-auto" />
        Announcements
      </h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {announcements.map((announcement) => (
          <li key={announcement.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            {announcement.publishedAt && (
              <time
                dateTime={announcement.publishedAt}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-sun"
              >
                {formatLongDate(announcement.publishedAt)}
              </time>
            )}
            <h3 className="mt-2 font-display text-xl font-semibold text-white">{announcement.title}</h3>
            {announcement.body && (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/75">{announcement.body}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
