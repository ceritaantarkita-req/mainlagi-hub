# Reviewing and Fixing the Project with Claude on Your Laptop

## Recommended workflow

1. Extract the ZIP into a new folder.
2. Open the folder in VS Code.
3. Open PowerShell or terminal in that folder.
4. Run `npm install`.
5. Run `npm run check`.
6. Give Claude the repository folder and ask it to read `CLAUDE.md` first.
7. Make one small repair at a time and rerun checks.

## Prompt — full repository audit

```text
Read CLAUDE.md, README.md, docs/PRD.md, docs/ARCHITECTURE.md,
docs/TECHNICAL_SPEC.md, docs/KNOWN_LIMITATIONS.md, and docs/QA_REPORT.md.

Audit this Motion Learning Hub repository without inventing results.
First run npm run check. Report the exact command output and root cause of every failure.
Inspect the four game routes, camera lifecycle, mirror correction, player assignment,
digit recognition, random question constraints, timer, pause, time-up, result, replay,
localStorage handling, privacy, responsive layout, and cleanup of MediaStream/MediaPipe.

Do not add login, database, face recognition, video upload, or analytics.
Before editing any existing file over 50 lines, create the backup required by CLAUDE.md.
For each bug: reproduce it, add/update a test when possible, apply the smallest fix,
run focused tests, then run npm run check. Update docs/log.md.
Clearly distinguish automated verification from physical webcam testing.
```

## Prompt — camera and mirror audit

```text
Read CLAUDE.md and docs/CAMERA_TESTING.md. Audit only the camera pipeline:
src/vision/mediapipe.ts, src/vision/hand-utils.ts,
src/hooks/useMotionCapture.ts, and the rendering in GameClient/MotionCanvas.

Verify stream cleanup, duplicate-frame skipping, local/remote model fallback,
GPU-to-CPU fallback, mirrored preview, exactly-once X coordinate mirroring,
Player A/B dead-zone assignment, writing pose, open-palm clear, stationary submit,
and behavior when a hand disappears.

Do not claim success from code inspection alone. Add unit-testable coverage for utilities,
run npm run check, then provide a physical Chrome/Edge webcam checklist for anything
that cannot be automated.
```

## Prompt — digit recognizer improvement

```text
Read CLAUDE.md and docs/KNOWN_LIMITATIONS.md. Improve the deterministic digit recognizer
without silently changing the game contract. Preserve one-digit-at-a-time input,
normal/mirror handling, retry on low confidence, and support for 0 and 100.

Create a benchmark fixture format for recorded fingertip trajectories that contains no video
or identity data. Add representative normal, mirrored, noisy, left-handed, and alternate
stroke-order samples. Measure per-digit accuracy, false acceptance, and retry rate before and
after changes. Prefer reducing false acceptance over reducing retries.
Run npm run test:engine, npm run simulate, and npm run check.
```

## Prompt — fix build/type errors

```text
Read CLAUDE.md. Run npm run typecheck, npm run lint, and npm run build separately.
Do not hide errors with any, ts-ignore, disabled rules, or removing tests.
Fix the earliest root cause with the smallest coherent change.
Then run npm run check and update docs/log.md with commands and results.
```

## Prompt — visual QA

```text
Use the concept images in public/concepts and the implementation screenshots in docs.
Run the app and capture desktop 1536x1024 and mobile 390x844 screenshots.
Compare hierarchy, palette, game-card identity, child-friendly typography, spacing,
canvas size, timer/question prominence, and webcam visibility.
Do not turn the real UI into a raster screenshot. Keep text and controls code-native.
Repair visible overflow, clipping, tiny controls, and inconsistent spacing.
Run npm run check after changes and document intentional deviations.
```
