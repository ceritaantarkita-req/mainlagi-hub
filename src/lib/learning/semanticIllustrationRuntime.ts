import registryJson from "../data/learning-illustration-asset-provenance.json";

type RuntimeRegistryRecord = {
  lifecycle: string;
  fallbackGlyph: string;
  provenance?: {
    redistributionAllowed?: boolean;
  };
  semanticReview?: {
    status?: string;
    childReadable?: boolean | null;
  };
  productionAssets?: {
    svg?: {
      status?: string;
      format?: string;
      path?: string | null;
      sha256?: string | null;
    } | null;
  };
};

type RuntimeRegistry = {
  productionDirectory: string;
  preferredProductionFormat: string;
  runtimeActivation: string;
  items: Record<string, RuntimeRegistryRecord>;
};

const registry = registryJson as unknown as RuntimeRegistry;

export type LearningSemanticIllustrationKey = keyof typeof registryJson.items;

export type ResolvedLearningSemanticIllustration = {
  semanticKey: LearningSemanticIllustrationKey;
  src: string;
  sha256: string;
  fallbackGlyph: string;
};

export function learningSemanticRuntimeActivation() {
  return registry.runtimeActivation;
}

export function resolveLearningSemanticIllustration(
  semanticKey: LearningSemanticIllustrationKey | string | null | undefined,
  fallbackGlyph?: string | null
): ResolvedLearningSemanticIllustration | null {
  if (
    registry.runtimeActivation !== "controlled-svg" ||
    registry.preferredProductionFormat !== "svg" ||
    !semanticKey
  ) {
    return null;
  }

  const record = registry.items[semanticKey];
  if (!record) return null;
  if (fallbackGlyph != null && record.fallbackGlyph !== fallbackGlyph) return null;

  const svg = record.productionAssets?.svg;
  if (
    record.lifecycle !== "approved" ||
    record.provenance?.redistributionAllowed !== true ||
    record.semanticReview?.status !== "approved" ||
    record.semanticReview?.childReadable !== true ||
    svg?.status !== "approved" ||
    svg.format !== "svg" ||
    typeof svg.path !== "string" ||
    !svg.path.startsWith(`${registry.productionDirectory}/`) ||
    !svg.path.endsWith(".svg") ||
    typeof svg.sha256 !== "string" ||
    !/^[a-f0-9]{64}$/.test(svg.sha256)
  ) {
    return null;
  }

  return {
    semanticKey: semanticKey as LearningSemanticIllustrationKey,
    src: svg.path,
    sha256: svg.sha256,
    fallbackGlyph: record.fallbackGlyph
  };
}
