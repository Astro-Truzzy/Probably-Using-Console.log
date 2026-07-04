import { getSupabaseAdmin } from "./supabase";
import type { Comment, Post, PostPayload } from "./types";

interface PostRow {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  date: string;
  updated_at?: string | null;
  read_time: number | null;
  tags: string[] | null;
  likes: number | null;
  comments: Comment[] | null;
  cover: string | null;
}

function rowToPost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? undefined,
    content: row.content,
    author: row.author ?? undefined,
    date: row.date,
    updatedAt: row.updated_at ?? row.date,
    readTime: row.read_time ?? undefined,
    tags: row.tags ?? undefined,
    likes: row.likes ?? 0,
    comments: row.comments ?? [],
    cover: row.cover ?? undefined,
  };
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildRow(payload: PostPayload): Omit<PostRow, "likes" | "comments"> {
  const slug = slugify(payload.title || "untitled");
  const now = new Date().toISOString();
  return {
    slug,
    title: payload.title || "Untitled",
    excerpt: payload.excerpt || (payload.content || "").slice(0, 180),
    content: payload.content || "",
    author: payload.author || "Trust Williams",
    date: now,
    updated_at: now,
    read_time: payload.readTime || 6,
    tags: payload.tags || [],
    cover: payload.cover ?? null,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return (data as PostRow[]).map(rowToPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToPost(data as PostRow) : undefined;
}

export async function createPost(payload: PostPayload): Promise<Post> {
  const supabase = getSupabaseAdmin();
  const row = buildRow(payload);
  const { data, error } = await supabase
    .from("posts")
    .insert({ ...row, likes: 0, comments: [] })
    .select("*")
    .single();

  if (error) throw error;
  return rowToPost(data as PostRow);
}

export async function updatePost(
  slug: string,
  payload: PostPayload
): Promise<Post | null> {
  const supabase = getSupabaseAdmin();
  const updates: Partial<PostRow> = {};

  if (payload.title !== undefined) updates.title = payload.title;
  if (payload.excerpt !== undefined) updates.excerpt = payload.excerpt;
  if (payload.content !== undefined) updates.content = payload.content;
  if (payload.author !== undefined) updates.author = payload.author;
  if (payload.readTime !== undefined) updates.read_time = payload.readTime;
  if (payload.tags !== undefined) updates.tags = payload.tags;
  if (payload.cover !== undefined) updates.cover = payload.cover ?? null;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("slug", slug)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data ? rowToPost(data as PostRow) : null;
}

export async function deletePost(slug: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("posts").delete().eq("slug", slug);
  if (error) throw error;
  return true;
}

export async function addComment(
  slug: string,
  comment: Pick<Comment, "name" | "text">
): Promise<Comment[]> {
  const post = await getPostBySlug(slug);
  if (!post) throw new Error("post not found");

  const comments: Comment[] = [
    ...(post.comments || []),
    { ...comment, date: new Date().toISOString() },
  ];

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("posts")
    .update({ comments })
    .eq("slug", slug);

  if (error) throw error;
  return comments;
}

export async function addLike(slug: string): Promise<number> {
  const post = await getPostBySlug(slug);
  if (!post) throw new Error("post not found");

  const likes = (post.likes || 0) + 1;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("posts")
    .update({ likes })
    .eq("slug", slug);

  if (error) throw error;
  return likes;
}
