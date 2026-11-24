/** What the admin sees and sets: an enquiry is still waiting for a follow-up, or it has been dealt with. */
export type LeadStatus = "pending" | "completed";
/** The Blog Data page's filter: one status, or every enquiry. */
export type LeadStatusFilter = LeadStatus | "all";

export const LEAD_STATUSES: readonly LeadStatus[] = ["pending", "completed"];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = { pending: "Pending", completed: "Completed" };

// blog_leads.status is the blog_lead_status enum from migration 0006: new / contacted / converted /
// closed. The page only offers two states, so they map onto it without a new migration: setting
// Pending writes `new`, setting Completed writes `closed`. Reading is wider, so a row that was moved
// to one of the other values by hand (SQL editor) still lands in exactly one of the two groups.
const WRITE: Record<LeadStatus, string> = { pending: "new", completed: "closed" };
const READ: Record<LeadStatus, readonly string[]> = { pending: ["new", "contacted"], completed: ["converted", "closed"] };

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (LEAD_STATUSES as readonly string[]).includes(value);
}

/** The enum value saved when the admin picks `status`. */
export function dbStatusToWrite(status: LeadStatus): string {
  return WRITE[status];
}

/** Every enum value that counts as `status` when listing and counting. */
export function dbStatusesFor(status: LeadStatus): readonly string[] {
  return READ[status];
}

export function toLeadStatus(dbStatus: string): LeadStatus {
  return READ.completed.includes(dbStatus) ? "completed" : "pending";
}

/** `?status=` from the URL; anything unrecognised means "show everything". */
export function parseStatusFilter(value: string | string[] | undefined): LeadStatusFilter {
  const text = Array.isArray(value) ? value[0] : value;
  return isLeadStatus(text) ? text : "all";
}
