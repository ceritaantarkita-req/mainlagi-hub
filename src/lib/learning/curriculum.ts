import { ACTIVITIES, STAGES, type LearningSubjectId } from "./system";

export interface LearningPathDefinition {
  id: string;
  subjectId: LearningSubjectId;
  title: string;
  description: string;
  ageMin: number;
  ageMax: number;
  stageIds: string[];
}

export interface LearningLessonDefinition {
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

/**
 * Canonical curriculum navigation layer.
 *
 * Runtime IDs remain stable in system.ts, while this file gives those stages
 * and activities their educational hierarchy:
 * Subject -> Learning Path -> Stage -> Lesson -> Activity.
 *
 * These are Mainlagi product curriculum definitions, not a claim of alignment
 * with a government or third-party curriculum standard.
 */
export const LEARNING_PATHS: LearningPathDefinition[] = [
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
    id: "color-creative-play",
    subjectId: "color",
    title: "Creative Color Play",
    description: "Eksplorasi warna tanpa benar-salah dan tanpa dipaksa menjadi nilai akademik.",
    ageMin: 3,
    ageMax: 7,
    stageIds: ["color-characters"]
  }
];

export const LEARNING_LESSONS: LearningLessonDefinition[] = [
  {
    id: "bahasa-huruf-a",
    subjectId: "bahasa",
    pathId: "bahasa-fondasi-literasi",
    stageId: "bahasa-huruf",
    title: "Kenal huruf A",
    objective: "Mengenali bentuk dan petunjuk bunyi huruf A dari beberapa pilihan.",
    ageMin: 3,
    ageMax: 7,
    activityIds: ["bahasa-cari-a", "bahasa-dengar-a"]
  },
  {
    id: "bahasa-huruf-awal",
    subjectId: "bahasa",
    pathId: "bahasa-fondasi-literasi",
    stageId: "bahasa-huruf",
    title: "Huruf awal kata",
    objective: "Memasangkan huruf awal dengan contoh kata sederhana.",
    ageMin: 4,
    ageMax: 7,
    activityIds: ["bahasa-pasang-awal"]
  },
  {
    id: "bahasa-cerita-teman",
    subjectId: "bahasa",
    pathId: "bahasa-fondasi-literasi",
    stageId: "bahasa-cerita",
    title: "Menyimak cerita teman",
    objective: "Mendengarkan atau membaca cerita pendek bersama pendamping.",
    ageMin: 4,
    ageMax: 7,
    activityIds: ["bahasa-cerita-teman"]
  },
  {
    id: "english-color-blue",
    subjectId: "english",
    pathId: "english-first-steps",
    stageId: "english-first-words",
    title: "Color word: blue",
    objective: "Menghubungkan kata BLUE dengan pilihan visual yang sesuai.",
    ageMin: 4,
    ageMax: 7,
    activityIds: ["english-find-blue"]
  },
  {
    id: "english-listen-cat",
    subjectId: "english",
    pathId: "english-first-steps",
    stageId: "english-first-words",
    title: "Listen: cat",
    objective: "Menghubungkan petunjuk audio kata cat dengan gambar yang sesuai.",
    ageMin: 3,
    ageMax: 7,
    activityIds: ["english-listen-cat"]
  },
  {
    id: "english-word-picture",
    subjectId: "english",
    pathId: "english-first-steps",
    stageId: "english-first-words",
    title: "Word & picture",
    objective: "Memasangkan kata English sederhana dengan gambar yang sesuai.",
    ageMin: 5,
    ageMax: 7,
    activityIds: ["english-match-hello"]
  },
  {
    id: "math-count-small",
    subjectId: "math",
    pathId: "math-fondasi-numerasi",
    stageId: "math-angka",
    title: "Hitung jumlah kecil",
    objective: "Menghitung kumpulan benda sederhana dan memilih jumlahnya.",
    ageMin: 3,
    ageMax: 7,
    activityIds: ["math-count-3"]
  },
  {
    id: "math-form-five",
    subjectId: "math",
    pathId: "math-fondasi-numerasi",
    stageId: "math-angka",
    title: "Bentuk angka 5",
    objective: "Berlatih mengikuti bentuk angka 5 dengan sentuhan; mode gerak hanya bonus.",
    ageMin: 3,
    ageMax: 7,
    activityIds: ["math-trace-5-touch", "math-number-trace-motion"]
  },
  {
    id: "math-patterns",
    subjectId: "math",
    pathId: "math-fondasi-numerasi",
    stageId: "math-pola",
    title: "Pola & bentuk",
    objective: "Mengenali pasangan bentuk atau pola yang sama.",
    ageMin: 5,
    ageMax: 7,
    activityIds: ["math-pattern-touch", "math-pattern-motion"]
  },
  {
    id: "iqro-alif",
    subjectId: "iqro",
    pathId: "iqro-fondasi-hijaiyah",
    stageId: "iqro-huruf",
    title: "Kenal Alif",
    objective: "Mengenali bentuk Alif melalui sentuhan dan petunjuk audio.",
    ageMin: 3,
    ageMax: 7,
    activityIds: ["iqro-cari-alif", "iqro-dengar-alif"]
  },
  {
    id: "iqro-motion-practice",
    subjectId: "iqro",
    pathId: "iqro-fondasi-hijaiyah",
    stageId: "iqro-huruf",
    title: "Hijaiyah lewat gerak",
    objective: "Latihan gerak opsional; tidak menjadi evidence akademik utama.",
    ageMin: 4,
    ageMax: 7,
    activityIds: ["iqro-motion-existing"]
  },
  {
    id: "color-gavi",
    subjectId: "color",
    pathId: "color-creative-play",
    stageId: "color-characters",
    title: "Eksplorasi warna Gavi",
    objective: "Memilih dan mencoba warna secara bebas tanpa penilaian benar-salah.",
    ageMin: 3,
    ageMax: 7,
    activityIds: ["color-gavi"]
  },
  {
    id: "color-paca",
    subjectId: "color",
    pathId: "color-creative-play",
    stageId: "color-characters",
    title: "Eksplorasi warna Paca",
    objective: "Mencoba kombinasi warna pada karakter secara bebas.",
    ageMin: 3,
    ageMax: 7,
    activityIds: ["color-paca"]
  }
];

