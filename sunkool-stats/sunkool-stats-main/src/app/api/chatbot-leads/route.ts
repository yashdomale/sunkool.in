import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  isChatbotSecretConfigured,
  parseChatbotPayload,
  secretFromRequest,
  secretMatches,
  submitChatbotLead,
} from "@/chatbot/leads/chatbot";

// The SUNKOOL Assistant (Zoho SalesIQ) posts each captured lead here; it is stored in blog_leads
// with source = 'chatbot' and shows up under Admin > Blog Leads > Chatbot. See SETUP.md.
//
// Server-to-server, so there is no CORS and no cookie session. The caller proves itself with the
// shared CHATBOT_LEAD_SECRET (header `x-chatbot-secret`, or `?token=`), and the write itself goes
// through the submit_chatbot_lead() database function with the public anon key - the same way the
// blog form stores its enquiries, with no service-role key.

// A name, a number and a product label are a few hundred bytes; anything near this is not a lead.
const MAX_BODY_CHARS = 10_000;

const NO_STORE = { "cache-control": "no-store" };

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

/** Zoho checks a webhook URL with a HEAD request before accepting it, and expects a 200. */
export function HEAD() {
  return new Response(null, { status: 200, headers: NO_STORE });
}

export function GET() {
  return json({ ok: true, service: "chatbot-leads" });
}

export async function POST(request: NextRequest) {
  const expected = process.env.CHATBOT_LEAD_SECRET;
  if (!isChatbotSecretConfigured(expected) || !isSupabaseConfigured()) {
    return json({ ok: false, error: "Chatbot leads are not configured on this server." }, 503);
  }
  if (!secretMatches(secretFromRequest(request.headers, request.nextUrl.searchParams), expected)) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return json({ ok: false, error: "Request too large." }, 413);

  let body: unknown;
  try {
    // JSON is what Zoho's webhooks send; a Deluge invokeurl with a plain `parameters` map sends a form.
    body = (request.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded")
      ? Object.fromEntries(new URLSearchParams(raw))
      : JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Send the lead as JSON." }, 400);
  }

  const result = await submitChatbotLead(await createClient(), parseChatbotPayload(body));
  return result.success ? json({ ok: true, stored: result.stored }) : json({ ok: false, error: result.error }, result.status);
}
