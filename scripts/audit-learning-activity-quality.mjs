import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outputDir = path.join(root, ".qa", "activity-quality");
const strictStructural = process.argv.includes("--strict-structural");

mkdirSync(outputDir, { recursive: true });

const compile = spawnSync(
  process.execPath,
  ["node_modules/typescript/bin/tsc", "-p", "tsconfig.learning-tests.json"],
  { cwd: root, stdio: "inherit" }
);
assert.equal(compile.status, 0, "learning modules compile before activity-quality audit");

const require = createRequire(import.meta.url);
const system = require(path.join(root, ".learning-test-dist/src/lib/learning/system.js"));
const catalog = require(path.join(root, ".learning-test-dist/src/lib/learning/catalog.js"));
const { coloringScene } = require(path.join(root, ".learning-test-dist/src/lib/learning/coloringScenes.js"));
const { drawingGuide } = require(path.join(root, ".learning-test-dist/src/lib/learning/drawingGuides.js"));

const activities = system.ACTIVITIES;
const subjects = system.SUBJECTS;

const ACTION_RANK = { KEEP: 0, POLISH: 1, REDESIGN: 2, REPLACE: 3 };
const SEVERITY_RANK = { info: 0, medium: 1, high: 2, critical: 3 };
const STRUCTURAL_RULES = new Set([
  "Q001_MISSING_CATALOG_SPEC",
  "Q002_ASSESSED_WITHOUT_SKILL",
  "Q003_CREATIVE_MARKED_ASSESSED",
  "Q004_CHOICE_CONTRACT_INVALID",
  "Q005_MATCHING_CONTRACT_INVALID"
]);

const COLOR_WORDS = new Set([
  "red", "blue", "green", "yellow", "orange", "purple", "pink", "black", "white", "brown", "gray", "grey",
  "merah", "biru", "hijau", "kuning", "jingga", "ungu", "merah muda", "hitam", "putih", "cokelat", "abu abu", "abu-abu"
]);

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function stableToken(value) {
  const raw = String(value ?? "").trim();
  const text = normalizeText(raw);
  return text || raw;
}

function isWord(value) {
  return /^[A-Za-z][A-Za-z -]{1,}$/.test(String(value ?? "").trim());
}

function isSingleAlphaNumeric(value) {
  return /^[A-Za-z0-9]$/.test(String(value ?? "").trim());
}

function promptContainsAnswer(prompt, answer) {
  const normalizedPrompt = normalizeText(prompt);
  const normalizedAnswer = normalizeText(answer);
  if (!normalizedPrompt || !normalizedAnswer) return false;
  return (` ${normalizedPrompt} `).includes(` ${normalizedAnswer} `);
}

function contentFingerprint(activity) {
  return JSON.stringify({
    subjectId: activity.subjectId,
    runtime: activity.runtime,
    prompt: stableToken(activity.prompt),
    choices: activity.choices?.map(stableToken) ?? null,
    correctChoice: stableToken(activity.correctChoice),
    matchItems: activity.matchItems?.map((item) => [stableToken(item.label), stableToken(item.pair)]) ?? null,
    traceGlyph: activity.traceGlyph ?? null,
    storyLines: activity.storyLines?.map(stableToken) ?? null,
    creativePrompt: stableToken(activity.creativePrompt),
    motionGameSlug: activity.motionGameSlug ?? null,
    coloringCharacter: activity.coloringCharacter ?? null,
    drawingGuide: activity.drawingGuide ?? null
  });
}

function templateFingerprint(activity) {
  const prompt = normalizeText(activity.prompt)
    .replace(/\b\d+\b/g, "#")
    .replace(/\b[a-z]\b/g, "letter")
    .replace(/\b(red|blue|green|yellow|orange|purple|pink|black|white|brown|gray|grey)\b/g, "color");
  return `${activity.subjectId}|${activity.runtime}|${prompt}|${activity.choices?.length ?? 0}|${activity.matchItems?.length ?? 0}`;
}

const findings = [];
function addFinding(activity, ruleId, severity, recommendation, message, evidence = {}) {
  findings.push({
    activityId: activity.id,
    subjectId: activity.subjectId,
    stageId: activity.stageId,
    runtime: activity.runtime,
    ruleId,
    severity,
    recommendation,
    message,
    evidence
  });
}

