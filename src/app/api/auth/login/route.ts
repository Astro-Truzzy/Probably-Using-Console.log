import { NextResponse } from 'next/server'
import { verifyPassword } from '../../../../../Lib/auth'

export async function POST(req:any){
  const { password } = await req.json()
  if(verifyPassword(password)){
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin', '1', { httpOnly: true, path: '/' })
    return res
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
