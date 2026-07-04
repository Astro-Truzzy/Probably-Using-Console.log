import { Ratelimit } from "@upstash/ratelimit";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getRedis, isKvConfigured } from "./kv";

const VISITOR_COOKIE = "pucl_vid";
const LIKE_KEY_PREFIX = "like";
const LIKE_TTL_SECONDS = 60 * 60 * 24 * 365;

let commentLimiter: Ratelimit | null = null;
let likeLimiter: Ratelimit | null = null;

function getCommentLimiter(): Ratelimit {
  if (!commentLimiter) {
    commentLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "ratelimit:comments",
    });
  }
  return commentLimiter;
}

function getLikeLimiter(): Ratelimit {
  if (!likeLimiter) {
    likeLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(30, "1 h"),
      prefix: "ratelimit:likes",
    });
  }
  return likeLimiter;
}

export function getVisitorId(req: NextRequest): { id: string; isNew: boolean } {
  const existing = req.cookies.get(VISITOR_COOKIE)?.value;
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) {
    return { id: existing, isNew: false };
  }
  return { id: randomUUID(), isNew: true };
}

export function applyVisitorCookie(
  response: NextResponse,
  visitorId: string,
  isNew: boolean
): NextResponse {
  if (!isNew) return response;

  response.cookies.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: LIKE_TTL_SECONDS,
    path: "/",
  });

  return response;
}

export function kvRequiredInProduction(): boolean {
  return process.env.NODE_ENV === "production" && !isKvConfigured();
}

export async function enforceCommentRateLimit(
  visitorId: string
): Promise<{ ok: true } | { ok: false; retryAfter?: number }> {
  if (!isKvConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false };
    }
    return { ok: true };
  }

  const { success, reset } = await getCommentLimiter().limit(visitorId);
  if (success) return { ok: true };

  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return { ok: false, retryAfter };
}

export async function enforceLikeRateLimit(
  visitorId: string
): Promise<{ ok: true } | { ok: false; retryAfter?: number }> {
  if (!isKvConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false };
    }
    return { ok: true };
  }

  const { success, reset } = await getLikeLimiter().limit(visitorId);
  if (success) return { ok: true };

  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return { ok: false, retryAfter };
}

export async function hasVisitorLiked(
  slug: string,
  visitorId: string
): Promise<boolean> {
  if (!isKvConfigured()) return false;

  const key = `${LIKE_KEY_PREFIX}:${visitorId}:${slug}`;
  const value = await getRedis().get<number>(key);
  return value === 1;
}

export async function markVisitorLiked(
  slug: string,
  visitorId: string
): Promise<void> {
  if (!isKvConfigured()) return;

  const key = `${LIKE_KEY_PREFIX}:${visitorId}:${slug}`;
  await getRedis().set(key, 1, { ex: LIKE_TTL_SECONDS });
}

export function rateLimitResponse(retryAfter?: number): NextResponse {
  const headers: Record<string, string> = {};
  if (retryAfter) {
    headers["Retry-After"] = String(retryAfter);
  }

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers }
  );
}

export function kvNotConfiguredResponse(): NextResponse {
  return NextResponse.json(
    { error: "Engagement features are temporarily unavailable." },
    { status: 503 }
  );
}
