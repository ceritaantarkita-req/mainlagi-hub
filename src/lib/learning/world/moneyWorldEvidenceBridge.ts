import type {
  MechanicAssessmentMode,
  MechanicEvidenceContractId,
  ReusableMechanicId
} from "../mechanicLibrary";

export type MoneyWorldEvidenceDecision = "candidate" | "excluded";
export type MoneyWorldEvidenceMappingStatus = "pedagogy-approved-disabled" | "rejected-after-pedagogy-review" | "excluded";
export type MoneyWorldEvidenceDisposition = "blocked";

export type MoneyWorldEvidenceBlocker =
  | "bridge-disabled"
  | "source-identity-mismatch"
  | "source-assessment-spoofed"
  | "world-activity-practice-only"
  | "candidate-mapping-not-approved"
  | "no-approved-canonical-skill-mapping"
  | "canonical-learning-activity-mapping-not-defined"
  | "server-owned-world-evidence-ingestion-not-defined"
  | "progression-reward-side-effects-not-isolated"
  | "canonical-learning-skill-age-contract-currently-stops-at-7"
  | "financial-literacy-skill-catalog-not-defined"
  | "pedagogy-review-not-approved"
  | "measured-outcome-required"
  | "attempt-not-completed";

export interface MoneyWorldEvidenceBridgeEntry {
  worldActivityId: string;
  stageId: string;
  mechanicId: ReusableMechanicId;
  sourceAssessment: "practice";
  decision: MoneyWorldEvidenceDecision;
  mappingStatus: MoneyWorldEvidenceMappingStatus;
  canonicalSubjectId: "math" | null;
  canonicalLearningActivityId: null;
  canonicalSkillId: string | null;
  assessedEvidenceContract: Exclude<MechanicEvidenceContractId, "completion_only_v1"> | null;
  progressionEffect: "none";
  rewardEffect: "none";
  requiresPedagogyReview: boolean;
  rationale: string;
}

export interface MoneyWorldEvidenceObservation {
  worldId: string;
  stageId: string;
  worldActivityId: string;
  mechanicId: ReusableMechanicId;
  assessment: MechanicAssessmentMode;
  status: "completed" | "abandoned" | "interrupted";
  accuracy?: number | null;
  correctCount?: number;
  incorrectCount?: number;
  hintCount?: number;
  retryCount?: number;
  durationMs?: number | null;
  inputMode?: string | null;
  startedAt?: string;
  completedAt?: string;
}

export interface MoneyWorldEvidenceBridgeEvaluation {
  disposition: MoneyWorldEvidenceDisposition;
  validSourceIdentity: boolean;
  candidateSkillId: string | null;
  candidateEvidenceContract: Exclude<MechanicEvidenceContractId, "completion_only_v1"> | null;
  canWriteLearningAttempt: false;
  canCreateSkillEvidence: false;
  canAffectMastery: false;
  canAffectLearningProgress: false;
  canAwardStars: false;
  canIssueCertificate: false;
  blockers: readonly MoneyWorldEvidenceBlocker[];
}

export interface MoneyWorldEvidenceActivationRequirement {
  id: string;
  satisfied: boolean;
  reason: string;
}

export const MONEY_WORLD_EVIDENCE_BRIDGE_VERSION = "money-world-evidence-bridge-v1";

/**
 * Design-only contract.
 *
 * This is intentionally not a runtime feature flag. No caller may interpret
 * this constant as permission to emit learning attempts, evidence, mastery,
 * Belajar progression, rewards, or certificates from World activity.
 */
export const MONEY_WORLD_EVIDENCE_BRIDGE_ENABLED = false;

export const MONEY_WORLD_EVIDENCE_BRIDGE_MODE = "design-only-disabled" as const;

/**
 * The existing learning RPC is not a safe direct bridge target.
 *
 * record_learning_attempt currently materializes canonical learning completion
 * and stars for a completed learning_activity. World completion/stars are a
 * separate product domain, so using that RPC directly would risk turning World
 * play into Belajar completion/progression/reward side effects.
 */
export const MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY = {
  directRecordLearningAttemptAllowed: false,
  localAttemptWriteAllowed: false,
  cloudAttemptWriteAllowed: false,
  skillEvidenceWriteAllowed: false,
  masteryRecomputeAllowed: false,
  learningProgressMutationAllowed: false,
  rewardMutationAllowed: false,
  certificateMutationAllowed: false,
  schemaMigrationAuthorized: false,
  runtimeHookAuthorized: false,
  futureServerOwnedAdapterRequired: true,
  requiredProgressionEffect: "none",
  requiredRewardEffect: "none"
} as const;