for (const activity of activities) {
  const spec = catalog.getActivityLearningSpec(activity.id);
  const skills = spec?.skills
    ?.map((link) => catalog.getLearningSkill(link.skillId))
    .filter(Boolean) ?? [];

  if (!spec) {
    addFinding(activity, "Q001_MISSING_CATALOG_SPEC", "critical", "REPLACE", "Activity has no canonical learning catalog spec.");
  } else {
    if (spec.assessment === "assessed" && !spec.skills?.length) {
      addFinding(activity, "Q002_ASSESSED_WITHOUT_SKILL", "critical", "REPLACE", "Assessed activity has no measured skill mapping.");
    }
    if (["coloring", "drawing"].includes(activity.runtime) && spec.assessment === "assessed") {
      addFinding(activity, "Q003_CREATIVE_MARKED_ASSESSED", "critical", "REPLACE", "Open creative activity is marked assessed without a validated evaluator.");
    }
  }

  if (["tap_choice", "listen_and_choose"].includes(activity.runtime)) {
    const choices = activity.choices ?? [];
    const unique = new Set(choices.map((choice) => String(choice).trim()));
    const correctIncluded = choices.some((choice) => choice === activity.correctChoice);
    if (choices.length < 2 || unique.size !== choices.length || !activity.correctChoice || !correctIncluded) {
      addFinding(activity, "Q004_CHOICE_CONTRACT_INVALID", "critical", "REPLACE", "Choice activity has invalid choices/correct-answer contract.", {
        choices,
        correctChoice: activity.correctChoice ?? null
      });
    }
  }

  if (activity.runtime === "matching") {
    const items = activity.matchItems ?? [];
    const pairCounts = new Map();
    for (const item of items) pairCounts.set(item.pair, (pairCounts.get(item.pair) ?? 0) + 1);
    const invalidPairs = [...pairCounts.entries()].filter(([, count]) => count !== 2);
    if (items.length < 4 || invalidPairs.length) {
      addFinding(activity, "Q005_MATCHING_CONTRACT_INVALID", "critical", "REPLACE", "Matching activity does not form complete two-item pairs.", {
        itemCount: items.length,
        invalidPairs
      });
    }
  }

  const choices = activity.choices ?? [];
  const normalizedChoices = choices.map(normalizeText);
  const allTextWords = choices.length >= 2 && choices.every(isWord);
  const allColorWords = allTextWords && normalizedChoices.every((choice) => COLOR_WORDS.has(choice));
  const targetText = `${activity.title} ${activity.description} ${activity.prompt ?? ""}`.toLowerCase();
  const colorRecognitionSkill = activity.subjectId === "english" && skills.some((skill) =>
    /color/i.test(`${skill.id} ${skill.title} ${skill.description}`)
  );
  const visualRepresentationSkill = skills.some((skill) =>
    !["language", "literacy"].includes(skill.domain) &&
    /(visual|shape|bentuk|pattern|pola)/i.test(`${skill.id} ${skill.title} ${skill.description}`)
  );

  if (
    activity.runtime === "tap_choice" &&
    colorRecognitionSkill &&
    allColorWords &&
    /(color|blue|red|green|yellow)/i.test(targetText)
  ) {
    addFinding(
      activity,
      "Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL",
      "high",
      "REDESIGN",
      "Color-recognition task uses written color labels as the answer representation instead of actual color visuals.",
      { skillTitles: skills.map((skill) => skill.title), choices, correctChoice: activity.correctChoice ?? null }
    );
  }

  if (activity.runtime === "tap_choice" && visualRepresentationSkill && allTextWords) {
    addFinding(
      activity,
      "Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES",
      "high",
      "REDESIGN",
      "Mapped non-language skill explicitly requires visual/shape/pattern discrimination but the response choices are text-only.",
      { skillTitles: skills.map((skill) => skill.title), choices }
    );
  }

  if (
    activity.runtime === "listen_and_choose" &&
    spec?.assessment === "assessed" &&
    activity.correctChoice &&
    isWord(activity.correctChoice) &&
    promptContainsAnswer(activity.prompt, activity.correctChoice)
  ) {
    addFinding(
      activity,
      "Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT",
      "high",
      "REDESIGN",
      "Assessed listening activity visibly repeats the lexical target in the prompt, allowing reading to substitute for listening.",
      { prompt: activity.prompt ?? null, correctChoice: activity.correctChoice }
    );
  }

  if (
    activity.ageMin <= 3 &&
    activity.runtime === "tap_choice" &&
    choices.length >= 2 &&
    choices.every((choice) => isWord(choice) && normalizeText(choice).length >= 3) &&
    !activity.inputModes?.includes("audio")
  ) {
    addFinding(
      activity,
      "Q104_EARLY_AGE_READING_LOAD",
      "medium",
      "POLISH",
      "Activity is available from age 3 but requires reading multiple word labels without an audio input mode.",
      { ageMin: activity.ageMin, skillDomains: skills.map((skill) => skill.domain), choices }
    );
  }

  if (
    activity.runtime === "tap_choice" &&
    choices.length >= 3 &&
    choices.every(isSingleAlphaNumeric) &&
    activity.correctChoice &&
    promptContainsAnswer(activity.prompt, activity.correctChoice)
  ) {
    addFinding(
      activity,
      "Q105_DIRECT_SYMBOL_DISCRIMINATION",
      "medium",
      "POLISH",
      "Direct symbol-identification multiple choice is valid as a foundation check but is too thin when repeated as a primary game pattern.",
      { prompt: activity.prompt ?? null, choices, correctChoice: activity.correctChoice }
    );
  }

  if (activity.runtime === "drawing" && activity.ageMin <= 5 && !drawingGuide(activity.id)) {
    addFinding(
      activity,
      "Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD",
      "medium",
      "POLISH",
      "Drawing activity for younger children has no explicit drawing guide/scaffold and needs human visual review.",
      { ageMin: activity.ageMin, creativePrompt: activity.creativePrompt ?? null }
    );
  }
}

