/**
 * Non-invasive, reproducible source inventory for the Belajar visual-system audit.
 * This is NOT a visual QA result, 47-pattern render check or claim of defects.
 * All counts below are source-text heuristics; screenshots and DOM QA are authoritative.
 * Run: node scripts/report-child-visual-system.mjs
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceDir = path.join(root, "src", "components", "learning");
const outputDir = path.join(root, ".qa", "child-visual");
if (!existsSync(sourceDir)) throw new Error("Missing canonical learning component directory");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const filename = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(filename) : [filename];
    })
    .sort();
}

const files = walk(sourceDir);
const tsx = files.filter(filename => filename.endsWith(".tsx"));
const css = files.filter(filename => filename.endsWith(".module.css"));
const count = (text, expression) => [...text.matchAll(expression)].length;
const relative = filename => path.relative(root, filename).replaceAll(path.sep, "/");

const components = tsx.map(filename => {
  const source = readFileSync(filename, "utf8");
  const rendersGarden = /<GardenActivityFrame\b/.test(source);
  const headingCount = count(source, /<h[12]\b/g);
  const heading1Count = count(source, /<h1\b/g);
  const activityCompletion = /<ActivityCompletion\b/.test(source);
  const onDemandAssistance = /aria-expanded\s*=/.test(source);
  const visibleStatus = /role\s*=\s*["']status["']/.test(source);
  const frameTitleCandidate = /<GardenActivityFrame\b[^>]*\btitle\s*=/s.test(source);
  const selectors = [...new Set([...source.matchAll(/data-([a-z0-9-]+)(?:\s|=|>)/g)].map(m => m[1]))].sort();
  return {
    file: relative(filename),
    rendersGarden, headingCount, heading1Count,
    activityCompletion, onDemandAssistance, visibleStatus, frameTitleCandidate,
    dataSelectors: selectors,
    // Review candidate, not a confirmed duplicate title; JSX branches matter.
    potentialHeadingReview: rendersGarden && frameTitleCandidate && heading1Count > 0
  };
}).filter(item =>
  item.rendersGarden || item.activityCompletion ||
  item.headingCount > 0 || item.onDemandAssistance
);

const styles = css.map(filename => {
  const source = readFileSync(filename, "utf8");
  const rules = {
    childTokens: count(source, /--ml-child-[a-z-]+/g),
    fontSizeDeclarations: count(source, /\bfont-size\s*:/g),
    lineHeightDeclarations: count(source, /\bline-height\s*:/g),
    breakpoints: count(source, /@media\s*\(/g),
    hintOrPromptSelectors: count(source, /\.(?:hint|prompt|question|clue)[a-zA-Z0-9_-]*/g)
  };
  return { file: relative(filename), ...rules };
});

const report = {
  generatedAt: new Date().toISOString(),
  source: process.env.GITHUB_SHA || "local-working-tree",
  scope: "Belajar source inventory, not World or Shop",
  truthBoundary: "Heuristic source scan; does not prove visual defects, child comprehension, or 900 screenshots",
  componentFilesScanned: tsx.length,
  cssFilesScanned: css.length,
  gardenOwners: components.filter(item => item.rendersGarden).length,
  possibleHeadingReviewCandidates: components.filter(item => item.potentialHeadingReview).length,
  components,
  styles
};

const candidates = components.filter(item => item.potentialHeadingReview)
  .map(item => `| \`${item.file}\` | ${item.heading1Count} | Garden frame title + local h1; inspect actual DOM and screenshot |`);
const styleHotspots = [...styles].sort((a, b) => b.fontSizeDeclarations - a.fontSizeDeclarations).slice(0, 12)
  .map(item => `| \`${item.file}\` | ${item.fontSizeDeclarations} | ${item.breakpoints} |`);
const markdown = [
  "# Belajar child visual system — source inventory",
  "",
  `Generated: ${report.generatedAt}`,
  `Source: \`${report.source}\``,
  "",
  "**This is heuristic source inventory, not evidence of a UX defect.**",
  `Components scanned: ${report.componentFilesScanned}; CSS modules: ${report.cssFilesScanned}; Garden frame owners: ${report.gardenOwners}.`,
  "",
  "## Potential duplicated-heading review candidates",
  "",
  "| Component | Local h1 count | Interpretation |",
  "|---|---:|---|",
  ...(candidates.length ? candidates : ["| None found by the simple source heuristic | 0 | This does not guarantee a single visible heading |"]),
  "",
  "## Largest typography-CSS owner files (source declarations, not severity)",
  "",
  "| CSS module | font-size declarations | media breakpoints |",
  "|---|---:|---:|",
  ...styleHotspots,
  "",
  "## Use with screenshot evidence",
  "",
  "Inspect 320, 390, 768 and 1280px on real game routes. Confirm visible first action, legibility, touch targets, narration, wrong/correct/complete and focus. Do not auto-rewrite components based on this inventory.",
  ""
].join("\n");

mkdirSync(outputDir, { recursive: true });
writeFileSync(path.join(outputDir, "source-inventory.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(path.join(outputDir, "source-inventory.md"), markdown);
console.log(`Child visual source inventory generated: ${report.componentFilesScanned} TSX, ${report.cssFilesScanned} CSS modules, ${report.gardenOwners} Garden owners, ${report.possibleHeadingReviewCandidates} review candidates (NOT confirmed defects).`);
