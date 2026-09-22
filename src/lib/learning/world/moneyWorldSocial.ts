export const MONEY_WORLD_SOCIAL_CARD_VERSION = "money-world-social-card-v1";

export const MONEY_WORLD_SOCIAL_CARD = {
  version: MONEY_WORLD_SOCIAL_CARD_VERSION,
  path: "/worlds/money-festival/social-card",
  width: 1200,
  height: 630,
  title: "Petualangan Uang",
  kicker: "Mainlagi World",
  description: "Temani Gavi dan Paca belajar tentang harga, pilihan, menabung, dan risiko lewat cerita serta mini-game.",
  alt: "Petualangan Uang — Mainlagi World",
  publicSafe: true,
  containsChildProgress: false,
  containsAccountIdentity: false
} as const;

export function validateMoneyWorldSocialCard(): { valid: boolean; errors: readonly string[] } {
  const errors: string[] = [];

  if (MONEY_WORLD_SOCIAL_CARD.width !== 1200 || MONEY_WORLD_SOCIAL_CARD.height !== 630) {
    errors.push("social card must remain 1200x630");
  }
  if (!MONEY_WORLD_SOCIAL_CARD.path.startsWith("/worlds/money-festival/")) {
    errors.push("social card route must stay inside the public Petualangan Uang surface");
  }
  if (!MONEY_WORLD_SOCIAL_CARD.title.trim() || !MONEY_WORLD_SOCIAL_CARD.description.trim()) {
    errors.push("social card title/description must not be empty");
  }
  if (!MONEY_WORLD_SOCIAL_CARD.publicSafe) {
    errors.push("social card must remain public-safe");
  }
  if (MONEY_WORLD_SOCIAL_CARD.containsChildProgress || MONEY_WORLD_SOCIAL_CARD.containsAccountIdentity) {
    errors.push("social card must not contain child progress or account identity");
  }
  if (/demo-gian|child[_ -]?id|account[_ -]?id|mastery|progress/i.test(
    MONEY_WORLD_SOCIAL_CARD.title + " " + MONEY_WORLD_SOCIAL_CARD.description + " " + MONEY_WORLD_SOCIAL_CARD.alt
  )) {
    errors.push("social card public copy contains private/progress terminology");
  }

  return { valid: errors.length === 0, errors };
}

export const MONEY_WORLD_SOCIAL_CARD_VALIDATION = validateMoneyWorldSocialCard();
