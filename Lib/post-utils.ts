import type { Post, PostSummary } from "./types";

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
  };
}
