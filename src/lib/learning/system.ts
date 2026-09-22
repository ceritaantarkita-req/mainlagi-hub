import * as base from "./systemBase";
import { BAHASA_BATCH8_ACTIVITIES, BAHASA_BATCH8_STAGES } from "./bahasaBatch8";
import { CREATIVE_BATCH14_ACTIVITIES, CREATIVE_BATCH14_STAGES } from "./creativeBatch14";
import { ENGLISH_BATCH9_ACTIVITIES, ENGLISH_BATCH9_STAGES } from "./englishBatch9";
import { IQRO_BATCH10_ACTIVITIES, IQRO_BATCH10_STAGES } from "./iqroBatch10";
import { LETTERS_BATCH11_ACTIVITIES, LETTERS_BATCH11_STAGES } from "./lettersBatch11";
import { LOGIC_BATCH12_ACTIVITIES, LOGIC_BATCH12_STAGES } from "./logicBatch12";
import { MATH_BATCH7_ACTIVITIES, MATH_BATCH7_STAGES } from "./mathBatch7";
import { SCIENCE_BATCH13_ACTIVITIES, SCIENCE_BATCH13_STAGES } from "./scienceBatch13";
import type {
  LearningActivity as BaseLearningActivity,
  LearningChildProfile,
  LearningProgress,
  LearningStage as BaseLearningStage,
  LearningSubject as BaseLearningSubject
} from "./systemBase";

export type {
  CharacterId,
  LearningChildProfile,
  LearningInputMode,
  LearningPreferences,
  LearningProgress,
  MatchItem
} from "./systemBase";

type OpenLiteral<T extends string> = T | (string & {});
export type LearningSubjectId = OpenLiteral<base.LearningSubjectId | "drawing">;
export type LearningRuntime = OpenLiteral<base.LearningRuntime | "drawing">;
export type ChoicePresentation = "grid" | "symbol_hunt";

export interface LearningSubject extends Omit<BaseLearningSubject, "id"> {
  id: LearningSubjectId;
}

export interface LearningActivity extends Omit<BaseLearningActivity, "subjectId" | "runtime" | "coloringCharacter"> {
  subjectId: LearningSubjectId;
  runtime: LearningRuntime;
  /** Audio-only instruction/target. Never render this as the visible listening prompt. */
  audioPrompt?: string;
  /** Child-facing presentation for canonical choice evidence. */
  choicePresentation?: ChoicePresentation;
  coloringCharacter?: string;
  coloringRegions?: string[];
  creativePrompt?: string;
  drawingGuide?: string;
}

export interface LearningStage extends Omit<BaseLearningStage, "subjectId"> {
  subjectId: LearningSubjectId;
}

export const CHARACTERS = base.CHARACTERS;

const DRAWING_SUBJECT: LearningSubject = {
  id: "drawing",
  title: "Menggambar",
  shortTitle: "Gambar",
  emoji: "✏️",
  description: "Latihan garis, bentuk, objek, dan ide gambar dengan kanvas sentuh.",
  accent: "#8b6dd8",
  soft: "#f1ecff"
};

export const SUBJECTS: LearningSubject[] = [
  ...base.SUBJECTS.map((subject) => ({ ...subject })),
  DRAWING_SUBJECT
];

const CHOICE_PRESENTATION_OVERRIDES: Record<string, Pick<LearningActivity, "prompt" | "choices" | "correctChoice">> = {
  "english-find-blue": {
    prompt: "Which color matches BLUE?",
    choices: ["🔴", "🔵", "🟢"],
    correctChoice: "🔵"
  },
  "english-find-red": {
    prompt: "Which color matches RED?",
    choices: ["🔴", "🟢", "🟡"],
    correctChoice: "🔴"
  },
  "english-find-green": {
    prompt: "Which color matches GREEN?",
    choices: ["🔵", "🟢", "🔴"],
    correctChoice: "🟢"
  },
  "math-shape-three-sides": {
    prompt: "Bentuk mana yang punya 3 sisi?",
    choices: ["●", "▲", "■"],
    correctChoice: "▲"
  },
  "math-pattern-size": {
    prompt: "• ⬤ • ⬤ ... bentuk berikutnya?",
    choices: ["•", "⬤", "■"],
    correctChoice: "•"
  }
};

