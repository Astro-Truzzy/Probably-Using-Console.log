-- Add updated_at for accurate dateModified in JSON-LD

alter table public.posts
  add column if not exists updated_at timestamptz;

update public.posts
set updated_at = date
where updated_at is null;

alter table public.posts
  alter column updated_at set default now();

alter table public.posts
  alter column updated_at set not null;
