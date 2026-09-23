import {
  MONEY_WORLD_CHAPTERS,
  MONEY_WORLD_ID,
  MONEY_WORLD_SEGMENTS,
  MONEY_WORLD_STAGES
} from "./moneyWorld";
import {
  WORLD_STRUCTURE_CONTRACT_VERSION,
  flattenWorldStageSegmentIds,
  getWorldSceneForSegment,
  validateCanonicalWorldStructure,
  type CanonicalWorldSceneDefinition,
  type CanonicalWorldStructure,
  type WorldSceneKind
} from "./worldStructure";

export const MONEY_WORLD_STRUCTURE_VERSION = "money-world-structure-v1";

type MoneySceneSpec = {
  id: string;
  kind: WorldSceneKind;
  title: string;
  segmentIds: readonly string[];
};

const MONEY_WORLD_SCENE_SPECS: Readonly<Record<string, readonly MoneySceneSpec[]>> = {
  "money-stage-01-money-use": [
    {
      id: "money-scene-s01-opening",
      kind: "story",
      title: "Barang, harga, dan uang",
      segmentIds: ["money-s01-narrative-01", "money-s01-narrative-02", "money-s01-narrative-03", "money-s01-concept-money"]
    },
    {
      id: "money-scene-s01-money-price-match",
      kind: "challenge",
      title: "Cocokkan uang dan harga",
      segmentIds: ["money-s01-activity-01"]
    },
    {
      id: "money-scene-s01-price-label",
      kind: "story",
      title: "Lihat label harga",
      segmentIds: ["money-s01-concept-price", "money-s01-narrative-04"]
    },
    {
      id: "money-scene-s01-item-price-match",
      kind: "challenge",
      title: "Pasangkan barang dan harga",
      segmentIds: ["money-s01-activity-02"]
    },
    {
      id: "money-scene-s01-closing",
      kind: "closing",
      title: "Siap lanjut",
      segmentIds: ["money-s01-payoff-01", "money-s01-payoff-02"]
    }
  ],
  "money-stage-02-price-change": [
    {
      id: "money-scene-s02-opening",
      kind: "story",
      title: "Harga berubah",
      segmentIds: ["money-s02-narrative-01", "money-s02-narrative-02", "money-s02-narrative-03", "money-s02-narrative-04"]
    },
    {
      id: "money-scene-s02-compare-price",
      kind: "challenge",
      title: "Bandingkan harga",
      segmentIds: ["money-s02-activity-01"]
    },
    {
      id: "money-scene-s02-change-concept",
      kind: "story",
      title: "Kenapa harga bisa berbeda",
      segmentIds: ["money-s02-concept-01", "money-s02-narrative-05", "money-s02-narrative-06", "money-s02-concept-02", "money-s02-narrative-07", "money-s02-concept-03"]
    },
    {
      id: "money-scene-s02-sort-change",
      kind: "challenge",
      title: "Naik atau tetap",
      segmentIds: ["money-s02-activity-02"]
    },
    {
      id: "money-scene-s02-closing",
      kind: "closing",
      title: "Lihat harga sebelum beli",
      segmentIds: ["money-s02-payoff-01", "money-s02-payoff-02"]
    }
  ],
  "money-stage-03-income-sources": [
    {
      id: "money-scene-s03-opening",
      kind: "story",
      title: "Bekerja dan usaha",
      segmentIds: ["money-s03-narrative-01", "money-s03-narrative-02", "money-s03-narrative-03", "money-s03-concept-01", "money-s03-narrative-04", "money-s03-concept-02"]
    },
    {
      id: "money-scene-s03-work-result",
      kind: "challenge",
      title: "Kegiatan dan hasil",
      segmentIds: ["money-s03-activity-01"]
    },
    {
      id: "money-scene-s03-income-concept",
      kind: "story",
      title: "Cara mendapatkan uang",
      segmentIds: ["money-s03-concept-03"]
    },
    {
      id: "money-scene-s03-real-or-fantasy",
      kind: "challenge",
      title: "Bisa dilakukan atau khayalan",
      segmentIds: ["money-s03-activity-02"]
    },
    {
      id: "money-scene-s03-closing",
      kind: "closing",
      title: "Uang tidak muncul sendiri",
      segmentIds: ["money-s03-payoff-01", "money-s03-payoff-02"]
    }
  ],
  "money-stage-04-needs-wants": [
    {
      id: "money-scene-s04-opening",
      kind: "story",
      title: "Tidak bisa beli semua",
      segmentIds: ["money-s04-narrative-01", "money-s04-narrative-02", "money-s04-narrative-03", "money-s04-narrative-04", "money-s04-concept-01"]
    },
    {
      id: "money-scene-s04-classify-priority",
      kind: "challenge",
      title: "Butuh dulu atau mau juga",
      segmentIds: ["money-s04-activity-01"]
    },
    {
      id: "money-scene-s04-needs-wants-concept",
      kind: "story",
      title: "Butuh dan mau",
      segmentIds: ["money-s04-concept-02", "money-s04-concept-03"]
    },
    {
      id: "money-scene-s04-choose-first",
      kind: "challenge",
      title: "Pilih yang dibutuhkan",
      segmentIds: ["money-s04-activity-02"]
    },
    {
      id: "money-scene-s04-closing",
      kind: "closing",
      title: "Pilih dulu",
      segmentIds: ["money-s04-payoff-01", "money-s04-payoff-02"]
    }
  ],
  "money-stage-05-saving": [
    {
      id: "money-scene-s05-opening",
      kind: "story",
      title: "Simpan untuk nanti",
      segmentIds: ["money-s05-narrative-01", "money-s05-concept-01", "money-s05-narrative-02", "money-s05-concept-02"]
    },
    {
      id: "money-scene-s05-save-token",
      kind: "challenge",
      title: "Simpan token",
      segmentIds: ["money-s05-activity-01"]
    },
    {
      id: "money-scene-s05-saving-concept",
      kind: "story",
      title: "Sedikit demi sedikit",
      segmentIds: ["money-s05-concept-03", "money-s05-narrative-03"]
    },
    {
      id: "money-scene-s05-saving-order",
      kind: "challenge",
      title: "Urutkan cara menabung",
      segmentIds: ["money-s05-activity-02"]
    },
    {
      id: "money-scene-s05-closing",
      kind: "closing",
      title: "Aku simpan dulu",
      segmentIds: ["money-s05-payoff-01"]
    }
  ],
  "money-stage-06-investment-intro": [
    {
      id: "money-scene-s06-opening",
      kind: "story",
      title: "Nilai bisa berubah",
      segmentIds: ["money-s06-narrative-01", "money-s06-narrative-02", "money-s06-concept-01", "money-s06-narrative-03", "money-s06-concept-02"]
    },
    {
      id: "money-scene-s06-growth-order",
      kind: "challenge",
      title: "Urutkan pertumbuhan",
      segmentIds: ["money-s06-activity-01"]
    },
    {
      id: "money-scene-s06-growth-concept",
      kind: "story",
      title: "Bisa naik, bisa tidak",
      segmentIds: ["money-s06-concept-03", "money-s06-concept-04", "money-s06-concept-05"]
    },
    {
      id: "money-scene-s06-growth-choice",
      kind: "challenge",
      title: "Pilih pernyataan yang aman",
      segmentIds: ["money-s06-activity-02"]
    },
    {
      id: "money-scene-s06-closing",
      kind: "closing",
      title: "Tidak ada hasil yang dijamin",
      segmentIds: ["money-s06-payoff-01"]
    }
  ],
  "money-stage-07-risk": [
    {
      id: "money-scene-s07-opening",
      kind: "story",
      title: "Hasil bisa berbeda",
      segmentIds: ["money-s07-narrative-01", "money-s07-narrative-02", "money-s07-narrative-03", "money-s07-concept-01"]
    },
    {
      id: "money-scene-s07-up-down",
      kind: "challenge",
      title: "Naik, turun, atau tetap",
      segmentIds: ["money-s07-activity-01"]
    },
    {
      id: "money-scene-s07-risk-concept",
      kind: "story",
      title: "Kenalan dengan risiko",
      segmentIds: ["money-s07-concept-02", "money-s07-narrative-04", "money-s07-concept-03"]
    },
    {
      id: "money-scene-s07-risk-choice",
      kind: "challenge",
      title: "Pikirkan risikonya",
      segmentIds: ["money-s07-activity-02"]
    },
    {
      id: "money-scene-s07-closing",
      kind: "closing",
      title: "Jangan asal pilih",
      segmentIds: ["money-s07-payoff-01", "money-s07-payoff-02"]
    }
  ],
  "money-stage-08-final-festival": [
    {
      id: "money-scene-s08-opening",
      kind: "story",
      title: "Festival sebentar lagi mulai",
      segmentIds: ["money-s08-narrative-01", "money-s08-concept-01"]
    },
    {
      id: "money-scene-s08-priority-table",
      kind: "challenge",
      title: "Siapkan kebutuhan utama",
      segmentIds: ["money-s08-activity-01"]
    },
    {
      id: "money-scene-s08-budget-left",
      kind: "story",
      title: "Masih ada delapan token",
      segmentIds: ["money-s08-concept-02"]
    },
    {
      id: "money-scene-s08-child-choice",
      kind: "choice",
      title: "Pilihanmu",
      segmentIds: ["money-s08-narrative-choice-01"]
    },
    {
      id: "money-scene-s08-subtraction-setup",
      kind: "story",
      title: "Coba hitung sisanya",
      segmentIds: ["money-s08-concept-03"]
    },
    {
      id: "money-scene-s08-subtraction",
      kind: "challenge",
      title: "Hitung sisa token",
      segmentIds: ["money-s08-activity-02"]
    },
    {
      id: "money-scene-s08-festival-payoff",
      kind: "closing",
      title: "Kebutuhan sudah siap",
      segmentIds: ["money-s08-payoff-01", "money-s08-payoff-02", "money-s08-payoff-03"]
    },
    {
      id: "money-scene-s08-recap",
      kind: "recap",
      title: "Yang kita temukan",
      segmentIds: ["money-s08-recap-01"]
    },
    {
      id: "money-scene-s08-final",
      kind: "closing",
      title: "Festival siap",
      segmentIds: ["money-s08-payoff-04"]
    }
  ]
} as const;

