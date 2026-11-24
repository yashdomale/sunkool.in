import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const FOCUSABLE = "input, button, [tabindex]:not([tabindex='-1'])";

/**
 * Keys the editor's dialogs share: Esc closes, Tab stays inside the panel,
 * and Ctrl/⌘+K is swallowed so the browser's own shortcut for it (focusing its
 * search bar) can't fire while a dialog has focus. Wire it to the panel's onKeyDown.
 */
export function handleDialogKeys(event: ReactKeyboardEvent<HTMLElement>, panel: HTMLElement | null, onClose: () => void) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    onClose();
    return;
  }
  if (event.key !== "Tab" || !panel) return;

  const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hasAttribute("disabled"));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}
