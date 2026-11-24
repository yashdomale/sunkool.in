"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { buildDealerApplicationWhatsAppUrl, CONTACT } from "@/lib/contact";
import { identifySalesIQVisitor } from "@/lib/salesiq";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

type DealerFields = {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  yearsInBusiness: string;
};

const emptyFields: DealerFields = {
  businessName: "",
  contactPerson: "",
  email: "",
  phone: "",
  city: "",
  yearsInBusiness: "",
};

export function DealerForm() {
  const [sent, setSent] = useState(false);
  const [fields, setFields] = useState<DealerFields>(emptyFields);

  const update =
    (key: keyof DealerFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    identifySalesIQVisitor({
      name: fields.contactPerson,
      email: fields.email,
      phone: fields.phone,
    });
    const url = buildDealerApplicationWhatsAppUrl(fields);
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass flex min-h-80 flex-col items-center justify-center rounded-3xl p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          <CheckCircle2 className="h-14 w-14 text-electric" />
        </motion.div>
        <h3 className="mt-4 font-display text-2xl font-semibold text-white">
          Application received
        </h3>
        <p className="mt-2 max-w-sm text-sm text-white">
          Your details were sent via WhatsApp to our partnerships team. If the
          chat didn&apos;t open, tap below to send again.
        </p>
        <a
          href={buildDealerApplicationWhatsAppUrl(fields)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#2ee872]"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Open WhatsApp again
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="glass rounded-3xl p-8">
      <h3 className="font-display text-2xl font-semibold text-white">
        Apply for a territory
      </h3>
      <p className="mt-2 text-sm text-white">
        Tell us about your business — we&apos;ll open WhatsApp with your
        application pre-filled for our team at{" "}
        <span className="text-[#25D366]">{CONTACT.phone}</span>.
      </p>
      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Business name"
            value={fields.businessName}
            onChange={update("businessName")}
            required
          />
          <Input
            label="Contact person"
            value={fields.contactPerson}
            onChange={update("contactPerson")}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            value={fields.email}
            onChange={update("email")}
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={fields.phone}
            onChange={update("phone")}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="City"
            value={fields.city}
            onChange={update("city")}
            required
          />
          <Input
            label="Years in business"
            value={fields.yearsInBusiness}
            onChange={update("yearsInBusiness")}
          />
        </div>
        <button
          type="submit"
          className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-[#2ee872] sm:w-fit"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Submit via WhatsApp
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-white">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-electric"
      />
    </div>
  );
}
