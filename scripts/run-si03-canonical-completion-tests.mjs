import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const canonical = read("src/components/CanonicalCompletion.tsx");
const css = read("src/components/CanonicalCompletion.module.css");
const belajar = read("src/components/learning/ActivityCompletion.tsx");
const belajarCss = read("src/components/learning/ActivityCompletion.module.css");
const world = read("src/components/learning/world-v2/MoneyWorldExperience.tsx");
const bermain = read("src/games/shared.tsx");

assert.match(canonical, /data-canonical-completion="v1"/, "canonical completion exposes stable contract marker");
assert.match(canonical, /data-completion-context={context}/, "canonical completion exposes domain context");
assert.match(canonical, /data-completion-surface={surface}/, "canonical completion exposes overlay vs inline surface");
assert.match(canonical, /data-completion-stars="3"/, "canonical completion locks the three-star contract");
assert.match(canonical, /{[0, 1, 2].map/, "canonical completion renders exactly three stars");
assert.match(canonical, /kind: "back" | "again" | "next"/, "canonical completion owns Back/Again/Next action kinds");
assert.match(canonical, /kind === "back" ? "Back" : kind === "again" ? "Again" : "Next"/, "canonical action labels are Back / Again / Next");
assert.match(canonical, /data-completion-action="share"/, "Share remains a canonical completion control");
assert.match(canonical, /characterSlot?: ReactNode/, "World character presentation has a canonical slot");
assert.match(canonical, /supportingContent?: ReactNode/, "World chapter and Bermain score/leaderboard context have a supporting slot");
assert.match(canonical, /eyebrow?: ReactNode/, "World contextual metadata has an eyebrow slot");
assert.match(canonical, /role={surface === "overlay" ? "dialog" : "region"}/, "surface semantics cover overlay and inline completion");
assert.match(canonical, /requestAnimationFrame(() => headingRef.current?.focus())/, "canonical completion focuses its heading on entry");

assert.match(css, /grid-template-columns: repeat(3, minmax(0, 1fr))/, "Back/Again/Next remain one canonical row");
assert.match(css, /max-height: calc(var(--completion-viewport-height) - 32px)/, "completion card is bounded by SI-01 viewport height");
assert.match(css, /@media(orientation:landscape) and (max-height:560px)/, "short-landscape completion containment is explicit");
assert.match(css, /@media(prefers-reduced-motion:reduce)/, "star animation respects reduced motion");

assert.match(belajar, /import { CanonicalCompletion } from "@\/components\/CanonicalCompletion"/, "Belajar shared completion adapts to the canonical shell");
assert.match(belajar, /<CanonicalCompletion[sS]*?context="belajar"[sS]*?surface="overlay"/, "Belajar uses canonical overlay context");
assert.match(belajar, /back={{ onClick: goBack }}/, "Belajar keeps its existing Back semantics");
assert.match(belajar, /again={{ onClick: retry }}/, "Belajar keeps its existing replay semantics");
assert.match(belajar, /next={{ href: nextHref, ariaLabel: "Next" }}/, "Belajar keeps stage-aware Next semantics");
assert.match(belajar, /onShare={openShare}/, "SI-03 delegates Share behavior to the existing owner pending SI-04");
assert(belajar.includes('fetch("/api/parent/share-gate"'), "existing Share gate remains owned by the Belajar adapter until SI-04");
assert.doesNotMatch(canonical, /parent\/share-gate|wa\.me|t\.me\/share|twitter\.com|facebook\.com|threads\.net/, "canonical Completion must not absorb SI-04 provider/gate logic");
assert.doesNotMatch(belajar, /Try Again/, "Belajar canonical visual label is Again, not legacy Try Again");
assert.doesNotMatch(belajarCss, /\.overlay|\.completion\s*\{|\.praise|\.stars|\.actions|\.shareButton/, "legacy Belajar completion visual ownership is removed");

assert.doesNotMatch(world, /CanonicalCompletion/, "SI-03 must not migrate World before SI-10");
assert.doesNotMatch(bermain, /CanonicalCompletion/, "SI-03 must not migrate Bermain before SI-07/SI-09");

console.log("SI-03 canonical completion static contract PASS.");
