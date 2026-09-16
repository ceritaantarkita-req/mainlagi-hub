import type { LearningActivity } from "./system";

const SENTENCE_ORDER_CARD_IDS = new Set([
  "bahasa-urut-ibu-memasak",
  "bahasa-urut-adi-berlari",
  "bahasa-urut-kucing-tidur",
  "bahasa-urut-siti-membaca",
  "bahasa-urut-burung-terbang"
]);

export type SentenceOrderCardsConfig = {
  choiceTokens: Record<string, string[]>;
  successText: string;
};

export function sentenceOrderTokens(sentence: string): string[] {
  return sentence.trim().replace(/[.!?]+$/u, "").split(/\s+/u).filter(Boolean);
}

export function isSentenceOrderCardsActivity(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice") return false;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (
    activity.subjectId !== "bahasa" ||
    activity.stageId !== "bahasa-kalimat-pemahaman" ||
    !SENTENCE_ORDER_CARD_IDS.has(activity.id) ||
    choices.length !== 3 ||
    new Set(choices).size !== 3 ||
    !choices.includes(correct) ||
    !activity.prompt
  ) return false;

  return choices.every((choice) => {
    const tokens = sentenceOrderTokens(choice);
    return tokens.length >= 3 && tokens.length <= 4 && /[.!?]$/u.test(choice);
  });
}

export function sentenceOrderCardsConfig(activity: LearningActivity | undefined): SentenceOrderCardsConfig | null {
  if (!isSentenceOrderCardsActivity(activity)) return null;
  const choices = activity?.choices ?? [];
  const choiceTokens = Object.fromEntries(choices.map((choice) => [choice, sentenceOrderTokens(choice)]));
  return {
    choiceTokens,
    successText: "Susunan kata ini membentuk kalimat yang benar."
  };
}
