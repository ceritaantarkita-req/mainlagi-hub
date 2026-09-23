import type {
  MechanicEvidenceContractId,
  ReusableMechanicId
} from "../mechanicLibrary";
import {
  MONEY_WORLD_EVIDENCE_CANDIDATES,
  MONEY_WORLD_EVIDENCE_EXCLUSIONS
} from "./moneyWorldEvidenceBridge";

export type MoneyWorldEvidenceActivationDecision =
  | "approved-future-supplemental-evidence"
  | "deferred";

export type MoneyWorldEvidenceRole = "supplemental" | "none";

export interface MoneyWorldEvidenceActivationScopeEntry {
  worldActivityId: string;
  stageId: string;
  mechanicId: ReusableMechanicId;
  decision: MoneyWorldEvidenceActivationDecision;
  canonicalSkillId: string | null;
  evidenceContract: Exclude<MechanicEvidenceContractId, "completion_only_v1"> | null;
  evidenceRole: MoneyWorldEvidenceRole;
  currentAssessment: "practice";
  requiredAssessmentBeforeActivation: "assessed" | null;
  eligibleAgeMin: number | null;
  eligibleAgeMax: number | null;
  maxQualifyingEvidencePerContentVersion: number;
  worldOnlyMasteryCeiling: "exploring" | "not_applicable";
  canonicalBelajarEvidenceRequiredAboveCeiling: boolean;
  progressionEffect: "none";
  rewardEffect: "none";
  certificateEffect: "none";
  rationale: string;
}

export interface MoneyWorldEvidenceActivationRequirement {
  id: string;
  satisfied: boolean;
  reason: string;
}

export const MONEY_WORLD_EVIDENCE_ACTIVATION_DESIGN_VERSION =
  "money-world-evidence-activation-design-v1";

/**
 * This is a pre-activation design contract, not a feature flag.
 *
 * The v1 runtime bridge remains fail-closed. No World runtime caller may use
 * this constant as authorization to emit canonical evidence or mutate mastery.
 */
export const MONEY_WORLD_EVIDENCE_ACTIVATION_ENABLED = false;

export const MONEY_WORLD_EVIDENCE_ACTIVATION_MODE =
  "pre-activation-design-disabled" as const;

/**
 * Product/pedagogy decision for the two v1 candidate relationships.
 *
 * Stage 2 stays deferred because the authored task asks which *price* is more
 * expensive in an inflation story. That contextual objective is not identical
 * to the canonical "compare quantities" objective, and the value 12 also sits
 * outside the current canonical comparison examples.
 *
 * Stage 8 is accepted as the only future supplemental-evidence candidate
 * because its authored representation is exactly 8 take away 2, with a
 * numeric response of 6, which matches subtraction within 10.
 *
 * Neither decision changes the current World activity from practice to
 * assessed. Runtime activation requires a separate authored-assessment change.
 */
export const MONEY_WORLD_EVIDENCE_ACTIVATION_SCOPE: readonly MoneyWorldEvidenceActivationScopeEntry[] = [
  {
    worldActivityId: "money-s02-activity-01",
    stageId: "money-stage-02-price-change",
    mechanicId: "compare",
    decision: "deferred",
    canonicalSkillId: null,
    evidenceContract: null,
    evidenceRole: "none",
    currentAssessment: "practice",
    requiredAssessmentBeforeActivation: null,
    eligibleAgeMin: null,
    eligibleAgeMax: null,
    maxQualifyingEvidencePerContentVersion: 0,
    worldOnlyMasteryCeiling: "not_applicable",
    canonicalBelajarEvidenceRequiredAboveCeiling: false,
    progressionEffect: "none",
    rewardEffect: "none",
    certificateEffect: "none",
    rationale:
      "The current task measures contextual price comparison inside the inflation story, so it stays World practice rather than being reinterpreted as canonical quantity-comparison mastery."
  },
  {
    worldActivityId: "money-s08-activity-02",
    stageId: "money-stage-08-final-festival",
    mechanicId: "tap_choice",
    decision: "approved-future-supplemental-evidence",
    canonicalSkillId: "math.operation.subtraction.within_10",
    evidenceContract: "choice_accuracy_v1",
    evidenceRole: "supplemental",
    currentAssessment: "practice",
    requiredAssessmentBeforeActivation: "assessed",
    eligibleAgeMin: 6,
    eligibleAgeMax: 7,
    maxQualifyingEvidencePerContentVersion: 1,
    worldOnlyMasteryCeiling: "exploring",
    canonicalBelajarEvidenceRequiredAboveCeiling: true,
    progressionEffect: "none",
    rewardEffect: "none",
    certificateEffect: "none",
    rationale:
      "The authored task is a direct take-away model: 8 tokens, 2 removed, 6 remaining. It aligns with canonical subtraction-within-10, but only as supplemental evidence after a separate assessed-promotion and server-owned activation."
  }
] as const;

