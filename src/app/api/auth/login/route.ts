import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "../../../../../Lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (verifyPassword(password)) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin", "1", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
