import type { LearningActivity } from "./system";

export type PatternCompletionKind = "repeat_ab" | "repeat_aab" | "step_one" | "step_two" | "size_alternation";
export type PatternCompletionVisualMode = "symbol" | "number" | "size";

export type PatternCompletionConfig = {
  kind: PatternCompletionKind;
  visualMode: PatternCompletionVisualMode;
  sequence: string[];
  unitLength?: number;
  cue: string;
};

const CONFIGS: Record<string, PatternCompletionConfig> = {
  "math-pattern-ab-shapes": {
    kind: "repeat_ab",
    visualMode: "symbol",
    sequence: ["▲", "●", "▲", "●"],
    unitLength: 2,
    cue: "Perhatikan dua bentuk yang bergantian. Apa yang muncul berikutnya?"
  },
  "math-pattern-aab-colors": {
    kind: "repeat_aab",
    visualMode: "symbol",
    sequence: ["🔴", "🔴", "🔵", "🔴", "🔴"],
    unitLength: 3,
    cue: "Perhatikan kelompok warna yang berulang. Lengkapi bagian berikutnya."
  },
  "math-pattern-number-step-one": {
    kind: "step_one",
    visualMode: "number",
    sequence: ["2", "3", "4"],
    cue: "Lihat perubahan angka dari kiri ke kanan. Angka apa yang datang berikutnya?"
  },
  "math-pattern-number-step-two": {
    kind: "step_two",
    visualMode: "number",
    sequence: ["2", "4", "6"],
    cue: "Lihat jarak antarangka. Pilih angka yang melanjutkan pola."
  },
  "math-pattern-size": {
    kind: "size_alternation",
    visualMode: "size",
    sequence: ["kecil", "besar", "kecil", "besar"],
    unitLength: 2,
    cue: "Perhatikan ukuran yang bergantian. Ukuran apa yang muncul berikutnya?"
  }
};

export function patternCompletionConfig(activity: LearningActivity | undefined): PatternCompletionConfig | null {
  if (!activity) return null;
  return CONFIGS[activity.id] ?? null;
}
