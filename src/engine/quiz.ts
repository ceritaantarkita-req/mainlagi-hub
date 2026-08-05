/**
 * Question bank for Pilih Jawaban - the point-and-hold AR quiz.
 *
 * Answers are chosen by holding a hand over a floating button rather than by
 * writing, which makes this the one game in the hub that works for a child who
 * cannot yet form letters or digits reliably. It is also the fallback when
 * handwriting recognition is having a bad day: nothing here depends on it.
 *
 * Prompts are emoji so the whole thing stays self-contained - no image files to
 * ship, license, or fail to load, and it scales cleanly on any screen.
 */

export type QuizCategory = "bendera" | "hewan" | "buah" | "benda";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  /** Shown large, above the options. */
  prompt: string;
  /** Short line under the prompt, e.g. "Bendera negara mana?" */
  question: string;
  /** Exactly two options: this game is deliberately a binary choice. */
  options: [string, string];
  /** Index into `options`. */
  answer: 0 | 1;
}

export const QUIZ_CATEGORY_LABELS: Record<QuizCategory, string> = {
  bendera: "Bendera & Negara",
  hewan: "Hewan",
  buah: "Buah & Sayur",
  benda: "Benda Sehari-hari"
};

const QUESTIONS: QuizQuestion[] = [
  // --- Bendera ---
  { id: "flag-id", category: "bendera", prompt: "🇮🇩", question: "Bendera negara mana?", options: ["Indonesia", "Singapura"], answer: 0 },
  { id: "flag-jp", category: "bendera", prompt: "🇯🇵", question: "Bendera negara mana?", options: ["Korea", "Jepang"], answer: 1 },
  { id: "flag-my", category: "bendera", prompt: "🇲🇾", question: "Bendera negara mana?", options: ["Malaysia", "Thailand"], answer: 0 },
  { id: "flag-sa", category: "bendera", prompt: "🇸🇦", question: "Bendera negara mana?", options: ["Mesir", "Arab Saudi"], answer: 1 },
  { id: "flag-br", category: "bendera", prompt: "🇧🇷", question: "Bendera negara mana?", options: ["Brasil", "Argentina"], answer: 0 },
  { id: "flag-in", category: "bendera", prompt: "🇮🇳", question: "Bendera negara mana?", options: ["Pakistan", "India"], answer: 1 },
  { id: "flag-au", category: "bendera", prompt: "🇦🇺", question: "Bendera negara mana?", options: ["Australia", "Selandia Baru"], answer: 0 },
  { id: "flag-eg", category: "bendera", prompt: "🇪🇬", question: "Bendera negara mana?", options: ["Turki", "Mesir"], answer: 1 },

  // --- Hewan ---
  { id: "animal-elephant", category: "hewan", prompt: "🐘", question: "Hewan apa ini?", options: ["Gajah", "Badak"], answer: 0 },
  { id: "animal-giraffe", category: "hewan", prompt: "🦒", question: "Hewan apa ini?", options: ["Kuda", "Jerapah"], answer: 1 },
  { id: "animal-tiger", category: "hewan", prompt: "🐅", question: "Hewan apa ini?", options: ["Harimau", "Singa"], answer: 0 },
  { id: "animal-penguin", category: "hewan", prompt: "🐧", question: "Hewan apa ini?", options: ["Bebek", "Pinguin"], answer: 1 },
  { id: "animal-butterfly", category: "hewan", prompt: "🦋", question: "Hewan apa ini?", options: ["Kupu-kupu", "Capung"], answer: 0 },
  { id: "animal-octopus", category: "hewan", prompt: "🐙", question: "Hewan apa ini?", options: ["Cumi", "Gurita"], answer: 1 },
  { id: "animal-owl", category: "hewan", prompt: "🦉", question: "Hewan apa ini?", options: ["Burung Hantu", "Elang"], answer: 0 },
  { id: "animal-crocodile", category: "hewan", prompt: "🐊", question: "Hewan apa ini?", options: ["Kadal", "Buaya"], answer: 1 },
  { id: "animal-bee", category: "hewan", prompt: "🐝", question: "Hewan apa ini?", options: ["Lebah", "Lalat"], answer: 0 },
  { id: "animal-turtle", category: "hewan", prompt: "🐢", question: "Hewan apa ini?", options: ["Siput", "Kura-kura"], answer: 1 },

  // --- Buah & sayur ---
  { id: "fruit-banana", category: "buah", prompt: "🍌", question: "Buah apa ini?", options: ["Pisang", "Mangga"], answer: 0 },
  { id: "fruit-watermelon", category: "buah", prompt: "🍉", question: "Buah apa ini?", options: ["Melon", "Semangka"], answer: 1 },
  { id: "fruit-pineapple", category: "buah", prompt: "🍍", question: "Buah apa ini?", options: ["Nanas", "Durian"], answer: 0 },
  { id: "fruit-strawberry", category: "buah", prompt: "🍓", question: "Buah apa ini?", options: ["Ceri", "Stroberi"], answer: 1 },
  { id: "fruit-carrot", category: "buah", prompt: "🥕", question: "Sayur apa ini?", options: ["Wortel", "Lobak"], answer: 0 },
  { id: "fruit-corn", category: "buah", prompt: "🌽", question: "Sayur apa ini?", options: ["Gandum", "Jagung"], answer: 1 },
  { id: "fruit-grapes", category: "buah", prompt: "🍇", question: "Buah apa ini?", options: ["Anggur", "Blueberry"], answer: 0 },
  { id: "fruit-coconut", category: "buah", prompt: "🥥", question: "Buah apa ini?", options: ["Kelapa Sawit", "Kelapa"], answer: 1 },

  // --- Benda sehari-hari ---
  { id: "thing-umbrella", category: "benda", prompt: "☂️", question: "Benda apa ini?", options: ["Payung", "Tenda"], answer: 0 },
  { id: "thing-scissors", category: "benda", prompt: "✂️", question: "Benda apa ini?", options: ["Pisau", "Gunting"], answer: 1 },
  { id: "thing-book", category: "benda", prompt: "📚", question: "Benda apa ini?", options: ["Buku", "Kotak"], answer: 0 },
  { id: "thing-clock", category: "benda", prompt: "⏰", question: "Benda apa ini?", options: ["Radio", "Jam Weker"], answer: 1 },
  { id: "thing-bicycle", category: "benda", prompt: "🚲", question: "Benda apa ini?", options: ["Sepeda", "Motor"], answer: 0 },
  { id: "thing-guitar", category: "benda", prompt: "🎸", question: "Benda apa ini?", options: ["Biola", "Gitar"], answer: 1 },
  { id: "thing-key", category: "benda", prompt: "🔑", question: "Benda apa ini?", options: ["Kunci", "Peniti"], answer: 0 },
  { id: "thing-candle", category: "benda", prompt: "🕯️", question: "Benda apa ini?", options: ["Senter", "Lilin"], answer: 1 }
];

export function quizQuestions(categories?: readonly QuizCategory[]): QuizQuestion[] {
  if (!categories || categories.length === 0) return [...QUESTIONS];
  return QUESTIONS.filter((question) => categories.includes(question.category));
}

/**
 * Deal a shuffled run of questions.
 *
 * Correct answers alternate sides unpredictably because `options` order is
 * fixed per question and the bank deliberately mixes answer 0 and answer 1 -
 * otherwise a child learns "always pick the left one" and stops reading.
 */
export function dealQuiz(
  count: number,
  random: () => number,
  categories?: readonly QuizCategory[]
): QuizQuestion[] {
  const pool = quizQuestions(categories);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
