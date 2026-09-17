import type { LearningActivity } from "./system";

const CLOZE_SENTENCE_CHOICE_IDS = new Set([
  "bahasa-lengkap-ayah-minum",
  "bahasa-lengkap-burung-terbang",
  "bahasa-lengkap-kucing-tidur",
  "bahasa-lengkap-ibu-pasar",
  "bahasa-lengkap-rina-payung"
]);

export type ClozeSentenceChoiceConfig = {
  before: string;
  after: string;
};

export function parseClozeSentencePrompt(prompt: string): ClozeSentenceChoiceConfig | null {
  const parts = prompt.split("___");
  if (parts.length !== 2) return null;
  const before = parts[0]?.trimEnd() ?? "";
  const after = parts[1]?.trimStart() ?? "";
  if (!before || !after) return null;
  return { before, after };
}

export function isClozeSentenceChoiceActivity(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice") return false;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  return (
    activity.subjectId === "bahasa" &&
    activity.stageId === "bahasa-literasi-terapan" &&
    CLOZE_SENTENCE_CHOICE_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === 3 &&
    choices.includes(correct) &&
    Boolean(activity.prompt) &&
    Boolean(parseClozeSentencePrompt(activity.prompt ?? ""))
  );
}

export function clozeSentenceChoiceConfig(activity: LearningActivity | undefined): ClozeSentenceChoiceConfig | null {
  if (!isClozeSentenceChoiceActivity(activity) || !activity?.prompt) return null;
  return parseClozeSentencePrompt(activity.prompt);
}
