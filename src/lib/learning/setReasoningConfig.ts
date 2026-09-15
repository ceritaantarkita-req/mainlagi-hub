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
    successText: "Lingkaran merah memenuhi dua aturan: merah dan bulat."
  },
  "logic-set-animal-not-bird": {
    rules: [
      { label: "Hewan", membership: "in" },
      { label: "Burung", membership: "out" }
    ],
    operationLabel: "A tetapi bukan B",
    targetLabel: "Masuk kelompok Hewan, di luar kelompok Burung",
    choiceLabels: { kucing: "Kucing", elang: "Elang", merpati: "Merpati" },
    successText: "Kucing adalah hewan, tetapi bukan burung."
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
    successText: "Segitiga adalah bentuk, tetapi bukan kotak."
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
    successText: "Segitiga biru memenuhi dua aturan: biru dan segitiga."
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
    successText: "Kotak biru bukan merah dan bukan bulat, jadi berada di luar kedua kelompok target."
  }
};

export function setReasoningConfig(activity: LearningActivity | undefined): SetReasoningConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  if (choices.length !== 3 || new Set(choices).size !== 3 || !activity.correctChoice || !choices.includes(activity.correctChoice)) return null;
  if (new Set(Object.keys(config.choiceLabels)).size !== choices.length || choices.some((choice) => !config.choiceLabels[choice])) return null;
  return config;
}
