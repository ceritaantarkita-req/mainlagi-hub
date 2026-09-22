import type { MechanicAssessmentMode, ReusableMechanicId, ReusableMechanicPayload } from "../mechanicLibrary";

export const MONEY_WORLD_ID = "money-festival";

export interface MoneyWorldStageDefinition {
  id: string;
  order: number;
  chapterId: string;
  title: string;
  subtitle: string;
  emoji: string;
  locationLabel: string;
  playable: boolean;
}

export interface MoneyWorldActivityPlacement {
  id: string;
  mechanicId: ReusableMechanicId;
  assessment: MechanicAssessmentMode;
  payload: ReusableMechanicPayload;
}

export type MoneyWorldStageOneSegment =
  | {
      id: string;
      type: "narrative";
      speaker: "Gian" | "Naya";
      text: string;
    }
  | {
      id: string;
      type: "activity";
      activity: MoneyWorldActivityPlacement;
    }
  | {
      id: string;
      type: "concept";
      speaker: "Naya" | "Gian";
      text: string;
    }
  | {
      id: string;
      type: "payoff";
      speaker: "Gian" | "Naya";
      text: string;
    };

export const MONEY_WORLD_CHAPTERS = [
  {
    id: "money-chapter-01-road-to-festival",
    title: "Jalan ke Festival",
    stageIds: [
      "money-stage-01-money-use",
      "money-stage-02-price-change",
      "money-stage-03-income-sources",
      "money-stage-04-needs-wants"
    ]
  },
  {
    id: "money-chapter-02-prepare-festival",
    title: "Siapkan Festival!",
    stageIds: [
      "money-stage-05-saving",
      "money-stage-06-investment-intro",
      "money-stage-07-risk",
      "money-stage-08-final-festival"
    ]
  }
] as const;

export const MONEY_WORLD_STAGES: MoneyWorldStageDefinition[] = [
  {
    id: "money-stage-01-money-use",
    order: 1,
    chapterId: MONEY_WORLD_CHAPTERS[0].id,
    title: "Uang Buat Apa?",
    subtitle: "Kenalan dengan barang, harga, dan uang.",
    emoji: "🪙",
    locationLabel: "Halaman rumah",
    playable: true
  },
  {
    id: "money-stage-02-price-change",
    order: 2,
    chapterId: MONEY_WORLD_CHAPTERS[0].id,
    title: "Kok Jadi Lebih Mahal?",
    subtitle: "Lihat bagaimana harga bisa berubah.",
    emoji: "🤖",
    locationLabel: "Toko mainan",
    playable: false
  },
  {
    id: "money-stage-03-income-sources",
    order: 3,
    chapterId: MONEY_WORLD_CHAPTERS[0].id,
    title: "Uang Datang dari Mana?",
    subtitle: "Kenalan dengan bekerja dan usaha.",
    emoji: "🧃",
    locationLabel: "Jalan kios",
    playable: false
  },
  {
    id: "money-stage-04-needs-wants",
    order: 4,
    chapterId: MONEY_WORLD_CHAPTERS[0].id,
    title: "Butuh atau Mau?",
    subtitle: "Pilih yang paling dibutuhkan dulu.",
    emoji: "🛒",
    locationLabel: "Mini market",
    playable: false
  },
  {
    id: "money-stage-05-saving",
    order: 5,
    chapterId: MONEY_WORLD_CHAPTERS[1].id,
    title: "Simpan Dulu Yuk",
    subtitle: "Simpan sedikit demi sedikit untuk tujuan nanti.",
    emoji: "🐷",
    locationLabel: "Taman tabungan",
    playable: false
  },
  {
    id: "money-stage-06-investment-intro",
    order: 6,
    chapterId: MONEY_WORLD_CHAPTERS[1].id,
    title: "Uang Bisa Bertambah?",
    subtitle: "Kenalan dengan ide mengembangkan nilai.",
    emoji: "🌱",
    locationLabel: "Kebun nilai",
    playable: false
  },
  {
    id: "money-stage-07-risk",
    order: 7,
    chapterId: MONEY_WORLD_CHAPTERS[1].id,
    title: "Kalau Naik dan Turun?",
    subtitle: "Hasil tidak selalu sama.",
    emoji: "↕️",
    locationLabel: "Jembatan festival",
    playable: false
  },
  {
    id: "money-stage-08-final-festival",
    order: 8,
    chapterId: MONEY_WORLD_CHAPTERS[1].id,
    title: "Siapkan Festival!",
    subtitle: "Pakai semua yang sudah dipelajari.",
    emoji: "🎪",
    locationLabel: "Festival Mainlagi",
    playable: false
  }
];

