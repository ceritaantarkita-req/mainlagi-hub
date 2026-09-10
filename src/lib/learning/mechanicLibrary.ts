import type { LearningAttemptOutcome } from "./mastery";

export type ReusableMechanicId =
  | "tap_choice"
  | "listen_and_choose"
  | "matching"
  | "guided_trace"
  | "story"
  | "coloring"
  | "motion_game"
  | "drag_to_target"
  | "draw_line_matching"
  | "sort_classify"
  | "ordering_sequence"
  | "pattern_completion"
  | "odd_one_out"
  | "connect_dots"
  | "memory_pairs"
  | "compare"
  | "missing_item"
  | "maze_path"
  | "story_comprehension"
  | "find_object";

export type MechanicAssessmentMode = "assessed" | "practice";
export type MechanicInteractionFamily =
  | "choice"
  | "pairing"
  | "targeting"
  | "classification"
  | "ordering"
  | "path"
  | "practice";

export type MechanicEvidenceContractId =
  | "choice_accuracy_v1"
  | "matching_accuracy_v1"
  | "target_accuracy_v1"
  | "classification_accuracy_v1"
  | "sequence_accuracy_v1"
  | "guided_trace_path_v1"
  | "path_quality_v1"
  | "completion_only_v1";

export type MechanicScoringModel =
  | "discrete_accuracy"
  | "path_quality"
  | "completion_only";

export type MechanicAccuracyBehavior = "required_measured" | "not_applicable";
export type MechanicCountBehavior = "required" | "tracked" | "not_applicable";
export type MechanicAssistBehavior = "tracked_mastery_penalty" | "tracked_only" | "not_supported";
export type MechanicMasteryBehavior = "qualifying_measured_evidence" | "practice_only";

export interface MechanicBehaviorContract {
  score: "normalized_accuracy" | "measured_path_quality" | "completion_only";
  accuracy: MechanicAccuracyBehavior;
  correctIncorrect: MechanicCountBehavior;
  hints: MechanicAssistBehavior;
  retries: MechanicAssistBehavior;
  completion: "explicit_runtime_completion";
  mastery: MechanicMasteryBehavior;
}

export interface ReusableMechanicDefinition {
  id: ReusableMechanicId;
  title: string;
  family: MechanicInteractionFamily;
  assessmentModes: readonly MechanicAssessmentMode[];
  assessedEvidenceContract?: Exclude<MechanicEvidenceContractId, "completion_only_v1">;
  scoringModel: MechanicScoringModel;
  requiredPayloadKeys: readonly (keyof ReusableMechanicPayload)[];
  behavior: MechanicBehaviorContract;
}

export interface MechanicOption {
  id: string;
  label: string;
}

export interface MechanicPair {
  id: string;
  left: MechanicOption;
  right: MechanicOption;
}

export interface MechanicItem {
  id: string;
  label: string;
}

export interface MechanicTarget {
  id: string;
  label: string;
}

export interface ReusableMechanicPayload {
  prompt?: string;
  narration?: string[];
  options?: MechanicOption[];
  correctOptionId?: string;
  pairs?: MechanicPair[];
  items?: MechanicItem[];
  targets?: MechanicTarget[];
  assignments?: Record<string, string>;
  groups?: MechanicTarget[];
  correctOrder?: string[];
  checkpoints?: string[];
  correctPath?: string[];
  storyLines?: string[];
  assetRef?: string;
  gameSlug?: string;
}

const measured = (
  id: ReusableMechanicId,
  title: string,
  family: MechanicInteractionFamily,
  evidence: Exclude<MechanicEvidenceContractId, "completion_only_v1">,
  requiredPayloadKeys: readonly (keyof ReusableMechanicPayload)[],
  score: "normalized_accuracy" | "measured_path_quality" = "normalized_accuracy",
  correctIncorrect: MechanicCountBehavior = "required"
): ReusableMechanicDefinition => ({
  id,
  title,
  family,
  assessmentModes: ["assessed", "practice"],
  assessedEvidenceContract: evidence,
  scoringModel: score === "measured_path_quality" ? "path_quality" : "discrete_accuracy",
  requiredPayloadKeys,
  behavior: {
    score,
    accuracy: "required_measured",
    correctIncorrect,
    hints: "tracked_mastery_penalty",
    retries: "tracked_mastery_penalty",
    completion: "explicit_runtime_completion",
    mastery: "qualifying_measured_evidence"
  }
});

