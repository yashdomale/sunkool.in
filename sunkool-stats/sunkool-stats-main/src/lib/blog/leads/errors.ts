// Supabase/PostgREST reports failures as plain `{ code, details, hint, message }` objects.
// Thrown as they are, Next's error overlay shows them as an unreadable `{code: …, message: …}`,
// so queries throw these instead: a real Error whose message says what went wrong.

export class BlogLeadsError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "BlogLeadsError";
    this.code = code;
  }
}

type SupabaseErrorLike = { code?: unknown; message?: unknown; details?: unknown };

export function toBlogLeadsError(error: unknown): BlogLeadsError {
  if (error instanceof BlogLeadsError) return error;
  const { code, message } = (error ?? {}) as SupabaseErrorLike;
  const text = typeof message === "string" && message ? message : "Unknown database error";
  const codeText = typeof code === "string" && code ? code : undefined;
  return new BlogLeadsError(codeText ? `${text} (${codeText})` : text, codeText);
}

// What Postgres / PostgREST say when the objects from migrations 0006 + 0007 are missing:
//   PGRST205  table not in the schema cache      PGRST202  function not in the schema cache
//   42P01     undefined table                    42883     undefined function
//   42501     permission denied — only 0006 has run: 0006 locks the table, 0007 grants admins access
// (The page is admin-only and non-admins are turned away before any query, so for these queries a
// permission error means the grants are missing, not that someone is snooping.)
const NOT_SET_UP = new Set(["PGRST205", "PGRST202", "42P01", "42883", "42501"]);

/** True when the Blog Leads database migrations have not been (fully) applied to this project yet. */
export function isBlogLeadsNotSetUp(error: unknown): boolean {
  const code = (error as SupabaseErrorLike | null)?.code;
  return typeof code === "string" && NOT_SET_UP.has(code);
}
