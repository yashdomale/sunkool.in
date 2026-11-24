"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { submitBlogLead, type SubmitLeadInput, type SubmitLeadResult } from "@/lib/blog/leads/submit";

/**
 * Public by design: anyone reading a blog post can send an enquiry. Nothing here
 * grants them anything — it runs with the visitor's own anonymous Supabase
 * session, and the `submit_blog_lead` database function is the only door into the
 * leads table (see supabase/migrations/0007). No service-role key is involved.
 */
export async function submitBlogLeadAction(input: SubmitLeadInput): Promise<SubmitLeadResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Enquiries aren't available right now. Please message us on WhatsApp instead." };
  }
  return submitBlogLead(await createClient(), input);
}
