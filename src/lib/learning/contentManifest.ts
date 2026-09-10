import type { LearningRuntime, LearningSubjectId } from "./system";

export type ContentReviewStatus = "internal" | "expert_required" | "expert_approved";
export type ContentAssessment = "assessed" | "practice";
export type ContentMechanicId =
  | "tap_choice"
  | "listen_and_choose"
  | "matching"
  | "guided_trace"
  | "story"
  | "coloring"
  | "motion_game";
export type EvidenceContractId =
  | "choice_accuracy_v1"
  | "matching_accuracy_v1"
  | "guided_trace_path_v1"
  | "completion_only_v1";

export interface ContentSkillLink {
  skillId: string;
  weight: number;
}

export interface ContentMechanicDefinition {
  id: ContentMechanicId;
  runtime: LearningRuntime;
  assessmentModes: readonly ContentAssessment[];
  assessedEvidenceContract?: Exclude<EvidenceContractId, "completion_only_v1">;
  requiredPayloadFields: readonly string[];
}

export interface ContentPathDefinition {
  id: string;
  subjectId: LearningSubjectId;
  title: string;
  description: string;
  ageMin: number;
  ageMax: number;
  stageIds: string[];
}

export interface ContentLessonDefinition {
  id: string;
  subjectId: LearningSubjectId;
  pathId: string;
  stageId: string;
  title: string;
  objective: string;
  ageMin: number;
  ageMax: number;
  activityIds: string[];
}

export interface ContentPackActivityDefinition {
  localId: string;
  activityId: string;
  lessonId: string;
  mechanicId: ContentMechanicId;
  difficulty: 1 | 2 | 3;
  assessment: ContentAssessment;
  requiredForStage: boolean;
  evidenceContractId: EvidenceContractId;
  skills: ContentSkillLink[];
  assetRefs?: string[];
}

export interface ContentPackDefinition {
  id: string;
  version: string;
  subjectId: LearningSubjectId;
  pathId: string;
  stageId: string;
  title: string;
  ageMin: number;
  ageMax: number;
  reviewStatus: ContentReviewStatus;
  activities: ContentPackActivityDefinition[];
}

export const CONTENT_MECHANICS: Record<ContentMechanicId, ContentMechanicDefinition> = {
  tap_choice: {
    id: "tap_choice",
    runtime: "tap_choice",
    assessmentModes: ["assessed", "practice"],
    assessedEvidenceContract: "choice_accuracy_v1",
    requiredPayloadFields: ["prompt", "choices", "correctChoice"]
  },
  listen_and_choose: {
    id: "listen_and_choose",
    runtime: "listen_and_choose",
    assessmentModes: ["assessed", "practice"],
    assessedEvidenceContract: "choice_accuracy_v1",
    requiredPayloadFields: ["prompt", "choices", "correctChoice"]
  },
  matching: {
    id: "matching",
    runtime: "matching",
    assessmentModes: ["assessed", "practice"],
    assessedEvidenceContract: "matching_accuracy_v1",
    requiredPayloadFields: ["matchItems"]
  },
  guided_trace: {
    id: "guided_trace",
    runtime: "trace",
    assessmentModes: ["assessed", "practice"],
    assessedEvidenceContract: "guided_trace_path_v1",
    requiredPayloadFields: ["traceGlyph"]
  },
  story: {
    id: "story",
    runtime: "story",
    assessmentModes: ["practice"],
    requiredPayloadFields: ["storyLines"]
  },
  coloring: {
    id: "coloring",
    runtime: "coloring",
    assessmentModes: ["practice"],
    requiredPayloadFields: ["coloringCharacter"]
  },
  motion_game: {
    id: "motion_game",
    runtime: "motion_game",
    assessmentModes: ["practice"],
    requiredPayloadFields: ["gameSlug"]
  }
};

export function normalizeContentSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function makeContentPackId(subjectId: LearningSubjectId, slug: string): string {
  const normalized = normalizeContentSlug(slug);
  if (!normalized) throw new Error("Content pack slug must contain letters or numbers");
  return `${subjectId}.pack.${normalized}`;
}

/**
 * Deterministic ID helper for new generated content.
 * Existing Mainlagi activities keep their historical IDs and are referenced
 * explicitly from content packs; they are never renamed by this helper.
 */
export function makeGeneratedActivityId(packId: string, localId: string): string {
  const packSlug = normalizeContentSlug(packId.replace(/\.pack\./g, "-"));
  const localSlug = normalizeContentSlug(localId);
  if (!packSlug || !localSlug) throw new Error("Generated activity IDs need non-empty pack and local IDs");
  return `${packSlug}-${localSlug}`;
}

