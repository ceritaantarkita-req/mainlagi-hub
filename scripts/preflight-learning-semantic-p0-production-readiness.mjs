import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const registryPath = path.join(root, "src", "lib", "data", "learning-illustration-asset-provenance.json");

const CLEAR_SCOPE = [
  ["action.jump", "action-jump.svg"],
  ["animal.bird", "animal-bird.svg"],
  ["animal.cat", "animal-cat.svg"],
  ["animal.fish", "animal-fish.svg"],
  ["body.head", "body-head.svg"],
  ["feature.beak", "feature-beak.svg"],
  ["feature.cactus-thick-stem", "feature-cactus-thick-stem.svg"],
  ["feature.gills", "feature-gills.svg"],
  ["object.apple", "object-apple.svg"],
  ["object.ball", "object-ball.svg"],
  ["object.cup", "object-cup.svg"],
  ["object.house", "object-house.svg"],
  ["object.toy-block", "object-toy-block.svg"],
  ["object.umbrella", "object-umbrella.svg"]
];

const HELD_KEYS = ["object.raincoat", "object.towel", "vehicle.car"];
const ALL_KEYS = [...CLEAR_SCOPE.map(([key]) => key), ...HELD_KEYS].sort();

function digest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function slash(value) {
  return value.split(path.sep).join("/");
}

