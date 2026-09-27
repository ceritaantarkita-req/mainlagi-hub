import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const has = (source, literal, message) => assert(source.includes(literal), message);
const lacks = (source, literal, message) => assert(!source.includes(literal), message);

const canonical = read("src/components/CanonicalCompletion.tsx");
const css = read("src/components/CanonicalCompletion.module.css");
const belajar = read("src/components/learning/ActivityCompletion.tsx");
const belajarCss = read("src/components/learning/ActivityCompletion.module.css");
const world = read("src/components/learning/world-v2/MoneyWorldExperience.tsx");
const bermain = read("src/games/shared.tsx");

has(canonical, 'data-canonical-completion="v1"', "canonical completion exposes stable contract marker");
has(canonical, "data-completion-context={context}", "canonical completion exposes domain context");
has(canonical, "data-completion-surface={surface}", "canonical completion exposes overlay vs inline surface");
has(canonical, 'data-completion-stars="3"', "canonical completion locks the three-star contract");
has(canonical, "{[0, 1, 2].map", "canonical completion renders exactly three stars");
has(canonical, 'kind: "back" | "again" | "next"', "canonical completion owns Back/Again/Next action kinds");
has(canonical, 'kind === "back" ? "Back" : kind === "again" ? "Again" : "Next"', "canonical action labels are Back / Again / Next");
has(canonical, 'data-completion-action="share"', "Share remains a canonical completion control");
has(canonical, "characterSlot?: ReactNode", "World character presentation has a canonical slot");
has(canonical, "supportingContent?: ReactNode", "World chapter and Bermain score/leaderboard context have a supporting slot");
has(canonical, "eyebrow?: ReactNode", "World contextual metadata has an eyebrow slot");
has(canonical, 'role={surface === "overlay" ? "dialog" : "region"}', "surface semantics cover overlay and inline completion");
has(canonical, "requestAnimationFrame(() => headingRef.current?.focus())", "canonical completion focuses its heading on entry");

has(css, "grid-template-columns: repeat(3, minmax(0, 1fr))", "Back/Again/Next remain one canonical row");
has(css, "max-height: calc(var(--completion-viewport-height) - 32px)", "completion card is bounded by SI-01 viewport height");
has(css, "@media(orientation:landscape) and (max-height:560px)", "short-landscape completion containment is explicit");
has(css, "@media(prefers-reduced-motion:reduce)", "star animation respects reduced motion");

has(belajar, 'import { CanonicalCompletion } from "@/components/CanonicalCompletion"', "Belajar shared completion adapts to the canonical shell");
assert.match(
  belajar,
  /<CanonicalCompletion[\s\S]*?context="belajar"[\s\S]*?surface="overlay"/,
  "Belajar uses canonical overlay context"
);
has(belajar, "back={{ onClick: goBack }}", "Belajar keeps its existing Back semantics");
has(belajar, "again={{ onClick: retry }}", "Belajar keeps its existing replay semantics");
has(belajar, 'next={{ href: nextHref, ariaLabel: "Next" }}', "Belajar keeps stage-aware Next semantics");
has(belajar, "onShare={openShare}", "SI-03 delegates Share behavior to the existing owner pending SI-04");
has(belajar, 'fetch("/api/parent/share-gate"', "existing Share gate remains owned by the Belajar adapter until SI-04");

for (const providerFragment of [
  "parent/share-gate",
  "wa.me",
  "t.me/share",
  "twitter.com",
  "facebook.com",
  "threads.net"
]) {
  lacks(canonical, providerFragment, `canonical Completion must not absorb SI-04 provider/gate logic: ${providerFragment}`);
}

lacks(belajar, "Try Again", "Belajar canonical visual label is Again, not legacy Try Again");
for (const legacyClass of [".overlay", ".completion {", ".praise", ".stars", ".actions", ".shareButton"]) {
  lacks(belajarCss, legacyClass, `legacy Belajar completion visual ownership is removed: ${legacyClass}`);
}

lacks(world, "CanonicalCompletion", "SI-03 must not migrate World before SI-10");
lacks(bermain, "CanonicalCompletion", "SI-03 must not migrate Bermain before SI-07/SI-09");

console.log("SI-03 canonical completion static contract PASS.");
