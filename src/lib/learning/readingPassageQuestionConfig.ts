import type { LearningActivity } from "./system";

const READING_PASSAGE_QUESTION_IDS = new Set([
  "bahasa-baca-lala-kucing",
  "bahasa-baca-dodi-sepeda",
  "bahasa-baca-nina-bunga",
  "bahasa-baca-raka-sarapan",
  "bahasa-baca-sari-hujan"
]);

export type ReadingPassageQuestionConfig = {
  passage: string;
  question: string;
  successText: string;
};

export function parseReadingPassageQuestion(prompt: string): Pick<ReadingPassageQuestionConfig, "passage" | "question"> | null {
  const match = prompt.trim().match(/^Baca:\s*['‘’"](.+?)['‘’"]\s+(.+\?)$/u);
  if (!match) return null;
  const passage = match[1]?.trim() ?? "";
  const question = match[2]?.trim() ?? "";
  if (!passage || !question) return null;
  return { passage, question };
}

export function isReadingPassageQuestionActivity(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice") return false;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  return (
    activity.subjectId === "bahasa" &&
    activity.stageId === "bahasa-kalimat-pemahaman" &&
    activity.lessonId === "bahasa-bacaan-pendek" &&
    activity.packId === "bahasa.pack.bacaan-pendek" &&
    READING_PASSAGE_QUESTION_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === 3 &&
    choices.includes(correct) &&
    Boolean(activity.prompt) &&
    Boolean(parseReadingPassageQuestion(activity.prompt ?? ""))
  );
}

export function readingPassageQuestionConfig(activity: LearningActivity | undefined): ReadingPassageQuestionConfig | null {
  if (!isReadingPassageQuestionActivity(activity) || !activity?.prompt) return null;
  const parsed = parseReadingPassageQuestion(activity.prompt);
  if (!parsed) return null;
  return {
    ...parsed,
    successText: "Jawabanmu sesuai dengan informasi yang tertulis di bacaan."
  };
}
