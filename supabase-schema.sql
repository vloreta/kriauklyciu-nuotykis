create table if not exists public.family_data (
  id uuid primary key default gen_random_uuid(),
  "familyKey" text not null unique,
  "dataJson" jsonb not null,
  "updatedAt" timestamptz not null default now(),
  "createdAt" timestamptz not null default now()
);

alter table public.family_data enable row level security;

create policy "family_data_anon_select"
on public.family_data
for select
to anon
using (true);

create policy "family_data_anon_insert"
on public.family_data
for insert
to anon
with check (true);

create policy "family_data_anon_update"
on public.family_data
for update
to anon
using (true)
with check (true);
