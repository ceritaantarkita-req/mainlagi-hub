import {
  MONEY_WORLD_ID,
  MONEY_WORLD_STAGES,
  getMoneyWorldSegments
} from "./moneyWorld";

export type MoneyWorldNarrationSpeaker = "Gian" | "Naya";
export type MoneyWorldNarrationKind =
  | "narrative"
  | "concept"
  | "payoff"
  | "activity_prompt"
  | "story_choice_prompt";
export type MoneyWorldNarrationStatus = "fallback-runtime" | "production-ready";

export interface MoneyWorldNarrationCue {
  id: string;
  stageId: string;
  kind: MoneyWorldNarrationKind;
  speaker: MoneyWorldNarrationSpeaker;
  locale: "id-ID";
  text: string;
  status: MoneyWorldNarrationStatus;
  productionSrc: string | null;
  expectedProductionSrc: string;
  fallback: "browser-speech";
}

export const MONEY_WORLD_NARRATION_CONTRACT_VERSION = "money-world-narration-v1";
export const MONEY_WORLD_NARRATION_LOCALE = "id-ID" as const;
export const MONEY_WORLD_NARRATION_PRODUCTION_READY = false;

function expectedProductionSrc(id: string): string {
  return `/audio/world/${MONEY_WORLD_ID}/${MONEY_WORLD_NARRATION_LOCALE}/${id}.mp3`;
}

function fallbackCue(args: {
  id: string;
  stageId: string;
  kind: MoneyWorldNarrationKind;
  speaker: MoneyWorldNarrationSpeaker;
  text: string;
}): MoneyWorldNarrationCue {
  return {
    ...args,
    locale: MONEY_WORLD_NARRATION_LOCALE,
    status: "fallback-runtime",
    productionSrc: null,
    expectedProductionSrc: expectedProductionSrc(args.id),
    fallback: "browser-speech"
  };
}

function buildMoneyWorldNarrationCues(): MoneyWorldNarrationCue[] {
  const cues: MoneyWorldNarrationCue[] = [];

  for (const stage of MONEY_WORLD_STAGES) {
    for (const segment of getMoneyWorldSegments(stage.id)) {
      if (segment.type === "activity") {
        const text = segment.activity.payload.prompt?.trim();
        if (!text) continue;
        cues.push(fallbackCue({
          id: segment.activity.id + "-prompt",
          stageId: stage.id,
          kind: "activity_prompt",
          speaker: "Naya",
          text
        }));
        continue;
      }

      if (segment.type === "narrative_choice") {
        cues.push(fallbackCue({
          id: segment.id + "-prompt",
          stageId: stage.id,
          kind: "story_choice_prompt",
          speaker: "Naya",
          text: segment.prompt
        }));
        continue;
      }

      if (segment.type === "recap") continue;

      cues.push(fallbackCue({
        id: segment.id,
        stageId: stage.id,
        kind: segment.type,
        speaker: segment.speaker,
        text: segment.text
      }));
    }
  }

  return cues;
}

export const MONEY_WORLD_NARRATION_CUES = Object.freeze(buildMoneyWorldNarrationCues());

export const MONEY_WORLD_NARRATION_BY_ID: ReadonlyMap<string, MoneyWorldNarrationCue> =
  new Map(MONEY_WORLD_NARRATION_CUES.map((cue) => [cue.id, cue]));

export function getMoneyWorldNarrationCue(id: string): MoneyWorldNarrationCue | undefined {
  return MONEY_WORLD_NARRATION_BY_ID.get(id);
}
