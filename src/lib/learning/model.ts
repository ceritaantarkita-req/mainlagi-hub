import type { CharacterId, LearningRuntime, LearningSubjectId } from "./system";

export type LearningAttemptStatus = "completed" | "partial" | "abandoned";
export type MasteryBand = "new" | "practicing" | "progressing" | "mastered";
export type UiLocale = "id-ID" | "en-US";
export type LearningLanguage = "id" | "en";
export type EntitlementTier = "community" | "plus" | "school";

export interface LearningAttemptResult {
  status?: LearningAttemptStatus;
  correct?: boolean | null;
  accuracy?: number | null;
  hints?: number | null;
  errors?: number | null;
  durationMs?: number | null;
}

export interface LearningAttempt {
  id: string;
  childId: string;
  activityId: string;
  subjectId: LearningSubjectId;
  runtime: LearningRuntime;
  status: LearningAttemptStatus;
  correct: boolean | null;
  accuracy: number | null;
  hints: number | null;
  errors: number | null;
  durationMs: number | null;
  completedAt: string;
}

export interface SkillDefinition {
  id: string;
  subjectId: LearningSubjectId;
  label: string;
  description: string;
  evaluative: boolean;
}

export interface SkillMastery {
  skill: SkillDefinition;
  band: MasteryBand;
  evidenceScore: number;
  attemptCount: number;
  strongAttemptCount: number;
  lastPracticedAt: string | null;
}

export interface LearningSummary {
  attemptCount: number;
  completedAttemptCount: number;
  practicedActivityCount: number;
  skills: SkillMastery[];
  masteredSkillCount: number;
  progressingSkillCount: number;
  lastPracticedAt: string | null;
}

export interface LearningLocaleSettings {
  uiLocale: UiLocale;
  learningLanguage: LearningLanguage;
}

export interface CharacterAudioAsset {
  assetKey: string;
  characterId: CharacterId;
  locale: UiLocale;
  voiceId: string;
  version: string;
  reviewStatus: "draft" | "reviewed" | "approved";
  source: "owned_recording" | "licensed_recording" | "synthetic_owned" | "synthetic_licensed";
  uri?: string;
}

export type CommunityCapability =
  | "learning-core"
  | "motion-runtime"
  | "basic-progress"
  | "basic-parent-report";

export type PlusCapability =
  | CommunityCapability
  | "premium-curriculum"
  | "premium-character-audio"
  | "cloud-sync"
  | "advanced-parent-report"
  | "premium-rewards";

export type SchoolCapability =
  | PlusCapability
  | "class-roster"
  | "assignments"
  | "school-analytics"
  | "school-admin";

export type EntitlementCapability = SchoolCapability;
