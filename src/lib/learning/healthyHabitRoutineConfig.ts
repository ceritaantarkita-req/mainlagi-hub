import type { LearningActivity } from "./system";

export type HealthyHabitRoutineConfig = {
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
  }
};

export function healthyHabitRoutineConfig(activity: LearningActivity | undefined): HealthyHabitRoutineConfig | null {
  if (!activity) return null;
  return CONFIGS[activity.id] ?? null;
}
