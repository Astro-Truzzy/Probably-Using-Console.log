import fs from 'fs'
import path from 'path'

const DATA = path.join(process.cwd(), 'lib', 'posts.json')

export async function getAllPosts(){
  const raw = fs.readFileSync(DATA, 'utf-8')
  const posts = JSON.parse(raw)
  return posts.sort((a:any,b:any)=> new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug:string){
  const posts = await getAllPosts()
  return posts.find((p:any)=> p.slug === slug)
}

export async function createPost(payload:any){
  const posts = await getAllPosts()
  const slug = (payload.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
  const post = {
    ...payload,
    slug,
    excerpt: payload.excerpt || (payload.content || '').slice(0,180),
    author: payload.author || 'Trust Williams',
    date: new Date().toISOString(),
    readTime: payload.readTime || 6,
    tags: payload.tags || []
  }
  posts.unshift(post)
  fs.writeFileSync(DATA, JSON.stringify(posts, null, 2))
  return post
}

export async function updatePost(slug:string, payload:any){
  const posts = await getAllPosts()
  const idx = posts.findIndex((p:any)=> p.slug===slug)
  if(idx === -1) return null
  posts[idx] = { ...posts[idx], ...payload }
  fs.writeFileSync(DATA, JSON.stringify(posts, null, 2))
  return posts[idx]
}

export async function deletePost(slug:string){
  const posts = await getAllPosts()
  const filtered = posts.filter((p:any)=> p.slug !== slug)
  fs.writeFileSync(DATA, JSON.stringify(filtered, null, 2))
  return true
}

export async function addComment(slug:string, comment:any){
  const posts = await getAllPosts()
  const idx = posts.findIndex((p:any)=> p.slug === slug)
  if(idx === -1) throw new Error('post not found')
  posts[idx].comments = posts[idx].comments || []
  posts[idx].comments.push({ ...comment, date: new Date().toISOString() })
  fs.writeFileSync(DATA, JSON.stringify(posts, null, 2))
  return posts[idx].comments
}

export async function addLike(slug:string){
  const posts = await getAllPosts()
  const idx = posts.findIndex((p:any)=> p.slug === slug)
  if(idx === -1) throw new Error('post not found')
  posts[idx].likes = (posts[idx].likes || 0) + 1
  fs.writeFileSync(DATA, JSON.stringify(posts, null, 2))
  return posts[idx].likes
}
