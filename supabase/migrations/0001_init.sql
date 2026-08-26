-- Mainlagi TV Motion Learning Hub — initial schema (Supabase/PostgreSQL)
-- Target: Supabase. Uses pgcrypto, auth.uid(), RLS.
-- Run via: supabase db push  (or apply through Supabase SQL editor).

create extension if not exists pgcrypto;

-- ── profiles ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  phone text,
  role text not null default 'user' check (role in ('user','admin','owner')),
  locale text not null default 'id',
  theme text not null default 'system' check (theme in ('system','light','dark')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── player profiles ─────────────────────────────────────────────────────
create table if not exists public.player_profiles (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.profiles(id) on delete cascade,
  alias text not null,
  age_group text,
  grade text,
  avatar_key text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── games (catalog, optional DB-backed copy of static config) ───────────
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_title text,
  description text,
  category text,
  age text,
  player_options int[] not null default '{1}',
  vision_mode text not null default 'hand',
  duration text,
  difficulty text,
  capabilities text[] not null default '{}',
  status text not null default 'ready' check (status in ('ready','beta','draft')),
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── game sessions ───────────────────────────────────────────────────────
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.profiles(id) on delete cascade,
  player_profile_id uuid references public.player_profiles(id) on delete set null,
  game_slug text not null,
  input_mode text not null default 'camera',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  nonce text,
  client_version text,
  metadata jsonb not null default '{}'::jsonb
);

-- ── game scores ─────────────────────────────────────────────────────────
create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  account_id uuid not null references public.profiles(id) on delete cascade,
  player_profile_id uuid references public.player_profiles(id) on delete set null,
  game_slug text not null,
  score integer not null check (score >= 0),
  duration_seconds integer,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected')),
  created_at timestamptz not null default now()
);

-- ── leaderboard seasons ─────────────────────────────────────────────────
create table if not exists public.leaderboard_seasons (
  id uuid primary key default gen_random_uuid(),
  week_key text not null unique,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'active' check (status in ('active','closed')),
  created_at timestamptz not null default now()
);

-- ── leaderboard entries ─────────────────────────────────────────────────
create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.leaderboard_seasons(id) on delete cascade,
  game_slug text not null,
  account_id uuid not null references public.profiles(id) on delete cascade,
  player_profile_id uuid references public.player_profiles(id) on delete set null,
  score integer not null check (score >= 0),
  rank integer,
  created_at timestamptz not null default now()
);
create index if not exists idx_leaderboard_entries_season_game
  on public.leaderboard_entries(season_id, game_slug, score desc);

-- ── progress (best score per account per game, kept for compat) ─────────
create table if not exists public.progress (
  account_id uuid not null references public.profiles(id) on delete cascade,
  game_slug text not null,
  best_score integer not null default 0,
  completed_rounds integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (account_id, game_slug)
);

-- ── articles ────────────────────────────────────────────────────────────
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  author text,
  category text,
  tags text[] not null default '{}',
  cover_image text,
  locale text not null default 'id',
  status text not null default 'draft' check (status in ('draft','published')),
  canonical_url text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.article_relations (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  relation_type text not null check (relation_type in ('game','article')),
  target_slug text not null,
  created_at timestamptz not null default now()
);

-- ── affiliate products ──────────────────────────────────────────────────
-- platform/category kept (not just slug/title/image/destination) because
-- src/app/api/affiliate/route.ts, src/app/go/[slug]/route.ts, and
-- src/lib/data/affiliate.ts all read/write these columns today. A future
-- Shopee-only simplification (docs/prd.md 11.1) is a separate, deliberate
-- app-code change, not something to do silently here.
create table if not exists public.affiliate_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  platform text not null default 'Shopee' check (platform in ('Shopee','TikTok Shop')),
  category text not null default 'Perlengkapan belajar',
  image_url text not null,
  destination_url text not null,
  active boolean not null default true,
  sort_order integer not null default 100,
  disclosure text,
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

-- ── audit log ───────────────────────────────────────────────────────────
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ── RLS ─────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.player_profiles enable row level security;
alter table public.games enable row level security;
alter table public.game_sessions enable row level security;
alter table public.game_scores enable row level security;
alter table public.progress enable row level security;
alter table public.leaderboard_seasons enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.articles enable row level security;
alter table public.article_relations enable row level security;
alter table public.affiliate_items enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','owner'));
$$;

