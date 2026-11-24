import { getAdminAnnouncements, isAnnouncementsNotSetUp } from "@/lib/announcements/queries";
import type { Announcement } from "@/lib/announcements/types";
import { PageHeader } from "@/components/admin/ui";
import { AnnouncementForm } from "./announcement-form";
import { AnnouncementCard } from "./announcement-card";
import { SetupNeeded } from "./setup-needed";

export default async function AdminUpdatesPage() {
  let announcements: Announcement[];
  try {
    announcements = await getAdminAnnouncements();
  } catch (error) {
    if (isAnnouncementsNotSetUp(error)) return <SetupNeeded />;
    throw error;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Sunkool CMS"
        title="Updates"
        description="Announcements shown on the public Updates page, under its intro text. They are separate from blog posts."
      />
      <div className="mb-6">
        <AnnouncementForm />
      </div>
      <div className="flex flex-col gap-3">
        {announcements.length === 0 && <p className="py-6 text-center text-sm text-fog">No announcements yet.</p>}
        {announcements.map((a) => <AnnouncementCard key={a.id} announcement={a} />)}
      </div>
    </div>
  );
}
