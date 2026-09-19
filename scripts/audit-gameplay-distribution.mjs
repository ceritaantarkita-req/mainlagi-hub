import assert from "node:assert/strict";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".learning-test-dist");
const reportDir = path.join(root, ".qa", "gameplay-distribution");
const GLOBAL_HOTSPOT_SHARE = 0.35;
const SUBJECT_HOTSPOT_SHARE = 0.60;

const EXPECTED_PATTERNS = [
  "choice_grid",
  "symbol_hunt",
  "listen_choose",
  "visible_matching",
  "guided_trace",
  "story_read",
  "motion_game",
  "coloring_canvas",
  "drawing_canvas",
  "memory_pair",
  "missing_sequence_slot",
  "syllable_assembly",
  "initial_sound",
  "picture_word_match",
  "sentence_order_cards",
  "reading_passage_question",
  "cloze_sentence_choice",
  "visual_word_problem",
  "spatial_relation_board",
  "phrase_scene_match",
  "growth_stage_transition",
  "single_rule_apply",
  "subitizing_glance",
  "elimination_board",
  "phenomenon_relation_board",
  "shape_attribute_board",
  "sorting_buckets",
  "drag_to_target",
  "odd_one_out",
  "rule_pipeline",
  "set_reasoning",
  "transitive_chain",
  "spatial_transform",
  "relative_order_track",
  "count_and_select",
  "number_line",
  "more_less_balance",
  "pattern_completion",
  "make_total",
  "take_away",
  "equal_groups",
  "cause_effect",
  "compare_properties",
  "healthy_habit_routine",
  "material_lab",
  "feature_function_link",
  "investigation_board"
];

rmSync(outDir, { recursive: true, force: true });
const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], {
  cwd: root,
  stdio: "inherit"
});
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const { ACTIVITIES, SUBJECTS } = require(path.join(outDir, "src", "lib", "learning", "system.js"));
const { canonicalGameplayPattern } = require(path.join(outDir, "src", "lib", "learning", "gameplayPatternClassifier.js"));

function increment(record, key) {
  record[key] = (record[key] ?? 0) + 1;
}

function percent(count, total) {
  return total === 0 ? 0 : Number(((count / total) * 100).toFixed(2));
}

const totalActivities = ACTIVITIES.length;
const overall = {};
const bySubject = {};
const unknown = [];
const activityPatterns = [];

for (const activity of ACTIVITIES) {
  const pattern = canonicalGameplayPattern(activity);
  if (!pattern) {
    unknown.push({ id: activity.id, subjectId: activity.subjectId, runtime: activity.runtime });
    continue;
  }
  increment(overall, pattern);
  bySubject[activity.subjectId] ??= { total: 0, patterns: {} };
  bySubject[activity.subjectId].total += 1;
  increment(bySubject[activity.subjectId].patterns, pattern);
  activityPatterns.push({ id: activity.id, subjectId: activity.subjectId, runtime: activity.runtime, pattern });
}

const activePatterns = Object.entries(overall)
  .filter(([, count]) => count > 0)
  .map(([pattern]) => pattern)
  .sort();

const globalHotspots = Object.entries(overall)
  .map(([pattern, count]) => ({ pattern, count, sharePct: percent(count, totalActivities) }))
  .filter((item) => item.sharePct > GLOBAL_HOTSPOT_SHARE * 100)
  .sort((a, b) => b.count - a.count);

const subjectHotspots = [];
for (const [subjectId, entry] of Object.entries(bySubject)) {
  for (const [pattern, count] of Object.entries(entry.patterns)) {
    const sharePct = percent(count, entry.total);
    if (sharePct > SUBJECT_HOTSPOT_SHARE * 100) {
      subjectHotspots.push({ subjectId, pattern, count, total: entry.total, sharePct });
    }
  }
}
subjectHotspots.sort((a, b) => b.sharePct - a.sharePct || b.count - a.count || a.subjectId.localeCompare(b.subjectId));

const subjectNames = Object.fromEntries(SUBJECTS.map((subject) => [subject.id, subject.title]));
const patternRows = Object.entries(overall)
  .map(([pattern, count]) => ({ pattern, count, sharePct: percent(count, totalActivities) }))
  .sort((a, b) => b.count - a.count || a.pattern.localeCompare(b.pattern));

const report = {
  generatedAt: new Date().toISOString(),
  thresholds: {
    globalHotspotSharePct: GLOBAL_HOTSPOT_SHARE * 100,
    subjectHotspotSharePct: SUBJECT_HOTSPOT_SHARE * 100
  },
  totals: {
    activities: totalActivities,
    classified: activityPatterns.length,
    unclassified: unknown.length,
    activePatterns: activePatterns.length
  },
  patternDistribution: patternRows,
  bySubject: Object.fromEntries(
    Object.entries(bySubject).map(([subjectId, entry]) => [
      subjectId,
      {
        title: subjectNames[subjectId] ?? subjectId,
        total: entry.total,
        patterns: Object.entries(entry.patterns)
          .map(([pattern, count]) => ({ pattern, count, sharePct: percent(count, entry.total) }))
          .sort((a, b) => b.count - a.count || a.pattern.localeCompare(b.pattern))
      }
    ])
  ),
  hotspots: {
    global: globalHotspots,
    bySubject: subjectHotspots
  },
  unclassifiedActivities: unknown,
  activityPatterns
};

