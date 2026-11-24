"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { submitChatLead, type ChatLeadInput, type ChatLeadResult } from "@/chatbot/leads/lead";

/**
 * Public by design, like the blog enquiry form: it runs with the visitor's own anonymous Supabase
 * session and the `submit_chatbot_lead` database function (migration 0010) is the only door into the
 * leads table. No service-role key is involved.
 */
export async function submitChatLeadAction(input: ChatLeadInput): Promise<ChatLeadResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, reason: "unavailable", error: "Call-back requests aren't available right now. Please message us on WhatsApp instead." };
  }
  return submitChatLead(await createClient(), input);
}
