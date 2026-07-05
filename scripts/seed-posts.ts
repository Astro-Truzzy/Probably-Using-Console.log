/**
 * Seed Supabase from Lib/posts.json
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-posts.ts
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { Post } from "../Lib/types";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const dataPath = path.join(process.cwd(), "Lib", "posts.json");
const posts = JSON.parse(fs.readFileSync(dataPath, "utf-8")) as Post[];

async function seed() {
  for (const post of posts) {
    const row = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? null,
      content: post.content,
      author: post.author ?? "Trust Williams",
      date: post.date,
      read_time: post.readTime ?? 6,
      tags: post.tags ?? [],
      likes: post.likes ?? 0,
      comments: post.comments ?? [],
      cover: post.cover ?? null,
      published: post.published ?? true,
    };

    const { error } = await supabase.from("posts").upsert(row, { onConflict: "slug" });
    if (error) {
      console.error(`Failed to seed ${post.slug}:`, error.message);
      process.exit(1);
    }

    console.log(`Seeded ${post.slug}`);
  }

  console.log(`Done. ${posts.length} posts imported.`);
}

seed();