function parseArgs(argv) {
  const args = {
    generate: false,
    force: false,
    source: "internal/learning-illustration-production-readiness/p0-clear-source",
    output: "internal/learning-illustration-production-readiness/p0-clear-preflight"
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

function safeInternalPath(value, label) {
  const resolved = path.resolve(root, value);
  const publicRoot = path.resolve(root, "public");
  if (resolved === publicRoot || resolved.startsWith(publicRoot + path.sep)) {
    throw new Error(`${label} refuses public/ path`);
  }
  return resolved;
}

function readRegistry() {
  if (!existsSync(registryPath)) throw new Error("missing learning illustration provenance registry");
  const bytes = readFileSync(registryPath);
  let registry;
  try {
    registry = JSON.parse(bytes.toString("utf8"));
  } catch (error) {
    throw new Error(`invalid learning illustration provenance registry: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (registry?.version !== 1 || registry.scope !== "learning-semantic-illustration" || !registry.items) {
    throw new Error("unexpected learning illustration provenance registry header");
  }
  const actualKeys = Object.keys(registry.items).sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(ALL_KEYS)) {
    throw new Error("registry semantic scope differs from canonical 17-key P0 contract");
  }

  for (const key of ALL_KEYS) {
    const record = registry.items[key];
    if (record.lifecycle !== "review-required") throw new Error(`${key}: preflight requires lifecycle=review-required`);
    if (record.productionPath !== null || record.productionSha256 !== null) {
      throw new Error(`${key}: preflight requires no production path/SHA`);
    }
    if (record.provenance?.redistributionAllowed !== false) {
      throw new Error(`${key}: preflight requires production redistribution to remain fail-closed`);
    }
    if (record.semanticReview?.status !== "pending") {
      throw new Error(`${key}: preflight requires semantic review to remain pending in production registry`);
    }
  }

  return { registry, bytes };
}

function assertExactSources(sourceDir) {
  if (!existsSync(sourceDir)) throw new Error(`source directory not found: ${sourceDir}`);
  const actual = readdirSync(sourceDir).filter((name) => !name.startsWith(".")).sort();
  const expected = CLEAR_SCOPE.map(([, filename]) => filename).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("source directory must contain exactly the 14 canonical clear-scope SVG files");
  }
}

async function renderPreflight(sourceDir, outputDir, registry, semanticKey, sourceFilename) {
  const sourcePath = path.join(sourceDir, sourceFilename);
  const sourceBytes = readFileSync(sourcePath);
  const record = registry.items[semanticKey];
  const expectedProductionPath = record.expectedProductionPath;
  const filename = path.posix.basename(expectedProductionPath);

  const buffer = await sharp(sourceBytes)
    .ensureAlpha()
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ lossless: true, quality: 100 })
    .toBuffer();

  const outputPath = path.join(outputDir, filename);
  writeFileSync(outputPath, buffer);
  const metadata = await sharp(buffer).metadata();
  const size = statSync(outputPath).size;
  const technical = record.technical;

  if (metadata.format !== "webp" || metadata.width !== 512 || metadata.height !== 512 || metadata.hasAlpha !== true) {
    throw new Error(`${semanticKey}: preflight WebP must be 512x512 with alpha`);
  }
  if (metadata.width < technical.minWidth || metadata.width > technical.maxWidth ||
      metadata.height < technical.minHeight || metadata.height > technical.maxHeight) {
    throw new Error(`${semanticKey}: preflight dimensions violate production technical bounds`);
  }
  if (size > technical.maxBytes) {
    throw new Error(`${semanticKey}: preflight exceeds production maxBytes (${size} > ${technical.maxBytes})`);
  }

  return {
    semanticKey,
    sourceFilename,
    sourceBytes: sourceBytes.length,
    sourceSha256: digest(sourceBytes),
    expectedProductionPath,
    preflightFilename: filename,
    width: metadata.width,
    height: metadata.height,
    hasAlpha: metadata.hasAlpha,
    bytes: size,
    sha256: digest(buffer),
    lifecycle: "preflight-only",
    legalApproval: false,
    productionApproval: false,
    production: false,
    runtimeActive: false
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceDir = safeInternalPath(args.source, "preflight source");
  const outputDir = safeInternalPath(args.output, "preflight output");
  const { registry, bytes: registryBefore } = readRegistry();
  assertExactSources(sourceDir);

  if (!args.generate) {
    console.log("Learning semantic P0 production-readiness preflight: DRY RUN");
    console.log(`Clear scope: ${CLEAR_SCOPE.length}/17; held scope: ${HELD_KEYS.length}/17`);
    console.log(`Would render ${CLEAR_SCOPE.length} non-production WebP preflight files from ${sourceDir} into ${outputDir}`);
    for (const [key, source] of CLEAR_SCOPE) {
      console.log(`- ${key}: ${source} -> ${path.posix.basename(registry.items[key].expectedProductionPath)}`);
    }
    console.log(`Held keys excluded: ${HELD_KEYS.join(", ")}`);
    console.log("No production registry approval, public binary, or runtime activation will be created.");
    return;
  }

  if (existsSync(outputDir)) {
    if (!args.force) throw new Error(`output already exists: ${outputDir}; use --force to replace`);
    rmSync(outputDir, { recursive: true, force: true });
  }
  mkdirSync(outputDir, { recursive: true });

  const items = [];
  for (const [semanticKey, sourceFilename] of CLEAR_SCOPE) {
    items.push(await renderPreflight(sourceDir, outputDir, registry, semanticKey, sourceFilename));
  }

  const manifest = {
    version: 1,
    scope: "learning-semantic-p0-production-readiness-preflight",
    lifecycle: "preflight-only",
    generatedAt: new Date().toISOString(),
    sourceDirectory: slash(path.relative(root, sourceDir)),
    outputDirectory: slash(path.relative(root, outputDir)),
    clearCount: CLEAR_SCOPE.length,
    heldCount: HELD_KEYS.length,
    heldKeys: HELD_KEYS,
    legalApproval: false,
    productionApproval: false,
    production: false,
    runtimeActive: false,
    items
  };
  writeFileSync(path.join(outputDir, "preflight-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  const registryAfter = readFileSync(registryPath);
  if (!registryBefore.equals(registryAfter)) {
    throw new Error("production provenance registry changed during preflight");
  }

  console.log(`Generated ${items.length} internal production-readiness preflight files at ${outputDir}`);
  console.log(`Held keys intentionally excluded: ${HELD_KEYS.join(", ")}`);
  console.log("No production registry approval, public binary, or runtime activation was created.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
