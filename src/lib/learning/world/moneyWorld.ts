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
  presentation?: {
    kind: string;
    startCount?: number;
    removeCount?: number;
  };
}

export type MoneyWorldSegment =
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
    }
  | {
      id: string;
      type: "narrative_choice";
      prompt: string;
      options: Array<{
        id: string;
        label: string;
        reaction: string;
      }>;
    }
  | {
      id: string;
      type: "recap";
      title: string;
      items: Array<{
        id: string;
        icon: string;
        label: string;
      }>;
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
    playable: true
  },
  {
    id: "money-stage-03-income-sources",
    order: 3,
    chapterId: MONEY_WORLD_CHAPTERS[0].id,
    title: "Uang Datang dari Mana?",
    subtitle: "Kenalan dengan bekerja dan usaha.",
    emoji: "🧃",
    locationLabel: "Jalan kios",
    playable: true
  },
  {
    id: "money-stage-04-needs-wants",
    order: 4,
    chapterId: MONEY_WORLD_CHAPTERS[0].id,
    title: "Butuh atau Mau?",
    subtitle: "Pilih yang paling dibutuhkan dulu.",
    emoji: "🛒",
    locationLabel: "Mini market",
    playable: true
  },
  {
    id: "money-stage-05-saving",
    order: 5,
    chapterId: MONEY_WORLD_CHAPTERS[1].id,
    title: "Simpan Dulu Yuk",
    subtitle: "Simpan sedikit demi sedikit untuk tujuan nanti.",
    emoji: "🐷",
    locationLabel: "Taman tabungan",
    playable: true
  },
  {
    id: "money-stage-06-investment-intro",
    order: 6,
    chapterId: MONEY_WORLD_CHAPTERS[1].id,
    title: "Uang Bisa Bertambah?",
    subtitle: "Kenalan dengan ide mengembangkan nilai.",
    emoji: "🌱",
    locationLabel: "Kebun nilai",
    playable: true
  },
  {
    id: "money-stage-07-risk",
    order: 7,
    chapterId: MONEY_WORLD_CHAPTERS[1].id,
    title: "Kalau Naik dan Turun?",
    subtitle: "Hasil tidak selalu sama.",
    emoji: "↕️",
    locationLabel: "Jembatan festival",
    playable: true
  },
  {
    id: "money-stage-08-final-festival",
    order: 8,
    chapterId: MONEY_WORLD_CHAPTERS[1].id,
    title: "Siapkan Festival!",
    subtitle: "Pakai semua yang sudah dipelajari.",
    emoji: "🎪",
    locationLabel: "Festival Mainlagi",
    playable: true
  }
];

