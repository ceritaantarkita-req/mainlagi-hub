import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const has = (source, literal, message) => assert(source.includes(literal), message);
const lacks = (source, literal, message) => assert(!source.includes(literal), message);

const world = read("src/components/learning/world-v2/MoneyWorldExperience.tsx");
const completion = read("src/components/CanonicalCompletion.tsx");
const share = read("src/components/CanonicalShare.tsx");
const shareResolver = read("src/lib/share/canonicalShare.ts");
const geometryRegression = read("scripts/run-si02-character-geometry-browser-tests.mjs");

has(world, 'import { CanonicalCompletion } from "@/components/CanonicalCompletion"', "SI-10 World must consume canonical Completion");
has(world, 'import { CanonicalShareDialog } from "@/components/CanonicalShare"', "SI-10 World must consume canonical Share");
has(world, '<CanonicalCompletion', "WorldStageCompletion must render canonical Completion");
has(world, 'context="world"', "World canonical Completion must use world context");
has(world, 'surface="inline"', "World must preserve routed inline terminal-surface semantics");
has(world, 'data-si10-world="completion"', "SI-10 World completion must expose a stable regression marker");
has(world, "data-world-completion-stage={stageId}", "World completion must preserve stage identity marker");
has(world, 'data-world-completion-final={finalStage ? "true" : "false"}', "World completion must preserve finale marker");
has(world, "data-world-completion-chapter={chapter?.id ?? ""}", "World completion must preserve chapter identity marker");
has(world, "data-world-completion-chapter-milestone={chapter.id}", "World chapter milestone supporting content must survive canonical migration");
has(world, "characterSlot={(", "World completion must adapt Gavi/Paca into the canonical character slot");
has(world, "supportingContent={chapterComplete && chapter ? (", "World completion must retain chapter milestone supporting content");
has(world, 'back={{ href: mapHref, ariaLabel: "Back" }}', "World Back must preserve map routing");
has(world, 'again={{ onClick: onAgain, ariaLabel: "Again" }}', "World Again must preserve local restart callback");
has(world, 'next={{ href: nextHref, ariaLabel: "Next" }}', "World Next must preserve authored next-stage routing");
has(world, "onShare={() => setShareOpen(true)}", "World Completion must only open canonical Share");
has(world, "<CanonicalShareDialog", "World must render canonical Share as sibling owner");
has(world, 'context: "world"', "World Share input must use world context");
has(world, "worldId: MONEY_WORLD_ID", "World Share input must resolve through canonical World public target");
has(world, "stageTitle: stage?.title", "World Share must preserve stage-specific achievement copy");
has(world, "final: finalStage", "World Share must preserve finale-specific achievement copy");

for (const legacy of [
  '/api/parent/share-gate',
  "navigator.clipboard",
  "navigator.share",
  "https://wa.me/",
  "https://t.me/share/",
  "twitter.com/intent/tweet",
  "facebook.com/sharer",
  "threads.net/intent"
]) {
  lacks(world, legacy, `World must not retain bespoke Share implementation after SI-10: ${legacy}`);
}

has(world, "completeMoneyWorldStage(childId, stageId)", "SI-10 must preserve existing World completion progress write");
has(world, "restartMoneyWorldStage(childId, stageId)", "SI-10 must preserve existing World Again/restart seam");
has(world, "emitMoneyWorldEvidenceObservation", "SI-10 must preserve World evidence emission owner");
has(world, "syncMoneyWorldProgressCloud", "SI-10 must preserve World cloud progress sync");
has(world, "nextMoneyWorldStage(stageId)", "SI-10 must preserve canonical World stage ordering");
has(world, 'const nextHref = next ? mapHref + "/stage/" + next.id : mapHref;', "final World Next must still fall back to the World map");

lacks(world, "<strong>{runtimeCharacter.name}</strong>", "SI-02 World SpeechCard visible name-label removal must remain closed");
has(geometryRegression, 'assert.equal(await story.locator(":scope > strong").count(), 0', "permanent SI-02 regression must continue guarding the removed World name label");
has(geometryRegression, 'assertSafeCharacterGeometry(completionCharacters, ["gavi", "paca"]', "permanent SI-02 regression must continue guarding World completion character geometry");

has(completion, 'export type CanonicalCompletionContext = "belajar" | "bermain" | "world"', "canonical Completion must retain World support");
has(share, 'data-canonical-share="v1"', "canonical Share stable owner marker must remain present");
has(shareResolver, 'context: "world"', "canonical Share resolver must retain World input");
has(shareResolver, '/worlds/${safeSegment(input.worldId)}', "World canonical Share must resolve only to the public World landing");
for (const privateField of ["childId", "accountId", "progressId"]) {
  lacks(shareResolver, privateField, `canonical Share resolver must not accept private field ${privateField}`);
}

console.log("SI-10 World adapter static contract PASS: canonical Completion/Share ownership, World navigation/chapter/finale semantics, SI-02 character guarantees, progress/evidence boundaries, and public-only Share target are preserved.");
