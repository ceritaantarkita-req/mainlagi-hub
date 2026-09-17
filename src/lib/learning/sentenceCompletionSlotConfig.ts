import type { LearningActivity } from "./system";

const ENGLISH_SENTENCE_COMPLETION_IDS = new Set([
  "english-complete-cat-sleeps",
  "english-complete-bird-flies",
  "english-complete-i-read",
  "english-complete-two-apples",
  "english-complete-mother-family"
]);

export type SentenceCompletionSlotConfig = {
  before: string;
  after: string;
};

export function parseSentenceCompletionPrompt(prompt: string): SentenceCompletionSlotConfig | null {
  const normalized = prompt.trim();
  if (!normalized.startsWith("Complete: ")) return null;
  const sentence = normalized.slice("Complete: ".length);
  const blankMatches = sentence.match(/___/g) ?? [];
  if (blankMatches.length !== 1) return null;
  const [before, after] = sentence.split("___");
  if (before === undefined || after === undefined) return null;
  if (!before.trim() && !after.trim()) return null;
  return { before, after };
}

export function isSentenceCompletionSlotActivity(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice") return false;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  return (
    activity.subjectId === "english" &&
    activity.stageId === "english-phrases-review" &&
    activity.lessonId === "english-sentence-completion" &&
    ENGLISH_SENTENCE_COMPLETION_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.includes(correct) &&
    choices.every((choice) => /^[A-Z]+$/.test(choice)) &&
    /^[A-Z]+$/.test(correct) &&
    Boolean(activity.prompt) &&
    parseSentenceCompletionPrompt(activity.prompt ?? "") !== null
  );
}

export function sentenceCompletionSlotConfig(activity: LearningActivity | undefined): SentenceCompletionSlotConfig | null {
  if (!isSentenceCompletionSlotActivity(activity) || !activity?.prompt) return null;
  return parseSentenceCompletionPrompt(activity.prompt);
}
