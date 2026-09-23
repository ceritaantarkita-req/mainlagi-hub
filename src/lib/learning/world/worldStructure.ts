export const WORLD_STRUCTURE_CONTRACT_VERSION = "world-structure-v1";

export type WorldSceneKind =
  | "story"
  | "challenge"
  | "choice"
  | "recap"
  | "closing";

export interface CanonicalWorldDefinition {
  id: string;
  version: string;
  title: string;
  chapterIds: readonly string[];
}

export interface CanonicalWorldChapterDefinition {
  id: string;
  worldId: string;
  order: number;
  title: string;
  stageIds: readonly string[];
}

export interface CanonicalWorldStageDefinition {
  id: string;
  chapterId: string;
  order: number;
  sceneIds: readonly string[];
}

export interface CanonicalWorldSceneDefinition {
  id: string;
  stageId: string;
  order: number;
  kind: WorldSceneKind;
  title: string;
  segmentIds: readonly string[];
}

export interface CanonicalWorldStructure {
  contractVersion: typeof WORLD_STRUCTURE_CONTRACT_VERSION;
  world: CanonicalWorldDefinition;
  chapters: readonly CanonicalWorldChapterDefinition[];
  stages: readonly CanonicalWorldStageDefinition[];
  scenes: readonly CanonicalWorldSceneDefinition[];
}

export interface CanonicalWorldValidationInput {
  segmentIdsByStage: Readonly<Record<string, readonly string[]>>;
}

export interface CanonicalWorldValidationResult {
  valid: boolean;
  errors: readonly string[];
}

function duplicateIds(ids: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return [...duplicates];
}

function equalOrder(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

export function flattenWorldStageSegmentIds(
  structure: CanonicalWorldStructure,
  stageId: string
): string[] {
  const stage = structure.stages.find((item) => item.id === stageId);
  if (!stage) return [];

  const sceneById = new Map(structure.scenes.map((scene) => [scene.id, scene] as const));
  return stage.sceneIds.flatMap((sceneId) => sceneById.get(sceneId)?.segmentIds ?? []);
}

export function getWorldSceneForSegment(
  structure: CanonicalWorldStructure,
  stageId: string,
  segmentId: string
): CanonicalWorldSceneDefinition | undefined {
  const stage = structure.stages.find((item) => item.id === stageId);
  if (!stage) return undefined;
  const stageSceneIds = new Set(stage.sceneIds);
  return structure.scenes.find(
    (scene) =>
      stageSceneIds.has(scene.id) &&
      scene.stageId === stageId &&
      scene.segmentIds.includes(segmentId)
  );
}

export function validateCanonicalWorldStructure(
  structure: CanonicalWorldStructure,
  input: CanonicalWorldValidationInput
): CanonicalWorldValidationResult {
  const errors: string[] = [];

  if (structure.contractVersion !== WORLD_STRUCTURE_CONTRACT_VERSION) {
    errors.push("contract version mismatch");
  }

  const chapterIds = structure.chapters.map((chapter) => chapter.id);
  const stageIds = structure.stages.map((stage) => stage.id);
  const sceneIds = structure.scenes.map((scene) => scene.id);

  for (const duplicate of duplicateIds(chapterIds)) errors.push("duplicate chapter id: " + duplicate);
  for (const duplicate of duplicateIds(stageIds)) errors.push("duplicate stage id: " + duplicate);
  for (const duplicate of duplicateIds(sceneIds)) errors.push("duplicate scene id: " + duplicate);

  const orderedChapters = [...structure.chapters].sort((a, b) => a.order - b.order);
  if (!orderedChapters.every((chapter, index) => chapter.order === index + 1)) {
    errors.push("chapter order must be contiguous from 1");
  }
  if (!equalOrder(structure.world.chapterIds, orderedChapters.map((chapter) => chapter.id))) {
    errors.push("world.chapterIds must match chapter order exactly");
  }

  const orderedStages = [...structure.stages].sort((a, b) => a.order - b.order);
  if (!orderedStages.every((stage, index) => stage.order === index + 1)) {
    errors.push("stage order must be contiguous from 1 across the World");
  }

  for (const chapter of structure.chapters) {
    if (chapter.worldId !== structure.world.id) {
      errors.push("chapter " + chapter.id + " points to another world");
    }
    const expectedChapterStages = structure.stages
      .filter((stage) => stage.chapterId === chapter.id)
      .sort((a, b) => a.order - b.order)
      .map((stage) => stage.id);
    if (!equalOrder(chapter.stageIds, expectedChapterStages)) {
      errors.push("chapter " + chapter.id + " stageIds do not match canonical stage order");
    }
  }

  const referencedStageIds = structure.chapters.flatMap((chapter) => [...chapter.stageIds]);
  for (const duplicate of duplicateIds(referencedStageIds)) {
    errors.push("stage referenced by multiple chapters: " + duplicate);
  }
  for (const stageId of stageIds) {
    if (!referencedStageIds.includes(stageId)) errors.push("orphan stage: " + stageId);
  }

  for (const stage of structure.stages) {
    const stageScenes = structure.scenes
      .filter((scene) => scene.stageId === stage.id)
      .sort((a, b) => a.order - b.order);

    if (!equalOrder(stage.sceneIds, stageScenes.map((scene) => scene.id))) {
      errors.push("stage " + stage.id + " sceneIds do not match canonical scene order");
    }

    const expectedOrders = stageScenes.map((_, index) => index + 1);
    if (!stageScenes.every((scene, index) => scene.order === expectedOrders[index])) {
      errors.push("stage " + stage.id + " scene order must be contiguous from 1");
    }

    if (stageScenes.some((scene) => scene.segmentIds.length === 0)) {
      errors.push("stage " + stage.id + " has an empty scene");
    }

    const flattened = stageScenes.flatMap((scene) => [...scene.segmentIds]);
    for (const duplicate of duplicateIds(flattened)) {
      errors.push("segment appears in multiple scenes in " + stage.id + ": " + duplicate);
    }

    const expected = input.segmentIdsByStage[stage.id] ?? [];
    if (!equalOrder(flattened, expected)) {
      errors.push("stage " + stage.id + " scene coverage/order does not match source segments");
    }
  }

  const allSegmentIds = structure.scenes.flatMap((scene) => [...scene.segmentIds]);
  for (const duplicate of duplicateIds(allSegmentIds)) {
    errors.push("segment id is not globally unique: " + duplicate);
  }

  for (const scene of structure.scenes) {
    if (!stageIds.includes(scene.stageId)) errors.push("orphan scene: " + scene.id);
  }

  for (const stageId of Object.keys(input.segmentIdsByStage)) {
    if (!stageIds.includes(stageId)) errors.push("segment registry has unknown stage: " + stageId);
  }

  return { valid: errors.length === 0, errors };
}
