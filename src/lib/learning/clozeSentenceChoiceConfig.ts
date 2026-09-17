import type { LearningActivity } from "./system";

export type ClozeSentenceChoiceConfig = {
  before: string;
  after: string;
};

const SCOPED_IDS = new Set([
  "bahasa-lengkap-ayah-minum",
  "bahasa-lengkap-burung-terbang",
  "bahasa-lengkap-kucing-tidur",
  "bahasa-lengkap-ibu-pasar",
  "bahasa-lengkap-rina-payung"
]);

export function isClozeSentenceChoiceCandidate(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice") return false;
  if (activity.subjectId !== "bahasa" || activity.stageId !== "bahasa-literasi-terapan") return false;
  if (!SCOPED_IDS.has(activity.id)) return false;

  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(correct)) return false;

  const prompt = activity.prompt ?? "";
  const blankMatches = prompt.match(/___/g) ?? [];
  return blankMatches.length === 1;
}

export function clozeSentenceChoiceConfig(activity: LearningActivity | undefined): ClozeSentenceChoiceConfig | null {
  if (!isClozeSentenceChoiceCandidate(activity)) return null;
  const [before, after, ...rest] = (activity?.prompt ?? "").split("___");
  if (rest.length > 0 || before === undefined || after === undefined) return null;
  if (!before.trim() && !after.trim()) return null;
  return { before, after };
}