export const CONTENT_PATHS: ContentPathDefinition[] = [
  {
    id: "bahasa-fondasi-literasi",
    subjectId: "bahasa",
    title: "Fondasi Literasi",
    description: "Mengenali huruf, bunyi awal, lalu menikmati cerita pendek bersama.",
    ageMin: 3,
    ageMax: 7,
    stageIds: ["bahasa-huruf", "bahasa-cerita"]
  },
  {
    id: "english-first-steps",
    subjectId: "english",
    title: "First English Steps",
    description: "Mengenali kata awal lewat warna, suara, gambar, dan pasangan sederhana.",
    ageMin: 3,
    ageMax: 7,
    stageIds: ["english-first-words"]
  },
  {
    id: "math-fondasi-numerasi",
    subjectId: "math",
    title: "Fondasi Numerasi",
    description: "Mengenali jumlah, bentuk angka, pola, dan logika awal secara bertahap.",
    ageMin: 3,
    ageMax: 7,
    stageIds: ["math-angka", "math-pola"]
  },
  {
    id: "iqro-fondasi-hijaiyah",
    subjectId: "iqro",
    title: "Fondasi Hijaiyah",
    description: "Mengenali bentuk dan petunjuk bunyi huruf Hijaiyah secara sederhana.",
    ageMin: 3,
    ageMax: 7,
    stageIds: ["iqro-huruf"]
  },
  {
    id: "letters-writing-foundations",
    subjectId: "letters",
    title: "Fondasi Huruf & Menulis",
    description: "Mengenali bentuk huruf lalu berlatih gerakan awal menulis secara touch-first.",
    ageMin: 3,
    ageMax: 7,
    stageIds: ["letters-foundations"]
  },
  {
    id: "logic-thinking-foundations",
    subjectId: "logic",
    title: "Fondasi Berpikir Logis",
    description: "Mencocokkan, membedakan, dan membandingkan objek melalui tantangan visual sederhana.",
    ageMin: 3,
    ageMax: 7,
    stageIds: ["logic-foundations"]
  },
  {
    id: "science-discovery-foundations",
    subjectId: "science",
    title: "Fondasi Sains & Pengamatan",
    description: "Mengamati makhluk hidup, tumbuhan, hewan, dan lingkungan sekitar secara aman.",
    ageMin: 3,
    ageMax: 7,
    stageIds: ["science-foundations"]
  },
  {
    id: "color-creative-play",
    subjectId: "color",
    title: "Creative Color Play",
    description: "Eksplorasi warna tanpa benar-salah dan tanpa dipaksa menjadi nilai akademik.",
    ageMin: 3,
    ageMax: 7,
    stageIds: ["color-characters"]
  }
];

type LessonCore = Omit<ContentLessonDefinition, "activityIds">;

