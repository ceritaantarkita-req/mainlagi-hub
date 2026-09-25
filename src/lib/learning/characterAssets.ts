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

export type CharacterAssetLifecycle = "approved" | "reference-only";
export type CharacterRuntimeAssetSource = "svg-state" | "legacy-webp";

export interface CharacterAssetRecord {
  id: CharacterId;
  lifecycle: CharacterAssetLifecycle;
  runtimeSrc: string | null;
  referenceAsset: string | null;
}

export interface CharacterStateRuntimeAsset {
  id: CharacterId;
  state: CharacterPresentationState;
  src: string;
  lifecycle: "approved";
  source: "svg-state";
}

export interface LegacyCharacterRuntimeAsset {
  id: "gavi" | "paca";
  state: "hero";
  src: string;
  lifecycle: "approved";
  source: "legacy-webp";
}

export type ResolvedCharacterRuntimeAsset = CharacterStateRuntimeAsset | LegacyCharacterRuntimeAsset;

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

/**
 * Historical compatibility gate used by the pre-SVG Belajar presentation.
 *
 * Keep this behavior unchanged until Session 06 deliberately migrates Belajar
 * to the shared state-aware resolver. This prevents Session 05 from changing
 * live subject pairings merely by introducing the new runtime foundation.
 */
export const CHARACTER_ASSET_REGISTRY: Readonly<Record<CharacterId, CharacterAssetRecord>> = {
  naya: {
    id: "naya",
    lifecycle: "reference-only",
    runtimeSrc: null,
    referenceAsset: "kak-naya-character-design-set-v1.png"
  },
  gian: {
    id: "gian",
    lifecycle: "reference-only",
    runtimeSrc: null,
    referenceAsset: "gian-character-design-set-v1.png"
  },
  zia: {
    id: "zia",
    lifecycle: "reference-only",
    runtimeSrc: null,
    referenceAsset: "zia-character-design-set-v1.png"
  },
  paca: {
    id: "paca",
    lifecycle: "approved",
    runtimeSrc: "/artwork/garden-paca.webp",
    referenceAsset: null
  },
  gavi: {
    id: "gavi",
    lifecycle: "approved",
    runtimeSrc: "/artwork/garden-gavi.webp",
    referenceAsset: null
  }
};

export function approvedCharacterRuntimeAsset(
  id: CharacterId,
  state: CharacterPresentationState
): CharacterStateRuntimeAsset | null {
  const record = CHARACTER_STATE_ASSET_REGISTRY[id]?.[state];
  return record?.lifecycle === "approved" ? record : null;
}

export function approvedLegacyCharacterRuntimeAsset(
  id: CharacterId
): LegacyCharacterRuntimeAsset | null {
  if (id !== "gavi" && id !== "paca") return null;
  const record = CHARACTER_ASSET_REGISTRY[id];
  if (record.lifecycle !== "approved" || !record.runtimeSrc) return null;
  return {
    id,
    state: "hero",
    src: record.runtimeSrc,
    lifecycle: "approved",
    source: "legacy-webp"
  };
}

/**
 * Same-identity state fallback:
 * requested approved state -> hero -> welcome -> same-character legacy
 * Gavi/Paca compatibility asset -> null.
 *
 * Cross-identity fallback (for example unavailable Naya -> Gavi) belongs to
 * characterPresentation.ts because that is a presentation/cast decision.
 */
export function resolveCharacterState(
  id: CharacterId,
  requestedState: CharacterPresentationState,
  options: { allowLegacyFallback?: boolean } = {}
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

  if (options.allowLegacyFallback !== false) {
    return approvedLegacyCharacterRuntimeAsset(id);
  }

  return null;
}

/**
 * Pre-SVG compatibility API. Session 06 owns its migration/removal.
 */
export function approvedCharacterRuntimeSrc(id: CharacterId): string | null {
  const record = CHARACTER_ASSET_REGISTRY[id];
  return record.lifecycle === "approved" ? record.runtimeSrc : null;
}

export function isCharacterPresentationState(value: string): value is CharacterPresentationState {
  return (CHARACTER_PRESENTATION_STATES as readonly string[]).includes(value);
}

export function isCanonicalCharacterId(value: string): value is CharacterId {
  return (CHARACTER_IDS as readonly string[]).includes(value);
}
