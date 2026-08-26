import type {
  AffiliateItem,
  GameScore,
  GameSession,
  LeaderboardEntry,
  LeaderboardSeason,
  PlayerProfile,
  Profile
} from "../domain";
import { AFFILIATE_ITEMS } from "../affiliate";
import { ARTICLES } from "../content";
import { RepoError, type DataRepositories } from "../repositories/contracts";

function today(): string {
  return new Date().toISOString();
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function persistence(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** Read/write a small collection through localStorage so mock data survives a reload. */
function table<T>(key: string, seed: T[]): { read(): T[]; write(rows: T[]): void } {
  const full = `mainlagi-mock-${key}`;
  const read = (): T[] => {
    const store = persistence();
    if (!store) return seed;
    try {
      const raw = store.getItem(full);
      return raw ? (JSON.parse(raw) as T[]) : seed;
    } catch {
      return seed;
    }
  };
  const write = (rows: T[]): void => {
    persistence()?.setItem(full, JSON.stringify(rows));
  };
  return { read, write };
}

const products: AffiliateItem[] = AFFILIATE_ITEMS.map((item) => ({
  id: `affiliate-${item.slug}`,
  slug: item.slug,
  title: item.title,
  imageUrl: item.image,
  destinationUrl: item.href,
  active: true,
  sortOrder: 0,
  disclosure: item.note
}));

/** Build all in-memory repositories. */
export function createMockRepositories(): DataRepositories {
  const profiles = table<Profile>("profiles", []);
  const playerProfiles = table<PlayerProfile>("player-profiles", []);
  const sessions = table<GameSession>("sessions", []);
  const scores = table<GameScore>("scores", []);
  const seasons = table<LeaderboardSeason>("seasons", []);
  const entries = table<LeaderboardEntry>("entries", []);

  const season = (): LeaderboardSeason => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const day = start.getDay();
    const diff = (day + 6) % 7; // Monday start
    start.setDate(start.getDate() - diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    const weekKey = `${start.getFullYear()}-W${String(
      Math.ceil(((start.getTime() - new Date(start.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7)
    ).padStart(2, "0")}`;
    return { id: weekKey, weekKey, startsAt: start.toISOString(), endsAt: end.toISOString(), status: "active" };
  };

  const entriesForSeason = (seasonId: string, gameSlug: string): LeaderboardEntry[] =>
    entries
      .read()
      .filter((e) => e.seasonId === seasonId && e.gameSlug === gameSlug)
      .sort((a, b) => b.score - a.score)
      .map((e, i) => ({ ...e, rank: i + 1 }));

  return {
    profiles: {
      async current() {
        return profiles.read()[0] ?? null;
      },
      async update(id, patch) {
        const rows = profiles.read();
        let updated: Profile | null = null;
        const next = rows.map((p) => {
          if (p.id !== id) return p;
          updated = { ...p, ...patch, updatedAt: today() };
          return updated;
        });
        profiles.write(next);
        if (!updated) throw new RepoError("Profile not found");
        return updated;
      }
    },

    players: {
      async list(accountId) {
        return playerProfiles.read().filter((p) => p.accountId === accountId && !p.deletedAt);
      },
      async create(accountId, input) {
        const row: PlayerProfile = {
          id: uid("player"),
          accountId,
          alias: input.alias,
          ageGroup: input.ageGroup ?? null,
          grade: input.grade ?? null,
          avatarKey: input.avatarKey ?? null,
          createdAt: today(),
          deletedAt: null
        };
        playerProfiles.write([...playerProfiles.read(), row]);
        return row;
      },
      async update(id, patch) {
        const rows = playerProfiles.read();
        let updated: PlayerProfile | null = null;
        const next = rows.map((p) => {
          if (p.id !== id) return p;
          updated = { ...p, ...patch };
          return updated;
        });
        playerProfiles.write(next);
        if (!updated) throw new RepoError("Player not found");
        return updated;
      },
      async remove(id) {
        playerProfiles.write(
          playerProfiles.read().map((p) => (p.id === id ? { ...p, deletedAt: today() } : p))
        );
      }
    },

    scores: {
      async createSession(accountId, input) {
        const row: GameSession = {
          id: uid("session"),
          accountId,
          playerProfileId: input.playerProfileId ?? null,
          gameSlug: input.gameSlug,
          inputMode: input.inputMode,
          startedAt: today(),
          completedAt: null,
          nonce: input.nonce ?? null,
          clientVersion: input.clientVersion ?? null
        };
        sessions.write([...sessions.read(), row]);
        return row;
      },
      async completeSession(sessionId) {
        const rows = sessions.read();
        let updated: GameSession | null = null;
        const next = rows.map((s) => {
          if (s.id !== sessionId) return s;
          updated = { ...s, completedAt: today() };
          return updated;
        });
        sessions.write(next);
        if (!updated) throw new RepoError("Session not found");
        return updated;
      },
      async submitScore(sessionId, score, durationSeconds) {
        const session = sessions.read().find((s) => s.id === sessionId);
        if (!session) throw new RepoError("Session not found");
        const row: GameScore = {
          id: uid("score"),
          sessionId,
          accountId: session.accountId,
          playerProfileId: session.playerProfileId,
          gameSlug: session.gameSlug,
          score: Math.max(0, Math.round(score)),
          durationSeconds: durationSeconds ?? null,
          verificationStatus: "verified",
          createdAt: today()
        };
        scores.write([...scores.read(), row]);
        return row;
      },
      async scoresFor(accountId, gameSlug) {
        return scores.read().filter((s) => s.accountId === accountId && (!gameSlug || s.gameSlug === gameSlug));
      },
      async bestPersonal(accountId, gameSlug) {
        return scores
          .read()
          .filter((s) => s.accountId === accountId && s.gameSlug === gameSlug)
          .reduce((max, s) => Math.max(max, s.score), 0);
      }
    },

    leaderboards: {
      async currentSeason() {
        const current = seasons.read().find((s) => s.status === "active");
        return current ?? season();
      },
      async entries(seasonId, gameSlug) {
        return entriesForSeason(seasonId, gameSlug);
      },
      async entryFor(seasonId, gameSlug, accountId) {
        return entriesForSeason(seasonId, gameSlug).find((e) => e.accountId === accountId) ?? null;
      }
    },

    articles: {
      async listPublished(locale = "id") {
        return ARTICLES.filter((a) => a.status === "published" && a.locale === locale);
      },
      async bySlug(slug) {
        return ARTICLES.find((a) => a.slug === slug && a.status === "published") ?? null;
      },
      async related() {
        return [];
      }
    },

    products: {
      async listActive() {
        return products.filter((p) => p.active);
      },
      async recordClick(itemId, referrer, userAgentHash) {
        return { id: Date.now(), affiliateItemId: itemId, createdAt: today(), referrer, userAgentHash };
      }
    },

    audit: {
      async log() {}
    }
  };
}
