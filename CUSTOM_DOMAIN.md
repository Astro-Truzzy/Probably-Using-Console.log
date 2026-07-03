# Custom Domain Setup — Hostinger + Vercel

This guide explains how to connect your **Hostinger** domain to **Probably Using Console.log()** when the site is hosted on Vercel.

**Domain registrar:** Hostinger (hPanel)  
**Target domain:** `probably-using-console.log`  
**Production URL env var:** `NEXT_PUBLIC_SITE_URL`

---

## Table of contents

1. [How it fits together](#1-how-it-fits-together)
2. [Prerequisites](#2-prerequisites)
3. [Add the domain in Vercel](#3-add-the-domain-in-vercel)
4. [Configure DNS in Hostinger hPanel](#4-configure-dns-in-hostinger-hpanel)
5. [Choose apex vs www](#5-choose-apex-vs-www)
6. [Update environment variables on Vercel](#6-update-environment-variables-on-vercel)
7. [Redeploy and verify](#7-redeploy-and-verify)
8. [Optional: Google Search Console (Hostinger TXT)](#8-optional-google-search-console-hostinger-txt)
9. [Optional: Resend email on your domain](#9-optional-resend-email-on-your-domain)
10. [Troubleshooting (Hostinger)](#10-troubleshooting-hostinger)
11. [Quick checklist](#11-quick-checklist)

---

## 1. How it fits together

```
Visitor types probably-using-console.log
        │
        ▼
   Hostinger DNS (hPanel)
   A + CNAME records → Vercel
        │
        ▼
   Vercel (SSL + routing)
   serves your Next.js app
        │
        ▼
   App reads NEXT_PUBLIC_SITE_URL
   for SEO, sitemap, Open Graph, etc.
```

Your site **runs on Vercel**, but your **domain stays registered at Hostinger**. You only change DNS records in hPanel so traffic goes to Vercel instead of Hostinger's default parking or hosting servers.

The app reads its public URL from `NEXT_PUBLIC_SITE_URL` in `Lib/config.ts`:

```ts
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "https://probably-using-console.log"
).replace(/\/$/, "");
```

That value drives:

| Feature | File |
|---------|------|
| Canonical URLs & Open Graph | `Lib/seo.ts` |
| Sitemap | `src/app/sitemap.ts` |
| Robots.txt | `src/app/robots.ts` |
| Blog share URLs | `src/app/blog/[slug]/page.tsx` |
| Web app manifest | `src/app/manifest.ts` |

**Important:** DNS can be correct while SEO still points at your old `*.vercel.app` URL if `NEXT_PUBLIC_SITE_URL` is not updated and redeployed.

---

## 2. Prerequisites

Before you start, confirm:

- [ ] The site is already deployed on Vercel (see [DEPLOYMENT.md](./DEPLOYMENT.md)).
- [ ] The domain `probably-using-console.log` is registered at Hostinger.
- [ ] You can log in to [hPanel](https://hpanel.hostinger.com).
- [ ] Your domain uses **Hostinger nameservers** (required to edit DNS in hPanel).

### Verify Hostinger nameservers

1. Log in to **hPanel**.
2. Go to **Domains** → **Domain portfolio** (or **Domains → DNS** in the sidebar).
3. Click **Manage** next to `probably-using-console.log`.
4. Open **DNS / Nameservers** and check the nameservers tab.

You should see Hostinger nameservers, for example:

```
ns1.dns-parking.com
ns2.dns-parking.com
```

—or names like `pixel.ns.hostinger.com` / `byte.ns.hostinger.com` depending on your plan.

If nameservers point elsewhere (Cloudflare, Vercel, etc.), either manage DNS at that provider instead, or switch back to Hostinger nameservers before following this guide.

> **Note:** You do **not** need a Hostinger web hosting plan for this setup. A domain-only registration is enough, as long as DNS is managed in hPanel.

---

## 3. Add the domain in Vercel

1. Open [vercel.com/dashboard](https://vercel.com/dashboard) and select your project.
2. Go to **Settings → Domains**.
3. Add both domains (recommended):

   | Domain | Purpose |
   |--------|---------|
   | `probably-using-console.log` | Apex / root domain |
   | `www.probably-using-console.log` | `www` subdomain |

4. Vercel will show **Invalid Configuration** until Hostinger DNS is updated — that is expected.
5. Keep this tab open. You will need the exact record values Vercel displays (they may differ slightly per project for CNAME).

Vercel issues a free SSL certificate automatically once DNS validates.

---

## 4. Configure DNS in Hostinger hPanel

There are two ways to connect a Hostinger domain to Vercel. **Method A is recommended** — you keep managing DNS in Hostinger and only change a few records.

---

### Method A — DNS records in hPanel (recommended)

Use this when you want email (Resend), Google verification, and other TXT records to stay in one place: Hostinger.

#### Step 1 — Open the DNS editor

**Domain only (no Hostinger hosting plan):**

1. Log in to [hPanel](https://hpanel.hostinger.com).
2. In the left sidebar, click **Domains → DNS**.
3. Select `probably-using-console.log`.

**Or via Domain portfolio:**

1. **Domains → Domain portfolio**
2. Click **Manage** next to your domain.
3. Open **DNS / Nameservers** in the left sidebar.
4. Go to the **DNS records** tab.

**If you also have Hostinger web hosting** for this domain, the editor may instead be at:

**Websites → [your site] → Advanced → DNS Zone Editor**

Use whichever editor shows DNS records for `probably-using-console.log`.

#### Step 2 — Remove conflicting records

Hostinger often ships default records that point your domain at their parking page or hosting IP. These **must be removed or edited** before Vercel can take over.

Look for and **delete or update** any of these that conflict:

| Type | Name | Problem |
|------|------|---------|
| `A` | `@` | Points to a Hostinger IP instead of Vercel |
| `A` | `@` | Duplicate A records (only one should remain) |
| `CNAME` | `www` | Points to Hostinger instead of Vercel |
| `AAAA` | `@` | May conflict if pointing elsewhere |

Also check **Domains → Manage → Domain forwarding** (if enabled). Turn off any forwarding to another URL — it can override DNS and break Vercel routing.

#### Step 3 — Add Vercel records

Add or update these records in **Manage DNS records**:

**Apex domain (`probably-using-console.log`)**

| Field | Value |
|-------|-------|
| Type | `A` |
| Name | `@` |
| Points to | `76.76.21.21` |
| TTL | `14400` (default) or leave as-is |

**`www` subdomain**

| Field | Value |
|-------|-------|
| Type | `CNAME` |
| Name | `www` |
| Points to | `cname.vercel-dns.com` |
| TTL | Default |

> Vercel may show a project-specific CNAME (e.g. `d1d4fc829fe7bc7c.vercel-dns-017.com`) instead of `cname.vercel-dns.com`. **Always use the value shown in your Vercel Domains dashboard** — it overrides this generic example.

Click **Add Record** (or **Update** if editing an existing row) for each entry.

#### Step 4 — Leave email records alone (for now)

Do **not** delete Hostinger's default MX records unless you are moving email to another provider (e.g. Resend, Google Workspace). Default Hostinger MX records look like:

```
mx1.hostinger.com
mx2.hostinger.com
```

Your **website** DNS change does not affect those unless you remove them.

#### Step 5 — Wait for propagation

Hostinger states DNS changes can take **up to 24 hours** to propagate globally. In practice, many updates appear within **15–60 minutes**.

Check progress:

- **Vercel → Settings → Domains** — status changes to **Valid Configuration**
- [dnschecker.org](https://dnschecker.org) — query `A` for `probably-using-console.log` and `CNAME` for `www.probably-using-console.log`

---

### Method B — Vercel nameservers (alternative)

Use this only if you want Vercel to manage **all** DNS, or if you need wildcard subdomains (`*.probably-using-console.log`).

1. In **Vercel → Settings → Domains**, add the domain and choose the nameserver option when offered.
2. Vercel will provide nameservers, typically:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. In **Hostinger hPanel → Domains → Manage → DNS / Nameservers**:
   - Click **Change nameservers**
   - Select **Change nameservers** (not "Use Hostinger nameservers")
   - Enter Vercel's nameserver values
   - Save
4. Manage all future DNS records (A, CNAME, TXT, MX) in **Vercel → Domains → [your domain] → DNS**.

**Trade-off:** After switching nameservers, the Hostinger DNS editor becomes inactive. Any TXT records for Google Search Console or Resend must be added in Vercel instead.

---

## 5. Choose apex vs www

Pick one URL as your **canonical** address:

| Canonical choice | Set `NEXT_PUBLIC_SITE_URL` to | Redirect |
|------------------|----------------------------------|----------|
| Apex (recommended) | `https://probably-using-console.log` | `www` → apex |
| `www` | `https://www.probably-using-console.log` | apex → `www` |

In **Vercel → Settings → Domains**, set your preferred domain as **Primary**. When both apex and `www` are added, Vercel redirects the non-primary to the primary automatically.

```env
NEXT_PUBLIC_SITE_URL=https://probably-using-console.log
```

No trailing slash.

---

## 6. Update environment variables on Vercel

After Hostinger DNS shows **Valid Configuration** in Vercel:

| Variable | Value | Scope |
|----------|-------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://probably-using-console.log` | Production |

**Vercel Dashboard:** Project → **Settings → Environment Variables** → edit or add the variable.

**Vercel CLI:**

```bash
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Enter: https://probably-using-console.log
```

`NEXT_PUBLIC_*` variables are embedded at **build time**. You must **redeploy** after changing them.

---

## 7. Redeploy and verify

### Redeploy

**Dashboard:** Deployments → latest → **⋯ → Redeploy**

**CLI:**

```bash
vercel --prod
```

### Verification

| Check | Expected |
|-------|----------|
| `https://probably-using-console.log` | Site loads with valid HTTPS |
| `https://www.probably-using-console.log` | Redirects to apex (if configured) |
| `/sitemap.xml` | All URLs use `https://probably-using-console.log` |
| `/robots.txt` | `Sitemap:` and `Host:` use custom domain |
| Page source on `/blog` | `canonical` and `og:url` use custom domain |
| `/admin`, `/contact` | Still work |

```bash
curl -s https://probably-using-console.log/sitemap.xml | head -20
curl -s https://probably-using-console.log/robots.txt
```

---

## 8. Optional: Google Search Console (Hostinger TXT)

1. In [Google Search Console](https://search.google.com/search-console), add property `https://probably-using-console.log`.
2. Choose **Domain** or **URL prefix** verification.
3. For **DNS TXT** verification, Google gives a record like:

   | Type | Name | Value |
   |------|------|-------|
   | `TXT` | `@` | `google-site-verification=...` |

4. Add it in **Hostinger hPanel → Domains → DNS → Manage DNS records**.
5. Wait for propagation (up to 24 h), then click **Verify** in Search Console.
6. Submit sitemap: `https://probably-using-console.log/sitemap.xml`.

**Alternative — HTML meta tag:** set `GOOGLE_SITE_VERIFICATION` in Vercel env (content value only), redeploy, then verify in Search Console. No Hostinger DNS change needed.

---

## 9. Optional: Resend email on your domain

Website DNS (Vercel) and email DNS (Resend) are separate. Both can live in Hostinger hPanel.

1. Add `probably-using-console.log` in [Resend → Domains](https://resend.com/domains).
2. Resend provides SPF and DKIM records (TXT/CNAME). Add them in **Hostinger → Domains → DNS** alongside your Vercel records — they do not conflict.
3. Wait for Resend domain verification.
4. Update Vercel env:

   ```env
   RESEND_FROM_EMAIL=hello@probably-using-console.log
   ```

5. Redeploy.

Until verified, keep `RESEND_FROM_EMAIL=onboarding@resend.dev` for testing.

---

## 10. Troubleshooting (Hostinger)

### Vercel still shows "Invalid Configuration"

- Confirm nameservers are **Hostinger's** (not Vercel's unless you chose Method B).
- In hPanel, verify the `A` record for `@` is exactly `76.76.21.21` with no extra spaces.
- Verify `CNAME` for `www` matches what Vercel shows in your project dashboard.
- Remove duplicate or old `A` / `CNAME` records for `@` and `www`.
- Check [dnschecker.org](https://dnschecker.org) — if some regions show old values, wait for propagation.

### `www` works but apex (`probably-using-console.log`) does not

This is a common Hostinger + Vercel issue. The `www` CNAME is correct but the apex `A` record is missing or still pointing at Hostinger.

- Edit the `@` **A record** to `76.76.21.21`.
- Delete any second `A` record for `@` pointing at a Hostinger IP.

### Site shows Hostinger parking page or "Coming soon"

- Default Hostinger **A record** was not updated.
- **Domain forwarding** may be enabled — disable it under **Domains → Manage**.
- Clear browser cache or test in a private window.

### SSL certificate pending on Vercel

- DNS must validate first. Fix Hostinger records, then wait up to an hour.
- Do not enable **DNSSEC** in Hostinger while waiting — it can delay verification. Disable it under **DNS / Nameservers → DNSSEC** if enabled.

### hPanel DNS editor is greyed out or missing

- Your domain may use **external nameservers**. Check **DNS / Nameservers** — if they are Vercel or Cloudflare, edit records there instead.
- Switch back to Hostinger nameservers if you intend to use Method A.

### Sitemap still shows `vercel.app` URLs

- `NEXT_PUBLIC_SITE_URL` was not updated or production was not redeployed.
- Fix the env var and run `vercel --prod`.

### Contact form stopped working

- Unrelated to website DNS. Check `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in Vercel.
- If you changed `RESEND_FROM_EMAIL` to your domain, ensure Resend domain verification passed and DNS records exist in Hostinger.

### Made a mistake in DNS

Hostinger lets you reset DNS to defaults:

**DNS records tab → Reset DNS records** (bottom of page)

⚠️ This restores Hostinger defaults and removes your Vercel records. You will need to re-add the Vercel A and CNAME entries afterward.

You can also **export** your zone first (**Export** button) as a backup before editing.

---

## 11. Quick checklist

```
[ ] Domain registered at Hostinger, accessible in hPanel
[ ] Nameservers are Hostinger (ns1.dns-parking.com / ns2.dns-parking.com or similar)
[ ] Domain forwarding disabled (if any)
[ ] Domain added in Vercel → Settings → Domains (apex + www)
[ ] Old Hostinger A record for @ removed or updated → 76.76.21.21
[ ] CNAME for www → cname.vercel-dns.com (or Vercel project CNAME)
[ ] Vercel shows "Valid Configuration"
[ ] Primary domain set in Vercel (apex recommended)
[ ] NEXT_PUBLIC_SITE_URL=https://probably-using-console.log in Vercel Production
[ ] Production redeploy triggered
[ ] https://probably-using-console.log loads with valid SSL
[ ] /sitemap.xml and /robots.txt use custom domain
[ ] /admin, /blog, /contact tested
[ ] (Optional) Google TXT record added in Hostinger DNS
[ ] (Optional) Resend SPF/DKIM added in Hostinger DNS + RESEND_FROM_EMAIL updated
```

---

## Related docs

- [DEPLOYMENT.md](./DEPLOYMENT.md) — Supabase, Resend, and first Vercel deploy
- [.env.example](./.env.example) — all environment variables
- [Hostinger: Manage DNS records](https://www.hostinger.com/support/1583249-how-to-manage-dns-records-at-hostinger/)
- [Hostinger: DNS zone editor](https://www.hostinger.com/support/how-to-use-hostingers-dns-zone-editor/)
- [Vercel: Add a domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)

---

## Summary

1. Add `probably-using-console.log` and `www.probably-using-console.log` in **Vercel → Settings → Domains**.
2. In **Hostinger hPanel → Domains → DNS**, set `@` A → `76.76.21.21` and `www` CNAME → Vercel's target.
3. Remove conflicting Hostinger default records and disable domain forwarding.
4. Set `NEXT_PUBLIC_SITE_URL=https://probably-using-console.log` on Vercel and **redeploy**.
5. Verify SSL, sitemap, and robots.txt on the custom domain.

Your `*.vercel.app` URL will still work unless you remove it. For SEO, always treat the Hostinger domain as canonical and keep `NEXT_PUBLIC_SITE_URL` in sync.