const practiceOnly = (
  id: ReusableMechanicId,
  title: string,
  requiredPayloadKeys: readonly (keyof ReusableMechanicPayload)[]
): ReusableMechanicDefinition => ({
  id,
  title,
  family: "practice",
  assessmentModes: ["practice"],
  scoringModel: "completion_only",
  requiredPayloadKeys,
  behavior: {
    score: "completion_only",
    accuracy: "not_applicable",
    correctIncorrect: "not_applicable",
    hints: "tracked_only",
    retries: "tracked_only",
    completion: "explicit_runtime_completion",
    mastery: "practice_only"
  }
});

/**
 * Canonical reusable mechanic vocabulary for expansion batches.
 *
 * Existing Mainlagi activities continue to use their historical runtime and
 * mechanic identifiers. New content can compose these definitions instead of
 * introducing a bespoke component/evidence formula for every activity.
 */
export const REUSABLE_MECHANICS: Record<ReusableMechanicId, ReusableMechanicDefinition> = {
  tap_choice: measured("tap_choice", "Tap choice", "choice", "choice_accuracy_v1", ["prompt", "options", "correctOptionId"]),
  listen_and_choose: measured("listen_and_choose", "Listen and choose", "choice", "choice_accuracy_v1", ["prompt", "options", "correctOptionId"]),
  matching: measured("matching", "Matching", "pairing", "matching_accuracy_v1", ["prompt", "pairs"]),
  guided_trace: measured("guided_trace", "Guided trace", "path", "guided_trace_path_v1", ["prompt", "checkpoints"], "measured_path_quality", "tracked"),
  story: practiceOnly("story", "Story", ["storyLines"]),
  coloring: practiceOnly("coloring", "Coloring", ["assetRef"]),
  motion_game: practiceOnly("motion_game", "Optional motion game", ["gameSlug"]),
  drag_to_target: measured("drag_to_target", "Drag to target", "targeting", "target_accuracy_v1", ["prompt", "items", "targets", "assignments"]),
  draw_line_matching: measured("draw_line_matching", "Draw-line matching", "pairing", "matching_accuracy_v1", ["prompt", "pairs"]),
  sort_classify: measured("sort_classify", "Sort and classify", "classification", "classification_accuracy_v1", ["prompt", "items", "groups", "assignments"]),
  ordering_sequence: measured("ordering_sequence", "Ordering and sequence", "ordering", "sequence_accuracy_v1", ["prompt", "items", "correctOrder"]),
  pattern_completion: measured("pattern_completion", "Pattern completion", "choice", "choice_accuracy_v1", ["prompt", "options", "correctOptionId"]),
  odd_one_out: measured("odd_one_out", "Odd one out", "choice", "choice_accuracy_v1", ["prompt", "options", "correctOptionId"]),
  connect_dots: measured("connect_dots", "Connect dots", "ordering", "sequence_accuracy_v1", ["prompt", "items", "correctOrder"]),
  memory_pairs: measured("memory_pairs", "Memory pairs", "pairing", "matching_accuracy_v1", ["prompt", "pairs"]),
  compare: measured("compare", "Compare", "choice", "choice_accuracy_v1", ["prompt", "options", "correctOptionId"]),
  missing_item: measured("missing_item", "Missing item", "choice", "choice_accuracy_v1", ["prompt", "options", "correctOptionId"]),
  maze_path: measured("maze_path", "Maze / path selection", "path", "path_quality_v1", ["prompt", "checkpoints", "correctPath"], "measured_path_quality", "tracked"),
  story_comprehension: measured("story_comprehension", "Story comprehension", "choice", "choice_accuracy_v1", ["storyLines", "prompt", "options", "correctOptionId"]),
  find_object: measured("find_object", "Observation / find object", "choice", "choice_accuracy_v1", ["prompt", "options", "correctOptionId"])
};

