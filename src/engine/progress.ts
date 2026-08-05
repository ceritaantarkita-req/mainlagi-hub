import { GAME_IDS, type GameId, type LocalProgress } from "./types";

export const DEFAULT_PROGRESS: LocalProgress = {
  gamesPlayed: 0,
  completedRounds: 0,
  bestScores: {},
  lastPlayedGame: null,
  soundEnabled: true,
  reducedMotion: false
};

function isGameId(value: unknown): value is GameId {
  return typeof value === "string" && (GAME_IDS as readonly string[]).includes(value);
}

function sanitizeCounter(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}

function sanitizeBestScores(value: unknown): Partial<Record<GameId, number>> {
  if (!value || typeof value !== "object") return {};
  const candidate = value as Record<string, unknown>;
  const bestScores: Partial<Record<GameId, number>> = {};
  for (const gameId of GAME_IDS) {
    const score = candidate[gameId];
    if (typeof score === "number" && Number.isFinite(score) && score >= 0) {
      bestScores[gameId] = Math.floor(score);
    }
  }
  return bestScores;
}

export function sanitizeProgress(value: unknown): LocalProgress {
  if (!value || typeof value !== "object") return { ...DEFAULT_PROGRESS, bestScores: {} };
  const candidate = value as Partial<LocalProgress>;
  return {
    gamesPlayed: sanitizeCounter(candidate.gamesPlayed),
    completedRounds: sanitizeCounter(candidate.completedRounds),
    bestScores: sanitizeBestScores(candidate.bestScores),
    lastPlayedGame: isGameId(candidate.lastPlayedGame) ? candidate.lastPlayedGame : null,
    soundEnabled: candidate.soundEnabled !== false,
    reducedMotion: candidate.reducedMotion === true
  };
}

export function recordResult(progress: LocalProgress, gameId: GameId, score: number): LocalProgress {
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0;
  const previous = progress.bestScores[gameId] ?? 0;
  return {
    ...progress,
    gamesPlayed: progress.gamesPlayed + 1,
    completedRounds: progress.completedRounds + 1,
    lastPlayedGame: gameId,
    bestScores: { ...progress.bestScores, [gameId]: Math.max(previous, safeScore) }
  };
}
