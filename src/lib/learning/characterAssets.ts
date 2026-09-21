import type { CharacterId } from "./system";

export type CharacterAssetLifecycle = "approved" | "reference-only";

export interface CharacterAssetRecord {
  id: CharacterId;
  lifecycle: CharacterAssetLifecycle;
  runtimeSrc: string | null;
  referenceAsset: string | null;
}

/**
 * Canonical activity-foreground asset gate.
 *
 * A character may render in the activity layer only when this registry marks
 * the asset approved and exposes a concrete runtimeSrc. Design sheets and
 * profile-avatar fallbacks are references only and must never be promoted
 * implicitly.
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

export function approvedCharacterRuntimeSrc(id: CharacterId): string | null {
  const record = CHARACTER_ASSET_REGISTRY[id];
  return record.lifecycle === "approved" ? record.runtimeSrc : null;
}