export const MONEY_WORLD_EVIDENCE_AGE_POLICY = {
  worldAgeMin: 6,
  worldAgeMax: 8,
  evidenceAgeMin: 6,
  evidenceAgeMax: 7,
  age8Behavior: "world-completion-only-no-canonical-evidence",
  mutateCanonicalSkillAgeRange: false
} as const;

/**
 * Selected future architecture. It is intentionally additive:
 *
 * browser -> server route -> server mapping/validation -> private write
 * boundary -> supplemental evidence -> guarded mastery recompute.
 *
 * It does not insert a fake canonical learning_activity and it does not call
 * record_learning_attempt(...).
 */
export const MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY = {
  clientEndpoint: "/api/learning/world-evidence",
  browserDirectDatabaseWriteAllowed: false,
  browserDirectRpcAllowed: false,
  directRecordLearningAttemptAllowed: false,
  clientChoosesCanonicalSkill: false,
  clientChoosesAssessmentMode: false,
  serverOwnsSourceMapping: true,
  serverOwnsChildOwnershipCheck: true,
  serverOwnsAgeGate: true,
  serverOwnsEvidenceScore: true,
  persistenceTable: "learning_supplemental_skill_evidence",
  serverOnlyWriteFunction: "public.record_world_skill_evidence",
  serverOnlyWriteFunctionRole: "service_role-only",
  canonicalLearningAttemptInsertAllowed: false,
  canonicalLearningProgressMutationAllowed: false,
  canonicalRewardMutationAllowed: false,
  certificateMutationAllowed: false,
  schemaImplemented: true,
  endpointImplemented: true,
  serverOnlyWriteFunctionImplemented: true,
  applicationIngestionEnabled: false,
  databaseMappingEnabled: false
} as const;

export const MONEY_WORLD_EVIDENCE_INTEGRITY_POLICY = {
  clientObservationIdRequired: true,
  childOwnershipRequired: true,
  contentVersionRequired: true,
  measuredAccuracyRequired: true,
  completedAttemptRequired: true,
  retryCountAtOrAboveSevenQualifies: false,
  serverReceiptTimeReplayProtectionRequired: true,
  exactDuplicateIsIdempotent: true,
  maxQualifyingEvidencePerActivityContentVersion: 1,
  repeatedStaticQuestionCanCreateAdditionalMasteryEvidence: false,
  worldEvidenceRole: "supplemental",
  worldOnlyMasteryCeiling: "exploring",
  canonicalBelajarEvidenceRequiredForDevelopingOrHigher: true,
  boundedMetadataRequired: true
} as const;

