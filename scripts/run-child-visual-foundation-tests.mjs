import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const root = process.cwd();
const read = (p) => readFileSync(path.join(root, p), "utf8");
const mobile = read("src/components/learning/mobile/MobileFoundation.module.css");
const css = read("src/components/learning/ChildVisualHierarchy.module.css");
const source = read("src/lib/learning/childVisualHierarchy.ts");
const contract = read("docs/CHILD_VISUAL_FOUNDATION_V1_2026-10-15.md");

for (const token of [
  "--ml-child-context-size", "--ml-child-question-size",
  "--ml-child-answer-size", "--ml-child-support-size",
  "--ml-child-stage-heading-size", "--ml-child-question-measure",
  "--ml-child-content-measure", "--ml-child-interaction-gap",
  "--ml-child-preferred-tap", "--ml-child-answer-card-min"
]) {
  assert.ok(mobile.includes(token + ":"), `Missing shared child token: ${token}`);
  assert.ok(css.includes(`var(${token}`), `Opt-in component must consume inherited child token: ${token}`);
}
assert.match(mobile, /\.routeBoundary\[data-mainlagi-route-boundary="child-learning"\]\s*\{/,
  "visual hierarchy tokens must be scoped to the existing child-learning boundary");
assert.match(css, /\.primaryInstruction\s*\{/, "shared primary instruction presentation is required");
assert.match(css, /\.contextLabel\s*\{/, "shared non-task contextual label presentation is required");
assert.match(css, /\.playfield\s*\{/, "shared unboxed gameplay boundary is required");
assert.match(css, /\.choiceGrid\s*\{/, "simple choice grids must opt in independently of special mechanics");
assert.match(css, /\.stageHeading\s*\{/, "stage heading needs a separate semantic role");
assert.match(css, /\.choice:focus-visible/, "keyboard focus style must remain explicit");
assert.match(css, /min\(100%,\s*var\(--ml-child-answer-card-min/, "answer grid must collapse before narrow-card labels wrap");
assert.doesNotMatch(css, /overflow-wrap:\s*anywhere|word-break:\s*break-all|overflow-x:\s*(?:hidden|clip)/,
  "opt-in typography must not arbitrarily fracture words or hide overflow");
assert.doesNotMatch(css, /(^|\n)\s*(?:h1|h2|p|button)\s*\{/m,
  "no global element styling; all classes must be opt-in");

const compiled = ts.transpileModule(source, {
  fileName: "childVisualHierarchy.ts",
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  reportDiagnostics: true
});
assert.deepEqual(compiled.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error) ?? [], [],
  "pure presentation policy must transpile without diagnostics");
const exports = {};
const compiledModule = { exports };
runInNewContext(compiled.outputText, { exports, module: compiledModule }, { filename: "childVisualHierarchy.js" });
const { planChildVisualHierarchy } = compiledModule.exports;
assert.equal(typeof planChildVisualHierarchy, "function");

const logic = planChildVisualHierarchy({
  mode: "sorting",
  activityTitle: "Cari arah ke atas",
  visibleInstruction: "Panah mana yang mengarah ke atas?",
  supportingHint: "Pilih satu kartu, lalu masukkan ke keranjang yang sesuai."
});
assert.equal(logic.primaryInstruction, "Panah mana yang mengarah ke atas?");
assert.equal(logic.contextTitle, "Cari arah ke atas");
assert.equal(logic.onDemandHelp, "Pilih satu kartu, lalu masukkan ke keranjang yang sesuai.");
assert.equal(logic.firstAction, "sort");
assert.equal(logic.initiallyVisiblePrimaryInstructions, 1);

const science = planChildVisualHierarchy({
  mode: "choice",
  activityTitle: "Biji dapat tumbuh",
  visibleInstruction: "Dengan air dan kondisi yang sesuai, biji dapat tumbuh menjadi apa?"
});
assert.equal(science.primaryInstruction, "Dengan air dan kondisi yang sesuai, biji dapat tumbuh menjadi apa?",
  "foundation must never silently edit curriculum wording or correct answers");
assert.equal(science.onDemandHelp, null);
assert.equal(science.firstAction, "choose");

const audio = planChildVisualHierarchy({
  mode: "audio-first",
  activityTitle: "Find blue",
  visibleInstruction: "Listen, then choose the best answer.",
  supportingHint: "Listen, then choose the best answer."
});
assert.equal(audio.primaryInstruction, "Listen, then choose the best answer.");
assert.equal(audio.onDemandHelp, null, "repeated instruction must not become a second help strip");
assert.equal(audio.firstAction, "listen");
assert.throws(
  () => planChildVisualHierarchy({ mode: "audio-first", activityTitle: "Find blue" }),
  /answer-safe visible instruction/,
  "audio-first must not fall back to secret audio-only text or title"
);
assert.throws(() => planChildVisualHierarchy({ mode: "creative", activityTitle: "  " }), /canonical activity title/);
assert.equal(planChildVisualHierarchy({ mode: "creative", activityTitle: "Garis tegak" }).firstAction, "draw");
assert.equal(planChildVisualHierarchy({ mode: "reading", activityTitle: "Baca cerita" }).firstAction, "read");

for (const clause of [
  "one primary instruction", "opt-in", "320", "390", "768", "1280",
  "SortingBucketsChoiceActivity", "ChildLearningPlatform",
  "DrawingStageScreen", "Cloudflare", "PR #508"
]) {
  assert.ok(contract.toLowerCase().includes(clause.toLowerCase()), `Missing documented QA boundary: ${clause}`);
}
console.log("Child visual hierarchy foundation PASS: scoped tokens, opt-in primitives, policy, no hidden audio answers, responsive and implementation boundaries.");
