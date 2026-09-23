import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".learning-test-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], {
  cwd: root,
  stdio: "inherit"
});
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const mastery = require(path.join(outDir, "src", "lib", "learning", "mastery.js"));
const progression = require(path.join(outDir, "src", "lib", "learning", "progression.js"));
const insights = require(path.join(outDir, "src", "lib", "learning", "insights.js"));
const reporting = require(path.join(outDir, "src", "lib", "learning", "reporting.js"));
const attemptsLib = require(path.join(outDir, "src", "lib", "learning", "attempts.js"));
const catalog = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));

const migration = readFileSync(
  path.join(root, "supabase", "migrations", "0049_source_aware_mastery_isolation.sql"),
  "utf8"
);
const wave1Migration = readFileSync(
  path.join(root, "supabase", "migrations", "0048_world_supplemental_evidence_foundation.sql"),
  "utf8"
);
const ingestionSource = readFileSync(
  path.join(root, "src", "lib", "learning", "world", "moneyWorldEvidenceIngestion.ts"),
  "utf8"
);
const worldRuntimeSource = readFileSync(
  path.join(root, "src", "components", "learning", "MoneyWorldExperience.tsx"),
  "utf8"
);
const insightsSource = readFileSync(
  path.join(root, "src", "lib", "learning", "insights.ts"),
  "utf8"
);
const adaptiveSource = readFileSync(
  path.join(root, "src", "lib", "learning", "adaptive.ts"),
  "utf8"
);

function sourceAwareSnapshot(overrides = {}) {
  return {
    skillId: "math.operation.subtraction.within_10",
    score: 0.96,
    confidence: 0.9,
    level: "mastered",
    evidenceCount: 3,
    qualifyingEvidenceCount: 3,
    lastEvidenceAt: "2026-09-23T12:00:00.000Z",
    needsPractice: false,
    canonicalScore: 0.4,
    canonicalConfidence: 0.25,
    canonicalLevel: "exploring",
    canonicalEvidenceCount: 1,
    canonicalQualifyingEvidenceCount: 1,
    canonicalLastEvidenceAt: "2026-09-20T12:00:00.000Z",
    supplementalEvidenceCount: 2,
    supplementalQualifyingEvidenceCount: 2,
    evidenceSource: "belajar-plus-world-supplemental",
    ...overrides
  };
}

