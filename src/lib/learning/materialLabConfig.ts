import type { LearningActivity } from "./system";

export type MaterialLabTestKind = "waterproof" | "transparent" | "absorbent" | "rigid";

export type MaterialLabChoiceVisual = {
  icon: string;
  sampleLabel: string;
};

export type MaterialLabConfig = {
  testKind: MaterialLabTestKind;
  objectLabel: string;
  objectIcon: string;
  purposeLabel: string;
  testLabel: string;
  testIcon: string;
  choiceVisuals: Record<string, MaterialLabChoiceVisual>;
  successText: string;
};

const CONFIGS: Record<string, MaterialLabConfig> = {
  "science-material-raincoat-waterproof": {
    testKind: "waterproof",
    objectLabel: "Jas hujan",
    objectIcon: "🧥",
    purposeLabel: "Menjaga tubuh tetap kering saat hujan",
    testLabel: "Tes air",
    testIcon: "💧",
    choiceVisuals: {
      "Tidak mudah ditembus air": { icon: "🛡️", sampleLabel: "Tahan air" },
      "Mudah menyerap air": { icon: "🧽", sampleLabel: "Menyerap" },
      "Mudah hancur saat basah": { icon: "🫧", sampleLabel: "Rapuh saat basah" }
    },
    successText: "Jas hujan membutuhkan bahan yang tidak mudah ditembus air."
  },
  "science-material-window-transparent": {
    testKind: "transparent",
    objectLabel: "Jendela",
    objectIcon: "🪟",
    purposeLabel: "Melihat ke luar sambil membiarkan cahaya lewat",
    testLabel: "Tes cahaya",
    testIcon: "🔦",
    choiceVisuals: {
      "Transparan": { icon: "✨", sampleLabel: "Tembus pandang" },
      "Tidak tembus pandang": { icon: "⬛", sampleLabel: "Buram" },
      "Sangat menyerap air": { icon: "💦", sampleLabel: "Menyerap air" }
    },
    successText: "Jendela membutuhkan bahan transparan agar kita dapat melihat ke luar."
  },
  "science-material-towel-absorbent": {
    testKind: "absorbent",
    objectLabel: "Handuk",
    objectIcon: "🧺",
    purposeLabel: "Mengeringkan air dari tubuh",
    testLabel: "Tes serap",
    testIcon: "💦",
    choiceVisuals: {
      "Menyerap air": { icon: "🧽", sampleLabel: "Menyerap" },
      "Memantulkan semua cahaya": { icon: "🪩", sampleLabel: "Memantulkan" },
      "Selalu mengapung di udara": { icon: "🎈", sampleLabel: "Melayang" }
    },
    successText: "Handuk bekerja baik jika bahannya menyerap air."
  },
  "science-material-toy-block-rigid": {
    testKind: "rigid",
    objectLabel: "Balok susun",
    objectIcon: "🧱",
    purposeLabel: "Tetap berbentuk saat ditumpuk",
    testLabel: "Tes bentuk",
    testIcon: "🏗️",
    choiceVisuals: {
      "Kaku dan kokoh": { icon: "🧱", sampleLabel: "Kokoh" },
      "Sangat lembek": { icon: "🫠", sampleLabel: "Lembek" },
      "Larut terkena sedikit air": { icon: "💧", sampleLabel: "Mudah larut" }
    },
    successText: "Balok susun membutuhkan bahan yang kaku dan kokoh agar tetap berbentuk."
  }
};

export function materialLabConfig(activity: LearningActivity | undefined): MaterialLabConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  if (choices.length !== 3 || new Set(choices).size !== 3) return null;
  const configuredChoices = Object.keys(config.choiceVisuals);
  if (configuredChoices.length !== 3 || configuredChoices.some((choice) => !choices.includes(choice))) return null;
  if (!activity.correctChoice || !configuredChoices.includes(activity.correctChoice)) return null;
  return config;
}
