"use client";

import { orderEntries, rankOf } from "../engine/ranking";
import type { GameSlug } from "./games";

/**
 * Local leaderboard.
 *
 * Scores live on the device, not on a server. That is a deliberate first
 * step rather than a limitation: this app is played by one family in front
 * of one camera, so "who is top of the board" is a question about the people
 * in the room, and answering it needs no account, no network, and no moderation
 * of what a five-year-old types into a name box.
 *
 * The shape below is the same one a server-backed board would need, and the
 * write path already mirrors `useProgressSync` (write locally, then fire an
 * optional remote push that is currently a no-op). Adding Supabase later means
 * filling in `pushRemote` and adding a merge step in `readBoard` - callers do
 * not change.
 */

const STORAGE_KEY = "mainlagi-leaderboard-v1";
const NAME_KEY = "mainlagi-leaderboard-name-v1";
/** Per game. Enough for a family to see history without the list becoming a wall. */
const MAX_ENTRIES_PER_GAME = 50;
export const LEADERBOARD_EVENT = "mainlagi-leaderboard";

export interface LeaderboardEntry {
  id: string;
  game: GameSlug;
  name: string;
  score: number;
  /** Epoch ms. */
  at: number;
  /** Round length in seconds, when the game has a configurable one. */
  durationSeconds?: number;
}

type Board = Partial<Record<GameSlug, LeaderboardEntry[]>>;

function isEntry(value: unknown): value is LeaderboardEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<LeaderboardEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.game === "string" &&
    typeof entry.name === "string" &&
    typeof entry.score === "number" &&
    Number.isFinite(entry.score) &&
    typeof entry.at === "number"
  );
}

function readAll(): Board {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const board: Board = {};
    for (const [game, entries] of Object.entries(parsed as Record<string, unknown>)) {
      if (!Array.isArray(entries)) continue;
      board[game as GameSlug] = entries.filter(isEntry);
    }
    return board;
  } catch {
    // A corrupted board must never take the app down with it.
    return {};
  }
}

function writeAll(board: Board): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch {
    // Private mode / quota. The round still counts, it just is not remembered.
  }
  window.dispatchEvent(new Event(LEADERBOARD_EVENT));
}

/** Highest first, and for equal scores the older run keeps the better place. */
function ordered(entries: readonly LeaderboardEntry[]): LeaderboardEntry[] {
  return orderEntries(entries);
}

export function readBoard(game: GameSlug): LeaderboardEntry[] {
  return ordered(readAll()[game] ?? []);
}

/**
 * Every board that has at least one entry, best-first, for the home page.
 */
export function readAllBoards(): Array<{ game: GameSlug; entries: LeaderboardEntry[] }> {
  const board = readAll();
  return Object.entries(board)
    .map(([game, entries]) => ({
      game: game as GameSlug,
      entries: ordered(entries ?? [])
    }))
    .filter((item) => item.entries.length > 0);
}

/**
 * What place `score` would take, 1-based, without saving anything.
 *
 * Called while the end-of-round card is still on screen, so the child can see
 * "kamu peringkat 2" before deciding whether to bother typing a name.
 */
export function rankFor(game: GameSlug, score: number): number {
  return rankOf(readBoard(game), score);
}

export function readSavedName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NAME_KEY, name);
  } catch {
    // Not remembering the name is a small loss; never throw for it.
  }
}

/** Trim, collapse whitespace, and cap the length so one entry cannot wreck the layout. */
export function normalizeName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, 16);
}

/**
 * Reserved for a future server-backed board. Deliberately does nothing today:
 * having the call site already in place means turning the board online later
 * is a change to this function, not to every game.
 */
async function pushRemote(entry: LeaderboardEntry): Promise<void> {
  void entry;
  return;
}

export interface SubmitResult {
  entry: LeaderboardEntry;
  rank: number;
  total: number;
}

export function submitScore(
  game: GameSlug,
  name: string,
  score: number,
  durationSeconds?: number
): SubmitResult {
  const board = readAll();
  const entry: LeaderboardEntry = {
    id: `${game}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    game,
    name: normalizeName(name) || "Pemain",
    score: Math.max(0, Math.round(Number.isFinite(score) ? score : 0)),
    at: Date.now(),
    ...(typeof durationSeconds === "number" ? { durationSeconds } : {})
  };

  const next = ordered([...(board[game] ?? []), entry]).slice(
    0,
    MAX_ENTRIES_PER_GAME
  );
  board[game] = next;
  writeAll(board);
  saveName(entry.name);
  void pushRemote(entry);

  return {
    entry,
    rank: next.findIndex((item) => item.id === entry.id) + 1,
    total: next.length
  };
}

export function clearBoard(game: GameSlug): void {
  const board = readAll();
  delete board[game];
  writeAll(board);
}

export function clearAllBoards(): void {
  writeAll({});
}
