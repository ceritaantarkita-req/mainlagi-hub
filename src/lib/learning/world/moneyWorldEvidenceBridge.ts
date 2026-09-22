import type { ReusableMechanicId } from "../mechanicLibrary";

export type MoneyWorldEvidenceDecision = "candidate" | "excluded";

export interface MoneyWorldEvidenceBridgeEntry {
  worldActivityId: string;
  stageId: string;
  mechanicId: ReusableMechanicId;
  decision: MoneyWorldEvidenceDecision;
  canonicalSkillId: string | null;
  assessedEvidenceContract: string | null;
  rationale: string;
}

export const MONEY_WORLD_EVIDENCE_BRIDGE_VERSION = "money-world-evidence-bridge-v0";

/**
 * Deliberately false.
 *
 * World activity IDs are not canonical learning_activities yet, the current
 * learning skill/catalog age contract still tops out at 7, and the existing
 * server-owned record_learning_attempt RPC refuses unknown activity IDs.
 * This file is an audit/design manifest only; it must not create mastery.
 */
export const MONEY_WORLD_EVIDENCE_BRIDGE_ENABLED = false;

export const MONEY_WORLD_EVIDENCE_BRIDGE_BLOCKERS = [
  "world-activity-ids-are-not-canonical-learning-activities",
  "canonical-learning-skill-age-contract-currently-stops-at-7",
  "server-owned-world-activity-to-skill-registration-not-defined",
  "world-completion-stars-must-remain-separate-from-mastery"
] as const;

/**
 * Only two pilot activities currently have a defensible objective-level match
 * to an existing canonical Math skill. They remain candidates, not active
 * evidence, until every blocker above is closed.
 */
export const MONEY_WORLD_EVIDENCE_CANDIDATES: readonly MoneyWorldEvidenceBridgeEntry[] = [
  {
    worldActivityId: "money-s02-activity-01",
    stageId: "money-stage-02-price-change",
    mechanicId: "compare",
    decision: "candidate",
    canonicalSkillId: "math.quantity.comparison",
    assessedEvidenceContract: "choice_accuracy_v1",
    rationale: "The child compares two numeric price amounts; the reusable compare mechanic can produce measured choice accuracy."
  },
  {
    worldActivityId: "money-s08-activity-02",
    stageId: "money-stage-08-final-festival",
    mechanicId: "tap_choice",
    decision: "candidate",
    canonicalSkillId: "math.operation.subtraction.within_10",
    assessedEvidenceContract: "choice_accuracy_v1",
    rationale: "The child directly solves 8 minus 2 inside the final Festival scenario; this matches the existing subtraction-within-10 objective."
  }
] as const;

/**
 * Exclusions are intentional. A mechanic looking measurable is not enough:
 * the learning objective must also match an existing canonical skill.
 */
export const MONEY_WORLD_EVIDENCE_EXCLUSIONS: readonly MoneyWorldEvidenceBridgeEntry[] = [
  {
    worldActivityId: "money-s01-activity-01",
    stageId: "money-stage-01-money-use",
    mechanicId: "drag_to_target",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Money-use and price recognition do not currently have a compatible canonical skill."
  },
  {
    worldActivityId: "money-s01-activity-02",
    stageId: "money-stage-01-money-use",
    mechanicId: "matching",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Item-to-price matching is a financial-literacy objective; matching mechanics alone do not justify borrowing an unrelated mastery skill."
  },
  {
    worldActivityId: "money-s02-activity-02",
    stageId: "money-stage-02-price-change",
    mechanicId: "sort_classify",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Classifying price movement is currently a World financial concept, not a registered canonical learning skill."
  },
  {
    worldActivityId: "money-s03-activity-01",
    stageId: "money-stage-03-income-sources",
    mechanicId: "matching",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Work/business income-source recognition has no compatible canonical skill today."
  },
  {
    worldActivityId: "money-s03-activity-02",
    stageId: "money-stage-03-income-sources",
    mechanicId: "sort_classify",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Productive-activity recognition is contextual financial learning rather than an existing Belajar skill."
  },
  {
    worldActivityId: "money-s04-activity-01",
    stageId: "money-stage-04-needs-wants",
    mechanicId: "sort_classify",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Needs/wants prioritization has no canonical skill mapping in the current catalog."
  },
  {
    worldActivityId: "money-s04-activity-02",
    stageId: "money-stage-04-needs-wants",
    mechanicId: "tap_choice",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "A contextual priority choice should not create mastery without a canonical financial-priority skill."
  },
  {
    worldActivityId: "money-s05-activity-01",
    stageId: "money-stage-05-saving",
    mechanicId: "drag_to_target",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Although the child handles three tokens, the objective is saving toward a goal rather than canonical counting evidence."
  },
  {
    worldActivityId: "money-s05-activity-02",
    stageId: "money-stage-05-saving",
    mechanicId: "ordering_sequence",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Sequencing a saving process is procedural financial learning, not the canonical Math number-ordering skill."
  },
  {
    worldActivityId: "money-s06-activity-01",
    stageId: "money-stage-06-investment-intro",
    mechanicId: "matching",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Saving/investment-purpose recognition has no compatible canonical skill."
  },
  {
    worldActivityId: "money-s06-activity-02",
    stageId: "money-stage-06-investment-intro",
    mechanicId: "tap_choice",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Introductory investment recognition remains concept exposure, not canonical mastery evidence."
  },
  {
    worldActivityId: "money-s07-activity-01",
    stageId: "money-stage-07-risk",
    mechanicId: "sort_classify",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Up/down sorting is embedded in a risk concept; it is not currently registered as canonical Math ordering/comparison evidence."
  },
  {
    worldActivityId: "money-s07-activity-02",
    stageId: "money-stage-07-risk",
    mechanicId: "tap_choice",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Risk-statement recognition has no compatible canonical skill and must remain practice-only."
  },
  {
    worldActivityId: "money-s08-activity-01",
    stageId: "money-stage-08-final-festival",
    mechanicId: "drag_to_target",
    decision: "excluded",
    canonicalSkillId: null,
    assessedEvidenceContract: null,
    rationale: "Integrated budget/needs selection combines several concepts and should not be reduced to one unrelated mastery skill."
  }
] as const;

export const MONEY_WORLD_EVIDENCE_BRIDGE_AUDIT = [
  ...MONEY_WORLD_EVIDENCE_CANDIDATES,
  ...MONEY_WORLD_EVIDENCE_EXCLUSIONS
] as const;