-- Profiles: owner reads/updates self; owner role can read all admin data.
drop policy if exists "profiles own select" on public.profiles;
create policy "profiles own select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "player profiles own" on public.player_profiles;
create policy "player profiles own" on public.player_profiles
  for all using (account_id = auth.uid()) with check (account_id = auth.uid());

drop policy if exists "games public read" on public.games;
create policy "games public read" on public.games
  for select using (status <> 'draft' or public.is_admin());

drop policy if exists "sessions own" on public.game_sessions;
create policy "sessions own" on public.game_sessions
  for all using (account_id = auth.uid()) with check (account_id = auth.uid());

drop policy if exists "scores own" on public.game_scores;
create policy "scores own" on public.game_scores
  for all using (account_id = auth.uid()) with check (account_id = auth.uid());

drop policy if exists "progress own" on public.progress;
create policy "progress own" on public.progress
  for all using (account_id = auth.uid()) with check (account_id = auth.uid());

-- Leaderboard: public may read entries; entries are populated server-side
-- only from verified scores, so exposing them publicly is safe.
drop policy if exists "leaderboard public read" on public.leaderboard_entries;
create policy "leaderboard public read" on public.leaderboard_entries
  for select using (true);

drop policy if exists "seasons public read" on public.leaderboard_seasons;
create policy "seasons public read" on public.leaderboard_seasons
  for select using (true);

-- Articles: public reads published.
drop policy if exists "articles public read" on public.articles;
create policy "articles public read" on public.articles
  for select using (status = 'published' or public.is_admin());
drop policy if exists "article relations public read" on public.article_relations;
create policy "article relations public read" on public.article_relations
  for select using (true);

-- Affiliate: public reads active, only owner writes; owner can also read clicks.
drop policy if exists "affiliate public read" on public.affiliate_items;
create policy "affiliate public read" on public.affiliate_items
  for select using (active = true or public.is_admin());
drop policy if exists "affiliate owner write" on public.affiliate_items;
create policy "affiliate owner write" on public.affiliate_items
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "affiliate click insert" on public.affiliate_clicks;
drop policy if exists "affiliate click owner read" on public.affiliate_clicks;
create policy "affiliate click owner read" on public.affiliate_clicks
  for select using (public.is_admin());
-- No insert policy: src/app/go/[slug]/route.ts writes affiliate_clicks
-- server-side with SUPABASE_SERVICE_ROLE_KEY (bypasses RLS/grants). Blocking
-- anon/authenticated insert below keeps click logging rate-limitable and
-- spam-resistant, matching docs/prd.md 16.2 ("rate limit on ... redirect
-- logging") and the intent already documented for SUPABASE_SERVICE_ROLE_KEY
-- in .env.example.
revoke insert on public.affiliate_clicks from anon, authenticated;

-- Audit: owner only.
drop policy if exists "audit owner read" on public.audit_logs;
create policy "audit owner read" on public.audit_logs
  for select using (public.is_admin());

-- Users may edit only their display name / phone / locale / theme.
revoke update on public.profiles from anon, authenticated;
grant update (display_name, phone, locale, theme) on public.profiles to authenticated;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,email,display_name)
  values(new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1)))
  on conflict(id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Season/score helpers (used by server, not client).

create or replace function public.week_key_for(timestamptz) returns text
language sql immutable as $$
  select to_char($1 at time zone 'Asia/Jakarta', 'IYYY-"W"IW');
$$;

create or replace function public.ensure_active_season() returns uuid
language plpgsql security definer set search_path = public as $$
declare
  season_start timestamptz;
  season_end timestamptz;
  existing uuid;
  wk text;
begin
  wk := public.week_key_for(now());
  existing := (select id from public.leaderboard_seasons where week_key = wk);
  if existing is not null then return existing; end if;
  season_start := date_trunc('week', now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta';
  season_end := season_start + interval '7 days';
  insert into public.leaderboard_seasons(week_key, starts_at, ends_at)
  values (wk, season_start, season_end)
  returning id into existing;
  return existing;
end; $$;

create or replace function public.record_best_score(p_game_slug text, p_score integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  insert into public.progress(account_id, game_slug, best_score, completed_rounds, updated_at)
  values(auth.uid(), p_game_slug, greatest(0, p_score), 0, now())
  on conflict(account_id, game_slug) do update
    set best_score = greatest(public.progress.best_score, excluded.best_score),
        updated_at = now();
end; $$;
revoke all on function public.record_best_score(text, integer) from public;
grant execute on function public.record_best_score(text, integer) to authenticated;
