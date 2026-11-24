"use client";

// The small pieces the SUNKOOL Assistant window is built from: topic buttons, the details form,
// reply choices, message bubbles and the typing indicator.
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { linkify } from "@/chatbot/lib/linkify";
import { CHAT_TITLE, CHAT_TOPICS } from "@/chatbot/lib/topics";
import { cn } from "@/lib/utils";
import { MobileIcon, NameIcon } from "./details-icons";
import { type ChatEntry } from "@/chatbot/hooks/use-chat";
import { EASE_OUT } from "@/lib/motion";

/** The product buttons: the first thing offered, and again after each answer so another can be explored. */
export function TopicButtons({ onChoose, caption }: { onChoose: (topic: (typeof CHAT_TOPICS)[number]) => void; caption?: string }) {
  return (
    <Choices caption={caption}>
      {CHAT_TOPICS.map((topic) => (
        <ChoiceButton key={topic.id} onClick={() => onChoose(topic)}>
          {topic.label}
        </ChoiceButton>
      ))}
    </Choices>
  );
}

/**
 * The name / number form inside the chat: a card under the assistant's question with the field and a Submit
 * button. Submitting is the same as typing the answer in the message box, so the same checks run and a bad
 * answer is asked for again. It is keyed by step, so each step starts with an empty field.
 */
export function DetailsForm({
  step,
  placeholder,
  submitLabel,
  focusOnShow,
  onSubmit,
}: {
  step: "name" | "mobile";
  placeholder: string;
  submitLabel: string;
  focusOnShow: boolean;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Not on a phone: the keyboard would cover the question the form belongs to.
  useEffect(() => {
    if (focusOnShow) inputRef.current?.focus({ preventScroll: true });
  }, [focusOnShow]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      onSubmit={(event) => {
        event.preventDefault();
        const said = value.trim();
        if (!said) return;
        setValue("");
        onSubmit(said);
      }}
      className="mb-3 w-[88%] rounded-2xl rounded-bl-md border border-white/10 bg-carbon-3 p-4"
    >
      <label htmlFor={`sunkool-chat-${step}`} className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        <input
          id={`sunkool-chat-${step}`}
          ref={inputRef}
          type={step === "mobile" ? "tel" : "text"}
          inputMode={step === "mobile" ? "tel" : "text"}
          autoComplete={step === "mobile" ? "tel" : "name"}
          value={value}
          maxLength={MAX_INPUT}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          // 16px on phones: iOS Safari zooms the page into any field set smaller than that.
          className="peer w-full rounded-xl border border-white/10 bg-black/60 py-3 pl-11 pr-1.5 text-[16px] text-white outline-none transition-colors placeholder:text-fog/70 focus:border-electric sm:text-[14px]"
        />
        {/* A person for the name, a telephone for the number; it turns orange while the field is in use. */}
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-silver-soft transition-colors peer-focus:text-sun">
          {step === "name" ? <NameIcon className="h-6 w-6" /> : <MobileIcon className="h-6 w-6" />}
        </span>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={!value.trim()}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff8a3d] to-sun px-5 py-2 text-[14px] font-semibold text-black shadow-[0_8px_20px_-8px_rgba(244,117,33,0.8)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 disabled:shadow-none sm:min-h-0"
        >
          {submitLabel}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </motion.form>
  );
}

/** Short answers to the assistant's question ("Yes, please" / "Not now"): the same as typing them. */
export function QuickReplies({ labels, onPick }: { labels: readonly string[]; onPick: (label: string) => void }) {
  return (
    <Choices>
      {labels.map((label) => (
        <ChoiceButton key={label} onClick={() => onPick(label)}>
          {label}
        </ChoiceButton>
      ))}
    </Choices>
  );
}

/** Longest message a visitor can type. */
export const MAX_INPUT = 500;

export function Choices({ caption, children }: { caption?: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="pt-1">
      {caption && <p className="mb-1.5 text-right text-xs text-fog">{caption}</p>}
      <div className="flex flex-wrap justify-end gap-2">{children}</div>
    </motion.div>
  );
}

export function ChoiceButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[14px] text-silver-soft transition-colors hover:border-sun hover:bg-sun/10 hover:text-white focus-visible:outline-2 focus-visible:outline-electric sm:min-h-0"
    >
      {children}
    </button>
  );
}

export const clock = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

/** One message, popping in from the side it was sent from, with the sender's name above the first of a run. */
export function Entry({ entry, labelled, animate }: { entry: ChatEntry; labelled: boolean; animate: boolean }) {
  const assistant = entry.role === "assistant";
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      style={{ transformOrigin: assistant ? "left bottom" : "right bottom" }}
    >
      {labelled && <p className="mb-1 text-xs text-fog">{CHAT_TITLE}</p>}
      <Bubble role={entry.role}>
        {entry.title && <p className="mb-0.5 font-semibold text-white">{entry.title}</p>}
        {assistant ? <LinkedText text={entry.text} /> : entry.text}
        {entry.at !== undefined && (
          <span className={cn("float-right ml-3 mt-2 text-[11px] leading-none", assistant ? "text-white/40" : "text-white/70")}>{clock.format(entry.at)}</span>
        )}
      </Bubble>
    </motion.div>
  );
}

/** The three dots shown while the assistant is "typing": each rises and brightens in turn. */
export function TypingIndicator({ labelled }: { labelled: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} aria-hidden="true">
      {labelled && <p className="mb-1 text-xs text-fog">{CHAT_TITLE}</p>}
      <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.06] bg-carbon-3 px-4 py-[17px]">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-sun"
            animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: dot * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "w-fit max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed",
        role === "user"
          ? "ml-auto rounded-br-md bg-gradient-to-br from-[#2b78bd] to-[#245f94] text-white shadow-[0_6px_18px_-10px_rgba(47,110,168,0.9)]"
          : "rounded-bl-md border border-white/[0.06] bg-carbon-3 text-silver-soft"
      )}
    >
      {children}
    </div>
  );
}

/** Reply text with the links to our own sites and WhatsApp made clickable; everything else stays text. */
export function LinkedText({ text }: { text: string }) {
  return (
    <>
      {linkify(text).map((segment, index) =>
        segment.type === "link" ? (
          <a key={index} href={segment.href} target="_blank" rel="noopener noreferrer" className="text-glow underline underline-offset-2 hover:text-white">
            {segment.text}
          </a>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
}
