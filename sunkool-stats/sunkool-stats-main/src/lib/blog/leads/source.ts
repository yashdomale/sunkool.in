/** Where an enquiry came from: the form under a blog post, or the SUNKOOL Assistant chatbot. */
export const BLOG_LEAD_SOURCES = [
  { value: "blog", label: "Blog form" },
  { value: "chatbot", label: "Chatbot" },
] as const;

export type BlogLeadSource = (typeof BLOG_LEAD_SOURCES)[number]["value"];

/** What the Blog Data page shows when `?source=` is missing or unrecognised. */
export const DEFAULT_BLOG_LEAD_SOURCE: BlogLeadSource = "blog";

export function isBlogLeadSource(value: unknown): value is BlogLeadSource {
  return BLOG_LEAD_SOURCES.some((source) => source.value === value);
}

/** `?source=` from the URL; anything unrecognised means the blog form, which is what the page showed before sources existed. */
export function parseSourceFilter(value: string | string[] | undefined): BlogLeadSource {
  const text = Array.isArray(value) ? value[0] : value;
  return isBlogLeadSource(text) ? text : DEFAULT_BLOG_LEAD_SOURCE;
}

/** blog_leads.lead_source (migration 0010) as a source; a row from before the column existed is a blog enquiry. */
export function toLeadSource(dbSource: string | null | undefined): BlogLeadSource {
  return isBlogLeadSource(dbSource) ? dbSource : DEFAULT_BLOG_LEAD_SOURCE;
}