export const MONEY_WORLD_EVIDENCE_BRIDGE_BLOCKERS = [
  "bridge-disabled",
  "world-activity-practice-only",
  "canonical-learning-activity-mapping-not-defined",
  "server-owned-world-evidence-ingestion-not-defined",
  "progression-reward-side-effects-not-isolated",
  "canonical-learning-skill-age-contract-currently-stops-at-7",
] as const satisfies readonly MoneyWorldEvidenceBlocker[];

export const MONEY_WORLD_EVIDENCE_ACTIVATION_REQUIREMENTS: readonly MoneyWorldEvidenceActivationRequirement[] = [
  {
    id: "explicit-product-authorization",
    satisfied: false,
    reason: "World -> Evidence activation has not been separately authorized."
  },
  {
    id: "server-owned-ingestion-boundary",
    satisfied: false,
    reason: "A server-owned World observation canonicalization/write path does not exist yet."
  },
  {
    id: "progression-reward-isolation",
    satisfied: false,
    reason: "World evidence must not mark Belajar activities complete, award Belajar stars, or unlock stages by completion side effect."
  },
  {
    id: "assessed-world-evaluator-approval",
    satisfied: false,
    reason: "All sixteen current World activity placements are authored as practice; measured mechanics do not override that classification."
  },
  {
    id: "canonical-mapping-pedagogy-review",
    satisfied: true,
    reason: "The authorized scope review approved only money-s08-activity-02 -> math.operation.subtraction.within_10; the price-comparison candidate was rejected."
  },
  {
    id: "age-8-learning-contract",
    satisfied: false,
    reason: "Petualangan Uang targets 6-8 while the canonical Belajar skill/catalog contract currently tops out at age 7."
  },
  {
    id: "ownership-idempotency-anti-farming-regression",
    satisfied: false,
    reason: "A future bridge must inherit child ownership, idempotency, replay protection, retry limits, and server canonicalization tests."
  }
] as const;

/**
 * The owner-authorized scope review is complete.
 *
 * Only the Stage 8 subtraction activity remains in the future evidence candidate
 * scope, with its pedagogical mapping approved but runtime activation still
 * disabled. The Stage 2 price-comparison relationship was rejected because its
 * contextual financial objective does not isolate canonical quantity comparison
 * strongly enough for mastery evidence.
 */
export const MONEY_WORLD_EVIDENCE_CANDIDATES: readonly MoneyWorldEvidenceBridgeEntry[] = [
  {
    worldActivityId: "money-s08-activity-02",
    stageId: "money-stage-08-final-festival",
    mechanicId: "tap_choice",
    sourceAssessment: "practice",
    decision: "candidate",
    mappingStatus: "pedagogy-approved-disabled",
    canonicalSubjectId: "math",
    canonicalLearningActivityId: null,
    canonicalSkillId: "math.operation.subtraction.within_10",
    assessedEvidenceContract: "choice_accuracy_v1",
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: false,
    rationale: "Approved for the future evidence scope because the authored task directly asks 8 minus 2, uses a take-away presentation, has one objectively correct numeric answer, and aligns with the canonical subtraction-within-10 construct. Approval does not promote the World placement from practice or authorize evidence writes."
  }
] as const;

/**
 * Exclusions are intentional. A reusable mechanic being measurable is never,
 * by itself, enough to justify a canonical skill/mastery mapping.
 */
