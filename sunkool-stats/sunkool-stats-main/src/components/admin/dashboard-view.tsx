import type { ReactNode } from "react";
import Link from "next/link";
import { formatShortDate } from "@/lib/format-date";
import { ArrowUpRight, Eye, FileText, FolderOpen, Pencil, PencilLine, Plus } from "lucide-react";
import type { DashboardAnalytics } from "@/lib/blog/analytics";
import type { Post } from "@/lib/blog/types";
import { StatusBadge } from "@/components/admin/badge";
import { PostGrowthChart, ViewsTrendChart } from "@/components/admin/dashboard-charts";
import { MiniBars, MiniLine, ProgressRing } from "@/components/admin/sparkline";
import { ViewsDonut } from "@/components/admin/views-donut";
import { PageHeader, Panel, StatCard, Thumb, ghostButtonClass, primaryButtonClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const numberFormat = new Intl.NumberFormat("en-IN");
const RECENT_COLUMNS = "xl:grid-cols-[3.5rem_minmax(0,1fr)_9rem_6.5rem_5rem_7rem_5.5rem]";

function PanelHeading({ title, subtitle, aside }: { title: string; subtitle?: string; aside?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-fog">{subtitle}</p>}
      </div>
      {aside}
    </div>
  );
}

function postsTrend(analytics: DashboardAnalytics): { note: string; trend: "up" | "down" | "flat" } {
  const { newPostsLast30Days: last, newPostsPrev30Days: prev } = analytics;
  if (last === 0 && prev === 0) return { note: "No new posts in 30 days", trend: "flat" };
  if (prev > 0) {
    const change = Math.round(((last - prev) / prev) * 100);
    return {
      note: `${Math.abs(change)}% vs previous 30 days`,
      trend: change > 0 ? "up" : change < 0 ? "down" : "flat",
    };
  }
  return { note: `+${last} in the last 30 days`, trend: "up" };
}

export function DashboardView({
  analytics,
  recentPosts,
  topPosts,
  displayName,
}: {
  analytics: DashboardAnalytics;
  recentPosts: Post[];
  topPosts: Post[];
  displayName: string;
}) {
  const draftShare = analytics.totalPosts ? analytics.draftCount / analytics.totalPosts : 0;
  const posts = postsTrend(analytics);
  const monthly = analytics.series;

  return (
    <div>
      <PageHeader
        eyebrow="Sunkool CMS"
        title={`Welcome back, ${displayName}`}
        description="Track how your content is performing across all posts."
        actions={
          <Link href="/admin/blogs/new" className={primaryButtonClass}>
            <Plus className="h-4 w-4" />
            New post
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Total posts"
          value={numberFormat.format(analytics.totalPosts)}
          note={posts.note}
          trend={posts.trend}
          viz={<MiniBars values={monthly.map((point) => point.total)} />}
        />
        <StatCard
          icon={FolderOpen}
          tone="indigo"
          label="Total categories"
          value={numberFormat.format(analytics.categoryCount)}
          note={`${analytics.categoriesInUse} in use`}
          viz={<MiniLine values={monthly.map((point) => point.categories)} />}
        />
        <StatCard
          icon={Eye}
          tone="teal"
          label="Total views"
          value={numberFormat.format(analytics.totalViews)}
          note={
            analytics.publishedCount > 0
              ? `${numberFormat.format(analytics.avgViewsPerPublished)} avg per published post`
              : undefined
          }
          viz={<MiniBars values={monthly.map((point) => point.views)} />}
        />
        <StatCard
          icon={PencilLine}
          tone="amber"
          label="Drafts"
          value={numberFormat.format(analytics.draftCount)}
          note={
            analytics.totalPosts === 0
              ? undefined
              : analytics.draftCount === 0
                ? "All posts are published"
                : `${Math.round(draftShare * 100)}% of all posts`
          }
          viz={analytics.totalPosts > 0 ? <ProgressRing value={draftShare} /> : undefined}
        />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Panel className="p-5 sm:p-6 xl:col-span-2">
          <PanelHeading
            title="Views Trend"
            subtitle="Views by the month each post was published"
            aside={
              <p className="text-right">
                <span className="font-display text-xl font-semibold text-white tabular-nums">
                  {numberFormat.format(analytics.totalViews)}
                </span>
                <span className="ml-1.5 text-xs text-fog">total</span>
              </p>
            }
          />
          <ViewsTrendChart series={analytics.series} />
          <p className="mt-3 text-[11px] leading-relaxed text-fog/70">
            Views are stored as a running count per post, so they&apos;re grouped by publish month rather than by the
            day they happened.
          </p>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <PanelHeading title="Views by Category" subtitle="Share of all post views" />
          <ViewsDonut slices={analytics.viewsByCategory} total={analytics.totalViews} />
        </Panel>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Panel className="p-5 sm:p-6 xl:col-span-2">
          <PanelHeading
            title="Post Growth"
            subtitle="Cumulative posts by month"
            aside={
              <div className="flex items-center gap-4 text-xs text-fog">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#2f6ea8]" /> Total posts
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-electric" /> Published
                </span>
              </div>
            }
          />
          <PostGrowthChart series={analytics.series} />
          <p className="mt-3 text-[11px] leading-relaxed text-fog/70">
            &ldquo;Total posts&rdquo; counts every post created up to that month; &ldquo;Published&rdquo; counts the ones
            that are live.
          </p>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <PanelHeading
            title="Top Performing Posts"
            aside={
              <Link href="/admin/blogs" className="inline-flex items-center gap-1 text-xs text-electric transition-colors hover:text-glow">
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {topPosts.length === 0 ? (
            <p className="py-10 text-center text-sm text-fog">No post views yet.</p>
          ) : (
            <ol className="space-y-1">
              {topPosts.map((post, i) => (
                <li key={post.id}>
                  <Link
                    href={`/admin/blogs/${post.id}/edit`}
                    className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-electric/[0.06]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-electric/35! bg-electric/10 text-xs font-semibold text-glow">
                      {i + 1}
                    </span>
                    <Thumb src={post.coverImage} className="h-10 w-12 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[13px] font-medium leading-snug text-white transition-colors group-hover:text-electric">
                        {post.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-fog">{numberFormat.format(post.views)} views</p>
                    </div>
                    {analytics.totalViews > 0 && (
                      <span className="shrink-0 text-xs font-medium tabular-nums text-glow">
                        {Math.round((post.views / analytics.totalViews) * 100)}%
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-electric/[0.14]! px-5 py-4 sm:px-6">
          <h2 className="font-display text-lg font-semibold text-white">Recent posts</h2>
          <Link href="/admin/blogs" className="inline-flex items-center gap-1 text-sm text-electric transition-colors hover:text-glow">
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className={cn(
            "hidden gap-x-4 border-b border-white/[0.06]! bg-electric/[0.04] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-fog sm:px-6 xl:grid",
            RECENT_COLUMNS
          )}
        >
          <span />
          <span>Title</span>
          <span>Category</span>
          <span>Status</span>
          <span>Views</span>
          <span>Updated</span>
          <span />
        </div>

        {recentPosts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-fog">No posts yet.</p>
            <Link href="/admin/blogs/new" className={cn(primaryButtonClass, "mt-4")}>
              <Plus className="h-4 w-4" />
              Create your first post
            </Link>
          </div>
        ) : (
          <ul>
            {recentPosts.map((post) => (
              <li
                key={post.id}
                className={cn(
                  "grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-x-4 border-b border-white/[0.06]! px-4 py-3.5 transition-colors last:border-0 hover:bg-electric/[0.04] sm:px-6",
                  RECENT_COLUMNS
                )}
              >
                <Thumb src={post.coverImage} className="h-10 w-12 xl:h-11 xl:w-14" />

                <div className="min-w-0">
                  <Link
                    href={`/admin/blogs/${post.id}/edit`}
                    className="line-clamp-2 text-sm font-medium text-white transition-colors hover:text-electric xl:line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-0.5 line-clamp-1 text-xs text-fog xl:hidden">
                    {post.category?.name ?? "Uncategorized"} · {numberFormat.format(post.views)} views ·{" "}
                    {formatShortDate(post.updatedAt)}
                  </p>
                  <div className="mt-1.5 sm:hidden">
                    <StatusBadge status={post.status} />
                  </div>
                </div>

                <span className="hidden truncate text-sm text-fog xl:block">{post.category?.name ?? "—"}</span>

                <div className="flex items-center gap-2 xl:contents">
                  <span className="hidden sm:contents">
                    <StatusBadge status={post.status} />
                  </span>
                  <Link href={`/admin/blogs/${post.id}/edit`} className={cn(ghostButtonClass, "xl:order-last xl:justify-self-end")}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                </div>

                <span className="hidden text-sm tabular-nums text-fog xl:block">{numberFormat.format(post.views)}</span>
                <span className="hidden text-sm text-fog xl:block">{formatShortDate(post.updatedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
