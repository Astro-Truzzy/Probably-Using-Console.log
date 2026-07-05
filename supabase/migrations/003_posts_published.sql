-- Draft / publish support for posts

alter table public.posts
  add column if not exists published boolean not null default true;

create index if not exists posts_published_date_idx
  on public.posts (published, date desc);
