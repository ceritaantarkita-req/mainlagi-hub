export type MoneyWorldAssetStatus =
  | "approved-reused"
  | "temporary-runtime"
  | "production-needed";

export interface MoneyWorldAssetSlot {
  id: string;
  kind: "background" | "mascot" | "character" | "audio" | "social-card";
  status: MoneyWorldAssetStatus;
  currentSource: string;
  usedIn: readonly string[];
  finalRequirement: string;
}

export const MONEY_WORLD_ASSET_PLAN_VERSION = "money-world-assets-v1";

export const MONEY_WORLD_RUNTIME_CHARACTER_POLICY = {
  version: "money-world-runtime-character-dummy-v1",
  mode: "approved-mascot-dummy",
  storyRoleToRuntimeCharacter: {
    Gian: "gavi",
    Naya: "paca"
  },
  finalHumanCharactersActivated: false,
  rationale: "Character development is paused. Use approved Gavi/Paca production assets to validate the World shell without activating fallback human artwork."
} as const;

export const MONEY_WORLD_ASSET_SLOTS: readonly MoneyWorldAssetSlot[] = [
  {
    id: "world-hero-warung",
    kind: "background",
    status: "approved-reused",
    currentSource: "/artwork/math-warung.webp",
    usedIn: ["world-hero", "money-stage-03-income-sources"],
    finalRequirement: "May remain reused if final World art review accepts the visual continuity."
  },
  {
    id: "world-map-garden",
    kind: "background",
    status: "approved-reused",
    currentSource: "/artwork/garden-background.webp",
    usedIn: ["world-map", "money-stage-06-investment-intro", "money-stage-08-final-festival"],
    finalRequirement: "Replace only if a dedicated Festival journey map is commissioned and approved."
  },
  {
    id: "stage-01-playground-wide",
    kind: "background",
    status: "approved-reused",
    currentSource: "/artwork/backgrounds/math/playground-park-wide.webp",
    usedIn: ["money-stage-01-money-use"],
    finalRequirement: "Keep a concrete outdoor/home-adjacent opening scene."
  },
  {
    id: "stage-01-playground-mobile",
    kind: "background",
    status: "approved-reused",
    currentSource: "/artwork/backgrounds/math/playground-park-mobile.webp",
    usedIn: ["money-stage-01-money-use"],
    finalRequirement: "Mobile crop must preserve action space for character + activity tray."
  },
  {
    id: "stage-market-wide",
    kind: "background",
    status: "approved-reused",
    currentSource: "/artwork/backgrounds/math/mini-market-wide.webp",
    usedIn: ["money-stage-02-price-change", "money-stage-04-needs-wants"],
    finalRequirement: "Price labels and shopping props must remain readable without decorative clutter."
  },
  {
    id: "stage-market-mobile",
    kind: "background",
    status: "approved-reused",
    currentSource: "/artwork/backgrounds/math/mini-market-mobile.webp",
    usedIn: ["money-stage-02-price-change", "money-stage-04-needs-wants"],
    finalRequirement: "Mobile crop must leave a clear gameplay zone."
  },
  {
    id: "stage-saving-park-wide",
    kind: "background",
    status: "approved-reused",
    currentSource: "/artwork/backgrounds/math/number-park-wide.webp",
    usedIn: ["money-stage-05-saving"],
    finalRequirement: "If replaced, preserve a calm saving-goal scene rather than a finance dashboard."
  },
  {
    id: "stage-saving-park-mobile",
    kind: "background",
    status: "approved-reused",
    currentSource: "/artwork/backgrounds/math/number-park-mobile.webp",
    usedIn: ["money-stage-05-saving"],
    finalRequirement: "Mobile crop must preserve touch-safe foreground space."
  },
  {
    id: "paca-ambient",
    kind: "mascot",
    status: "approved-reused",
    currentSource: "/artwork/garden-paca.webp",
    usedIn: ["world-hero", "stage-shell", "stage-ambience", "temporary-naya-story-role"],
    finalRequirement: "Approved pilot mascot. May temporarily present the Naya story role while human character production remains paused."
  },
  {
    id: "gavi-ambient",
    kind: "mascot",
    status: "approved-reused",
    currentSource: "/artwork/garden-gavi.webp",
    usedIn: ["world-hero", "stage-shell", "stage-ambience", "temporary-gian-story-role"],
    finalRequirement: "Approved pilot mascot. May temporarily present the Gian story role while human character production remains paused."
  },
  {
    id: "gian-foreground",
    kind: "character",
    status: "production-needed",
    currentSource: "Gian story role -> approved Gavi runtime dummy; no Gian production binary activated",
    usedIn: ["narrative", "concept", "payoff"],
    finalRequirement: "Approved foreground character set with consistent pose scale, expression system, and transparent background."
  },
  {
    id: "naya-foreground",
    kind: "character",
    status: "production-needed",
    currentSource: "Naya story role -> approved Paca runtime dummy; no Naya production binary activated",
    usedIn: ["narrative", "concept", "payoff"],
    finalRequirement: "Approved foreground character set matching Gian/Paca/Gavi visual universe."
  },
  {
    id: "fixed-narration",
    kind: "audio",
    status: "temporary-runtime",
    currentSource: "moneyWorldNarrationProduction.ts review manifest -> fixed MP3 when approved -> browser speech fail-safe",
    usedIn: ["narrative", "concept", "payoff", "activity-prompt"],
    finalRequirement: "Approve all deterministic cue assets with copy/speaker/source/rights/pronunciation/pacing/loudness/mobile review before productionReady can become true."
  },
  {
    id: "public-share-card",
    kind: "social-card",
    status: "temporary-runtime",
    currentSource: "/og/math-warung.png",
    usedIn: ["/worlds/money-festival"],
    finalRequirement: "Dedicated public-safe Petualangan Uang social card after World visual identity is locked."
  }
] as const;

export const MONEY_WORLD_REUSED_PUBLIC_ASSET_PATHS = MONEY_WORLD_ASSET_SLOTS
  .filter((slot) => slot.currentSource.startsWith("/"))
  .map((slot) => "public" + slot.currentSource);

export const MONEY_WORLD_PRODUCTION_GAPS = MONEY_WORLD_ASSET_SLOTS
  .filter((slot) => slot.status !== "approved-reused")
  .map((slot) => slot.id);
