# Mainlagi Mobile Route QA

Last reviewed: 10 September 2026

This document describes the automated responsive route gate introduced in Expansion Batch 2. It complements the shared design-system contract in `MOBILE_DESIGN_SYSTEM.md` and the route inventory in `MOBILE_ROUTE_MATRIX.md`.

## Automated browser gate

Source:

```text
scripts/run-mobile-route-browser-tests.mjs
```

CI job:

```text
Mobile route QA (Chromium)
```

The job installs the repository's pinned dependencies, installs the Chromium binary used by Playwright, builds a local production Next.js app, starts it on `127.0.0.1:4010`, and runs the canonical route matrix against the production build.

The Browser plugin is not available in the execution environment used to implement this batch, so repository automation uses the existing Playwright dependency. This does not add a new production dependency.

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
- `coloring`.

The `/play/math-choice` route represents the motion/camera game wrapper. Camera permission itself is not granted by this headless layout test.

## Per-route assertions

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

## Route-boundary migration

Batch 2 adds a semantic route boundary on these application families:

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

A green headless-Chromium matrix is strong code-level responsive evidence, but it is not evidence that every physical-device behavior is perfect. The following remain real-device acceptance items for the final device QA batch:

- iOS Safari browser chrome and safe-area behavior on physical iPhone hardware;
- Android Chrome browser chrome on representative devices;
- virtual-keyboard resizing, focus, and scroll recovery during profile/settings input;
- real camera permission prompts, portrait/landscape orientation changes, and camera recoverability;
- actual finger coordinate accuracy on trace surfaces after device pixel ratio and orientation changes;
- audio/TTS timing on physical devices;
- accessibility behavior that depends on platform assistive technology.

These limitations are explicit so a passing CI job is not misrepresented as physical-device certification.

## Release gate

`Production smoke (Cloudflare)` depends on `Mobile route QA (Chromium)` after Batch 2. A commit cannot reach the final production-smoke success state through CI unless the browser route matrix also passes.
