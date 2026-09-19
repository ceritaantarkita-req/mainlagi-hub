import type { LearningActivity } from "./system";

export type PhenomenonRelationDomainVariant = "earth_sky" | "ecosystem_dependency";

export type PhenomenonRelationMode =
  | "sun_day_relation"
  | "night_sky_observation"
  | "light_shadow_relation"
  | "cloud_rain_prediction"
  | "plant_resource_dependency"
  | "bee_flower_food_relation"
  | "bird_tree_habitat_relation"
  | "food_resource_change_consequence";

export type PhenomenonRelationChoiceVisual = {
  icon: string;
  accessibleLabel: string;
};

export type PhenomenonRelationBoardConfig = {
  domainVariant: PhenomenonRelationDomainVariant;
  mode: PhenomenonRelationMode;
  observationIcon: string;
  observationLabel: string;
  relationLabel: string;
  cue: string;
  successText: string;
  expectedPrompt: string;
  expectedChoices: [string, string, string];
  expectedCorrectChoice: string;
  choiceVisuals: Record<string, PhenomenonRelationChoiceVisual>;
};

const CONFIGS: Record<string, PhenomenonRelationBoardConfig> = {
  "science-earth-sun-day": {
    domainVariant: "earth_sky",
    mode: "sun_day_relation",
    observationIcon: "☀️🌍",
    observationLabel: "Tempat kita menghadap Matahari",
    relationLabel: "Kondisi yang biasanya dialami",
    cue: "Hubungkan posisi terhadap Matahari dengan kondisi harian yang paling masuk akal.",
    successText: "Saat tempat kita menghadap Matahari, kita biasanya mengalami siang hari.",
    expectedPrompt: "Saat bagian tempat kita berada menghadap Matahari, biasanya kita mengalami apa?",
    expectedChoices: ["siang hari", "malam hari", "musim hujan selalu"],
    expectedCorrectChoice: "siang hari",
    choiceVisuals: {
      "siang hari": { icon: "🌞", accessibleLabel: "langit terang pada siang hari" },
      "malam hari": { icon: "🌙", accessibleLabel: "langit malam" },
      "musim hujan selalu": { icon: "🌧️", accessibleLabel: "hujan" }
    }
  },
  "science-earth-moon-night": {
    domainVariant: "earth_sky",
    mode: "night_sky_observation",
    observationIcon: "🌌",
    observationLabel: "Langit pada malam hari",
    relationLabel: "Benda langit yang sering mudah terlihat",
    cue: "Gunakan pengamatan langit malam untuk memilih benda langit yang paling sesuai.",
    successText: "Bulan adalah benda langit yang sering mudah terlihat pada malam hari.",
    expectedPrompt: "Benda langit mana yang sering mudah terlihat pada malam hari?",
    expectedChoices: ["bulan", "pelangi setiap malam", "awan selalu hitam"],
    expectedCorrectChoice: "bulan",
    choiceVisuals: {
      "bulan": { icon: "🌕", accessibleLabel: "bulan" },
      "pelangi setiap malam": { icon: "🌈", accessibleLabel: "pelangi" },
      "awan selalu hitam": { icon: "☁️", accessibleLabel: "awan gelap" }
    }
  },
  "science-earth-shadow-sun": {
    domainVariant: "earth_sky",
    mode: "light_shadow_relation",
    observationIcon: "🔦🧱",
    observationLabel: "Benda menghalangi cahaya",
    relationLabel: "Yang dapat terbentuk",
    cue: "Hubungkan cahaya yang terhalang dengan hasil pengamatan yang dapat muncul.",
    successText: "Saat benda menghalangi cahaya, bayangan dapat terbentuk.",
    expectedPrompt: "Apa yang dapat terbentuk saat benda menghalangi cahaya?",
    expectedChoices: ["bayangan", "suara", "rasa manis"],
    expectedCorrectChoice: "bayangan",
    choiceVisuals: {
      "bayangan": { icon: "◼️", accessibleLabel: "bayangan gelap" },
      "suara": { icon: "🔊", accessibleLabel: "suara" },
      "rasa manis": { icon: "🍬", accessibleLabel: "rasa manis" }
    }
  },
  "science-earth-cloud-rain": {
    domainVariant: "earth_sky",
    mode: "cloud_rain_prediction",
    observationIcon: "☁️☁️",
    observationLabel: "Awan makin gelap dan tebal",
    relationLabel: "Perubahan cuaca yang mungkin terjadi",
    cue: "Gunakan tanda pada awan untuk memilih perubahan cuaca yang masuk akal.",
    successText: "Awan yang makin gelap dan tebal dapat menjadi tanda bahwa hujan mungkin turun.",
    expectedPrompt: "Jika awan makin gelap dan tebal, perubahan cuaca apa yang mungkin terjadi?",
    expectedChoices: ["hujan turun", "bintang muncul siang hari", "tanah langsung membeku"],
    expectedCorrectChoice: "hujan turun",
    choiceVisuals: {
      "hujan turun": { icon: "🌧️", accessibleLabel: "hujan turun" },
      "bintang muncul siang hari": { icon: "⭐☀️", accessibleLabel: "bintang pada siang hari" },
      "tanah langsung membeku": { icon: "🧊", accessibleLabel: "tanah membeku" }
    }
  },
  "science-eco-plant-sun-water": {
    domainVariant: "ecosystem_dependency",
    mode: "plant_resource_dependency",
    observationIcon: "🌱",
    observationLabel: "Tanaman di kebun",
    relationLabel: "Sumber daya yang dibutuhkan",
    cue: "Hubungkan tanaman dengan sumber daya lingkungan yang membantu pertumbuhannya.",
    successText: "Tanaman membutuhkan air dan cahaya untuk membantu proses pertumbuhannya.",
    expectedPrompt: "Tanaman di kebun membutuhkan kombinasi mana untuk tumbuh?",
    expectedChoices: ["air dan cahaya", "plastik dan kaca", "mainan dan kertas"],
    expectedCorrectChoice: "air dan cahaya",
    choiceVisuals: {
      "air dan cahaya": { icon: "💧☀️", accessibleLabel: "air dan cahaya matahari" },
      "plastik dan kaca": { icon: "🧴🪟", accessibleLabel: "plastik dan kaca" },
      "mainan dan kertas": { icon: "🧸📄", accessibleLabel: "mainan dan kertas" }
    }
  },
  "science-eco-bee-flower": {
    domainVariant: "ecosystem_dependency",
    mode: "bee_flower_food_relation",
    observationIcon: "🐝🌸",
    observationLabel: "Lebah mendatangi bunga",
    relationLabel: "Sumber yang dicari",
    cue: "Hubungkan perilaku lebah dengan sumber makanan yang relevan di bunga.",
    successText: "Lebah sering mendatangi bunga untuk mencari nektar.",
    expectedPrompt: "Mengapa lebah sering mendatangi bunga?",
    expectedChoices: ["mencari nektar", "mencari batu", "mencari plastik"],
    expectedCorrectChoice: "mencari nektar",
    choiceVisuals: {
      "mencari nektar": { icon: "🌼", accessibleLabel: "nektar pada bunga" },
      "mencari batu": { icon: "🪨", accessibleLabel: "batu" },
      "mencari plastik": { icon: "🧴", accessibleLabel: "plastik" }
    }
  },
  "science-eco-bird-tree": {
    domainVariant: "ecosystem_dependency",
    mode: "bird_tree_habitat_relation",
    observationIcon: "🐦🌳",
    observationLabel: "Burung berada dekat pohon",
    relationLabel: "Dukungan yang dapat diberikan pohon",
    cue: "Hubungkan pohon dengan kebutuhan tempat hidup yang dapat digunakan burung.",
    successText: "Pohon dapat menyediakan tempat bagi burung untuk bertengger atau bersarang.",
    expectedPrompt: "Pohon dapat membantu burung dengan menyediakan apa?",
    expectedChoices: ["tempat bertengger atau bersarang", "air laut", "roda kendaraan"],
    expectedCorrectChoice: "tempat bertengger atau bersarang",
    choiceVisuals: {
      "tempat bertengger atau bersarang": { icon: "🪺", accessibleLabel: "tempat bertengger atau bersarang" },
      "air laut": { icon: "🌊", accessibleLabel: "air laut" },
      "roda kendaraan": { icon: "🛞", accessibleLabel: "roda kendaraan" }
    }
  },
  "science-eco-food-chain-change": {
    domainVariant: "ecosystem_dependency",
    mode: "food_resource_change_consequence",
    observationIcon: "🍽️⬇️",
    observationLabel: "Makanan utama hewan sangat berkurang",
    relationLabel: "Dampak yang mungkin terjadi",
    cue: "Hubungkan perubahan sumber makanan dengan dampak sederhana bagi hewan.",
    successText: "Jika makanan utama berkurang, hewan dapat menjadi lebih sulit mendapatkan makanan.",
    expectedPrompt: "Jika makanan utama suatu hewan sangat berkurang, apa yang mungkin terjadi?",
    expectedChoices: ["hewan lebih sulit mendapat makanan", "hewan tidak perlu makan lagi", "semua benda menjadi hidup"],
    expectedCorrectChoice: "hewan lebih sulit mendapat makanan",
    choiceVisuals: {
      "hewan lebih sulit mendapat makanan": { icon: "🐾🍽️", accessibleLabel: "hewan mencari makanan yang makin sedikit" },
      "hewan tidak perlu makan lagi": { icon: "🚫🍽️", accessibleLabel: "tidak makan" },
      "semua benda menjadi hidup": { icon: "✨🪨", accessibleLabel: "benda tidak hidup" }
    }
  }
};

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function phenomenonRelationBoardConfig(activity: LearningActivity | undefined): PhenomenonRelationBoardConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "science" || activity.stageId !== "science-earth-body-environment" || activity.runtime !== "tap_choice") return null;

  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  if (activity.prompt !== config.expectedPrompt) return null;
  if (!sameStrings(choices, config.expectedChoices)) return null;
  if (activity.correctChoice !== config.expectedCorrectChoice) return null;
  if (new Set(choices).size !== 3 || !choices.includes(config.expectedCorrectChoice)) return null;

  const visualKeys = Object.keys(config.choiceVisuals);
  if (!sameStrings(visualKeys, choices)) return null;
  if (choices.some((choice) => !config.choiceVisuals[choice]?.icon || !config.choiceVisuals[choice]?.accessibleLabel)) return null;
  if (!config.observationIcon || !config.observationLabel || !config.relationLabel || !config.cue || !config.successText) return null;

  return config;
}

export function isPhenomenonRelationBoardActivity(activity: LearningActivity | undefined): boolean {
  return phenomenonRelationBoardConfig(activity) !== null;
}
