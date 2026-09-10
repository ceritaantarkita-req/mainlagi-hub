import type { EnglishBatch9ActivitySeed, EnglishBatch9WaveDefinition } from "./englishBatch9Authoring";

const STAGE_ID = "english-alphabet-basics";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Latihan English awal dengan pilihan visual singkat dan jelas.", emoji: options.emoji ?? "🔤", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 1, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan petunjuk English lalu pilih simbol atau kata yang sesuai.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 1, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan huruf, kata, atau simbol English yang saling berhubungan.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const ENGLISH_BATCH9_WAVE_A: EnglishBatch9WaveDefinition = {
  wave: "A",
  stage: { id: STAGE_ID, subjectId: "english", title: "Alphabet, Sounds & Basics", subtitle: "Kenali huruf, dengarkan nama huruf, hubungkan bunyi awal, warna, dan angka English dasar.", emoji: "🔤" },
  lessons: [
    { id: "english-alphabet-visual", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Alphabet recognition", objective: "Mengenali beberapa huruf kapital yang berbeda secara visual.", ageMin: 3, ageMax: 7 },
    { id: "english-alphabet-listening", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Listen to letters", objective: "Menghubungkan nama huruf yang didengar dengan simbol dan pasangan huruf besar-kecil.", ageMin: 3, ageMax: 7 },
    { id: "english-initial-sounds", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Initial sounds", objective: "Menghubungkan huruf awal dengan kata English sederhana yang familiar.", ageMin: 4, ageMax: 7 },
    { id: "english-basic-colors", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Basic colors", objective: "Memperluas pengenalan warna English di luar BLUE yang sudah ada.", ageMin: 4, ageMax: 7 },
    { id: "english-numbers-one-five", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Numbers one to five", objective: "Menghubungkan kata angka English ONE sampai FIVE dengan simbol jumlah atau angka.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "english.pack.alphabet-visual", title: "Alphabet Visual", lessonId: "english-alphabet-visual", ageMin: 3, ageMax: 7 },
    { id: "english.pack.alphabet-listening", title: "Listen to Letters", lessonId: "english-alphabet-listening", ageMin: 3, ageMax: 7 },
    { id: "english.pack.initial-sounds", title: "Initial Sounds", lessonId: "english-initial-sounds", ageMin: 4, ageMax: 7 },
    { id: "english.pack.basic-colors", title: "Basic Colors", lessonId: "english-basic-colors", ageMin: 4, ageMax: 7 },
    { id: "english.pack.numbers-one-five", title: "Numbers One to Five", lessonId: "english-numbers-one-five", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "english.alphabet.recognition", subjectId: "english", title: "Recognize English letters", description: "Mengenali simbol huruf English dan pasangan bentuk besar-kecilnya.", domain: "literacy", ageMin: 3, ageMax: 7 },
    { id: "english.alphabet.listening", subjectId: "english", title: "Listen to letter names", description: "Menghubungkan nama huruf English yang didengar dengan simbol yang benar.", domain: "language", ageMin: 3, ageMax: 7 },
    { id: "english.phonics.initial_sound", subjectId: "english", title: "Notice initial sounds", description: "Menghubungkan huruf awal dengan kata English sederhana.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "english.color.recognition", subjectId: "english", title: "Recognize color words", description: "Mengenali kata warna English dasar dan simbol warnanya.", domain: "language", ageMin: 4, ageMax: 7 },
    { id: "english.number.1_5", subjectId: "english", title: "English numbers one to five", description: "Menghubungkan ONE sampai FIVE dengan angka atau jumlah yang sesuai.", domain: "language", ageMin: 4, ageMax: 7 }
  ],
  activities: [
    choice("english-letter-a", "english.pack.alphabet-visual", "english-alphabet-visual", "Find letter A", "Which letter is A?", ["A", "H", "K"], "A", "english.alphabet.recognition", { ageMin: 3, required: true, emoji: "🅰️" }),
    choice("english-letter-b", "english.pack.alphabet-visual", "english-alphabet-visual", "Find letter B", "Choose the letter B.", ["D", "B", "P"], "B", "english.alphabet.recognition", { ageMin: 3 }),
    choice("english-letter-m", "english.pack.alphabet-visual", "english-alphabet-visual", "Find letter M", "Where is the letter M?", ["N", "W", "M"], "M", "english.alphabet.recognition", { required: true }),
    choice("english-letter-s", "english.pack.alphabet-visual", "english-alphabet-visual", "Find letter S", "Tap the letter S.", ["S", "C", "Z"], "S", "english.alphabet.recognition"),

    listen("english-listen-letter-a", "english.pack.alphabet-listening", "english-alphabet-listening", "Listen: A", "Choose the letter A", ["E", "A", "I"], "A", "english.alphabet.listening", { ageMin: 3, required: true }),
    listen("english-listen-letter-m", "english.pack.alphabet-listening", "english-alphabet-listening", "Listen: M", "Choose the letter M", ["N", "M", "W"], "M", "english.alphabet.listening", { ageMin: 3 }),
    matching("english-match-case-ab", "english.pack.alphabet-listening", "english-alphabet-listening", "Match A and B", "Match each capital letter with its lowercase form.", "english.alphabet.recognition", [["a", "A", "a"], ["b", "B", "b"]], { required: true }),
    matching("english-match-case-ms", "english.pack.alphabet-listening", "english-alphabet-listening", "Match M and S", "Connect the same uppercase and lowercase letters.", "english.alphabet.recognition", [["m", "M", "m"], ["s", "S", "s"]]),

    choice("english-initial-ball", "english.pack.initial-sounds", "english-initial-sounds", "B starts BALL", "Which word starts with B?", ["BALL", "CAT", "SUN"], "BALL", "english.phonics.initial_sound", { required: true, emoji: "⚽" }),
    choice("english-initial-sun", "english.pack.initial-sounds", "english-initial-sounds", "S starts SUN", "Which word starts with S?", ["MOON", "SUN", "DOG"], "SUN", "english.phonics.initial_sound", { emoji: "☀️" }),
    matching("english-match-initial-bc", "english.pack.initial-sounds", "english-initial-sounds", "Match first letters", "Match each first letter to the correct word.", "english.phonics.initial_sound", [["b", "B", "BALL"], ["c", "C", "CAT"]], { required: true, emoji: "🔡" }),

    choice("english-find-red", "english.pack.basic-colors", "english-basic-colors", "Find red", "Which word is RED?", ["RED", "GREEN", "YELLOW"], "RED", "english.color.recognition", { required: true, emoji: "🔴" }),
    choice("english-find-green", "english.pack.basic-colors", "english-basic-colors", "Find green", "Choose the word GREEN.", ["BLUE", "GREEN", "RED"], "GREEN", "english.color.recognition", { emoji: "🟢" }),
    listen("english-listen-yellow", "english.pack.basic-colors", "english-basic-colors", "Listen: yellow", "Choose yellow", ["🟢", "🟡", "🔵"], "🟡", "english.color.recognition", { required: true, emoji: "🟡" }),
    matching("english-match-colors-red-blue", "english.pack.basic-colors", "english-basic-colors", "Match color words", "Match each color word to its colored circle.", "english.color.recognition", [["red", "RED", "🔴"], ["blue", "BLUE", "🔵"]]),

    choice("english-number-one", "english.pack.numbers-one-five", "english-numbers-one-five", "ONE means 1", "Which word means 1?", ["ONE", "TWO", "THREE"], "ONE", "english.number.1_5", { required: true, emoji: "1️⃣" }),
    choice("english-number-two", "english.pack.numbers-one-five", "english-numbers-one-five", "TWO means 2", "Which word means 2?", ["THREE", "TWO", "FOUR"], "TWO", "english.number.1_5", { emoji: "2️⃣" }),
    listen("english-listen-three", "english.pack.numbers-one-five", "english-numbers-one-five", "Listen: three", "Choose number three", ["2", "3", "5"], "3", "english.number.1_5", { required: true, emoji: "3️⃣" }),
    matching("english-match-four-five", "english.pack.numbers-one-five", "english-numbers-one-five", "Match FOUR and FIVE", "Match each English number word to its numeral.", "english.number.1_5", [["four", "FOUR", "4"], ["five", "FIVE", "5"]], { required: true, emoji: "🔢" })
  ]
};
