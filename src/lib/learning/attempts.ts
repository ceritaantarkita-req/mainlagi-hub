import type {
  LearningAttempt,
  LearningAttemptResult,
  LearningRuntime,
  LearningSubjectId,
  LearningSummary,
  SkillMastery
} from "./model";
import { SKILLS, getSkillsForActivity } from "./skills";

const ATTEMPT_KEY = "mainlagi-learning-attempts-v1";
const MAX_ATTEMPTS_PER_CHILD = 500;
export const LEARNING_ATTEMPTS_EVENT = "mainlagi-learning-attempts";

export interface RecordLearningAttemptInput extends LearningAttemptResult {
  childId: string;
  activityId: string;
  subjectId: LearningSubjectId;
  runtime: LearningRuntime;
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function finiteOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function nonNegativeOrNull(value: number | null | undefined): number | null {
  const finite = finiteOrNull(value);
  return finite === null ? null : Math.max(0, finite);
}

function normalizedAccuracy(value: number | null | undefined): number | null {
  const finite = finiteOrNull(value);
  return finite === null ? null : Math.max(0, Math.min(1, finite));
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function readLearningAttempts(childId: string): LearningAttempt[] {
  if (typeof window === "undefined") return [];
  const all = safeParse<Record<string, LearningAttempt[]>>(window.localStorage.getItem(ATTEMPT_KEY), {});
  return Array.isArray(all[childId]) ? all[childId] : [];
}

export function recordLearningAttempt(input: RecordLearningAttemptInput): LearningAttempt {
  const attempt: LearningAttempt = {
    id: uid(),
    childId: input.childId,
    activityId: input.activityId,
    subjectId: input.subjectId,
    runtime: input.runtime,
    status: input.status ?? "completed",
    correct: typeof input.correct === "boolean" ? input.correct : null,
    accuracy: normalizedAccuracy(input.accuracy),
    hints: nonNegativeOrNull(input.hints),
    errors: nonNegativeOrNull(input.errors),
    durationMs: nonNegativeOrNull(input.durationMs),
    completedAt: new Date().toISOString()
  };

  if (typeof window !== "undefined") {
    const all = safeParse<Record<string, LearningAttempt[]>>(window.localStorage.getItem(ATTEMPT_KEY), {});
    const current = Array.isArray(all[input.childId]) ? all[input.childId] : [];
    all[input.childId] = [...current, attempt].slice(-MAX_ATTEMPTS_PER_CHILD);
    window.localStorage.setItem(ATTEMPT_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent(LEARNING_ATTEMPTS_EVENT, { detail: { childId: input.childId } }));
  }

  return attempt;
}

function baseEvidence(attempt: LearningAttempt, evaluative: boolean): number {
  if (attempt.status === "abandoned") return 0;

  if (!evaluative) {
    return attempt.status === "completed" ? 0.5 : 0.25;
  }

  let evidence: number;
  if (attempt.accuracy !== null) evidence = attempt.accuracy;
  else if (attempt.correct === true) evidence = 1;
  else if (attempt.correct === false) evidence = 0.15;
  else evidence = attempt.status === "completed" ? 0.45 : 0.25;

  if (attempt.status === "partial") evidence *= 0.7;

  const hintPenalty = Math.min(0.15, (attempt.hints ?? 0) * 0.03);
  const errorPenalty = Math.min(0.15, (attempt.errors ?? 0) * 0.03);
  return Math.max(0, Math.min(1, evidence - hintPenalty - errorPenalty));
}

export function deriveSkillMastery(attempts: LearningAttempt[]): SkillMastery[] {
  return SKILLS.map((skill) => {
    const relevant = attempts
      .filter((attempt) => getSkillsForActivity(attempt.activityId).some((mapped) => mapped.id === skill.id))
      .slice(-5);

    if (relevant.length === 0) {
      return {
        skill,
        band: "new",
        evidenceScore: 0,
        attemptCount: 0,
        strongAttemptCount: 0,
        lastPracticedAt: null
      };
    }

    const evidence = relevant.map((attempt) => baseEvidence(attempt, skill.evaluative));
    const evidenceScore = evidence.reduce((sum, value) => sum + value, 0) / evidence.length;
    const strongAttemptCount = evidence.filter((value) => value >= 0.8).length;

    let band: SkillMastery["band"] = "practicing";
    if (skill.evaluative) {
      if (evidenceScore >= 0.8 && strongAttemptCount >= 2) band = "mastered";
      else if (evidenceScore >= 0.55) band = "progressing";
    }

    return {
      skill,
      band,
      evidenceScore: Math.round(evidenceScore * 100) / 100,
      attemptCount: relevant.length,
      strongAttemptCount,
      lastPracticedAt: relevant[relevant.length - 1]?.completedAt ?? null
    };
  });
}

export function summarizeLearningAttempts(attempts: LearningAttempt[]): LearningSummary {
  const skills = deriveSkillMastery(attempts);
  const activityIds = new Set(attempts.map((attempt) => attempt.activityId));
  const lastPracticedAt = attempts.length
    ? attempts.reduce((latest, attempt) => attempt.completedAt > latest ? attempt.completedAt : latest, attempts[0].completedAt)
    : null;

  return {
    attemptCount: attempts.length,
    completedAttemptCount: attempts.filter((attempt) => attempt.status === "completed").length,
    practicedActivityCount: activityIds.size,
    skills,
    masteredSkillCount: skills.filter((item) => item.band === "mastered").length,
    progressingSkillCount: skills.filter((item) => item.band === "progressing").length,
    lastPracticedAt
  };
}

export function readLearningSummary(childId: string): LearningSummary {
  return summarizeLearningAttempts(readLearningAttempts(childId));
}
