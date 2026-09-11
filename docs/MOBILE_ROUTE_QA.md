# Mainlagi Mobile Route QA

Last reviewed: 11 September 2026

This document describes the automated responsive route gate introduced in Expansion Batch 2 and hardened in Batch 16. It complements the shared design-system contract in `MOBILE_DESIGN_SYSTEM.md`, the route inventory in `MOBILE_ROUTE_MATRIX.md`, and the physical-device acceptance matrix in `BATCH16_PHYSICAL_DEVICE_QA.md`.

## Automated browser gate

Source:

```text
scripts/run-mobile-route-browser-tests.mjs
```

CI job:

```text
Mobile route QA (Chromium)
```

The job installs the repository's pinned dependencies, installs the Chromium binary used by Playwright, builds a local production Next.js app, runs the Batch 16 production JavaScript/lazy-load budget gate, starts the app on `127.0.0.1:4010`, and runs the canonical route matrix against the production build.

Repository automation uses the existing Playwright dependency. This does not add a new production dependency.

## Viewports

Every canonical route is exercised at:

- 320×720
- 360×800
- 375×812
- 390×844
- 430×860
- 768×1024
- 1024×768

The 320–430 widths are the release-critical phone matrix.

## Canonical route coverage

The browser gate covers:

- child entry and profile selection;
- demo child entry, home, learning library, subject, stage, activity, games, and rewards;
- Parent overview, children list, child overview, progress, reports, certificates, plan, privacy, and settings;
- global game catalog and game detail;
- the `/play/[slug]` motion/camera wrapper through `math-choice`.

The `demo-gian` profile is the explicit non-account sandbox sentinel used for deterministic CI routing. The test does not create or mutate real account-owned child data.

## Runtime representatives

At the two phone extremes, 320px and 430px, the suite separately opens representative activities for:

- `tap_choice`;
- `listen_and_choose`;
- `matching`;
- `trace`;
- `story`;
- `coloring`;
- `drawing`.

The `/play/math-choice` route represents the motion/camera game wrapper. Camera permission itself is not granted by this headless layout test.

## Per-route responsive assertions

For each route and viewport the gate checks:

1. navigation returns a non-error HTTP response;
2. meaningful body content renders;
3. the expected `MobileRouteBoundary` is present;
4. no Next.js framework error overlay is visible;
5. document/body scroll width does not exceed the viewport;
6. child-facing visible non-inline controls on phone widths are approximately 44 CSS px or larger, with a small measurement tolerance;
7. no uncaught page errors occur;
8. no browser console errors occur.

Selected routes also produce screenshots which CI uploads as the `mobile-route-qa-screenshots` artifact. The artifact is evidence for review and is intentionally not committed to the repository.

## Batch 16 accessibility and lazy-load regression layer

Batch 16 adds a second representative browser pass at 390×844 with `prefers-reduced-motion: reduce` for:

- `/child/demo-gian/home`;
- `/child/demo-gian/learn`;
- `/child/demo-gian/activity/math-count-3`;
- `/parent/children/demo-gian/reports`;
- `/play/math-choice`.

This pass asserts:

- the document language remains `id`;
- visible images expose an `alt` attribute;
- visible inputs, selects, and textareas expose an accessible label;
- focusable descendants are not left inside `aria-hidden="true"` content;
- repeated keyboard `Tab` navigation reaches an actual focus target;
- long animation/transition durations are suppressed under reduced-motion preference;
- representative non-vision routes do not eagerly request MediaPipe/landmarker/WASM/task assets;
- routes do not eagerly request `/api/tts` before user interaction.

The production-build step also runs `scripts/run-batch16-build-budget.mjs`, which enforces explicit JavaScript regression ceilings and verifies that executable MediaPipe remains dynamically imported and TTS does not eagerly initialize through `AudioManager` construction.

The verified Batch 16 automated baseline on CI #317/#318 was approximately:

- largest static JS chunk: **0.35 MiB** against a 5 MiB ceiling;
- total static JS: **2.03 MiB** against an 18 MiB ceiling;
- root/main JS: **0.42 MiB** against a 2 MiB ceiling.

These are regression baselines and ceilings, not physical-device latency guarantees.

## Route-boundary migration

Batch 2 added a semantic route boundary on these application families:

```text
child-select
child-learning
parent
game-catalog
game-play
```

The boundary is width-safe, preserves text wrapping and media containment, and supplies scoped mobile hardening without hiding document-level overflow. Parent navigation becomes a horizontally scrollable sticky control strip on phone widths instead of forcing the desktop sidebar column into a narrow viewport.

The foundation continues to prohibit `overflow-x: hidden` and `overflow-x: clip` as a way of concealing layout bugs.

## What this automation does not prove

A green headless-Chromium matrix is strong code-level responsive/accessibility regression evidence, but it is not physical-device certification. The following remain real-device acceptance items in Batch 16:

- iOS Safari browser chrome and safe-area behavior on physical iPhone hardware;
- Android Chrome browser chrome on representative physical hardware;
- virtual-keyboard resizing, focus, and scroll recovery during profile/settings input;
- real camera permission prompts, portrait/landscape orientation changes, and camera recoverability;
- actual finger coordinate accuracy on trace/drawing/coloring surfaces after device pixel ratio and orientation changes;
- audible audio/TTS unlock, replay, cleanup, and fallback behavior on physical devices;
- VoiceOver/TalkBack navigation and other platform assistive-technology behavior;
- offline/reconnect/session-isolation behavior under real mobile-network interruption.

Canonical manual evidence lives in `BATCH16_PHYSICAL_DEVICE_QA.md`. A row must not be marked `PASS` merely because this automated Chromium suite is green.

## Release gate

`Production smoke (Cloudflare)` depends on `Mobile route QA (Chromium)`. Since Batch 16, this means a main commit cannot reach final production-smoke success through CI unless the responsive route matrix, production JS/lazy-load budget, and representative accessibility/lazy-load browser layer all pass.

This automated release gate remains necessary but is not sufficient to close Batch 16; representative physical-device acceptance is still required.