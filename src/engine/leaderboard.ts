/**
 * Hub leaderboard.
 *
 * A thin wrapper over the shared core's Leaderboard so every game in the hub
 * uses the same storage key scheme and the same score shape. Kept separate from
 * `progress.ts` (which stores personal bests) because a leaderboard is a
 * ranking of named runs, not a single best number per game.
 */

// Relative, not the "@/" alias: tsconfig.engine.json compiles this file without
// path mapping, the same way the other engine modules import each other.
import { Leaderboard, type ScoreEntry } from "../lib/vision-core/leaderboard";
import { GAME_REGISTRY } from "./registry";
import { GAME_IDS, type GameId } from "./types";

const PREFIX = "mlh.leaderboard.v1";
const NAME_KEY = "mlh.player-name.v1";

export type { ScoreEntry };

export function boardFor(gameId: GameId): Leaderboard {
  return new Leaderboard(`${PREFIX}.${gameId}`, { limit: 10 });
}

export interface BoardSummary {
  gameId: GameId;
  title: string;
  color: string;
  entries: ScoreEntry[];
}

/** Every game's board, in registry order, for the leaderboard page. */
export function allBoards(): BoardSummary[] {
  return GAME_IDS.map((gameId) => ({
    gameId,
    title: GAME_REGISTRY[gameId].shortTitle,
    color: GAME_REGISTRY[gameId].color,
    entries: boardFor(gameId).list()
  }));
}

/**
 * Remember the player's name between runs.
 *
 * Retyping a name with a hand-tracking camera in front of you is genuinely
 * annoying, and a leaderboard full of "Pemain" entries is worthless.
 */
export function readPlayerName(): string {
  try {
    if (typeof localStorage === "undefined") return "";
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch { return ""; }
}

export function writePlayerName(name: string): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(NAME_KEY, name.trim().slice(0, 18));
  } catch { /* storage blocked - the name simply is not remembered */ }
}
