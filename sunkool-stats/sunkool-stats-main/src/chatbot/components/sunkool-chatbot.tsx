"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Minus, RotateCcw, SendHorizontal, X } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";
import { HTML_LANG } from "@/chatbot/lib/language";
import { messagesFor } from "@/chatbot/lib/messages";
import { panelPlacement } from "@/chatbot/lib/placement";
import { CHAT_TITLE } from "@/chatbot/lib/topics";
import { cn } from "@/lib/utils";
import { useChat } from "@/chatbot/hooks/use-chat";
import { useLauncherDrag, useViewport } from "@/chatbot/hooks/use-launcher-drag";
import { useKeyboardInset } from "@/chatbot/hooks/use-keyboard-inset";
import { EASE_OUT } from "@/lib/motion";
import { TopicButtons, DetailsForm, QuickReplies, Choices, ChoiceButton, Entry, TypingIndicator, MAX_INPUT } from "./chat-parts";

const PANEL_ID = "sunkool-chat-panel";

/**
 * The SUNKOOL Assistant: a round SK button above the WhatsApp button that opens a compact black chat card
 * (about 380 x 500px, a small popup with a margin all round on phones) from the bottom right corner. Positions come from the --fab-* / --chat-* variables in src/chatbot/styles/floating-chat.css. The
 * visitor can drag the button anywhere (hooks/use-launcher-drag.ts); the window then opens beside it.
 * There is no AI behind it: a product button shows that product's information (hooks/use-chat.ts, lib/flow.ts)
 * and the assistant then asks, in the chat, for a name and mobile number, which are filed in Admin >
 * Blog Leads > Chatbot, after which the chat is over (only "Start a new chat" is left). In English the name and
 * number are typed into a small form inside the chat (DetailsForm). It talks like a person messaging: a typing indicator before each message and
 * the messages arriving one by one (the pacing is in hooks/use-chat.ts, the words in lib/conversation.ts). It
 * answers in the language the visitor writes in, and the window's own labels follow it (t below).
 */