export const REUSABLE_MECHANIC_IDS = Object.freeze(Object.keys(REUSABLE_MECHANICS) as ReusableMechanicId[]);

export function getReusableMechanic(id: string): ReusableMechanicDefinition | undefined {
  return REUSABLE_MECHANICS[id as ReusableMechanicId];
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function cleanCount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

function validId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim() === value;
}

function uniqueIds(values: readonly { id: string }[]): boolean {
  return values.every((value) => validId(value.id)) && new Set(values.map((value) => value.id)).size === values.length;
}

export interface MechanicPayloadValidation {
  valid: boolean;
  errors: string[];
}

export function validateReusableMechanicPayload(
  mechanicId: ReusableMechanicId,
  payload: ReusableMechanicPayload
): MechanicPayloadValidation {
  const definition = REUSABLE_MECHANICS[mechanicId];
  const errors: string[] = [];

  for (const key of definition.requiredPayloadKeys) {
    const value = payload[key];
    const missing = value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
    if (missing) errors.push(`${mechanicId}: missing required payload ${String(key)}`);
  }

  if (definition.family === "choice") {
    const options = payload.options ?? [];
    if (options.length < 2) errors.push(`${mechanicId}: choice mechanics need at least two options`);
    if (!uniqueIds(options)) errors.push(`${mechanicId}: option IDs must be unique non-empty strings`);
    if (!payload.correctOptionId || !options.some((option) => option.id === payload.correctOptionId)) {
      errors.push(`${mechanicId}: correctOptionId must resolve to an option`);
    }
  }

  if (definition.family === "pairing") {
    const pairs = payload.pairs ?? [];
    if (pairs.length < 2) errors.push(`${mechanicId}: pairing mechanics need at least two pairs`);
    if (!uniqueIds(pairs)) errors.push(`${mechanicId}: pair IDs must be unique non-empty strings`);
    const itemIds = pairs.flatMap((pair) => [pair.left, pair.right]);
    if (!uniqueIds(itemIds)) errors.push(`${mechanicId}: pair item IDs must be unique non-empty strings`);
  }

  if (definition.family === "targeting" || definition.family === "classification") {
    const items = payload.items ?? [];
    const destinations = definition.family === "classification" ? (payload.groups ?? []) : (payload.targets ?? []);
    if (items.length < 2) errors.push(`${mechanicId}: needs at least two items`);
    if (destinations.length < 2) errors.push(`${mechanicId}: needs at least two destinations`);
    if (!uniqueIds(items)) errors.push(`${mechanicId}: item IDs must be unique non-empty strings`);
    if (!uniqueIds(destinations)) errors.push(`${mechanicId}: destination IDs must be unique non-empty strings`);
    const destinationIds = new Set(destinations.map((item) => item.id));
    for (const item of items) {
      const destinationId = payload.assignments?.[item.id];
      if (!destinationId || !destinationIds.has(destinationId)) {
        errors.push(`${mechanicId}: every item must resolve to a known destination`);
        break;
      }
    }
  }

  if (definition.family === "ordering") {
    const items = payload.items ?? [];
    const order = payload.correctOrder ?? [];
    if (items.length < 2) errors.push(`${mechanicId}: ordering mechanics need at least two items`);
    if (!uniqueIds(items)) errors.push(`${mechanicId}: item IDs must be unique non-empty strings`);
    const itemIds = new Set(items.map((item) => item.id));
    if (order.length !== items.length || new Set(order).size !== order.length || order.some((id) => !itemIds.has(id))) {
      errors.push(`${mechanicId}: correctOrder must contain every item exactly once`);
    }
  }

  if (definition.family === "path") {
    const checkpoints = payload.checkpoints ?? [];
    if (checkpoints.length < 2 || checkpoints.some((value) => !validId(value)) || new Set(checkpoints).size !== checkpoints.length) {
      errors.push(`${mechanicId}: path checkpoints must contain at least two unique IDs`);
    }
    if (mechanicId === "maze_path") {
      const correctPath = payload.correctPath ?? [];
      const checkpointIds = new Set(checkpoints);
      if (correctPath.length < 2 || correctPath.some((value) => !checkpointIds.has(value))) {
        errors.push(`${mechanicId}: correctPath must resolve to known checkpoints`);
      }
    }
  }

  if (mechanicId === "story" || mechanicId === "story_comprehension") {
    if ((payload.storyLines ?? []).length === 0) errors.push(`${mechanicId}: storyLines cannot be empty`);
  }

  if (mechanicId === "coloring" && (!payload.assetRef || !payload.assetRef.startsWith("/") || payload.assetRef.includes(".."))) {
    errors.push(`${mechanicId}: assetRef must be a safe public-root path`);
  }

  if (mechanicId === "motion_game" && !validId(payload.gameSlug)) {
    errors.push(`${mechanicId}: gameSlug must be a non-empty stable slug`);
  }

  return { valid: errors.length === 0, errors };
}

