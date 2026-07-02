import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, addLike } from '../../../../Lib/posts'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const post = await getPostBySlug(slug)
  if (!post) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json({ likes: post.likes ?? 0 })
}

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    if (!slug) {
      return NextResponse.json({ error: 'slug required' }, { status: 400 })
    }

    const likes = await addLike(slug)
    return NextResponse.json({ likes })
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
