export type MoneyWorldAssetStatus =
  | "approved-reused"
  | "temporary-runtime"
  | "production-ready"
  | "production-needed";

export interface MoneyWorldAssetSlot {
  id: string;
  kind: "background" | "mascot" | "character" | "audio" | "social-card";
  status: MoneyWorldAssetStatus;
  currentSource: string;
  usedIn: readonly string[];
  finalRequirement: string;
}

export const MONEY_WORLD_ASSET_PLAN_VERSION = "money-world-assets-v2";

export const MONEY_WORLD_RUNTIME_CHARACTER_POLICY = {
  version: "money-world-shared-character-runtime-v2",
  mode: "shared-approved-svg-cast",
  worldId: "money-festival",
  cast: ["gavi", "paca"] as const,
  storyRoleToRuntimeCharacter: {
    Gian: "gavi",
    Naya: "paca"
  },
  finalHumanCharactersActivated: false,
  rationale: "Petualangan Uang keeps its authored Gavi/Paca cast and now resolves every World character presentation through the shared approved SVG character runtime."
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
    currentSource: "/artwork/characters/paca-hero-v1.svg",
    usedIn: ["world-hero", "stage-shell", "stage-ambience"],
    finalRequirement: "Approved shared character hero SVG retained for ambient presentation; authored World character states resolve through characterPresentation.ts."
  },
  {
    id: "gavi-ambient",
    kind: "mascot",
    status: "approved-reused",
    currentSource: "/artwork/characters/gavi-hero-v1.svg",
    usedIn: ["world-hero", "stage-shell", "stage-ambience"],
    finalRequirement: "Approved shared character hero SVG retained for ambient presentation; authored World character states resolve through characterPresentation.ts."
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
    status: "production-ready",
    currentSource: "dynamic ImageResponse route /worlds/money-festival/social-card",
    usedIn: ["/worlds/money-festival"],
    finalRequirement: "Keep the dedicated 1200x630 card public-safe, child/account-progress free, and aligned with the active World presentation identity."
  }
] as const;

export const MONEY_WORLD_REUSED_PUBLIC_ASSET_PATHS = MONEY_WORLD_ASSET_SLOTS
  .filter((slot) => slot.status === "approved-reused" && slot.currentSource.startsWith("/"))
  .map((slot) => "public" + slot.currentSource);

export const MONEY_WORLD_PRODUCTION_GAPS = MONEY_WORLD_ASSET_SLOTS
  .filter((slot) => slot.status !== "approved-reused" && slot.status !== "production-ready")
  .map((slot) => slot.id);
