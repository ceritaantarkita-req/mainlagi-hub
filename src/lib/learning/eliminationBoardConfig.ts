import type { LearningActivity } from "./system";

export type EliminationBoardMode =
  | "negative_exclusion"
  | "unique_target"
  | "size_elimination"
  | "common_feature"
  | "missing_member";

export type EliminationBoardConfig = {
  mode: EliminationBoardMode;
  clueLabel: string;
  hint: string;
  successText: string;
};

type ExpectedActivity = {
  prompt: string;
  choices: readonly [string, string, string];
  correctChoice: string;
  config: EliminationBoardConfig;
};

const EXPECTED: Record<string, ExpectedActivity> = {
  "logic-infer-not-red": {
    prompt: "Pilih yang bukan merah.",
    choices: ["biru 🔵", "merah bulat 🔴", "merah kotak 🟥"],
    correctChoice: "biru 🔵",
    config: {
      mode: "negative_exclusion",
      clueLabel: "Cari yang bukan merah",
      hint: "Periksa ciri warna tiap pilihan. Yang merah bisa kamu sisihkan.",
      successText: "Biru tidak termasuk pilihan merah, jadi itulah kesimpulannya."
    }
  },
  "logic-infer-only-triangle": {
    prompt: "Hanya satu pilihan berbentuk segitiga. Mana itu?",
    choices: ["▲", "●", "■"],
    correctChoice: "▲",
    config: {
      mode: "unique_target",
      clueLabel: "Cari satu-satunya segitiga",
      hint: "Bandingkan bentuknya dan sisihkan pilihan yang bukan segitiga.",
      successText: "Segitiga adalah satu-satunya bentuk yang memenuhi petunjuk."
    }
  },
  "logic-infer-not-largest": {
    prompt: "Yang terbesar sudah disisihkan. Mana yang paling kecil?",
    choices: ["● kecil", "◉ sedang", "⬤ besar"],
    correctChoice: "● kecil",
    config: {
      mode: "size_elimination",
      clueLabel: "Yang terbesar sudah tersisih",
      hint: "Bandingkan dua ukuran yang tersisa lalu cari yang paling kecil.",
      successText: "Titik kecil adalah pilihan paling kecil setelah yang terbesar disisihkan."
    }
  },
  "logic-infer-common-feature": {
    prompt: "Contoh: 🔴 dan 🔵. Ciri apa yang sama?",
    choices: ["keduanya bulat", "keduanya merah", "keduanya kotak"],
    correctChoice: "keduanya bulat",
    config: {
      mode: "common_feature",
      clueLabel: "Cari ciri yang dimiliki keduanya",
      hint: "Sisihkan ciri yang hanya cocok pada satu contoh atau tidak cocok sama sekali.",
      successText: "Kedua contoh sama-sama berbentuk bulat."
    }
  },
  "logic-infer-missing-member": {
    prompt: "Set arah harus punya ↑ → ↓ ←. Yang terlihat ↑ → ↓. Mana yang belum ada?",
    choices: ["←", "↑", "→"],
    correctChoice: "←",
    config: {
      mode: "missing_member",
      clueLabel: "Cari anggota yang belum ada",
      hint: "Bandingkan set lengkap dengan yang sudah terlihat, lalu sisihkan arah yang sudah ada.",
      successText: "Panah kiri belum ada di set yang terlihat."
    }
  }
};

function exactChoiceOrder(actual: string[] | undefined, expected: readonly string[]): boolean {
  return Boolean(actual && actual.length === expected.length && actual.every((choice, index) => choice === expected[index]));
}

export function eliminationBoardConfig(activity: LearningActivity | undefined): EliminationBoardConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "logic" || activity.stageId !== "logic-conditional-analogy-inference" || activity.runtime !== "tap_choice") return null;
  const expected = EXPECTED[activity.id];
  if (!expected) return null;
  if (activity.prompt !== expected.prompt) return null;
  if (!exactChoiceOrder(activity.choices, expected.choices)) return null;
  if (activity.correctChoice !== expected.correctChoice) return null;
  if (!expected.choices.includes(activity.correctChoice)) return null;
  return expected.config;
}

export function isEliminationBoardActivity(activity: LearningActivity | undefined): boolean {
  return eliminationBoardConfig(activity) !== null;
}
