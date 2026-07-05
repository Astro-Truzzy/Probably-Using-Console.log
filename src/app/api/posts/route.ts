import { NextRequest, NextResponse } from "next/server";
import {
  createPost,
  getAllPostSummaries,
  getPostSummaries,
} from "../../../../Lib/posts";
import { requireAdmin } from "../../../../Lib/auth";

export async function GET(req: NextRequest) {
  const includeDrafts = req.nextUrl.searchParams.get("all") === "1";

  if (includeDrafts) {
    if (!(await requireAdmin(req))) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const posts = await getAllPostSummaries();
    return NextResponse.json(posts);
  }

  const posts = await getPostSummaries();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
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