const exactContentGroups = new Map();
for (const activity of activities) {
  const fingerprint = contentFingerprint(activity);
  const group = exactContentGroups.get(fingerprint) ?? [];
  group.push(activity);
  exactContentGroups.set(fingerprint, group);
}
for (const group of exactContentGroups.values()) {
  if (group.length < 2) continue;
  for (const activity of group) {
    addFinding(
      activity,
      "Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE",
      "high",
      "REDESIGN",
      "Multiple activity IDs resolve to the same interaction content fingerprint.",
      { duplicateIds: group.map((item) => item.id) }
    );
  }
}

const coloringGroups = new Map();
for (const activity of activities.filter((item) => item.runtime === "coloring")) {
  let scene = null;
  try {
    scene = coloringScene(activity.id);
  } catch {
    scene = null;
  }
  if (!scene) continue;
  const fingerprint = JSON.stringify(scene);
  const group = coloringGroups.get(fingerprint) ?? [];
  group.push(activity);
  coloringGroups.set(fingerprint, group);
}
for (const group of coloringGroups.values()) {
  if (group.length < 2) continue;
  const recommendation = group.length >= 3 ? "REDESIGN" : "POLISH";
  const severity = group.length >= 3 ? "high" : "medium";
  for (const activity of group) {
    addFinding(
      activity,
      "Q108_DUPLICATE_COLORING_GEOMETRY",
      severity,
      recommendation,
      "Coloring activities reuse exactly the same scene geometry under different activity IDs.",
      { duplicateIds: group.map((item) => item.id), duplicateCount: group.length }
    );
  }
}

const templateGroups = new Map();
for (const activity of activities) {
  const fingerprint = templateFingerprint(activity);
  const group = templateGroups.get(fingerprint) ?? [];
  group.push(activity.id);
  templateGroups.set(fingerprint, group);
}
const repeatedTemplates = [...templateGroups.entries()]
  .filter(([, ids]) => ids.length >= 6)
  .map(([fingerprint, ids]) => ({ fingerprint, count: ids.length, activityIds: ids }))
  .sort((a, b) => b.count - a.count);

const findingsByActivity = new Map();
for (const finding of findings) {
  const rows = findingsByActivity.get(finding.activityId) ?? [];
  rows.push(finding);
  findingsByActivity.set(finding.activityId, rows);
}

function classificationFor(activity) {
  const rows = findingsByActivity.get(activity.id) ?? [];
  if (!rows.length) return "KEEP";
  return rows.reduce((current, finding) => ACTION_RANK[finding.recommendation] > ACTION_RANK[current] ? finding.recommendation : current, "KEEP");
}

const activityRows = activities.map((activity) => {
  const rows = (findingsByActivity.get(activity.id) ?? []).sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);
  const spec = catalog.getActivityLearningSpec(activity.id);
  return {
    id: activity.id,
    subjectId: activity.subjectId,
    stageId: activity.stageId,
    title: activity.title,
    runtime: activity.runtime,
    ageMin: activity.ageMin,
    ageMax: activity.ageMax,
    assessment: spec?.assessment ?? null,
    classification: classificationFor(activity),
    findings: rows
  };
});

const subjectSummary = Object.fromEntries(subjects.map((subject) => {
  const rows = activityRows.filter((activity) => activity.subjectId === subject.id);
  const classifications = { KEEP: 0, POLISH: 0, REDESIGN: 0, REPLACE: 0 };
  for (const row of rows) classifications[row.classification] += 1;
  return [subject.id, {
    title: subject.title,
    total: rows.length,
    classifications,
    findingCount: rows.reduce((sum, row) => sum + row.findings.length, 0)
  }];
}));

const classifications = { KEEP: 0, POLISH: 0, REDESIGN: 0, REPLACE: 0 };
for (const row of activityRows) classifications[row.classification] += 1;

