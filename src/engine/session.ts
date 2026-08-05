import type { Challenge, GameId, GameSession, LevelId, PlayerId, PlayerScore } from "./types";

export type SessionEvent =
  | { type: "DEVICE_CHECK" }
  | { type: "READY" }
  | { type: "COUNTDOWN" }
  | { type: "START"; challenge: Challenge }
  | { type: "TICK"; seconds?: number }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "SET_CHALLENGE"; challenge: Challenge }
  | { type: "DIGIT"; player: PlayerId; digit: number }
  | { type: "CLEAR_DIGITS"; player: PlayerId }
  | { type: "RETRY"; player: PlayerId }
  | { type: "CORRECT"; player: PlayerId; speedBonus?: number }
  | { type: "WRONG"; player: PlayerId }
  | { type: "TIME_UP" }
  | { type: "RESULT" }
  | { type: "REPLAY"; challenge: Challenge };

function newScore(): PlayerScore {
  return {
    score: 0,
    correct: 0,
    wrong: 0,
    retries: 0,
    streak: 0,
    bestStreak: 0,
    digits: [],
    answeredChallengeId: null
  };
}

export function createSession(
  gameId: GameId,
  level: LevelId,
  durationSeconds = 60,
  seed = Date.now()
): GameSession {
  const safeDuration = Number.isFinite(durationSeconds)
    ? Math.max(1, Math.floor(durationSeconds))
    : 60;
  return {
    gameId,
    level,
    phase: "setup",
    durationSeconds: safeDuration,
    remainingSeconds: safeDuration,
    challengeIndex: 0,
    currentChallenge: null,
    players: { A: newScore(), B: newScore() },
    winner: null,
    seed
  };
}

function updatePlayer(session: GameSession, player: PlayerId, update: (score: PlayerScore) => PlayerScore): GameSession {
  return {
    ...session,
    players: { ...session.players, [player]: update(session.players[player]) }
  };
}

function resolveWinner(session: GameSession): PlayerId | "draw" {
  if (session.players.A.score === session.players.B.score) return "draw";
  return session.players.A.score > session.players.B.score ? "A" : "B";
}

export function reduceSession(session: GameSession, event: SessionEvent): GameSession {
  switch (event.type) {
    case "DEVICE_CHECK":
      return session.phase === "setup" ? { ...session, phase: "device-check" } : session;
    case "READY":
      return session.phase === "device-check" ? { ...session, phase: "ready" } : session;
    case "COUNTDOWN":
      return session.phase === "ready" ? { ...session, phase: "countdown" } : session;
    case "START":
      return session.phase === "countdown"
        ? { ...session, phase: "playing", currentChallenge: event.challenge, challengeIndex: 1 }
        : session;
    case "TICK": {
      if (session.phase !== "playing") return session;
      const requestedSeconds = event.seconds ?? 1;
      const seconds = Number.isFinite(requestedSeconds) ? Math.max(0, Math.floor(requestedSeconds)) : 1;
      const remainingSeconds = Math.max(0, session.remainingSeconds - seconds);
      return remainingSeconds === 0
        ? { ...session, remainingSeconds, phase: "time-up", winner: resolveWinner(session) }
        : { ...session, remainingSeconds };
    }
    case "PAUSE":
      return session.phase === "playing" ? { ...session, phase: "paused" } : session;
    case "RESUME":
      return session.phase === "paused" ? { ...session, phase: "playing" } : session;
    case "SET_CHALLENGE":
      return session.phase === "playing"
        ? {
            ...session,
            currentChallenge: event.challenge,
            challengeIndex: session.challengeIndex + 1,
            players: {
              A: { ...session.players.A, digits: [], answeredChallengeId: null },
              B: { ...session.players.B, digits: [], answeredChallengeId: null }
            }
          }
        : session;
    case "DIGIT":
      if (
        session.phase !== "playing" ||
        !session.currentChallenge ||
        event.digit < 0 ||
        event.digit > 9 ||
        session.players[event.player].answeredChallengeId === session.currentChallenge.id
      ) return session;
      return updatePlayer(session, event.player, (score) => ({ ...score, digits: [...score.digits, event.digit] }));
    case "CLEAR_DIGITS":
      if (session.phase !== "playing") return session;
      return updatePlayer(session, event.player, (score) => ({ ...score, digits: [] }));
    case "RETRY":
      if (session.phase !== "playing") return session;
      return updatePlayer(session, event.player, (score) => ({ ...score, retries: score.retries + 1 }));
    case "CORRECT":
      if (!session.currentChallenge || session.phase !== "playing") return session;
      if (session.players[event.player].answeredChallengeId === session.currentChallenge.id) return session;
      return updatePlayer(session, event.player, (score) => {
        const streak = score.streak + 1;
        return {
          ...score,
          score: score.score + 100 + Math.max(0, event.speedBonus ?? 0) + Math.min(50, streak * 5),
          correct: score.correct + 1,
          streak,
          bestStreak: Math.max(score.bestStreak, streak),
          digits: [],
          answeredChallengeId: session.currentChallenge!.id
        };
      });
    case "WRONG":
      if (session.phase !== "playing") return session;
      return updatePlayer(session, event.player, (score) => ({
        ...score,
        score: Math.max(0, score.score - 10),
        wrong: score.wrong + 1,
        streak: 0,
        digits: []
      }));
    case "TIME_UP":
      return session.phase === "playing" || session.phase === "paused"
        ? { ...session, phase: "time-up", remainingSeconds: 0, winner: resolveWinner(session) }
        : session;
    case "RESULT":
      return session.phase === "time-up" ? { ...session, phase: "result", winner: resolveWinner(session) } : session;
    case "REPLAY":
      return {
        ...createSession(session.gameId, session.level, session.durationSeconds, session.seed + 1),
        phase: "playing",
        currentChallenge: event.challenge,
        challengeIndex: 1
      };
    default:
      return session;
  }
}

export function digitsToNumber(digits: readonly number[]): number | null {
  if (digits.length === 0 || digits.some((digit) => !Number.isInteger(digit) || digit < 0 || digit > 9)) return null;
  return Number(digits.join(""));
}

export function expectedDigitCount(challenge: Challenge): number {
  if (challenge.kind === "math" || challenge.kind === "pattern") return String(challenge.answer).length;
  return 1;
}