export const MONEY_WORLD_STAGE_ONE_SEGMENTS: MoneyWorldStageOneSegment[] = [
  {
    id: "money-s01-narrative-01",
    type: "narrative",
    speaker: "Gian",
    text: "Kak Naya, kita butuh barang buat festival!"
  },
  {
    id: "money-s01-narrative-02",
    type: "narrative",
    speaker: "Naya",
    text: "Iya. Kita beli beberapa barang, yuk."
  },
  {
    id: "money-s01-narrative-03",
    type: "narrative",
    speaker: "Gian",
    text: "Kalau mau beli, kita pakai apa?"
  },
  {
    id: "money-s01-concept-money",
    type: "concept",
    speaker: "Naya",
    text: "Kita pakai uang. Barang juga punya harga."
  },
  {
    id: "money-s01-activity-01",
    type: "activity",
    activity: {
      id: "money-s01-activity-01",
      mechanicId: "drag_to_target",
      assessment: "practice",
      payload: {
        prompt: "Cocokkan uang dengan harga barang.",
        items: [
          { id: "money-3", label: "Rp3" },
          { id: "money-4", label: "Rp4" },
          { id: "money-5", label: "Rp5" }
        ],
        targets: [
          { id: "item-balloon", label: "🎈 Balon · Rp3" },
          { id: "item-fruit", label: "🍎 Buah · Rp4" },
          { id: "item-juice", label: "🧃 Jus · Rp5" }
        ],
        assignments: {
          "money-3": "item-balloon",
          "money-4": "item-fruit",
          "money-5": "item-juice"
        }
      }
    }
  },
  {
    id: "money-s01-concept-price",
    type: "concept",
    speaker: "Naya",
    text: "Angka di label menunjukkan harga."
  },
  {
    id: "money-s01-narrative-04",
    type: "narrative",
    speaker: "Gian",
    text: "Oh, jadi kita lihat harganya dulu."
  },
  {
    id: "money-s01-activity-02",
    type: "activity",
    activity: {
      id: "money-s01-activity-02",
      mechanicId: "matching",
      assessment: "practice",
      payload: {
        prompt: "Pasangkan barang dengan harganya.",
        pairs: [
          {
            id: "pair-balloon-3",
            left: { id: "balloon", label: "🎈 Balon" },
            right: { id: "price-3", label: "Rp3" }
          },
          {
            id: "pair-fruit-4",
            left: { id: "fruit", label: "🍎 Buah" },
            right: { id: "price-4", label: "Rp4" }
          },
          {
            id: "pair-juice-5",
            left: { id: "juice", label: "🧃 Jus" },
            right: { id: "price-5", label: "Rp5" }
          }
        ]
      }
    }
  },
  {
    id: "money-s01-payoff-01",
    type: "payoff",
    speaker: "Gian",
    text: "Sip! Sekarang aku tahu harus lihat harga."
  },
  {
    id: "money-s01-payoff-02",
    type: "payoff",
    speaker: "Naya",
    text: "Ayo lanjut perjalanan kita."
  }
];

export function getMoneyWorldStage(stageId: string): MoneyWorldStageDefinition | undefined {
  return MONEY_WORLD_STAGES.find((stage) => stage.id === stageId);
}

export function nextMoneyWorldStage(stageId: string): MoneyWorldStageDefinition | undefined {
  const stage = getMoneyWorldStage(stageId);
  return stage ? MONEY_WORLD_STAGES.find((item) => item.order === stage.order + 1) : undefined;
}