export const MONEY_WORLD_EVIDENCE_ACTIVATION_REQUIREMENTS: readonly MoneyWorldEvidenceActivationRequirement[] = [
  {
    id: "candidate-scope-decision",
    satisfied: true,
    reason:
      "Stage 8 subtraction is selected as the only future supplemental-evidence candidate; Stage 2 price comparison is deferred."
  },
  {
    id: "age-8-handling",
    satisfied: true,
    reason:
      "Age 8 remains World-only for this mapping; canonical evidence is limited to ages 6-7 without changing skill ageMax."
  },
  {
    id: "server-write-architecture-selected",
    satisfied: true,
    reason:
      "A dedicated server route plus a service-role-only SECURITY DEFINER supplemental-evidence RPC is selected; direct record_learning_attempt reuse stays forbidden."
  },
  {
    id: "progression-reward-isolation-design",
    satisfied: true,
    reason:
      "The selected architecture preserves progressionEffect=none, rewardEffect=none, and certificateEffect=none."
  },
  {
    id: "anti-farming-design",
    satisfied: true,
    reason:
      "World evidence is supplemental, one qualifying item per activity/content version, static replay cannot create additional qualifying mastery evidence, and World-only evidence is capped at exploring."
  },
  {
    id: "assessed-world-activity-promotion",
    satisfied: false,
    reason:
      "money-s08-activity-02 is still authored as practice. A separate reviewed content change is required before evidence activation."
  },
  {
    id: "supplemental-evidence-schema-migration",
    satisfied: true,
    reason:
      "Migration 0048 implements the additive supplemental-evidence table and service-role-only write RPC, with its database mapping kill switch still false."
  },
  {
    id: "server-endpoint-implementation",
    satisfied: true,
    reason:
      "The server-owned /api/learning/world-evidence route exists, authenticates before writes when enabled, and remains application-disabled."
  },
  {
    id: "database-mapping-activation",
    satisfied: false,
    reason:
      "record_world_skill_evidence keeps v_mapping_active=false; database writes remain impossible until a later reviewed activation migration."
  },
  {
    id: "runtime-observation-emission",
    satisfied: false,
    reason:
      "Petualangan Uang runtime still emits no World evidence observation and imports no ingestion adapter."
  },
  {
    id: "mastery-source-aware-recompute",
    satisfied: false,
    reason:
      "Mastery recompute does not yet enforce the World-only exploring ceiling or the canonical-Belajar-evidence requirement above that ceiling."
  },
  {
    id: "certificate-isolation-implementation",
    satisfied: false,
    reason:
      "Certificate logic has not yet been made source-aware for supplemental World evidence."
  },
  {
    id: "parent-report-source-labeling",
    satisfied: false,
    reason:
      "Parent reporting does not yet label World supplemental evidence separately from direct Belajar attempts."
  },
  {
    id: "security-regression",
    satisfied: false,
    reason:
      "Ownership, idempotency, replay, spoofing, age-gate, retry and derived-write regressions still require implementation-level tests."
  }
] as const;

