import type { EnglishBatch9ActivitySeed, EnglishBatch9WaveDefinition } from "./englishBatch9Authoring";

const STAGE_ID = "english-phrases-review";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Gunakan kosakata English dalam relasi, frasa, dan kalimat sangat sederhana.", emoji: options.emoji ?? "💬", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 3, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan frasa atau kalimat English pendek lalu pilih detail literal yang benar.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 3, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan kata atau konsep English yang memiliki hubungan sederhana.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 3, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const ENGLISH_BATCH9_WAVE_D: EnglishBatch9WaveDefinition = {
  wave: "D",
  stage: { id: STAGE_ID, subjectId: "english", title: "Opposites, Phrases & Review", subtitle: "Pahami lawan kata, frasa dan kalimat pendek, detail listening, lalu selesaikan review terpadu.", emoji: "💬" },
  lessons: [
    { id: "english-opposites", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Opposites", objective: "Mengenali pasangan lawan kata English yang konkret dan familiar.", ageMin: 5, ageMax: 7 },
    { id: "english-simple-phrases", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Simple phrases", objective: "Memahami frasa English sangat pendek berdasarkan makna literal.", ageMin: 5, ageMax: 7 },
    { id: "english-sentence-completion", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Complete simple sentences", objective: "Melengkapi kalimat English pendek dengan kata yang tepat.", ageMin: 5, ageMax: 7 },
    { id: "english-listening-comprehension", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Listening comprehension", objective: "Menangkap detail literal dari kalimat English pendek yang didengar.", ageMin: 5, ageMax: 7 },
    { id: "english-integrated-review", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Integrated English review", objective: "Mengintegrasikan alfabet, kosakata, kategori, aksi, angka, dan frasa sederhana.", ageMin: 5, ageMax: 7 }
  ],
  packs: [
    { id: "english.pack.opposites", title: "Opposites", lessonId: "english-opposites", ageMin: 5, ageMax: 7 },
    { id: "english.pack.simple-phrases", title: "Simple Phrases", lessonId: "english-simple-phrases", ageMin: 5, ageMax: 7 },
    { id: "english.pack.sentence-completion", title: "Complete Sentences", lessonId: "english-sentence-completion", ageMin: 5, ageMax: 7 },
    { id: "english.pack.listening-comprehension", title: "Listening Comprehension", lessonId: "english-listening-comprehension", ageMin: 5, ageMax: 7 },
    { id: "english.pack.integrated-review", title: "Integrated Review", lessonId: "english-integrated-review", ageMin: 5, ageMax: 7 }
  ],
  skills: [
    { id: "english.relation.opposites", subjectId: "english", title: "Recognize opposites", description: "Mengenali pasangan lawan kata English sederhana.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "english.phrase.literal", subjectId: "english", title: "Understand simple phrases", description: "Memahami makna literal frasa English pendek.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "english.sentence.completion", subjectId: "english", title: "Complete simple sentences", description: "Melengkapi kalimat English pendek dengan kata yang sesuai konteks.", domain: "literacy", ageMin: 5, ageMax: 7 },
    { id: "english.sentence.listening_detail", subjectId: "english", title: "Listen for sentence details", description: "Menentukan detail literal dari kalimat English pendek yang didengar.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "english.review.integration", subjectId: "english", title: "Integrated English review", description: "Menggunakan beberapa kemampuan English dasar secara terpadu.", domain: "language", ageMin: 5, ageMax: 7 }
  ],
  activities: [
    choice("english-opposite-big-small", "english.pack.opposites", "english-opposites", "Opposite of BIG", "What is the opposite of BIG?", ["SMALL", "TALL", "FAST"], "SMALL", "english.relation.opposites", { required: true, emoji: "↔️" }),
    choice("english-opposite-hot-cold", "english.pack.opposites", "english-opposites", "Opposite of HOT", "Choose the opposite of HOT.", ["COLD", "WET", "RED"], "COLD", "english.relation.opposites", { emoji: "❄️" }),
    choice("english-opposite-up-down", "english.pack.opposites", "english-opposites", "Opposite of UP", "What is the opposite of UP?", ["LEFT", "DOWN", "NEAR"], "DOWN", "english.relation.opposites", { emoji: "⬇️" }),
    matching("english-match-opposites-fast-slow", "english.pack.opposites", "english-opposites", "Match fast and slow", "Match each word to its opposite.", "english.relation.opposites", [["speed", "FAST", "SLOW"], ["open", "OPEN", "CLOSED"]], { required: true }),
    matching("english-match-opposites-happy-sad", "english.pack.opposites", "english-opposites", "Match happy and sad", "Connect each opposite pair.", "english.relation.opposites", [["feeling", "HAPPY", "SAD"], ["height", "TALL", "SHORT"]]),

    choice("english-phrase-red-ball", "english.pack.simple-phrases", "english-simple-phrases", "A RED BALL", "Which picture matches A RED BALL?", ["🔴⚽", "🔵⚽", "🔴📘"], "🔴⚽", "english.phrase.literal", { required: true, emoji: "⚽" }),
    choice("english-phrase-two-books", "english.pack.simple-phrases", "english-simple-phrases", "TWO BOOKS", "Which choice shows TWO BOOKS?", ["📘", "📘📘", "📘📘📘"], "📘📘", "english.phrase.literal", { emoji: "📚" }),
    choice("english-phrase-small-cat", "english.pack.simple-phrases", "english-simple-phrases", "A SMALL CAT", "Which phrase means a small cat?", ["A SMALL CAT", "A BIG DOG", "TWO CATS"], "A SMALL CAT", "english.phrase.literal", { emoji: "🐱" }),
    choice("english-phrase-yellow-banana", "english.pack.simple-phrases", "english-simple-phrases", "A YELLOW BANANA", "Which phrase matches 🍌?", ["A GREEN APPLE", "A YELLOW BANANA", "A RED BALL"], "A YELLOW BANANA", "english.phrase.literal", { required: true, emoji: "🍌" }),
    listen("english-listen-phrase-blue-book", "english.pack.simple-phrases", "english-simple-phrases", "Listen: a blue book", "Choose a blue book", ["🔵📘", "🔴📘", "🔵⚽"], "🔵📘", "english.phrase.literal", { required: true, emoji: "📘" }),

    choice("english-complete-cat-sleeps", "english.pack.sentence-completion", "english-sentence-completion", "The cat ___", "Complete: The cat ___.", ["SLEEPS", "BOOK", "YELLOW"], "SLEEPS", "english.sentence.completion", { required: true, emoji: "🐱" }),
    choice("english-complete-bird-flies", "english.pack.sentence-completion", "english-sentence-completion", "The bird ___", "Complete: The bird ___.", ["FLIES", "MILK", "HAND"], "FLIES", "english.sentence.completion", { emoji: "🐦" }),
    choice("english-complete-i-read", "english.pack.sentence-completion", "english-sentence-completion", "I ___ a book", "Complete: I ___ a book.", ["READ", "RED", "RABBIT"], "READ", "english.sentence.completion", { emoji: "📖" }),
    choice("english-complete-two-apples", "english.pack.sentence-completion", "english-sentence-completion", "I see two ___", "Complete: I see two ___.", ["APPLES", "FATHER", "RUN"], "APPLES", "english.sentence.completion", { required: true, emoji: "🍎" }),
    choice("english-complete-mother-family", "english.pack.sentence-completion", "english-sentence-completion", "My ___ is here", "Complete: My ___ is here.", ["MOTHER", "CHAIR", "FISH"], "MOTHER", "english.sentence.completion", { emoji: "👩" }),

    listen("english-detail-red-ball", "english.pack.listening-comprehension", "english-listening-comprehension", "Listen for color", "The ball is red. What color is the ball?", ["RED", "BLUE", "GREEN"], "RED", "english.sentence.listening_detail", { required: true, emoji: "🔴" }),
    listen("english-detail-two-books", "english.pack.listening-comprehension", "english-listening-comprehension", "Listen for number", "I have two books. How many books?", ["ONE", "TWO", "THREE"], "TWO", "english.sentence.listening_detail", { emoji: "📚" }),
    listen("english-detail-dog-runs", "english.pack.listening-comprehension", "english-listening-comprehension", "Listen for action", "The dog runs. What does the dog do?", ["RUNS", "SLEEPS", "READS"], "RUNS", "english.sentence.listening_detail", { emoji: "🐶" }),
    listen("english-detail-baby-sleeps", "english.pack.listening-comprehension", "english-listening-comprehension", "Listen for person", "The baby sleeps. Who sleeps?", ["BABY", "FATHER", "SISTER"], "BABY", "english.sentence.listening_detail", { required: true, emoji: "👶" }),
    listen("english-detail-bird-up", "english.pack.listening-comprehension", "english-listening-comprehension", "Listen for position word", "The bird is up. Which word did you hear?", ["UP", "DOWN", "SMALL"], "UP", "english.sentence.listening_detail", { emoji: "🐦" }),

    choice("english-review-letter-s", "english.pack.integrated-review", "english-integrated-review", "Final review: letter S", "Which word starts with S?", ["SUN", "BALL", "CAT"], "SUN", "english.review.integration", { required: true }),
    choice("english-review-number-five", "english.pack.integrated-review", "english-integrated-review", "Final review: FIVE", "Which numeral matches FIVE?", ["3", "4", "5"], "5", "english.review.integration"),
    choice("english-review-category-action", "english.pack.integrated-review", "english-integrated-review", "Final review: action", "Which word is an action?", ["JUMP", "BOOK", "APPLE"], "JUMP", "english.review.integration"),
    listen("english-review-listen-yellow-ball", "english.pack.integrated-review", "english-integrated-review", "Final listen: yellow ball", "Choose the yellow ball", ["🟡⚽", "🔴⚽", "🟡📘"], "🟡⚽", "english.review.integration", { required: true }),
    matching("english-review-match-final", "english.pack.integrated-review", "english-integrated-review", "Final mixed pairs", "Match each word to its correct picture.", "english.review.integration", [["banana", "BANANA", "🍌"], ["hand", "HAND", "✋"]], { required: true })
  ]
};
