export type LearningSubjectKey = "bahasa" | "english" | "math" | "iqro" | "color";
export type SkillDomain = "literacy" | "language" | "numeracy" | "religious_literacy" | "creative" | "motor";

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
  { id: "color.creative.choice", subjectId: "color", title: "Eksplorasi pilihan warna", description: "Mengeksplorasi pilihan dan kombinasi warna tanpa penilaian benar atau salah.", domain: "creative", ageMin: 3, ageMax: 7 }
];

export const ACTIVITY_LEARNING_SPECS: Record<string, ActivityLearningSpec> = {
  "bahasa-cari-a": { activityId: "bahasa-cari-a", subjectId: "bahasa", stageId: "bahasa-huruf", difficulty: 1, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "bahasa.huruf.a.recognition", weight: 1 }] },
  "bahasa-dengar-a": { activityId: "bahasa-dengar-a", subjectId: "bahasa", stageId: "bahasa-huruf", difficulty: 1, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "bahasa.huruf.a.recognition", weight: 1 }] },
  "bahasa-pasang-awal": { activityId: "bahasa-pasang-awal", subjectId: "bahasa", stageId: "bahasa-huruf", difficulty: 2, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "bahasa.huruf.awal.matching", weight: 1 }] },
  "bahasa-cerita-teman": { activityId: "bahasa-cerita-teman", subjectId: "bahasa", stageId: "bahasa-cerita", difficulty: 1, assessment: "practice", requiredForStage: true, skills: [{ skillId: "bahasa.cerita.listening", weight: 0.35 }] },
  "english-find-blue": { activityId: "english-find-blue", subjectId: "english", stageId: "english-first-words", difficulty: 1, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "english.color.blue", weight: 1 }] },
  "english-listen-cat": { activityId: "english-listen-cat", subjectId: "english", stageId: "english-first-words", difficulty: 1, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "english.word.cat.listening", weight: 1 }] },
  "english-match-hello": { activityId: "english-match-hello", subjectId: "english", stageId: "english-first-words", difficulty: 2, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "english.word.picture_matching", weight: 1 }] },
  "math-count-3": { activityId: "math-count-3", subjectId: "math", stageId: "math-angka", difficulty: 1, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "math.count.1_3", weight: 1 }] },
  "math-trace-5-touch": { activityId: "math-trace-5-touch", subjectId: "math", stageId: "math-angka", difficulty: 1, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "math.numeral.5.formation", weight: 1 }] },
  "math-number-trace-motion": { activityId: "math-number-trace-motion", subjectId: "math", stageId: "math-angka", difficulty: 2, assessment: "practice", requiredForStage: false, skills: [{ skillId: "math.numeral.5.formation", weight: 0.5 }] },
  "math-pattern-touch": { activityId: "math-pattern-touch", subjectId: "math", stageId: "math-pola", difficulty: 2, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "math.pattern.matching", weight: 1 }] },
  "math-pattern-motion": { activityId: "math-pattern-motion", subjectId: "math", stageId: "math-pola", difficulty: 3, assessment: "practice", requiredForStage: false, skills: [{ skillId: "math.pattern.matching", weight: 0.5 }] },
  "iqro-cari-alif": { activityId: "iqro-cari-alif", subjectId: "iqro", stageId: "iqro-huruf", difficulty: 1, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "iqro.alif.recognition", weight: 1 }] },
  "iqro-dengar-alif": { activityId: "iqro-dengar-alif", subjectId: "iqro", stageId: "iqro-huruf", difficulty: 1, assessment: "assessed", requiredForStage: true, skills: [{ skillId: "iqro.alif.recognition", weight: 1 }] },
  "iqro-motion-existing": { activityId: "iqro-motion-existing", subjectId: "iqro", stageId: "iqro-huruf", difficulty: 2, assessment: "practice", requiredForStage: false, skills: [{ skillId: "iqro.hijaiyah.motion_practice", weight: 0.4 }] },
  "color-gavi": { activityId: "color-gavi", subjectId: "color", stageId: "color-characters", difficulty: 1, assessment: "practice", requiredForStage: true, skills: [{ skillId: "color.creative.choice", weight: 0.3 }] },
  "color-paca": { activityId: "color-paca", subjectId: "color", stageId: "color-characters", difficulty: 1, assessment: "practice", requiredForStage: true, skills: [{ skillId: "color.creative.choice", weight: 0.3 }] }
};

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
