import type { LearningActivity } from "./system";

export type LivingFeatureFunctionChoiceVisual = {
  icon: string;
  shortLabel: string;
};

export type LivingFeatureFunctionConfig = {
  organismLabel: string;
  organismIcon: string;
  featureLabel: string;
  featureIcon: string;
  relationCue: string;
  choiceVisuals: Record<string, LivingFeatureFunctionChoiceVisual>;
  successText: string;
};

const CONFIGS: Record<string, LivingFeatureFunctionConfig> = {
  "science-feature-duck-webbed-feet": {
    organismLabel: "Bebek",
    organismIcon: "🦆",
    featureLabel: "Kaki berselaput",
    featureIcon: "🦶",
    relationCue: "Fungsi apa yang paling terbantu oleh ciri ini?",
    choiceVisuals: {
      "Berenang di air": { icon: "🌊", shortLabel: "Berenang" },
      "Menggali batu keras": { icon: "⛏️", shortLabel: "Menggali batu" },
      "Memanjat dinding licin": { icon: "🧗", shortLabel: "Memanjat" }
    },
    successText: "Kaki berselaput membantu bebek mendorong air saat berenang."
  },
  "science-feature-fish-gills": {
    organismLabel: "Ikan",
    organismIcon: "🐟",
    featureLabel: "Insang",
    featureIcon: "🫧",
    relationCue: "Fungsi apa yang dilakukan insang saat ikan berada di air?",
    choiceVisuals: {
      "Mengambil oksigen dari air": { icon: "🫧", shortLabel: "Mengambil oksigen" },
      "Menyimpan biji makanan": { icon: "🌰", shortLabel: "Menyimpan biji" },
      "Membuat cahaya matahari": { icon: "☀️", shortLabel: "Membuat cahaya" }
    },
    successText: "Insang membantu ikan mengambil oksigen dari air."
  },
  "science-feature-bird-beak-seeds": {
    organismLabel: "Burung",
    organismIcon: "🐦",
    featureLabel: "Paruh",
    featureIcon: "🥜",
    relationCue: "Saat burung makan biji, fungsi apa yang dibantu oleh paruhnya?",
    choiceVisuals: {
      "Mengambil makanan": { icon: "🌰", shortLabel: "Mengambil makanan" },
      "Mengubah malam menjadi siang": { icon: "🌙", shortLabel: "Mengubah malam" },
      "Membekukan air": { icon: "🧊", shortLabel: "Membekukan air" }
    },
    successText: "Paruh membantu burung mengambil dan memakan makanan."
  },
  "science-feature-cactus-water": {
    organismLabel: "Kaktus",
    organismIcon: "🌵",
    featureLabel: "Batang tebal menyimpan air",
    featureIcon: "💧",
    relationCue: "Mengapa ciri ini berguna ketika lingkungan jarang hujan?",
    choiceVisuals: {
      "Air dapat digunakan saat lingkungan kering": { icon: "💧", shortLabel: "Air saat kering" },
      "Batang membuat hujan turun setiap hari": { icon: "🌧️", shortLabel: "Membuat hujan" },
      "Kaktus tidak lagi membutuhkan cahaya": { icon: "🌑", shortLabel: "Tanpa cahaya" }
    },
    successText: "Air yang tersimpan dapat digunakan kaktus saat lingkungan kering."
  }
};

export function livingFeatureFunctionConfig(activity: LearningActivity | undefined): LivingFeatureFunctionConfig | null {
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
