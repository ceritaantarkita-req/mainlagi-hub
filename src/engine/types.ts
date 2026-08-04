export type GameId = "math-battle" | "number-trace" | "shape-quest" | "pattern-race";
export type PlayerId = "A" | "B";
export type LevelId = "kindergarten" | "grade-1" | "grade-2";
export type Operation = "add" | "subtract" | "multiply" | "divide";
export type SessionPhase =
  | "setup"
  | "device-check"
  | "ready"
  | "countdown"
  | "playing"
  | "paused"
  | "time-up"
  | "result";

export interface Point {
  x: number;
  y: number;
  t?: number;
}

export interface MathChallenge {
  kind: "math";
  id: string;
  prompt: string;
  answer: number;
  operation: Operation;
  operands: [number, number];
}

export interface PatternChallenge {
  kind: "pattern";
  id: string;
  sequence: number[];
  prompt: string;
  answer: number;
  step: number;
}

export interface TraceChallenge {
  kind: "trace";
  id: string;
  digit: number;
  prompt: string;
  target: Point[];
}

export type ShapeName = "circle" | "triangle" | "square" | "rectangle" | "zigzag";

export interface ShapeChallenge {
  kind: "shape";
  id: string;
  shape: ShapeName;
  prompt: string;
  target: Point[];
}

export type Challenge = MathChallenge | PatternChallenge | TraceChallenge | ShapeChallenge;

export interface PlayerScore {
  score: number;
  correct: number;
  wrong: number;
  retries: number;
  streak: number;
  bestStreak: number;
  digits: number[];
}

export interface GameSession {
  gameId: GameId;
  level: LevelId;
  phase: SessionPhase;
  durationSeconds: number;
  remainingSeconds: number;
  challengeIndex: number;
  currentChallenge: Challenge | null;
  players: Record<PlayerId, PlayerScore>;
  winner: PlayerId | "draw" | null;
  seed: number;
}

export interface RecognitionResult<T> {
  value: T | null;
  confidence: number;
  accepted: boolean;
  reason?: string;
}

export interface LocalProgress {
  gamesPlayed: number;
  completedRounds: number;
  bestScores: Partial<Record<GameId, number>>;
  lastPlayedGame: GameId | null;
  soundEnabled: boolean;
  reducedMotion: boolean;
}
