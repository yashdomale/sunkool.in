import { UUID_PATTERN } from "@/lib/leads/validation";
import { formatShortDate, formatTime } from "@/lib/format-date";
import Link from "next/link";
import { ChevronDown, CircleCheck, Copy, Ellipsis, Eye, EyeOff, FileText, Megaphone, Pencil, PencilLine, Plus, Search, Send, Trash2 } from "lucide-react";
import { getAdminPosts, getAllCategories, getDashboardStats } from "@/lib/blog/queries";
import { StatusBadge } from "@/components/admin/badge";
import { PageHeader, Panel, StatCard, Thumb, ghostButtonClass, iconButtonClass, primaryButtonClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { ADMIN_POST_SORTS, type AdminPostSort, type PostStatus } from "@/lib/blog/types";
import { deletePost, duplicatePost, setPostStatus } from "./actions";

// Server-rendered end to end: no client components on this page. Filters are a
// plain GET form, and every row action is a <form> bound to the existing server
// actions, so it works before (or without) any JavaScript and always shows live data.

const numberFormat = new Intl.NumberFormat("en-IN");
const compactFormat = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });

const editButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-electric/45! bg-electric/[0.16] px-3.5 py-1.5 text-xs font-semibold text-glow transition-colors hover:bg-electric/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric";
const menuItemClass =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-fog transition-colors hover:bg-electric/10 hover:text-white focus-visible:bg-electric/10 focus-visible:text-white focus-visible:outline-none";
const fieldClass =
  "w-full appearance-none rounded-full border border-electric/20! bg-black/40 py-2.5 text-sm text-white outline-none transition-colors [color-scheme:dark] focus:border-electric! focus:ring-1 focus:ring-electric/30";

