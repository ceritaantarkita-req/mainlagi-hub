import type { LearningActivity } from "./system";

export type ClozeSentenceChoicePresentation = {
  lang: "id-ID" | "en-US";
  heading: string;
  instruction: string;
  sentenceLabel: string;
  sentenceAriaLabel: string;
  choicesAriaLabel: string;
  idleFeedback: string;
  retryFeedback: string;
  successFeedback: string;
  nextLabel: string;
};

export type ClozeSentenceChoiceConfig = {
  before: string;
  after: string;
  presentation: ClozeSentenceChoicePresentation;
};

type CanonicalClozeDefinition = {
  subjectId: "bahasa" | "english";
  stageId: string;
  prompt: string;
  choices: readonly [string, string, string];
  correctChoice: string;
  presentation: ClozeSentenceChoicePresentation;
};

const BAHASA_PRESENTATION: ClozeSentenceChoicePresentation = {
  lang: "id-ID",
  heading: "Lengkapi kalimat",
  instruction: "Pilih kata yang membuat kalimat ini lengkap dan masuk akal.",
  sentenceLabel: "Kalimat",
  sentenceAriaLabel: "Kalimat yang perlu dilengkapi",
  choicesAriaLabel: "Pilihan kata untuk melengkapi kalimat",
  idleFeedback: "💡 Baca kalimat lengkapnya dalam hati setelah memilih kata.",
  retryFeedback: "💡 Belum tepat. Baca seluruh kalimatnya, lalu coba kata lain.",
  successFeedback: "⭐ Tepat! Kata itu membuat kalimatnya lengkap.",
  nextLabel: "Pilih permainan lain"
};

const ENGLISH_PRESENTATION: ClozeSentenceChoicePresentation = {
  lang: "en-US",
  heading: "Complete the sentence",
  instruction: "Choose the word that makes the sentence complete and makes sense.",
  sentenceLabel: "Sentence",
  sentenceAriaLabel: "Sentence to complete",
  choicesAriaLabel: "Words to complete the sentence",
  idleFeedback: "💡 Read the whole sentence in your head after choosing a word.",
  retryFeedback: "💡 Not quite. Read the whole sentence, then try another word.",
  successFeedback: "⭐ Great! That word completes the sentence.",
  nextLabel: "Choose another game"
};

const CLOZE_SENTENCE_CHOICE_DEFINITIONS: Record<string, CanonicalClozeDefinition> = {
  "bahasa-lengkap-ayah-minum": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Ayah minum ___ setelah berolahraga.",
    choices: ["air", "bantal", "sepatu"],
    correctChoice: "air",
    presentation: BAHASA_PRESENTATION
  },
  "bahasa-lengkap-burung-terbang": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Burung ___ di langit.",
    choices: ["berenang", "terbang", "membaca"],
    correctChoice: "terbang",
    presentation: BAHASA_PRESENTATION
  },
  "bahasa-lengkap-kucing-tidur": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Kucing tidur di atas ___.",
    choices: ["kursi", "hujan", "awan"],
    correctChoice: "kursi",
    presentation: BAHASA_PRESENTATION
  },
  "bahasa-lengkap-ibu-pasar": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Ibu membeli sayur di ___.",
    choices: ["pasar", "langit", "sungai"],
    correctChoice: "pasar",
    presentation: BAHASA_PRESENTATION
  },
  "bahasa-lengkap-rina-payung": {
    subjectId: "bahasa",
    stageId: "bahasa-literasi-terapan",
    prompt: "Saat hujan, Rina memakai ___.",
    choices: ["payung", "sendok", "pensil"],
    correctChoice: "payung",
    presentation: BAHASA_PRESENTATION
  },
  "english-complete-cat-sleeps": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: The cat ___.",
    choices: ["SLEEPS", "BOOK", "YELLOW"],
    correctChoice: "SLEEPS",
    presentation: ENGLISH_PRESENTATION
  },
  "english-complete-bird-flies": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: The bird ___.",
    choices: ["FLIES", "MILK", "HAND"],
    correctChoice: "FLIES",
    presentation: ENGLISH_PRESENTATION
  },
  "english-complete-i-read": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: I ___ a book.",
    choices: ["READ", "RED", "RABBIT"],
    correctChoice: "READ",
    presentation: ENGLISH_PRESENTATION
  },
  "english-complete-two-apples": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: I see two ___.",
    choices: ["APPLES", "FATHER", "RUN"],
    correctChoice: "APPLES",
    presentation: ENGLISH_PRESENTATION
  },
  "english-complete-mother-family": {
    subjectId: "english",
    stageId: "english-phrases-review",
    prompt: "Complete: My ___ is here.",
    choices: ["MOTHER", "CHAIR", "FISH"],
    correctChoice: "MOTHER",
    presentation: ENGLISH_PRESENTATION
  }
};

function sameChoices(actual: string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && actual.every((choice, index) => choice === expected[index]);
}

export function parseClozeSentencePrompt(prompt: string): Pick<ClozeSentenceChoiceConfig, "before" | "after"> | null {
  const parts = prompt.split("___");
  if (parts.length !== 2) return null;
  const before = parts[0]?.trimEnd() ?? "";
  const after = parts[1]?.trimStart() ?? "";
  if (!before || !after) return null;
  return { before, after };
}

export function isClozeSentenceChoiceActivity(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice") return false;
  const definition = CLOZE_SENTENCE_CHOICE_DEFINITIONS[activity.id];
  if (!definition) return false;

  const choices = activity.choices ?? [];
  const parsed = activity.prompt ? parseClozeSentencePrompt(activity.prompt) : null;

  return (
    activity.subjectId === definition.subjectId &&
    activity.stageId === definition.stageId &&
    activity.prompt === definition.prompt &&
    sameChoices(choices, definition.choices) &&
    new Set(choices).size === definition.choices.length &&
    activity.correctChoice === definition.correctChoice &&
    Boolean(parsed)
  );
}

export function clozeSentenceChoiceConfig(activity: LearningActivity | undefined): ClozeSentenceChoiceConfig | null {
  if (!isClozeSentenceChoiceActivity(activity) || !activity?.prompt) return null;
  const definition = CLOZE_SENTENCE_CHOICE_DEFINITIONS[activity.id];
  const parsed = parseClozeSentencePrompt(activity.prompt);
  if (!definition || !parsed) return null;
  return { ...parsed, presentation: definition.presentation };
}
