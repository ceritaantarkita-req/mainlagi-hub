import assert from "node:assert/strict";
import { rmSync } from "node:fs";
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
const catalog = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));
const attempts = require(path.join(outDir, "src", "lib", "learning", "attempts.js"));
const progression = require(path.join(outDir, "src", "lib", "learning", "progression.js"));
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));

function outcome({
  accuracy = 1,
  correctCount,
  incorrectCount,
  hintCount = 0,
  retryCount = 0,
  assessed = true,
  status = "completed",
  completedAt = "2026-09-09T10:00:00.000Z",
  metadata
} = {}) {
  return mastery.normalizeLearningAttemptOutcome({
    assessed,
    accuracy,
    correctCount,
    incorrectCount,
    hintCount,
    retryCount,
    status,
    completedAt,
    metadata
  });
}

function evidence({
  id,
  accuracy = 1,
  hintCount = 0,
  retryCount = 0,
  completedAt,
  masteryEligible = true,
  activityId = "x",
  skillId = "s"
}) {
  return mastery.createSkillEvidence({
    attemptId: id,
    activityId,
    skillId,
    outcome: outcome({ accuracy, hintCount, retryCount, completedAt }),
    masteryEligible
  });
}

try {
  // Normalization and evidence fidelity.
  const perfect = mastery.normalizeLearningAttemptOutcome({
    assessed: true,
    correctCount: 1,
    incorrectCount: 0,
    retryCount: 0,
    completedAt: "2026-09-09T10:00:00.000Z"
  });
  assert.equal(perfect.accuracy, 1);
  assert.ok(Math.abs(mastery.calculateEvidenceScore(perfect) - 1) < 1e-9);

  const wrongThenRight = mastery.normalizeLearningAttemptOutcome({
    assessed: true,
    correctCount: 1,
    incorrectCount: 1,
    completedAt: "2026-09-09T10:01:00.000Z"
  });
  assert.equal(wrongThenRight.accuracy, 0.5, "incorrect answers must lower measured accuracy");
  assert.ok(mastery.calculateEvidenceScore(wrongThenRight) < mastery.calculateEvidenceScore(perfect), "lower accuracy must lower evidence score");

  const assisted = outcome({ accuracy: 1, hintCount: 2, retryCount: 2 });
  assert.ok(mastery.calculateEvidenceScore(assisted) < mastery.calculateEvidenceScore(perfect), "hints and retries must reduce evidence quality");

  const abandoned = outcome({ accuracy: 1, status: "abandoned" });
  assert.equal(mastery.calculateEvidenceScore(abandoned), null, "abandoned attempts must not create mastery evidence");

  const completionOnly = outcome({ assessed: false, accuracy: undefined, metadata: { evidenceFidelity: "completion_only" } });
  assert.equal(mastery.calculateEvidenceScore(completionOnly), null, "completion-only attempts must not create mastery evidence");

  // Explicit mastery transition contract.
  const firstStrong = evidence({ id: "strong-1", accuracy: 1, completedAt: "2026-09-09T10:00:00.000Z" });
  assert.ok(firstStrong);
  let snapshot = mastery.calculateSkillMastery("s", [firstStrong]);
  assert.equal(snapshot.level, "exploring", "one perfect attempt must never create false mastery");
  assert.equal(snapshot.qualifyingEvidenceCount, 1);

  const developingEvidence = [
    evidence({ id: "dev-1", accuracy: 0.4, completedAt: "2026-09-09T10:02:00.000Z" }),
    evidence({ id: "dev-2", accuracy: 0.4, completedAt: "2026-09-09T10:03:00.000Z" })
  ].filter(Boolean);
  snapshot = mastery.calculateSkillMastery("s", developingEvidence);
  assert.equal(snapshot.level, "developing", "two moderate evidence points should reach developing, not proficient");
  assert.ok(snapshot.score >= 0.45 && snapshot.score < 0.7);

  const proficientEvidence = [
    evidence({ id: "prof-1", accuracy: 0.75, completedAt: "2026-09-09T10:04:00.000Z" }),
    evidence({ id: "prof-2", accuracy: 0.75, completedAt: "2026-09-09T10:05:00.000Z" })
  ].filter(Boolean);
  snapshot = mastery.calculateSkillMastery("s", proficientEvidence);
  assert.equal(snapshot.level, "proficient", "two strong evidence points should reach proficient but not mastered");
  assert.equal(snapshot.qualifyingEvidenceCount, 2);

  const masteredEvidence = [0, 1, 2].map((index) => evidence({
    id: `master-${index + 1}`,
    activityId: index === 1 ? "y" : "x",
    accuracy: 1,
    completedAt: `2026-09-09T10:0${6 + index}:00.000Z`
  })).filter(Boolean);
  snapshot = mastery.calculateSkillMastery("s", masteredEvidence);
  assert.equal(snapshot.level, "mastered");
  assert.ok(snapshot.confidence >= 0.65);
  assert.equal(snapshot.qualifyingEvidenceCount, 3);

  // Anti-farming: non-qualifying repeats can be stored, but cannot advance mastery.
  const retryHeavy = outcome({ accuracy: 1, retryCount: 7 });
  const retryEvidence = mastery.createSkillEvidence({
    attemptId: "retry-heavy",
    activityId: "x",
    skillId: "s",
    outcome: retryHeavy
  });
  assert.ok(retryEvidence);
  assert.equal(retryEvidence.qualifiesForMastery, false, "excessive retries should not count toward mastery");

  const twoValid = proficientEvidence;
  const spam = Array.from({ length: 10 }, (_, index) => evidence({
    id: `spam-${index}`,
    accuracy: 1,
    completedAt: `2026-09-09T11:${String(index).padStart(2, "0")}:00.000Z`,
    masteryEligible: false
  })).filter(Boolean);
  snapshot = mastery.calculateSkillMastery("s", [...twoValid, ...spam]);
  assert.equal(snapshot.level, "proficient", "non-qualifying replay spam must not farm mastered status");
  assert.equal(snapshot.qualifyingEvidenceCount, 2);
  assert.equal(snapshot.evidenceCount, 12, "non-qualifying evidence remains auditable even when excluded from mastery");

  // Local assessment classification mirrors server-owned catalog classification.
  const practiceAttempt = attempts.recordLearningAttempt({
    childId: "test-child",
    activityId: "color-gavi",
    subjectId: "color",
    stageId: "color-characters",
    runtime: "coloring",
    outcome: { assessed: true, accuracy: 1, completedAt: "2026-09-09T12:00:00.000Z" }
  });
  assert.equal(practiceAttempt.assessed, false, "callers must not promote a practice activity to assessed");
  assert.equal(practiceAttempt.evidence.length, 0, "practice activity must not generate mastery evidence");

  const downgradedAssessedAttempt = attempts.recordLearningAttempt({
    childId: "test-child",
    activityId: "bahasa-cari-a",
    subjectId: "bahasa",
    stageId: "bahasa-huruf",
    runtime: "tap_choice",
    outcome: {
      assessed: false,
      completedAt: "2026-09-09T12:01:00.000Z",
      metadata: { evidenceFidelity: "completion_only" }
    }
  });
  assert.equal(downgradedAssessedAttempt.assessed, false, "an assessed catalog activity may remain completion-only when measurement is unavailable");
  assert.equal(downgradedAssessedAttempt.evidence.length, 0);

  // Catalog integrity: every activity has exactly one learning spec and all
  // assessed activities have an evidence-measurable runtime contract.
  const skillIds = new Set(catalog.LEARNING_SKILLS.map((skill) => skill.id));
  const systemActivityIds = new Set(system.ACTIVITIES.map((activity) => activity.id));
  const specIds = new Set(Object.keys(catalog.ACTIVITY_LEARNING_SPECS));
  assert.deepEqual([...specIds].sort(), [...systemActivityIds].sort(), "system activities and learning catalog specs must stay in sync");

  for (const activity of system.ACTIVITIES) {
    const spec = catalog.getActivityLearningSpec(activity.id);
    assert.ok(spec, `missing learning spec for ${activity.id}`);
    assert.equal(spec.subjectId, activity.subjectId, `${activity.id} subject mismatch`);
    assert.equal(spec.stageId, activity.stageId, `${activity.id} stage mismatch`);
    assert.ok(spec.skills.length > 0, `${activity.id} must map to at least one skill`);
    for (const link of spec.skills) {
      assert.ok(skillIds.has(link.skillId), `${activity.id} references unknown skill ${link.skillId}`);
      assert.ok(link.weight > 0, `${activity.id} evidence weight must be positive`);
    }

    if (spec.assessment === "assessed") {
      assert.ok(
        ["tap_choice", "listen_and_choose", "matching", "trace"].includes(activity.runtime),
        `${activity.id} is assessed but runtime ${activity.runtime} has no measurable bridge contract`
      );
      if (activity.runtime === "tap_choice" || activity.runtime === "listen_and_choose") {
        assert.ok(Array.isArray(activity.choices) && activity.choices.length >= 2, `${activity.id} assessed choice activity needs choices`);
        assert.ok(activity.correctChoice && activity.choices.includes(activity.correctChoice), `${activity.id} assessed choice activity needs a valid correctChoice`);
      }
      if (activity.runtime === "matching") {
        assert.ok(Array.isArray(activity.matchItems) && activity.matchItems.length >= 2, `${activity.id} assessed matching activity needs match items`);
        const counts = new Map();
        for (const item of activity.matchItems) counts.set(item.pair, (counts.get(item.pair) ?? 0) + 1);
        for (const count of counts.values()) assert.equal(count, 2, `${activity.id} matching pairs must contain exactly two items`);
      }
      if (activity.runtime === "trace") {
        assert.equal(activity.id, "math-trace-5-touch", "only the guided touch trace currently has assessed trace fidelity");
        assert.ok(activity.traceGlyph, `${activity.id} assessed trace activity needs a trace glyph`);
      }
    }
  }

  // Progression remains gated by completion/mastery rather than score farming.
  const stage1 = { id: "stage-1", subjectId: "math", activityIds: ["a"] };
  const stage2 = { id: "stage-2", subjectId: "math", activityIds: ["b"] };
  const activities = [
    { id: "a", subjectId: "math", stageId: "stage-1", ageMin: 3, ageMax: 7, requiredForStage: true, motionOptional: false, skillIds: ["s"], assessed: true },
    { id: "b", subjectId: "math", stageId: "stage-2", ageMin: 3, ageMax: 7, requiredForStage: true, motionOptional: false, skillIds: ["t"], assessed: true }
  ];
  const masteryBySkill = {
    s: { ...mastery.calculateSkillMastery("s", masteredEvidence), level: "developing", score: 0.7 },
    t: mastery.calculateSkillMastery("t", [])
  };
  assert.equal(progression.isStageUnlocked({ targetStageId: "stage-1", stages: [stage1, stage2], activities, completedActivityIds: [], masteryBySkill }), true);
  assert.equal(progression.isStageUnlocked({ targetStageId: "stage-2", stages: [stage1, stage2], activities, completedActivityIds: [], masteryBySkill }), false);
  assert.equal(progression.isStageUnlocked({ targetStageId: "stage-2", stages: [stage1, stage2], activities, completedActivityIds: ["a"], masteryBySkill }), true);

  const ranked = progression.rankNextActivities({ age: 5, stages: [stage1, stage2], activities, completedActivityIds: ["a"], masteryBySkill, lastActivityId: "a" });
  assert.equal(ranked[0], "b");

  console.log("Learning mastery, anti-farming, catalog, and progression tests passed.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
