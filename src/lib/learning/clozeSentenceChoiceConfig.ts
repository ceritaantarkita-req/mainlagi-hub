import type { LearningActivity } from "./system";

type ClozeLocale = "id-ID" | "en-US";

type CanonicalCloze = {
  subjectId: string;
  stageId: string;
  prompt: string;
  choices: readonly [string, string, string];
  correctChoice: string;
  locale: ClozeLocale;
};

const CANONICAL_CLOZE_SENTENCE_CHOICES: Record<string, CanonicalCloze> = {
  "bahasa-lengkap-ayah-minum": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Ayah minum ___ setelah berolahraga.",
    choices: ["air", "bantal", "sepatu"],
    correctChoice: "air",
    locale: "id-ID"
  },
  "bahasa-lengkap-burung-terbang": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Burung ___ di langit.",
    choices: ["berenang", "terbang", "membaca"],
    correctChoice: "terbang",
    locale: "id-ID"
  },
  "bahasa-lengkap-kucing-tidur": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Kucing tidur di atas ___.",
    choices: ["kursi", "hujan", "awan"],
    correctChoice: "kursi",
    locale: "id-ID"
  },
  "bahasa-lengkap-ibu-pasar": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Ibu membeli sayur di ___.",
    choices: ["pasar", "langit", "sungai"],
    correctChoice: "pasar",
    locale: "id-ID"
  },
  "bahasa-lengkap-rina-payung": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Saat hujan, Rina memakai ___.",
    choices: ["payung", "sendok", "pensil"],
    correctChoice: "payung",
    locale: "id-ID"
  },
  "english-complete-cat-sleeps": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: The cat ___.",
    choices: ["SLEEPS", "BOOK", "YELLOW"],
    correctChoice: "SLEEPS",
    locale: "en-US"
  },
  "english-complete-bird-flies": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: The bird ___.",
    choices: ["FLIES", "MILK", "HAND"],
    correctChoice: "FLIES",
    locale: "en-US"
  },
  "english-complete-i-read": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: I ___ a book.",
    choices: ["READ", "RED", "RABBIT"],
    correctChoice: "READ",
    locale: "en-US"
  },
  "english-complete-two-apples": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: I see two ___.",
    choices: ["APPLES", "FATHER", "RUN"],
    correctChoice: "APPLES",
    locale: "en-US"
  },
  "english-complete-mother-family": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: My ___ is here.",
    choices: ["MOTHER", "CHAIR", "FISH"],
    correctChoice: "MOTHER",
    locale: "en-US"
  }
};

export type ClozeSentenceChoiceConfig = {
  before: string;
  after: string;
  locale: ClozeLocale;
};

export function parseClozeSentencePrompt(prompt: string): Pick<ClozeSentenceChoiceConfig, "before" | "after"> | null {
  const parts = prompt.split("___");
  if (parts.length !== 2) return null;
  const before = parts[0]?.trimEnd() ?? "";
  const after = parts[1]?.trimStart() ?? "";
  if (!before || !after) return null;
  return { before, after };
}

function exactChoices(actual: string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && actual.every((choice, index) => choice === expected[index]);
}

export function isClozeSentenceChoiceActivity(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice") return false;
  const canonical = CANONICAL_CLOZE_SENTENCE_CHOICES[activity.id];
  if (!canonical) return false;

  return (
    activity.subjectId === canonical.subjectId &&
    activity.stageId === canonical.stageId &&
    activity.prompt === canonical.prompt &&
    exactChoices(activity.choices ?? [], canonical.choices) &&
    activity.correctChoice === canonical.correctChoice &&
    Boolean(parseClozeSentencePrompt(canonical.prompt))
  );
}

export function clozeSentenceChoiceConfig(activity: LearningActivity | undefined): ClozeSentenceChoiceConfig | null {
  if (!isClozeSentenceChoiceActivity(activity) || !activity?.prompt) return null;
  const canonical = CANONICAL_CLOZE_SENTENCE_CHOICES[activity.id];
  const parsed = parseClozeSentencePrompt(activity.prompt);
  if (!canonical || !parsed) return null;
  return { ...parsed, locale: canonical.locale };
}
