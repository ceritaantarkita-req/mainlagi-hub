export type MasteryLevel = "not_started" | "exploring" | "developing" | "proficient" | "mastered";
export type LearningAttemptStatus = "completed" | "abandoned" | "interrupted";

export interface LearningAttemptOutcome {
  status?: LearningAttemptStatus;
  assessed?: boolean;
  score?: number | null;
  accuracy?: number | null;
  correctCount?: number;
  incorrectCount?: number;
  hintCount?: number;
  retryCount?: number;
  durationMs?: number;
  inputMode?: string;
  startedAt?: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface NormalizedLearningAttemptOutcome {
  status: LearningAttemptStatus;
  assessed: boolean;
  score: number | null;
  accuracy: number | null;
  correctCount: number;
  incorrectCount: number;
  hintCount: number;
  retryCount: number;
  durationMs: number | null;
  inputMode: string | null;
  startedAt: string;
  completedAt: string;
  metadata: Record<string, unknown>;
}

export interface SkillEvidence {
  attemptId: string;
  activityId: string;
  skillId: string;
  score: number;
  weight: number;
  createdAt: string;
  qualifiesForMastery: boolean;
}

export interface SkillMasterySnapshot {
  skillId: string;
  score: number;
  confidence: number;
  level: MasteryLevel;
  evidenceCount: number;
  qualifyingEvidenceCount: number;
  lastEvidenceAt: string | null;
  needsPractice: boolean;
}

export interface SubjectMasterySummary {
  score: number;
  coverage: number;
  startedSkills: number;
  totalSkills: number;
  masteredSkills: number;
  proficientSkills: number;
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function safeCount(value: number | undefined): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value ?? 0));
}

function safeIso(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : fallback;
}

export function normalizeLearningAttemptOutcome(
  outcome: LearningAttemptOutcome = {},
  now = new Date()
): NormalizedLearningAttemptOutcome {
  const completedAt = safeIso(outcome.completedAt, now.toISOString());
  const durationMs = Number.isFinite(outcome.durationMs)
    ? Math.max(0, Math.round(outcome.durationMs ?? 0))
    : null;
  const startedFallback = durationMs === null
    ? completedAt
    : new Date(Math.max(0, Date.parse(completedAt) - durationMs)).toISOString();
  const startedAt = safeIso(outcome.startedAt, startedFallback);
  const correctCount = safeCount(outcome.correctCount);
  const incorrectCount = safeCount(outcome.incorrectCount);
  const hintCount = safeCount(outcome.hintCount);
  const retryCount = safeCount(outcome.retryCount);

  let accuracy: number | null = null;
  if (typeof outcome.accuracy === "number" && Number.isFinite(outcome.accuracy)) {
    accuracy = clamp01(outcome.accuracy);
  } else if (correctCount + incorrectCount > 0) {
    accuracy = clamp01(correctCount / (correctCount + incorrectCount));
  } else if (typeof outcome.score === "number" && Number.isFinite(outcome.score)) {
    accuracy = clamp01(outcome.score);
  }

  const score = typeof outcome.score === "number" && Number.isFinite(outcome.score)
    ? clamp01(outcome.score)
    : accuracy;

  return {
    status: outcome.status ?? "completed",
    assessed: outcome.assessed ?? accuracy !== null,
    score,
    accuracy,
    correctCount,
    incorrectCount,
    hintCount,
    retryCount,
    durationMs,
    inputMode: outcome.inputMode?.trim() || null,
    startedAt,
    completedAt,
    metadata: outcome.metadata && typeof outcome.metadata === "object" ? outcome.metadata : {}
  };
}

export function calculateEvidenceScore(outcome: NormalizedLearningAttemptOutcome): number | null {
  if (!outcome.assessed || outcome.status !== "completed" || outcome.accuracy === null) return null;
  const independencePenalty = Math.min(0.65, outcome.hintCount * 0.12 + outcome.retryCount * 0.08);
  const independence = 1 - independencePenalty;
  const completion = outcome.status === "completed" ? 1 : 0;
  return clamp01(outcome.accuracy * 0.72 + independence * 0.18 + completion * 0.1);
}

