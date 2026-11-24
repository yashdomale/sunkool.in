// The quick-reply buttons under the chatbot's welcome message. Shared by the widget (client), the
// scripted replies (flow.ts) and the lead form, so a lead is filed under the product the visitor
// actually picked. No server-only imports.

export const CHAT_TOPICS = [
  { id: "heat-control-glazing", label: "Heat Control Glazing" },
  { id: "ultra-edge", label: "Ultra Edge" },
  { id: "paint-protection-film", label: "Paint Protection Film" },
  { id: "interior-ppf", label: "Interior PPF" },
  { id: "warranty-support", label: "Warranty / Support" },
] as const;

export type ChatTopic = (typeof CHAT_TOPICS)[number];

/** The label used when a lead does not come from one of the buttons. */
export const GENERAL_TOPIC_LABEL = "General enquiry";

/** What the assistant says, one message at a time, whenever a chat opens. */
export const CHAT_GREETING = [
  "Hi! 👋 Welcome to SUNKOOL.",
  "How can I help you today? Pick a topic below, or just type your question.",
] as const;
export const CHAT_TITLE = "SUNKOOL Assistant";
export const CHAT_SUBTITLE = "Your Premium Protection Advisor";

export function findTopicByLabel(label: unknown): ChatTopic | null {
  return CHAT_TOPICS.find((topic) => topic.label === label) ?? null;
}

export function findTopicById(id: unknown): ChatTopic | null {
  return CHAT_TOPICS.find((topic) => topic.id === id) ?? null;
}
