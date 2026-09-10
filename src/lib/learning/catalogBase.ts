import { CONTENT_PACKS } from "./contentManifest";
import type { LearningSubjectId } from "./system";

export type LearningSubjectKey = LearningSubjectId;
export type SkillDomain = "literacy" | "language" | "numeracy" | "religious_literacy" | "creative" | "motor" | "reasoning" | "science";

export interface LearningSkillDefinition {
  id: string;
  subjectId: LearningSubjectKey;
  title: string;
  description: string;
  domain: SkillDomain;
  ageMin: number;
  ageMax: number;
}

export interface ActivitySkillLink {
  skillId: string;
  weight: number;
}

export interface ActivityLearningSpec {
  activityId: string;
  subjectId: LearningSubjectKey;
  stageId: string;
  difficulty: 1 | 2 | 3;
  assessment: "assessed" | "practice";
  requiredForStage: boolean;
  skills: ActivitySkillLink[];
}

export const LEARNING_SKILLS: LearningSkillDefinition[] = [
  { id: "bahasa.huruf.a.recognition", subjectId: "bahasa", title: "Mengenali huruf A", description: "Mengenali bentuk dan bunyi huruf A dari pilihan sederhana.", domain: "literacy", ageMin: 3, ageMax: 7 },
  { id: "bahasa.huruf.awal.matching", subjectId: "bahasa", title: "Memasangkan huruf awal", description: "Memasangkan huruf dengan contoh kata yang memiliki huruf awal sesuai.", domain: "literacy", ageMin: 4, ageMax: 7 },
  { id: "bahasa.cerita.listening", subjectId: "bahasa", title: "Menyimak cerita", description: "Berlatih menyimak cerita pendek bersama pendamping.", domain: "language", ageMin: 4, ageMax: 7 },
  { id: "english.color.blue", subjectId: "english", title: "English color word: blue", description: "Mengenali kata warna blue melalui visual dan audio.", domain: "language", ageMin: 4, ageMax: 7 },
  { id: "english.word.cat.listening", subjectId: "english", title: "Listening word: cat", description: "Menghubungkan kata cat yang didengar dengan visual yang sesuai.", domain: "language", ageMin: 3, ageMax: 7 },
  { id: "english.word.picture_matching", subjectId: "english", title: "Word-picture matching", description: "Memasangkan kata English sederhana dengan gambar yang sesuai.", domain: "language", ageMin: 5, ageMax: 7 },
  { id: "math.count.1_3", subjectId: "math", title: "Menghitung 1–3", description: "Menghitung kumpulan benda sampai tiga dan memilih jumlahnya.", domain: "numeracy", ageMin: 3, ageMax: 7 },
  { id: "math.numeral.5.formation", subjectId: "math", title: "Membentuk angka 5", description: "Menelusuri bentuk angka 5 mengikuti jalur yang diberikan.", domain: "motor", ageMin: 3, ageMax: 7 },
  { id: "math.pattern.matching", subjectId: "math", title: "Mencocokkan pola", description: "Mengenali dan memasangkan bentuk atau pola yang sama.", domain: "numeracy", ageMin: 5, ageMax: 7 },
  { id: "iqro.alif.recognition", subjectId: "iqro", title: "Mengenali Alif", description: "Mengenali bentuk dan petunjuk audio huruf Alif.", domain: "religious_literacy", ageMin: 3, ageMax: 7 },
  { id: "iqro.hijaiyah.motion_practice", subjectId: "iqro", title: "Latihan Hijaiyah dengan gerak", description: "Latihan opsional pengenalan Hijaiyah melalui permainan gerak.", domain: "religious_literacy", ageMin: 4, ageMax: 7 },
  { id: "letters.latin.a.recognition", subjectId: "letters", title: "Mengenali bentuk huruf A", description: "Mengenali huruf A dan membedakannya dari bentuk huruf lain.", domain: "literacy", ageMin: 3, ageMax: 7 },
  { id: "letters.latin.a.formation", subjectId: "letters", title: "Membentuk huruf A", description: "Mengikuti jalur bentuk huruf A dengan gerakan jari yang terarah.", domain: "motor", ageMin: 3, ageMax: 7 },
  { id: "logic.visual.matching", subjectId: "logic", title: "Mencocokkan objek visual", description: "Mengenali dan memasangkan objek yang sama secara visual.", domain: "reasoning", ageMin: 3, ageMax: 7 },
  { id: "logic.visual.discrimination", subjectId: "logic", title: "Membedakan dan membandingkan", description: "Menemukan objek berbeda dan membandingkan kelompok kecil melalui petunjuk visual.", domain: "reasoning", ageMin: 3, ageMax: 7 },
  { id: "science.living.classification", subjectId: "science", title: "Mengenali makhluk hidup dan tumbuhan", description: "Membedakan contoh sederhana makhluk hidup atau tumbuhan dari benda lain.", domain: "science", ageMin: 3, ageMax: 7 },
  { id: "science.animals.habitat", subjectId: "science", title: "Hewan dan tempat hidup", description: "Menghubungkan hewan dengan tempat hidup yang sesuai pada contoh sederhana.", domain: "science", ageMin: 4, ageMax: 7 },
  { id: "color.creative.choice", subjectId: "color", title: "Eksplorasi pilihan warna", description: "Mengeksplorasi pilihan dan kombinasi warna tanpa penilaian benar atau salah.", domain: "creative", ageMin: 3, ageMax: 7 }
];

/**
 * Compatibility projection used by mastery/progression/RPC sync code.
 * Batch 4 removes the second hand-maintained list of activity metadata: the
 * canonical subject/stage/difficulty/assessment/skill ownership now lives in
 * contentManifest.ts and this map is derived from those content packs.
 */
export const ACTIVITY_LEARNING_SPECS: Record<string, ActivityLearningSpec> = Object.fromEntries(
  CONTENT_PACKS.flatMap((pack) => pack.activities.map((activity) => [
    activity.activityId,
    {
      activityId: activity.activityId,
      subjectId: pack.subjectId,
      stageId: pack.stageId,
      difficulty: activity.difficulty,
      assessment: activity.assessment,
      requiredForStage: activity.requiredForStage,
      skills: activity.skills.map((link) => ({ ...link }))
    }
  ] as const))
);

const SKILL_MAP = new Map(LEARNING_SKILLS.map((skill) => [skill.id, skill]));

export function getLearningSkill(skillId: string): LearningSkillDefinition | undefined {
  return SKILL_MAP.get(skillId);
}

export function getActivityLearningSpec(activityId: string): ActivityLearningSpec | undefined {
  return ACTIVITY_LEARNING_SPECS[activityId];
}

export function getSkillsForSubject(subjectId: LearningSubjectKey): LearningSkillDefinition[] {
  return LEARNING_SKILLS.filter((skill) => skill.subjectId === subjectId);
}