export function createSkillEvidence(args: {
  attemptId: string;
  activityId: string;
  skillId: string;
  outcome: NormalizedLearningAttemptOutcome;
  difficulty?: number;
  baseWeight?: number;
  masteryEligible?: boolean;
}): SkillEvidence | null {
  const evidenceScore = calculateEvidenceScore(args.outcome);
  if (evidenceScore === null) return null;
  const difficulty = Math.min(3, Math.max(1, Math.round(args.difficulty ?? 1)));
  const difficultyFactor = 0.9 + difficulty * 0.05;
  const weight = Math.max(0.05, (args.baseWeight ?? 1) * difficultyFactor);
  const excessiveRetries = args.outcome.retryCount >= 7;
  return {
    attemptId: args.attemptId,
    activityId: args.activityId,
    skillId: args.skillId,
    score: evidenceScore,
    weight,
    createdAt: args.outcome.completedAt,
    qualifiesForMastery: (args.masteryEligible ?? true) && !excessiveRetries
  };
}

function evidenceTimestamp(item: SkillEvidence): number {
  const value = Date.parse(item.createdAt);
  return Number.isFinite(value) ? value : 0;
}

export function calculateSkillMastery(skillId: string, evidence: SkillEvidence[]): SkillMasterySnapshot {
  const relevant = evidence
    .filter((item) => item.skillId === skillId)
    .sort((a, b) => evidenceTimestamp(a) - evidenceTimestamp(b));
  const qualifying = relevant.filter((item) => item.qualifiesForMastery).slice(-8);

  if (qualifying.length === 0) {
    return {
      skillId,
      score: 0,
      confidence: 0,
      level: relevant.length > 0 ? "exploring" : "not_started",
      evidenceCount: relevant.length,
      qualifyingEvidenceCount: 0,
      lastEvidenceAt: relevant.at(-1)?.createdAt ?? null,
      needsPractice: relevant.length > 0
    };
  }

  let weightedScore = 0;
  let totalWeight = 0;
  qualifying.forEach((item, index) => {
    const recencyFactor = 0.75 + 0.25 * ((index + 1) / qualifying.length);
    const weight = Math.max(0.01, item.weight * recencyFactor);
    weightedScore += item.score * weight;
    totalWeight += weight;
  });
  const score = clamp01(totalWeight > 0 ? weightedScore / totalWeight : 0);
  const mean = qualifying.reduce((sum, item) => sum + item.score, 0) / qualifying.length;
  const variance = qualifying.reduce((sum, item) => sum + (item.score - mean) ** 2, 0) / qualifying.length;
  const consistency = clamp01(1 - Math.sqrt(variance));
  const confidence = clamp01((qualifying.length / 4) * (0.7 + consistency * 0.3));
  const latestTwo = qualifying.slice(-2);
  const latestTwoStrong = latestTwo.length === 2 && latestTwo.every((item) => item.score >= 0.8);

  let level: MasteryLevel = "exploring";
  if (qualifying.length >= 3 && score >= 0.85 && confidence >= 0.65 && latestTwoStrong) {
    level = "mastered";
  } else if (qualifying.length >= 2 && score >= 0.7) {
    level = "proficient";
  } else if (qualifying.length >= 2 && score >= 0.45) {
    level = "developing";
  }

  return {
    skillId,
    score,
    confidence,
    level,
    evidenceCount: relevant.length,
    qualifyingEvidenceCount: qualifying.length,
    lastEvidenceAt: relevant.at(-1)?.createdAt ?? null,
    needsPractice: level === "exploring" || level === "developing"
  };
}

export function summarizeSubjectMastery(
  skillIds: string[],
  snapshots: Record<string, SkillMasterySnapshot>
): SubjectMasterySummary {
  const unique = [...new Set(skillIds)];
  const values = unique.map((skillId) => snapshots[skillId] ?? calculateSkillMastery(skillId, []));
  const started = values.filter((item) => item.level !== "not_started");
  const score = started.length
    ? started.reduce((sum, item) => sum + item.score, 0) / started.length
    : 0;
  return {
    score: clamp01(score),
    coverage: unique.length ? started.length / unique.length : 0,
    startedSkills: started.length,
    totalSkills: unique.length,
    masteredSkills: values.filter((item) => item.level === "mastered").length,
    proficientSkills: values.filter((item) => item.level === "proficient" || item.level === "mastered").length
  };
}

export function masteryLabel(level: MasteryLevel): string {
  switch (level) {
    case "mastered": return "Dikuasai";
    case "proficient": return "Mahir";
    case "developing": return "Berkembang";
    case "exploring": return "Mengeksplorasi";
    default: return "Belum mulai";
  }
}

export function recommendedDifficulty(score: number): 1 | 2 | 3 {
  const safe = clamp01(score);
  if (safe < 0.45) return 1;
  if (safe < 0.8) return 2;
  return 3;
}