const ENGLISH_LISTEN_AUDIO_PROMPT_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "english-find-blue-audio": "Blue.",
  "english-listen-cat": "Cat.",
  "english-listen-cat-2": "Cat.",
  "english-listen-letter-a": "Letter A.",
  "english-listen-letter-m": "Letter M.",
  "english-listen-yellow": "Yellow.",
  "english-listen-three": "Three.",
  "english-listen-bird": "Bird.",
  "english-listen-bag": "Bag.",
  "english-listen-eyes": "Eyes.",
  "english-listen-sister": "Sister.",
  "english-review-listen-father": "Father.",
  "english-review-listen-fish": "Fish.",
  "english-listen-milk": "Milk.",
  "english-listen-sleep": "Sleep.",
  "english-listen-apple-review": "Apple.",
  "english-listen-jump-review": "Jump.",
  "english-listen-book-review": "Book.",
  "english-listen-hand-review": "Hand.",
  "english-listen-baby-review": "Baby.",
  "english-listen-phrase-blue-book": "A blue book.",
  "english-review-listen-yellow-ball": "A yellow ball."
});

const DIRECT_SYMBOL_SUBJECTS = new Set<LearningSubjectId>(["bahasa", "english", "letters"]);

function promptContainsSymbol(prompt: string | undefined, symbol: string): boolean {
  if (!prompt || !symbol) return false;
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Za-z0-9])${escaped}([^A-Za-z0-9]|$)`, "i").test(prompt);
}

/**
 * Direct Latin-letter recognition is pedagogically valid but should not render
 * as the same flat three-button quiz dozens of times. Keep the canonical
 * choice/evidence contract and route this family through a richer visual hunt.
 */
export function isDirectLiteracySymbolChoice(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice" || !DIRECT_SYMBOL_SUBJECTS.has(activity.subjectId)) return false;
  const choices = activity.choices ?? [];
  if (choices.length < 3 || !choices.every((choice) => /^[A-Za-z]$/.test(choice.trim()))) return false;
  const correctChoice = activity.correctChoice?.trim();
  if (!correctChoice || !choices.includes(correctChoice)) return false;
  return promptContainsSymbol(activity.prompt, correctChoice);
}

function listeningInstruction(subjectId: LearningSubjectId): string {
  return subjectId === "english"
    ? "Listen, then choose the best answer."
    : "Dengarkan, lalu pilih jawaban yang paling sesuai.";
}

function normalizeActivityPresentation(activity: LearningActivity): LearningActivity {
  let normalized = activity;

  if (activity.runtime === "listen_and_choose" && activity.prompt) {
    const authoredAudioPrompt = activity.audioPrompt?.trim();
    const englishAudioPrompt = activity.subjectId === "english"
      ? ENGLISH_LISTEN_AUDIO_PROMPT_OVERRIDES[activity.id]
      : undefined;
    normalized = {
      ...activity,
      audioPrompt: authoredAudioPrompt || englishAudioPrompt || activity.prompt,
      prompt: listeningInstruction(activity.subjectId)
    };
  }

  const choiceOverride = CHOICE_PRESENTATION_OVERRIDES[activity.id];
  if (choiceOverride) {
    normalized = {
      ...normalized,
      ...choiceOverride,
      choices: choiceOverride.choices ? [...choiceOverride.choices] : normalized.choices
    };
  }

  if (isDirectLiteracySymbolChoice(normalized)) {
    normalized = {
      ...normalized,
      choicePresentation: "symbol_hunt"
    };
  }

  return normalized;
}

const RAW_ACTIVITIES: LearningActivity[] = [
  ...base.ACTIVITIES.map((activity) => ({ ...activity } as LearningActivity)),
  ...MATH_BATCH7_ACTIVITIES,
  ...BAHASA_BATCH8_ACTIVITIES,
  ...ENGLISH_BATCH9_ACTIVITIES,
  ...IQRO_BATCH10_ACTIVITIES,
  ...LETTERS_BATCH11_ACTIVITIES,
  ...LOGIC_BATCH12_ACTIVITIES,
  ...SCIENCE_BATCH13_ACTIVITIES,
  ...CREATIVE_BATCH14_ACTIVITIES
];

export const ACTIVITIES: LearningActivity[] = RAW_ACTIVITIES.map(normalizeActivityPresentation);
export const STAGES: LearningStage[] = [
  ...base.STAGES.map((stage) => ({ ...stage })),
  ...MATH_BATCH7_STAGES,
  ...BAHASA_BATCH8_STAGES,
  ...ENGLISH_BATCH9_STAGES,
  ...IQRO_BATCH10_STAGES,
  ...LETTERS_BATCH11_STAGES,
  ...LOGIC_BATCH12_STAGES,
  ...SCIENCE_BATCH13_STAGES,
  ...CREATIVE_BATCH14_STAGES
];

const SUBJECT_MAP = new Map(SUBJECTS.map((item) => [item.id, item]));
const STAGE_MAP = new Map(STAGES.map((item) => [item.id, item]));
const ACTIVITY_MAP = new Map(ACTIVITIES.map((item) => [item.id, item]));

export function getSubject(id: string): LearningSubject | undefined {
  return SUBJECT_MAP.get(id as LearningSubjectId);
}

export function getStage(id: string): LearningStage | undefined {
  return STAGE_MAP.get(id);
}

export function getActivity(id: string): LearningActivity | undefined {
  return ACTIVITY_MAP.get(id);
}

export function getStagesForSubject(subjectId: LearningSubjectId): LearningStage[] {
  return STAGES.filter((stage) => stage.subjectId === subjectId);
}

export function getActivitiesForStage(stageId: string): LearningActivity[] {
  const stage = getStage(stageId);
  if (!stage) return [];
  return stage.activityIds.map((id) => getActivity(id)).filter((item): item is LearningActivity => Boolean(item));
}

export const DEMO_PROFILE: LearningChildProfile = base.DEMO_PROFILE;
export const readProfiles = base.readProfiles;
export const readProfile = base.readProfile;
export const saveProfile = base.saveProfile;
export const readProgress = base.readProgress;
export const readPreferences = base.readPreferences;
export const savePreferences = base.savePreferences;

const PROGRESS_KEY = "mainlagi-learning-progress-v1";

export function completeActivity(childId: string, activityId: string): LearningProgress {
  const current = readProgress(childId);
  const alreadyDone = current.completedActivityIds.includes(activityId);
  const activity = getActivity(activityId);
  const next: LearningProgress = {
    completedActivityIds: alreadyDone ? current.completedActivityIds : [...current.completedActivityIds, activityId],
    stars: current.stars + (!alreadyDone && activity ? activity.stars : 0),
    lastActivityId: activityId
  };
  if (typeof window !== "undefined") {
    let all: Record<string, LearningProgress> = {};
    try {
      all = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<string, LearningProgress>;
    } catch {
      all = {};
    }
    all[childId] = next;
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("mainlagi-learning-progress", { detail: { childId } }));
  }
  return next;
}

export function getRecommendedActivities(age: number): LearningActivity[] {
  const inAge = ACTIVITIES.filter((activity) => age >= activity.ageMin && age <= activity.ageMax);
  return [
    ...inAge.filter((activity) => activity.runtime !== "motion_game"),
    ...inAge.filter((activity) => activity.runtime === "motion_game")
  ];
}

export function getNextActivity(age: number, progress: LearningProgress): LearningActivity | undefined {
  const recommended = getRecommendedActivities(age);
  return recommended.find((activity) => !progress.completedActivityIds.includes(activity.id)) ?? recommended[0];
}

export function getNextActivityInStage(activityId: string): LearningActivity | undefined {
  const activity = getActivity(activityId);
  if (!activity) return undefined;
  const stage = getStage(activity.stageId);
  if (!stage) return undefined;
  const index = stage.activityIds.indexOf(activity.id);
  if (index < 0) return undefined;
  return stage.activityIds
    .slice(index + 1)
    .map((id) => getActivity(id))
    .find((item): item is LearningActivity => Boolean(item));
}