const MONEY_WORLD_SCENES: CanonicalWorldSceneDefinition[] = MONEY_WORLD_STAGES.flatMap((stage) =>
  (MONEY_WORLD_SCENE_SPECS[stage.id] ?? []).map((scene, index) => ({
    ...scene,
    stageId: stage.id,
    order: index + 1
  }))
);

export const MONEY_WORLD_CANONICAL_STRUCTURE: CanonicalWorldStructure = {
  contractVersion: WORLD_STRUCTURE_CONTRACT_VERSION,
  world: {
    id: MONEY_WORLD_ID,
    version: MONEY_WORLD_STRUCTURE_VERSION,
    title: "Petualangan Uang",
    chapterIds: MONEY_WORLD_CHAPTERS.map((chapter) => chapter.id)
  },
  chapters: MONEY_WORLD_CHAPTERS.map((chapter, index) => ({
    id: chapter.id,
    worldId: MONEY_WORLD_ID,
    order: index + 1,
    title: chapter.title,
    stageIds: [...chapter.stageIds]
  })),
  stages: MONEY_WORLD_STAGES.map((stage) => ({
    id: stage.id,
    chapterId: stage.chapterId,
    order: stage.order,
    sceneIds: MONEY_WORLD_SCENES
      .filter((scene) => scene.stageId === stage.id)
      .sort((a, b) => a.order - b.order)
      .map((scene) => scene.id)
  })),
  scenes: MONEY_WORLD_SCENES
};

