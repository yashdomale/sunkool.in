"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { choose as chooseTopic, respond, submitFailed, submitted, type Capture, type LeadDraft, type Turn } from "@/chatbot/lib/conversation";
import { typingDelayMs } from "@/chatbot/lib/flow";
import { DEFAULT_LANG, isLang, type Lang } from "@/chatbot/lib/language";
import { CHAT_GREETING, findTopicById, type ChatTopic } from "@/chatbot/lib/topics";
import { submitChatLeadAction } from "@/chatbot/leads/actions";

/** `title` is the bold first line of a product's information (its name); `at` is when it appeared (ms). */
export type ChatEntry = { id: string; role: "user" | "assistant"; text: string; title?: string; at?: number };

type Saved = {
  /** Everything said so far and everything about to be said, in order. */
  entries: ChatEntry[];
  /** How many of the entries the visitor can see. The assistant's messages are revealed one at a time. */
  seen: number;
  /** One random id per chat. With the product it is the lead's duplicate key (see lead.ts). */
  sessionId: string;
  /** The request for a product that is being put together ((consent,) then name, then number); null when none is open. */
  capture: Capture | null;
  /** Products this chat has already filed a lead for. */
  sent: string[];
  /** The language the assistant answers in. It follows the visitor: it changes when they write in another one. */
  lang: Lang;
  /** True once the visitor's details have been filed: the conversation is over until a new chat is started. */
  ended: boolean;
};

// v3: the greeting is now part of the conversation and the request is gathered in the chat (v2 kept
// a form open instead); an old shape must not be read back as this one.
const STORAGE_KEY = "sunkool-chat-v3";

const STEPS = ["consent", "name", "mobile"] as const;

function newId(): string {
  return crypto.randomUUID();
}

/** A new chat: just the greeting, which is revealed message by message once the window is open. */
function fresh(): Saved {
  return {
    entries: CHAT_GREETING.map((text, i) => ({ id: `m${i}`, role: "assistant" as const, text })),
    seen: 0,
    sessionId: newId(),
    capture: null,
    sent: [],
    lang: DEFAULT_LANG,
    ended: false,
  };
}

function readCapture(value: unknown): Capture | null {
  if (!value || typeof value !== "object") return null;
  const { topicId, step, name } = value as Partial<Capture>;
  const topic = findTopicById(topicId);
  if (!topic || !STEPS.includes(step as Capture["step"])) return null;
  // The number step needs the name it was given with; without it, ask for the name again.
  if (step === "mobile" && typeof name !== "string") return { topicId: topic.id, step: "name" };
  return { topicId: topic.id, step: step as Capture["step"], ...(typeof name === "string" ? { name } : {}) };
}

/** Reads the conversation kept for this browser tab, so a page reload does not lose it. */
function load(): Saved {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh();
    const saved = JSON.parse(raw) as Partial<Saved>;
    if (!Array.isArray(saved.entries) || typeof saved.sessionId !== "string") return fresh();
    // Re-numbered, so the ids stay unique even if some entries were damaged and dropped.
    const entries = saved.entries
      .filter((e): e is ChatEntry => Boolean(e) && typeof e.text === "string" && (e.role === "user" || e.role === "assistant"))
      .map((e, i) => ({
        id: `m${i}`,
        role: e.role,
        text: e.text,
        ...(typeof e.title === "string" ? { title: e.title } : {}),
        ...(typeof e.at === "number" ? { at: e.at } : {}),
      }));
    return {
      entries,
      seen: typeof saved.seen === "number" ? Math.min(entries.length, Math.max(0, Math.floor(saved.seen))) : entries.length,
      sessionId: saved.sessionId,
      capture: readCapture(saved.capture),
      sent: Array.isArray(saved.sent) ? saved.sent.filter((id): id is string => typeof id === "string") : [],
      lang: isLang(saved.lang) ? saved.lang : DEFAULT_LANG,
      ended: saved.ended === true,
    };
  } catch {
    return fresh();
  }
}

/** Appends messages to the conversation. Ids come from the position, so this stays a pure update. */
function append(s: Saved, messages: Omit<ChatEntry, "id">[]): ChatEntry[] {
  return [...s.entries, ...messages.map((m, i) => ({ id: `m${s.entries.length + i}`, ...m }))];
}

/**
 * Adds a turn to the conversation. When the visitor said something, their message shows at once, and
 * anything the assistant had still to "type" is shown with it rather than left waiting behind it.
 * The assistant's replies are queued and revealed one by one by the effect in `useChat`, which stamps
 * each with the time it appears. `now` is passed in so this stays a pure update.
 */
function apply(s: Saved, said: string | null, turn: Turn, now: number): Saved {
  const base: Saved =
    said === null ? s : { ...s, entries: append(s, [{ role: "user", text: said, at: now }]), seen: s.entries.length + 1 };
  return {
    ...base,
    capture: turn.capture,
    lang: turn.lang,
    ended: base.ended || turn.ended === true,
    entries: append(base, turn.replies.map((message) => ({ role: "assistant" as const, ...message }))),
  };
}

