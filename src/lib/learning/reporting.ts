import { LEARNING_SKILLS } from "./catalog";
import type { LearningAnalyticsSnapshot, LearningAttemptRecord } from "./attempts";
import type { SkillMasterySnapshot } from "./mastery";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface WeeklyLearningReport {
  windowStart: string;
  windowEnd: string;
  attempts: number;
  assessedAttempts: number;
  practiceAttempts: number;
  activeDays: number;
  averageAccuracy: number | null;
  qualifyingEvidence: number;
  previousAttempts: number;
  attemptDelta: number;
  strongestSkill: { id: string; title: string; score: number; level: string } | null;
  needsPracticeSkill: { id: string; title: string; score: number; level: string } | null;
}

function time(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function inWindow(attempt: LearningAttemptRecord, start: number, end: number): boolean {
  const at = time(attempt.completedAt);
  return at !== null && at >= start && at < end;
}

function average(values: number[]): number | null {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function skillRows(analytics: LearningAnalyticsSnapshot) {
  return LEARNING_SKILLS.flatMap((skill) => {
    const snapshot = analytics.masteryBySkill[skill.id] as SkillMasterySnapshot | undefined;
    if (!snapshot || snapshot.evidenceCount < 1) return [];
    return [{ skill, snapshot }];
  });
}

export function buildWeeklyLearningReport(
  analytics: LearningAnalyticsSnapshot,
  nowMs = Date.now()
): WeeklyLearningReport {
  const currentEnd = nowMs + 1;
  const currentStart = nowMs - 7 * DAY_MS;
  const previousStart = currentStart - 7 * DAY_MS;
  const current = analytics.attempts.filter((attempt) => inWindow(attempt, currentStart, currentEnd));
  const previous = analytics.attempts.filter((attempt) => inWindow(attempt, previousStart, currentStart));
  const accuracyValues = current.flatMap((attempt) => attempt.assessed && attempt.accuracy !== null ? [attempt.accuracy] : []);
  const activeDays = new Set(current.map((attempt) => {
    const at = time(attempt.completedAt) ?? 0;
    return new Date(at).toISOString().slice(0, 10);
  })).size;
  const qualifyingEvidence = current.reduce(
    (sum, attempt) => sum + attempt.evidence.filter((item) => item.qualifiesForMastery).length,
    0
  );

  const rows = skillRows(analytics);
  const strongest = rows.slice().sort((a, b) => b.snapshot.score - a.snapshot.score || b.snapshot.confidence - a.snapshot.confidence)[0] ?? null;
  const needsPractice = rows
    .filter((row) => row.snapshot.level !== "mastered")
    .sort((a, b) => a.snapshot.score - b.snapshot.score || a.snapshot.confidence - b.snapshot.confidence)[0] ?? null;

  return {
    windowStart: new Date(currentStart).toISOString(),
    windowEnd: new Date(nowMs).toISOString(),
    attempts: current.length,
    assessedAttempts: current.filter((attempt) => attempt.assessed).length,
    practiceAttempts: current.filter((attempt) => !attempt.assessed).length,
    activeDays,
    averageAccuracy: average(accuracyValues),
    qualifyingEvidence,
    previousAttempts: previous.length,
    attemptDelta: current.length - previous.length,
    strongestSkill: strongest ? {
      id: strongest.skill.id,
      title: strongest.skill.title,
      score: strongest.snapshot.score,
      level: strongest.snapshot.level
    } : null,
    needsPracticeSkill: needsPractice ? {
      id: needsPractice.skill.id,
      title: needsPractice.skill.title,
      score: needsPractice.snapshot.score,
      level: needsPractice.snapshot.level
    } : null
  };
}
