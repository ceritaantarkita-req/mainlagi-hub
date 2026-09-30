import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const has = (source, literal, message) => assert(source.includes(literal), message);
const lacks = (source, literal, message) => assert(!source.includes(literal), message);

const completion = read("src/games/BermainCompletion.tsx");
const completionCss = read("src/games/BermainCompletion.module.css");
const shared = read("src/games/shared.tsx");
const mathChoice = read("src/games/MathChoiceGame.tsx");
const digitRace = read("src/games/DigitRace.tsx");
const numberTrace = read("src/games/NumberTraceGame.tsx");
const shell = read("src/components/GameShell.tsx");

has(completion, 'context="bermain"', "SI-07 uses the canonical Bermain Completion context");
has(completion, 'surface="overlay"', "SI-07 uses canonical overlay completion");
has(completion, 'input={{', "SI-07 composes canonical Share as a sibling modal");
has(completion, 'context: "bermain"', "SI-07 Share uses the privacy-safe Bermain resolver");
has(completion, 'href: `/games/${game}`', "Back returns to the existing public game detail");
has(completion, 'onClick: onReplay', "Again reuses the existing GameShell replay seam");
has(completion, 'href: `/play/${nextSlug}`', "Next follows deterministic canonical game catalog order");
has(completion, "<LeaderboardCapture", "SI-07 preserves leaderboard capture");
has(completion, 'data-bermain-completion-action="calibrate"', "SI-07 preserves recalibration");
has(completion, 'variant="ensemble"', "SI-07 uses the safe contained character ensemble");
has(completion, 'data-si07-bermain={si07Game ? "games-1-3" : undefined}', "SI-07 exposes a scoped stable QA marker");
lacks(completion, "window.location.reload", "Again must not reload the document");
lacks(completion, "completeActivity", "Bermain completion must not emit Belajar completion evidence");

has(shared, 'import { BermainCompletion } from "./BermainCompletion"', "RoundEndOverlay can delegate to SI-07 adapter");
has(shared, "canonical?: boolean", "RoundEndOverlay migration is opt-in");
has(shared, "if (canonical && game)", "only opted-in game terminals use SI-07 completion");
has(shared, "<BermainCompletion", "shared terminal seam delegates to SI-07 adapter");

has(mathChoice, "canonical", "game 1 math-choice opts into SI-07");
has(numberTrace, "canonical", "game 3 number-trace opts into SI-07");
has(digitRace, "canonical", "shared DigitRace terminal stays canonical for game 2 after SI-08 extends it to pattern-race");

has(shell, 'game.slug === "math-choice"', "GameShell identifies SI-07 game 1");
has(shell, 'game.slug === "math-motion-battle"', "GameShell identifies SI-07 game 2");
has(shell, 'game.slug === "number-trace"', "GameShell identifies SI-07 game 3");
lacks(shell, "ShareButton", "SI-11 removes the duplicate gameplay-header Share owner after all ten games canonicalize");
lacks(shell, "canonicalCompletionGame", "GameShell no longer needs a conditional legacy Share compatibility list");

has(completionCss, "@media (orientation: landscape) and (max-height: 560px)", "SI-07 support content remains bounded in short landscape");

console.log("SI-07 Bermain games 1-3 static contract PASS.");
