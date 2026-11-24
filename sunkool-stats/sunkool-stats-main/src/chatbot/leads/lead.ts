// The "call me back" form inside the chat. It files the lead in the same place as every other
// chatbot lead (blog_leads, lead_source = 'chatbot'; Admin > Blog Leads > Chatbot), through the
// same database function, so the validation and abuse limits live in one place.
import type { SupabaseClient } from "@supabase/supabase-js";
import { submitChatbotLead } from "@/chatbot/leads/chatbot";
import { normalizeMobile } from "@/lib/leads/phone";
import { UUID_PATTERN, validateName } from "@/lib/leads/validation";
import { findTopicByLabel, GENERAL_TOPIC_LABEL } from "@/chatbot/lib/topics";

export type ChatLeadInput = {
  name: unknown;
  mobile: unknown;
  /** The label of the quick topic the visitor picked, if any. */
  topic?: unknown;
  /** One random id per chat: with the product, it makes sending the same request twice store one lead. */
  sessionId?: unknown;
  /** Honeypot: a field real visitors never see. */
  website?: unknown;
};

export type ChatLeadResult =
  | { success: true; name: string }
  | {
      success: false;
      error: string;
      fieldErrors?: { name?: string; mobile?: string };
      /** Why, when the chat can say it in the visitor's own language: too many requests, or the form is off. */
      reason?: "busy" | "unavailable";
    };

const GENERIC_ERROR = "We couldn't send that just now. Please try again, or message us on WhatsApp.";

export async function submitChatLead(supabase: Pick<SupabaseClient, "rpc">, input: ChatLeadInput): Promise<ChatLeadResult> {
  // A bot filled the hidden field: look successful, store nothing.
  if (typeof input.website === "string" && input.website.trim() !== "") return { success: true, name: "there" };

  const name = validateName(input.name);
  const mobile = normalizeMobile(typeof input.mobile === "string" ? input.mobile : "");
  if ("error" in name || !mobile.ok) {
    return {
      success: false,
      error: "Please check the highlighted fields.",
      fieldErrors: { ...("error" in name ? { name: name.error } : {}), ...(!mobile.ok ? { mobile: mobile.error } : {}) },
    };
  }

  const sessionId = typeof input.sessionId === "string" && UUID_PATTERN.test(input.sessionId) ? input.sessionId : undefined;
  const topic = findTopicByLabel(input.topic);
  const result = await submitChatbotLead(supabase, {
    name: name.value,
    mobile: mobile.e164,
    product: topic?.label ?? GENERAL_TOPIC_LABEL,
    // The key is per chat AND per product: a visitor who asks about PPF and then about window film
    // in the same chat leaves two leads, while sending one of them twice still stores only one.
    conversationId: sessionId ? `${sessionId}:${topic?.id ?? "general"}` : undefined,
  });

  if (result.success) return { success: true, name: name.value };
  if (result.status === 429) {
    return { success: false, reason: "busy", error: "We've already received several requests from this number. Our team will be in touch shortly." };
  }
  if (result.status === 422) {
    return { success: false, error: "Please check the highlighted fields.", fieldErrors: { mobile: "Please check this number." } };
  }
  return { success: false, error: GENERIC_ERROR };
}
