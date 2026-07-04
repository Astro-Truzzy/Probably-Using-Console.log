export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "https://probably-using-console.log"
).replace(/\/$/, "");

/** Hostname from the configured canonical site URL (no port). */
export const canonicalHost = new URL(siteUrl).host;

/**
 * Site URL for the current request. Sitemap and robots URLs must match the
 * host serving them or Search Console reports "URL not allowed".
 */
export async function getRequestSiteUrl(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const host =
      headersList.get("x-forwarded-host")?.split(",")[0]?.trim() ??
      headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") ?? "https";

    if (host) {
      return `${protocol}://${host}`.replace(/\/$/, "");
    }
  } catch {
    // headers() is unavailable outside a request (build, static generation).
  }

  return siteUrl;
}

export const siteName = "Probably Using Console.log()";

export const siteDescription =
  "Debugging life, one log at a time. Developer blog by Trust Williams covering JavaScript, full-stack engineering, Web3, and lessons from building Ridely and Ownbase.";

export const authorName = "Trust Williams";

export const authorEmail = "Taresy.dev@gmail.com";

export const socialLinks = {
  github:
    process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/Astro-Truzzy",
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL ?? "",
  linkedIn: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
} as const;

/** Google Search Console HTML tag verification code (meta content value only). */
export const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION ?? "";

export const contactNotifyEmail =
  process.env.CONTACT_NOTIFY_EMAIL ?? process.env.RESEND_TO_EMAIL ?? "";

export const resendFromEmail =
  process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export function isSupabaseStorage(): boolean {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  try {
    const hostname = new URL(url).hostname;
    return /^[a-z0-9-]{6,}\.supabase\.co$/i.test(hostname);
  } catch {
    return false;
  }
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function canUseLocalFileStorage(): boolean {
  return process.env.NODE_ENV !== "production" && !isSupabaseStorage();
}
