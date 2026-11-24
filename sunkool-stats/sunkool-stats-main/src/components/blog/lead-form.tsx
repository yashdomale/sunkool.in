"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, CircleCheck, LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react";
import { submitBlogLeadAction } from "@/app/blog/actions";
import { ProductSelect } from "@/components/blog/product-select";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { buildWhatsAppUrl } from "@/lib/contact";
import { TimeoutError, withTimeout } from "@/lib/with-timeout";
import { formatMobile, normalizeMobile } from "@/lib/leads/phone";
import {
  MESSAGE_MAX_LENGTH,
  validateCity,
  validateMessage,
  validateName,
  type LeadField,
  type LeadFieldErrors,
} from "@/lib/leads/validation";
import type { LeadProductGroup } from "@/lib/blog/leads/products";
import { cn } from "@/lib/utils";

type Values = { name: string; mobile: string; city: string; productId: string; message: string; trap: string };
const EMPTY: Values = { name: "", mobile: "", city: "", productId: "", message: "", trap: "" };
const FIELD_ORDER: LeadField[] = ["name", "mobile", "city", "productId", "message"];

function check(field: LeadField, values: Values): string | undefined {
  switch (field) {
    case "name": {
      const result = validateName(values.name);
      return "error" in result ? result.error : undefined;
    }
    case "city": {
      const result = validateCity(values.city);
      return "error" in result ? result.error : undefined;
    }
    case "mobile": {
      const result = normalizeMobile(values.mobile);
      return result.ok ? undefined : result.error;
    }
    case "productId":
      return values.productId ? undefined : "Choose the product you're interested in.";
    case "message": {
      const result = validateMessage(values.message);
      return "error" in result ? result.error : undefined;
    }
  }
}

/** crypto.randomUUID() only exists in secure contexts; a LAN-IP preview over http must still work. */
function newSubmissionKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** How long to wait for the server before letting the visitor try again instead of spinning forever. */
const SUBMIT_TIMEOUT_MS = 20_000;

const inputClass =
  "w-full rounded-xl border bg-black/50 px-4 py-3.5 text-base text-white outline-none transition-colors placeholder:text-white/40 focus:ring-1 sm:py-3 sm:text-sm";
const inputOk = "border-white/10 focus:border-electric focus:ring-electric/30";
const inputBad = "border-red-400/70 focus:border-red-400 focus:ring-red-400/30";

