import type { SupabaseClient } from "@supabase/supabase-js";
import { findLeadProduct } from "./products";
import { UUID_PATTERN, validateLeadFields, type LeadFieldErrors } from "@/lib/leads/validation";

export type SubmitLeadInput = {
  postId: unknown;
  name: unknown;
  mobile: unknown;
  city: unknown;
  productId: unknown;
  /** Optional free text from the visitor. */
  message?: unknown;
  /** Random per form session; makes retries and double clicks idempotent. */
  submissionKey?: unknown;
  /** Honeypot: a field real visitors never see, so only bots fill it. */
  website?: unknown;
};

export type SubmitLeadResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: LeadFieldErrors };

const GENERIC_ERROR =
  "We couldn't send your enquiry just now. Please try again in a moment, or message us on WhatsApp.";

/**
 * Validates an enquiry and stores it through the `submit_blog_lead` function.
 * Runs on the server with the visitor's own (anonymous) Supabase client: the
 * database function — not this code — decides what a visitor may write, looks up
 * the blog post's real title and URL, and applies duplicate and rate limits.
 */
export async function submitBlogLead(
  supabase: Pick<SupabaseClient, "rpc">,
  input: SubmitLeadInput
): Promise<SubmitLeadResult> {
  // A bot filled the hidden field. Report success so it learns nothing, store nothing.
  if (typeof input.website === "string" && input.website.trim() !== "") return { success: true };

  const checked = validateLeadFields(input);
  const product = findLeadProduct(input.productId);
  if (!checked.ok || !product) {
    const fieldErrors: LeadFieldErrors = checked.ok ? {} : checked.errors;
    if (!product) fieldErrors.productId = "Choose a product from the list.";
    return { success: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const postId = typeof input.postId === "string" ? input.postId : "";
  if (!UUID_PATTERN.test(postId)) {
    return { success: false, error: "This article is no longer available. Please refresh the page and try again." };
  }
  const submissionKey =
    typeof input.submissionKey === "string" && UUID_PATTERN.test(input.submissionKey) ? input.submissionKey : null;

  const params = {
    p_post_id: postId,
    p_name: checked.value.name,
    p_mobile: checked.value.mobile,
    p_city: checked.value.city,
    // Name and category come from the catalogue, never from the browser.
    p_product_id: product.id,
    p_product_name: product.name,
    p_product_category: product.category,
    p_submission_key: submissionKey,
  };

  // p_message is only sent when the visitor wrote something, so enquiries without one use exactly the
  // call the database has always accepted.
  const first = await supabase.rpc("submit_blog_lead", checked.value.message ? { ...params, p_message: checked.value.message } : params);
  if (!first.error) return { success: true };

  // The database has not had migration 0008 applied yet (no function takes p_message): keep the enquiry
  // rather than lose it. The submission key makes this retry safe.
  if (checked.value.message && first.error.code === "PGRST202") {
    const retry = await supabase.rpc("submit_blog_lead", params);
    if (!retry.error) return { success: true };
    return mapRpcError(retry.error);
  }
  return mapRpcError(first.error);
}

function mapRpcError(error: { message?: string; code?: string }): SubmitLeadResult {
  const message = error.message ?? "";

  if (message === "lead_rate_limited" || error.code === "PT429") {
    return {
      success: false,
      error: "We've already received several enquiries from this number. Our team will be in touch shortly.",
    };
  }
  if (message === "post_not_found") {
    return { success: false, error: "This article is no longer available. Please refresh the page and try again." };
  }
  const invalid = /^invalid_lead:(name|city|mobile|product|message)$/.exec(message);
  if (invalid) {
    const field = invalid[1] === "product" ? "productId" : (invalid[1] as "name" | "city" | "mobile" | "message");
    return {
      success: false,
      error: "Please check the highlighted fields.",
      fieldErrors: { [field]: "Please check this field." },
    };
  }

  // Never show database internals to a visitor; keep them in the server log.
  console.error("[blog-leads] submit_blog_lead failed:", error);
  return { success: false, error: GENERIC_ERROR };
}
