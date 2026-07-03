# Deployment Guide

This app runs locally with JSON files. On Vercel (or any serverless host), you need **Supabase** for blog data and **Resend** for email.

## 1. Supabase setup

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and create or **restore** a project.
2. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)
3. Open **SQL Editor** and run the migration in `supabase/migrations/001_posts.sql`.
4. Seed your posts from the repo:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:posts
```

## 2. Resend setup

1. Create an account at [resend.com](https://resend.com).
2. Create an API key → `RESEND_API_KEY`.
3. For testing, use `RESEND_FROM_EMAIL=onboarding@resend.dev`.
4. Set `CONTACT_NOTIFY_EMAIL` to the inbox that should receive contact form messages.
5. Optional: create an **Audience** in Resend and set `RESEND_AUDIENCE_ID` for newsletter signups.

## 3. Vercel deployment

### Option A — GitHub (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Add these environment variables in **Project Settings → Environment Variables**:

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Your production URL, no trailing slash |
| `ADMIN_PASSWORD` | Yes | Strong password for `/admin` |
| `SUPABASE_URL` | Yes | From Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only |
| `RESEND_API_KEY` | Yes | From Resend dashboard |
| `RESEND_FROM_EMAIL` | Yes | Verified sender domain |
| `CONTACT_NOTIFY_EMAIL` | Yes | Your inbox |
| `RESEND_AUDIENCE_ID` | No | Newsletter audience |

4. Deploy. Vercel auto-detects Next.js — no extra config needed.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add ADMIN_PASSWORD
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
vercel env add CONTACT_NOTIFY_EMAIL
vercel --prod
```

## 4. Custom domain (Hostinger)

Your domain is registered at **Hostinger**. To point it at Vercel (e.g. `probably-using-console.log`), follow **[CUSTOM_DOMAIN.md](./CUSTOM_DOMAIN.md)** — hPanel DNS records, env vars, redeploy, and Hostinger-specific troubleshooting.

## 5. Post-deploy checklist

- [ ] Visit `/` and `/blog` — posts load from Supabase
- [ ] Open a post — likes and comments persist after refresh
- [ ] Log in at `/admin` and create a test post
- [ ] Submit the contact form — email arrives at `CONTACT_NOTIFY_EMAIL`
- [ ] Subscribe via newsletter on a post page
- [ ] Confirm `/robots.txt` and `/sitemap.xml` use your production URL

## Local development

Copy `.env.example` to `.env.local`. Without Supabase/Resend vars:

- Posts, comments, and likes use `Lib/posts.json`
- Contact form saves to `Lib/messages.json`
- Newsletter returns success without sending email

## Your Supabase project

A Supabase project exists under your account (`xtkdvytnarsedzvlxyeo`) but is currently **INACTIVE**. Restore it in the dashboard before running migrations or seeding.
