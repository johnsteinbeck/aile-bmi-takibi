create extension if not exists pgcrypto;

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  age integer,
  height_cm numeric(5, 2),
  gender text check (gender in ('kadın', 'erkek') or gender is null),
  created_at timestamptz not null default now()
);

create table if not exists public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  entry_date date not null,
  kg numeric(5, 2) not null,
  created_at timestamptz not null default now(),
  unique (person_id, entry_date)
);

alter table public.people enable row level security;
alter table public.weight_entries enable row level security;

grant usage on schema public to anon;
grant select, insert, update, delete on public.people to anon;
grant select, insert, update, delete on public.weight_entries to anon;

drop policy if exists "family can read people" on public.people;
drop policy if exists "family can add people" on public.people;
drop policy if exists "family can update people" on public.people;
drop policy if exists "family can delete people" on public.people;
drop policy if exists "family can read weights" on public.weight_entries;
drop policy if exists "family can add weights" on public.weight_entries;
drop policy if exists "family can update weights" on public.weight_entries;
drop policy if exists "family can delete weights" on public.weight_entries;

create policy "family can read people"
  on public.people for select
  to anon
  using (true);

create policy "family can add people"
  on public.people for insert
  to anon
  with check (true);

create policy "family can update people"
  on public.people for update
  to anon
  using (true)
  with check (true);

create policy "family can delete people"
  on public.people for delete
  to anon
  using (true);

create policy "family can read weights"
  on public.weight_entries for select
  to anon
  using (true);

create policy "family can add weights"
  on public.weight_entries for insert
  to anon
  with check (true);

create policy "family can update weights"
  on public.weight_entries for update
  to anon
  using (true)
  with check (true);

create policy "family can delete weights"
  on public.weight_entries for delete
  to anon
  using (true);
