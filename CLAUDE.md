# CLAUDE.md — Repository Instructions

## Project identity

Motion Learning Hub is a privacy-first Next.js motion-learning game platform. It has no login and no user database. Webcam frames must stay inside the browser.

## Mandatory reading order

1. `README.md`
2. `docs/PRD.md`
3. `docs/ARCHITECTURE.md`
4. `docs/TECHNICAL_SPEC.md`
5. `docs/KNOWN_LIMITATIONS.md`
6. The file being edited and its tests

## Non-negotiable rules

- Do not claim a camera/model fix works before testing it on a real browser and webcam.
- Do not upload, persist, or transmit camera frames.
- Do not add face recognition.
- Preserve the camera mirror contract: preview, fingertip coordinates, and canvas must share the same user-facing orientation.
- Preserve the split-screen dead zone: Player A `< 0.48`, Player B `> 0.52`.
- Recognition failure is a retry, never a mathematically wrong answer.
- Division questions must have integer results and never divide by zero.
- Kindergarten and Grade 1 must not receive multiplication/division.
- Do not add login, database, analytics, or external telemetry without explicit approval.
- Make a backup before changing an existing file over 50 lines: `filename.backup.DDMMYY-HHMM.ext`.
- Update `docs/log.md` for meaningful changes.
- Add or update tests for every engine behavior change.

## Required checks before declaring completion

```bash
npm run typecheck
npm run lint
npm run test:engine
npm run simulate
npm run build
```

For camera work, also execute the manual checklist in `docs/CAMERA_TESTING.md`.

## Key ownership

- `src/engine/` — deterministic domain logic; no React or browser dependencies.
- `src/vision/` — MediaPipe adapter and gesture utilities.
- `src/hooks/useMotionCapture.ts` — camera lifecycle and fingertip trajectory capture.
- `src/components/GameClient.tsx` — game orchestration and UI flow.
- `src/components/MotionCanvas.tsx` — player canvas and pointer fallback.

## Safe change workflow

1. Reproduce the issue.
2. Write or update a failing test where possible.
3. Make the smallest coherent change.
4. Run the relevant focused test.
5. Run all required checks.
6. Test camera behavior manually when vision code changed.
7. Update documentation and `docs/log.md`.
