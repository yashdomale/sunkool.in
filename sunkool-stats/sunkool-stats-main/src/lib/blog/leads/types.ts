import type { BlogLeadSource } from "./source";
import type { LeadStatus } from "./status";

/** One enquiry — from the form under a blog post or from the chatbot — with the fields the admin "Blog Data" page shows. */
export type BlogLead = {
  id: string;
  /** Where it came from; an enquiry saved before sources existed is a blog one. */
  source: BlogLeadSource;
  name: string;
  /** E.164, e.g. "+919876543210". */
  mobile: string;
  /** Null for a chatbot lead: the chat never asks for one. */
  city: string | null;
  productName: string;
  productCategory: string | null;
  /** What the visitor wrote in the optional message box; null when they left it empty. */
  message: string | null;
  /** The post the visitor was reading. Snapshotted, so it stays meaningful if the post is renamed or deleted. Null for a chatbot lead. */
  blogTitle: string | null;
  blogUrl: string | null;
  status: LeadStatus;
  createdAt: string;
};

export type PaginatedBlogLeads = {
  leads: BlogLead[];
  /** Entries matching the status filter — what the pagination counts, not every enquiry. */
  total: number;
  page: number;
  pageSize: number;
};

/** Every enquiry, split by status — independent of the page's filter. */
export type BlogLeadCounts = {
  total: number;
  pending: number;
  completed: number;
};

export const BLOG_LEAD_PAGE_SIZE = 25;
