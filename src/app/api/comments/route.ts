import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, addComment } from "@lib/posts";
import {
  applyVisitorCookie,
  enforceCommentRateLimit,
  getVisitorId,
  kvNotConfiguredResponse,
  kvRequiredInProduction,
  rateLimitResponse,
} from "@lib/rate-limit";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(post.comments ?? []);
}

export async function POST(req: NextRequest) {
  try {
    if (kvRequiredInProduction()) {
      return kvNotConfiguredResponse();
    }

    const { slug, name, text } = await req.json();

    if (!slug || !name?.trim() || !text?.trim()) {
      return NextResponse.json(
        { error: "slug, name, and text required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim().slice(0, 80);
    const trimmedText = text.trim().slice(0, 2000);

    if (trimmedName.length < 1 || trimmedText.length < 1) {
      return NextResponse.json({ error: "name and text required" }, { status: 400 });
    }

    const { id: visitorId, isNew } = getVisitorId(req);
    const rateLimit = await enforceCommentRateLimit(visitorId);
    if (!rateLimit.ok) {
      return rateLimitResponse(rateLimit.retryAfter);
    }

    const comments = await addComment(slug, {
      name: trimmedName,
      text: trimmedText,
    });

    return applyVisitorCookie(
      NextResponse.json(comments),
      visitorId,
      isNew
    );
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
