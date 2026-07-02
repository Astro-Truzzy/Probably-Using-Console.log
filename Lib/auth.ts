import { NextRequest } from "next/server";

const DEV_FALLBACK_PASSWORD = "TrustWilliams2025";

export function verifyPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD;

  if (configured) {
    return password === configured;
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return password === DEV_FALLBACK_PASSWORD;
}

export function requireAdmin(req: NextRequest) {
  return req.cookies.get("admin")?.value === "1";
}
