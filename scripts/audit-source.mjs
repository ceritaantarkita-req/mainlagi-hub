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
  // The pinch/open calibration gates were removed on purpose: seven gates
  // before a game starts is unusable for a five-year-old. What must remain is
  // a readiness state, a start gesture, and the parent-facing detail view.
  ["src/components/PreflightPanel.tsx", ["canContinue", "preflight-status", "detailed", 'gestureA === "open"']],
  ["src/lib/vision/player-assignment.ts", ["BodySlotTracker", "lowest movement cost"]],
  // A visible hand always belongs to somebody. The old dead band between
  // x=0.46 and x=0.54 discarded hands outright, and that strip is exactly
  // where a parent and child sharing one camera hold their hands.
  ["src/lib/vision/player-assignment.ts", ["): PlayerId {", "byCentre"]],
  // A locked player slot must reject a candidate that jumps too far to be
  // the same person, in both 1- and 2-player mode - without this, a
  // stranger walking through frame gets adopted as soon as they are the
  // closest thing to a briefly-missed anchor, which is what "skeleton jumps
  // to someone else" actually was. Hands get the equivalent check before
  // they are ever handed to a player.
  ["src/lib/vision/player-assignment.ts", ["jumpBudget", "isHandPlausible", "HAND_PLAUSIBLE_RADIUS"]],
  // A "grown budget" reacquisition (a player back after being missed for a
  // while) must be confirmed by a second frame in the same spot - one lucky
  // frame is exactly how a passer-by crossing a long-vacant anchor gets
  // mistaken for the player returning to it.
  ["src/lib/vision/player-assignment.ts", ["pendingRecovery", "RECOVERY_CONFIRM_RADIUS"]],
  ["src/lib/vision/face-analysis.ts", ["FaceSlotTracker", "jumpBudget", "pendingRecovery"]],
  // Held gestures must tolerate a dropped frame, or "open palm to submit"
  // silently fails whenever the classifier blinks.
  ["src/lib/vision/gesture.ts", ["GestureHold", "graceMs"]],
  // Pose face bones are not drawn: the 478-point face mesh already covers the
  // face, and drawing both painted a thick cage over every player's head.
  // Bone length is judged against the body, never the screen.
  ["src/components/VisionOverlay.tsx", ["POSE_FACE_DETAIL", "boneLimitFor"]],
  // Visible per-player lock box + tag, so identity tracking is something a
  // parent can actually see holding steady rather than trust blindly.
  ["src/components/VisionOverlay.tsx", ["boundingBoxFor", "drawLockBox", "PEMAIN A"]],
  // A one-stroke glyph is provisional - it may be half of a 4.
  ["src/components/MotionPad.tsx", ["READ_DELAY_PARTIAL_MS", "AUTO_COMMIT_PARTIAL_MS"]],
  ["src/lib/engine/choices.ts", ["buildChoices", "plausibleMistakes"]],
  // Beat Motion reads the smoothed body centre directly. Routing it back
  // through classifyBodyAction would reinstate the calibrated 12%-of-frame
  // threshold that made the position marker feel dead.
  ["src/games/DodgeMotionGame.tsx", ["useVisionFrame", "normalisePosition", "laneFor", "DURATION_PRESETS"]],
  ["src/lib/engine/lanes.ts", ["normalisePosition", "laneFor", "BAND_MIN"]],
  ["src/lib/engine/ranking.ts", ["orderEntries", "rankOf"]],
  ["src/lib/data/leaderboard.ts", ["submitScore", "rankFor", "pushRemote"]],
  ["src/components/LeaderboardCapture.tsx", ["rankFor", "submitScore"]],
  ["src/games/shared.tsx", ["RoundEndOverlay", "Main lagi", "usePresence", "awayPaused"]],
  // Recognition invariants. Mirror matching made 6 and 9 inseparable and made
  // Arabic letters that differ only by direction collide; it must not return.
  ["src/lib/engine/digit.ts", ["rankDigits", "featurePenalty", "loopCenters"]],
  ["src/lib/engine/multi-digit.ts", ["segmentDigits", "verifyExpectedNumber"]],
  ["src/lib/interaction/pen-mapper.ts", ["PenMapper", "lock()", "unlock()"]],
  ["src/lib/vision/projection.ts", ["createProjection", "projectPoint"]],
  // The frame stream must stay out of React state. Putting it back would
  // reinstate the render loop that raised "Maximum update depth exceeded".
  ["src/lib/vision/useVisionRuntime.ts", ["getSnapshot", "subscribe", "publishSummary"]],
  ["src/lib/vision/useVisionRuntime.ts", ["isHandPlausible("]],
  ["src/lib/vision/useVisionSelector.ts", ["useVisionValue", "useVisionFrame"]],
  ["src/app/globals.css", [".motion-pad-grid.is-single", ".round-end-overlay"]],
  ["supabase/migrations/0001_init.sql", ["revoke update on public.profiles", "record_best_score", "revoke insert on public.affiliate_clicks"]]
];

