# Mainlagi TV V3 — Implementation Log

**Branch:** `feature/mainlagitv-motion-engine-v3`  
**Draft PR:** #2  
**Base:** `feature/mainlagitv-v2.0.2-ts6-fix`  
**Last updated:** 6 August 2026  
**Merge status:** **Do not merge. Physical camera QA is still required.**

---

## Purpose

This log records the staged repository patches implemented from the V2 baseline. It separates automated evidence from claims that require a real webcam, child/adult testers, and physical room conditions.

The full architecture and rollout plan is stored in:

```text
docs/MAINLAGI_ENGINE_REBUILD_AND_PATCH_PLAN.md
```

---

# Completed Stages

## Stage 0 — Protected V3 baseline

Completed:

- created `feature/mainlagitv-motion-engine-v3` from the V2 branch;
- kept PR #1 unchanged and unmerged;
- created Draft PR #2 against the V2 branch, not `main`;
- preserved the engine rebuild blueprint in the repository;
- documented that OpenRouter is not part of the real-time motion loop;
- documented that webcam frames remain browser-local.

## Stage 1 — Quality gate and repository hygiene

Completed:

- resolved inherited ESLint errors;
- removed render-time `Date.now()` and `performance.now()` purity violations;
- removed render-time ref access violations;
- replaced internal anchors with Next.js `Link` where required;
- typed the MediaPipe runtime without explicit `any`;
- cleaned AirBoard object URL lifecycle and undo/redo state;
- cleaned timer and delayed-question lifecycle behavior;
- split CI into independent Ubuntu quality, production build, Windows compatibility, and dependency audit jobs;
- changed clean CI installation to `npm ci`.

Automated status: passed.

## Stage 2 — Production dependency security

Completed:

- patched PostCSS through an explicit override;
- patched Sharp through an explicit override;
- regenerated `package-lock.json` through a controlled one-time workflow;
- removed the temporary lockfile workflow afterward;
- made production dependency audit an enforced CI job;
- did not use `npm audit fix --force`.

Automated status: passed with no high/critical production audit failure.

## Stage 3 — Temporal vision stabilization

Completed:

- added adaptive One Euro filtering;
- added smoothed Player A/B fingertip cursor coordinates;
- added smoothed hand landmarks;
- added smoothed body centers;
- added smoothed body landmarks;
- reset filters after long tracking gaps and camera lifecycle resets;
- increased two-player hand candidates to four before A/B association;
- added regression tests for stationary jitter reduction, metadata preservation, and long-gap reset.

Automated status: passed.

Physical status: not yet measured with real camera clips.

## Stage 4 — Hands-free preflight start

Completed:

- added `thumbs-up` to the gesture contract;
- added geometric thumbs-up recognition;
- added a 900 ms stable-hold requirement;
- added progress visualization;
- added Indonesian speech confirmation;
- added raised-hands fallback for pose-only games;
- retained a manual start button for accessibility and recovery;
- added dedicated gesture contract tests.

Automated status: passed.

Physical status: thumbs-up false-positive and false-negative rates are not yet measured.

## Stage 5 — Math Warung air cursor

Completed:

- added pure magnetic target selection logic;
- added configurable large magnetic radius;
- added visible cursor snapping;
- added dwell progress visualization;
- added 900 ms dwell selection;
- added target lock until the cursor exits or changes target;
- added air selection for product cards and checkout;
- retained mouse, touch, keyboard, plus, and minus controls;
- added unit tests for target acquisition, radius rejection, dwell timing, repeat lock, and target switching.

Automated status: passed.

Physical status: selection success rate with children, adults, different distances, and lighting remains unmeasured.

## Stage 6 — Guided tracing engine

Completed:

- introduced a scorer that preserves stroke boundaries;
- removed automatic imaginary lines between separate strokes;
- added target coverage measurement;
- added off-path measurement;
- added start and end proximity scoring;
- added forward/reverse direction validation;
- added explicit closure validation;
- integrated direction-aware scoring into Number Trace;
- integrated coverage and closure scoring into Shape Quest;
- added tests for valid forward tracing, reversed tracing, off-path tracing, separated strokes, closed shapes, and open shapes.

