import { MONEY_WORLD_STAGES } from "./moneyWorld";
import { getMoneyWorldScenes } from "./moneyWorldStructure";

export const MONEY_WORLD_PILOT_CONTRACT_VERSION = "money-world-pilot-v1";

export interface MoneyWorldPilotStageProduction {
  stageId: string;
  backgroundWide: string;
  backgroundMobile: string;
  ambience: readonly [string, string, string];
  runtimeStatus: "pilot-runtime-covered";
  assetStatus: "approved-reused";
}

export const MONEY_WORLD_PILOT_STAGES: readonly MoneyWorldPilotStageProduction[] = [
  {
    stageId: "money-stage-01-money-use",
    backgroundWide: "/artwork/backgrounds/math/playground-park-wide.webp",
    backgroundMobile: "/artwork/backgrounds/math/playground-park-mobile.webp",
    ambience: ["🏠", "🎈", "🧃"],
    runtimeStatus: "pilot-runtime-covered",
    assetStatus: "approved-reused"
  },
  {
    stageId: "money-stage-02-price-change",
    backgroundWide: "/artwork/backgrounds/math/mini-market-wide.webp",
    backgroundMobile: "/artwork/backgrounds/math/mini-market-mobile.webp",
    ambience: ["🏪", "🤖", "🏷️"],
    runtimeStatus: "pilot-runtime-covered",
    assetStatus: "approved-reused"
  },
  {
    stageId: "money-stage-03-income-sources",
    backgroundWide: "/artwork/math-warung.webp",
    backgroundMobile: "/artwork/math-warung.webp",
    ambience: ["🥖", "🌱", "🚲"],
    runtimeStatus: "pilot-runtime-covered",
    assetStatus: "approved-reused"
  },
  {
    stageId: "money-stage-04-needs-wants",
    backgroundWide: "/artwork/backgrounds/math/mini-market-wide.webp",
    backgroundMobile: "/artwork/backgrounds/math/mini-market-mobile.webp",
    ambience: ["🛒", "💧", "🍎"],
    runtimeStatus: "pilot-runtime-covered",
    assetStatus: "approved-reused"
  },
  {
    stageId: "money-stage-05-saving",
    backgroundWide: "/artwork/backgrounds/math/number-park-wide.webp",
    backgroundMobile: "/artwork/backgrounds/math/number-park-mobile.webp",
    ambience: ["🌳", "🐷", "🎯"],
    runtimeStatus: "pilot-runtime-covered",
    assetStatus: "approved-reused"
  },
  {
    stageId: "money-stage-06-investment-intro",
    backgroundWide: "/artwork/garden-background.webp",
    backgroundMobile: "/artwork/garden-background.webp",
    ambience: ["🌱", "↗️", "🪙"],
    runtimeStatus: "pilot-runtime-covered",
    assetStatus: "approved-reused"
  },
  {
    stageId: "money-stage-07-risk",
    backgroundWide: "/artwork/backgrounds/math/playground-park-wide.webp",
    backgroundMobile: "/artwork/backgrounds/math/playground-park-mobile.webp",
    ambience: ["🌉", "⬆️", "⬇️"],
    runtimeStatus: "pilot-runtime-covered",
    assetStatus: "approved-reused"
  },
  {
    stageId: "money-stage-08-final-festival",
    backgroundWide: "/artwork/garden-background.webp",
    backgroundMobile: "/artwork/garden-background.webp",
    ambience: ["🎪", "🎀", "🎉"],
    runtimeStatus: "pilot-runtime-covered",
    assetStatus: "approved-reused"
  }
] as const;

const PILOT_STAGE_BY_ID = new Map(MONEY_WORLD_PILOT_STAGES.map((stage) => [stage.stageId, stage] as const));

export function getMoneyWorldPilotStage(stageId: string): MoneyWorldPilotStageProduction | undefined {
  return PILOT_STAGE_BY_ID.get(stageId);
}

export function validateMoneyWorldPilotProduction(): { valid: boolean; errors: readonly string[] } {
  const errors: string[] = [];
  const canonicalStageIds = MONEY_WORLD_STAGES.map((stage) => stage.id);
  const productionStageIds = MONEY_WORLD_PILOT_STAGES.map((stage) => stage.stageId);

  if (new Set(productionStageIds).size !== productionStageIds.length) {
    errors.push("pilot production stage IDs must be unique");
  }

  if (
    canonicalStageIds.length !== productionStageIds.length ||
    !canonicalStageIds.every((stageId, index) => productionStageIds[index] === stageId)
  ) {
    errors.push("pilot production manifest must cover all canonical Stages in exact order");
  }

  for (const stage of MONEY_WORLD_PILOT_STAGES) {
    const scenes = getMoneyWorldScenes(stage.stageId);
    if (!stage.backgroundWide.startsWith("/") || !stage.backgroundMobile.startsWith("/")) {
      errors.push(stage.stageId + " must use repository-owned background paths");
    }
    if (stage.ambience.length !== 3 || stage.ambience.some((item) => !item.trim())) {
      errors.push(stage.stageId + " must keep exactly three non-empty ambience props");
    }
    if (!scenes.length) {
      errors.push(stage.stageId + " must have authored Scenes");
      continue;
    }
    if (scenes[0]?.kind !== "story") {
      errors.push(stage.stageId + " must begin with a story Scene");
    }
    if (!scenes.some((scene) => scene.kind === "challenge")) {
      errors.push(stage.stageId + " must include at least one challenge Scene");
    }
    if (scenes.at(-1)?.kind !== "closing") {
      errors.push(stage.stageId + " must end with a closing Scene");
    }
  }

  const finalScenes = getMoneyWorldScenes("money-stage-08-final-festival");
  if (!finalScenes.some((scene) => scene.kind === "choice")) {
    errors.push("final Stage must include the authored child-choice Scene");
  }
  if (!finalScenes.some((scene) => scene.kind === "recap")) {
    errors.push("final Stage must include the authored recap Scene");
  }

  return { valid: errors.length === 0, errors };
}

export const MONEY_WORLD_PILOT_PRODUCTION_VALIDATION = validateMoneyWorldPilotProduction();
