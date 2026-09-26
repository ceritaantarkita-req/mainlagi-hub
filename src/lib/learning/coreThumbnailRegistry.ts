import type { GameSlug } from "@/lib/data/games";
import type { LearningSubjectId } from "@/lib/learning/system";

export const CORE_THUMBNAIL_ROOT = "/artwork/core-thumbnails" as const;

export const CORE_SURFACE_THUMBNAILS = {
  childHomeHero: `${CORE_THUMBNAIL_ROOT}/home-hero-mainlagi.webp`,
  mainGerakHeader: `${CORE_THUMBNAIL_ROOT}/main-gerak-header.webp`,
  worldHeader: `${CORE_THUMBNAIL_ROOT}/world-header-mainlagi.webp`
} as const;

export type CoreSubjectThumbnailId =
  | "bahasa"
  | "english"
  | "letters"
  | "iqro"
  | "math"
  | "logic"
  | "science"
  | "color"
  | "drawing";

export const CORE_SUBJECT_THUMBNAILS: Readonly<Record<CoreSubjectThumbnailId, string>> = {
  bahasa: `${CORE_THUMBNAIL_ROOT}/subject-bahasa-indonesia.webp`,
  english: `${CORE_THUMBNAIL_ROOT}/subject-bahasa-inggris.webp`,
  letters: `${CORE_THUMBNAIL_ROOT}/subject-huruf-menulis.webp`,
  iqro: `${CORE_THUMBNAIL_ROOT}/subject-iqro.webp`,
  math: `${CORE_THUMBNAIL_ROOT}/subject-matematika.webp`,
  logic: `${CORE_THUMBNAIL_ROOT}/subject-logika.webp`,
  science: `${CORE_THUMBNAIL_ROOT}/subject-sains.webp`,
  color: `${CORE_THUMBNAIL_ROOT}/subject-mewarnai.webp`,
  drawing: `${CORE_THUMBNAIL_ROOT}/subject-menggambar.webp`
};

export function coreSubjectThumbnail(subjectId: LearningSubjectId): string | null {
  return Object.prototype.hasOwnProperty.call(CORE_SUBJECT_THUMBNAILS, subjectId)
    ? CORE_SUBJECT_THUMBNAILS[subjectId as CoreSubjectThumbnailId]
    : null;
}

export const CORE_GAME_THUMBNAILS: Readonly<Record<GameSlug, string>> = {
  "math-choice": `${CORE_THUMBNAIL_ROOT}/game-pilih-jawaban.webp`,
  "math-motion-battle": `${CORE_THUMBNAIL_ROOT}/game-math-battle.webp`,
  "number-trace": `${CORE_THUMBNAIL_ROOT}/game-number-trace.webp`,
  "shape-quest": `${CORE_THUMBNAIL_ROOT}/game-shape-quest.webp`,
  "pattern-race": `${CORE_THUMBNAIL_ROOT}/game-pattern-race.webp`,
  "math-warung": `${CORE_THUMBNAIL_ROOT}/game-math-warung.webp`,
  "iqro-motion": `${CORE_THUMBNAIL_ROOT}/game-iqro-motion.webp`,
  "airboard-presenter": `${CORE_THUMBNAIL_ROOT}/game-aiboard.webp`,
  "dodge-motion": `${CORE_THUMBNAIL_ROOT}/game-beat-motion.webp`,
  "run-to-target": `${CORE_THUMBNAIL_ROOT}/game-run-to-target.webp`
};

export type CoreWorldCardId =
  | "money-festival"
  | "petualangan-ruang"
  | "studio-cerita"
  | "balapan-mainlagi"
  | "bengkel-robot"
  | "kode-pintar"
  | "klinik-sehat"
  | "ekspedisi-alam"
  | "restoran-mainlagi";

export interface CoreWorldCardDefinition {
  id: CoreWorldCardId;
  title: string;
  status: "live" | "locked";
  thumbnail: string;
}

export const CORE_WORLD_CARDS: readonly CoreWorldCardDefinition[] = [
  {
    id: "money-festival",
    title: "Petualangan Uang",
    status: "live",
    thumbnail: `${CORE_THUMBNAIL_ROOT}/world-uang-investasi.webp`
  },
  {
    id: "petualangan-ruang",
    title: "Petualangan Ruang",
    status: "locked",
    thumbnail: `${CORE_THUMBNAIL_ROOT}/world-arsitek-interior.webp`
  },
  {
    id: "studio-cerita",
    title: "Studio Cerita",
    status: "locked",
    thumbnail: `${CORE_THUMBNAIL_ROOT}/world-youtuber-content-creator.webp`
  },
  {
    id: "balapan-mainlagi",
    title: "Balapan Mainlagi",
    status: "locked",
    thumbnail: `${CORE_THUMBNAIL_ROOT}/world-pembalap-mobil.webp`
  },
  {
    id: "bengkel-robot",
    title: "Bengkel Robot",
    status: "locked",
    thumbnail: `${CORE_THUMBNAIL_ROOT}/world-robot-engineer.webp`
  },
  {
    id: "kode-pintar",
    title: "Kode Pintar",
    status: "locked",
    thumbnail: `${CORE_THUMBNAIL_ROOT}/world-ai-software-engineer.webp`
  },
  {
    id: "klinik-sehat",
    title: "Klinik Sehat",
    status: "locked",
    thumbnail: `${CORE_THUMBNAIL_ROOT}/world-dokter.webp`
  },
  {
    id: "ekspedisi-alam",
    title: "Ekspedisi Alam",
    status: "locked",
    thumbnail: `${CORE_THUMBNAIL_ROOT}/world-ilmuwan-penjelajah-alam.webp`
  },
  {
    id: "restoran-mainlagi",
    title: "Restoran Mainlagi",
    status: "locked",
    thumbnail: `${CORE_THUMBNAIL_ROOT}/world-chef-pemilik-restoran.webp`
  }
] as const;
