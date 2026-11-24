"use server";

import { setBlogLeadStatus } from "@/lib/blog/leads/queries";
import { isLeadStatus } from "@/lib/blog/leads/status";
import { requireAdmin } from "@/lib/blog/require-admin";

type ActionResult = { success: true } | { success: false; error: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Server Actions are plain POST endpoints: the arguments are untrusted, whatever the dropdown offers. */
export async function setLeadStatus(id: string, status: string): Promise<ActionResult> {
  if (typeof id !== "string" || !UUID.test(id) || !isLeadStatus(status)) {
    return { success: false, error: "That change isn't valid." };
  }

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { success: false, error: "Your session has expired — sign in again to continue." };
  }

  try {
    if (!(await setBlogLeadStatus(supabase, id, status))) {
      return { success: false, error: "This entry no longer exists. Refresh the page." };
    }
  } catch (error) {
    console.error("Updating a blog lead's status failed", error);
    return { success: false, error: "Couldn't save the status. Please try again." };
  }

  // No revalidatePath: the page is rendered per request (it reads the admin's session), and the
  // component reloads it after this returns — see LeadStatusSelect.
  return { success: true };
}