const LESSON_CORES: LessonCore[] = [
  { id: "bahasa-huruf-a", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: "bahasa-huruf", title: "Kenal huruf A", objective: "Mengenali bentuk dan petunjuk bunyi huruf A dari beberapa pilihan.", ageMin: 3, ageMax: 7 },
  { id: "bahasa-huruf-awal", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: "bahasa-huruf", title: "Huruf awal kata", objective: "Memasangkan huruf awal dengan contoh kata sederhana.", ageMin: 4, ageMax: 7 },
  { id: "bahasa-cerita-teman", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: "bahasa-cerita", title: "Menyimak cerita teman", objective: "Mendengarkan atau membaca cerita pendek bersama pendamping.", ageMin: 4, ageMax: 7 },
  { id: "english-color-blue", subjectId: "english", pathId: "english-first-steps", stageId: "english-first-words", title: "Color word: blue", objective: "Menghubungkan kata BLUE dengan pilihan visual yang sesuai.", ageMin: 4, ageMax: 7 },
  { id: "english-listen-cat", subjectId: "english", pathId: "english-first-steps", stageId: "english-first-words", title: "Listen: cat", objective: "Menghubungkan petunjuk audio kata cat dengan gambar yang sesuai.", ageMin: 3, ageMax: 7 },
  { id: "english-word-picture", subjectId: "english", pathId: "english-first-steps", stageId: "english-first-words", title: "Word & picture", objective: "Memasangkan kata English sederhana dengan gambar yang sesuai.", ageMin: 5, ageMax: 7 },
  { id: "math-count-small", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: "math-angka", title: "Hitung jumlah kecil", objective: "Menghitung kumpulan benda sederhana dan memilih jumlahnya.", ageMin: 3, ageMax: 7 },
  { id: "math-form-five", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: "math-angka", title: "Bentuk angka 5", objective: "Berlatih mengikuti bentuk angka 5 dengan sentuhan; mode gerak hanya bonus.", ageMin: 3, ageMax: 7 },
  { id: "math-patterns", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: "math-pola", title: "Pola & bentuk", objective: "Mengenali pasangan bentuk atau pola yang sama.", ageMin: 5, ageMax: 7 },
  { id: "iqro-alif", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: "iqro-huruf", title: "Kenal Alif", objective: "Mengenali bentuk Alif melalui sentuhan dan petunjuk audio.", ageMin: 3, ageMax: 7 },
  { id: "iqro-motion-practice", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: "iqro-huruf", title: "Hijaiyah lewat gerak", objective: "Latihan gerak opsional; tidak menjadi evidence akademik utama.", ageMin: 4, ageMax: 7 },
  { id: "letters-a-foundations", subjectId: "letters", pathId: "letters-writing-foundations", stageId: "letters-foundations", title: "Huruf A & gerak menulis", objective: "Mengenali huruf A, mengikuti bentuknya dengan jari, dan menghubungkan huruf besar dengan huruf kecil.", ageMin: 3, ageMax: 7 },
  { id: "logic-visual-foundations", subjectId: "logic", pathId: "logic-thinking-foundations", stageId: "logic-foundations", title: "Cocok, beda & bandingkan", objective: "Mencocokkan objek yang sama, menemukan objek berbeda, dan membandingkan kelompok kecil.", ageMin: 3, ageMax: 7 },
  { id: "science-living-world", subjectId: "science", pathId: "science-discovery-foundations", stageId: "science-foundations", title: "Makhluk hidup & tempatnya", objective: "Mengenali contoh makhluk hidup, tumbuhan, hewan, dan hubungan sederhana dengan tempat hidupnya.", ageMin: 3, ageMax: 7 },
  { id: "color-gavi", subjectId: "color", pathId: "color-creative-play", stageId: "color-characters", title: "Eksplorasi warna Gavi", objective: "Memilih dan mencoba warna secara bebas tanpa penilaian benar-salah.", ageMin: 3, ageMax: 7 },
  { id: "color-paca", subjectId: "color", pathId: "color-creative-play", stageId: "color-characters", title: "Eksplorasi warna Paca", objective: "Mencoba kombinasi warna pada karakter secara bebas.", ageMin: 3, ageMax: 7 }
];

function assessed(
  localId: string,
  activityId: string,
  lessonId: string,
  mechanicId: ContentMechanicId,
  difficulty: 1 | 2 | 3,
  requiredForStage: boolean,
  skillId: string
): ContentPackActivityDefinition {
  const mechanic = CONTENT_MECHANICS[mechanicId];
  if (!mechanic.assessedEvidenceContract) throw new Error(`${mechanicId} does not support assessed evidence`);
  return {
    localId,
    activityId,
    lessonId,
    mechanicId,
    difficulty,
    assessment: "assessed",
    requiredForStage,
    evidenceContractId: mechanic.assessedEvidenceContract,
    skills: [{ skillId, weight: 1 }]
  };
}

function practice(
  localId: string,
  activityId: string,
  lessonId: string,
  mechanicId: ContentMechanicId,
  difficulty: 1 | 2 | 3,
  requiredForStage: boolean,
  skillId: string,
  weight: number
): ContentPackActivityDefinition {
  return {
    localId,
    activityId,
    lessonId,
    mechanicId,
    difficulty,
    assessment: "practice",
    requiredForStage,
    evidenceContractId: "completion_only_v1",
    skills: [{ skillId, weight }]
  };
}

