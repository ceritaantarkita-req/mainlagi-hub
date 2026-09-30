import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const has = (source, literal, message) => assert(source.includes(literal), message);
const lacks = (source, literal, message) => assert(!source.includes(literal), message);

const completion = read("src/games/BermainCompletion.tsx");
const shapeQuest = read("src/games/ShapeQuestGame.tsx");
const digitRace = read("src/games/DigitRace.tsx");
const mathWarung = read("src/games/MathWarungGame.tsx");
const shell = read("src/components/GameShell.tsx");
const si07 = read("scripts/run-si07-bermain-games-1-3-tests.mjs");

has(completion, 'data-si08-bermain={si08Game ? "games-4-6" : undefined}', "SI-08 exposes a batch-specific canonical completion marker");
has(completion, 'data-si07-bermain={si07Game ? "games-1-3" : undefined}', "SI-07 marker remains scoped to games 1-3");
has(completion, 'context="bermain"', "SI-08 reuses canonical Bermain Completion");
has(completion, 'context: "bermain"', "SI-08 reuses privacy-safe canonical Bermain Share");
lacks(completion, "window.location.reload", "Bermain Again must not reload the document");
lacks(completion, "completeActivity", "Bermain completion must not emit Belajar completion evidence");

has(shapeQuest, "canonical", "game 4 shape-quest opts into canonical completion");
has(digitRace, "canonical", "shared DigitRace terminal is canonical for math-motion and pattern-race");
has(mathWarung, "canonical", "game 6 math-warung opts into canonical completion");

for (const slug of ["shape-quest", "pattern-race", "math-warung"]) {
  has(shell, `game.slug === "${slug}"`, `GameShell includes SI-08 game ${slug} in canonical completion set`);
}
lacks(shell, "ShareButton", "SI-11 keeps gameplay-header duplicate Share removed");
has(shell, 'game.slug === "iqro-motion"', "SI-08 historical regression accepts later SI-09 game canonicalization");
has(shell, 'game.slug === "airboard-presenter"', "SI-08 historical regression accepts the later explicit AirBoard terminal decision");

has(si07, 'data-si07-bermain={si07Game ? "games-1-3" : undefined}', "SI-07 regression follows the scoped marker after SI-08 extension");
has(si07, 'has(digitRace, "canonical"', "SI-07 regression accepts the now-shared canonical DigitRace terminal");

console.log("SI-08 Bermain games 4-6 static contract PASS.");
