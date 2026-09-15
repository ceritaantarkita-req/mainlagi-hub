import type { LearningActivity } from "./system";

export type FeatureFunctionLinkConfig = {
  subjectIcon: string;
  subjectLabel: string;
  featureIcon: string;
  featureLabel: string;
  contextLabel: string;
  choiceVisuals: Record<string, { icon: string; label: string }>;
  successText: string;
};

const CONFIGS: Record<string, FeatureFunctionLinkConfig> = {
  "science-feature-duck-webbed-feet": {
    subjectIcon: "🦆",
    subjectLabel: "Bebek",
    featureIcon: "🦶",
    featureLabel: "Kaki berselaput",
    contextLabel: "Hubungkan ciri tubuh dengan fungsi yang paling membantu bebek.",
    choiceVisuals: {
      "Berenang di air": { icon: "🌊", label: "Berenang di air" },
      "Menggali batu keras": { icon: "🪨", label: "Menggali batu keras" },
      "Memanjat dinding licin": { icon: "🧗", label: "Memanjat dinding licin" }
    },
    successText: "Kaki berselaput membantu bebek mendorong air saat berenang."
  },
  "science-feature-fish-gills": {
    subjectIcon: "🐟",
    subjectLabel: "Ikan",
    featureIcon: "🫧",
    featureLabel: "Insang",
    contextLabel: "Hubungkan bagian tubuh ikan dengan fungsi yang sesuai.",
    choiceVisuals: {
      "Mengambil oksigen dari air": { icon: "💧", label: "Mengambil oksigen dari air" },
      "Menyimpan biji makanan": { icon: "🌰", label: "Menyimpan biji makanan" },
      "Membuat cahaya matahari": { icon: "☀️", label: "Membuat cahaya matahari" }
    },
    successText: "Insang membantu ikan mengambil oksigen dari air."
  },
  "science-feature-bird-beak-seeds": {
    subjectIcon: "🐦",
    subjectLabel: "Burung kecil",
    featureIcon: "👄",
    featureLabel: "Paruh",
    contextLabel: "Hubungkan paruh burung dengan fungsi yang paling masuk akal.",
    choiceVisuals: {
      "Mengambil makanan": { icon: "🌾", label: "Mengambil makanan" },
      "Mengubah malam menjadi siang": { icon: "🌙", label: "Mengubah malam menjadi siang" },
      "Membekukan air": { icon: "🧊", label: "Membekukan air" }
    },
    successText: "Paruh membantu burung mengambil dan memakan makanan."
  },
  "science-feature-cactus-water": {
    subjectIcon: "🌵",
    subjectLabel: "Kaktus",
    featureIcon: "💚",
    featureLabel: "Batang tebal",
    contextLabel: "Hubungkan ciri tumbuhan dengan manfaatnya di lingkungan kering.",
    choiceVisuals: {
      "Air dapat digunakan saat lingkungan kering": { icon: "💧", label: "Air tersedia saat kering" },
      "Batang membuat hujan turun setiap hari": { icon: "🌧️", label: "Membuat hujan setiap hari" },
      "Kaktus tidak lagi membutuhkan cahaya": { icon: "🌤️", label: "Tidak perlu cahaya" }
    },
    successText: "Batang tebal menyimpan air yang dapat digunakan ketika lingkungan kering."
  }
};

export function featureFunctionLinkConfig(activity: LearningActivity | undefined): FeatureFunctionLinkConfig | null {
  if (!activity) return null;
  return CONFIGS[activity.id] ?? null;
}
