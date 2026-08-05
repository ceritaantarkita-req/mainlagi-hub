// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Local leaderboard.
 *
 * Scores live in the browser. That is a deliberate product decision, not a
 * shortcut: these apps are sold as self-contained repositories, and a buyer who
 * clones one should get a working leaderboard without provisioning a database
 * or signing up for anything.
 *
 * The storage backend is behind an interface so it can be swapped for a server
 * later without touching a single component. `createMemoryStorage` also lets the
 * whole thing run under Node during tests, where `localStorage` does not exist.
 */

export interface ScoreEntry {
  /** Player-entered display name. */
  name: string;
  score: number;
  /** Epoch milliseconds. */
  at: number;
  /** Optional free-form tag, e.g. the level or game mode the score came from. */
  mode?: string;
  /** Extra per-game numbers, e.g. correct/wrong counts. */
  detail?: Record<string, number>;
}

export interface LeaderboardStorage {
  read(key: string): string | null;
  write(key: string, value: string): void;
}

/** Backend for tests and server-side rendering. */
export function createMemoryStorage(): LeaderboardStorage {
  const map = new Map<string, string>();
  return {
    read: (key) => map.get(key) ?? null,
    write: (key, value) => { map.set(key, value); }
  };
}

/**
 * Browser backend.
 *
 * Every call is guarded: localStorage throws in private-browsing modes and when
 * the quota is exhausted, and a leaderboard is never important enough to take
 * the whole app down with it.
 */
export function createBrowserStorage(): LeaderboardStorage {
  return {
    read(key) {
      try {
        if (typeof localStorage === "undefined") return null;
        return localStorage.getItem(key);
      } catch { return null; }
    },
    write(key, value) {
      try {
        if (typeof localStorage === "undefined") return;
        localStorage.setItem(key, value);
      } catch { /* full or blocked - the score is simply not kept */ }
    }
  };
}

export interface LeaderboardOptions {
  storage?: LeaderboardStorage;
  /** How many entries to keep per board. */
  limit?: number;
}

export class Leaderboard {
  private readonly storage: LeaderboardStorage;
  private readonly limit: number;

  constructor(private readonly key: string, options: LeaderboardOptions = {}) {
    this.storage =
      options.storage ??
      (typeof localStorage === "undefined" ? createMemoryStorage() : createBrowserStorage());
    this.limit = options.limit ?? 10;
  }

  list(): ScoreEntry[] {
    const raw = this.storage.read(this.key);
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Validate rather than trust: this data is user-writable via devtools, and
      // a malformed entry would otherwise crash the render of the whole board.
      return parsed
        .filter((entry): entry is ScoreEntry =>
          typeof entry === "object" && entry !== null &&
          typeof (entry as ScoreEntry).name === "string" &&
          Number.isFinite((entry as ScoreEntry).score) &&
          Number.isFinite((entry as ScoreEntry).at))
        .sort((a, b) => b.score - a.score || a.at - b.at)
        .slice(0, this.limit);
    } catch { return []; }
  }

  /** Adds a score and returns the new board plus this entry's 1-based rank. */
  submit(entry: ScoreEntry): { entries: ScoreEntry[]; rank: number | null } {
    const clean: ScoreEntry = {
      name: entry.name.trim().slice(0, 18) || "Pemain",
      score: Math.max(0, Math.round(entry.score)),
      at: Number.isFinite(entry.at) ? entry.at : Date.now(),
      ...(entry.mode ? { mode: entry.mode } : {}),
      ...(entry.detail ? { detail: entry.detail } : {})
    };
    const next = [...this.list(), clean]
      .sort((a, b) => b.score - a.score || a.at - b.at)
      .slice(0, this.limit);
    this.storage.write(this.key, JSON.stringify(next));

    const index = next.findIndex((candidate) =>
      candidate.at === clean.at && candidate.name === clean.name && candidate.score === clean.score);
    return { entries: next, rank: index >= 0 ? index + 1 : null };
  }

  /** True when this score would earn a place on the board. */
  qualifies(score: number): boolean {
    const entries = this.list();
    if (entries.length < this.limit) return true;
    return score > (entries[entries.length - 1]?.score ?? 0);
  }

  clear(): void {
    this.storage.write(this.key, "[]");
  }
}