export function validateMoneyWorldEvidenceActivationDesign(): {
  valid: boolean;
  errors: readonly string[];
} {
  const errors: string[] = [];
  const scope = MONEY_WORLD_EVIDENCE_ACTIVATION_SCOPE;
  const accepted = scope.filter(
    (entry) => entry.decision === "approved-future-supplemental-evidence"
  );
  const deferred = scope.filter((entry) => entry.decision === "deferred");

  if (MONEY_WORLD_EVIDENCE_ACTIVATION_ENABLED) {
    errors.push("pre-activation design must remain disabled");
  }
  if (MONEY_WORLD_EVIDENCE_ACTIVATION_MODE !== "pre-activation-design-disabled") {
    errors.push("activation design mode drifted");
  }
  if (scope.length !== 2 || accepted.length !== 1 || deferred.length !== 1) {
    errors.push("activation scope must resolve exactly one accepted and one deferred v1 candidate");
  }

  const subtraction = accepted[0];
  if (
    !subtraction ||
    subtraction.worldActivityId !== "money-s08-activity-02" ||
    subtraction.canonicalSkillId !== "math.operation.subtraction.within_10" ||
    subtraction.evidenceContract !== "choice_accuracy_v1" ||
    subtraction.evidenceRole !== "supplemental" ||
    subtraction.currentAssessment !== "practice" ||
    subtraction.requiredAssessmentBeforeActivation !== "assessed" ||
    subtraction.eligibleAgeMin !== 6 ||
    subtraction.eligibleAgeMax !== 7 ||
    subtraction.maxQualifyingEvidencePerContentVersion !== 1 ||
    subtraction.worldOnlyMasteryCeiling !== "exploring" ||
    subtraction.progressionEffect !== "none" ||
    subtraction.rewardEffect !== "none" ||
    subtraction.certificateEffect !== "none"
  ) {
    errors.push("Stage 8 subtraction activation design drifted");
  }

  const comparison = deferred[0];
  if (
    !comparison ||
    comparison.worldActivityId !== "money-s02-activity-01" ||
    comparison.canonicalSkillId !== null ||
    comparison.evidenceContract !== null ||
    comparison.evidenceRole !== "none"
  ) {
    errors.push("Stage 2 price comparison must remain deferred from canonical evidence");
  }

  const v1CandidateIds = new Set(
    MONEY_WORLD_EVIDENCE_CANDIDATES.map((entry) => entry.worldActivityId)
  );
  if (scope.some((entry) => !v1CandidateIds.has(entry.worldActivityId))) {
    errors.push("activation design may only decide the two audited v1 candidates");
  }
  if (MONEY_WORLD_EVIDENCE_EXCLUSIONS.length !== 14) {
    errors.push("the fourteen existing World exclusions must remain unchanged");
  }

  if (
    MONEY_WORLD_EVIDENCE_AGE_POLICY.age8Behavior !==
      "world-completion-only-no-canonical-evidence" ||
    MONEY_WORLD_EVIDENCE_AGE_POLICY.mutateCanonicalSkillAgeRange
  ) {
    errors.push("age-8 handling must remain explicit and must not rewrite canonical skill ages");
  }

  const writeBoundaryFlags = [
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.browserDirectDatabaseWriteAllowed,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.browserDirectRpcAllowed,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.directRecordLearningAttemptAllowed,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.clientChoosesCanonicalSkill,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.clientChoosesAssessmentMode,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.canonicalLearningAttemptInsertAllowed,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.canonicalLearningProgressMutationAllowed,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.canonicalRewardMutationAllowed,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.certificateMutationAllowed,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.applicationIngestionEnabled,
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.databaseMappingEnabled
  ];
  if (writeBoundaryFlags.some(Boolean)) {
    errors.push("pre-activation implementation must not authorize runtime/write effects");
  }
  if (
    !MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.schemaImplemented ||
    !MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.endpointImplemented ||
    !MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.serverOnlyWriteFunctionImplemented ||
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.serverOnlyWriteFunction !== "public.record_world_skill_evidence" ||
    MONEY_WORLD_EVIDENCE_SERVER_BOUNDARY.serverOnlyWriteFunctionRole !== "service_role-only"
  ) {
    errors.push("implementation-wave backend foundation is incomplete");
  }

  if (
    MONEY_WORLD_EVIDENCE_INTEGRITY_POLICY.maxQualifyingEvidencePerActivityContentVersion !== 1 ||
    MONEY_WORLD_EVIDENCE_INTEGRITY_POLICY.repeatedStaticQuestionCanCreateAdditionalMasteryEvidence ||
    MONEY_WORLD_EVIDENCE_INTEGRITY_POLICY.worldOnlyMasteryCeiling !== "exploring" ||
    !MONEY_WORLD_EVIDENCE_INTEGRITY_POLICY.canonicalBelajarEvidenceRequiredForDevelopingOrHigher
  ) {
    errors.push("supplemental evidence anti-farming/mastery ceiling drifted");
  }

  if (MONEY_WORLD_EVIDENCE_ACTIVATION_REQUIREMENTS.every((item) => item.satisfied)) {
    errors.push("implementation requirements must remain open in pre-activation design");
  }

  return { valid: errors.length === 0, errors };
}

export const MONEY_WORLD_EVIDENCE_ACTIVATION_DESIGN_VALIDATION =
  validateMoneyWorldEvidenceActivationDesign();