export const MONEY_WORLD_STAGE_ONE_SEGMENTS: MoneyWorldSegment[] = [
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

export const MONEY_WORLD_STAGE_TWO_SEGMENTS: MoneyWorldSegment[] = [
  {
    id: "money-s02-narrative-01",
    type: "narrative",
    speaker: "Gian",
    text: "Lho!"
  },
  {
    id: "money-s02-narrative-02",
    type: "narrative",
    speaker: "Naya",
    text: "Kenapa?"
  },
  {
    id: "money-s02-narrative-03",
    type: "narrative",
    speaker: "Gian",
    text: "Kemarin robot ini sepuluh. Sekarang dua belas."
  },
  {
    id: "money-s02-narrative-04",
    type: "narrative",
    speaker: "Gian",
    text: "Kok jadi lebih mahal?"
  },
  {
    id: "money-s02-activity-01",
    type: "activity",
    activity: {
      id: "money-s02-activity-01",
      mechanicId: "compare",
      assessment: "practice",
      payload: {
        prompt: "Mana harga yang lebih mahal?",
        options: [
          { id: "old-price", label: "Kemarin · Rp10" },
          { id: "new-price", label: "Sekarang · Rp12" }
        ],
        correctOptionId: "new-price"
      }
    }
  },
  {
    id: "money-s02-concept-01",
    type: "concept",
    speaker: "Naya",
    text: "Harga barang bisa berubah."
  },
  {
    id: "money-s02-narrative-05",
    type: "narrative",
    speaker: "Gian",
    text: "Bisa naik?"
  },
  {
    id: "money-s02-narrative-06",
    type: "narrative",
    speaker: "Naya",
    text: "Bisa."
  },
  {
    id: "money-s02-concept-02",
    type: "concept",
    speaker: "Naya",
    text: "Kalau banyak harga naik dari waktu ke waktu, ada istilah inflasi."
  },
  {
    id: "money-s02-narrative-07",
    type: "narrative",
    speaker: "Gian",
    text: "In-fla-si?"
  },
  {
    id: "money-s02-concept-03",
    type: "concept",
    speaker: "Naya",
    text: "Iya. Kita ingat satu hal dulu: harga bisa berubah."
  },
  {
    id: "money-s02-activity-02",
    type: "activity",
    activity: {
      id: "money-s02-activity-02",
      mechanicId: "sort_classify",
      assessment: "practice",
      payload: {
        prompt: "Kelompokkan harga yang naik dan yang tetap.",
        items: [
          { id: "change-5-7", label: "5 → 7" },
          { id: "change-8-8", label: "8 → 8" },
          { id: "change-3-4", label: "3 → 4" },
          { id: "change-6-6", label: "6 → 6" }
        ],
        groups: [
          { id: "group-up", label: "⬆️ Naik" },
          { id: "group-same", label: "➖ Tetap" }
        ],
        assignments: {
          "change-5-7": "group-up",
          "change-8-8": "group-same",
          "change-3-4": "group-up",
          "change-6-6": "group-same"
        }
      }
    }
  },
  {
    id: "money-s02-payoff-01",
    type: "payoff",
    speaker: "Gian",
    text: "Kalau harga berubah, aku harus lihat dulu sebelum beli."
  },
  {
    id: "money-s02-payoff-02",
    type: "payoff",
    speaker: "Naya",
    text: "Betul."
  }
];

export const MONEY_WORLD_STAGE_THREE_SEGMENTS: MoneyWorldSegment[] = [
  {
    id: "money-s03-narrative-01",
    type: "narrative",
    speaker: "Gian",
    text: "Mereka semua lagi ngapain?"
  },
  {
    id: "money-s03-narrative-02",
    type: "narrative",
    speaker: "Naya",
    text: "Mereka sedang bekerja."
  },
  {
    id: "money-s03-narrative-03",
    type: "narrative",
    speaker: "Gian",
    text: "Terus mereka dapat uang?"
  },
  {
    id: "money-s03-concept-01",
    type: "concept",
    speaker: "Naya",
    text: "Orang bisa mendapatkan uang dari pekerjaan."
  },
  {
    id: "money-s03-narrative-04",
    type: "narrative",
    speaker: "Gian",
    text: "Kalau punya kios sendiri?"
  },
  {
    id: "money-s03-concept-02",
    type: "concept",
    speaker: "Naya",
    text: "Itu bisa disebut usaha."
  },
  {
    id: "money-s03-activity-01",
    type: "activity",
    activity: {
      id: "money-s03-activity-01",
      mechanicId: "matching",
      assessment: "practice",
      payload: {
        prompt: "Pasangkan kegiatan dengan hasilnya.",
        pairs: [
          {
            id: "baker-bread",
            left: { id: "baker", label: "👩‍🍳 Membuat roti" },
            right: { id: "bread", label: "🥖 Roti" }
          },
          {
            id: "gardener-plant",
            left: { id: "gardener", label: "🧑‍🌾 Merawat tanaman" },
            right: { id: "plant", label: "🌱 Tanaman" }
          },
          {
            id: "juice-stall-juice",
            left: { id: "juice-seller", label: "🧃 Menjual jus" },
            right: { id: "juice-cup", label: "🥤 Jus" }
          },
          {
            id: "bike-repair-bike",
            left: { id: "bike-repair", label: "🔧 Memperbaiki sepeda" },
            right: { id: "bike", label: "🚲 Sepeda" }
          }
        ]
      }
    }
  },
  {
    id: "money-s03-concept-03",
    type: "concept",
    speaker: "Naya",
    text: "Ada banyak cara orang mendapatkan uang. Bisa dari bekerja, bisa juga dari usaha."
  },
  {
    id: "money-s03-activity-02",
    type: "activity",
    activity: {
      id: "money-s03-activity-02",
      mechanicId: "sort_classify",
      assessment: "practice",
      payload: {
        prompt: "Mana yang bisa dilakukan orang? Mana yang cuma khayalan?",
        items: [
          { id: "make-bread", label: "🥖 Membuat roti untuk dijual" },
          { id: "repair-bike", label: "🔧 Memperbaiki sepeda pelanggan" },
          { id: "sell-juice", label: "🧃 Menjual jus" },
          { id: "coin-cloud", label: "☁️ Menunggu uang turun dari awan" }
        ],
        groups: [
          { id: "can-do", label: "Bisa dilakukan" },
          { id: "fantasy", label: "Cuma khayalan" }
        ],
        assignments: {
          "make-bread": "can-do",
          "repair-bike": "can-do",
          "sell-juice": "can-do",
          "coin-cloud": "fantasy"
        }
      }
    }
  },
  {
    id: "money-s03-payoff-01",
    type: "payoff",
    speaker: "Gian",
    text: "Jadi uang tidak muncul sendiri."
  },
  {
    id: "money-s03-payoff-02",
    type: "payoff",
    speaker: "Naya",
    text: "Iya. Sekarang kita pilih cara memakainya."
  }
];

export const MONEY_WORLD_STAGE_FOUR_SEGMENTS: MoneyWorldSegment[] = [
  {
    id: "money-s04-narrative-01",
    type: "narrative",
    speaker: "Gian",
    text: "Aku mau balon!"
  },
  {
    id: "money-s04-narrative-02",
    type: "narrative",
    speaker: "Gian",
    text: "Aku juga mau robot!"
  },
  {
    id: "money-s04-narrative-03",
    type: "narrative",
    speaker: "Naya",
    text: "Tapi uang kita tidak cukup untuk semua."
  },
  {
    id: "money-s04-narrative-04",
    type: "narrative",
    speaker: "Gian",
    text: "Terus gimana?"
  },
  {
    id: "money-s04-concept-01",
    type: "concept",
    speaker: "Naya",
    text: "Kita pilih yang paling dibutuhkan dulu."
  },
  {
    id: "money-s04-activity-01",
    type: "activity",
    activity: {
      id: "money-s04-activity-01",
      mechanicId: "sort_classify",
      assessment: "practice",
      payload: {
        prompt: "Untuk meja festival ini, pilih yang dibutuhkan dulu.",
        items: [
          { id: "water", label: "💧 Air minum" },
          { id: "cups", label: "🥤 Gelas" },
          { id: "fruit", label: "🍎 Buah" },
          { id: "robot", label: "🤖 Robot mainan" },
          { id: "extra-balloon", label: "🎈 Balon tambahan" },
          { id: "fun-hat", label: "🥳 Topi lucu tambahan" }
        ],
        groups: [
          { id: "need-first", label: "Butuh dulu" },
          { id: "want-too", label: "Mau juga" }
        ],
        assignments: {
          "water": "need-first",
          "cups": "need-first",
          "fruit": "need-first",
          "robot": "want-too",
          "extra-balloon": "want-too",
          "fun-hat": "want-too"
        }
      }
    }
  },
  {
    id: "money-s04-concept-02",
    type: "concept",
    speaker: "Naya",
    text: "Butuh adalah sesuatu yang penting untuk tujuan kita."
  },
  {
    id: "money-s04-concept-03",
    type: "concept",
    speaker: "Naya",
    text: "Mau adalah sesuatu yang kita suka, tapi bisa ditunda."
  },
  {
    id: "money-s04-activity-02",
    type: "activity",
    activity: {
      id: "money-s04-activity-02",
      mechanicId: "tap_choice",
      assessment: "practice",
      payload: {
        prompt: "Meja festival belum punya air minum. Pilih dulu yang mana?",
        options: [
          { id: "choose-water", label: "💧 Air minum" },
          { id: "choose-robot", label: "🤖 Robot mainan" },
          { id: "choose-balloon", label: "🎈 Balon tambahan" }
        ],
        correctOptionId: "choose-water"
      }
    }
  },
  {
    id: "money-s04-payoff-01",
    type: "payoff",
    speaker: "Gian",
    text: "Jadi boleh mau, tapi pilih dulu?"
  },
  {
    id: "money-s04-payoff-02",
    type: "payoff",
    speaker: "Naya",
    text: "Betul."
  }
];

export const MONEY_WORLD_STAGE_FIVE_SEGMENTS: MoneyWorldSegment[] = [
  {
    id: "money-s05-narrative-01",
    type: "narrative",
    speaker: "Gian",
    text: "Kalau uangnya belum cukup gimana?"
  },
  {
    id: "money-s05-concept-01",
    type: "concept",
    speaker: "Naya",
    text: "Kita bisa menabung."
  },
  {
    id: "money-s05-narrative-02",
    type: "narrative",
    speaker: "Gian",
    text: "Menabung?"
  },
  {
    id: "money-s05-concept-02",
    type: "concept",
    speaker: "Naya",
    text: "Simpan sebagian untuk nanti."
  },
  {
    id: "money-s05-activity-01",
    type: "activity",
    activity: {
      id: "money-s05-activity-01",
      mechanicId: "drag_to_target",
      assessment: "practice",
      payload: {
        prompt: "Simpan tiga token untuk tujuan nanti.",
        items: [
          { id: "token-1", label: "🪙 1" },
          { id: "token-2", label: "🪙 1" },
          { id: "token-3", label: "🪙 1" }
        ],
        targets: [
          { id: "save-box", label: "🐷 Simpan" },
          { id: "spend-now", label: "🛍️ Pakai sekarang" }
        ],
        assignments: {
          "token-1": "save-box",
          "token-2": "save-box",
          "token-3": "save-box"
        }
      }
    }
  },
  {
    id: "money-s05-concept-03",
    type: "concept",
    speaker: "Naya",
    text: "Sedikit demi sedikit bisa terkumpul."
  },
  {
    id: "money-s05-narrative-03",
    type: "narrative",
    speaker: "Gian",
    text: "Jadi aku tidak harus pakai semuanya sekarang."
  },
  {
    id: "money-s05-activity-02",
    type: "activity",
    activity: {
      id: "money-s05-activity-02",
      mechanicId: "ordering_sequence",
      assessment: "practice",
      payload: {
        prompt: "Urutkan cara menabung untuk tujuan.",
        items: [
          { id: "goal", label: "🎯 Punya tujuan" },
          { id: "save", label: "🐷 Simpan sebagian" },
          { id: "collect", label: "⭐ Uang terkumpul" },
          { id: "use-later", label: "🎁 Pakai saat sudah cukup" }
        ],
        correctOrder: ["goal", "save", "collect", "use-later"]
      }
    }
  },
  {
    id: "money-s05-payoff-01",
    type: "payoff",
    speaker: "Gian",
    text: "Aku simpan dulu."
  }
];

export const MONEY_WORLD_STAGE_SIX_SEGMENTS: MoneyWorldSegment[] = [
  {
    id: "money-s06-narrative-01",
    type: "narrative",
    speaker: "Gian",
    text: "Kalau ditabung, uangnya tetap ada."
  },
  {
    id: "money-s06-narrative-02",
    type: "narrative",
    speaker: "Gian",
    text: "Apa uang bisa bertambah?"
  },
  {
    id: "money-s06-concept-01",
    type: "concept",
    speaker: "Naya",
    text: "Ada cara orang dewasa mencoba mengembangkan nilai uang."
  },
  {
    id: "money-s06-narrative-03",
    type: "narrative",
    speaker: "Gian",
    text: "Apa namanya?"
  },
  {
    id: "money-s06-concept-02",
    type: "concept",
    speaker: "Naya",
    text: "Investasi."
  },
  {
    id: "money-s06-activity-01",
    type: "activity",
    activity: {
      id: "money-s06-activity-01",
      mechanicId: "matching",
      assessment: "practice",
      payload: {
        prompt: "Pasangkan pilihan dengan tujuannya.",
        pairs: [
          {
            id: "spend-now",
            left: { id: "buy-juice", label: "🧃 Beli jus sekarang" },
            right: { id: "purpose-use", label: "Pakai sekarang" }
          },
          {
            id: "save-later",
            left: { id: "saving-box", label: "🐷 Masukkan ke tabungan" },
            right: { id: "purpose-save", label: "Simpan untuk nanti" }
          },
          {
            id: "invest-grow",
            left: { id: "investment-icon", label: "↗️↘️ Investasi" },
            right: { id: "purpose-grow", label: "Mencoba mengembangkan nilai" }
          }
        ]
      }
    }
  },
  {
    id: "money-s06-concept-03",
    type: "concept",
    speaker: "Naya",
    text: "Menabung berarti menyimpan uang untuk nanti."
  },
  {
    id: "money-s06-concept-04",
    type: "concept",
    speaker: "Naya",
    text: "Investasi berarti mencoba mengembangkan nilai uang."
  },
  {
    id: "money-s06-concept-05",
    type: "concept",
    speaker: "Naya",
    text: "Tapi hasilnya tidak selalu naik."
  },
  {
    id: "money-s06-activity-02",
    type: "activity",
    activity: {
      id: "money-s06-activity-02",
      mechanicId: "tap_choice",
      assessment: "practice",
      payload: {
        prompt: "Mana yang berarti mencoba mengembangkan nilai uang?",
        options: [
          { id: "spend", label: "🧃 Membeli jus sekarang" },
          { id: "save", label: "🐷 Menyimpan untuk nanti" },
          { id: "invest", label: "↗️↘️ Mencoba investasi" }
        ],
        correctOptionId: "invest"
      }
    }
  },
  {
    id: "money-s06-payoff-01",
    type: "payoff",
    speaker: "Gian",
    text: "Aku tahu bedanya simpan dan coba kembangkan."
  }
];

export const MONEY_WORLD_STAGE_SEVEN_SEGMENTS: MoneyWorldSegment[] = [
  {
    id: "money-s07-narrative-01",
    type: "narrative",
    speaker: "Gian",
    text: "Yang ini naik!"
  },
  {
    id: "money-s07-narrative-02",
    type: "narrative",
    speaker: "Gian",
    text: "Yang ini malah turun."
  },
  {
    id: "money-s07-narrative-03",
    type: "narrative",
    speaker: "Gian",
    text: "Jadi investasi tidak selalu naik?"
  },
  {
    id: "money-s07-concept-01",
    type: "concept",
    speaker: "Naya",
    text: "Tidak selalu."
  },
  {
    id: "money-s07-activity-01",
    type: "activity",
    activity: {
      id: "money-s07-activity-01",
      mechanicId: "sort_classify",
      assessment: "practice",
      payload: {
        prompt: "Mana yang naik? Mana yang turun?",
        items: [
          { id: "value-5-7", label: "5 → 7" },
          { id: "value-8-6", label: "8 → 6" },
          { id: "value-4-5", label: "4 → 5" },
          { id: "value-9-7", label: "9 → 7" }
        ],
        groups: [
          { id: "up", label: "⬆️ Naik" },
          { id: "down", label: "⬇️ Turun" }
        ],
        assignments: {
          "value-5-7": "up",
          "value-8-6": "down",
          "value-4-5": "up",
          "value-9-7": "down"
        }
      }
    }
  },
  {
    id: "money-s07-concept-02",
    type: "concept",
    speaker: "Naya",
    text: "Kalau hasil bisa berbeda dari yang kita harapkan, ada risiko."
  },
  {
    id: "money-s07-narrative-04",
    type: "narrative",
    speaker: "Gian",
    text: "Risiko artinya hasilnya belum pasti?"
  },
  {
    id: "money-s07-concept-03",
    type: "concept",
    speaker: "Naya",
    text: "Iya. Bisa lebih baik, bisa juga lebih kecil."
  },
  {
    id: "money-s07-activity-02",
    type: "activity",
    activity: {
      id: "money-s07-activity-02",
      mechanicId: "tap_choice",
      assessment: "practice",
      payload: {
        prompt: "Kalimat mana yang benar tentang investasi?",
        options: [
          { id: "always-profit", label: "Pasti selalu untung" },
          { id: "up-or-down", label: "Bisa naik atau turun" },
          { id: "never-change", label: "Tidak pernah berubah" }
        ],
        correctOptionId: "up-or-down"
      }
    }
  },
  {
    id: "money-s07-payoff-01",
    type: "payoff",
    speaker: "Naya",
    text: "Karena itu, keputusan uang perlu dipikirkan."
  },
  {
    id: "money-s07-payoff-02",
    type: "payoff",
    speaker: "Gian",
    text: "Oke. Jangan asal pilih."
  }
];

export const MONEY_WORLD_STAGE_EIGHT_SEGMENTS: MoneyWorldSegment[] = [
  {
    id: "money-s08-narrative-01",
    type: "narrative",
    speaker: "Gian",
    text: "Festival sebentar lagi mulai!"
  },
  {
    id: "money-s08-concept-01",
    type: "concept",
    speaker: "Naya",
    text: "Kita punya dua puluh token. Ayo siapkan yang dibutuhkan dulu."
  },
  {
    id: "money-s08-activity-01",
    type: "activity",
    activity: {
      id: "money-s08-activity-01",
      mechanicId: "drag_to_target",
      assessment: "practice",
      payload: {
        prompt: "Taruh yang dibutuhkan di meja festival.",
        items: [
          { id: "water", label: "💧 Air · 5" },
          { id: "fruit", label: "🍎 Buah · 4" },
          { id: "cups", label: "🥤 Gelas · 3" },
          { id: "balloon", label: "🎈 Balon · 3" },
          { id: "ribbon", label: "🎀 Pita · 2" },
          { id: "robot", label: "🤖 Robot · 6" }
        ],
        targets: [
          { id: "festival-table", label: "🎪 Meja festival" },
          { id: "later", label: "⏳ Bisa nanti" }
        ],
        assignments: {
          "water": "festival-table",
          "fruit": "festival-table",
          "cups": "festival-table",
          "balloon": "later",
          "ribbon": "later",
          "robot": "later"
        }
      }
    }
  },
  {
    id: "money-s08-concept-02",
    type: "concept",
    speaker: "Naya",
    text: "Kebutuhan utama memakai dua belas token. Kita masih punya delapan."
  },
  {
    id: "money-s08-narrative-choice-01",
    type: "narrative_choice",
    prompt: "Kebutuhan sudah lengkap. Masih ada delapan token. Kamu mau apa?",
    options: [
      {
        id: "save-some",
        label: "🐷 Simpan sebagian",
        reaction: "Kamu memilih menyimpan sebagian."
      },
      {
        id: "buy-ribbon",
        label: "🎀 Tambah pita · 2",
        reaction: "Kamu memilih membuat meja lebih meriah."
      },
      {
        id: "buy-robot",
        label: "🤖 Beli robot mini · 6",
        reaction: "Kamu memilih mainan tambahan."
      }
    ]
  },
  {
    id: "money-s08-concept-03",
    type: "concept",
    speaker: "Naya",
    text: "Sekarang coba latihan hitung. Kalau delapan token dipakai dua, sisanya berapa?"
  },
  {
    id: "money-s08-activity-02",
    type: "activity",
    activity: {
      id: "money-s08-activity-02",
      mechanicId: "tap_choice",
      assessment: "practice",
      presentation: {
        kind: "take_away",
        startCount: 8,
        removeCount: 2
      },
      payload: {
        prompt: "Ada 8 token. Dipakai 2. Berapa sisanya?",
        options: [
          { id: "answer-4", label: "4" },
          { id: "answer-6", label: "6" },
          { id: "answer-8", label: "8" }
        ],
        correctOptionId: "answer-6"
      }
    }
  },
  {
    id: "money-s08-payoff-01",
    type: "payoff",
    speaker: "Naya",
    text: "Kebutuhan sudah siap."
  },
  {
    id: "money-s08-payoff-02",
    type: "payoff",
    speaker: "Gian",
    text: "Kita juga tidak pakai uang sembarangan."
  },
  {
    id: "money-s08-payoff-03",
    type: "payoff",
    speaker: "Naya",
    text: "Kita lihat harga, pilih kebutuhan, dan pikirkan sisa uang."
  },
  {
    id: "money-s08-recap-01",
    type: "recap",
    title: "Yang kita temukan",
    items: [
      { id: "price", icon: "🏷️", label: "Barang punya harga" },
      { id: "change", icon: "↕️", label: "Harga bisa berubah" },
      { id: "work", icon: "🧃", label: "Kerja dan usaha" },
      { id: "priority", icon: "🛒", label: "Pilih yang dibutuhkan" },
      { id: "saving", icon: "🐷", label: "Simpan untuk nanti" },
      { id: "risk", icon: "↗️↘️", label: "Hasil punya risiko" }
    ]
  },
  {
    id: "money-s08-payoff-04",
    type: "payoff",
    speaker: "Gian",
    text: "Festival siap!"
  }
];

export const MONEY_WORLD_SEGMENTS: Record<string, MoneyWorldSegment[]> = {
  "money-stage-01-money-use": MONEY_WORLD_STAGE_ONE_SEGMENTS,
  "money-stage-02-price-change": MONEY_WORLD_STAGE_TWO_SEGMENTS,
  "money-stage-03-income-sources": MONEY_WORLD_STAGE_THREE_SEGMENTS,
  "money-stage-04-needs-wants": MONEY_WORLD_STAGE_FOUR_SEGMENTS,
  "money-stage-05-saving": MONEY_WORLD_STAGE_FIVE_SEGMENTS,
  "money-stage-06-investment-intro": MONEY_WORLD_STAGE_SIX_SEGMENTS,
  "money-stage-07-risk": MONEY_WORLD_STAGE_SEVEN_SEGMENTS,
  "money-stage-08-final-festival": MONEY_WORLD_STAGE_EIGHT_SEGMENTS
};

export function getMoneyWorldSegments(stageId: string): MoneyWorldSegment[] {
  return MONEY_WORLD_SEGMENTS[stageId] ?? [];
}

export function getMoneyWorldStage(stageId: string): MoneyWorldStageDefinition | undefined {
  return MONEY_WORLD_STAGES.find((stage) => stage.id === stageId);
}

export function nextMoneyWorldStage(stageId: string): MoneyWorldStageDefinition | undefined {
  const stage = getMoneyWorldStage(stageId);
  return stage ? MONEY_WORLD_STAGES.find((item) => item.order === stage.order + 1) : undefined;
}
