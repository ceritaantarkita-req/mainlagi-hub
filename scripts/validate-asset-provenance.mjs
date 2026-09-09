import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "src", "lib", "data", "affiliate-provenance.json");
const affiliateDir = path.join(root, "public", "affiliate");
const ALLOWED_STATUS = new Set(["owned", "licensed", "third-party-reference", "unverified"]);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

function fail(message) {
  console.error(`asset provenance: ${message}`);
  process.exitCode = 1;
}

if (!existsSync(registryPath)) {
  fail("missing src/lib/data/affiliate-provenance.json");
  process.exit();
}

let registry;
try {
  registry = JSON.parse(readFileSync(registryPath, "utf8"));
} catch (error) {
  fail(`invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  process.exit();
}

if (registry?.version !== 1 || !registry.items || typeof registry.items !== "object" || Array.isArray(registry.items)) {
  fail("registry must be { version: 1, items: { ... } }");
  process.exit();
}

const approvedPaths = new Map();
for (const [slug, record] of Object.entries(registry.items)) {
  if (!slug || !record || typeof record !== "object" || Array.isArray(record)) {
    fail(`invalid record for ${slug || "<empty slug>"}`);
    continue;
  }

  if (!ALLOWED_STATUS.has(record.status)) fail(`${slug}: invalid status`);
  if (typeof record.redistributionAllowed !== "boolean") fail(`${slug}: redistributionAllowed must be boolean`);
  for (const key of ["source", "rightsHolder", "licenseBasis", "reviewedAt"]) {
    if (typeof record[key] !== "string" || !record[key].trim()) fail(`${slug}: ${key} is required`);
  }
  if (typeof record.reviewedAt === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(record.reviewedAt)) {
    fail(`${slug}: reviewedAt must use YYYY-MM-DD`);
  }

  if (record.redistributionAllowed) {
    if (record.status !== "owned" && record.status !== "licensed") {
      fail(`${slug}: only owned/licensed assets may set redistributionAllowed=true`);
    }
    if (typeof record.localPath !== "string" || !record.localPath.startsWith("/affiliate/")) {
      fail(`${slug}: approved assets require localPath under /affiliate/`);
      continue;
    }
    const relative = record.localPath.slice(1);
    const absolute = path.join(root, relative);
    if (!existsSync(absolute)) fail(`${slug}: approved localPath does not exist (${record.localPath})`);
    const normalized = path.posix.normalize(record.localPath);
    if (normalized !== record.localPath || normalized.includes("..")) fail(`${slug}: unsafe localPath`);
    if (approvedPaths.has(record.localPath)) fail(`${slug}: localPath is already assigned to ${approvedPaths.get(record.localPath)}`);
    approvedPaths.set(record.localPath, slug);
  } else if (record.localPath !== null) {
    fail(`${slug}: localPath must be null when redistributionAllowed=false`);
  }
}

if (existsSync(affiliateDir)) {
  for (const file of readdirSync(affiliateDir, { withFileTypes: true })) {
    if (!file.isFile()) continue;
    const ext = path.extname(file.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;
    const publicPath = `/affiliate/${file.name}`;
    if (!approvedPaths.has(publicPath)) {
      fail(`${publicPath}: local public image has no approved owned/licensed provenance record`);
    }
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log(`asset provenance OK: ${approvedPaths.size} approved local affiliate image(s)`);