export const MONEY_WORLD_EVIDENCE_EXCLUSIONS: readonly MoneyWorldEvidenceBridgeEntry[] = [
  {
    worldActivityId: "money-s02-activity-01",
    stageId: "money-stage-02-price-change",
    mechanicId: "compare",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "rejected-after-pedagogy-review",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: false,
    rationale: "Rejected from canonical Math evidence scope after review: the authored objective is contextual price change and 'more expensive', so a correct response does not isolate the canonical quantity-comparison construct strongly enough for mastery evidence."
  },
  {
    worldActivityId: "money-s01-activity-01",
    stageId: "money-stage-01-money-use",
    mechanicId: "drag_to_target",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Money-use and price recognition do not currently have a compatible canonical skill."
  },
  {
    worldActivityId: "money-s01-activity-02",
    stageId: "money-stage-01-money-use",
    mechanicId: "matching",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Item-to-price matching is a financial-literacy objective; matching mechanics alone do not justify borrowing an unrelated mastery skill."
  },
  {
    worldActivityId: "money-s02-activity-02",
    stageId: "money-stage-02-price-change",
    mechanicId: "sort_classify",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Classifying price movement is currently a World financial concept, not a registered canonical learning skill."
  },
  {
    worldActivityId: "money-s03-activity-01",
    stageId: "money-stage-03-income-sources",
    mechanicId: "matching",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Work/business income-source recognition has no compatible canonical skill today."
  },
  {
    worldActivityId: "money-s03-activity-02",
    stageId: "money-stage-03-income-sources",
    mechanicId: "sort_classify",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Productive-activity recognition is contextual financial learning rather than an existing Belajar skill."
  },
  {
    worldActivityId: "money-s04-activity-01",
    stageId: "money-stage-04-needs-wants",
    mechanicId: "sort_classify",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Needs/wants prioritization has no canonical skill mapping in the current catalog."
  },
  {
    worldActivityId: "money-s04-activity-02",
    stageId: "money-stage-04-needs-wants",
    mechanicId: "tap_choice",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "A contextual priority choice should not create mastery without a canonical financial-priority skill."
  },
  {
    worldActivityId: "money-s05-activity-01",
    stageId: "money-stage-05-saving",
    mechanicId: "drag_to_target",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Although the child handles three tokens, the objective is saving toward a goal rather than canonical counting evidence."
  },
  {
    worldActivityId: "money-s05-activity-02",
    stageId: "money-stage-05-saving",
    mechanicId: "ordering_sequence",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Sequencing a saving process is procedural financial learning, not the canonical Math number-ordering skill."
  },
  {
    worldActivityId: "money-s06-activity-01",
    stageId: "money-stage-06-investment-intro",
    mechanicId: "matching",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Saving/investment-purpose recognition has no compatible canonical skill."
  },
  {
    worldActivityId: "money-s06-activity-02",
    stageId: "money-stage-06-investment-intro",
    mechanicId: "tap_choice",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Introductory investment recognition remains concept exposure, not canonical mastery evidence."
  },
  {
    worldActivityId: "money-s07-activity-01",
    stageId: "money-stage-07-risk",
    mechanicId: "sort_classify",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Up/down sorting is embedded in a risk concept; it is not currently registered as canonical Math ordering/comparison evidence."
  },
  {
    worldActivityId: "money-s07-activity-02",
    stageId: "money-stage-07-risk",
    mechanicId: "tap_choice",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Risk-statement recognition has no compatible canonical skill and must remain practice-only."
  },
  {
    worldActivityId: "money-s08-activity-01",
    stageId: "money-stage-08-final-festival",
    mechanicId: "drag_to_target",
    sourceAssessment: "practice",
    decision: "excluded",
    mappingStatus: "excluded",
    canonicalSubjectId: null,
    canonicalLearningActivityId: null,
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    progressionEffect: "none",
    rewardEffect: "none",
    requiresPedagogyReview: true,
    rationale: "Integrated budget/needs selection combines several concepts and should not be reduced to one unrelated mastery skill."
  }
] as const;

export const MONEY_WORLD_EVIDENCE_BRIDGE_AUDIT = [
  ...MONEY_WORLD_EVIDENCE_CANDIDATES,
  ...MONEY_WORLD_EVIDENCE_EXCLUSIONS
] as const;

const AUDIT_BY_ACTIVITY = new Map(
  MONEY_WORLD_EVIDENCE_BRIDGE_AUDIT.map((entry) => [entry.worldActivityId, entry] as const)
);

