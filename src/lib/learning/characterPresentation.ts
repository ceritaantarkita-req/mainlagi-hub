import type { CharacterId } from "./system";
import {
  resolveCharacterState,
  type CharacterPresentationState,
  type ResolvedCharacterRuntimeAsset
} from "./characterAssets";

export const CHARACTER_PRESENTATION_CONTEXTS = [
  "home",
  "subject",
  "activity",
  "activity_completion",
  "world_catalog",
  "world_map",
  "world_scene",
  "world_completion"
] as const;

export type CharacterPresentationContext = (typeof CHARACTER_PRESENTATION_CONTEXTS)[number];
export type CharacterPresentationSide = "left" | "right";
export type CharacterPresentationRole = "guide" | "companion";
export type BelajarCharacterMoment =
  | "entry"
  | "guide"
  | "waiting"
  | "correct"
  | "retry"
  | "completion";

export const BELAJAR_CHARACTER_STATE_BY_MOMENT: Readonly<Record<BelajarCharacterMoment, CharacterPresentationState>> = {
  entry: "welcome",
  guide: "pointing",
  waiting: "hero",
  correct: "correct",
  retry: "try_again",
  completion: "celebrate"
};

export function characterStateForBelajarMoment(moment: BelajarCharacterMoment): CharacterPresentationState {
  return BELAJAR_CHARACTER_STATE_BY_MOMENT[moment];
}

export type CharacterPresentationSource =
  | "authored"
  | "subject-preference"
  | "world-cast"
  | "approved-fallback";

export type CharacterPresentationSubjectId =
  | "bahasa"
  | "english"
  | "math"
  | "iqro"
  | "letters"
  | "logic"
  | "science"
  | "color"
  | "drawing";

export interface CharacterPresentationRequest {
  context: CharacterPresentationContext;
  subjectId?: string | null;
  worldId?: string | null;
  requestedState?: CharacterPresentationState | null;
  requestedCharacters?: readonly CharacterId[] | null;
  allowLegacyFallback?: boolean;
  allowIdentityFallback?: boolean;
}

export interface ResolvedPresentationCharacter {
  id: CharacterId;
  state: CharacterPresentationState;
  src: string;
  side: CharacterPresentationSide;
  role: CharacterPresentationRole;
  assetSource: ResolvedCharacterRuntimeAsset["source"];
}

export interface ResolvedCharacterPresentation {
  characters: readonly ResolvedPresentationCharacter[];
  source: CharacterPresentationSource;
  requestedState: CharacterPresentationState;
}

export const SUBJECT_CHARACTER_PAIRS: Readonly<
  Record<CharacterPresentationSubjectId, readonly [CharacterId, CharacterId]>
> = {
  bahasa: ["gavi", "paca"],
  english: ["naya", "zia"],
  math: ["gian", "paca"],
  iqro: ["gavi", "paca"],
  letters: ["gavi", "paca"],
  logic: ["gavi", "paca"],
  science: ["gavi", "paca"],
  color: ["gavi", "paca"],
  drawing: ["gavi", "paca"]
};

export const WORLD_CHARACTER_CASTS: Readonly<Record<string, readonly [CharacterId, CharacterId]>> = {
  "money-festival": ["gavi", "paca"]
};

const DEFAULT_CONTEXT_STATE: Readonly<Record<CharacterPresentationContext, CharacterPresentationState>> = {
  home: "hero",
  subject: "welcome",
  activity: "hero",
  activity_completion: "celebrate",
  world_catalog: "welcome",
  world_map: "pointing",
  world_scene: "hero",
  world_completion: "celebrate"
};

const LEGACY_IDENTITY_FALLBACK: readonly ["gavi", "paca"] = ["gavi", "paca"];

function isSubjectId(value: string | null | undefined): value is CharacterPresentationSubjectId {
  return Boolean(value && Object.prototype.hasOwnProperty.call(SUBJECT_CHARACTER_PAIRS, value));
}

function uniquePair(ids: readonly CharacterId[]): readonly CharacterId[] {
  const unique: CharacterId[] = [];
  for (const id of ids) {
    if (!unique.includes(id)) unique.push(id);
    if (unique.length === 2) break;
  }
  return unique;
}

function chooseCast(
  request: CharacterPresentationRequest
): { ids: readonly CharacterId[]; source: CharacterPresentationSource } {
  if (request.requestedCharacters?.length) {
    return { ids: uniquePair(request.requestedCharacters), source: "authored" };
  }

  if (isSubjectId(request.subjectId)) {
    return { ids: SUBJECT_CHARACTER_PAIRS[request.subjectId], source: "subject-preference" };
  }

  if (request.worldId && WORLD_CHARACTER_CASTS[request.worldId]) {
    return { ids: WORLD_CHARACTER_CASTS[request.worldId], source: "world-cast" };
  }

  if (request.context === "world_catalog" || request.context === "world_map" ||
      request.context === "world_scene" || request.context === "world_completion") {
    return { ids: [], source: "approved-fallback" };
  }

  return { ids: LEGACY_IDENTITY_FALLBACK, source: "approved-fallback" };
}

function resolveSlot(
  id: CharacterId,
  state: CharacterPresentationState,
  side: CharacterPresentationSide,
  role: CharacterPresentationRole,
  request: CharacterPresentationRequest,
  alreadyUsed: ReadonlySet<CharacterId>
): ResolvedPresentationCharacter | null {
  const resolved = resolveCharacterState(id, state, {
    allowLegacyFallback: request.allowLegacyFallback !== false
  });

  if (resolved) {
    return {
      id: resolved.id,
      state: resolved.state,
      src: resolved.src,
      side,
      role,
      assetSource: resolved.source
    };
  }

  if (request.allowIdentityFallback === false) return null;

  for (const fallbackId of LEGACY_IDENTITY_FALLBACK) {
    if (alreadyUsed.has(fallbackId)) continue;
    const fallback = resolveCharacterState(fallbackId, state, {
      allowLegacyFallback: request.allowLegacyFallback !== false
    });
    if (fallback) {
      return {
        id: fallback.id,
        state: fallback.state,
        src: fallback.src,
        side,
        role,
        assetSource: fallback.source
      };
    }
  }

  return null;
}

/**
 * Shared presentation-only resolver.
 *
 * It chooses character/cast/state based only on presentation context. It must
 * never inspect answer keys, mastery, progression, evidence or unrelated child
 * data.
 */
export function resolveCharacterPresentation(
  request: CharacterPresentationRequest
): ResolvedCharacterPresentation {
  const requestedState = request.requestedState ?? DEFAULT_CONTEXT_STATE[request.context];
  const cast = chooseCast(request);
  const characters: ResolvedPresentationCharacter[] = [];
  const used = new Set<CharacterId>();
  let fallbackUsed = false;

  for (let index = 0; index < cast.ids.length && index < 2; index += 1) {
    const side: CharacterPresentationSide = index === 0 ? "left" : "right";
    const role: CharacterPresentationRole = index === 0 ? "guide" : "companion";
    const requestedId = cast.ids[index];
    const resolved = resolveSlot(requestedId, requestedState, side, role, request, used);
    if (!resolved || used.has(resolved.id)) continue;
    if (resolved.id !== requestedId || resolved.assetSource === "legacy-webp") fallbackUsed = true;
    used.add(resolved.id);
    characters.push(resolved);
  }

  return {
    characters,
    source: fallbackUsed ? "approved-fallback" : cast.source,
    requestedState
  };
}