async function duplicate(id: string) {
  "use server";
  const result = await duplicatePost(id);
  if (!result.success) throw new Error(result.error);
}

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string; category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const status: PostStatus | "all" = params.status === "published" || params.status === "draft" ? params.status : "all";
  const requestedPage = Math.max(1, Math.floor(Number(params.page)) || 1);
  const q = params.q?.trim() || undefined;
  // Anything malformed is dropped: an invalid uuid or enum value would make the query itself error.
  const category = params.category && UUID_PATTERN.test(params.category) ? params.category : undefined;
  const sort: AdminPostSort = ADMIN_POST_SORTS.find((option) => option.value === params.sort)?.value ?? "updated";

  const [{ posts, total, page, pageSize }, stats, categories] = await Promise.all([
    getAdminPosts({ page: requestedPage, status, q, category, sort }),
    getDashboardStats(),
    getAllCategories(),
  ]);
  const totalPosts = stats.publishedCount + stats.draftCount;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const narrowed = Boolean(q) || Boolean(category) || sort !== "updated";
  const filtered = narrowed || status !== "all";

  function href(next: { status?: PostStatus | "all"; page?: number }) {
    const query = new URLSearchParams();
    const nextStatus = next.status ?? status;
    if (nextStatus !== "all") query.set("status", nextStatus);
    if (q) query.set("q", q);
    if (category) query.set("category", category);
    if (sort !== "updated") query.set("sort", sort);
    if (next.page && next.page > 1) query.set("page", String(next.page));
    const search = query.toString();
    return search ? `/admin/blogs?${search}` : "/admin/blogs";
  }

  const pills = [
    { value: "all" as const, label: "All", count: totalPosts },
    { value: "published" as const, label: "Published", count: stats.publishedCount },
    { value: "draft" as const, label: "Drafts", count: stats.draftCount },
  ];
  const firstShown = (page - 1) * pageSize + 1;

  return (
    <div>
      <PageHeader
        title="Posts"
        description="Manage, publish and organize your content."
        actions={
          <>
            <Link href="/admin/updates" className={ghostButtonClass}>
              <Megaphone className="h-4 w-4" />
              Updates
            </Link>
            <Link href="/admin/blogs/new" className={primaryButtonClass}>
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} label="Total posts" value={numberFormat.format(totalPosts)} />
        <StatCard icon={CircleCheck} tone="indigo" label="Published" value={numberFormat.format(stats.publishedCount)} />
        <StatCard icon={PencilLine} tone="amber" label="Drafts" value={numberFormat.format(stats.draftCount)} />
        <StatCard icon={Eye} tone="teal" label="Total views" value={compactFormat.format(stats.totalViews)} />
      </div>

      <div className="mb-5 flex flex-col gap-4 min-[1400px]:flex-row min-[1400px]:items-center min-[1400px]:justify-between">
        <nav
          aria-label="Filter by status"
          className="flex w-fit max-w-full shrink-0 gap-1 overflow-x-auto rounded-full border border-electric/20! bg-electric/[0.04] p-1"
        >
          {pills.map((pill) => {
            const active = status === pill.value;
            return (
              <Link
                key={pill.value}
                href={href({ status: pill.value })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-electric",
                  active
                    ? "bg-electric/15 font-medium text-electric shadow-[inset_0_0_0_1px_rgba(88,167,232,0.3)]"
                    : "text-fog hover:text-white"
                )}
              >
                {pill.label}
                <span className={cn("text-xs tabular-nums", active ? "text-electric/80" : "text-fog/60")}>{pill.count}</span>
              </Link>
            );
          })}
        </nav>

        <form action="/admin/blogs" method="get" role="search" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <div className="relative sm:w-52">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-fog" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search posts…"
              aria-label="Search posts"
              className={cn(fieldClass, "pl-10 pr-4 placeholder:text-fog/60")}
            />
          </div>
          <div className="relative sm:w-44">
            <select name="category" defaultValue={category ?? ""} aria-label="Filter by category" className={cn(fieldClass, "pl-4 pr-10")}>
              <option value="">All categories</option>
              {categories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
          </div>
          <div className="relative sm:w-60">
            <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-fog">Sort:</span>
            <select name="sort" defaultValue={sort} aria-label="Sort posts" className={cn(fieldClass, "pl-[3.25rem] pr-10")}>
              {ADMIN_POST_SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
          </div>
          <button type="submit" className={cn(editButtonClass, "rounded-full px-5 py-2.5 text-sm")}>
            Apply
          </button>
          {narrowed && (
            <Link href={status === "all" ? "/admin/blogs" : `/admin/blogs?status=${status}`} className="text-sm text-fog transition-colors hover:text-white">
              Clear
            </Link>
          )}
        </form>
      </div>

      <Panel>
        <div className="hidden grid-cols-[6rem_minmax(0,1fr)_7.5rem_7rem_4.5rem_6.5rem_9rem] items-center gap-x-4 rounded-t-2xl border-b border-electric/[0.14]! bg-electric/[0.04] px-6 py-3.5 text-[11px] uppercase tracking-[0.14em] text-fog 2xl:grid">
          <span className="col-span-2">Post</span>
          <span>Category</span>
          <span>Status</span>
          <span>Views</span>
          <span>Updated</span>
          <span className="text-right">Actions</span>
        </div>

        {posts.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm text-fog">{filtered ? "No posts match your filters." : "No posts yet."}</p>
            <Link
              href={filtered ? "/admin/blogs" : "/admin/blogs/new"}
              className="mt-3 inline-block text-sm text-electric transition-colors hover:text-glow"
            >
              {filtered ? "Clear filters" : "Create your first post"}
            </Link>
          </div>
        ) : (
          <ul>
            {posts.map((post, index) => {
              const edit = `/admin/blogs/${post.id}/edit`;
              const updated = new Date(post.updatedAt);
              const nextStatus: PostStatus = post.status === "published" ? "draft" : "published";
              return (
                <li
                  key={post.id}
                  className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-white/[0.06]! px-4 py-4 transition-colors first:rounded-t-2xl last:rounded-b-2xl last:border-0 hover:bg-electric/[0.04] sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:px-6 2xl:grid-cols-[6rem_minmax(0,1fr)_7.5rem_7rem_4.5rem_6.5rem_9rem]"
                >
                  <Link href={edit} tabIndex={-1} aria-hidden="true" className="block">
                    <Thumb src={post.coverImage} eager={index < 4} className="aspect-video w-full" />
                  </Link>

                  <div className="min-w-0">
                    <Link
                      href={edit}
                      className="line-clamp-2 text-[15px] font-medium leading-snug text-white transition-colors hover:text-electric"
                    >
                      {post.title}
                    </Link>
                    {post.excerpt && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-fog">{post.excerpt}</p>}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-fog 2xl:hidden">
                      <StatusBadge status={post.status} />
                      <span>{post.category?.name ?? "Uncategorized"}</span>
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Eye className="h-3.5 w-3.5" />
                        {numberFormat.format(post.views)}
                      </span>
                      <span>{formatShortDate(updated)}</span>
                    </div>
                  </div>

                  <span className="hidden truncate text-fog 2xl:block">{post.category?.name ?? "—"}</span>
                  <span className="hidden 2xl:block">
                    <StatusBadge status={post.status} />
                  </span>
                  <span className="hidden items-center gap-2 tabular-nums text-fog 2xl:inline-flex">
                    <Eye className="h-4 w-4 text-fog/70" />
                    {numberFormat.format(post.views)}
                  </span>
                  <span className="hidden text-fog 2xl:block">
                    {formatShortDate(updated)}
                    <span className="mt-0.5 block text-xs text-fog/60">{formatTime(updated)}</span>
                  </span>

                  <div className="col-span-2 flex items-center justify-end gap-2 sm:col-span-1">
                    <Link href={edit} className={editButtonClass}>
                      Edit
                    </Link>
                    {/* `name` makes the row menus exclusive: opening one closes the others. The menu opens
                        to the left of its button so it never covers the buttons of the rows below. */}
                    <details name="post-menu" className="relative">
                      <summary
                        aria-label={`More actions for ${post.title}`}
                        className={cn(iconButtonClass, "cursor-pointer list-none [&::-webkit-details-marker]:hidden")}
                      >
                        <Ellipsis className="h-4 w-4" />
                      </summary>
                      <div className="absolute right-full top-0 z-30 mr-2 w-52 rounded-xl border border-electric/25! bg-carbon-3 p-1.5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.9),0_0_0_1px_rgba(88,167,232,0.06)]">
                        <Link href={edit} className={menuItemClass}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>
                        <form action={duplicate.bind(null, post.id)}>
                          <button type="submit" className={menuItemClass}>
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </button>
                        </form>
                        <Link href={`/blog/${post.slug}`} target="_blank" className={menuItemClass}>
                          <Eye className="h-4 w-4" />
                          Preview
                        </Link>
                        <form action={setPostStatus.bind(null, post.id, nextStatus)}>
                          <button type="submit" className={menuItemClass}>
                            {post.status === "published" ? <EyeOff className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                            {post.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <div role="separator" className="my-1 h-px bg-electric/15" />
                        {/* Two-step delete with no JavaScript: expand, then confirm. */}
                        <details>
                          <summary className={cn(menuItemClass, "list-none text-glow hover:bg-electric/15 [&::-webkit-details-marker]:hidden")}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </summary>
                          <form action={deletePost.bind(null, post.id)} className="mt-1 rounded-lg border border-electric/20! bg-electric/[0.06] p-3">
                            <p className="text-xs leading-relaxed text-white">Delete this post? This can&apos;t be undone.</p>
                            <button
                              type="submit"
                              className="mt-2.5 w-full rounded-lg bg-electric px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-glow"
                            >
                              Yes, delete
                            </button>
                          </form>
                        </details>
                      </div>
                    </details>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 rounded-b-2xl border-t border-electric/[0.14]! px-5 py-3.5 sm:flex-row">
            <p className="text-xs text-fog">
              Showing {firstShown}–{firstShown + posts.length - 1} of {numberFormat.format(total)} {total === 1 ? "post" : "posts"}
            </p>
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="flex flex-wrap justify-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={href({ page: p })}
                    aria-current={p === page ? "page" : undefined}
                    className={cn(
                      "min-w-8 rounded-lg px-2.5 py-1 text-center text-xs transition-colors",
                      p === page
                        ? "bg-electric font-semibold text-black"
                        : "border border-electric/20! text-fog hover:border-electric/50! hover:text-white"
                    )}
                  >
                    {p}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
