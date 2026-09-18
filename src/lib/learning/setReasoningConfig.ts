import type { LearningActivity } from "./system";

export type SetReasoningRule = {
  label: string;
  membership: "in" | "out";
};

export type SetReasoningConfig = {
  rules: [SetReasoningRule, SetReasoningRule];
  operationLabel: string;
  targetLabel: string;
  choiceLabels: Record<string, string>;
  successText: string;
  expectedStageId: string;
  expectedPrompt: string;
  expectedChoices: [string, string, string];
  expectedCorrectChoice: string;
};

const CONFIGS: Record<string, SetReasoningConfig> = {
  "logic-set-both-red-round": {
    rules: [
      { label: "Merah", membership: "in" },
      { label: "Bulat", membership: "in" }
    ],
    operationLabel: "Irisan A ∩ B",
    targetLabel: "Harus masuk dua kelompok sekaligus",
    choiceLabels: {
      "lingkaran merah": "Lingkaran merah",
      "kotak merah": "Kotak merah",
      "lingkaran biru": "Lingkaran biru"
    },
    successText: "Lingkaran merah memenuhi dua aturan: merah dan bulat.",
    expectedStageId: "logic-mixed-reasoning-challenge",
    expectedPrompt: "Kelompok A = benda merah. Kelompok B = benda bulat. Mana yang masuk A dan B?",
    expectedChoices: ["lingkaran merah", "kotak merah", "lingkaran biru"],
    expectedCorrectChoice: "lingkaran merah"
  },
  "logic-set-animal-not-bird": {
    rules: [
      { label: "Hewan", membership: "in" },
      { label: "Burung", membership: "out" }
    ],
    operationLabel: "A tetapi bukan B",
    targetLabel: "Masuk kelompok Hewan, di luar kelompok Burung",
    choiceLabels: { kucing: "Kucing", elang: "Elang", merpati: "Merpati" },
    successText: "Kucing adalah hewan, tetapi bukan burung.",
    expectedStageId: "logic-mixed-reasoning-challenge",
    expectedPrompt: "Pilih hewan yang bukan burung.",
    expectedChoices: ["kucing", "elang", "merpati"],
    expectedCorrectChoice: "kucing"
  },
  "logic-set-shape-not-square": {
    rules: [
      { label: "Bentuk", membership: "in" },
      { label: "Kotak", membership: "out" }
    ],
    operationLabel: "A tetapi bukan B",
    targetLabel: "Masuk kelompok Bentuk, di luar kelompok Kotak",
    choiceLabels: {
      "segitiga ▲": "Segitiga ▲",
      "kotak biru 🟦": "Kotak biru 🟦",
      "kotak merah 🟥": "Kotak merah 🟥"
    },
    successText: "Segitiga adalah bentuk, tetapi bukan kotak.",
    expectedStageId: "logic-mixed-reasoning-challenge",
    expectedPrompt: "Semua pilihan adalah bentuk. Mana yang bukan kotak?",
    expectedChoices: ["segitiga ▲", "kotak biru 🟦", "kotak merah 🟥"],
    expectedCorrectChoice: "segitiga ▲"
  },
  "logic-set-only-blue-triangle": {
    rules: [
      { label: "Biru", membership: "in" },
      { label: "Segitiga", membership: "in" }
    ],
    operationLabel: "Irisan A ∩ B",
    targetLabel: "Harus masuk dua kelompok sekaligus",
    choiceLabels: {
      "segitiga biru": "Segitiga biru",
      "lingkaran biru": "Lingkaran biru",
      "segitiga merah": "Segitiga merah"
    },
    successText: "Segitiga biru memenuhi dua aturan: biru dan segitiga.",
    expectedStageId: "logic-mixed-reasoning-challenge",
    expectedPrompt: "Mana yang sekaligus biru dan segitiga?",
    expectedChoices: ["segitiga biru", "lingkaran biru", "segitiga merah"],
    expectedCorrectChoice: "segitiga biru"
  },
  "logic-set-outside-round-red": {
    rules: [
      { label: "Merah", membership: "out" },
      { label: "Bulat", membership: "out" }
    ],
    operationLabel: "Di luar A ∪ B",
    targetLabel: "Tidak boleh masuk kelompok Merah maupun Bulat",
    choiceLabels: {
      "kotak biru": "Kotak biru",
      "lingkaran biru": "Lingkaran biru",
      "kotak merah": "Kotak merah"
    },
    successText: "Kotak biru bukan merah dan bukan bulat, jadi berada di luar kedua kelompok target.",
    expectedStageId: "logic-mixed-reasoning-challenge",
    expectedPrompt: "Kelompok yang dicari adalah merah atau bulat. Mana yang tidak termasuk keduanya?",
    expectedChoices: ["kotak biru", "lingkaran biru", "kotak merah"],
    expectedCorrectChoice: "kotak biru"
  },
  "logic-classify-red-round": {
    rules: [
      { label: "Merah", membership: "in" },
      { label: "Bulat", membership: "in" }
    ],
    operationLabel: "Dua syarat sekaligus",
    targetLabel: "Harus cocok dengan warna merah dan bentuk bulat",
    choiceLabels: { "🔴": "🔴 Merah dan bulat", "🟥": "🟥 Merah dan bersudut", "🔵": "🔵 Biru dan bulat" },
    successText: "🔴 cocok dengan dua syarat: merah dan bulat.",
    expectedStageId: "logic-conditional-analogy-inference",
    expectedPrompt: "Mana yang sekaligus merah dan bulat?",
    expectedChoices: ["🔴", "🟥", "🔵"],
    expectedCorrectChoice: "🔴"
  },
  "logic-classify-blue-not-round": {
    rules: [
      { label: "Biru", membership: "in" },
      { label: "Bulat", membership: "out" }
    ],
    operationLabel: "Syarat + pengecualian",
    targetLabel: "Harus biru dan tidak bulat",
    choiceLabels: { "🟦": "🟦 Biru dan bersudut", "🔵": "🔵 Biru dan bulat", "🟥": "🟥 Merah dan bersudut" },
    successText: "🟦 berwarna biru dan bukan bentuk bulat.",
    expectedStageId: "logic-conditional-analogy-inference",
    expectedPrompt: "Mana yang biru tetapi bukan bulat?",
    expectedChoices: ["🟦", "🔵", "🟥"],
    expectedCorrectChoice: "🟦"
  },
  "logic-classify-two-red-items": {
    rules: [
      { label: "Tepat dua benda", membership: "in" },
      { label: "Merah", membership: "in" }
    ],
    operationLabel: "Dua syarat sekaligus",
    targetLabel: "Harus tepat dua benda dan semuanya merah",
    choiceLabels: { "🔴🔴": "🔴🔴 Dua benda merah", "🔴🔴🔴": "🔴🔴🔴 Tiga benda merah", "🔵🔵": "🔵🔵 Dua benda biru" },
    successText: "🔴🔴 memenuhi dua syarat: tepat dua benda dan berwarna merah.",
    expectedStageId: "logic-conditional-analogy-inference",
    expectedPrompt: "Mana kelompok yang punya tepat dua benda merah?",
    expectedChoices: ["🔴🔴", "🔴🔴🔴", "🔵🔵"],
    expectedCorrectChoice: "🔴🔴"
  },
  "logic-classify-arrow-not-left": {
    rules: [
      { label: "Panah", membership: "in" },
      { label: "Mengarah ke kiri", membership: "out" }
    ],
    operationLabel: "Syarat + pengecualian",
    targetLabel: "Harus berupa panah yang tidak mengarah ke kiri",
    choiceLabels: { "→": "→ Panah ke kanan", "←": "← Panah ke kiri", "↓": "↓ Panah ke bawah" },
    successText: "→ adalah panah yang tidak mengarah ke kiri.",
    expectedStageId: "logic-conditional-analogy-inference",
    expectedPrompt: "Mana panah yang tidak mengarah ke kiri?",
    expectedChoices: ["→", "←", "↓"],
    expectedCorrectChoice: "→"
  },
  "logic-classify-same-shape-different-color": {
    rules: [
      { label: "Bentuk sama", membership: "in" },
      { label: "Warna berbeda", membership: "in" }
    ],
    operationLabel: "Dua syarat sekaligus",
    targetLabel: "Pasangan harus berbentuk sama dengan warna berbeda",
    choiceLabels: {
      "🔴 🔵": "🔴 🔵 Bentuk sama, warna berbeda",
      "🔴 🟥": "🔴 🟥 Bentuk berbeda",
      "🟥 🔵": "🟥 🔵 Bentuk berbeda"
    },
    successText: "🔴 🔵 memiliki bentuk yang sama dan warna yang berbeda.",
    expectedStageId: "logic-conditional-analogy-inference",
    expectedPrompt: "Pasangan mana yang bentuknya sama tetapi warnanya berbeda?",
    expectedChoices: ["🔴 🔵", "🔴 🟥", "🟥 🔵"],
    expectedCorrectChoice: "🔴 🔵"
  }
};

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function setReasoningConfig(activity: LearningActivity | undefined): SetReasoningConfig | null {
  if (!activity || activity.subjectId !== "logic" || activity.runtime !== "tap_choice") return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  if (activity.stageId !== config.expectedStageId) return null;
  if (activity.prompt !== config.expectedPrompt) return null;
  if (!sameStrings(choices, config.expectedChoices)) return null;
  if (activity.correctChoice !== config.expectedCorrectChoice) return null;
  if (choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(config.expectedCorrectChoice)) return null;
  if (!sameStrings(Object.keys(config.choiceLabels), choices)) return null;
  if (!config.rules.every((rule) => Boolean(rule.label) && (rule.membership === "in" || rule.membership === "out"))) return null;
  if (!config.operationLabel || !config.targetLabel || !config.successText) return null;
  return config;
}
