import type { LearningSemanticIllustrationKey } from "./semanticIllustrationRuntime";
import type { LearningActivity } from "./system";

export type PictureWordMatchLocale = "id-ID" | "en-US";
export type PictureWordMatchDomainVariant = "bahasa_word_picture" | "english_word_picture";

export type PictureWordMatchConfig = {
  picture: string;
  spokenWord: string;
  successText: string;
  locale: PictureWordMatchLocale;
  domainVariant: PictureWordMatchDomainVariant;
  semanticKey?: LearningSemanticIllustrationKey;
};

type CanonicalPictureWordMatch = PictureWordMatchConfig & {
  subjectId: string;
  stageId: string;
  title: string;
  prompt: string;
  choices: readonly [string, string, string];
  correctChoice: string;
};

const CANONICAL_PICTURE_WORD_MATCH: Record<string, CanonicalPictureWordMatch> = {
  "bahasa-gambar-apel": {
    subjectId: "bahasa", stageId: "bahasa-suku-kata-kata", title: "🍎 adalah...",
    prompt: "Kata mana yang cocok dengan gambar 🍎?", choices: ["apel", "ayam", "awan"], correctChoice: "apel",
    picture: "🍎", semanticKey: "object.apple", spokenWord: "apel", successText: "Gambar apel cocok dengan kata apel.",
    locale: "id-ID", domainVariant: "bahasa_word_picture"
  },
  "bahasa-gambar-mobil": {
    subjectId: "bahasa", stageId: "bahasa-suku-kata-kata", title: "🚗 adalah...",
    prompt: "Pilih nama untuk gambar 🚗.", choices: ["motor", "mobil", "meja"], correctChoice: "mobil",
    picture: "🚗", semanticKey: "vehicle.car", spokenWord: "mobil", successText: "Gambar mobil cocok dengan kata mobil.",
    locale: "id-ID", domainVariant: "bahasa_word_picture"
  },
  "bahasa-gambar-kucing": {
    subjectId: "bahasa", stageId: "bahasa-suku-kata-kata", title: "🐱 adalah...",
    prompt: "Apa kata yang sesuai dengan 🐱?", choices: ["kuda", "kucing", "kelinci"], correctChoice: "kucing",
    picture: "🐱", semanticKey: "animal.cat", spokenWord: "kucing", successText: "Gambar kucing cocok dengan kata kucing.",
    locale: "id-ID", domainVariant: "bahasa_word_picture"
  },
  "bahasa-gambar-rumah": {
    subjectId: "bahasa", stageId: "bahasa-suku-kata-kata", title: "🏠 adalah...",
    prompt: "Gambar 🏠 menunjukkan apa?", choices: ["rumah", "roda", "rumput"], correctChoice: "rumah",
    picture: "🏠", semanticKey: "object.house", spokenWord: "rumah", successText: "Gambar rumah cocok dengan kata rumah.",
    locale: "id-ID", domainVariant: "bahasa_word_picture"
  },
  "bahasa-gambar-pisang": {
    subjectId: "bahasa", stageId: "bahasa-suku-kata-kata", title: "🍌 adalah...",
    prompt: "Pilih kata untuk 🍌.", choices: ["pepaya", "pisang", "pir"], correctChoice: "pisang",
    picture: "🍌", spokenWord: "pisang", successText: "Gambar pisang cocok dengan kata pisang.",
    locale: "id-ID", domainVariant: "bahasa_word_picture"
  },

  "english-animal-dog": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find the dog",
    prompt: "Which word means 🐶?", choices: ["DOG", "BIRD", "FISH"], correctChoice: "DOG",
    picture: "🐶", spokenWord: "DOG", successText: "DOG matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-animal-rabbit": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find the rabbit",
    prompt: "Choose the word for 🐰.", choices: ["RABBIT", "DOG", "BIRD"], correctChoice: "RABBIT",
    picture: "🐰", spokenWord: "RABBIT", successText: "RABBIT matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-animal-fish": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find the fish",
    prompt: "Which word matches 🐟?", choices: ["BIRD", "FISH", "RABBIT"], correctChoice: "FISH",
    picture: "🐟", semanticKey: "animal.fish", spokenWord: "FISH", successText: "FISH matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-object-book": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find the book",
    prompt: "Which word means 📘?", choices: ["BOOK", "CHAIR", "CUP"], correctChoice: "BOOK",
    picture: "📘", spokenWord: "BOOK", successText: "BOOK matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-object-chair": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find the chair",
    prompt: "Choose the word for 🪑.", choices: ["BAG", "CHAIR", "BALL"], correctChoice: "CHAIR",
    picture: "🪑", spokenWord: "CHAIR", successText: "CHAIR matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-object-cup": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find the cup",
    prompt: "Which word matches a cup?", choices: ["CUP", "BOOK", "BAG"], correctChoice: "CUP",
    picture: "🥤", semanticKey: "object.cup", spokenWord: "CUP", successText: "CUP matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-body-head": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find HEAD",
    prompt: "Which word names this body part: head?", choices: ["HEAD", "HAND", "FOOT"], correctChoice: "HEAD",
    picture: "🙂", semanticKey: "body.head", spokenWord: "HEAD", successText: "HEAD matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-body-hand": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find HAND",
    prompt: "Choose the word HAND.", choices: ["EYES", "HAND", "EARS"], correctChoice: "HAND",
    picture: "✋", spokenWord: "HAND", successText: "HAND matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-body-foot": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find FOOT",
    prompt: "Which word means foot?", choices: ["HEAD", "FOOT", "HAND"], correctChoice: "FOOT",
    picture: "🦶", spokenWord: "FOOT", successText: "FOOT matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-family-mother": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find MOTHER",
    prompt: "Which word means mother?", choices: ["MOTHER", "FATHER", "BABY"], correctChoice: "MOTHER",
    picture: "👩", spokenWord: "MOTHER", successText: "MOTHER matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-family-father": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find FATHER",
    prompt: "Choose the word FATHER.", choices: ["SISTER", "FATHER", "BROTHER"], correctChoice: "FATHER",
    picture: "👨", spokenWord: "FATHER", successText: "FATHER matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-family-baby": {
    subjectId: "english", stageId: "english-everyday-words", title: "Find BABY",
    prompt: "Which family word is BABY?", choices: ["BABY", "MOTHER", "SISTER"], correctChoice: "BABY",
    picture: "👶", spokenWord: "BABY", successText: "BABY matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },

  "english-food-apple": {
    subjectId: "english", stageId: "english-words-actions", title: "Find APPLE",
    prompt: "Which word matches 🍎?", choices: ["APPLE", "BREAD", "RICE"], correctChoice: "APPLE",
    picture: "🍎", semanticKey: "object.apple", spokenWord: "APPLE", successText: "APPLE matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-food-banana": {
    subjectId: "english", stageId: "english-words-actions", title: "Find BANANA",
    prompt: "Choose the word for 🍌.", choices: ["MILK", "BANANA", "APPLE"], correctChoice: "BANANA",
    picture: "🍌", spokenWord: "BANANA", successText: "BANANA matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-food-bread": {
    subjectId: "english", stageId: "english-words-actions", title: "Find BREAD",
    prompt: "Which word means bread?", choices: ["RICE", "BREAD", "MILK"], correctChoice: "BREAD",
    picture: "🍞", spokenWord: "BREAD", successText: "BREAD matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-action-run": {
    subjectId: "english", stageId: "english-words-actions", title: "Find RUN",
    prompt: "Which word means to run?", choices: ["RUN", "READ", "SLEEP"], correctChoice: "RUN",
    picture: "🏃", spokenWord: "RUN", successText: "RUN matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-action-jump": {
    subjectId: "english", stageId: "english-words-actions", title: "Find JUMP",
    prompt: "Choose the action JUMP.", choices: ["EAT", "JUMP", "READ"], correctChoice: "JUMP",
    picture: "🤸", semanticKey: "action.jump", spokenWord: "JUMP", successText: "JUMP matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  },
  "english-action-read": {
    subjectId: "english", stageId: "english-words-actions", title: "Find READ",
    prompt: "Which action is READ?", choices: ["SLEEP", "RUN", "READ"], correctChoice: "READ",
    picture: "📖", spokenWord: "READ", successText: "READ matches the picture.",
    locale: "en-US", domainVariant: "english_word_picture"
  }
};

function exactChoices(actual: string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && actual.every((choice, index) => choice === expected[index]);
}

export function pictureWordMatchConfig(activity: LearningActivity | undefined): PictureWordMatchConfig | null {
  if (!activity || activity.runtime !== "tap_choice") return null;
  const canonical = CANONICAL_PICTURE_WORD_MATCH[activity.id];
  if (!canonical) return null;

  if (
    activity.subjectId !== canonical.subjectId ||
    activity.stageId !== canonical.stageId ||
    activity.title !== canonical.title ||
    activity.prompt !== canonical.prompt ||
    !exactChoices(activity.choices ?? [], canonical.choices) ||
    activity.correctChoice !== canonical.correctChoice ||
    canonical.spokenWord !== canonical.correctChoice
  ) return null;

  return {
    picture: canonical.picture,
    spokenWord: canonical.spokenWord,
    successText: canonical.successText,
    locale: canonical.locale,
    domainVariant: canonical.domainVariant,
    semanticKey: canonical.semanticKey
  };
}