export const CONTENT_PACKS: ContentPackDefinition[] = [
  {
    id: makeContentPackId("bahasa", "huruf-a"), version: "1.0.0", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: "bahasa-huruf", title: "Huruf A", ageMin: 3, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("find-a", "bahasa-cari-a", "bahasa-huruf-a", "tap_choice", 1, true, "bahasa.huruf.a.recognition"),
      assessed("listen-a", "bahasa-dengar-a", "bahasa-huruf-a", "listen_and_choose", 1, true, "bahasa.huruf.a.recognition"),
      assessed("find-a-variant", "bahasa-cari-a-lagi", "bahasa-huruf-a", "tap_choice", 1, false, "bahasa.huruf.a.recognition")
    ]
  },
  {
    id: makeContentPackId("bahasa", "huruf-awal"), version: "1.0.0", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: "bahasa-huruf", title: "Huruf Awal", ageMin: 4, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("match-initial", "bahasa-pasang-awal", "bahasa-huruf-awal", "matching", 2, true, "bahasa.huruf.awal.matching"),
      assessed("match-initial-variant", "bahasa-pasang-awal-lagi", "bahasa-huruf-awal", "matching", 2, false, "bahasa.huruf.awal.matching")
    ]
  },
  {
    id: makeContentPackId("bahasa", "cerita-teman"), version: "1.0.0", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: "bahasa-cerita", title: "Cerita Teman", ageMin: 4, ageMax: 7, reviewStatus: "internal",
    activities: [practice("story-friends", "bahasa-cerita-teman", "bahasa-cerita-teman", "story", 1, true, "bahasa.cerita.listening", 0.35)]
  },
  {
    id: makeContentPackId("english", "blue"), version: "1.0.0", subjectId: "english", pathId: "english-first-steps", stageId: "english-first-words", title: "Blue", ageMin: 4, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("find-blue", "english-find-blue", "english-color-blue", "tap_choice", 1, true, "english.color.blue"),
      assessed("listen-blue", "english-find-blue-audio", "english-color-blue", "listen_and_choose", 1, false, "english.color.blue")
    ]
  },
  {
    id: makeContentPackId("english", "cat"), version: "1.0.0", subjectId: "english", pathId: "english-first-steps", stageId: "english-first-words", title: "Cat", ageMin: 3, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("listen-cat", "english-listen-cat", "english-listen-cat", "listen_and_choose", 1, true, "english.word.cat.listening"),
      assessed("listen-cat-variant", "english-listen-cat-2", "english-listen-cat", "listen_and_choose", 1, false, "english.word.cat.listening")
    ]
  },
  {
    id: makeContentPackId("english", "word-picture"), version: "1.0.0", subjectId: "english", pathId: "english-first-steps", stageId: "english-first-words", title: "Word & Picture", ageMin: 5, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("match-words", "english-match-hello", "english-word-picture", "matching", 2, true, "english.word.picture_matching"),
      assessed("match-words-variant", "english-match-words-2", "english-word-picture", "matching", 2, false, "english.word.picture_matching")
    ]
  },
  {
    id: makeContentPackId("math", "count-small"), version: "1.0.0", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: "math-angka", title: "Hitung Jumlah Kecil", ageMin: 3, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("count-three", "math-count-3", "math-count-small", "tap_choice", 1, true, "math.count.1_3"),
      assessed("count-two", "math-count-2", "math-count-small", "tap_choice", 1, false, "math.count.1_3")
    ]
  },
  {
    id: makeContentPackId("math", "number-five"), version: "1.0.0", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: "math-angka", title: "Angka 5", ageMin: 3, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("trace-five", "math-trace-5-touch", "math-form-five", "guided_trace", 1, true, "math.numeral.5.formation"),
      practice("trace-five-motion", "math-number-trace-motion", "math-form-five", "motion_game", 2, false, "math.numeral.5.formation", 0.5)
    ]
  },
  {
    id: makeContentPackId("math", "patterns"), version: "1.0.0", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: "math-pola", title: "Pola & Bentuk", ageMin: 5, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("match-pattern", "math-pattern-touch", "math-patterns", "matching", 2, true, "math.pattern.matching"),
      assessed("match-pattern-variant", "math-pattern-touch-2", "math-patterns", "matching", 2, false, "math.pattern.matching"),
      practice("pattern-motion", "math-pattern-motion", "math-patterns", "motion_game", 3, false, "math.pattern.matching", 0.5)
    ]
  },
  {
    id: makeContentPackId("iqro", "alif"), version: "1.0.0", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: "iqro-huruf", title: "Alif", ageMin: 3, ageMax: 7, reviewStatus: "expert_required",
    activities: [
      assessed("find-alif", "iqro-cari-alif", "iqro-alif", "tap_choice", 1, true, "iqro.alif.recognition"),
      assessed("listen-alif", "iqro-dengar-alif", "iqro-alif", "listen_and_choose", 1, true, "iqro.alif.recognition"),
      assessed("match-alif", "iqro-pasang-alif", "iqro-alif", "matching", 2, false, "iqro.alif.recognition")
    ]
  },
  {
    id: makeContentPackId("iqro", "motion-practice"), version: "1.0.0", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: "iqro-huruf", title: "Hijaiyah Motion Practice", ageMin: 4, ageMax: 7, reviewStatus: "expert_required",
    activities: [practice("motion-existing", "iqro-motion-existing", "iqro-motion-practice", "motion_game", 2, false, "iqro.hijaiyah.motion_practice", 0.4)]
  },
  {
    id: makeContentPackId("letters", "letter-a"), version: "1.0.0", subjectId: "letters", pathId: "letters-writing-foundations", stageId: "letters-foundations", title: "Huruf A & Menulis", ageMin: 3, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("find-a", "letters-find-a", "letters-a-foundations", "tap_choice", 1, true, "letters.latin.a.recognition"),
      assessed("trace-a", "letters-trace-a", "letters-a-foundations", "guided_trace", 1, true, "letters.latin.a.formation"),
      assessed("match-case", "letters-match-case", "letters-a-foundations", "matching", 2, false, "letters.latin.a.recognition")
    ]
  },
  {
    id: makeContentPackId("logic", "visual-basics"), version: "1.0.0", subjectId: "logic", pathId: "logic-thinking-foundations", stageId: "logic-foundations", title: "Visual Logic Basics", ageMin: 3, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("match-pairs", "logic-match-pairs", "logic-visual-foundations", "matching", 1, true, "logic.visual.matching"),
      assessed("odd-one-out", "logic-odd-one-out", "logic-visual-foundations", "tap_choice", 1, true, "logic.visual.discrimination"),
      assessed("more-less", "logic-more-less", "logic-visual-foundations", "tap_choice", 2, false, "logic.visual.discrimination")
    ]
  },
  {
    id: makeContentPackId("science", "living-world"), version: "1.0.0", subjectId: "science", pathId: "science-discovery-foundations", stageId: "science-foundations", title: "Living World Basics", ageMin: 3, ageMax: 7, reviewStatus: "internal",
    activities: [
      assessed("living-cat", "science-living-cat", "science-living-world", "tap_choice", 1, true, "science.living.classification"),
      assessed("match-habitat", "science-match-habitat", "science-living-world", "matching", 2, true, "science.animals.habitat"),
      assessed("find-plant", "science-find-plant", "science-living-world", "tap_choice", 1, false, "science.living.classification")
    ]
  },
  {
    id: makeContentPackId("color", "gavi"), version: "1.0.0", subjectId: "color", pathId: "color-creative-play", stageId: "color-characters", title: "Gavi", ageMin: 3, ageMax: 7, reviewStatus: "internal",
    activities: [practice("color-gavi", "color-gavi", "color-gavi", "coloring", 1, true, "color.creative.choice", 0.3)]
  },
  {
    id: makeContentPackId("color", "paca"), version: "1.0.0", subjectId: "color", pathId: "color-creative-play", stageId: "color-characters", title: "Paca", ageMin: 3, ageMax: 7, reviewStatus: "internal",
    activities: [practice("color-paca", "color-paca", "color-paca", "coloring", 1, true, "color.creative.choice", 0.3)]
  }
];