export function BlogLeadForm({ postId, products }: { postId: string; products: LeadProductGroup[] }) {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ name: string; mobile: string } | null>(null);
  // A synchronous guard: two clicks can land before React re-renders the disabled button.
  const sending = useRef(false);
  // One key per enquiry, kept across retries so a repeated request can only ever store one lead.
  const submissionKey = useRef<string | null>(null);
  const thanks = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === "sent") thanks.current?.focus();
  }, [phase]);

  const idOf = (field: LeadField) => `${uid}-${field}`;
  const focusField = (field: LeadField) => document.getElementById(idOf(field))?.focus();

  function update(field: LeadField, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Once a field has been flagged, re-check it as the visitor fixes it.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: check(field, next) }));
  }

  function blur(field: LeadField) {
    if (values[field] === "" && !errors[field]) return; // don't nag about fields they haven't touched
    setErrors((prev) => ({ ...prev, [field]: check(field, values) }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const found: LeadFieldErrors = {};
    for (const field of FIELD_ORDER) {
      const message = check(field, values);
      if (message) found[field] = message;
    }
    setErrors(found);
    setFormError(null);
    const firstBad = FIELD_ORDER.find((field) => found[field]);
    if (firstBad) {
      focusField(firstBad);
      return;
    }

    sending.current = true;
    setPhase("sending");
    submissionKey.current ??= newSubmissionKey();
    try {
      const result = await withTimeout(
        submitBlogLeadAction({
          postId,
          name: values.name,
          mobile: values.mobile,
          city: values.city,
          productId: values.productId,
          message: values.message,
          submissionKey: submissionKey.current,
          website: values.trap,
        }),
        SUBMIT_TIMEOUT_MS
      );
      if (result.success) {
        const mobile = normalizeMobile(values.mobile);
        setSent({ name: values.name.trim(), mobile: mobile.ok ? formatMobile(mobile.e164) : values.mobile.trim() });
        setValues(EMPTY);
        setErrors({});
        submissionKey.current = null;
        setPhase("sent");
      } else {
        setFormError(result.error);
        setErrors(result.fieldErrors ?? {});
        setPhase("idle");
        const bad = FIELD_ORDER.find((field) => result.fieldErrors?.[field]);
        if (bad) focusField(bad);
      }
    } catch (error) {
      // Network drop, a stale deployment or a server that never answers: keep what they typed and the same
      // key, so retrying is safe. A late reply to the abandoned attempt is ignored.
      setFormError(
        error instanceof TimeoutError
          ? "This is taking longer than usual. Your details are still here, so please try again."
          : "We couldn't reach the server. Check your connection and try again."
      );
      setPhase("idle");
    } finally {
      sending.current = false;
    }
  }

  const busy = phase === "sending";
  const whatsappUrl = buildWhatsAppUrl("Hello Sunkool! I read your blog and I'd like advice on the right film for my car.");

  return (
    <section
      id="enquire"
      aria-labelledby={`${uid}-title`}
      className="relative z-10 mt-16 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-black/60 p-6 shadow-[0_30px_80px_-40px_rgba(88,167,232,0.4)] backdrop-blur-xl sm:p-10"
    >
      {/* The glows are clipped here rather than on the card, so the product list can open past its edge. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-electric/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-sun/10 blur-3xl" />
      </div>

      {phase === "sent" && sent ? (
        <div
          ref={thanks}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="relative mx-auto flex max-w-xl flex-col items-center py-6 text-center outline-none"
        >
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-electric/40 bg-electric/15 text-glow shadow-[0_0_32px_-6px_rgba(88,167,232,0.7)]">
            <CircleCheck className="h-7 w-7" />
          </span>
          <h2 id={`${uid}-title`} className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Thank you, {sent.name.split(" ")[0]}!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
            We&apos;ve received your enquiry. A Sunkool specialist will call you on{" "}
            <span className="whitespace-nowrap font-semibold text-white">{sent.mobile}</span>.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#2ee872]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp now
            </a>
            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setSent(null);
              }}
              className="text-sm text-white/80 underline underline-offset-4 transition-colors hover:text-white"
            >
              Send another enquiry
            </button>
          </div>
        </div>
      ) : (
        <div className="relative grid gap-8">
          <h2 id={`${uid}-title`} className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
            Planning heat or paint protection for your car?
          </h2>

          <form onSubmit={onSubmit} noValidate aria-busy={busy} className="@container grid gap-4">
            {/* Columns follow the card's own width, not the screen's: the blog column can be narrow on a wide
                screen, and "Interested product" must stay on one line for the four fields to line up. */}
            <div className="grid items-start gap-4 @min-[34rem]:grid-cols-2 @min-[58rem]:grid-cols-4">
              <Field id={idOf("name")} label="Full name" error={errors.name}>
                <input
                  id={idOf("name")}
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your full name"
                  maxLength={80}
                  required
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => blur("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${idOf("name")}-error` : undefined}
                  className={cn(inputClass, errors.name ? inputBad : inputOk)}
                />
              </Field>
              <Field id={idOf("mobile")} label="Mobile number" error={errors.mobile}>
                <input
                  id={idOf("mobile")}
                  type="tel"
                  name="mobile"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="98765 43210"
                  maxLength={24}
                  required
                  value={values.mobile}
                  onChange={(e) => update("mobile", e.target.value)}
                  onBlur={() => blur("mobile")}
                  aria-invalid={Boolean(errors.mobile)}
                  aria-describedby={errors.mobile ? `${idOf("mobile")}-error` : undefined}
                  className={cn(inputClass, errors.mobile ? inputBad : inputOk)}
                />
              </Field>
              <Field id={idOf("city")} label="City" error={errors.city}>
                <input
                  id={idOf("city")}
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="e.g. Nagpur"
                  maxLength={60}
                  required
                  value={values.city}
                  onChange={(e) => update("city", e.target.value)}
                  onBlur={() => blur("city")}
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? `${idOf("city")}-error` : undefined}
                  className={cn(inputClass, errors.city ? inputBad : inputOk)}
                />
              </Field>
              <Field id={idOf("productId")} label="Interested product" error={errors.productId}>
                <ProductSelect
                  id={idOf("productId")}
                  label="Interested product"
                  groups={products}
                  value={values.productId}
                  onChange={(productId) => update("productId", productId)}
                  onBlur={() => blur("productId")}
                  invalid={Boolean(errors.productId)}
                  describedBy={errors.productId ? `${idOf("productId")}-error` : undefined}
                  className={cn(inputClass, errors.productId ? inputBad : inputOk)}
                />
              </Field>
            </div>

            <Field id={idOf("message")} label="Message (optional)" error={errors.message}>
              <textarea
                id={idOf("message")}
                name="message"
                rows={3}
                placeholder="Tell us about your car or what you need"
                maxLength={MESSAGE_MAX_LENGTH}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                onBlur={() => blur("message")}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? `${idOf("message")}-error` : undefined}
                className={cn(inputClass, "resize-none", errors.message ? inputBad : inputOk)}
              />
              <p className="mt-1.5 text-right text-xs tabular-nums text-white/50" aria-hidden="true">
                {values.message.length}/{MESSAGE_MAX_LENGTH}
              </p>
            </Field>

            {/* Honeypot: invisible and unreachable for people, tempting for form-filling bots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
              <label>
                Leave this field empty
                <input
                  type="text"
                  name="comment_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.trap}
                  onChange={(e) => setValues((prev) => ({ ...prev, trap: e.target.value }))}
                />
              </label>
            </div>

            {formError && (
              <p
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {formError}
              </p>
            )}

            <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={busy}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-electric px-7 py-4 text-sm font-semibold text-black shadow-[0_10px_30px_-10px_rgba(88,167,232,0.8)] transition-all duration-300 hover:bg-glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {busy ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Request a call back
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                or chat on WhatsApp
              </a>
            </div>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-white/70">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric" />
              <span>
                Your details are used only to respond to this enquiry. See our{" "}
                <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-white">
                  Privacy Policy
                </Link>
                .
              </span>
            </p>
          </form>
        </div>
      )}
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block whitespace-nowrap text-xs uppercase tracking-[0.2em] text-white">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
