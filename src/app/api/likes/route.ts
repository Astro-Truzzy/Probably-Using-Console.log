import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, addLike } from "@lib/posts";
import {
  applyVisitorCookie,
  enforceLikeRateLimit,
  getVisitorId,
  hasVisitorLiked,
  kvNotConfiguredResponse,
  kvRequiredInProduction,
  markVisitorLiked,
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

  return NextResponse.json({ likes: post.likes ?? 0 });
}

export async function POST(req: NextRequest) {
  try {
    if (kvRequiredInProduction()) {
      return kvNotConfiguredResponse();
    }

    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const post = await getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const { id: visitorId, isNew } = getVisitorId(req);
    const currentLikes = post.likes ?? 0;

    if (await hasVisitorLiked(slug, visitorId)) {
      return applyVisitorCookie(
        NextResponse.json({ likes: currentLikes, alreadyLiked: true }),
        visitorId,
        isNew
      );
    }

    const rateLimit = await enforceLikeRateLimit(visitorId);
    if (!rateLimit.ok) {
      return rateLimitResponse(rateLimit.retryAfter);
    }

    const likes = await addLike(slug);
    await markVisitorLiked(slug, visitorId);

    return applyVisitorCookie(
      NextResponse.json({ likes, alreadyLiked: false }),
      visitorId,
      isNew
    );
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
