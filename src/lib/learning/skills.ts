import type { SkillDefinition } from "./model";

export const SKILLS: SkillDefinition[] = [
  { id: "bahasa-letter-recognition", subjectId: "bahasa", label: "Mengenali huruf", description: "Mengenali bentuk dan bunyi huruf awal sederhana.", evaluative: true },
  { id: "bahasa-letter-word-match", subjectId: "bahasa", label: "Menghubungkan huruf dan kata", description: "Menghubungkan huruf awal dengan contoh kata sederhana.", evaluative: true },
  { id: "bahasa-story-listening", subjectId: "bahasa", label: "Menyimak cerita", description: "Berlatih mengikuti cerita pendek bersama pendamping.", evaluative: false },
  { id: "english-word-recognition", subjectId: "english", label: "English word recognition", description: "Mengenali kata English dasar melalui visual dan pilihan.", evaluative: true },
  { id: "english-listening", subjectId: "english", label: "English listening", description: "Mendengarkan petunjuk English dan menghubungkannya dengan objek.", evaluative: true },
  { id: "english-word-picture-match", subjectId: "english", label: "Word-picture matching", description: "Memasangkan kata English sederhana dengan visualnya.", evaluative: true },
  { id: "math-counting-small", subjectId: "math", label: "Menghitung jumlah kecil", description: "Menghitung benda dalam jumlah kecil dan memilih hasilnya.", evaluative: true },
  { id: "math-numeral-tracing", subjectId: "math", label: "Menelusuri bentuk angka", description: "Mengikuti bentuk angka secara terarah dengan sentuh atau gerak.", evaluative: true },
  { id: "math-pattern-matching", subjectId: "math", label: "Mengenali pola", description: "Mengenali dan memasangkan pola atau bentuk sederhana.", evaluative: true },
  { id: "iqro-alif-recognition", subjectId: "iqro", label: "Mengenali Alif", description: "Mengenali bentuk dan petunjuk dasar huruf Alif.", evaluative: true },
  { id: "iqro-listening", subjectId: "iqro", label: "Menyimak Hijaiyah", description: "Menghubungkan petunjuk audio dengan huruf Hijaiyah sederhana.", evaluative: true },
  { id: "color-creative-exploration", subjectId: "color", label: "Eksplorasi warna", description: "Bereksperimen dengan warna dalam aktivitas kreatif tanpa penilaian akademik.", evaluative: false }
];

const SKILL_MAP = new Map(SKILLS.map((skill) => [skill.id, skill]));

export const ACTIVITY_SKILLS: Record<string, string[]> = {
  "bahasa-cari-a": ["bahasa-letter-recognition"],
  "bahasa-dengar-a": ["bahasa-letter-recognition"],
  "bahasa-pasang-awal": ["bahasa-letter-word-match"],
  "bahasa-cerita-teman": ["bahasa-story-listening"],
  "english-find-blue": ["english-word-recognition"],
  "english-listen-cat": ["english-listening"],
  "english-match-hello": ["english-word-picture-match"],
  "math-count-3": ["math-counting-small"],
  "math-trace-5-touch": ["math-numeral-tracing"],
  "math-number-trace-motion": ["math-numeral-tracing"],
  "math-pattern-touch": ["math-pattern-matching"],
  "math-pattern-motion": ["math-pattern-matching"],
  "iqro-cari-alif": ["iqro-alif-recognition"],
  "iqro-dengar-alif": ["iqro-listening"],
  "iqro-motion-existing": ["iqro-alif-recognition"],
  "color-gavi": ["color-creative-exploration"],
  "color-paca": ["color-creative-exploration"]
};

export function getSkill(id: string): SkillDefinition | undefined {
  return SKILL_MAP.get(id);
}

export function getSkillsForActivity(activityId: string): SkillDefinition[] {
  return (ACTIVITY_SKILLS[activityId] ?? [])
    .map((id) => getSkill(id))
    .filter((skill): skill is SkillDefinition => Boolean(skill));
}