for (const [file, needles] of contracts) {
  const content = await readFile(file, "utf8");
  for (const needle of needles) {
    if (!content.includes(needle)) findings.push({ file, label: `missing contract: ${needle}` });
  }
}

/**
 * Patterns that must never come back.
 *
 * Mirror matching is the single most damaging regression this codebase can
 * have: it makes 6 and 9 mathematically inseparable, and it collapses Arabic
 * letters that differ only by writing direction (dal/ra, dzal/zai).
 */
const forbidden = [
  [
    "src/lib/vision/useVisionRuntime.ts",
    /setSnapshot\(/,
    "the per-frame snapshot was put back into React state"
  ],
  ["src/lib/engine/digit.ts", /mirrorPath|mirrored/, "mirror matching in digit recognition"],
  ["src/lib/engine/geometry.ts", /mirrorPath\(input\)/, "mirror matching inside scorePath"],
  ["src/lib/engine/hijaiyah.ts", /scorePath/, "hijaiyah scored through the mirror-tolerant scorePath"],
  [
    "src/lib/vision/player-assignment.ts",
    /PlayerId \| null/,
    "hand assignment can return 'nobody' again, which silently drops the pen"
  ],
  [
    "src/components/VisionOverlay.tsx",
    /Math\.hypot\(rect\.width, rect\.height\) \* 0\.4/,
    "bone length judged against the screen instead of the body"
  ],
  // The play field is a clear pane over the camera. A tinted background here
  // sits directly on the player's own face.
  [
    "src/app/modules.css",
    /\.beat-field[^}]*background:\s*(?!transparent)(?:linear-gradient|rgba?\()/,
    "the play field was given a background tint again, over the player's face"
  ],
  // Beat Motion is a catch game now; jump/crouch obstacles are gone.
  [
    "src/games/DodgeMotionGame.tsx",
    /bar-high|bar-low|classifyBodyAction/,
    "the removed vertical-dodge obstacles came back"
  ]
];

/** Strips comments so the audit checks code, not the prose explaining it. */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

for (const [file, pattern, label] of forbidden) {
  const content = stripComments(await readFile(file, "utf8"));
  if (pattern.test(content)) findings.push({ file, label: `forbidden: ${label}` });
}

if (findings.length) {
  console.error(JSON.stringify({ files: sourceFiles.length, totalLines, findings }, null, 2));
  process.exit(1);
}

// Internal module count is derived from the registry, not hardcoded - the
// ninth module (math-choice) shipped before its count was updated elsewhere.
const gamesRegistry = await readFile("src/lib/data/games.ts", "utf8");
const internalModules = new Set(
  [...gamesRegistry.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((match) => match[1])
).size;

console.log(
  JSON.stringify({
    files: sourceFiles.length,
    totalLines,
    findings: 0,
    internalModules,
    secretScan: "PASS",
    externalLauncher: "ABSENT",
    gesturePreflight: "PRESENT",
    temporalPlayerSlots: "PRESENT",
    replayOverlay: "PRESENT"
  })
);
