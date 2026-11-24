import { createClient } from "@/lib/supabase/server";

/**
 * Fails fast before an admin server action attempts a write.
 * RLS remains the database authorization boundary; this also checks the
 * `admins` allowlist so a random signed-in Auth user cannot drive mutations
 * through the UI/actions layer alone.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in as an admin to do that.");
  }

  // Non-admins get zero rows (RLS on `admins` is `using (is_admin())`), so
  // an empty result means "not on the allowlist" — not a query failure.
  const { data: adminRow } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    throw new Error("You must be signed in as an admin to do that.");
  }

  return { supabase, user };
}
