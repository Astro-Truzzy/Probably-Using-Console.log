import { cache } from "react";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { isSupabaseStorage } from "./config";
import { toPostSummary } from "./post-utils";
import * as jsonStore from "./posts-json";
import * as supabaseStore from "./posts-supabase";
import type { Comment, Post, PostPayload, PostSummary } from "./types";

const store = isSupabaseStorage() ? supabaseStore : jsonStore;

export const POSTS_CACHE_TAG = "posts";

export type { Comment, Post, PostPayload, PostSummary };

async function loadAllPosts(): Promise<Post[]> {
  return store.getAllPosts();
}

const getCachedAllPosts = unstable_cache(loadAllPosts, ["posts-all"], {
  tags: [POSTS_CACHE_TAG],
  revalidate: 60,
});

export const getAllPosts = cache(getCachedAllPosts);

export const getPostSummaries = cache(async (): Promise<PostSummary[]> => {
  const posts = await getAllPosts();
  return posts.map(toPostSummary);
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | undefined> => {
  if (isSupabaseStorage()) {
    const fetchPost = unstable_cache(
      () => supabaseStore.getPostBySlug(slug),
      ["post", slug],
      { tags: [POSTS_CACHE_TAG, `post-${slug}`], revalidate: 60 }
    );
    return fetchPost();
  }

  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
});

function invalidatePosts(slug?: string) {
  revalidateTag(POSTS_CACHE_TAG, "max");
  if (slug) revalidateTag(`post-${slug}`, "max");
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createPost(payload: PostPayload): Promise<Post> {
  const post = await store.createPost(payload);
  invalidatePosts(post.slug);
  return post;
}

export async function updatePost(
  slug: string,
  payload: PostPayload
): Promise<Post | null> {
  const updated = await store.updatePost(slug, payload);
  if (updated) invalidatePosts(slug);
  return updated;
}

export async function deletePost(slug: string): Promise<boolean> {
  const deleted = await store.deletePost(slug);
  invalidatePosts(slug);
  return deleted;
}

export async function addComment(
  slug: string,
  comment: Pick<Comment, "name" | "text">
): Promise<Comment[]> {
  const comments = await store.addComment(slug, comment);
  invalidatePosts(slug);
  return comments;
}

export async function addLike(slug: string): Promise<number> {
  const likes = await store.addLike(slug);
  invalidatePosts(slug);
  return likes;
}