try {
  const mixed = sourceAwareSnapshot();
  assert.equal(mastery.canonicalMasteryScore(mixed), 0.4);
  assert.equal(mastery.canonicalMasteryConfidence(mixed), 0.25);
  assert.equal(mastery.canonicalMasteryLevel(mixed), "exploring");
  assert.equal(mastery.canonicalQualifyingEvidenceCount(mixed), 1);
  assert.equal(mastery.canonicalLastEvidenceAt(mixed), "2026-09-20T12:00:00.000Z");
  assert.equal(mastery.masteryEvidenceSource(mixed), "belajar-plus-world-supplemental");
  assert.match(mastery.masteryEvidenceSourceLabel(mixed), /Belajar.*World/i);

  // Backward compatibility: legacy/local snapshots without provenance fields
  // are treated as canonical Belajar state.
  const legacy = {
    skillId: "legacy-skill",
    score: 0.75,
    confidence: 0.6,
    level: "proficient",
    evidenceCount: 2,
    qualifyingEvidenceCount: 2,
    lastEvidenceAt: "2026-09-19T10:00:00.000Z",
    needsPractice: false
  };
  assert.equal(mastery.canonicalMasteryScore(legacy), 0.75);
  assert.equal(mastery.canonicalMasteryLevel(legacy), "proficient");
  assert.equal(mastery.canonicalQualifyingEvidenceCount(legacy), 2);
  assert.equal(mastery.masteryEvidenceSource(legacy), "belajar-only");

  // Semantic attack: combined mastery looks mastered, but canonical Belajar is
  // still below readiness. World supplemental must not unlock a later stage.
  const stage1 = { id: "s1", subjectId: "math", activityIds: ["a1"] };
  const stage2 = { id: "s2", subjectId: "math", activityIds: ["a2"] };
  const stageActivities = [
    {
      id: "a1",
      subjectId: "math",
      stageId: "s1",
      ageMin: 3,
      ageMax: 7,
      requiredForStage: true,
      motionOptional: false,
      skillIds: [mixed.skillId],
      assessed: true
    },
    {
      id: "a2",
      subjectId: "math",
      stageId: "s2",
      ageMin: 3,
      ageMax: 7,
      requiredForStage: true,
      motionOptional: false,
      skillIds: ["next-skill"],
      assessed: true
    }
  ];
  const mixedStage = progression.calculateStageLearningState({
    stage: stage1,
    activities: stageActivities,
    completedActivityIds: ["a1"],
    masteryBySkill: { [mixed.skillId]: mixed }
  });
  assert.equal(mixedStage.evidencedSkillCount, 1);
  assert.equal(mixedStage.evidenceReadiness, 0.4);
  assert.equal(mixedStage.readyToAdvance, false);
  assert.equal(progression.isStageUnlocked({
    targetStageId: "s2",
    stages: [stage1, stage2],
    activities: stageActivities,
    completedActivityIds: ["a1"],
    masteryBySkill: { [mixed.skillId]: mixed }
  }), false, "supplemental World score must not unlock Belajar stage progression");

  const worldOnly = sourceAwareSnapshot({
    canonicalScore: 0,
    canonicalConfidence: 0,
    canonicalLevel: "not_started",
    canonicalEvidenceCount: 0,
    canonicalQualifyingEvidenceCount: 0,
    canonicalLastEvidenceAt: null,
    supplementalEvidenceCount: 1,
    supplementalQualifyingEvidenceCount: 1,
    evidenceSource: "world-supplemental-only"
  });
  const worldOnlyStage = progression.calculateStageLearningState({
    stage: stage1,
    activities: stageActivities,
    completedActivityIds: ["a1"],
    masteryBySkill: { [worldOnly.skillId]: worldOnly }
  });
  assert.equal(worldOnlyStage.evidencedSkillCount, 0);
  assert.equal(worldOnlyStage.evidenceReadiness, 0);
  assert.equal(worldOnlyStage.readyToAdvance, false);

  // Server and client certificate paths both remain canonical-Belajar-only.
  const emptyAnalytics = attemptsLib.emptyLearningAnalytics();
  const mathRequiredIds = system.ACTIVITIES
    .filter((activity) =>
      activity.subjectId === "math"
      && catalog.getActivityLearningSpec(activity.id)?.requiredForStage
    )
    .map((activity) => activity.id);
  const mathAssessedSkillIds = catalog.LEARNING_SKILLS
    .filter((skill) =>
      skill.subjectId === "math"
      && Object.values(catalog.ACTIVITY_LEARNING_SPECS).some((spec) =>
        spec.subjectId === "math"
        && spec.assessment === "assessed"
        && spec.skills.some((link) => link.skillId === skill.id)
      )
    )
    .map((skill) => skill.id);
  assert.ok(mathRequiredIds.length > 0);
  assert.ok(mathAssessedSkillIds.length > 0);

  const forgedCombinedMastery = Object.fromEntries(
    mathAssessedSkillIds.map((skillId) => [
      skillId,
      sourceAwareSnapshot({ skillId })
    ])
  );
  const mathComplete = {
    completedActivityIds: mathRequiredIds,
    stars: 999,
    lastActivityId: mathRequiredIds.at(-1) ?? null
  };
  const forgedCertificate = insights.getCertificateEligibility("math", mathComplete, {
    ...emptyAnalytics,
    masteryBySkill: {
      ...emptyAnalytics.masteryBySkill,
      ...forgedCombinedMastery
    }
  });
  assert.equal(forgedCertificate.completionReady, true);
  assert.equal(forgedCertificate.masteryReady, false);
  assert.equal(forgedCertificate.eligible, false);
  assert.match(forgedCertificate.reason, /Belajar/i);

  const forgedAchievements = insights.getLearningAchievements(
    { completedActivityIds: [], stars: 0, lastActivityId: null },
    {
      ...emptyAnalytics,
      masteryBySkill: {
        ...emptyAnalytics.masteryBySkill,
        [mixed.skillId]: mixed
      }
    }
  );
  assert.equal(forgedAchievements.some((item) => item.id === "first-proficient"), false);
  assert.equal(forgedAchievements.some((item) => item.id === "first-mastered"), false);

  // Parent report may show combined mastery but must label its provenance.
  // Weekly qualifyingEvidence stays tied to Belajar attempts only.
  const report = reporting.buildWeeklyLearningReport({
    ...emptyAnalytics,
    masteryBySkill: {
      ...emptyAnalytics.masteryBySkill,
      [mixed.skillId]: mixed
    }
  }, Date.parse("2026-09-23T12:30:00.000Z"));
  assert.equal(report.qualifyingEvidence, 0);
  const surfaced = [report.strongestSkill, report.needsPracticeSkill]
    .filter(Boolean)
    .find((item) => item.id === mixed.skillId);
  assert.ok(surfaced, "source-aware mastery should remain visible to the parent report");
  assert.equal(surfaced.evidenceSource, "belajar-plus-world-supplemental");
  assert.match(surfaced.sourceLabel, /World/i);
  assert.equal(surfaced.supplementalQualifyingEvidenceCount, 2);

  // Database contract: provenance is additive and canonical gates own
  // progression/reward/certificate semantics.
  for (const column of [
    "canonical_mastery_score",
    "canonical_confidence",
    "canonical_mastery_level",
    "canonical_evidence_count",
    "canonical_qualifying_evidence_count",
    "canonical_last_evidence_at",
    "supplemental_evidence_count",
    "supplemental_qualifying_evidence_count",
    "evidence_source_policy"
  ]) {
    assert.match(
      migration,
      new RegExp(`add column if not exists ${column}\\b`, "i"),
      `Wave 2 missing source-aware mastery column ${column}`
    );
  }

  assert.match(
    migration,
    /from public\.learning_attempt_skill_evidence[\s\S]*union all[\s\S]*from public\.learning_supplemental_skill_evidence/i,
    "source-aware recompute must combine canonical and supplemental evidence"
  );
  assert.match(
    migration,
    /elsif v_canonical_count >= 2[\s\S]*v_combined_score >= 0\.70[\s\S]*v_combined_level := 'proficient'/i,
    "proficient combined level must retain at least two canonical Belajar evidence points"
  );
  assert.match(
    migration,
    /elsif v_canonical_count >= 1[\s\S]*v_combined_count >= 2[\s\S]*v_combined_score >= 0\.45[\s\S]*v_combined_level := 'developing'/i,
    "developing+ must require canonical Belajar evidence"
  );
  assert.match(
    migration,
    /else[\s\S]*v_combined_level := 'exploring'/i,
    "World-only evidence must fall through to exploring"
  );
  assert.match(
    migration,
    /create or replace function private\.refresh_world_supplemental_mastery\(\)[\s\S]*perform public\.recompute_child_skill_mastery/i,
    "supplemental evidence must refresh the source-aware snapshot through a private trigger"
  );
  assert.match(
    migration,
    /revoke all on function private\.refresh_world_supplemental_mastery\(\)[\s\S]*from public, anon, authenticated, service_role/i,
    "supplemental mastery trigger helper must not be callable through API roles"
  );
  assert.match(
    migration,
    /canonical_mastery_level in \('proficient','mastered'\)[\s\S]*canonical_qualifying_evidence_count >= 2/i,
    "certificate readiness must use canonical Belajar level and count"
  );
  assert.match(
    migration,
    /'evidence_policy', 'belajar-canonical-only-v2'/i,
    "issued certificate snapshot must record its canonical evidence policy"
  );
  assert.doesNotMatch(
    migration,
    /insert into public\.child_learning_progress/i,
    "Wave 2 must not create Belajar completion from World evidence"
  );
  assert.doesNotMatch(
    migration,
    /total_stars\s*=|total_stars\s*\+/i,
    "Wave 2 must not award Belajar stars from supplemental evidence"
  );
  assert.doesNotMatch(
    migration,
    /update public\.learning_activities/i,
    "Wave 2 must not promote Stage 8 or mutate activity assessment"
  );

  // Existing activation blockers remain independently false/disconnected.
  assert.match(wave1Migration, /v_mapping_active constant boolean := false/i);
  assert.match(ingestionSource, /MONEY_WORLD_EVIDENCE_INGESTION_ENABLED = false/i);
  assert.doesNotMatch(
    worldRuntimeSource,
    /moneyWorldEvidenceIngestion|\/api\/learning\/world-evidence|record_world_skill_evidence/,
    "World runtime must remain disconnected in Wave 2"
  );

  assert.match(
    insightsSource,
    /canonicalQualifyingEvidenceCount\(snapshot\) >= 2/i,
    "client certificate preview must use canonical Belajar evidence count"
  );
  assert.match(
    adaptiveSource,
    /canonicalLastEvidenceAt\(snapshot\)/i,
    "adaptive spacing must ignore supplemental-only recency"
  );

  console.log("World evidence source-aware mastery, progression, certificate, report, and activation-isolation tests passed.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