export interface MechanicSessionState {
  startedAtMs: number;
  correctCount: number;
  incorrectCount: number;
  hintCount: number;
  retryCount: number;
  completed: boolean;
  qualityScore: number | null;
}

export type MechanicSessionEvent =
  | { type: "correct"; count?: number }
  | { type: "incorrect"; count?: number }
  | { type: "hint"; count?: number }
  | { type: "retry"; count?: number }
  | { type: "quality"; score: number }
  | { type: "complete" };

export function createMechanicSession(startedAtMs = Date.now()): MechanicSessionState {
  return {
    startedAtMs,
    correctCount: 0,
    incorrectCount: 0,
    hintCount: 0,
    retryCount: 0,
    completed: false,
    qualityScore: null
  };
}

export function applyMechanicSessionEvent(
  state: MechanicSessionState,
  event: MechanicSessionEvent
): MechanicSessionState {
  const next = { ...state };
  if (event.type === "correct") next.correctCount += cleanCount(event.count ?? 1);
  if (event.type === "incorrect") next.incorrectCount += cleanCount(event.count ?? 1);
  if (event.type === "hint") next.hintCount += cleanCount(event.count ?? 1);
  if (event.type === "retry") next.retryCount += cleanCount(event.count ?? 1);
  if (event.type === "quality") next.qualityScore = clamp01(event.score);
  if (event.type === "complete") next.completed = true;
  return next;
}

function completionOnlyOutcome(
  mechanicId: ReusableMechanicId,
  state: MechanicSessionState,
  completedAtMs: number,
  reason: string
): LearningAttemptOutcome {
  return {
    status: state.completed ? "completed" : "interrupted",
    assessed: false,
    score: null,
    accuracy: null,
    correctCount: state.correctCount,
    incorrectCount: state.incorrectCount,
    hintCount: state.hintCount,
    retryCount: state.retryCount,
    durationMs: Math.max(0, Math.round(completedAtMs - state.startedAtMs)),
    startedAt: new Date(state.startedAtMs).toISOString(),
    completedAt: new Date(completedAtMs).toISOString(),
    metadata: {
      source: "reusable-mechanic-library",
      mechanicId,
      evidenceContract: "completion_only_v1",
      evidenceFidelity: "completion_only",
      measurementReason: reason
    }
  };
}

/**
 * Converts a reusable mechanic session into the canonical learning attempt
 * outcome. Missing measurement always fails closed to completion-only; a
 * practice mechanic can never self-promote into assessed mastery evidence.
 * Hint/retry counts are retained so the existing mastery engine can apply its
 * independence penalty exactly once.
 */
