import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const has = (source, literal, message) => assert(source.includes(literal), message);
const lacks = (source, literal, message) => assert(!source.includes(literal), message);

const completion = read("src/games/BermainCompletion.tsx");
const iqro = read("src/games/IqroMotionGame.tsx");
const airboard = read("src/games/AirBoardGame.tsx");
const dodge = read("src/games/DodgeMotionGame.tsx");
const run = read("src/games/RunToTargetGame.tsx");
const shell = read("src/components/GameShell.tsx");
const si08 = read("scripts/run-si08-bermain-games-4-6-tests.mjs");

has(completion, 'data-si09-bermain={si09Game ? "games-7-10" : undefined}', "SI-09 exposes a batch-specific canonical completion marker");
has(completion, 'resultMode?: "score" | "workspace"', "Bermain completion preserves the AirBoard workspace terminal distinction");
has(completion, 'data-bermain-workspace-completion', "AirBoard has a workspace-specific completion summary");
has(completion, "AirBoard tidak memberi skor atau mengirim leaderboard.", "AirBoard terminal explicitly avoids fake scoring/leaderboard semantics");
has(completion, 'context="bermain"', "SI-09 reuses canonical Bermain Completion");
has(completion, 'context: "bermain"', "SI-09 reuses privacy-safe canonical Bermain Share");
lacks(completion, "window.location.reload", "Bermain Again must not reload the document");
lacks(completion, "completeActivity", "Bermain completion must not emit Belajar completion evidence");

for (const source of [iqro, dodge, run]) {
  has(source, "canonical", "timed SI-09 game opts into canonical RoundEndOverlay");
}
has(airboard, 'data-airboard-action="finish"', "AirBoard exposes an explicit finish action");
has(airboard, 'resultMode="workspace"', "AirBoard uses workspace completion instead of score completion");
has(airboard, "<BermainCompletion", "AirBoard reaches canonical Bermain completion");
lacks(airboard, "LeaderboardCapture", "AirBoard does not write a fake leaderboard score");
lacks(airboard, "useProgressSync", "AirBoard finish does not invent game progress evidence");

for (const slug of ["iqro-motion", "airboard-presenter", "dodge-motion", "run-to-target"]) {
  has(shell, `game.slug === "${slug}"`, `GameShell includes SI-09 game ${slug} in canonical completion set`);
}
lacks(shell, "ShareButton", "SI-11 keeps gameplay-header duplicate Share removed for the full ten-game catalog");
has(si08, 'has(shell, \'game.slug === "airboard-presenter"\'', "SI-08 historical regression acknowledges later SI-09 AirBoard canonicalization");

console.log("SI-09 Bermain games 7-10 static contract PASS.");