/**
 * The chat's state. There is no server round trip for the conversation and no AI: a product button or a
 * typed word shows the product's information, then the assistant asks, message by message, whether the
 * team may get in touch (English goes straight to asking) and for a name and a mobile number
 * (lib/conversation.ts). Only the final details go to the leads table, through the server action in
 * actions.ts, and once they are filed the chat is over (`ended`) until a new one is started.
 *
 * `active` is whether the window is open: the assistant only "types" while somebody is looking, so the
 * greeting plays when the chat is first opened, not in the background. The widget is only ever rendered
 * in the browser (it is loaded with ssr: false), so reading sessionStorage while setting up state is safe.
 */
export function useChat(active: boolean) {
  const [saved, setSaved] = useState<Saved>(load);
  const [filing, startTransition] = useTransition();
  // A second message can arrive before React has re-rendered; this closes that gap while a request is filed.
  const filingNow = useRef(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Storage can be blocked (private windows); the chat still works, it just is not remembered.
    }
  }, [saved]);

  // Reveal the assistant's messages one at a time: the dots show for a moment, then the next message appears.
  const { seen } = saved;
  const next: ChatEntry | undefined = saved.entries[seen];
  useEffect(() => {
    if (!active || !next) return;
    const quick = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait = next.role === "user" ? 0 : quick ? 250 : typingDelayMs(next.text);
    const timer = window.setTimeout(() => {
      const at = Date.now();
      // The message gets its time stamp now, when it appears, not when it was queued.
      setSaved((s) =>
        s.seen === seen
          ? { ...s, seen: seen + 1, entries: s.entries.map((entry, i) => (i === seen && entry.at === undefined ? { ...entry, at } : entry)) }
          : s
      );
    }, wait);
    return () => window.clearTimeout(timer);
  }, [active, next, seen]);

  /** Files the request, then carries on the conversation with what came back. */
  const file = useCallback(
    (draft: LeadDraft, capture: Capture, sessionId: string, lang: Lang) => {
      filingNow.current = true;
      startTransition(async () => {
        let turn: Turn;
        try {
          const result = await submitChatLeadAction({
            name: draft.name,
            mobile: draft.mobile,
            website: "", // the honeypot field of the old form: real visitors always leave it empty
            topic: draft.topic.label,
            sessionId,
          });
          turn = result.success ? submitted(draft.topic, result.name, lang) : submitFailed(capture, result, lang);
        } catch {
          turn = submitFailed(capture, { error: "We couldn't send that just now. Please try again." }, lang);
        }
        const done = turn.capture === null;
        const now = Date.now();
        setSaved((s) => ({ ...apply(s, null, turn, now), sent: done && !s.sent.includes(draft.topic.id) ? [...s.sent, draft.topic.id] : s.sent }));
        filingNow.current = false;
      });
    },
    [startTransition]
  );

  /** Shows the visitor's message, then the assistant's replies, and files the request if it is complete. */
  const take = useCallback(
    (said: string, turn: Turn) => {
      const now = Date.now();
      setSaved((s) => apply(s, said, turn, now));
      if (turn.submit && turn.capture) file(turn.submit, turn.capture, saved.sessionId, turn.lang);
    },
    [file, saved.sessionId]
  );

  /** A product button was pressed. */
  const choose = useCallback(
    (topic: ChatTopic) => {
      if (!filingNow.current && !saved.ended) take(topic.label, chooseTopic(topic, saved.sent, saved.lang));
    },
    [take, saved.sent, saved.lang, saved.ended]
  );

  /**
   * Something was typed in the message box, or a quick-reply chip was pressed (`chip`: its label is already
   * in the chat's language, so it must not change it).
   */
  const send = useCallback(
    (text: string, chip = false) => {
      const said = text.trim();
      if (!said || filingNow.current || saved.ended) return;
      take(said, respond(saved.capture, said, saved.sent, saved.lang, chip));
    },
    [take, saved.capture, saved.sent, saved.lang, saved.ended]
  );

  const reset = useCallback(() => {
    if (!filingNow.current) setSaved(fresh());
  }, []);

  return {
    entries: saved.entries.slice(0, saved.seen),
    /** True while the assistant is "typing" its next message (or while a request is being filed). */
    typing: next !== undefined || filing,
    /** True while a request is being filed: messages are not taken until it is done. */
    busy: filing,
    /** True once the visitor has said something, i.e. this is more than the greeting. */
    started: saved.entries.some((entry) => entry.role === "user"),
    capture: saved.capture,
    lang: saved.lang,
    /** True once the request is filed: the window shows only "Start a new chat". */
    ended: saved.ended,
    choose,
    send,
    reset,
  };
}
