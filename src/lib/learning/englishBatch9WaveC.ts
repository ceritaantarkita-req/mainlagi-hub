import type { EnglishBatch9ActivitySeed, EnglishBatch9WaveDefinition } from "./englishBatch9Authoring";

const STAGE_ID = "english-words-actions";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Latihan kosakata English melalui makanan, aksi, kategori, dan konteks gambar sederhana.", emoji: options.emoji ?? "🍎", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan kata English lalu pilih makna atau gambar yang tepat.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan kata English dengan gambar atau kelompok makna yang sesuai.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const ENGLISH_BATCH9_WAVE_C: EnglishBatch9WaveDefinition = {
  wave: "C",
  stage: { id: STAGE_ID, subjectId: "english", title: "Food, Actions & Categories", subtitle: "Kenali makanan, kata kerja, kategori sederhana, pasangan kata-gambar, dan listening yang lebih luas.", emoji: "🍎" },
  lessons: [
    { id: "english-food", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Food words", objective: "Mengenali kosakata makanan dan minuman English sederhana.", ageMin: 4, ageMax: 7 },
    { id: "english-actions", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Action words", objective: "Mengenali kata kerja English sederhana dari konteks visual atau audio.", ageMin: 4, ageMax: 7 },
    { id: "english-categories", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Word categories", objective: "Membedakan kelompok kosakata seperti food, animal, body, object, dan action.", ageMin: 5, ageMax: 7 },
    { id: "english-word-picture-expanded", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Word and picture matching", objective: "Memasangkan lebih banyak kata English dengan representasi visual yang tepat.", ageMin: 4, ageMax: 7 },
    { id: "english-listening-expanded", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Listen and identify", objective: "Menghubungkan kata English yang didengar dengan gambar atau pilihan tertulis yang tepat.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "english.pack.food", title: "Food Words", lessonId: "english-food", ageMin: 4, ageMax: 7 },
    { id: "english.pack.actions", title: "Action Words", lessonId: "english-actions", ageMin: 4, ageMax: 7 },
    { id: "english.pack.categories", title: "Word Categories", lessonId: "english-categories", ageMin: 5, ageMax: 7 },
    { id: "english.pack.word-picture-expanded", title: "Word & Picture Expanded", lessonId: "english-word-picture-expanded", ageMin: 4, ageMax: 7 },
    { id: "english.pack.listening-expanded", title: "Listen & Identify", lessonId: "english-listening-expanded", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "english.vocab.food", subjectId: "english", title: "Food vocabulary", description: "Mengenali makanan dan minuman English sederhana.", domain: "language", ageMin: 4, ageMax: 7 },
    { id: "english.vocab.actions", subjectId: "english", title: "Action vocabulary", description: "Mengenali kata kerja English sederhana melalui konteks familiar.", domain: "language", ageMin: 4, ageMax: 7 },
    { id: "english.vocab.category", subjectId: "english", title: "Categorize English words", description: "Membedakan kosakata berdasarkan kategori makna sederhana.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "english.word.picture_matching", subjectId: "english", title: "Expanded word-picture matching", description: "Menghubungkan kata English dengan gambar yang tepat pada lebih banyak kategori.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "english.word.listening", subjectId: "english", title: "Expanded word listening", description: "Mengidentifikasi kata English yang didengar dari beberapa pilihan.", domain: "language", ageMin: 4, ageMax: 7 }
  ],
  activities: [
    choice("english-food-apple", "english.pack.food", "english-food", "Find APPLE", "Which word matches 🍎?", ["APPLE", "BREAD", "RICE"], "APPLE", "english.vocab.food", { required: true, emoji: "🍎" }),
    choice("english-food-banana", "english.pack.food", "english-food", "Find BANANA", "Choose the word for 🍌.", ["MILK", "BANANA", "APPLE"], "BANANA", "english.vocab.food", { emoji: "🍌" }),
    choice("english-food-bread", "english.pack.food", "english-food", "Find BREAD", "Which word means bread?", ["RICE", "BREAD", "MILK"], "BREAD", "english.vocab.food", { emoji: "🍞" }),
    listen("english-listen-milk", "english.pack.food", "english-food", "Listen: milk", "Choose MILK", ["🥛", "🍞", "🍚"], "🥛", "english.vocab.food", { required: true, emoji: "🥛" }),
    matching("english-match-food-rice-apple", "english.pack.food", "english-food", "Match rice and apple", "Match each food word to its picture.", "english.vocab.food", [["rice", "RICE", "🍚"], ["apple", "APPLE", "🍎"]], { required: true }),

    choice("english-action-run", "english.pack.actions", "english-actions", "Find RUN", "Which word means to run?", ["RUN", "READ", "SLEEP"], "RUN", "english.vocab.actions", { required: true, emoji: "🏃" }),
    choice("english-action-jump", "english.pack.actions", "english-actions", "Find JUMP", "Choose the action JUMP.", ["EAT", "JUMP", "READ"], "JUMP", "english.vocab.actions", { emoji: "🤸" }),
    choice("english-action-read", "english.pack.actions", "english-actions", "Find READ", "Which action is READ?", ["SLEEP", "RUN", "READ"], "READ", "english.vocab.actions", { emoji: "📖" }),
    listen("english-listen-sleep", "english.pack.actions", "english-actions", "Listen: sleep", "Choose SLEEP", ["EAT", "SLEEP", "JUMP"], "SLEEP", "english.vocab.actions", { required: true, emoji: "😴" }),
    matching("english-match-actions-eat-read", "english.pack.actions", "english-actions", "Match eat and read", "Match each action word to its symbol.", "english.vocab.actions", [["eat", "EAT", "🍽️"], ["read", "READ", "📖"]], { required: true }),

    choice("english-category-food", "english.pack.categories", "english-categories", "Which is FOOD?", "Which word belongs to food?", ["APPLE", "DOG", "HAND"], "APPLE", "english.vocab.category", { required: true, difficulty: 2 }),
    choice("english-category-animal", "english.pack.categories", "english-categories", "Which is an ANIMAL?", "Which word names an animal?", ["CHAIR", "RABBIT", "MILK"], "RABBIT", "english.vocab.category", { difficulty: 2 }),
    choice("english-category-action", "english.pack.categories", "english-categories", "Which is an ACTION?", "Which word is an action?", ["RUN", "BOOK", "MOTHER"], "RUN", "english.vocab.category", { difficulty: 2 }),
    matching("english-match-category-body-object", "english.pack.categories", "english-categories", "Body or object", "Match each word to its category label.", "english.vocab.category", [["body", "HAND", "BODY"], ["object", "BOOK", "OBJECT"]], { required: true, difficulty: 3 }),
    matching("english-match-category-food-animal", "english.pack.categories", "english-categories", "Food or animal", "Match each word to the right category.", "english.vocab.category", [["food", "BREAD", "FOOD"], ["animal", "FISH", "ANIMAL"]], { difficulty: 3 }),

    matching("english-picture-pair-apple-banana", "english.pack.word-picture-expanded", "english-word-picture-expanded", "Match apple and banana", "Match each word to its picture.", "english.word.picture_matching", [["apple", "APPLE", "🍎"], ["banana", "BANANA", "🍌"]], { required: true }),
    matching("english-picture-pair-run-sleep", "english.pack.word-picture-expanded", "english-word-picture-expanded", "Match run and sleep", "Connect the action words to their symbols.", "english.word.picture_matching", [["run", "RUN", "🏃"], ["sleep", "SLEEP", "😴"]]),
    matching("english-picture-pair-book-cup", "english.pack.word-picture-expanded", "english-word-picture-expanded", "Match book and cup", "Match the object words to the pictures.", "english.word.picture_matching", [["book", "BOOK", "📘"], ["cup", "CUP", "🥤"]]),
    matching("english-picture-pair-eyes-hand", "english.pack.word-picture-expanded", "english-word-picture-expanded", "Match eyes and hand", "Match the body words to their symbols.", "english.word.picture_matching", [["eyes", "EYES", "👀"], ["hand", "HAND", "✋"]], { required: true }),
    matching("english-picture-pair-mother-baby", "english.pack.word-picture-expanded", "english-word-picture-expanded", "Match mother and baby", "Match the family words to their symbols.", "english.word.picture_matching", [["mother", "MOTHER", "👩"], ["baby", "BABY", "👶"]]),

    listen("english-listen-apple-review", "english.pack.listening-expanded", "english-listening-expanded", "Listen and find apple", "Choose the apple", ["🍌", "🍎", "🍞"], "🍎", "english.word.listening", { required: true }),
    listen("english-listen-jump-review", "english.pack.listening-expanded", "english-listening-expanded", "Listen and find jump", "Choose JUMP", ["RUN", "JUMP", "READ"], "JUMP", "english.word.listening"),
    listen("english-listen-book-review", "english.pack.listening-expanded", "english-listening-expanded", "Listen and find book", "Choose the book", ["📘", "🎒", "🥤"], "📘", "english.word.listening"),
    listen("english-listen-hand-review", "english.pack.listening-expanded", "english-listening-expanded", "Listen and find hand", "Choose the hand", ["👂", "✋", "👀"], "✋", "english.word.listening", { required: true }),
    listen("english-listen-baby-review", "english.pack.listening-expanded", "english-listening-expanded", "Listen and find baby", "Choose BABY", ["MOTHER", "FATHER", "BABY"], "BABY", "english.word.listening")
  ]
};