mkdirSync(reportDir, { recursive: true });
writeFileSync(path.join(reportDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

const markdown = [
  "# Gameplay Distribution Audit",
  "",
  `Activities classified: **${activityPatterns.length}/${totalActivities}**`,
  `Active child-facing patterns: **${activePatterns.length}**`,
  "",
  "## Overall distribution",
  "",
  "| Pattern | Activities | Share |",
  "| --- | ---: | ---: |",
  ...patternRows.map((item) => `| \`${item.pattern}\` | ${item.count} | ${item.sharePct}% |`),
  "",
  `Global advisory hotspot threshold: **>${GLOBAL_HOTSPOT_SHARE * 100}%**.`,
  "",
  ...(globalHotspots.length
    ? ["Global hotspots:", ...globalHotspots.map((item) => `- \`${item.pattern}\`: ${item.count}/${totalActivities} (${item.sharePct}%)`)]
    : ["Global hotspots: none."]),
  "",
  "## Subject hotspots",
  "",
  `Subject advisory hotspot threshold: **>${SUBJECT_HOTSPOT_SHARE * 100}%** of that subject.`,
  "",
  ...(subjectHotspots.length
    ? subjectHotspots.map((item) => `- **${subjectNames[item.subjectId] ?? item.subjectId}** — \`${item.pattern}\`: ${item.count}/${item.total} (${item.sharePct}%)`)
    : ["No subject-level hotspots."]),
  "",
  "Hotspots are planning signals, not automatic quality failures. New mechanics still require objective fit and evidence safety.",
  ""
].join("\n");
writeFileSync(path.join(reportDir, "report.md"), markdown, "utf8");

try {
  assert.equal(totalActivities, 900, "WS-05 distribution audit expects the current 900-activity product baseline");
  assert.equal(unknown.length, 0, `every activity must map to one gameplay pattern: ${JSON.stringify(unknown)}`);
  assert.equal(activityPatterns.length, totalActivities, "classification coverage must be complete");
  assert.deepEqual(activePatterns, [...EXPECTED_PATTERNS].sort(), "implemented gameplay-pattern set changed; update classifier/catalog intentionally");

  const classifiedTotal = Object.values(overall).reduce((sum, count) => sum + count, 0);
  assert.equal(classifiedTotal, totalActivities, "pattern counts must sum to the complete activity catalog");
  assert.equal(overall.phrase_scene_match, 4, "Pattern 41 must keep exactly four audited phrase-scene activities");
  assert.equal(overall.growth_stage_transition, 3, "Pattern 42 must classify exactly three audited growth-stage activities");
  assert.equal(overall.single_rule_apply, 5, "Pattern 43 must classify exactly five audited single-rule activities");
  assert.equal(overall.subitizing_glance, 3, "Pattern 44 must classify exactly three audited subitizing activities");
  assert.equal(overall.elimination_board, 5, "Pattern 45 must classify exactly five audited elimination activities");
  assert.equal(overall.phenomenon_relation_board, 8, "Phenomenon relation reuse must classify exactly four Earth/sky + four ecosystem activities");
  assert.equal(overall.shape_attribute_board, 4, "Pattern 47 must classify exactly four audited Math shape activities");
  assert.equal(overall.set_reasoning, 10, "Set Reasoning reuse must classify exactly ten audited old+reuse Logic activities");
  assert.equal(overall.spatial_relation_board, 11, "Math spatial reuse must classify exactly six legacy Logic + five Math activities");
  assert.equal(overall.compare_properties, 7, "Math measurement reuse must classify exactly three legacy Science + four Math activities");
  assert.equal(overall.cloze_sentence_choice, 10, "English sentence-completion reuse must classify exactly five Bahasa + five English activities");
  assert.equal(overall.picture_word_match, 23, "English vocabulary reuse must classify exactly five legacy Bahasa + eighteen English activities");
  assert.equal(overall.healthy_habit_routine, 8, "Environment-care reuse must classify exactly four body-health + four environment-care activities");
  assert.equal(overall.number_line, 11, "Math missing-number reuse must classify exactly six legacy ordering + five Wave C missing-number activities");
  assert.equal(overall.make_total, 7, "Math mixed-add reuse must classify exactly five legacy + two mixed-operation additions");
  assert.equal(overall.take_away, 7, "Math mixed-sub reuse must classify exactly five legacy + two mixed-operation subtractions");
  assert.equal(overall.choice_grid, 179, "Math mixed-operation reuse moves exactly four audited direct-result activities out of choice_grid");
  assert.equal(activePatterns.length, 47, "Reuse waves must not create a new gameplay pattern");

  console.log("GAMEPLAY_DISTRIBUTION_AUDIT_SUMMARY", JSON.stringify({
    activities: totalActivities,
    activePatterns: activePatterns.length,
    distribution: Object.fromEntries(patternRows.map((item) => [item.pattern, item.count])),
    globalHotspots,
    subjectHotspotCount: subjectHotspots.length
  }));
  console.log("Gameplay distribution reports written to .qa/gameplay-distribution/report.{json,md}");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