export default function SunkoolChatbot() {
  const [open, setOpen] = useState(false);
  const chat = useChat(open);
  const viewport = useViewport();
  // On a phone the keyboard covers the bottom of the page, where the popup sits: it lifts by this much.
  const keyboard = useKeyboardInset();
  // The button's size is --fab-size in floating-chat.css: 4rem from 40rem up, 3.5rem below.
  const size = viewport.w >= 640 ? 64 : 56;
  const drag = useLauncherDrag(size);
  // A moved button puts the window beside it. On phones the window is a full-screen sheet instead.
  const placement = drag.point && viewport.w >= 640 ? panelPlacement(drag.point, size, viewport.w, viewport.h) : null;
  const [draft, setDraft] = useState("");
  // Messages already on screen when the window opens appear as they are; only newer ones animate in.
  const [settled, setSettled] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Whether the list should follow new messages: yes while the visitor is at (or near) the bottom or has
  // just sent something, no once they have scrolled up to read, so a new message never pulls them away.
  const followRef = useRef(true);
  // Our own smooth scroll fires scroll events too; until it ends they must not count as the visitor scrolling.
  const autoScrollUntil = useRef(0);

  const step = chat.capture?.step ?? null;
  const shown = chat.entries.length;
  // The window's labels, in the chat's current language.
  const t = messagesFor(chat.lang).ui;

  // English collects the name and number in a form inside the chat (it has the Submit label); the message
  // box then stays for general questions. Languages without one answer in the message box as before.
  const detailsStep = step === "name" || step === "mobile" ? step : null;
  const inlineForm = detailsStep !== null && t.submit !== undefined;

  // The form (and the "Chat ended" line) is what the visitor has to look at next, so it is always brought
  // into view when it appears, even if they had scrolled up to read. Declared before the scroll below.
  useEffect(() => {
    if ((inlineForm || chat.ended) && !chat.typing) followRef.current = true;
  }, [inlineForm, chat.ended, chat.typing]);

  // Keep the newest message (or the typing dots) in view.
  useEffect(() => {
    const list = listRef.current;
    if (!open || !list || !followRef.current) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    autoScrollUntil.current = performance.now() + (still ? 50 : 700);
    list.scrollTo({ top: list.scrollHeight, behavior: still ? "auto" : "smooth" });
  }, [open, shown, chat.typing, step, chat.ended, keyboard]);

  // Not on a phone: the keyboard would open the moment the chat does and cover the product buttons.
  useEffect(() => {
    if (open && viewport.w >= 640) inputRef.current?.focus({ preventScroll: true });
  }, [open, viewport.w]);

  function close() {
    setOpen(false);
    launcherRef.current?.focus({ preventScroll: true });
  }

  function submit(text: string) {
    if (!text.trim() || chat.busy) return;
    setDraft("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    followRef.current = true;
    chat.send(text);
  }

  // A chip is a typed answer in one tap. On a computer the cursor goes to the box for what comes next.
  function pick(label: string) {
    followRef.current = true;
    chat.send(label, true);
    if (viewport.w >= 640) inputRef.current?.focus({ preventScroll: true });
  }

  function chooseTopic(topic: Parameters<typeof chat.choose>[0]) {
    followRef.current = true;
    chat.choose(topic);
  }

  // Where the card goes when the visitor has moved the button; --chat-kb is the keyboard's height on a phone.
  const cardStyle: React.CSSProperties & Record<"--chat-kb", string> = {
    ...(placement
      ? { left: placement.left, top: placement.top, width: placement.width, height: placement.height, right: "auto", bottom: "auto", transformOrigin: placement.origin }
      : { transformOrigin: "bottom right" }),
    "--chat-kb": `${keyboard}px`,
  };

  const placeholder = inlineForm
    ? t.placeholder.general
    : step === "name"
      ? t.placeholder.name
      : step === "mobile"
        ? t.placeholder.mobile
        : t.placeholder.general;

  return (
    <MotionConfig reducedMotion="user">
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => {
          if (drag.ignoreClick()) return; // that click was the end of a drag
          if (open) close();
          else {
            setSettled(shown);
            followRef.current = true;
            setOpen(true);
          }
        }}
        {...drag.handlers}
        style={drag.point ? { left: drag.point.left, top: drag.point.top, right: "auto", bottom: "auto" } : undefined}
        title="Chat with us. Drag to move, double-click to put it back."
        aria-label={open ? "Minimise the SUNKOOL Assistant" : "Chat with the SUNKOOL Assistant"}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5, ease: EASE_OUT }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        // Same size and right edge as the WhatsApp button, so the two are centred on one line.
        className="fixed bottom-[var(--chat-launcher-bottom)] right-[var(--fab-right)] z-50 grid h-[var(--fab-size)] w-[var(--fab-size)] cursor-grab touch-none select-none place-items-center rounded-full active:cursor-grabbing bg-black p-[3px] text-white shadow-[0_0_0_1px_rgba(88,167,232,0.3),0_10px_28px_-8px_rgba(244,117,33,0.5),0_6px_22px_-6px_rgba(88,167,232,0.55)] transition-shadow hover:shadow-[0_0_0_1px_rgba(125,211,255,0.5),0_14px_34px_-8px_rgba(244,117,33,0.62),0_8px_28px_-6px_rgba(88,167,232,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          // Not draggable and not a pointer target: dragging a logo image makes the browser start its own
          // image drag, which cancels ours halfway (the button would stop after the first movement).
          <Image src="/sk-icon.png" alt="" width={96} height={96} draggable={false} className="pointer-events-none h-full w-full rounded-full select-none" priority={false} />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.section
            id={PANEL_ID}
            role="dialog"
            aria-label={CHAT_TITLE}
            lang={HTML_LANG[chat.lang]}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            style={cardStyle}
            onKeyDown={(event) => {
              if (event.key === "Escape") close();
            }}
            // Always a compact card, never full screen, so the page stays visible around it. Phones: up to
            // 380 x 500px with a 0.75rem margin in the bottom right corner, lifted above the keyboard by
            // --chat-kb. From 40rem up: the same card at the bottom right (size in floating-chat.css), over
            // the two buttons while it is open. A button the visitor has moved gets a card beside it (placement).
            className="fixed bottom-[calc(0.75rem_+_var(--chat-kb,0px))] right-3 z-50 flex h-[min(500px,calc(100dvh_-_1.5rem_-_var(--chat-kb,0px)))] w-[min(380px,calc(100vw_-_1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-carbon text-silver-soft shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(88,167,232,0.1),0_0_44px_-20px_rgba(244,117,33,0.45)] [color-scheme:dark] sm:bottom-[var(--chat-window-bottom)] sm:right-[var(--fab-right)] sm:h-[var(--chat-window-height)] sm:w-[var(--chat-window-width)]"
          >
            {/* Three controls plus the avatar must still leave room for the whole subtitle, even on a phone. */}
            <header className="flex shrink-0 items-center gap-2 bg-black px-3.5 py-3 text-white">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black shadow-[0_0_16px_-4px_rgba(244,117,33,0.65)] ring-1 ring-sun/60">
                <Image src="/sk-icon.png" alt="" width={80} height={80} className="h-full w-full rounded-full p-[2px]" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[15px] font-semibold leading-tight">{CHAT_TITLE}</h2>
                <p className={cn("truncate text-xs transition-colors", chat.typing ? "text-sun" : "text-fog")}>{chat.typing ? t.typing : t.subtitle}</p>
              </div>
              {/* Close together, so the whole subtitle still fits beside them. */}
              <div className="flex shrink-0 items-center">
                {chat.started && (
                  <button
                    type="button"
                    onClick={chat.reset}
                    aria-label={t.newChat}
                    title={t.newChat}
                    className="grid h-7 w-7 place-items-center rounded-full text-fog transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-electric"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.minimise}
                  title={t.minimise}
                  className="grid h-7 w-7 place-items-center rounded-full text-fog transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-electric"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.close}
                  title={t.close}
                  className="grid h-7 w-7 place-items-center rounded-full text-fog transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-electric"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </header>
            {/* A thin brand line (orange into blue) between the header and the conversation. */}
            <div className="h-px shrink-0 bg-gradient-to-r from-sun/80 via-electric/60 to-transparent" aria-hidden="true" />

            <div
              ref={listRef}
              aria-live="polite"
              onScroll={(event) => {
                if (performance.now() < autoScrollUntil.current) return;
                const list = event.currentTarget;
                followRef.current = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
              }}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-carbon px-4 py-4 [scrollbar-color:#2a2f36_transparent] [scrollbar-width:thin]"
            >
              {chat.entries.map((entry, index) => (
                <Entry
                  key={entry.id}
                  entry={entry}
                  // The sender's name goes above the first message of each run of assistant messages.
                  labelled={entry.role === "assistant" && chat.entries[index - 1]?.role !== "assistant"}
                  animate={index >= settled}
                />
              ))}

              {chat.typing && <TypingIndicator labelled={chat.entries[chat.entries.length - 1]?.role !== "assistant"} />}

              {/* The buttons wait until the assistant has finished its message, like a person who has stopped typing. */}
              {!chat.typing &&
                (chat.ended ? (
                  t.chatEnded ? (
                    // A line, not a button: starting over is the arrow at the top of the window.
                    <div role="status" className="flex items-center gap-3 pt-2 text-xs font-medium uppercase tracking-wider text-fog">
                      <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                      {t.chatEnded}
                      <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                    </div>
                  ) : (
                    <Choices>
                      <ChoiceButton onClick={chat.reset}>{t.newChat}</ChoiceButton>
                    </Choices>
                  )
                ) : step === "consent" ? (
                  <QuickReplies labels={[t.yes, t.notNow]} onPick={pick} />
                ) : step ? (
                  <>
                    {inlineForm && detailsStep && t.submit && (
                      <DetailsForm
                        key={detailsStep}
                        step={detailsStep}
                        placeholder={detailsStep === "name" ? t.placeholder.name : t.placeholder.mobile}
                        submitLabel={t.submit}
                        focusOnShow={viewport.w >= 640}
                        onSubmit={(value) => {
                          followRef.current = true;
                          chat.send(value);
                        }}
                      />
                    )}
                    <QuickReplies labels={[t.notNow]} onPick={pick} />
                  </>
                ) : (
                  <TopicButtons onChoose={chooseTopic} caption={chat.started ? t.exploreAnother : undefined} />
                ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit(draft);
              }}
              className="shrink-0 border-t border-white/10 bg-carbon px-3 pb-[max(0.375rem,env(safe-area-inset-bottom))] pt-3"
            >
              {/* Once the request is filed the chat is over, so there is nothing left to type into. */}
              {!chat.ended && (
                <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-carbon-2 py-1.5 pl-3.5 pr-1.5 transition-colors focus-within:border-electric">
                  <label htmlFor="sunkool-chat-input" className="sr-only">
                    {t.yourMessage}
                  </label>
                  <textarea
                    id="sunkool-chat-input"
                    ref={inputRef}
                    rows={1}
                    value={draft}
                    maxLength={MAX_INPUT}
                    placeholder={chat.typing ? t.thinking : placeholder}
                    inputMode={step === "mobile" ? "tel" : "text"}
                    autoComplete={step === "name" ? "name" : step === "mobile" ? "tel" : "off"}
                    onChange={(event) => {
                      setDraft(event.target.value);
                      event.target.style.height = "auto";
                      event.target.style.height = `${event.target.scrollHeight}px`;
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                        event.preventDefault();
                        submit(draft);
                      }
                    }}
                    // 16px on phones: iOS Safari zooms the page into any field set smaller than that.
                    className="max-h-28 min-h-7 flex-1 resize-none self-center bg-transparent py-1 text-[16px] leading-snug text-white outline-none placeholder:text-fog/70 sm:text-[14px]"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || chat.busy}
                    aria-label={t.send}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#ff8a3d] to-sun text-white shadow-[0_6px_16px_-6px_rgba(244,117,33,0.75)] transition hover:brightness-110 disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 disabled:shadow-none"
                  >
                    <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
              <p className="px-2 pb-1 pt-1.5 text-center text-[11px] leading-snug text-fog">
                {t.footer.before}
                <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="text-silver-soft underline underline-offset-2 hover:text-white">
                  {t.footer.link}
                </a>
                {t.footer.after}
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
