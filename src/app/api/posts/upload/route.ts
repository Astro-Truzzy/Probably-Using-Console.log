import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../../../../Lib/auth";
import { createPostsFromPayloads } from "../../../../../Lib/posts";
import { toPostSummary } from "../../../../../Lib/post-utils";
import type { PostPayload } from "../../../../../Lib/types";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { items?: PostPayload[]; published?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "no items provided" }, { status: 400 });
  }

  if (items.length > 10) {
    return NextResponse.json(
      { error: "maximum 10 items per upload" },
      { status: 400 }
    );
  }

  for (const item of items) {
    if (!item.title?.trim() || !item.content?.trim()) {
      return NextResponse.json(
        { error: "each item requires title and content" },
        { status: 400 }
      );
    }
  }

  try {
    const published = body.published === true;
    const posts = await createPostsFromPayloads(items, published);
    return NextResponse.json(
      {
        created: posts.length,
        published,
        results: posts.map((post) => ({
          ok: true,
          post: toPostSummary(post),
        })),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "failed to save posts" }, { status: 500 });
  }
}
