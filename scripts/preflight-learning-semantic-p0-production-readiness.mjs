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

function validSha(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
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

  if (
    registry?.version !== 2 ||
    registry.scope !== "learning-semantic-illustration" ||
    registry.preferredProductionFormat !== "svg" ||
    !["off", "controlled-svg"].includes(registry.runtimeActivation) ||
    !registry.items
  ) {
    throw new Error("unexpected learning illustration provenance registry v2 header");
  }

  const actualKeys = Object.keys(registry.items).sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(ALL_KEYS)) {
    throw new Error("registry semantic scope differs from canonical 17-key P0 contract");
  }

  for (const [key] of CLEAR_SCOPE) {
    const record = registry.items[key];
    const slug = key.replaceAll(".", "-");
    const expectedWebp = `/artwork/learning-illustrations/${slug}-v1.webp`;
    const expectedSvg = `/artwork/learning-illustrations/${slug}-v1.svg`;

    if (record.lifecycle !== "approved") {
      throw new Error(`${key}: clear-scope lifecycle must remain approved`);
    }

    const webp = record.productionAssets?.webp;
    if (
      !webp ||
      webp.status !== "approved" ||
      webp.format !== "webp" ||
      webp.path !== expectedWebp ||
      !validSha(webp.sha256)
    ) {
      throw new Error(`${key}: approved clear-scope must preserve exact WebP production history`);
    }

    const svg = record.productionAssets?.svg;
    if (
      !svg ||
      svg.format !== "svg" ||
      svg.expectedPath !== expectedSvg ||
      !["migration-ready", "approved"].includes(svg.status)
    ) {
      throw new Error(`${key}: clear-scope requires canonical SVG migration slot`);
    }
    if (svg.status === "migration-ready" && (svg.path !== null || svg.sha256 !== null)) {
      throw new Error(`${key}: migration-ready SVG requires path/SHA to remain null`);
    }
    if (svg.status === "approved" && (svg.path !== expectedSvg || !validSha(svg.sha256))) {
      throw new Error(`${key}: approved SVG requires canonical path/SHA`);
    }

    if (record.provenance?.redistributionAllowed !== true) {
      throw new Error(`${key}: approved clear-scope requires redistributionAllowed=true`);
    }
    if (record.semanticReview?.status !== "approved" || record.semanticReview?.childReadable !== true) {
      throw new Error(`${key}: approved clear-scope requires approved child-readable semantic review`);
    }
  }

  for (const key of HELD_KEYS) {
    const record = registry.items[key];
    if (record.lifecycle !== "review-required") throw new Error(`${key}: held key must remain review-required`);
    if (record.productionAssets?.webp !== null) {
      throw new Error(`${key}: held key must keep WebP production binding null`);
    }
    const svg = record.productionAssets?.svg;
    if (!svg || svg.status !== "held" || svg.path !== null || svg.sha256 !== null) {
      throw new Error(`${key}: held key must keep SVG status held with null path/SHA`);
    }
    if (record.provenance?.redistributionAllowed !== false) {
      throw new Error(`${key}: held key must remain fail-closed for redistribution`);
    }
    if (record.semanticReview?.status !== "pending") {
      throw new Error(`${key}: held key must keep semantic review pending`);
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

async function renderLegacyComparison(sourceDir, outputDir, registry, semanticKey, sourceFilename) {
  const sourcePath = path.join(sourceDir, sourceFilename);
  const sourceBytes = readFileSync(sourcePath);
  const record = registry.items[semanticKey];
  const webp = record.productionAssets.webp;
  const svg = record.productionAssets.svg;
  const filename = path.posix.basename(webp.path);

  const buffer = await sharp(sourceBytes)
    .ensureAlpha()
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ lossless: true, quality: 100 })
    .toBuffer();

  const outputPath = path.join(outputDir, filename);
  writeFileSync(outputPath, buffer);
  const metadata = await sharp(buffer).metadata();
  const size = statSync(outputPath).size;
  const technical = record.technical.webp;

  if (metadata.format !== "webp" || metadata.width !== 512 || metadata.height !== 512 || metadata.hasAlpha !== true) {
    throw new Error(`${semanticKey}: legacy comparison WebP must be 512x512 with alpha`);
  }
  if (
    metadata.width < technical.minWidth ||
    metadata.width > technical.maxWidth ||
    metadata.height < technical.minHeight ||
    metadata.height > technical.maxHeight
  ) {
    throw new Error(`${semanticKey}: legacy comparison dimensions violate WebP technical bounds`);
  }
  if (size > technical.maxBytes) {
    throw new Error(`${semanticKey}: legacy comparison exceeds WebP maxBytes (${size} > ${technical.maxBytes})`);
  }

  return {
    semanticKey,
    sourceFilename,
    sourceBytes: sourceBytes.length,
    sourceSha256: digest(sourceBytes),
    expectedWebpProductionPath: webp.path,
    expectedSvgProductionPath: svg.expectedPath,
    svgMigrationStatus: svg.status,
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
    console.log("Learning semantic P0 production-readiness preflight: DRY RUN / historical WebP comparison");
    console.log(`Registry v2 preferred format: ${registry.preferredProductionFormat}; runtime activation: ${registry.runtimeActivation}`);
    console.log(`Clear scope: ${CLEAR_SCOPE.length}/17; held scope: ${HELD_KEYS.length}/17`);
    console.log(`Would render ${CLEAR_SCOPE.length} internal comparison WebPs from ${sourceDir} into ${outputDir}`);
    for (const [key, source] of CLEAR_SCOPE) {
      const record = registry.items[key];
      console.log(
        `- ${key}: ${source} -> legacy ${path.posix.basename(record.productionAssets.webp.path)}; SVG target ${path.posix.basename(record.productionAssets.svg.expectedPath)}`
      );
    }
    console.log(`Held keys excluded: ${HELD_KEYS.join(", ")}`);
    console.log("No registry mutation, public-file write, or runtime activation will be created by this historical comparison.");
    return;
  }

  if (existsSync(outputDir)) {
    if (!args.force) throw new Error(`output already exists: ${outputDir}; use --force to replace`);
    rmSync(outputDir, { recursive: true, force: true });
  }
  mkdirSync(outputDir, { recursive: true });

  const items = [];
  for (const [semanticKey, sourceFilename] of CLEAR_SCOPE) {
    items.push(await renderLegacyComparison(sourceDir, outputDir, registry, semanticKey, sourceFilename));
  }

  const manifest = {
    version: 2,
    registryVersion: registry.version,
    scope: "learning-semantic-p0-production-readiness-preflight",
    lifecycle: "preflight-only",
    preferredProductionFormat: registry.preferredProductionFormat,
    generatedAt: new Date().toISOString(),
    sourceDirectory: slash(path.relative(root, sourceDir)),
    outputDirectory: slash(path.relative(root, outputDir)),
    clearCount: CLEAR_SCOPE.length,
    heldCount: HELD_KEYS.length,
    heldKeys: HELD_KEYS,
    legalApproval: false,
    productionApproval: false,
    svgPromotion: false,
    production: false,
    runtimeActive: false,
    items
  };
  writeFileSync(path.join(outputDir, "preflight-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  const registryAfter = readFileSync(registryPath);
  if (!registryBefore.equals(registryAfter)) {
    throw new Error("production provenance registry changed during preflight");
  }

  console.log(`Generated ${items.length} internal historical WebP comparison files at ${outputDir}`);
  console.log(`Held keys intentionally excluded: ${HELD_KEYS.join(", ")}`);
  console.log("Registry v2 SVG production bindings remain unchanged; no public production mutation or runtime activation was created.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
