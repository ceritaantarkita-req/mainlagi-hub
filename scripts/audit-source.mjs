import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function files(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...(await files(full)));
    else if (/\.(ts|tsx|mjs|sql)$/.test(entry.name)) output.push(full);
  }
  return output;
}

const sourceFiles = [...(await files("src")), ...(await files("supabase"))];
const findings = [];
let totalLines = 0;

for (const file of sourceFiles) {
  const content = await readFile(file, "utf8");
  totalLines += content.split(/\r?\n/).length;
  const checks = [
    [/NEXT_PUBLIC_APP_|CompanionApps|companion-launch/g, "external companion launcher"],
    [/NEXT_PUBLIC_SUPABASE_SERVICE_ROLE/gi, "service-role key exposed to browser"],
    [/service_role\s*[=:]\s*["'][^"']+/gi, "embedded service-role secret"],
    [/sk-[A-Za-z0-9_-]{20,}/g, "embedded API key"],
    [/TODO|FIXME|HACK/g, "unfinished marker"],
    [/players\s*===\s*["']1 pemain["']/g, "player count derived from display string"]
  ];
  for (const [pattern, label] of checks) {
    if (pattern.test(content)) findings.push({ file, label });
  }
}

const contracts = [
  ["src/components/GameShell.tsx", ["MathMotionGame", "NumberTraceGame", "ShapeQuestGame", "PatternRaceGame", "MathWarungGame", "IqroMotionGame", "AirBoardGame", "DodgeMotionGame", "RunToTargetGame", "onReplay"]],
  ["src/components/PreflightPanel.tsx", ["gesturesReady", 'gesture === "pinch"', 'gesture === "open"']],
  ["src/lib/vision/player-assignment.ts", ["BodySlotTracker", "lowest movement cost"]],
  ["src/games/shared.tsx", ["RoundEndOverlay", "Main lagi"]],
  ["src/app/globals.css", [".motion-pad-grid.is-single", ".round-end-overlay"]],
  ["supabase/schema.sql", ["revoke update on public.profiles", "record_best_score", "revoke insert on public.affiliate_clicks"]]
];

for (const [file, needles] of contracts) {
  const content = await readFile(file, "utf8");
  for (const needle of needles) {
    if (!content.includes(needle)) findings.push({ file, label: `missing contract: ${needle}` });
  }
}

if (findings.length) {
  console.error(JSON.stringify({ files: sourceFiles.length, totalLines, findings }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify({
    files: sourceFiles.length,
    totalLines,
    findings: 0,
    internalModules: 9,
    secretScan: "PASS",
    externalLauncher: "ABSENT",
    gesturePreflight: "PRESENT",
    temporalPlayerSlots: "PRESENT",
    replayOverlay: "PRESENT"
  })
);
