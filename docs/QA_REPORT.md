# QA Report — Motion Learning Hub

**Date:** 2026-08-04  
**Project version:** 1.0.0  
**Scope:** Source package prepared for local installation and browser/device verification.

## Executive result

The pure game engine, random content generators, recognition utilities, state machine, local progress sanitizer, and simulation harness passed the automated checks available in this environment.

This report does **not** claim that software can never contain a bug. Two checks cannot be truthfully completed inside this sandbox:

1. A real `npm install` / `next build`, because the sandbox package-registry proxy does not provide the requested Next.js package.
2. Physical webcam testing across real laptops, lighting conditions, children, and browsers.

Both checks are explicitly included in the local review workflow.

## Automated checks completed

| Check | Result | Evidence |
|---|---:|---|
| Strict source-level TypeScript QA | PASS | `qa/source-check.log` |
| CSS parser validation | PASS, 0 parse errors | `qa/css-check.log` |
| Engine/unit tests | PASS, 27/27 | `qa/engine-test.log` |
| Three deterministic simulations | PASS, 0 invariant errors | `qa/simulation.log`, `qa/simulation-results.json` |
| Visual static render — desktop hub | PASS | `docs/implementation-hub.png` |
| Visual static render — desktop game | PASS | `docs/implementation-game.png` |
| Visual static render — mobile hub | PASS | `docs/implementation-mobile.png` |
| Required-file and empty-file scan | PASS | `qa/file-integrity.log` |
| ZIP CRC/integrity test | Run during final packaging | See final extracted-package log |

## Random content stress coverage

The test suite generated and validated approximately **105,000 procedural challenges**:

- 25,000 Kindergarten math challenges.
- 25,000 Grade 1 math challenges.
- 25,000 Grade 2 math challenges.
- 30,000 pattern challenges across supported levels.

Validated constraints include:

- no negative answers for the configured early-learning levels;
- no fractional division results;
- no division by zero;
- answers remain inside the level range;
- immediate challenge repetition is avoided;
- digit `0` and answer `100` remain valid.

This is procedural validation, not a claim that every mathematically possible question has been manually reviewed.

## Engine test coverage

The 27 tests cover:

- age-level arithmetic constraints;
- procedural pattern correctness;
- challenge deck deduplication;
- small-domain trace/shape deduplication;
- camera-coordinate mirroring;
- Player A / Player B split and middle dead zone;
- writing-pose detection;
- open-palm detection;
- point smoothing;
- malformed localStorage recovery;
- best-score persistence rules;
- digit recognition `0` through `9` using normal, mirrored, and noisy test trajectories;
- rejection of gestures too short to be reliable;
- guided path scoring;
- game state transitions;
- pause and resume behavior;
- scoring, wrong-answer handling, time-up, and replay;
- digit assembly for `0` and `100`.

## Three simulation results

### Simulation 1 — ideal two-player math round

- 20 challenges.
- Player A: 3025.
- Player B: 3025.
- Result: draw.
- Final phase: `result`.
- Invariant errors: 0.

### Simulation 2 — noisy pattern round

- 19 challenges.
- Includes retry and wrong-answer branches.
- Recognition retries: 6.
- Player A: 1260.
- Player B: 1060.
- Winner: Player A.
- Final phase: `result`.
- Invariant errors: 0.

### Simulation 3 — guided tracing recovery

- Number Trace Adventure: 10 accepted challenges, score 1462.
- Shape Quest: 10 accepted challenges, score 1458.
- Both sessions reached `result`.
- Invariant errors: 0.

## Visual verification method

The approved concept images are stored in `public/concepts/`. Implementation screenshots are stored in `docs/`.

Because normal browser navigation to localhost/file URLs was blocked by the sandbox administrator, static implementation surfaces were rendered with system Chromium through Playwright `page.set_content`. This verifies layout/CSS rendering, but it is not a substitute for running the installed Next.js application.

See `docs/FIDELITY_LEDGER.md` for the visual comparison.

## Checks blocked in this environment

### Dependency installation and production build

A registry availability check failed because the sandbox routes npm through an internal proxy that returned package-not-found for Next.js. Evidence: `qa/registry-check.log`.

Therefore these commands must be run on the user's laptop:

```bash
npm install
npm run check
```

`npm run check` executes real dependency-aware typechecking, ESLint, engine tests, all three simulations, and `next build`.

A `package-lock.json` is intentionally not fabricated. The first successful local `npm install` will generate it; review it and commit it after `npm run check` passes.

### Physical webcam validation

Automated tests cannot reproduce all camera/device variables. Complete the matrix in `docs/CAMERA_TESTING.md`, including:

- internal and external webcam;
- Chrome and Edge;
- normal and dim lighting;
- left- and right-handed writing;
- child and adult hand sizes;
- two players crossing near the dead zone;
- camera permission rejection/retry;
- stream cleanup after leaving the game.

## Release decision

**Package status:** Ready for local dependency installation, real production build, and physical webcam acceptance testing.  
**Not yet justified:** Claiming production certification or universal webcam accuracy before the local/device checklist passes.
