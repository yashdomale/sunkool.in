"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string } | null;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/dashboard");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password." };
  }

  // Password auth alone is not enough — reject anyone not on the admins
  // allowlist so a random Auth account cannot reach the dashboard.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: adminRow } = user
    ? await supabase.from("admins").select("id").eq("id", user.id).maybeSingle()
    : { data: null };

  if (!adminRow) {
    await supabase.auth.signOut();
    return { error: "Invalid email or password." };
  }

  redirect(next.startsWith("/admin") ? next : "/admin/dashboard");
}
