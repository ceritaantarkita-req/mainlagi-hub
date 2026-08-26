/**
 * Domain entities for the data layer.
 *
 * These mirror the Supabase schema in `supabase/migrations/0001_init.sql`.
 * The repository implementations (mock now, Supabase later) both map to these
 * shapes, so the UI never sees a backend-specific row.
 */

export type Role = "user" | "admin" | "owner";
export type Theme = "system" | "light" | "dark";

export interface Profile {
  id: string;
  email: string | null;
  displayName: string | null;
  phone: string | null;
  role: Role;
  locale: string;
  theme: Theme;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerProfile {
  id: string;
  accountId: string;
  alias: string;
  ageGroup: string | null;
  grade: string | null;
  avatarKey: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface GameDefinitionRecord {
  id: string;
  slug: string;
  title: string;
  shortTitle: string | null;
  description: string | null;
  category: string | null;
  age: string | null;
  playerOptions: number[];
  visionMode: "hand" | "pose" | "hybrid";
  duration: string | null;
  difficulty: string | null;
  capabilities: string[];
  status: "ready" | "beta" | "draft";
  sortOrder: number;
}

export interface GameSession {
  id: string;
  accountId: string;
  playerProfileId: string | null;
  gameSlug: string;
  inputMode: string;
  startedAt: string;
  completedAt: string | null;
  nonce: string | null;
  clientVersion: string | null;
}

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface GameScore {
  id: string;
  sessionId: string;
  accountId: string;
  playerProfileId: string | null;
  gameSlug: string;
  score: number;
  durationSeconds: number | null;
  verificationStatus: VerificationStatus;
  createdAt: string;
}

export interface LeaderboardSeason {
  id: string;
  weekKey: string;
  startsAt: string;
  endsAt: string;
  status: "active" | "closed";
}

export interface LeaderboardEntry {
  id: string;
  seasonId: string;
  gameSlug: string;
  accountId: string;
  playerProfileId: string | null;
  score: number;
  rank: number | null;
  createdAt: string;
}

export type ArticleStatus = "draft" | "published";
export type RelationType = "game" | "article";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  category: string | null;
  tags: string[];
  coverImage: string | null;
  locale: string;
  status: ArticleStatus;
  canonicalUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  updatedAt: string;
}

export interface ArticleRelation {
  id: string;
  articleId: string;
  relationType: RelationType;
  targetSlug: string;
}

export interface AffiliateItem {
  id: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  destinationUrl: string;
  active: boolean;
  sortOrder: number;
  disclosure: string | null;
}

export interface AffiliateClick {
  id: number;
  affiliateItemId: string;
  createdAt: string;
  referrer: string | null;
  userAgentHash: string | null;
}

export interface AuditLog {
  id: number;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  createdAt: string;
}
