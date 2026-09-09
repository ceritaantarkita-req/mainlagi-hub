import { getActivityLearningSpec, LEARNING_SKILLS } from "./catalog";
import {
  calculateSkillMastery,
  createSkillEvidence,
  normalizeLearningAttemptOutcome,
  type LearningAttemptOutcome,
  type NormalizedLearningAttemptOutcome,
  type SkillEvidence,
  type SkillMasterySnapshot
} from "./mastery";

const ATTEMPTS_KEY = "mainlagi-learning-attempts-v1";
const MAX_ATTEMPTS_PER_CHILD = 500;
const RAPID_REPEAT_MS = 30_000;

export interface LearningAttemptRecord {
  id: string;
  childId: string;
  activityId: string;
  subjectId: string;
  stageId: string;
  runtime: string;
  difficulty: number;
  status: NormalizedLearningAttemptOutcome["status"];
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
  evidence: SkillEvidence[];
  masteryEligible: boolean;
}

export interface LearningAnalyticsSnapshot {
  attempts: LearningAttemptRecord[];
  masteryBySkill: Record<string, SkillMasterySnapshot>;
  totalAttempts: number;
  assessedAttempts: number;
  practiceAttempts: number;
  lastAttemptAt: string | null;
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readAllAttempts(): Record<string, LearningAttemptRecord[]> {
  if (typeof window === "undefined") return {};
  const parsed = safeParse<Record<string, LearningAttemptRecord[]>>(window.localStorage.getItem(ATTEMPTS_KEY), {});
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  return parsed;
}

export function readLearningAttempts(childId: string): LearningAttemptRecord[] {
  const all = readAllAttempts();
  const items = Array.isArray(all[childId]) ? all[childId] : [];
  return items.filter((item) => item && typeof item.id === "string" && typeof item.activityId === "string");
}

function isRapidRepeat(previous: LearningAttemptRecord | undefined, completedAt: string): boolean {
  if (!previous) return false;
  const previousAt = Date.parse(previous.completedAt);
  const nextAt = Date.parse(completedAt);
  if (!Number.isFinite(previousAt) || !Number.isFinite(nextAt)) return false;
  return nextAt >= previousAt && nextAt - previousAt < RAPID_REPEAT_MS;
}

export function recordLearningAttempt(args: {
  childId: string;
  activityId: string;
  subjectId: string;
  stageId: string;
  runtime: string;
  outcome?: LearningAttemptOutcome;
}): LearningAttemptRecord {
  const spec = getActivityLearningSpec(args.activityId);
  const defaultAssessed = spec?.assessment === "assessed";
  const normalized = normalizeLearningAttemptOutcome({
    ...args.outcome,
    assessed: args.outcome?.assessed ?? defaultAssessed
  });
  const current = readLearningAttempts(args.childId);
  const previousSame = [...current].reverse().find((item) => item.activityId === args.activityId);
  const masteryEligible = !isRapidRepeat(previousSame, normalized.completedAt);
  const attemptId = makeId();
  const evidence = (spec?.skills ?? [])
    .map((link) => createSkillEvidence({
      attemptId,
      activityId: args.activityId,
      skillId: link.skillId,
      outcome: normalized,
      difficulty: spec?.difficulty ?? 1,
      baseWeight: link.weight,
      masteryEligible
    }))
    .filter((item): item is SkillEvidence => Boolean(item));

  const attempt: LearningAttemptRecord = {
    id: attemptId,
    childId: args.childId,
    activityId: args.activityId,
    subjectId: args.subjectId,
    stageId: args.stageId,
    runtime: args.runtime,
    difficulty: spec?.difficulty ?? 1,
    ...normalized,
    evidence,
    masteryEligible
  };

  if (typeof window !== "undefined") {
    const all = readAllAttempts();
    all[args.childId] = [...current, attempt].slice(-MAX_ATTEMPTS_PER_CHILD);
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("mainlagi-learning-analytics", {
      detail: { childId: args.childId, attemptId }
    }));
  }
  return attempt;
}

export function readLearningAnalytics(childId: string): LearningAnalyticsSnapshot {
  const attempts = readLearningAttempts(childId);
  const evidence = attempts.flatMap((attempt) => Array.isArray(attempt.evidence) ? attempt.evidence : []);
  const masteryBySkill = Object.fromEntries(
    LEARNING_SKILLS.map((skill) => [skill.id, calculateSkillMastery(skill.id, evidence)])
  );
  return {
    attempts,
    masteryBySkill,
    totalAttempts: attempts.length,
    assessedAttempts: attempts.filter((item) => item.assessed).length,
    practiceAttempts: attempts.filter((item) => !item.assessed).length,
    lastAttemptAt: attempts.at(-1)?.completedAt ?? null
  };
}

export function emptyLearningAnalytics(): LearningAnalyticsSnapshot {
  return {
    attempts: [],
    masteryBySkill: Object.fromEntries(
      LEARNING_SKILLS.map((skill) => [skill.id, calculateSkillMastery(skill.id, [])])
    ),
    totalAttempts: 0,
    assessedAttempts: 0,
    practiceAttempts: 0,
    lastAttemptAt: null
  };
}

export type { LearningAttemptOutcome };
