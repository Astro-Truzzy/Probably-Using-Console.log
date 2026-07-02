-- Run in Supabase SQL editor or via `supabase db push`

create table if not exists public.posts (
  slug text primary key,
  title text not null,
  excerpt text,
  content text not null default '',
  author text default 'Trust Williams',
  date timestamptz not null default now(),
  read_time integer default 6,
  tags text[] default '{}',
  likes integer default 0,
  comments jsonb default '[]'::jsonb,
  cover text
);

create index if not exists posts_date_idx on public.posts (date desc);

alter table public.posts enable row level security;

create policy "Public read access"
  on public.posts
  for select
  using (true);

-- Writes go through the service role key on the server, so no public insert policy is required.
