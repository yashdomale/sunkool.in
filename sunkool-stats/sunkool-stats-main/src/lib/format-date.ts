// Every date and time the site shows, in India time. Pages render on Vercel in UTC, and client
// components re-render in the visitor's zone, so without a fixed zone a post published after
// 18:30 UTC showed the previous day (and the server and browser could disagree).

const TIME_ZONE = "Asia/Kolkata";
const inIndia = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", { ...options, timeZone: TIME_ZONE });

const shortDate = inIndia({ day: "numeric", month: "short", year: "numeric" });
const longDate = inIndia({ day: "numeric", month: "long", year: "numeric" });
const monthYear = inIndia({ month: "short", year: "numeric" });
const time = inIndia({ hour: "numeric", minute: "2-digit", hour12: true });

type DateInput = string | number | Date;
const toDate = (value: DateInput) => (value instanceof Date ? value : new Date(value));

/** "14 Oct 2026" */
export function formatShortDate(value: DateInput): string {
  return shortDate.format(toDate(value));
}

/** "14 October 2026" */
export function formatLongDate(value: DateInput): string {
  return longDate.format(toDate(value));
}

/** "Oct 2026" */
export function formatMonthYear(value: DateInput): string {
  return monthYear.format(toDate(value));
}

/** "5:05 pm" */
export function formatTime(value: DateInput): string {
  return time.format(toDate(value)).replace(/\s?([ap]m)$/i, " $1").toLowerCase();
}
