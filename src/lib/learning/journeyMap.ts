import type { LearningAnalyticsSnapshot } from "./attempts";
import { getLearningPathsForSubject } from "./curriculum";
import {
  getSubjectStageReadiness,
  type StageReadinessStatus
} from "./insights";
import {
  getStage,
  getSubject,
  type LearningProgress,
  type LearningSubjectId
} from "./system";

export type JourneyMapPresentationState = "completed" | "current" | "open" | "locked";

export interface BelajarJourneyMapPath {
  id: string;
  order: number;
  title: string;
  description: string;
  stageIds: string[];
}

export interface BelajarJourneyMapStage {
  id: string;
  subjectId: LearningSubjectId;
  pathId: string;
  order: number;
  pathOrder: number;
  orderInPath: number;
  title: string;
  subtitle: string;
  emoji: string;
  href: string;
  activityCount: number;
  canonicalStatus: StageReadinessStatus;
  statusLabel: string;
  reason: string;
  presentationState: JourneyMapPresentationState;
  completed: boolean;
  current: boolean;
  open: boolean;
  locked: boolean;
  completionRatio: number;
  completedCount: number;
  requiredCount: number;
  evidenceReadiness: number;
  evidencedSkillCount: number;
  assessedSkillCount: number;
}

export interface BelajarJourneyMapModel {
  subjectId: LearningSubjectId;
  subjectTitle: string;
  subjectShortTitle: string;
  subjectEmoji: string;
  subjectDescription: string;
  subjectHref: string;
  pathIds: string[];
  paths: BelajarJourneyMapPath[];
  stages: BelajarJourneyMapStage[];
  currentStageId: string | null;
  completedStageCount: number;
  totalStageCount: number;
}

const SUBJECT_PRESENTATION_OVERRIDES: Readonly<
  Partial<Record<LearningSubjectId, { title: string; shortTitle: string }>>
> = Object.freeze({
  english: {
    title: "Bahasa Inggris",
    shortTitle: "Inggris"
  }
});

function childRouteBase(childId: string): string {
  const normalized = childId.trim();
  if (!normalized) throw new Error("Journey Map requires a non-empty childId");
  return `/child/${encodeURIComponent(normalized)}`;
}

function stagePresentationState(
  status: StageReadinessStatus,
  isCurrent: boolean
): JourneyMapPresentationState {
  if (status === "locked") return "locked";
  if (status === "ready") return "completed";
  return isCurrent ? "current" : "open";
}

function assertUnique(values: string[], label: string): void {
  if (new Set(values).size !== values.length) {
    throw new Error(`Journey Map canonical drift: duplicate ${label}`);
  }
}

export function buildBelajarJourneyMap(args: {
  childId: string;
  subjectId: LearningSubjectId;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
}): BelajarJourneyMapModel | null {
  const subject = getSubject(args.subjectId);
  if (!subject) return null;

  const baseHref = childRouteBase(args.childId);
  const canonicalPaths = getLearningPathsForSubject(args.subjectId);
  if (!canonicalPaths.length) {
    throw new Error(`Journey Map canonical drift: subject ${args.subjectId} has no learning path`);
  }

  assertUnique(canonicalPaths.map((path) => path.id), `path id for subject ${args.subjectId}`);

  const orderedStageIds = canonicalPaths.flatMap((path) => path.stageIds);
  assertUnique(orderedStageIds, `stage id for subject ${args.subjectId}`);

  const readinessRows = getSubjectStageReadiness(args.subjectId, args.progress, args.analytics);
  const readinessByStage = new Map(readinessRows.map((row) => [row.stageId, row]));
  assertUnique(readinessRows.map((row) => row.stageId), `readiness stage id for subject ${args.subjectId}`);

  if (readinessRows.length !== orderedStageIds.length) {
    throw new Error(
      `Journey Map canonical drift: subject ${args.subjectId} path stages (${orderedStageIds.length}) do not match readiness stages (${readinessRows.length})`
    );
  }

  const pathByStageId = new Map<string, { pathId: string; pathOrder: number; orderInPath: number }>();
  canonicalPaths.forEach((path, pathIndex) => {
    path.stageIds.forEach((stageId, stageIndex) => {
      pathByStageId.set(stageId, {
        pathId: path.id,
        pathOrder: pathIndex + 1,
        orderInPath: stageIndex + 1
      });
    });
  });

  const canonicalRows = orderedStageIds.map((stageId, index) => {
    const stage = getStage(stageId);
    const readiness = readinessByStage.get(stageId);
    const ownership = pathByStageId.get(stageId);

    if (!stage || stage.subjectId !== args.subjectId) {
      throw new Error(
        `Journey Map canonical drift: stage ${stageId} is missing or owned by another subject`
      );
    }
    if (!readiness || readiness.subjectId !== args.subjectId) {
      throw new Error(`Journey Map canonical drift: stage ${stageId} has no canonical readiness row`);
    }
    if (!ownership) {
      throw new Error(`Journey Map canonical drift: stage ${stageId} has no canonical path ownership`);
    }

    return {
      index,
      stage,
      readiness,
      ownership
    };
  });

  const firstCurrent = canonicalRows.find(
    ({ readiness }) => readiness.status !== "locked" && readiness.status !== "ready"
  );
  const currentStageId = firstCurrent?.stage.id ?? null;

  const stages: BelajarJourneyMapStage[] = canonicalRows.map(
    ({ index, stage, readiness, ownership }) => {
      const current = stage.id === currentStageId;
      const locked = readiness.status === "locked";
      const completed = readiness.status === "ready";
      return {
        id: stage.id,
        subjectId: stage.subjectId,
        pathId: ownership.pathId,
        order: index + 1,
        pathOrder: ownership.pathOrder,
        orderInPath: ownership.orderInPath,
        title: stage.title,
        subtitle: stage.subtitle,
        emoji: stage.emoji,
        href: `${baseHref}/stage/${encodeURIComponent(stage.id)}`,
        activityCount: stage.activityIds.length,
        canonicalStatus: readiness.status,
        statusLabel: readiness.statusLabel,
        reason: readiness.reason,
        presentationState: stagePresentationState(readiness.status, current),
        completed,
        current,
        open: !locked,
        locked,
        completionRatio: readiness.completionRatio,
        completedCount: readiness.completedCount,
        requiredCount: readiness.requiredCount,
        evidenceReadiness: readiness.evidenceReadiness,
        evidencedSkillCount: readiness.evidencedSkillCount,
        assessedSkillCount: readiness.assessedSkillCount
      };
    }
  );

  const presentation = SUBJECT_PRESENTATION_OVERRIDES[args.subjectId];
  const paths: BelajarJourneyMapPath[] = canonicalPaths.map((path, index) => ({
    id: path.id,
    order: index + 1,
    title: path.title,
    description: path.description,
    stageIds: [...path.stageIds]
  }));

  return {
    subjectId: args.subjectId,
    subjectTitle: presentation?.title ?? subject.title,
    subjectShortTitle: presentation?.shortTitle ?? subject.shortTitle,
    subjectEmoji: subject.emoji,
    subjectDescription: subject.description,
    subjectHref: `${baseHref}/subject/${encodeURIComponent(args.subjectId)}`,
    pathIds: paths.map((path) => path.id),
    paths,
    stages,
    currentStageId,
    completedStageCount: stages.filter((stage) => stage.completed).length,
    totalStageCount: stages.length
  };
}
