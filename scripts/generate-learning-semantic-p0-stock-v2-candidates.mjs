import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const SOURCE_MAP = [
  ["body.head", "body-head.svg", "body-head-v2-candidate.webp"],
  ["action.jump", "action-jump.svg", "action-jump-v2-candidate.webp"],
  ["feature.gills", "feature-gills.svg", "feature-gills-v2-candidate.webp"],
  ["feature.beak", "feature-beak.svg", "feature-beak-v2-candidate.webp"],
  ["feature.cactus-thick-stem", "feature-cactus-thick-stem.svg", "feature-cactus-thick-stem-v2-candidate.webp"],
  ["object.towel", "object-towel.svg", "object-towel-v2-candidate.webp"],
  ["object.raincoat", "object-raincoat.svg", "object-raincoat-v2-candidate.webp"],
  ["object.toy-block", "object-toy-block.svg", "object-toy-block-v2-candidate.webp"],
  ["object.ball", "object-ball.svg", "object-ball-v2-candidate.webp"]
];

function digest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}
function parseArgs(argv) {
  const args = {
    generate: false,
    force: false,
    source: "internal/learning-illustration-stock/p0-v2-source",
    output: "internal/learning-illustration-candidates/p0-v2"
  };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--generate") args.generate = true;
    else if (token === "--force") args.force = true;
    else if (token === "--source-dir") args.source = argv[++index];
    else if (token === "--output") args.output = argv[++index];
    else throw new Error(`unknown argument: ${token}`);
  }
  if (!args.source || !args.output) throw new Error("--source-dir and --output require paths");
  return args;
}

function safePath(relative, label) {
  const resolved = path.resolve(relative);
  const publicRoot = path.resolve("public");
  if (resolved === publicRoot || resolved.startsWith(publicRoot + path.sep)) {
    throw new Error(`${label} refuses public/ path`);
  }
  return resolved;
}
function assertExactSources(sourceDir) {
  if (!existsSync(sourceDir)) throw new Error(`source directory not found: ${sourceDir}`);
  const actual = readdirSync(sourceDir).filter((name) => !name.startsWith(".")).sort();
  const expected = SOURCE_MAP.map(([, source]) => source).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("source directory must contain exactly the canonical nine SVG files");
  }
}

async function renderCandidate(sourceDir, outputDir, semanticKey, sourceFilename, filename) {
  const sourcePath = path.join(sourceDir, sourceFilename);
  const sourceBytes = readFileSync(sourcePath);
  const buffer = await sharp(sourceBytes)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ lossless: true, quality: 100 })
    .toBuffer();
  writeFileSync(path.join(outputDir, filename), buffer);
  const metadata = await sharp(buffer).metadata();
  return {
    semanticKey,
    sourceFilename,
    sourceBytes: sourceBytes.length,
    sourceSha256: digest(sourceBytes),
    filename,
    width: metadata.width,
    height: metadata.height,
    hasAlpha: metadata.hasAlpha,
    bytes: buffer.length,
    sha256: digest(buffer),
    production: false,
    runtimeActive: false,
    humanReviewRequired: true
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceDir = safePath(args.source, "source");
  const outputDir = safePath(args.output, "candidate generator");
  assertExactSources(sourceDir);

  if (!args.generate) {
    console.log("Learning semantic P0 stock v2 candidate generator: DRY RUN");
    console.log(`Would render ${SOURCE_MAP.length} review-only candidates from ${sourceDir} into ${outputDir}`);
    for (const [key, source, file] of SOURCE_MAP) console.log(`- ${key}: ${source} -> ${file}`);
    return;
  }

  if (existsSync(outputDir)) {
    if (!args.force) throw new Error(`output already exists: ${outputDir}; use --force to replace`);
    rmSync(outputDir, { recursive: true, force: true });
  }
  mkdirSync(outputDir, { recursive: true });
  const items = [];
  for (const entry of SOURCE_MAP) items.push(await renderCandidate(sourceDir, outputDir, ...entry));

  const manifest = {
    version: 2,
    scope: "learning-semantic-p0-stock-v2-candidates",
    candidateSet: "p0-v2",
    lifecycle: "review-only",
    sourceMode: "stock-library",
    generatedAt: new Date().toISOString(),
    sourceDirectory: path.relative(process.cwd(), sourceDir).split(path.sep).join("/"),
    outputDirectory: path.relative(process.cwd(), outputDir).split(path.sep).join("/"),
    production: false,
    runtimeActive: false,
    humanReviewRequired: true,
    items
  };
  writeFileSync(path.join(outputDir, "candidate-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Generated ${items.length} stock-backed review-only semantic v2 candidates at ${outputDir}`);
  console.log("No registry lifecycle, public production path, or runtime mapping was changed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
