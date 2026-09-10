-- Final performance hardening for foreign keys reported by the Supabase advisor.
-- These indexes are additive/non-destructive. Existing recently-created indexes
-- are intentionally kept even when the advisor currently reports them unused;
-- low usage on a young deployment is not sufficient evidence for deletion.

create index if not exists idx_affiliate_clicks_affiliate_item_id
  on public.affiliate_clicks (affiliate_item_id);

create index if not exists idx_article_relations_article_id
  on public.article_relations (article_id);

create index if not exists idx_audit_logs_actor_id
  on public.audit_logs (actor_id);

create index if not exists idx_game_scores_account_id
  on public.game_scores (account_id);

create index if not exists idx_game_scores_player_profile_id
  on public.game_scores (player_profile_id);

create index if not exists idx_game_scores_session_id
  on public.game_scores (session_id);

create index if not exists idx_game_sessions_account_id
  on public.game_sessions (account_id);

create index if not exists idx_game_sessions_player_profile_id
  on public.game_sessions (player_profile_id);

create index if not exists idx_leaderboard_entries_account_id
  on public.leaderboard_entries (account_id);

create index if not exists idx_leaderboard_entries_player_profile_id
  on public.leaderboard_entries (player_profile_id);

create index if not exists idx_player_profiles_account_id
  on public.player_profiles (account_id);
