import { NextResponse } from 'next/server'
import { getAllPosts, createPost } from "../../../../Lib/posts"

export async function GET(){
  const posts = await getAllPosts()
  return NextResponse.json(posts)
}

export async function POST(req:any){
  try{
    const body = await req.json()
    const p = await createPost(body)
    return NextResponse.json(p)
  }catch(e){
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
