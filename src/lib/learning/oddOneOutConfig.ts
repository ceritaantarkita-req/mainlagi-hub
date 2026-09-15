import type { LearningActivity } from "./system";

export interface OddOneOutChoiceVisual {
  label: string;
  icon: string;
}

export interface OddOneOutConfig {
  commonTrait: string;
  promptHint: string;
  successText: string;
  choiceVisuals: Record<string, OddOneOutChoiceVisual>;
}

const CONFIGS: Record<string, OddOneOutConfig> = {
  "logic-odd-category-animal-vehicle": {
    commonTrait: "Dua pilihan sama-sama hewan",
    promptHint: "Bandingkan jenis setiap gambar. Cari satu yang bukan hewan.",
    successText: "Mobil berbeda karena dua pilihan lainnya adalah hewan.",
    choiceVisuals: {
      "🐶": { icon: "🐶", label: "Anjing" },
      "🐱": { icon: "🐱", label: "Kucing" },
      "🚗": { icon: "🚗", label: "Mobil" }
    }
  },
  "logic-odd-shape-angular": {
    commonTrait: "Dua pilihan sama-sama bulat",
    promptHint: "Lihat bentuk luarnya. Cari satu yang tidak bulat.",
    successText: "Segitiga berbeda karena dua pilihan lainnya berbentuk bulat.",
    choiceVisuals: {
      "●": { icon: "●", label: "Bulat penuh" },
      "○": { icon: "○", label: "Bulat garis" },
      "▲": { icon: "▲", label: "Segitiga" }
    }
  },
  "logic-odd-direction-right": {
    commonTrait: "Dua panah sama-sama mengarah ke atas",
    promptHint: "Bandingkan arah panah. Cari satu yang menuju arah berbeda.",
    successText: "Panah kanan berbeda karena dua panah lainnya mengarah ke atas.",
    choiceVisuals: {
      "↑": { icon: "↑", label: "Panah atas" },
      "⬆️": { icon: "⬆️", label: "Panah atas tebal" },
      "→": { icon: "→", label: "Panah kanan" }
    }
  },
  "logic-odd-count-three": {
    commonTrait: "Dua kelompok sama-sama berisi dua simbol",
    promptHint: "Hitung isi setiap kelompok. Cari kelompok dengan jumlah berbeda.",
    successText: "Tiga segitiga berbeda karena dua kelompok lainnya masing-masing berisi dua simbol.",
    choiceVisuals: {
      "●●": { icon: "●●", label: "Dua titik" },
      "★★": { icon: "★★", label: "Dua bintang" },
      "▲▲▲": { icon: "▲▲▲", label: "Tiga segitiga" }
    }
  },
  "logic-odd-pattern-symmetry": {
    commonTrait: "Dua susunan mengikuti pola A-B-A",
    promptHint: "Bandingkan susunan kiri, tengah, dan kanan. Cari satu yang tidak kembali ke bentuk awal.",
    successText: "Susunan terakhir berbeda karena dua pilihan lainnya mengikuti pola A-B-A.",
    choiceVisuals: {
      "○●○": { icon: "○●○", label: "Bulat, titik, bulat" },
      "▲■▲": { icon: "▲■▲", label: "Segitiga, kotak, segitiga" },
      "○○●": { icon: "○○●", label: "Bulat, bulat, titik" }
    }
  }
};

export function oddOneOutConfig(activity: LearningActivity | undefined): OddOneOutConfig | null {
  if (!activity || activity.runtime !== "tap_choice") return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  if (choices.length !== 3 || new Set(choices).size !== 3 || !activity.correctChoice || !choices.includes(activity.correctChoice)) return null;
  if (new Set(Object.keys(config.choiceVisuals)).size !== choices.length) return null;
  if (!choices.every((choice) => Boolean(config.choiceVisuals[choice]))) return null;
  return config;
}
