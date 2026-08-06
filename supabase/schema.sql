-- Mainlagi TV / Motion Learning Hub V2
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.player_profiles (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.profiles(id) on delete cascade,
  alias text not null,
  age_group text,
  grade text,
  created_at timestamptz not null default now()
);
create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.profiles(id) on delete cascade,
  player_profile_id uuid references public.player_profiles(id) on delete set null,
  game_slug text not null,
  score integer not null check (score >= 0),
  duration_seconds integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.progress (
  account_id uuid not null references public.profiles(id) on delete cascade,
  game_slug text not null,
  best_score integer not null default 0,
  completed_rounds integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (account_id, game_slug)
);
create table if not exists public.affiliate_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  platform text not null check (platform in ('Shopee','TikTok Shop')),
  category text not null,
  image_url text not null,
  destination_url text not null,
  active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.affiliate_clicks (
  id bigint generated always as identity primary key,
  affiliate_item_id uuid not null references public.affiliate_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  referrer text,
  user_agent_hash text
);

alter table public.profiles enable row level security;
alter table public.player_profiles enable row level security;
alter table public.game_scores enable row level security;
alter table public.progress enable row level security;
alter table public.affiliate_items enable row level security;
alter table public.affiliate_clicks enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "profiles own select" on public.profiles;
drop policy if exists "profiles own update" on public.profiles;
drop policy if exists "player profiles own" on public.player_profiles;
drop policy if exists "scores own select" on public.game_scores;
drop policy if exists "scores own insert" on public.game_scores;
drop policy if exists "progress own" on public.progress;
drop policy if exists "affiliate public read" on public.affiliate_items;
drop policy if exists "affiliate admin write" on public.affiliate_items;
drop policy if exists "affiliate click insert" on public.affiliate_clicks;
drop policy if exists "affiliate click admin read" on public.affiliate_clicks;

create policy "profiles own select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "player profiles own" on public.player_profiles
  for all using (account_id = auth.uid()) with check (account_id = auth.uid());
create policy "scores own select" on public.game_scores
  for select using (account_id = auth.uid() or public.is_admin());
create policy "scores own insert" on public.game_scores
  for insert with check (account_id = auth.uid());
create policy "progress own" on public.progress
  for all using (account_id = auth.uid()) with check (account_id = auth.uid());
create policy "affiliate public read" on public.affiliate_items
  for select using (active = true or public.is_admin());
create policy "affiliate admin write" on public.affiliate_items
  for all using (public.is_admin()) with check (public.is_admin());
create policy "affiliate click admin read" on public.affiliate_clicks
  for select using (public.is_admin());

-- Users may edit only their display name. The role column is deliberately not
-- writable by authenticated clients, preventing self-promotion to admin.
revoke update on public.profiles from anon, authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Click events are written only by the server route with the service-role key.
revoke insert on public.affiliate_clicks from anon, authenticated;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,email,display_name)
  values(new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1)))
  on conflict(id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.record_best_score(p_game_slug text, p_score integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  insert into public.progress(account_id, game_slug, best_score, completed_rounds, updated_at)
  values(auth.uid(), p_game_slug, greatest(0, p_score), 0, now())
  on conflict(account_id, game_slug) do update
    set best_score = greatest(public.progress.best_score, excluded.best_score),
        updated_at = now();
end;
$$;
revoke all on function public.record_best_score(text, integer) from public;
grant execute on function public.record_best_score(text, integer) to authenticated;