export function finalizeReusableMechanicOutcome(args: {
  mechanicId: ReusableMechanicId;
  assessment: MechanicAssessmentMode;
  state: MechanicSessionState;
  completedAtMs?: number;
}): LearningAttemptOutcome {
  const definition = REUSABLE_MECHANICS[args.mechanicId];
  const completedAtMs = args.completedAtMs ?? Date.now();

  if (!args.state.completed) {
    return completionOnlyOutcome(args.mechanicId, args.state, completedAtMs, "runtime_not_completed");
  }

  if (args.assessment === "practice" || !definition.assessmentModes.includes("assessed")) {
    return completionOnlyOutcome(args.mechanicId, args.state, completedAtMs, "practice_only");
  }

  let accuracy: number | null = null;
  if (definition.scoringModel === "discrete_accuracy") {
    const total = args.state.correctCount + args.state.incorrectCount;
    if (total <= 0 || args.state.correctCount <= 0) {
      return completionOnlyOutcome(args.mechanicId, args.state, completedAtMs, "missing_discrete_measurement");
    }
    accuracy = clamp01(args.state.correctCount / total);
  } else if (definition.scoringModel === "path_quality") {
    if (args.state.qualityScore === null || !Number.isFinite(args.state.qualityScore)) {
      return completionOnlyOutcome(args.mechanicId, args.state, completedAtMs, "missing_path_measurement");
    }
    accuracy = clamp01(args.state.qualityScore);
  } else {
    return completionOnlyOutcome(args.mechanicId, args.state, completedAtMs, "completion_scoring_cannot_be_assessed");
  }

  return {
    status: "completed",
    assessed: true,
    score: accuracy,
    accuracy,
    correctCount: args.state.correctCount,
    incorrectCount: args.state.incorrectCount,
    hintCount: args.state.hintCount,
    retryCount: args.state.retryCount,
    durationMs: Math.max(0, Math.round(completedAtMs - args.state.startedAtMs)),
    startedAt: new Date(args.state.startedAtMs).toISOString(),
    completedAt: new Date(completedAtMs).toISOString(),
    metadata: {
      source: "reusable-mechanic-library",
      mechanicId: args.mechanicId,
      evidenceContract: definition.assessedEvidenceContract,
      evidenceFidelity: `mechanic_${definition.assessedEvidenceContract}`,
      measurementReason: "measured"
    }
  };
}

export interface MechanicLibraryValidation {
  valid: boolean;
  errors: string[];
  mechanicCount: number;
  assessedCount: number;
  practiceOnlyCount: number;
}

export function validateMechanicLibrary(): MechanicLibraryValidation {
  const errors: string[] = [];
  const ids = Object.keys(REUSABLE_MECHANICS) as ReusableMechanicId[];

  if (ids.length !== 20) errors.push(`Expected 20 reusable mechanics, found ${ids.length}`);
  if (new Set(ids).size !== ids.length) errors.push("Mechanic IDs must be unique");

  for (const id of ids) {
    const definition = REUSABLE_MECHANICS[id];
    if (definition.id !== id) errors.push(`${id}: definition id drift`);
    if (definition.requiredPayloadKeys.length === 0) errors.push(`${id}: required payload contract cannot be empty`);
    if (new Set(definition.requiredPayloadKeys).size !== definition.requiredPayloadKeys.length) errors.push(`${id}: duplicate required payload keys`);

    const supportsAssessed = definition.assessmentModes.includes("assessed");
    if (supportsAssessed) {
      if (!definition.assessedEvidenceContract) errors.push(`${id}: assessed mechanic needs an evidence contract`);
      if (definition.scoringModel === "completion_only") errors.push(`${id}: assessed mechanic cannot use completion-only scoring`);
      if (definition.behavior.accuracy !== "required_measured") errors.push(`${id}: assessed mechanic must require measured accuracy`);
      if (definition.behavior.mastery !== "qualifying_measured_evidence") errors.push(`${id}: assessed mechanic must declare measured mastery behavior`);
    } else {
      if (definition.assessedEvidenceContract) errors.push(`${id}: practice-only mechanic cannot expose assessed evidence`);
      if (definition.scoringModel !== "completion_only") errors.push(`${id}: practice-only mechanic must use completion-only scoring`);
      if (definition.behavior.mastery !== "practice_only") errors.push(`${id}: practice-only mechanic must stay outside mastery`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    mechanicCount: ids.length,
    assessedCount: ids.filter((id) => REUSABLE_MECHANICS[id].assessmentModes.includes("assessed")).length,
    practiceOnlyCount: ids.filter((id) => !REUSABLE_MECHANICS[id].assessmentModes.includes("assessed")).length
  };
}

export function assertMechanicLibraryValid(): MechanicLibraryValidation {
  const report = validateMechanicLibrary();
  if (!report.valid) throw new Error(`Invalid reusable mechanic library:\n${report.errors.join("\n")}`);
  return report;
}
