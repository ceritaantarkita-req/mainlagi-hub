export type MoneyWorldAgeMigrationBlockerKind =
  | "profile"
  | "curriculum"
  | "database"
  | "runtime"
  | "public-copy"
  | "test-contract"
  | "evidence";

export interface MoneyWorldAgeMigrationBlocker {
  id: string;
  kind: MoneyWorldAgeMigrationBlockerKind;
  source: string;
  currentBoundary: string;
  migrationRequirement: string;
}

export const MONEY_WORLD_AGE_MIGRATION_AUDIT_VERSION = "money-world-age-migration-v0";

/**
 * Audit only. The existing Belajar catalog remains 3–7 until an explicit,
 * coordinated migration is approved. This must not be flipped just to make
 * the 6–8 World pilot look complete.
 */
export const MONEY_WORLD_AGE_MIGRATION_ENABLED = false;

export const MONEY_WORLD_AGE_MIGRATION_BLOCKERS: readonly MoneyWorldAgeMigrationBlocker[] = [
  {
    id: "cloud-profile-parser-max-7",
    kind: "profile",
    source: "src/lib/learning/cloud.ts",
    currentBoundary: "learningAgeFromAgeGroup accepts numeric ages only from 3 through 7.",
    migrationRequirement: "Expand profile-age parsing only together with a defined Belajar fallback for ages that have no reviewed canonical activities."
  },
  {
    id: "cloud-profile-create-max-7",
    kind: "profile",
    source: "src/lib/learning/cloud.ts",
    currentBoundary: "createCloudLearningProfile rejects input.age > 7.",
    migrationRequirement: "Coordinate profile creation range with profile UI, World eligibility, and Belajar empty-state behavior."
  },
  {
    id: "local-profile-ui-max-7",
    kind: "profile",
    source: "src/components/learning/ChildLearningPlatform.tsx",
    currentBoundary: "Local child-profile age controls expose only 3, 4, 5, 6, 7.",
    migrationRequirement: "Do not expose older ages until the corresponding profile/read/runtime contract is safe."
  },
  {
    id: "cloud-profile-ui-max-7",
    kind: "profile",
    source: "src/components/learning/CloudProfileScreens.tsx",
    currentBoundary: "Cloud profile age controls expose only 3, 4, 5, 6, 7.",
    migrationRequirement: "Keep cloud and local profile age choices consistent."
  },
  {
    id: "content-validator-max-7",
    kind: "curriculum",
    source: "src/lib/learning/contentArchitecture.ts",
    currentBoundary: "validAgeRange requires ageMax <= 7.",
    migrationRequirement: "Raise validation only after reviewed content is allowed to declare older age ranges; do not blanket-widen existing content."
  },
  {
    id: "learning-skills-db-max-7",
    kind: "database",
    source: "supabase/migrations/0002_learning_attempt_schema.sql",
    currentBoundary: "learning_skills age_min/age_max checks are bounded to 3..7.",
    migrationRequirement: "Add a forward migration for the constraint before any canonical Skill can explicitly cover age 8+."
  },
  {
    id: "content-packs-db-max-7",
    kind: "database",
    source: "supabase/migrations/0011_scalable_content_architecture.sql",
    currentBoundary: "learning_content_packs age_min/age_max checks are bounded to 3..7.",
    migrationRequirement: "Migrate pack constraints only with reviewed older-age content metadata."
  },
  {
    id: "canonical-catalog-max-7",
    kind: "curriculum",
    source: "src/lib/learning/*Batch*.ts + contentManifestBase.ts + systemBase.ts",
    currentBoundary: "Current canonical paths/lessons/packs/skills/activities are authored with ageMax 7.",
    migrationRequirement: "Review content family by family; never reinterpret all 3–7 material as suitable through age 12 by changing one constant."
  },
  {
    id: "age-filtered-belajar-runtime",
    kind: "runtime",
    source: "src/lib/learning/system.ts + progression.ts + child learning screens",
    currentBoundary: "Belajar recommendations and playable activities filter profile age against activity ageMin/ageMax.",
    migrationRequirement: "Before age-8 profiles ship, provide an explicit Belajar behavior for profiles with zero reviewed age-eligible activities."
  },
  {
    id: "public-product-copy-3-7",
    kind: "public-copy",
    source: "src/components/HomePage.tsx",
    currentBoundary: "Public family entry still describes Mainlagi as for ages 3–7.",
    migrationRequirement: "Change public age claims only when the shipped product surfaces actually support the expanded range."
  },
  {
    id: "curriculum-tests-max-7",
    kind: "test-contract",
    source: "scripts/run-curriculum-tests.mjs",
    currentBoundary: "Canonical learning-path test asserts ageMax <= 7.",
    migrationRequirement: "Replace the blanket 7 ceiling with a reviewed product-age contract only when older canonical content is introduced."
  },
  {
    id: "foundation-tests-max-7",
    kind: "test-contract",
    source: "scripts/run-batch6-subject-foundation-tests.mjs",
    currentBoundary: "Foundation regression asserts starter activities remain ageMax <= 7.",
    migrationRequirement: "Preserve historical foundation ranges even after the platform supports older profiles; older support should come from new/reviewed content, not widened starter content."
  },
  {
    id: "world-evidence-age-8",
    kind: "evidence",
    source: "src/lib/learning/world/moneyWorldEvidenceBridge.ts",
    currentBoundary: "The World pilot includes age 8 while candidate canonical Skills currently declare ageMax 7.",
    migrationRequirement: "Do not activate World -> mastery for age 8 until canonical Skill age semantics and server registration are explicitly migrated."
  }
] as const;

export const MONEY_WORLD_AGE_MIGRATION_PHASES = [
  {
    id: "phase-0-audit",
    status: "complete",
    objective: "Keep World pilot 6–8 while documenting every current 3–7 boundary; make no broad age-schema mutation."
  },
  {
    id: "phase-1-profile-capability",
    status: "blocked",
    objective: "Allow profiles beyond age 7 only after child/profile UI, cloud parser, and Belajar no-content behavior are defined together."
  },
  {
    id: "phase-2-reviewed-content-ranges",
    status: "blocked",
    objective: "Introduce reviewed older-age paths/lessons/packs/skills/activities without widening historical 3–7 content by default."
  },
  {
    id: "phase-3-db-validator-migration",
    status: "blocked",
    objective: "Migrate database age constraints and content validators in the same reviewed-content wave."
  },
  {
    id: "phase-4-runtime-adaptive-qa",
    status: "blocked",
    objective: "Verify recommendations, stage eligibility, parent reports, and mobile routes for each newly supported age band."
  },
  {
    id: "phase-5-world-evidence-age-8",
    status: "blocked",
    objective: "Only after the canonical age contract is valid for age 8 may World evidence candidates be considered for server-owned mastery registration."
  }
] as const;

export const MONEY_WORLD_AGE_MIGRATION_INVARIANTS = {
  noBlanketAgeMaxRewrite: true,
  historicalFoundationRangesStayReviewed: true,
  profileRangeMustNotOutrunSafeBelajarFallback: true,
  publicAgeClaimMustMatchShippedCoverage: true,
  worldEvidenceMustRemainDisabledUntilAgeContractCloses: true,
  separateWorldPresentationBandsRemainRequired: true
} as const;
