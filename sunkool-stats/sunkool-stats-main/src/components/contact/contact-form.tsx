"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { buildEnquiryWhatsAppUrl, CONTACT } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { identifySalesIQVisitor } from "@/lib/salesiq";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

const TABS = [
  { key: "General enquiry", label: "General" },
  { key: "Vehicle / Film", label: "Vehicle / Film" },
  { key: "Dealer inquiry", label: "Dealer" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ContactForm() {
  const [tab, setTab] = useState<TabKey>("General enquiry");
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    interest: "",
    message: "",
  });

  const update =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const whatsappUrl = buildEnquiryWhatsAppUrl({
    ...fields,
    tab,
  });

  const submitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    identifySalesIQVisitor(fields);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-black/50 p-8 backdrop-blur-xl lg:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-electric/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-sun/10 blur-3xl" />

      <div className="relative">
        <p className="eyebrow mb-2">Enquiry form</p>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Send details — we&apos;ll reply on{" "}
          <span className="text-[#25D366]">WhatsApp</span>
        </h2>
        <p className="mt-2 text-sm text-white">
          Fill in your details and we&apos;ll open a pre-filled WhatsApp chat so
          our team can respond fast.
        </p>

        <div className="mb-7 mt-7 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                tab === t.key
                  ? "border-electric bg-electric/15 text-white shadow-[0_0_24px_-6px_rgba(88,167,232,0.5)]"
                  : "border-white/10 text-white hover:border-white/25 hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={submitWhatsApp} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              placeholder="Your name"
              value={fields.name}
              onChange={update("name")}
            />
            <Field
              label="Email"
              type="email"
              placeholder="you@email.com"
              value={fields.email}
              onChange={update("email")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Phone / WhatsApp"
              placeholder={CONTACT.phone}
              value={fields.phone}
              onChange={update("phone")}
            />
            <Field
              label={tab === "Dealer inquiry" ? "Company / City" : "City"}
              placeholder={
                tab === "Dealer inquiry" ? "Company name" : "Your city"
              }
              value={fields.city}
              onChange={update("city")}
            />
          </div>
          {tab === "Vehicle / Film" && (
            <Field
              label="Vehicle & interest"
              placeholder="e.g. SUV — window film & PPF"
              value={fields.interest}
              onChange={update("interest")}
            />
          )}
          {tab === "Dealer inquiry" && (
            <Field
              label="Region of interest"
              placeholder="e.g. Maharashtra"
              value={fields.interest}
              onChange={update("interest")}
            />
          )}
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-white">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about your vehicle — heat control glazing, window film, or paint protection..."
              value={fields.message}
              onChange={update("message")}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-electric focus:ring-1 focus:ring-electric/30"
            />
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#2ee872] hover:shadow-[0_8px_32px_-6px_rgba(37,211,102,0.55)] sm:w-auto"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Continue on WhatsApp
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <p className="text-xs text-white sm:max-w-[14rem]">
              Opens WhatsApp with your enquiry pre-filled. No account needed on
              this site.
            </p>
          </div>
        </form>
      </div>

    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-white">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-electric focus:ring-1 focus:ring-electric/30"
      />
    </div>
  );
}
