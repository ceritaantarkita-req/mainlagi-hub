import type { LearningActivity } from "./system";

export type PatternCompletionKind =
  | "repeat_ab"
  | "repeat_aab"
  | "repeat_abb"
  | "repeat_abc"
  | "repeat_group_pairs"
  | "repeat_abba"
  | "step_one"
  | "step_two"
  | "size_alternation";

export type PatternCompletionVisualMode = "symbol" | "number" | "size";

export type PatternCompletionConfig = {
  kind: PatternCompletionKind;
  visualMode: PatternCompletionVisualMode;
  sequence: string[];
  nextValue: string;
  unitLength?: number;
  cue: string;
};

type PatternCompletionDefinition = PatternCompletionConfig & {
  subjectId: LearningActivity["subjectId"];
  stageId: string;
  runtime: "tap_choice";
  title: string;
  prompt: string;
  choices: readonly [string, string, string];
  correctChoice: string;
};

const DEFINITIONS: Record<string, PatternCompletionDefinition> = {
  "math-pattern-ab-shapes": {
    subjectId: "math",
    stageId: "math-banding-bentuk",
    runtime: "tap_choice",
    title: "Pola ▲ ●",
    prompt: "▲ ● ▲ ● ... apa berikutnya?",
    choices: ["▲", "●", "■"],
    correctChoice: "▲",
    kind: "repeat_ab",
    visualMode: "symbol",
    sequence: ["▲", "●", "▲", "●"],
    nextValue: "▲",
    unitLength: 2,
    cue: "Perhatikan dua bentuk yang bergantian. Apa yang muncul berikutnya?"
  },
  "math-pattern-aab-colors": {
    subjectId: "math",
    stageId: "math-banding-bentuk",
    runtime: "tap_choice",
    title: "Pola merah merah biru",
    prompt: "🔴 🔴 🔵 🔴 🔴 ... warna berikutnya?",
    choices: ["🔴", "🔵", "🟡"],
    correctChoice: "🔵",
    kind: "repeat_aab",
    visualMode: "symbol",
    sequence: ["🔴", "🔴", "🔵", "🔴", "🔴"],
    nextValue: "🔵",
    unitLength: 3,
    cue: "Perhatikan kelompok warna yang berulang. Lengkapi bagian berikutnya."
  },
  "math-pattern-number-step-one": {
    subjectId: "math",
    stageId: "math-banding-bentuk",
    runtime: "tap_choice",
    title: "Pola angka naik",
    prompt: "2, 3, 4, ... angka berikutnya?",
    choices: ["5", "6", "7"],
    correctChoice: "5",
    kind: "step_one",
    visualMode: "number",
    sequence: ["2", "3", "4"],
    nextValue: "5",
    cue: "Lihat perubahan angka dari kiri ke kanan. Angka apa yang datang berikutnya?"
  },
  "math-pattern-number-step-two": {
    subjectId: "math",
    stageId: "math-banding-bentuk",
    runtime: "tap_choice",
    title: "Lompat dua",
    prompt: "2, 4, 6, ... angka berikutnya?",
    choices: ["7", "8", "10"],
    correctChoice: "8",
    kind: "step_two",
    visualMode: "number",
    sequence: ["2", "4", "6"],
    nextValue: "8",
    cue: "Lihat jarak antarangka. Pilih angka yang melanjutkan pola."
  },
  "math-pattern-size": {
    subjectId: "math",
    stageId: "math-banding-bentuk",
    runtime: "tap_choice",
    title: "Pola kecil-besar",
    prompt: "• ⬤ • ⬤ ... bentuk berikutnya?",
    choices: ["•", "⬤", "■"],
    correctChoice: "•",
    kind: "size_alternation",
    visualMode: "size",
    sequence: ["kecil", "besar", "kecil", "besar"],
    nextValue: "•",
    unitLength: 2,
    cue: "Perhatikan ukuran yang bergantian. Ukuran apa yang muncul berikutnya?"
  },
  "logic-pattern-aab-stars": {
    subjectId: "logic",
    stageId: "logic-patterns-sequences-relations",
    runtime: "tap_choice",
    title: "Pola dua bintang satu lingkaran",
    prompt: "★ ★ ○  ★ ★ ○  ★ ★ ... selanjutnya?",
    choices: ["○", "★", "▲"],
    correctChoice: "○",
    kind: "repeat_aab",
    visualMode: "symbol",
    sequence: ["★", "★", "○", "★", "★", "○", "★", "★"],
    nextValue: "○",
    unitLength: 3,
    cue: "Perhatikan kelompok tiga simbol yang berulang. Simbol apa yang datang berikutnya?"
  },
  "logic-pattern-abb-shapes": {
    subjectId: "logic",
    stageId: "logic-patterns-sequences-relations",
    runtime: "tap_choice",
    title: "Pola satu bulat dua segitiga",
    prompt: "● ▲ ▲  ● ▲ ▲  ● ... selanjutnya?",
    choices: ["▲", "●", "■"],
    correctChoice: "▲",
    kind: "repeat_abb",
    visualMode: "symbol",
    sequence: ["●", "▲", "▲", "●", "▲", "▲", "●"],
    nextValue: "▲",
    unitLength: 3,
    cue: "Cari kelompok satu lingkaran lalu dua segitiga yang terus berulang."
  },
  "logic-pattern-abc-shapes": {
    subjectId: "logic",
    stageId: "logic-patterns-sequences-relations",
    runtime: "tap_choice",
    title: "Pola tiga bentuk",
    prompt: "● ▲ ■  ● ▲ ■  ● ... selanjutnya?",
    choices: ["▲", "■", "●"],
    correctChoice: "▲",
    kind: "repeat_abc",
    visualMode: "symbol",
    sequence: ["●", "▲", "■", "●", "▲", "■", "●"],
    nextValue: "▲",
    unitLength: 3,
    cue: "Perhatikan urutan tiga bentuk yang sama-sama berulang."
  },
  "logic-pattern-paired-blocks": {
    subjectId: "logic",
    stageId: "logic-patterns-sequences-relations",
    runtime: "tap_choice",
    title: "Pola dua-dua",
    prompt: "▲ ▲  ● ●  ▲ ▲ ... kelompok berikutnya?",
    choices: ["● ●", "▲ ●", "■ ■"],
    correctChoice: "● ●",
    kind: "repeat_group_pairs",
    visualMode: "symbol",
    sequence: ["▲ ▲", "● ●", "▲ ▲"],
    nextValue: "● ●",
    unitLength: 2,
    cue: "Setiap bagian adalah satu kelompok dua simbol. Pilih satu kelompok berikutnya."
  },
  "logic-pattern-abba": {
    subjectId: "logic",
    stageId: "logic-patterns-sequences-relations",
    runtime: "tap_choice",
    title: "Pola cermin empat langkah",
    prompt: "● ▲ ▲ ●  ● ▲ ▲ ... selanjutnya?",
    choices: ["●", "▲", "■"],
    correctChoice: "●",
    kind: "repeat_abba",
    visualMode: "symbol",
    sequence: ["●", "▲", "▲", "●", "●", "▲", "▲"],
    nextValue: "●",
    unitLength: 4,
    cue: "Perhatikan pola empat langkah yang kembali seperti cermin."
  }
};

function exactChoices(actual: string[] | undefined, expected: readonly string[]): boolean {
  if (!actual || actual.length !== expected.length) return false;
  return actual.every((choice, index) => choice === expected[index]);
}

export function patternCompletionConfig(activity: LearningActivity | undefined): PatternCompletionConfig | null {
  if (!activity) return null;
  const definition = DEFINITIONS[activity.id];
  if (!definition) return null;

  const identityMatches =
    activity.subjectId === definition.subjectId &&
    activity.stageId === definition.stageId &&
    activity.runtime === definition.runtime &&
    activity.title === definition.title &&
    activity.prompt === definition.prompt &&
    exactChoices(activity.choices, definition.choices) &&
    activity.correctChoice === definition.correctChoice;

  if (!identityMatches) return null;

  const choices = activity.choices ?? [];
  if (choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(definition.correctChoice)) return null;
  if (definition.nextValue !== definition.correctChoice) return null;

  const { subjectId: _subjectId, stageId: _stageId, runtime: _runtime, title: _title, prompt: _prompt, choices: _choices, correctChoice: _correctChoice, ...config } = definition;
  return { ...config, sequence: [...config.sequence] };
}
