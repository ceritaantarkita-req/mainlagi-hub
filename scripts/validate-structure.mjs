import { access, readFile } from "node:fs/promises";

const required = [
  "src/app/page.tsx",
  "src/app/play/[slug]/page.tsx",
  "src/app/api/affiliate/route.ts",
  "src/components/GameShell.tsx",
  "src/components/PreflightPanel.tsx",
  "src/games/MathMotionGame.tsx",
  "src/games/NumberTraceGame.tsx",
  "src/games/ShapeQuestGame.tsx",
  "src/games/PatternRaceGame.tsx",
  "src/games/MathWarungGame.tsx",
  "src/games/IqroMotionGame.tsx",
  "src/games/AirBoardGame.tsx",
  "src/games/DodgeMotionGame.tsx",
  "src/games/RunToTargetGame.tsx",
  "src/lib/vision/useVisionRuntime.ts",
  "src/lib/vision/player-assignment.ts",
  "src/lib/engine/stroke.ts",
  "supabase/schema.sql"
];

for (const file of required) await access(file);

const registry = await readFile("src/lib/data/games.ts", "utf8");
const slugs = [...registry.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map(
  (match) => match[1]
);
const uniqueSlugs = new Set(slugs);
if (uniqueSlugs.size !== 10) {
  throw new Error(`Expected exactly 10 unique game definitions, got ${uniqueSlugs.size}`);
}
if (slugs.length !== uniqueSlugs.size) {
  throw new Error(`Duplicate slug in the registry: ${slugs.join(", ")}`);
}

for (const slug of uniqueSlugs) await access(`public/og/${slug}.png`);
await access("public/og/home.png");

const home = await readFile("src/components/HomePage.tsx", "utf8");
if (/NEXT_PUBLIC_APP_|companion-launch|Buka aplikasi/.test(home)) {
  throw new Error("External companion launcher contract reappeared.");
}

console.log(
  JSON.stringify({
    requiredFiles: required.length,
    internalModules: uniqueSlugs.size,
    socialThumbnails: uniqueSlugs.size + 1,
    externalLauncher: false
  })
);