const PATH_MAP = new Map(LEARNING_PATHS.map((item) => [item.id, item]));
const LESSON_MAP = new Map(LEARNING_LESSONS.map((item) => [item.id, item]));
const ACTIVITY_LESSON_MAP = new Map(LEARNING_LESSONS.flatMap((lesson) => lesson.activityIds.map((activityId) => [activityId, lesson] as const)));

export function getLearningPath(pathId: string): LearningPathDefinition | undefined {
  return PATH_MAP.get(pathId);
}

export function getLearningPathsForSubject(subjectId: LearningSubjectId): LearningPathDefinition[] {
  return LEARNING_PATHS.filter((item) => item.subjectId === subjectId);
}

export function getLesson(lessonId: string): LearningLessonDefinition | undefined {
  return LESSON_MAP.get(lessonId);
}

export function getLessonsForStage(stageId: string): LearningLessonDefinition[] {
  return LEARNING_LESSONS.filter((item) => item.stageId === stageId);
}

export function getLessonForActivity(activityId: string): LearningLessonDefinition | undefined {
  return ACTIVITY_LESSON_MAP.get(activityId);
}

export interface CurriculumCoverage {
  stageCount: number;
  lessonCount: number;
  activityCount: number;
  uncoveredStageIds: string[];
  uncoveredActivityIds: string[];
}

export function getCurriculumCoverage(): CurriculumCoverage {
  const coveredStages = new Set(LEARNING_PATHS.flatMap((path) => path.stageIds));
  const coveredActivities = new Set(LEARNING_LESSONS.flatMap((lesson) => lesson.activityIds));
  return {
    stageCount: STAGES.length,
    lessonCount: LEARNING_LESSONS.length,
    activityCount: ACTIVITIES.length,
    uncoveredStageIds: STAGES.filter((stage) => !coveredStages.has(stage.id)).map((stage) => stage.id),
    uncoveredActivityIds: ACTIVITIES.filter((activity) => !coveredActivities.has(activity.id)).map((activity) => activity.id)
  };
}
