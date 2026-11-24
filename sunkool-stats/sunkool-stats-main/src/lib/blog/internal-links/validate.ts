import { collectSitePaths } from "./doc-links";
import type { PostStatus } from "../types";
import { postHref, slugFromPath } from "./urls";

export type LinkProblem = "self" | "missing" | "draft";

export type LinkIssue = {
  /** The site path as linked, e.g. "/blog/some-post". */
  path: string;
  problem: LinkProblem;
  message: string;
};

export type LinkCheckContext = {
  /** The post being saved; undefined for a brand-new one. */
  selfId?: string;
  selfSlug?: string;
  /** Every real page on the site (see getSitePaths). */
  sitePaths: ReadonlySet<string>;
  /** Existing posts, by slug. */
  posts: ReadonlyMap<string, { id: string; status: PostStatus }>;
};

/**
 * Internal links in a document that would be broken or pointless: a link to
 * the post itself, to a URL that isn't a page or post on this site, or to a
 * draft (which visitors can't open). Links to other websites, mailto:, tel:
 * and "#anchor" links aren't checked.
 */
export function findLinkIssues(doc: unknown, context: LinkCheckContext): LinkIssue[] {
  const issues: LinkIssue[] = [];
  const selfPath = context.selfSlug ? postHref(context.selfSlug) : null;

  for (const path of collectSitePaths(doc)) {
    if (path === selfPath) {
      issues.push({ path, problem: "self", message: `${path} links to this post itself.` });
      continue;
    }
    if (context.sitePaths.has(path)) continue;

    const slug = slugFromPath(path);
    const post = slug ? context.posts.get(slug) : undefined;
    if (!post) {
      issues.push({ path, problem: "missing", message: `${path} doesn't match any page or post on this site.` });
    } else if (context.selfId && post.id === context.selfId) {
      issues.push({ path, problem: "self", message: `${path} links to this post itself.` });
    } else if (post.status === "draft") {
      issues.push({ path, problem: "draft", message: `${path} is a draft, so visitors would get a 404.` });
    }
  }
  return issues;
}

/** Problems in `next` that weren't already in `previous` — what a save would newly introduce. */
export function newLinkIssues(previous: LinkIssue[], next: LinkIssue[]): LinkIssue[] {
  const known = new Set(previous.map((issue) => `${issue.problem}:${issue.path}`));
  return next.filter((issue) => !known.has(`${issue.problem}:${issue.path}`));
}
