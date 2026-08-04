import type { GameId, LocalProgress } from "./types.js";

export const DEFAULT_PROGRESS: LocalProgress = {
  gamesPlayed: 0,
  completedRounds: 0,
  bestScores: {},
  lastPlayedGame: null,
  soundEnabled: true,
  reducedMotion: false
};

export function sanitizeProgress(value: unknown): LocalProgress {
  if (!value || typeof value !== "object") return { ...DEFAULT_PROGRESS };
  const candidate = value as Partial<LocalProgress>;
  return {
    gamesPlayed: Number.isFinite(candidate.gamesPlayed) ? Math.max(0, Math.floor(candidate.gamesPlayed!)) : 0,
    completedRounds: Number.isFinite(candidate.completedRounds) ? Math.max(0, Math.floor(candidate.completedRounds!)) : 0,
    bestScores: candidate.bestScores && typeof candidate.bestScores === "object" ? candidate.bestScores : {},
    lastPlayedGame: candidate.lastPlayedGame ?? null,
    soundEnabled: candidate.soundEnabled !== false,
    reducedMotion: candidate.reducedMotion === true
  };
}

export function recordResult(progress: LocalProgress, gameId: GameId, score: number): LocalProgress {
  const previous = progress.bestScores[gameId] ?? 0;
  return {
    ...progress,
    gamesPlayed: progress.gamesPlayed + 1,
    completedRounds: progress.completedRounds + 1,
    lastPlayedGame: gameId,
    bestScores: { ...progress.bestScores, [gameId]: Math.max(previous, Math.max(0, Math.floor(score))) }
  };
}
