import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "admin_session";
export const GATE_COOKIE = "admin_gate";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const GATE_MAX_AGE = 60 * 60 * 24;

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;

  if (process.env.NODE_ENV !== "production") {
    const fallback = process.env.ADMIN_PASSWORD;
    if (fallback && fallback.length >= 8) {
      return `dev:${fallback}`;
    }
  }

  return null;
}

function encodeBase64Url(data: Uint8Array | ArrayBuffer): string {
  const uint8 = data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = "";
  for (const byte of uint8) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64Url(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const base64 = padded + "=".repeat(padLen);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signPayload(encoded: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encoded)
  );
  return encodeBase64Url(signature);
}

async function createSignedToken(
  payload: Record<string, unknown>,
  secret: string,
  maxAgeSec: number
): Promise<string> {
  const body = {
    ...payload,
    exp: Date.now() + maxAgeSec * 1000,
  };
  const encoded = encodeBase64Url(new TextEncoder().encode(JSON.stringify(body)));
  const signature = await signPayload(encoded, secret);
  return `${encoded}.${signature}`;
}

async function verifySignedToken(
  token: string | undefined,
  secret: string
): Promise<Record<string, unknown> | null> {
  if (!token) return null;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  try {
    const key = await importHmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(signature),
      new TextEncoder().encode(encoded)
    );
    if (!valid) return null;

    const json = new TextDecoder().decode(decodeBase64Url(encoded));
    const payload = JSON.parse(json) as Record<string, unknown>;

    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getAdminTerminalCommand(): string {
  const raw = process.env.ADMIN_TERMINAL_COMMAND;
  if (!raw?.trim()) return "domain expansion";
  return normalizeTerminalPhrase(raw);
}

export function normalizeTerminalPhrase(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isAdminTerminalCommand(input: string): boolean {
  return normalizeTerminalPhrase(input) === getAdminTerminalCommand();
}

export async function createAdminSessionToken(): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  return createSignedToken({ role: "admin" }, secret, SESSION_MAX_AGE);
}

export async function createAdminGateToken(): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  return createSignedToken({ gate: true }, secret, GATE_MAX_AGE);
}

function readCookie(req: NextRequest, name: string): string | undefined {
  return req.cookies.get(name)?.value;
}

export async function hasValidAdminSession(req: NextRequest): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret) return false;
  const payload = await verifySignedToken(readCookie(req, SESSION_COOKIE), secret);
  return payload?.role === "admin";
}

export async function hasValidAdminGate(req: NextRequest): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret) return false;
  const payload = await verifySignedToken(readCookie(req, GATE_COOKIE), secret);
  return payload?.gate === true;
}

export async function canAccessAdmin(req: NextRequest): Promise<boolean> {
  return (
    (await hasValidAdminSession(req)) || (await hasValidAdminGate(req))
  );
}

export async function requireAdmin(req: NextRequest): Promise<boolean> {
  return hasValidAdminSession(req);
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSessionSecret());
}

export const adminCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    ...adminCookieOptions,
    maxAge: SESSION_MAX_AGE,
  };
}

export function gateCookie(token: string) {
  return {
    name: GATE_COOKIE,
    value: token,
    ...adminCookieOptions,
    maxAge: GATE_MAX_AGE,
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    ...adminCookieOptions,
    maxAge: 0,
  };
}

export function clearGateCookie() {
  return {
    name: GATE_COOKIE,
    value: "",
    ...adminCookieOptions,
    maxAge: 0,
  };
}

export function clearLegacyAdminCookie() {
  return {
    name: "admin",
    value: "",
    ...adminCookieOptions,
    maxAge: 0,
  };
}

export async function verifySessionToken(
  token: string | undefined
): Promise<Record<string, unknown> | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  return verifySignedToken(token, secret);
}

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

export async function canAccessAdminFromCookies(
  store: CookieReader
): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret) return false;

  const sessionPayload = await verifySignedToken(
    store.get(SESSION_COOKIE)?.value,
    secret
  );
  if (sessionPayload?.role === "admin") return true;

  const gatePayload = await verifySignedToken(
    store.get(GATE_COOKIE)?.value,
    secret
  );
  return gatePayload?.gate === true;
}

export async function validateGateToken(
  token: string | null | undefined
): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret || !token) return false;
  const payload = await verifySignedToken(token, secret);
  return payload?.gate === true;
}
