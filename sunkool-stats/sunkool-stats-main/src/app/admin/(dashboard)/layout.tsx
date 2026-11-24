import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { adminTheme } from "@/components/admin/theme";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated requests, but this route
  // group can also be reached in ways middleware can't see coming (e.g. a
  // stale prefetch), so the check is repeated here as the real gate.
  if (!user) {
    redirect("/admin/login");
  }

  // Any Auth user can hold a session; only `admins` allowlist members may
  // see the dashboard. Non-admins get zero rows via RLS on `admins`.
  const { data: adminRow } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const meta = (user.user_metadata ?? {}) as { full_name?: string; name?: string };
  const displayName = meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? "Admin";

  return (
    <div style={adminTheme} className="admin-backdrop min-h-screen lg:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto w-full max-w-[1240px]">
          <AdminTopbar name={displayName} />
          {children}
        </div>
      </main>
    </div>
  );
}
