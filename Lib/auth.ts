import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export {
  canAccessAdmin,
  clearGateCookie,
  clearLegacyAdminCookie,
  clearSessionCookie,
  createAdminGateToken,
  createAdminSessionToken,
  gateCookie,
  getAdminTerminalCommand,
  isAdminTerminalCommand,
  isAuthConfigured,
  normalizeTerminalPhrase,
  requireAdmin,
  sessionCookie,
  adminCookieOptions,
} from "./auth-crypto";

export async function hasValidAdminSessionFromCookies(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const { verifySessionToken } = await import("./auth-crypto");
  const payload = await verifySessionToken(token);
  return payload?.role === "admin";
}

export function verifyPassword(password: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  if (password.length !== configured.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(configured));
}

export type { NextRequest };
