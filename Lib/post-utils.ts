import type { Post, PostSummary } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function isPublished(post: Pick<Post, "published">): boolean {
  return post.published !== false;
}

export function toPostSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    tags: post.tags,
    cover: post.cover,
    published: isPublished(post),
  };
}
