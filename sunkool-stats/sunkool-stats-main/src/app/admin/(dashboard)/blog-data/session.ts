import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/blog/require-admin";

/**
 * Pages re-check authorization themselves instead of relying on the dashboard
 * layout: layouts are not re-rendered on every client-side navigation, and the
 * contact details on this page are personal data.
 */
export async function requireAdminOrRedirect() {
  try {
    return await requireAdmin();
  } catch {
    redirect("/admin/login");
  }
}
