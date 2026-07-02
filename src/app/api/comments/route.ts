import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, addComment } from '../../../../Lib/posts'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const post = await getPostBySlug(slug)
  if (!post) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json(post.comments ?? [])
}

export async function POST(req: NextRequest) {
  try {
    const { slug, name, text } = await req.json()

    if (!slug || !name?.trim() || !text?.trim()) {
      return NextResponse.json({ error: 'slug, name, and text required' }, { status: 400 })
    }

    const comments = await addComment(slug, { name: name.trim(), text: text.trim() })
    return NextResponse.json(comments)
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
