# Architecture

## Layer model

```text
Next.js routes and screens
        ↓
Game orchestration (GameClient)
        ↓
Reusable deterministic game engine
        ↓
Motion capture hook
        ↓
MediaPipe adapter + hand utilities
        ↓
Browser camera / pointer fallback
```

## Core separation

### `src/engine`

Pure TypeScript. It has no React, DOM, camera, or network dependency. It contains:

- seeded random generator;
- math/pattern/trace/shape challenge generation;
- challenge history deduplication;
- digit templates and path recognition;
- path normalization and scoring;
- session state machine;
- local progress sanitization;
- game registry.

This layer is compiled and tested independently with Node.

### `src/vision`

- `mediapipe.ts`: dynamically imports `@mediapipe/tasks-vision`, tries local then official remote assets, GPU then CPU.
- `hand-utils.ts`: mirror correction, player assignment, writing pose, open-palm pose, smoothing.

### `src/hooks/useMotionCapture.ts`

Owns camera stream, animation loop, hand tracker lifecycle, trajectory state, stationary submit, open-palm clear, and pointer fallback submission.

### `src/components/GameClient.tsx`

Owns UI/game orchestration:

- selected grade;
- setup/device-check/ready/countdown/play/time-up/result;
- timer;
- challenge changes;
- scoring;
- result persistence.

## Mirror contract

The preview is mirrored using CSS (`scaleX(-1)`). Raw MediaPipe X coordinates are converted with `1 - x`. Therefore the trail and visual preview move in the same direction from the user’s perspective.

## Player assignment

```text
x < 0.48  → Player A
0.48–0.52 → neutral dead zone
x > 0.52  → Player B
```

Single-player games always assign the tracked hand to Player A.

## Data and backend

There is deliberately no user database. Next.js Route Handler `/api/health` is included for deployment health checks. The server never receives video frames. Local progress uses `localStorage` only.