export const MONEY_WORLD_SEGMENT_IDS_BY_STAGE: Readonly<Record<string, readonly string[]>> =
  Object.fromEntries(
    Object.entries(MONEY_WORLD_SEGMENTS).map(([stageId, segments]) => [
      stageId,
      segments.map((segment) => segment.id)
    ])
  );

export const MONEY_WORLD_STRUCTURE_VALIDATION = validateCanonicalWorldStructure(
  MONEY_WORLD_CANONICAL_STRUCTURE,
  { segmentIdsByStage: MONEY_WORLD_SEGMENT_IDS_BY_STAGE }
);

export function getMoneyWorldScenes(stageId: string): readonly CanonicalWorldSceneDefinition[] {
  const stage = MONEY_WORLD_CANONICAL_STRUCTURE.stages.find((item) => item.id === stageId);
  if (!stage) return [];
  const sceneById = new Map(MONEY_WORLD_CANONICAL_STRUCTURE.scenes.map((scene) => [scene.id, scene] as const));
  return stage.sceneIds.flatMap((sceneId) => {
    const scene = sceneById.get(sceneId);
    return scene ? [scene] : [];
  });
}

export function getMoneyWorldSceneForSegment(
  stageId: string,
  segmentId: string
): CanonicalWorldSceneDefinition | undefined {
  return getWorldSceneForSegment(MONEY_WORLD_CANONICAL_STRUCTURE, stageId, segmentId);
}

export function getMoneyWorldCanonicalSegmentIds(stageId: string): string[] {
  return flattenWorldStageSegmentIds(MONEY_WORLD_CANONICAL_STRUCTURE, stageId);
}
