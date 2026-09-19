import type { LearningActivity } from "./system";

export type HealthyHabitDomainVariant = "body_health" | "environment_care";

type ExactIdentity = {
  expectedSubjectId: "science";
  expectedStageId: "science-earth-body-environment";
  expectedPrompt: string;
  expectedChoices: readonly [string, string, string];
  expectedCorrectChoice: string;
  domainVariant: HealthyHabitDomainVariant;
};

export type HealthyHabitRoutineConfig = ExactIdentity & {
  routineIcon: string;
  routineLabel: string;
  cueIcon: string;
  cueLabel: string;
  contextLabel: string;
  choiceVisuals: Record<string, { icon: string; label: string }>;
  successText: string;
};

const CONFIGS: Record<string, HealthyHabitRoutineConfig> = {
  "science-body-wash-hands": {
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Kapan sebaiknya tangan dicuci dengan sabun?",
    expectedChoices: ["sebelum makan", "setelah memakai sepatu saja", "hanya saat hari Minggu"],
    expectedCorrectChoice: "sebelum makan",
    domainVariant: "body_health",
    routineIcon: "🫧",
    routineLabel: "Tangan bersih",
    cueIcon: "🍽️",
    cueLabel: "Sebelum makan",
    contextLabel: "Pilih kebiasaan yang membantu menjaga tangan tetap bersih sebelum makan.",
    choiceVisuals: {
      "sebelum makan": { icon: "🍽️", label: "Sebelum makan" },
      "setelah memakai sepatu saja": { icon: "👟", label: "Setelah memakai sepatu saja" },
      "hanya saat hari Minggu": { icon: "📅", label: "Hanya saat hari Minggu" }
    },
    successText: "Mencuci tangan dengan sabun sebelum makan membantu menjaga kebersihan."
  },
  "science-body-teeth-brush": {
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Kebiasaan mana yang membantu menjaga kebersihan gigi?",
    expectedChoices: ["menyikat gigi", "tidak pernah membersihkan gigi", "menggosok gigi dengan pasir"],
    expectedCorrectChoice: "menyikat gigi",
    domainVariant: "body_health",
    routineIcon: "🦷",
    routineLabel: "Gigi bersih",
    cueIcon: "🪥",
    cueLabel: "Rawat gigi",
    contextLabel: "Pilih kebiasaan yang membantu menjaga kebersihan gigi.",
    choiceVisuals: {
      "menyikat gigi": { icon: "🪥", label: "Menyikat gigi" },
      "tidak pernah membersihkan gigi": { icon: "🚫", label: "Tidak pernah membersihkan gigi" },
      "menggosok gigi dengan pasir": { icon: "🏖️", label: "Menggosok gigi dengan pasir" }
    },
    successText: "Menyikat gigi adalah kebiasaan dasar untuk membantu menjaga gigi tetap bersih."
  },
  "science-body-water-drink": {
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Apa yang membantu tubuh tetap mendapat cairan?",
    expectedChoices: ["minum air", "memegang batu", "melihat televisi"],
    expectedCorrectChoice: "minum air",
    domainVariant: "body_health",
    routineIcon: "💧",
    routineLabel: "Cukup cairan",
    cueIcon: "🥤",
    cueLabel: "Tubuh perlu minum",
    contextLabel: "Pilih kebiasaan yang membantu tubuh mendapat cairan.",
    choiceVisuals: {
      "minum air": { icon: "🥤", label: "Minum air" },
      "memegang batu": { icon: "🪨", label: "Memegang batu" },
      "melihat televisi": { icon: "📺", label: "Melihat televisi" }
    },
    successText: "Minum air membantu tubuh mendapatkan cairan yang dibutuhkan."
  },
  "science-body-sleep-rest": {
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Kegiatan mana yang memberi tubuh waktu beristirahat?",
    expectedChoices: ["tidur cukup", "berlari tanpa berhenti", "tidak tidur semalaman"],
    expectedCorrectChoice: "tidur cukup",
    domainVariant: "body_health",
    routineIcon: "🌙",
    routineLabel: "Istirahat cukup",
    cueIcon: "🛏️",
    cueLabel: "Waktu beristirahat",
    contextLabel: "Pilih kebiasaan yang memberi tubuh waktu untuk beristirahat.",
    choiceVisuals: {
      "tidur cukup": { icon: "😴", label: "Tidur cukup" },
      "berlari tanpa berhenti": { icon: "🏃", label: "Berlari tanpa berhenti" },
      "tidak tidur semalaman": { icon: "🌃", label: "Tidak tidur semalaman" }
    },
    successText: "Tidur cukup memberi tubuh waktu untuk beristirahat."
  },
  "science-env-trash-bin": {
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Apa tindakan yang tepat untuk bungkus makanan setelah digunakan?",
    expectedChoices: ["buang ke tempat sampah yang sesuai", "lempar ke sungai", "tinggalkan di jalan"],
    expectedCorrectChoice: "buang ke tempat sampah yang sesuai",
    domainVariant: "environment_care",
    routineIcon: "🌱",
    routineLabel: "Lingkungan bersih",
    cueIcon: "🍬",
    cueLabel: "Bungkus makanan",
    contextLabel: "Pilih tindakan yang membantu menjaga lingkungan tetap bersih.",
    choiceVisuals: {
      "buang ke tempat sampah yang sesuai": { icon: "🗑️", label: "Buang ke tempat sampah yang sesuai" },
      "lempar ke sungai": { icon: "🌊", label: "Lempar ke sungai" },
      "tinggalkan di jalan": { icon: "🛣️", label: "Tinggalkan di jalan" }
    },
    successText: "Membuang bungkus ke tempat sampah yang sesuai membantu menjaga lingkungan tetap bersih."
  },
  "science-env-save-water": {
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Apa yang sebaiknya dilakukan saat keran tidak sedang dipakai?",
    expectedChoices: ["matikan keran", "biarkan terus mengalir", "buka semua keran"],
    expectedCorrectChoice: "matikan keran",
    domainVariant: "environment_care",
    routineIcon: "💧",
    routineLabel: "Hemat air",
    cueIcon: "🚰",
    cueLabel: "Keran tidak dipakai",
    contextLabel: "Pilih tindakan yang membantu mengurangi pemborosan air.",
    choiceVisuals: {
      "matikan keran": { icon: "🚰", label: "Matikan keran" },
      "biarkan terus mengalir": { icon: "💦", label: "Biarkan terus mengalir" },
      "buka semua keran": { icon: "🚿", label: "Buka semua keran" }
    },
    successText: "Mematikan keran saat tidak dipakai membantu menghemat air."
  },
  "science-env-reuse-bottle": {
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Mana contoh menggunakan kembali barang?",
    expectedChoices: ["memakai botol isi ulang", "membuang gelas baru setelah satu teguk", "membakar semua kertas"],
    expectedCorrectChoice: "memakai botol isi ulang",
    domainVariant: "environment_care",
    routineIcon: "♻️",
    routineLabel: "Kurangi sampah",
    cueIcon: "🧴",
    cueLabel: "Gunakan kembali",
    contextLabel: "Pilih tindakan yang menggunakan barang kembali agar sampah berkurang.",
    choiceVisuals: {
      "memakai botol isi ulang": { icon: "🧴", label: "Memakai botol isi ulang" },
      "membuang gelas baru setelah satu teguk": { icon: "🥤", label: "Membuang gelas baru setelah satu teguk" },
      "membakar semua kertas": { icon: "📄", label: "Membakar semua kertas" }
    },
    successText: "Memakai botol isi ulang adalah contoh menggunakan kembali barang agar sampah berkurang."
  },
  "science-env-plant-care": {
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Tindakan mana yang membantu tanaman di halaman tetap terawat?",
    expectedChoices: ["menyiram sesuai kebutuhan", "menginjak tanaman", "mencabut semua daun setiap hari"],
    expectedCorrectChoice: "menyiram sesuai kebutuhan",
    domainVariant: "environment_care",
    routineIcon: "🌿",
    routineLabel: "Tanaman terawat",
    cueIcon: "🏡",
    cueLabel: "Tanaman di halaman",
    contextLabel: "Pilih tindakan yang membantu tanaman di halaman tetap terawat.",
    choiceVisuals: {
      "menyiram sesuai kebutuhan": { icon: "💧", label: "Menyiram sesuai kebutuhan" },
      "menginjak tanaman": { icon: "👣", label: "Menginjak tanaman" },
      "mencabut semua daun setiap hari": { icon: "🍃", label: "Mencabut semua daun setiap hari" }
    },
    successText: "Menyiram sesuai kebutuhan membantu tanaman tetap terawat."
  }
};

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function healthyHabitRoutineConfig(activity: LearningActivity | undefined): HealthyHabitRoutineConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  if (
    activity.subjectId !== config.expectedSubjectId ||
    activity.stageId !== config.expectedStageId ||
    activity.runtime !== "tap_choice" ||
    activity.prompt !== config.expectedPrompt ||
    activity.correctChoice !== config.expectedCorrectChoice ||
    !arraysEqual(activity.choices ?? [], config.expectedChoices)
  ) return null;

  if (!config.expectedChoices.includes(config.expectedCorrectChoice)) return null;
  if (!arraysEqual(Object.keys(config.choiceVisuals), config.expectedChoices)) return null;
  return config;
}