const ruleSummary = {};
for (const finding of findings) {
  const current = ruleSummary[finding.ruleId] ?? { count: 0, severity: finding.severity, recommendation: finding.recommendation };
  current.count += 1;
  if (SEVERITY_RANK[finding.severity] > SEVERITY_RANK[current.severity]) current.severity = finding.severity;
  if (ACTION_RANK[finding.recommendation] > ACTION_RANK[current.recommendation]) current.recommendation = finding.recommendation;
  ruleSummary[finding.ruleId] = current;
}

const structuralFindings = findings.filter((finding) => STRUCTURAL_RULES.has(finding.ruleId));
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  scope: {
    subjects: subjects.length,
    activities: activities.length
  },
  classifications,
  subjectSummary,
  ruleSummary,
  repeatedTemplates,
  structuralFindingCount: structuralFindings.length,
  activityRows
};

writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);

const markdown = [];
markdown.push("# Mainlagi Activity Quality Audit");
markdown.push("");
markdown.push(`Generated: ${report.generatedAt}`);
markdown.push("");
markdown.push(`Scope: **${subjects.length} subjects / ${activities.length} activities**.`);
markdown.push("");
markdown.push("## Classification summary");
markdown.push("");
markdown.push("| Classification | Count |");
markdown.push("|---|---:|");
for (const action of ["KEEP", "POLISH", "REDESIGN", "REPLACE"]) markdown.push(`| ${action} | ${classifications[action]} |`);
markdown.push("");
markdown.push("## Subject summary");
markdown.push("");
markdown.push("| Subject | Total | KEEP | POLISH | REDESIGN | REPLACE | Findings |");
markdown.push("|---|---:|---:|---:|---:|---:|---:|");
for (const subject of subjects) {
  const row = subjectSummary[subject.id];
  markdown.push(`| ${subject.title} | ${row.total} | ${row.classifications.KEEP} | ${row.classifications.POLISH} | ${row.classifications.REDESIGN} | ${row.classifications.REPLACE} | ${row.findingCount} |`);
}
markdown.push("");
markdown.push("## Rule summary");
markdown.push("");
markdown.push("| Rule | Severity | Recommendation | Count |");
markdown.push("|---|---|---|---:|");
for (const [ruleId, row] of Object.entries(ruleSummary).sort((a, b) => b[1].count - a[1].count)) {
  markdown.push(`| ${ruleId} | ${row.severity} | ${row.recommendation} | ${row.count} |`);
}
markdown.push("");
markdown.push("## Highest-priority flagged activities");
markdown.push("");
const priorityRows = activityRows
  .filter((row) => row.classification === "REPLACE" || row.classification === "REDESIGN")
  .sort((a, b) => ACTION_RANK[b.classification] - ACTION_RANK[a.classification] || a.subjectId.localeCompare(b.subjectId) || a.id.localeCompare(b.id));
for (const row of priorityRows.slice(0, 150)) {
  markdown.push(`### ${row.id} — ${row.classification}`);
  markdown.push("");
  markdown.push(`${row.title} · ${row.subjectId} · ${row.runtime} · age ${row.ageMin}-${row.ageMax} · ${row.assessment ?? "no spec"}`);
  markdown.push("");
  for (const finding of row.findings) markdown.push(`- **${finding.ruleId} (${finding.severity})** — ${finding.message}`);
  markdown.push("");
}
if (priorityRows.length > 150) markdown.push(`_Report truncated here; ${priorityRows.length - 150} additional REDESIGN/REPLACE activities remain in report.json._`);
markdown.push("");
markdown.push("## Repeated template families");
markdown.push("");
for (const group of repeatedTemplates.slice(0, 30)) markdown.push(`- ${group.count} activities — \`${group.fingerprint}\``);
markdown.push("");
markdown.push("This audit is a deterministic triage tool. Heuristic flags are not a substitute for human pedagogical or visual review.");

writeFileSync(path.join(outputDir, "report.md"), `${markdown.join("\n")}\n`);

const summary = {
  subjects: subjects.length,
  activities: activities.length,
  classifications,
  structuralFindingCount: structuralFindings.length,
  flaggedActivities: activityRows.filter((row) => row.classification !== "KEEP").length,
  repeatedTemplateFamilies: repeatedTemplates.length,
  ruleCounts: Object.fromEntries(Object.entries(ruleSummary).map(([key, value]) => [key, value.count]))
};

console.log(`ACTIVITY_QUALITY_AUDIT_SUMMARY ${JSON.stringify(summary)}`);
console.log(`Activity quality reports written to ${path.relative(root, outputDir)}/report.{json,md}`);

if (strictStructural && structuralFindings.length) {
  console.error(`Structural activity-quality contract failed with ${structuralFindings.length} finding(s).`);
  process.exitCode = 1;
}
