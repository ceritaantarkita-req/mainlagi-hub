import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateWorldMoneyNarrationAssetGate } from "./world-money-narration-asset-gate.mjs";

const TEST_ID = "money-s01-narrative-01";
const TEST_SRC = "/audio/world/money-festival/id-ID/" + TEST_ID + ".mp3";

function mp3Fixture(size = 2048) {
  const buffer = Buffer.alloc(size, 0);
  buffer.write("ID3", 0, "ascii");
  buffer[3] = 4;
  return buffer;
}

function digest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function pendingEntry() {
  return {
    cueId: TEST_ID,
    expectedSrc: TEST_SRC,
    status: "pending-review",
    productionSrc: null,
    approval: null
  };
}

function approvedEntry(buffer) {
  return {
    cueId: TEST_ID,
    expectedSrc: TEST_SRC,
    status: "approved",
    productionSrc: TEST_SRC,
    approval: {
      cueId: TEST_ID,
      src: TEST_SRC,
      textFingerprint: "fnv1a32-fixture",
      speaker: "Gian",
      locale: "id-ID",
      providerOrSource: "Fixture TTS",
      providerModel: "fixture-model-v1",
      voiceIdentity: "fixture-id-voice",
      sourceTerms: "https://example.invalid/terms",
      rightsBasis: "Fixture rights cleared",
      rightsStatus: "redistribution-approved",
      commercialUseAllowed: true,
      redistributionAllowed: true,
      aiDisclosureRequired: true,
      reviewedBy: "fixture-reviewer",
      reviewedAt: "2026-09-22T00:00:00.000Z",
      pronunciationReviewed: true,
      pacingReviewed: true,
      loudnessReviewed: true,
      mobilePlaybackReviewed: true,
      childLearningReviewed: true,
      technicalSha256: digest(buffer)
    }
  };
}

function fixtureRoot(files = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "mainlagi-world-narration-"));
  const dir = path.join(root, "public", "audio", "world", "money-festival", "id-ID");
  mkdirSync(dir, { recursive: true });
  for (const [name, bytes] of Object.entries(files)) writeFileSync(path.join(dir, name), bytes);
  return root;
}

function validate(name, entries, files, expected) {
  const root = fixtureRoot(files);
  try {
    const result = validateWorldMoneyNarrationAssetGate({
      root,
      entries,
      expectedCount: entries.length
    });
    if (expected.ok) {
      assert.equal(result.valid, true, name + " should pass: " + result.errors.join("; "));
    } else {
      assert.equal(result.valid, false, name + " should fail");
      assert.match(result.errors.join("; "), expected.message, name + " should explain failure");
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

validate("pending baseline", [pendingEntry()], {}, { ok: true });

validate(
  "stray public binary",
  [pendingEntry()],
  { [TEST_ID + ".mp3"]: mp3Fixture() },
  { ok: false, message: /without an approved World narration record/ }
);

{
  const buffer = mp3Fixture();
  const entry = approvedEntry(buffer);
  entry.approval.commercialUseAllowed = false;
  validate(
    "approved without commercial use clearance",
    [entry],
    { [TEST_ID + ".mp3"]: buffer },
    { ok: false, message: /commercialUseAllowed=true/ }
  );
}

{
  const buffer = mp3Fixture();
  const entry = approvedEntry(buffer);
  entry.approval.aiDisclosureRequired = null;
  validate(
    "approved without disclosure decision",
    [entry],
    { [TEST_ID + ".mp3"]: buffer },
    { ok: false, message: /explicit aiDisclosureRequired decision/ }
  );
}

{
  const buffer = mp3Fixture();
  const entry = approvedEntry(buffer);
  entry.approval.childLearningReviewed = false;
  validate(
    "approved without child learning review",
    [entry],
    { [TEST_ID + ".mp3"]: buffer },
    { ok: false, message: /all human review gates/ }
  );
}

{
  const buffer = Buffer.alloc(2048, 0);
  const entry = approvedEntry(buffer);
  validate(
    "approved invalid mp3 payload",
    [entry],
    { [TEST_ID + ".mp3"]: buffer },
    { ok: false, message: /does not look like an MP3/ }
  );
}

{
  const buffer = mp3Fixture();
  const entry = approvedEntry(buffer);
  entry.approval.technicalSha256 = "0".repeat(64);
  validate(
    "approved checksum drift",
    [entry],
    { [TEST_ID + ".mp3"]: buffer },
    { ok: false, message: /sha256 mismatch/ }
  );
}

{
  const buffer = mp3Fixture();
  const entry = approvedEntry(buffer);
  validate(
    "valid approved asset",
    [entry],
    { [TEST_ID + ".mp3"]: buffer },
    { ok: true }
  );
}

console.log("World narration asset gate regression passed: stray binary, rights, disclosure, human review, MP3, checksum, and valid approval cases.");
