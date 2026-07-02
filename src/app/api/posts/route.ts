import { NextRequest, NextResponse } from "next/server";
import { getPostSummaries, createPost } from "../../../../Lib/posts";
import { requireAdmin } from "../../../../Lib/auth";

export async function GET() {
  const posts = await getPostSummaries();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const p = await createPost(body)
    return NextResponse.json(p)
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
