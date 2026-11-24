export type PostStatus = "draft" | "published";

export const ADMIN_POST_SORTS = [
  { value: "updated", label: "Recently updated" },
  { value: "oldest", label: "Least recently updated" },
  { value: "views", label: "Most viewed" },
  { value: "title", label: "Title A–Z" },
] as const;

export type AdminPostSort = (typeof ADMIN_POST_SORTS)[number]["value"];

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Author = {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
};

export type Faq = {
  question: string;
  answer: string;
};

/** A Tiptap JSON document, as stored in posts.content and produced by the editor. */
export type TiptapDoc = {
  type: "doc";
  content?: unknown[];
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: TiptapDoc;
  coverImage: string | null;
  author: Author | null;
  category: Category | null;
  status: PostStatus;
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  faqs: Faq[];
  readingTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type PaginatedPosts = {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
};