export function evaluateMoneyWorldEvidenceObservation(
  observation: MoneyWorldEvidenceObservation
): MoneyWorldEvidenceBridgeEvaluation {
  const entry = AUDIT_BY_ACTIVITY.get(observation.worldActivityId);
  const blockers = new Set<MoneyWorldEvidenceBlocker>(MONEY_WORLD_EVIDENCE_BRIDGE_BLOCKERS);
  let validSourceIdentity = Boolean(
    entry &&
    observation.worldId === "money-festival" &&
    observation.stageId === entry.stageId &&
    observation.mechanicId === entry.mechanicId
  );

  if (!validSourceIdentity) blockers.add("source-identity-mismatch");

  if (!entry || observation.assessment !== entry.sourceAssessment) {
    blockers.add("source-assessment-spoofed");
    validSourceIdentity = false;
  }

  if (observation.status !== "completed") blockers.add("attempt-not-completed");

  if (entry?.decision === "candidate") {
    if (entry.mappingStatus !== "pedagogy-approved-disabled") {
      blockers.add("candidate-mapping-not-approved");
    }
    if (typeof observation.accuracy !== "number" || !Number.isFinite(observation.accuracy)) {
      blockers.add("measured-outcome-required");
    }
  } else {
    blockers.add("no-approved-canonical-skill-mapping");
  }

  return {
    disposition: "blocked",
    validSourceIdentity,
    candidateSkillId: entry?.canonicalSkillId ?? null,
    candidateEvidenceContract: entry?.assessedEvidenceContract ?? null,
    canWriteLearningAttempt: false,
    canCreateSkillEvidence: false,
    canAffectMastery: false,
    canAffectLearningProgress: false,
    canAwardStars: false,
    canIssueCertificate: false,
    blockers: [...blockers]
  };
}

export function validateMoneyWorldEvidenceBridgeContract(): {
  valid: boolean;
  errors: readonly string[];
} {
  const errors: string[] = [];
  const audit = MONEY_WORLD_EVIDENCE_BRIDGE_AUDIT;

  if (MONEY_WORLD_EVIDENCE_BRIDGE_ENABLED) errors.push("design-only bridge must remain disabled");
  if (MONEY_WORLD_EVIDENCE_BRIDGE_MODE !== "design-only-disabled") errors.push("bridge mode drifted");
  if (audit.length !== 16) errors.push("bridge audit must cover exactly sixteen World activity placements");
  if (new Set(audit.map((entry) => entry.worldActivityId)).size !== audit.length) {
    errors.push("bridge audit activity IDs must be unique");
  }
  if (audit.some((entry) => entry.sourceAssessment !== "practice")) {
    errors.push("all current World activity placements must remain practice");
  }
  if (
    MONEY_WORLD_EVIDENCE_CANDIDATES.length !== 1 ||
    MONEY_WORLD_EVIDENCE_CANDIDATES.some((entry) =>
      entry.worldActivityId !== "money-s08-activity-02" ||
      entry.mappingStatus !== "pedagogy-approved-disabled" ||
      entry.requiresPedagogyReview ||
      !entry.canonicalSkillId ||
      !entry.assessedEvidenceContract ||
      entry.canonicalLearningActivityId !== null ||
      entry.progressionEffect !== "none" ||
      entry.rewardEffect !== "none"
    )
  ) {
    errors.push("approved candidate scope must contain only the disabled Stage 8 subtraction mapping");
  }
  if (MONEY_WORLD_EVIDENCE_EXCLUSIONS.some((entry) =>
    entry.canonicalSkillId !== null ||
    entry.assessedEvidenceContract !== null ||
    entry.canonicalLearningActivityId !== null
  )) {
    errors.push("excluded World activities must not carry canonical evidence mappings");
  }

  const writeFlags = [
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.directRecordLearningAttemptAllowed,
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.localAttemptWriteAllowed,
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.cloudAttemptWriteAllowed,
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.skillEvidenceWriteAllowed,
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.masteryRecomputeAllowed,
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.learningProgressMutationAllowed,
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.rewardMutationAllowed,
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.certificateMutationAllowed,
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.schemaMigrationAuthorized,
    MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.runtimeHookAuthorized
  ];
  if (writeFlags.some(Boolean)) errors.push("disabled bridge must not authorize any write/runtime/schema effect");

  const pedagogyRequirement = MONEY_WORLD_EVIDENCE_ACTIVATION_REQUIREMENTS.find(
    (requirement) => requirement.id === "canonical-mapping-pedagogy-review"
  );
  if (!pedagogyRequirement?.satisfied) {
    errors.push("authorized candidate-scope pedagogy review must remain recorded as satisfied");
  }
  if (
    MONEY_WORLD_EVIDENCE_ACTIVATION_REQUIREMENTS.some(
      (requirement) => requirement.id !== "canonical-mapping-pedagogy-review" && requirement.satisfied
    )
  ) {
    errors.push("non-pedagogy activation requirements must remain unsatisfied until separately authorized");
  }

  return { valid: errors.length === 0, errors };
}

export const MONEY_WORLD_EVIDENCE_BRIDGE_VALIDATION =
  validateMoneyWorldEvidenceBridgeContract();
