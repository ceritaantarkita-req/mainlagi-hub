import type { EnglishBatch9ActivitySeed, EnglishBatch9WaveDefinition } from "./englishBatch9Authoring";

const STAGE_ID = "english-everyday-words";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Perluas kosakata English sehari-hari melalui pilihan visual yang familiar.", emoji: options.emoji ?? "💬", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan kata English sehari-hari lalu pilih gambar atau kata yang sesuai.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): EnglishBatch9ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan kata English dengan gambar atau konsep yang tepat.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const ENGLISH_BATCH9_WAVE_B: EnglishBatch9WaveDefinition = {
  wave: "B",
  stage: { id: STAGE_ID, subjectId: "english", title: "Everyday Words", subtitle: "Kenali hewan, benda, bagian tubuh, keluarga, dan gabungkan kosakata dari beberapa kelompok.", emoji: "🧸" },
  lessons: [
    { id: "english-animals", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Animals", objective: "Mengenali nama hewan English sederhana selain CAT yang sudah dipelajari.", ageMin: 3, ageMax: 7 },
    { id: "english-objects", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Everyday objects", objective: "Menghubungkan kata English dengan benda sehari-hari yang familiar.", ageMin: 4, ageMax: 7 },
    { id: "english-body", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Body parts", objective: "Mengenali beberapa bagian tubuh dasar dalam English.", ageMin: 4, ageMax: 7 },
    { id: "english-family", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Family words", objective: "Mengenali kata keluarga dasar dalam English.", ageMin: 4, ageMax: 7 },
    { id: "english-everyday-review", subjectId: "english", pathId: "english-first-steps", stageId: STAGE_ID, title: "Everyday word review", objective: "Menghubungkan kata lintas hewan, benda, tubuh, dan keluarga dengan makna yang tepat.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "english.pack.animals", title: "Animals", lessonId: "english-animals", ageMin: 3, ageMax: 7 },
    { id: "english.pack.objects", title: "Everyday Objects", lessonId: "english-objects", ageMin: 4, ageMax: 7 },
    { id: "english.pack.body", title: "Body Parts", lessonId: "english-body", ageMin: 4, ageMax: 7 },
    { id: "english.pack.family", title: "Family Words", lessonId: "english-family", ageMin: 4, ageMax: 7 },
    { id: "english.pack.everyday-review", title: "Everyday Review", lessonId: "english-everyday-review", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "english.vocab.animals", subjectId: "english", title: "Animal vocabulary", description: "Mengenali nama hewan English sederhana dari kata, gambar, dan audio.", domain: "language", ageMin: 3, ageMax: 7 },
    { id: "english.vocab.objects", subjectId: "english", title: "Object vocabulary", description: "Mengenali kata English untuk benda sehari-hari yang familiar.", domain: "language", ageMin: 4, ageMax: 7 },
    { id: "english.vocab.body", subjectId: "english", title: "Body vocabulary", description: "Mengenali bagian tubuh dasar dalam English.", domain: "language", ageMin: 4, ageMax: 7 },
    { id: "english.vocab.family", subjectId: "english", title: "Family vocabulary", description: "Mengenali kata keluarga dasar dalam English.", domain: "language", ageMin: 4, ageMax: 7 },
    { id: "english.vocab.everyday_integration", subjectId: "english", title: "Integrate everyday words", description: "Menggunakan kosakata dari beberapa kategori English secara terpadu.", domain: "language", ageMin: 4, ageMax: 7 }
  ],
  activities: [
    choice("english-animal-dog", "english.pack.animals", "english-animals", "Find the dog", "Which word means 🐶?", ["DOG", "BIRD", "FISH"], "DOG", "english.vocab.animals", { required: true, ageMin: 3, emoji: "🐶" }),
    choice("english-animal-rabbit", "english.pack.animals", "english-animals", "Find the rabbit", "Choose the word for 🐰.", ["RABBIT", "DOG", "BIRD"], "RABBIT", "english.vocab.animals", { ageMin: 3, emoji: "🐰" }),
    choice("english-animal-fish", "english.pack.animals", "english-animals", "Find the fish", "Which word matches 🐟?", ["BIRD", "FISH", "RABBIT"], "FISH", "english.vocab.animals", { ageMin: 3, emoji: "🐟" }),
    listen("english-listen-bird", "english.pack.animals", "english-animals", "Listen: bird", "Choose the bird", ["🐟", "🐦", "🐶"], "🐦", "english.vocab.animals", { required: true, ageMin: 3, emoji: "🐦" }),
    matching("english-match-animals-dog-rabbit", "english.pack.animals", "english-animals", "Match two animals", "Match each animal word to its picture.", "english.vocab.animals", [["dog", "DOG", "🐶"], ["rabbit", "RABBIT", "🐰"]], { required: true, ageMin: 3 }),

    choice("english-object-book", "english.pack.objects", "english-objects", "Find the book", "Which word means 📘?", ["BOOK", "CHAIR", "CUP"], "BOOK", "english.vocab.objects", { required: true, emoji: "📘" }),
    choice("english-object-chair", "english.pack.objects", "english-objects", "Find the chair", "Choose the word for 🪑.", ["BAG", "CHAIR", "BALL"], "CHAIR", "english.vocab.objects", { emoji: "🪑" }),
    choice("english-object-cup", "english.pack.objects", "english-objects", "Find the cup", "Which word matches a cup?", ["CUP", "BOOK", "BAG"], "CUP", "english.vocab.objects", { emoji: "🥤" }),
    listen("english-listen-bag", "english.pack.objects", "english-objects", "Listen: bag", "Choose the bag", ["🎒", "📘", "⚽"], "🎒", "english.vocab.objects", { required: true, emoji: "🎒" }),
    matching("english-match-objects-book-ball", "english.pack.objects", "english-objects", "Match book and ball", "Match each object word to its picture.", "english.vocab.objects", [["book", "BOOK", "📘"], ["ball", "BALL", "⚽"]], { required: true }),

    choice("english-body-head", "english.pack.body", "english-body", "Find HEAD", "Which word names this body part: head?", ["HEAD", "HAND", "FOOT"], "HEAD", "english.vocab.body", { required: true, emoji: "🙂" }),
    choice("english-body-hand", "english.pack.body", "english-body", "Find HAND", "Choose the word HAND.", ["EYES", "HAND", "EARS"], "HAND", "english.vocab.body", { emoji: "✋" }),
    choice("english-body-foot", "english.pack.body", "english-body", "Find FOOT", "Which word means foot?", ["HEAD", "FOOT", "HAND"], "FOOT", "english.vocab.body", { emoji: "🦶" }),
    listen("english-listen-eyes", "english.pack.body", "english-body", "Listen: eyes", "Choose eyes", ["👂", "👀", "✋"], "👀", "english.vocab.body", { required: true, emoji: "👀" }),
    matching("english-match-body-eyes-ears", "english.pack.body", "english-body", "Match eyes and ears", "Match the body words to the right symbols.", "english.vocab.body", [["eyes", "EYES", "👀"], ["ears", "EARS", "👂"]], { required: true }),

    choice("english-family-mother", "english.pack.family", "english-family", "Find MOTHER", "Which word means mother?", ["MOTHER", "FATHER", "BABY"], "MOTHER", "english.vocab.family", { required: true, emoji: "👩" }),
    choice("english-family-father", "english.pack.family", "english-family", "Find FATHER", "Choose the word FATHER.", ["SISTER", "FATHER", "BROTHER"], "FATHER", "english.vocab.family", { emoji: "👨" }),
    choice("english-family-baby", "english.pack.family", "english-family", "Find BABY", "Which family word is BABY?", ["BABY", "MOTHER", "SISTER"], "BABY", "english.vocab.family", { emoji: "👶" }),
    listen("english-listen-sister", "english.pack.family", "english-family", "Listen: sister", "Choose SISTER", ["BROTHER", "SISTER", "FATHER"], "SISTER", "english.vocab.family", { required: true, emoji: "👧" }),
    matching("english-match-family-siblings", "english.pack.family", "english-family", "Match sister and brother", "Match the sibling words to their symbols.", "english.vocab.family", [["sister", "SISTER", "👧"], ["brother", "BROTHER", "👦"]], { required: true }),

    choice("english-review-word-book", "english.pack.everyday-review", "english-everyday-review", "Everyday review: BOOK", "Which one is a thing you can read?", ["BOOK", "DOG", "HAND"], "BOOK", "english.vocab.everyday_integration", { required: true, difficulty: 2 }),
    listen("english-review-listen-father", "english.pack.everyday-review", "english-everyday-review", "Everyday listen: father", "Choose the family word FATHER", ["MOTHER", "FATHER", "BABY"], "FATHER", "english.vocab.everyday_integration", { difficulty: 2 }),
    listen("english-review-listen-fish", "english.pack.everyday-review", "english-everyday-review", "Everyday listen: fish", "Choose the animal FISH", ["DOG", "FISH", "RABBIT"], "FISH", "english.vocab.everyday_integration", { difficulty: 2 }),
    matching("english-review-match-animal-object", "english.pack.everyday-review", "english-everyday-review", "Animal and object review", "Match each word to the correct picture.", "english.vocab.everyday_integration", [["bird", "BIRD", "🐦"], ["chair", "CHAIR", "🪑"]], { required: true }),
    matching("english-review-match-body-family", "english.pack.everyday-review", "english-everyday-review", "Body and family review", "Match each English word to its symbol.", "english.vocab.everyday_integration", [["hand", "HAND", "✋"], ["baby", "BABY", "👶"]])
  ]
};
