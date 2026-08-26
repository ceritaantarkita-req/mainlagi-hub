import type {
  AffiliateClick,
  AffiliateItem,
  Article,
  GameScore,
  GameSession,
  LeaderboardEntry,
  LeaderboardSeason,
  PlayerProfile,
  Profile,
  VerificationStatus
} from "../domain";

/**
 * The data-layer contract.
 *
 * The UI depends on these interfaces - never on a concrete backend. Each
 * repository has a `Mock` implementation (development, in-memory) and a
 * `Supabase` implementation (production). See `docs/data-layer.md`.
 */

export class RepoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepoError";
  }
}

export interface ProfileRepository {
  current(): Promise<Profile | null>;
  update(id: string, patch: Partial<Pick<Profile, "displayName" | "phone" | "locale" | "theme">>): Promise<Profile>;
}

export interface PlayerProfileRepository {
  list(accountId: string): Promise<PlayerProfile[]>;
  create(accountId: string, input: { alias: string; ageGroup?: string | null; grade?: string | null; avatarKey?: string | null }): Promise<PlayerProfile>;
  update(id: string, patch: Partial<Pick<PlayerProfile, "alias" | "ageGroup" | "grade" | "avatarKey">>): Promise<PlayerProfile>;
  remove(id: string): Promise<void>;
}

export interface ScoreRepository {
  createSession(accountId: string, input: { gameSlug: string; inputMode: string; playerProfileId?: string | null; nonce?: string; clientVersion?: string }): Promise<GameSession>;
  completeSession(sessionId: string): Promise<GameSession>;
  submitScore(sessionId: string, score: number, durationSeconds?: number | null): Promise<GameScore>;
  scoresFor(accountId: string, gameSlug?: string): Promise<GameScore[]>;
  bestPersonal(accountId: string, gameSlug: string): Promise<number>;
}

export interface LeaderboardRepository {
  currentSeason(): Promise<LeaderboardSeason>;
  entries(seasonId: string, gameSlug: string): Promise<LeaderboardEntry[]>;
  entryFor(seasonId: string, gameSlug: string, accountId: string): Promise<LeaderboardEntry | null>;
}

export interface ArticleRepository {
  listPublished(locale?: string): Promise<Article[]>;
  bySlug(slug: string): Promise<Article | null>;
  related(articleId: string): Promise<string[]>;
}

export interface ProductRepository {
  listActive(): Promise<AffiliateItem[]>;
  recordClick(itemId: string, referrer: string | null, userAgentHash: string | null): Promise<AffiliateClick>;
}

export interface AuditRepository {
  log(actorId: string | null, action: string, entity: string, entityId?: string | null): Promise<void>;
}

export interface DataRepositories {
  profiles: ProfileRepository;
  players: PlayerProfileRepository;
  scores: ScoreRepository;
  leaderboards: LeaderboardRepository;
  articles: ArticleRepository;
  products: ProductRepository;
  audit: AuditRepository;
}

export type { VerificationStatus };
