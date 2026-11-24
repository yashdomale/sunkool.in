// Leads captured by the SUNKOOL Assistant chatbot (Zoho SalesIQ). The bot's last step sends the
// visitor's name, mobile and the product they picked to /api/chatbot-leads, which stores them in
// the same table as the blog-post enquiries (source = 'chatbot') through submit_chatbot_lead().
//
// Server-only (node:crypto). Unlike the public blog form this input comes from Zoho, not a
// browser, so it is cleaned up leniently rather than rejected: the phone number is what the team
// needs, and a one-letter name or an odd button label must not cost them the lead.
import { createHash, timingSafeEqual } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeMobile } from "@/lib/leads/phone";
import { collapseSpaces } from "@/lib/leads/validation";

export type ChatbotLeadInput = {
  name?: unknown;
  mobile?: unknown;
  /** The product / topic button the visitor picked, e.g. "Heat Control Glazing". */
  product?: unknown;
  /** The chat's id in Zoho. Makes a retried delivery of the same chat store only one lead. */
  conversationId?: unknown;
};

export type SubmitChatbotLeadResult =
  | { success: true; stored: boolean }
  | { success: false; status: 422 | 429 | 500 | 503; error: string };

// ---------------------------------------------------------------------------
// Shared secret
// ---------------------------------------------------------------------------

/** Anything shorter is treated as "not configured": a guessable secret is no secret. */
export const MIN_SECRET_LENGTH = 16;

export function isChatbotSecretConfigured(secret: string | undefined): secret is string {
  return typeof secret === "string" && secret.length >= MIN_SECRET_LENGTH;
}

/** Constant-time comparison (of fixed-length digests, so the length does not leak either). */
export function secretMatches(provided: string | null | undefined, expected: string | undefined): boolean {
  if (!isChatbotSecretConfigured(expected) || !provided) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/**
 * Where the caller may put the secret: the `x-chatbot-secret` header, or a `?token=` in the URL
 * for tools that can only configure a URL.
 */
export function secretFromRequest(headers: Headers, searchParams: URLSearchParams): string | null {
  return headers.get("x-chatbot-secret")?.trim() || searchParams.get("token")?.trim() || null;
}

// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Reads the fields we need from the request body. The documented shape is flat
 * (`name`, `mobile`, `product`, `conversation_id`), but `phone`, `conversationId` and Zoho's own
 * `visitor.name` / `visitor.phone` are understood too.
 */
export function parseChatbotPayload(body: unknown): ChatbotLeadInput {
  const data = isRecord(body) ? body : {};
  const visitor = isRecord(data.visitor) ? data.visitor : {};
  return {
    name: data.name ?? visitor.name,
    mobile: data.mobile ?? data.phone ?? visitor.phone,
    product: data.product,
    conversationId: data.conversation_id ?? data.conversationId,
  };
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : typeof value === "number" && Number.isFinite(value) ? String(value) : "";
}

// Control characters, including tabs and line breaks: these are single-line fields.
const CONTROL = /[\u0000-\u001F\u007F-\u009F]/g;

/** One tidy line of at most `max` characters (counted as the database counts them: code points). */
function singleLine(value: unknown, max: number): string {
  const line = collapseSpaces(asText(value).replace(CONTROL, " "));
  return Array.from(line).slice(0, max).join("").trim();
}

export const FALLBACK_NAME = "Chatbot visitor";
export const FALLBACK_PRODUCT = "Not specified";

export function chatbotLeadName(input: unknown): string {
  const name = singleLine(input, 80);
  return Array.from(name).length >= 2 ? name : FALLBACK_NAME;
}

/** The label as the bot sent it, plus a stable id for it ("chatbot/heat-control-glazing"). */
export function chatbotLeadProduct(input: unknown): { id: string; name: string } {
  const name = singleLine(input, 120) || FALLBACK_PRODUCT;
  const slug = name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
  return { id: `chatbot/${slug || "other"}`, name };
}

/**
 * A uuid derived from the Zoho conversation id, so the same chat delivered twice maps to the same
 * lead. Null (the database makes its own key) when there is no usable id.
 */
export function conversationSubmissionKey(conversationId: unknown): string | null {
  const id = asText(conversationId).trim();
  if (!id || id.length > 200) return null;
  const hex = createHash("sha256").update(`sunkool-chatbot-lead:${id}`).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

// ---------------------------------------------------------------------------
// Storing
// ---------------------------------------------------------------------------

/**
 * Cleans a chatbot enquiry and stores it through `submit_chatbot_lead`. Like the blog form this
 * runs with the anonymous Supabase client: the database function decides what may be written, and
 * there is no service-role key anywhere.
 */
export async function submitChatbotLead(
  supabase: Pick<SupabaseClient, "rpc">,
  input: ChatbotLeadInput
): Promise<SubmitChatbotLeadResult> {
  const mobile = normalizeMobile(asText(input.mobile));
  if (!mobile.ok) return { success: false, status: 422, error: `mobile: ${mobile.error}` };

  const product = chatbotLeadProduct(input.product);
  const { data, error } = await supabase.rpc("submit_chatbot_lead", {
    p_name: chatbotLeadName(input.name),
    p_mobile: mobile.e164,
    p_product_id: product.id,
    p_product_name: product.name,
    p_submission_key: conversationSubmissionKey(input.conversationId),
  });

  if (error) return mapRpcError(error);
  // The function answers true for a new lead and false for one it already had (a duplicate).
  return { success: true, stored: data === true };
}

function mapRpcError(error: { message?: string; code?: string }): SubmitChatbotLeadResult {
  const message = error.message ?? "";

  if (message === "lead_rate_limited" || error.code === "PT429") {
    return { success: false, status: 429, error: "Too many enquiries from this number. Try again later." };
  }
  const invalid = /^invalid_lead:(name|mobile|product)$/.exec(message);
  if (invalid) return { success: false, status: 422, error: `${invalid[1]}: not accepted.` };

  // PGRST202 / 42883: the function is not in the database yet, i.e. migration 0010 has not run.
  if (error.code === "PGRST202" || error.code === "42883") {
    console.error("[chatbot-leads] submit_chatbot_lead is missing - run supabase/migrations/0010_chatbot_leads.sql:", error);
    return { success: false, status: 503, error: "Chatbot leads aren't set up in the database yet." };
  }

  // Never echo database internals back to the caller; keep them in the server log.
  console.error("[chatbot-leads] submit_chatbot_lead failed:", error);
  return { success: false, status: 500, error: "Could not store the lead." };
}
