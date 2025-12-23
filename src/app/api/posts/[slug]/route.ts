import { NextResponse } from 'next/server'
import { getPostBySlug, updatePost, deletePost } from '../../../../../Lib/posts'

export async function GET(req:any, { params }: any){
  const post = await getPostBySlug(params.slug)
  if(!post) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req:any, { params }: any){
  const body = await req.json()
  const updated = await updatePost(params.slug, body)
  if(!updated) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req:any, { params }: any){
  await deletePost(params.slug)
  return NextResponse.json({ ok: true })
}