Automated status: passed.

Physical status: gameplay thresholds still require tuning from real user sessions.

---

# Latest Verified CI Snapshot

Workflow run:

```text
31070827463
```

Result:

- Ubuntu structure/source/type/lint/engine/simulation gate: **PASS**
- Production Next.js build: **PASS**
- Windows type/lint/engine gate: **PASS**
- Production dependency audit: **PASS**

The automated result proves source consistency, compilation, deterministic engine contracts, and clean dependency audit at this commit. It does **not** prove camera accuracy or usability.

---

# New Automated Contracts

The V3 branch now includes dedicated tests for:

- core math and pattern generation;
- digit canonical templates;
- stroke lifecycle;
- body actions;
- player-order tracking;
- gesture hysteresis;
- thumbs-up recognition;
- One Euro filtering;
- tracking-gap reset;
- magnetic air targets;
- dwell timing and repeat protection;
- direction-aware guided tracing;
- off-path rejection;
- multi-stroke boundary preservation;
- shape closure validation;
- Hijaiyah canonical templates.

---

# Required Physical QA Before Merge

The following remain mandatory and cannot be completed by GitHub Actions:

## Camera devices

- internal laptop webcam;
- external webcam;
- low/mid/high performance laptops;
- Chrome and Edge production builds.

## People

- children and adults;
- left-handed and right-handed users;
- one and two players;
- different heights and arm lengths.

## Conditions

- bright room;
- normal indoor lighting;
- dim room;
- backlight;
- plain and busy backgrounds;
- partial hand/body occlusion;
- crossing hands;
- temporary camera loss;
- ten-minute continuous sessions.

## Metrics

- cursor jitter;
- gesture false positive/negative rates;
- time to start game;
- Player A/B identity swaps;
- tracking recovery time;
- Math Warung selection success;
- accidental dwell selection;
- tracing correct acceptance;
- reversed-path rejection;
- average retries;
- CPU usage and FPS.

---

# Remaining Planned Stages

## Stage 7 — Browser-local digit classifier

Do not add a remote LLM to the game loop. The planned classifier should:

- rasterize cleaned strokes to a small grayscale image;
- run locally through ONNX Runtime Web or TensorFlow.js;
- expose confidence per digit;
- combine classifier confidence with expected-answer validation;
- retain deterministic fallback when the model fails;
- be introduced only after real tracing and handwriting metrics are recorded.

## Stage 8 — Body action redesign

Planned:

- temporal action stability;
- normalized joint angles;
- calibrated thresholds;
- relative pose targets;
- removal of unsupported room/depth claims;
- redesign Run to Target around safe poses rather than true forward/back room movement.

## Stage 9 — Real Next.js browser E2E

Planned:

- Playwright against the actual app;
- camera landmark fixtures;
- hands-free preflight path;
- Math Warung dwell path;
- tracing path;
- one/two player route tests;
- console and hydration error checks;
- responsive screenshots from the real runtime.

## Stage 10 — Privacy, role authorization, and subscription

Planned after engine stability:

- privacy and terms pages;
- parent/child disclosure;
- database-role-based admin UI;
- CSP and frame protection;
- subscription entitlement;
- optional OpenRouter server proxy for tutor/report/content features only.

---

# Safety and Rollback Rules

- do not merge PR #1 or PR #2 without explicit user approval;
- do not force-push;
- do not modify `main` directly;
- do not upload webcam frames;
- do not expose service keys or OpenRouter keys to the client;
- do not use `npm audit fix --force`;
- do not require an NVIDIA GPU for normal users;
- do not claim room mapping from a normal webcam;
- keep manual/touch/keyboard fallbacks;
- revert by stage if physical QA shows regression.

---

# Current Verdict

The V3 branch is substantially healthier than the uploaded V2 baseline:

- automated quality gates are green;
- production dependency audit is green;
- camera landmarks are temporally smoothed;
- preflight can start hands-free;
- Math Warung has tolerant dwell selection;
- Number Trace and Shape Quest use explicit guided tracing contracts.

It is still a **camera QA candidate**, not a production release. The next reliable decision must be based on physical webcam testing and measured interaction failures, not only compilation or synthetic tests.
