import { getAdminPosts, getDashboardAnalytics, getTopPosts } from "@/lib/blog/queries";
import { createClient } from "@/lib/supabase/server";
import { DashboardView } from "@/components/admin/dashboard-view";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [analytics, recent, topPosts, authResult] = await Promise.all([
    getDashboardAnalytics(),
    getAdminPosts({ page: 1, pageSize: 5 }),
    getTopPosts(5),
    supabase.auth.getUser(),
  ]);

  const user = authResult.data.user;
  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const displayName = meta.full_name ?? meta.name ?? user?.email?.split("@")[0] ?? "Admin";

  return (
    <DashboardView analytics={analytics} recentPosts={recent.posts} topPosts={topPosts} displayName={displayName} />
  );
}
