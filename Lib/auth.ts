import { NextResponse } from 'next/server'

const ADMIN_PASS = 'TrustWilliams2025' // change in production via env

export function verifyPassword(password:string){
  return password === ADMIN_PASS
}

export function requireAdmin(req:any){
  const cookies = req.cookies || {}
  if(cookies.get && cookies.get('admin')) return true
  return false
}