const ACTIVITIES_BY_LESSON = new Map<string, string[]>();
for (const pack of CONTENT_PACKS) {
  for (const activity of pack.activities) {
    const current = ACTIVITIES_BY_LESSON.get(activity.lessonId) ?? [];
    current.push(activity.activityId);
    ACTIVITIES_BY_LESSON.set(activity.lessonId, current);
  }
}

export const CONTENT_LESSONS: ContentLessonDefinition[] = LESSON_CORES.map((lesson) => ({
  ...lesson,
  activityIds: [...(ACTIVITIES_BY_LESSON.get(lesson.id) ?? [])]
}));

const PACK_MAP = new Map(CONTENT_PACKS.map((pack) => [pack.id, pack]));
const ACTIVITY_META_MAP = new Map(
  CONTENT_PACKS.flatMap((pack) => pack.activities.map((activity) => [activity.activityId, { pack, activity }] as const))
);

export function getContentPack(packId: string): ContentPackDefinition | undefined {
  return PACK_MAP.get(packId);
}

export function getContentForActivity(activityId: string): { pack: ContentPackDefinition; activity: ContentPackActivityDefinition } | undefined {
  return ACTIVITY_META_MAP.get(activityId);
}

export function getContentPacksForStage(stageId: string): ContentPackDefinition[] {
  return CONTENT_PACKS.filter((pack) => pack.stageId === stageId);
}

export function getContentPacksForLesson(lessonId: string): ContentPackDefinition[] {
  return CONTENT_PACKS.filter((pack) => pack.activities.some((activity) => activity.lessonId === lessonId));
}
