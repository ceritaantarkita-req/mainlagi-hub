import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".ogg", ".opus", ".aac", ".m4a", ".flac"]);

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function looksLikeMp3(buffer) {
  if (buffer.length < 4) return false;
  if (buffer.toString("ascii", 0, 3) === "ID3") return true;
  return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
}

function walkAudioFiles(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkAudioFiles(absolute));
    else if (entry.isFile() && AUDIO_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(absolute);
  }
  return files;
}

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateWorldMoneyNarrationAssetGate({
  root,
  entries,
  expectedCount = 88,
  minBytes = 512,
  maxBytes = 500000
}) {
  const errors = [];
  const productionDir = path.join(root, "public", "audio", "world", "money-festival", "id-ID");

  if (!Array.isArray(entries)) {
    return { valid: false, errors: ["narration production entries must be an array"], approvedPaths: [] };
  }

  if (entries.length !== expectedCount) {
    errors.push("narration asset gate expected " + expectedCount + " entries, got " + entries.length);
  }

  const cueIds = entries.map((entry) => entry?.cueId);
  if (new Set(cueIds).size !== cueIds.length) errors.push("narration asset cue IDs must be unique");

  const approvedPaths = new Map();

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") {
      errors.push("narration asset entry must be an object");
      continue;
    }

    const expectedSrc = "/audio/world/money-festival/id-ID/" + entry.cueId + ".mp3";
    if (entry.expectedSrc !== expectedSrc) {
      errors.push(entry.cueId + " expectedSrc must equal deterministic World narration path");
    }

    if (entry.status !== "approved") {
      if (entry.productionSrc !== null) errors.push(entry.cueId + " unapproved cue must keep productionSrc=null");
      if (entry.approval !== null) errors.push(entry.cueId + " unapproved cue must not expose approval metadata");
      continue;
    }

    const approval = entry.approval;
    if (!approval || typeof approval !== "object") {
      errors.push(entry.cueId + " approved cue requires approval metadata");
      continue;
    }

    if (entry.productionSrc !== expectedSrc || approval.src !== expectedSrc) {
      errors.push(entry.cueId + " approved cue path must equal deterministic expected path");
    }
    if (!requiredString(approval.providerOrSource)) errors.push(entry.cueId + " approved cue requires providerOrSource");
    if (!requiredString(approval.providerModel)) errors.push(entry.cueId + " approved cue requires providerModel");
    if (!requiredString(approval.voiceIdentity)) errors.push(entry.cueId + " approved cue requires voiceIdentity");
    if (!requiredString(approval.sourceTerms)) errors.push(entry.cueId + " approved cue requires sourceTerms");
    if (!requiredString(approval.rightsBasis)) errors.push(entry.cueId + " approved cue requires rightsBasis");
    if (approval.commercialUseAllowed !== true) errors.push(entry.cueId + " approved cue requires commercialUseAllowed=true");
    if (approval.redistributionAllowed !== true) errors.push(entry.cueId + " approved cue requires redistributionAllowed=true");
    if (typeof approval.aiDisclosureRequired !== "boolean") errors.push(entry.cueId + " approved cue requires explicit aiDisclosureRequired decision");
    if (!requiredString(approval.reviewedBy)) errors.push(entry.cueId + " approved cue requires reviewedBy");
    if (!requiredString(approval.reviewedAt) || Number.isNaN(Date.parse(approval.reviewedAt))) {
      errors.push(entry.cueId + " approved cue requires valid reviewedAt");
    }
    if (
      approval.pronunciationReviewed !== true ||
      approval.pacingReviewed !== true ||
      approval.loudnessReviewed !== true ||
      approval.mobilePlaybackReviewed !== true ||
      approval.childLearningReviewed !== true
    ) {
      errors.push(entry.cueId + " approved cue requires all human review gates");
    }
    if (!/^[a-f0-9]{64}$/i.test(approval.technicalSha256 ?? "")) {
      errors.push(entry.cueId + " approved cue requires technicalSha256");
    }

    if (entry.productionSrc !== expectedSrc || !/^[a-f0-9]{64}$/i.test(approval.technicalSha256 ?? "")) continue;

    const normalized = path.posix.normalize(entry.productionSrc);
    if (normalized !== entry.productionSrc || normalized.includes("..")) {
      errors.push(entry.cueId + " unsafe productionSrc");
      continue;
    }

    const absolute = path.join(root, "public", entry.productionSrc.slice(1));
    if (!existsSync(absolute)) {
      errors.push(entry.cueId + " approved narration asset does not exist");
      continue;
    }
    if (path.extname(absolute).toLowerCase() !== ".mp3") {
      errors.push(entry.cueId + " approved narration asset must be .mp3");
    }

    const bytes = readFileSync(absolute);
    const size = statSync(absolute).size;
    if (size < minBytes || size > maxBytes) {
      errors.push(entry.cueId + " asset size " + size + " is outside " + minBytes + "-" + maxBytes + " bytes");
    }
    if (!looksLikeMp3(bytes)) errors.push(entry.cueId + " asset does not look like an MP3");

    const digest = sha256(bytes);
    if (digest !== approval.technicalSha256.toLowerCase()) {
      errors.push(entry.cueId + " sha256 mismatch");
    }

    if (approvedPaths.has(entry.productionSrc)) {
      errors.push(entry.cueId + " productionSrc already assigned to " + approvedPaths.get(entry.productionSrc));
    } else {
      approvedPaths.set(entry.productionSrc, entry.cueId);
    }
  }

  for (const absolute of walkAudioFiles(productionDir)) {
    const publicPath = "/" + path.relative(path.join(root, "public"), absolute).split(path.sep).join("/");
    if (!approvedPaths.has(publicPath)) {
      errors.push(publicPath + " exists in public tree without an approved World narration record");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    approvedPaths: [...approvedPaths.keys()]
  };
}
