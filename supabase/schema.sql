-- Supabase SQL Editor 에서 실행하세요
create extension if not exists "pgcrypto";

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  memo text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_name_idx on public.contacts (name);
create index if not exists contacts_phone_idx on public.contacts (phone);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

-- RLS: 이 앱은 로그인 없이 사용하므로 anon 에게 전체 권한을 줍니다.
-- 로그인 기능을 붙이면 아래 정책을 auth.uid() 기준으로 바꾸세요.
alter table public.contacts enable row level security;

drop policy if exists "anon full access" on public.contacts;
create policy "anon full access" on public.contacts
  for all to anon using (true) with check (true);
