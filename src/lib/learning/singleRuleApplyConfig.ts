import type { LearningActivity } from "./system";

export type SingleRuleApplyMode = "constraint_match" | "symbol_mapping" | "single_transform";

export type SingleRuleChoiceVisual = {
  label: string;
  icon: string;
  accessibleLabel: string;
};

export type SingleRuleApplyConfig = {
  mode: SingleRuleApplyMode;
  ruleLabel: string;
  inputIcon: string;
  inputLabel: string;
  targetLabel: string;
  expectedPrompt: string;
  expectedChoices: [string, string, string];
  expectedCorrectChoice: string;
  choiceVisuals: [SingleRuleChoiceVisual, SingleRuleChoiceVisual, SingleRuleChoiceVisual];
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, SingleRuleApplyConfig> = {
  "logic-if-red-then-circle": {
    mode: "constraint_match",
    ruleLabel: "Jika merah, pilih lingkaran.",
    inputIcon: "🔴",
    inputLabel: "Kondisi: merah",
    targetLabel: "Cari pilihan yang memenuhi aturan",
    expectedPrompt: "Aturannya: jika merah, pilih lingkaran. Mana yang benar?",
    expectedChoices: ["🔴 lingkaran", "🔴 segitiga", "🔵 lingkaran"],
    expectedCorrectChoice: "🔴 lingkaran",
    choiceVisuals: [
      { label: "🔴 lingkaran", icon: "🔴 ●", accessibleLabel: "merah dan lingkaran" },
      { label: "🔴 segitiga", icon: "🔴 ▲", accessibleLabel: "merah dan segitiga" },
      { label: "🔵 lingkaran", icon: "🔵 ●", accessibleLabel: "biru dan lingkaran" }
    ],
    cue: "Cocokkan kondisi merah dengan bentuk yang diminta aturan.",
    successText: "Pilihan merah berbentuk lingkaran memenuhi satu aturan itu."
  },
  "logic-if-two-then-star": {
    mode: "constraint_match",
    ruleLabel: "Jika jumlahnya 2, pilih bintang.",
    inputIcon: "2",
    inputLabel: "Kondisi: jumlah 2",
    targetLabel: "Cari pilihan yang memenuhi aturan",
    expectedPrompt: "Aturannya: jika jumlahnya 2, pilih bintang. Mana yang cocok?",
    expectedChoices: ["★★", "●●", "★★★"],
    expectedCorrectChoice: "★★",
    choiceVisuals: [
      { label: "★★", icon: "★★", accessibleLabel: "dua bintang" },
      { label: "●●", icon: "●●", accessibleLabel: "dua lingkaran" },
      { label: "★★★", icon: "★★★", accessibleLabel: "tiga bintang" }
    ],
    cue: "Periksa jumlah dan bentuk sekaligus.",
    successText: "Dua bintang memenuhi kondisi jumlah 2 dan bentuk bintang."
  },
  "logic-rule-small-goes-left": {
    mode: "constraint_match",
    ruleLabel: "Benda kecil harus di kiri benda besar.",
    inputIcon: "● → ⬤",
    inputLabel: "Aturan posisi kecil dan besar",
    targetLabel: "Pilih susunan yang mengikuti aturan",
    expectedPrompt: "Aturannya: benda kecil harus di kiri benda besar. Mana susunan yang benar?",
    expectedChoices: ["●  ⬤", "⬤  ●", "⬤  ⬤"],
    expectedCorrectChoice: "●  ⬤",
    choiceVisuals: [
      { label: "●  ⬤", icon: "●  ⬤", accessibleLabel: "benda kecil di kiri benda besar" },
      { label: "⬤  ●", icon: "⬤  ●", accessibleLabel: "benda besar di kiri benda kecil" },
      { label: "⬤  ⬤", icon: "⬤  ⬤", accessibleLabel: "dua benda besar" }
    ],
    cue: "Cari susunan dengan benda kecil di sebelah kiri benda besar.",
    successText: "Benda kecil berada di kiri benda besar seperti aturan."
  },
  "logic-rule-up-means-one": {
    mode: "symbol_mapping",
    ruleLabel: "↑ berarti satu titik; → berarti dua titik.",
    inputIcon: "→",
    inputLabel: "Input: panah kanan",
    targetLabel: "Hasil pemetaan",
    expectedPrompt: "Aturannya: ↑ berarti satu titik dan → berarti dua titik. Apa pasangan untuk → ?",
    expectedChoices: ["●●", "●", "●●●"],
    expectedCorrectChoice: "●●",
    choiceVisuals: [
      { label: "●●", icon: "●●", accessibleLabel: "dua titik" },
      { label: "●", icon: "●", accessibleLabel: "satu titik" },
      { label: "●●●", icon: "●●●", accessibleLabel: "tiga titik" }
    ],
    cue: "Gunakan pasangan yang diberikan untuk panah kanan.",
    successText: "Panah kanan dipetakan ke dua titik."
  },
  "logic-rule-switch-shape": {
    mode: "single_transform",
    ruleLabel: "Lingkaran berubah menjadi segitiga.",
    inputIcon: "●",
    inputLabel: "Mulai: lingkaran",
    targetLabel: "Hasil setelah satu aturan",
    expectedPrompt: "Aturannya: lingkaran berubah jadi segitiga. Jika mulai dari ●, hasilnya?",
    expectedChoices: ["▲", "■", "●"],
    expectedCorrectChoice: "▲",
    choiceVisuals: [
      { label: "▲", icon: "▲", accessibleLabel: "segitiga" },
      { label: "■", icon: "■", accessibleLabel: "kotak" },
      { label: "●", icon: "●", accessibleLabel: "lingkaran" }
    ],
    cue: "Terapkan satu perubahan dari bentuk awal.",
    successText: "Satu aturan mengubah lingkaran menjadi segitiga."
  }
};

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function singleRuleApplyConfig(activity: LearningActivity | undefined): SingleRuleApplyConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "logic" || activity.stageId !== "logic-conditional-analogy-inference" || activity.runtime !== "tap_choice") return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  if (activity.prompt !== config.expectedPrompt) return null;
  if (!sameStrings(choices, config.expectedChoices)) return null;
  if (activity.correctChoice !== config.expectedCorrectChoice) return null;
  if (new Set(choices).size !== 3 || !choices.includes(config.expectedCorrectChoice)) return null;
  if (!sameStrings(config.choiceVisuals.map((visual) => visual.label), choices)) return null;
  if (config.choiceVisuals.some((visual) => !visual.icon || !visual.accessibleLabel)) return null;
  if (!config.ruleLabel || !config.inputIcon || !config.inputLabel || !config.targetLabel || !config.cue || !config.successText) return null;
  return config;
}

export function isSingleRuleApplyActivity(activity: LearningActivity | undefined): boolean {
  return singleRuleApplyConfig(activity) !== null;
}
