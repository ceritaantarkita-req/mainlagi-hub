import type { LearningActivity } from "./system";

export type CauseEffectKind = "melting" | "freezing" | "evaporation" | "condensation";

export type CauseEffectConfig = {
  causeKey: string;
  effectKind: CauseEffectKind;
  startIcon: string;
  startLabel: string;
  conditionIcon: string;
  conditionLabel: string;
  cue: string;
  successText: string;
  choiceVisuals: Record<string, string>;
};

const CONFIGS: Record<string, CauseEffectConfig> = {
  "science-water-ice-melts": {
    causeKey: "warm-place",
    effectKind: "melting",
    startIcon: "🧊",
    startLabel: "Es batu",
    conditionIcon: "☀️",
    conditionLabel: "Dibiarkan di tempat lebih hangat",
    cue: "Apa hasil yang paling masuk akal setelah es menerima panas?",
    successText: "Es menerima panas lalu mencair menjadi air.",
    choiceVisuals: {
      "mencair menjadi air": "💧",
      "membeku lebih keras": "🧊",
      "berubah menjadi batu": "🪨"
    }
  },
  "science-water-freezes": {
    causeKey: "freezer-cold",
    effectKind: "freezing",
    startIcon: "💧",
    startLabel: "Air cair",
    conditionIcon: "❄️",
    conditionLabel: "Didinginkan cukup lama di freezer",
    cue: "Apa yang dapat terjadi pada air karena kondisi sangat dingin?",
    successText: "Air yang cukup dingin dapat membeku menjadi es.",
    choiceVisuals: {
      "membeku menjadi es": "🧊",
      "menjadi pasir": "🏖️",
      "berubah menjadi kayu": "🪵"
    }
  },
  "science-water-puddle-evaporates": {
    causeKey: "warm-day",
    effectKind: "evaporation",
    startIcon: "💦",
    startLabel: "Genangan air",
    conditionIcon: "☀️",
    conditionLabel: "Terkena udara dan panas pada hari hangat",
    cue: "Mengapa genangan dapat makin sedikit?",
    successText: "Sebagian air menguap ke udara sehingga genangan berkurang.",
    choiceVisuals: {
      "air menguap ke udara": "☁️",
      "air berubah menjadi tanah": "🟫",
      "air berubah menjadi plastik": "🧴"
    }
  },
  "science-water-cold-glass-droplets": {
    causeKey: "cold-surface",
    effectKind: "condensation",
    startIcon: "🌫️",
    startLabel: "Uap air di udara",
    conditionIcon: "🥶",
    conditionLabel: "Menyentuh permukaan gelas yang sangat dingin",
    cue: "Dari mana tetes air di luar gelas berasal?",
    successText: "Uap air di udara mengembun menjadi tetes pada permukaan dingin.",
    choiceVisuals: {
      "uap air di udara mengembun": "💧",
      "kaca berubah menjadi air": "🥛",
      "es menembus dinding gelas": "🧊"
    }
  }
};

export function causeEffectConfig(activity: LearningActivity | undefined): CauseEffectConfig | null {
  if (!activity) return null;
  return CONFIGS[activity.id] ?? null;
}
