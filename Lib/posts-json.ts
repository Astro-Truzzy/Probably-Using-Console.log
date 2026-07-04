import fs from "fs";
import path from "path";
import type { Comment, Post, PostPayload } from "./types";

const DATA = path.join(process.cwd(), "Lib", "posts.json");

function sortPosts(posts: Post[]): Post[] {
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function readPosts(): Post[] {
  const raw = fs.readFileSync(DATA, "utf-8");
  return sortPosts(JSON.parse(raw) as Post[]);
}

function writePosts(posts: Post[]): void {
  fs.writeFileSync(DATA, JSON.stringify(sortPosts(posts), null, 2));
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildPost(payload: PostPayload): Post {
  const slug = slugify(payload.title || "untitled");
  const now = new Date().toISOString();
  return {
    ...payload,
    slug,
    title: payload.title || "Untitled",
    excerpt: payload.excerpt || (payload.content || "").slice(0, 180),
    content: payload.content || "",
    author: payload.author || "Trust Williams",
    date: now,
    updatedAt: now,
    readTime: payload.readTime || 6,
    tags: payload.tags || [],
    comments: [],
    likes: 0,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  return readPosts();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export async function createPost(payload: PostPayload): Promise<Post> {
  const posts = await getAllPosts();
  const post = buildPost(payload);
  posts.unshift(post);
  writePosts(posts);
  return post;
}

export async function updatePost(
  slug: string,
  payload: PostPayload
): Promise<Post | null> {
  const posts = await getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return null;
  posts[idx] = {
    ...posts[idx],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  writePosts(posts);
  return posts[idx];
}

export async function deletePost(slug: string): Promise<boolean> {
  const posts = await getAllPosts();
  writePosts(posts.filter((p) => p.slug !== slug));
  return true;
}

export async function addComment(
  slug: string,
  comment: Pick<Comment, "name" | "text">
): Promise<Comment[]> {
  const posts = await getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) throw new Error("post not found");

  const entry: Comment = {
    ...comment,
    date: new Date().toISOString(),
  };
  posts[idx].comments = [...(posts[idx].comments || []), entry];
  writePosts(posts);
  return posts[idx].comments!;
}

export async function addLike(slug: string): Promise<number> {
  const posts = await getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) throw new Error("post not found");

  posts[idx].likes = (posts[idx].likes || 0) + 1;
  writePosts(posts);
  return posts[idx].likes!;
}
