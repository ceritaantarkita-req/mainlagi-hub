import type { CharacterId } from "./system";

export const CHARACTER_PRESENTATION_STATES = [
  "hero",
  "welcome",
  "pointing",
  "thinking",
  "correct",
  "try_again",
  "celebrate"
] as const;

export type CharacterPresentationState = (typeof CHARACTER_PRESENTATION_STATES)[number];

export interface CharacterStateRuntimeAsset {
  id: CharacterId;
  state: CharacterPresentationState;
  src: string;
  lifecycle: "approved";
  source: "svg-state";
}

export type ResolvedCharacterRuntimeAsset = CharacterStateRuntimeAsset;

const CHARACTER_IDS: readonly CharacterId[] = ["naya", "gian", "zia", "paca", "gavi"];

function svgStatePath(id: CharacterId, state: CharacterPresentationState): string {
  return `/artwork/characters/${id}-${state.replaceAll("_", "-")}-v1.svg`;
}

function buildApprovedStateRegistry(
  id: CharacterId
): Readonly<Record<CharacterPresentationState, CharacterStateRuntimeAsset>> {
  return Object.fromEntries(
    CHARACTER_PRESENTATION_STATES.map((state) => [
      state,
      {
        id,
        state,
        src: svgStatePath(id, state),
        lifecycle: "approved" as const,
        source: "svg-state" as const
      }
    ])
  ) as Record<CharacterPresentationState, CharacterStateRuntimeAsset>;
}

/**
 * Canonical SVG state-bank runtime paths.
 *
 * Provenance approval itself remains machine-enforced by
 * src/lib/data/character-asset-provenance.json + validate-character-assets.mjs.
 * The character runtime regression cross-checks every path here against that
 * registry so a later provenance lifecycle change cannot drift silently.
 */
export const CHARACTER_STATE_ASSET_REGISTRY: Readonly<
  Record<CharacterId, Readonly<Record<CharacterPresentationState, CharacterStateRuntimeAsset>>>
> = {
  naya: buildApprovedStateRegistry("naya"),
  gian: buildApprovedStateRegistry("gian"),
  zia: buildApprovedStateRegistry("zia"),
  paca: buildApprovedStateRegistry("paca"),
  gavi: buildApprovedStateRegistry("gavi")
};

export function approvedCharacterRuntimeAsset(
  id: CharacterId,
  state: CharacterPresentationState
): CharacterStateRuntimeAsset | null {
  const record = CHARACTER_STATE_ASSET_REGISTRY[id]?.[state];
  return record?.lifecycle === "approved" ? record : null;
}

/**
 * Same-identity state fallback:
 * requested approved state -> hero -> welcome -> null.
 *
 * Cross-identity fallback (for example unavailable Naya -> Gavi) belongs to
 * characterPresentation.ts because that is a presentation/cast decision.
 */
export function resolveCharacterState(
  id: CharacterId,
  requestedState: CharacterPresentationState
): ResolvedCharacterRuntimeAsset | null {
  const requested = approvedCharacterRuntimeAsset(id, requestedState);
  if (requested) return requested;

  if (requestedState !== "hero") {
    const hero = approvedCharacterRuntimeAsset(id, "hero");
    if (hero) return hero;
  }

  if (requestedState !== "welcome") {
    const welcome = approvedCharacterRuntimeAsset(id, "welcome");
    if (welcome) return welcome;
  }

  return null;
}

export function isCharacterPresentationState(value: string): value is CharacterPresentationState {
  return (CHARACTER_PRESENTATION_STATES as readonly string[]).includes(value);
}

export function isCanonicalCharacterId(value: string): value is CharacterId {
  return (CHARACTER_IDS as readonly string[]).includes(value);
}
