# Mainlagi Mobile Route & Visual Product QA

Last reviewed: **16 September 2026**

This document describes the blocking Chromium QA inside `Mobile route QA (Chromium)`. It complements `MOBILE_DESIGN_SYSTEM.md`, `MOBILE_ROUTE_MATRIX.md`, `MAINLAGI_ART_BIBLE.md`, `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`, and the external physical-device matrix in `BATCH16_PHYSICAL_DEVICE_QA.md`.

## Blocking browser gates

The CI job builds the local production Next.js app once, then runs:

```text
scripts/run-mobile-route-browser-tests.mjs
scripts/run-visual-baseline-browser-tests.mjs
```

The first script remains the broad responsive/runtime/accessibility/lazy-load gate. The second script is VQA-01: a stable whole-product screenshot and exact-route baseline. Both must pass before the `Mobile route QA (Chromium)` job is green. On `main`, `Production smoke (Cloudflare)` depends on that job.

## Existing responsive route matrix

The broad route matrix continues to exercise:

- 320×720
- 360×800
- 375×812
- 390×844
- 430×860
- 768×1024
- 1024×768

It covers child entry/profile selection, child home/library/subject/stage/activity/games/rewards, Parent routes, global game catalog/detail and `/play/math-choice`.

At 320px and 430px it also opens representatives for `tap_choice`, `listen_and_choose`, `matching`, `trace`, `story`, `coloring`, and `drawing`. A 390×844 reduced-motion pass checks representative accessibility and lazy-loading behavior.

Per-route assertions include non-error navigation, meaningful content, route-boundary presence where applicable, no Next.js error overlay, no document horizontal overflow, phone touch-target sizing for child-facing controls, no uncaught page errors, and no browser console errors.

## VQA-01 permanent visual product baseline

Source:

```text
scripts/run-visual-baseline-browser-tests.mjs
```

Canonical viewports:

```text
390×844
768×1024
1280×800
```

Each run captures **14 product surfaces × 3 viewports = 42 deterministic screenshots**:

1. clean-session public root `/`;
2. child profile selection;
3. child home;
4. Math subject/gallery;
5. Math Angka stage/readiness;
6. representative Garden activity `math-count-3`;
7. rewards;
8. parent report;
9. account;
10. login;
11. signup;
12. forgot-password;
13. deterministic expired-auth-link error;
14. not-found.

Every VQA-01 capture blocks on:

- the exact expected final pathname, so a progression/auth redirect cannot count as a screenshot PASS;
- the expected HTTP status (`404` is explicit only for the not-found probe);
- meaningful body content;
- `<main>` landmark;
- top-level heading;
- expected `MobileRouteBoundary` where the route family has one;
- absence of Next.js framework error overlays;
- absence of horizontal document overflow;
- phone touch-target minimums for child-facing baseline routes;
- zero uncaught page errors;
- zero browser console errors.

The screenshot artifact lives under:

```text
.mobile-route-qa/visual-baseline/
```

The suite also writes `manifest.json` containing viewport, requested path, expected path, final path, HTTP status, and screenshot filename for every capture. CI uploads the directory inside the existing `mobile-route-qa-screenshots` artifact.

VQA-01 is intentionally **not** a brittle pixel-perfect image-diff gate. The structural/browser assertions are blocking; screenshots and the manifest are the permanent evidence surface for human/AI visual review against the Art Bible. Visual changes must be reviewed at actual screenshot scale.

## Exact-path boundary

The old broad mobile route harness predates the production visual checkpoint and may intentionally probe redirect aliases such as `/child`. VQA-01 therefore applies exact-path assertions to the canonical screenshot surfaces rather than pretending every historical alias must remain a non-redirect.

Any route selected as permanent visual evidence must declare its expected canonical pathname. An unintended redirect on such a route is a test failure.

## Artifact rules

Screenshots are evidence, not source assets. They are uploaded by CI and are not committed as product artwork.

Stable VQA-01 filenames use:

```text
<width>x<height>-<surface-name>.png
```

Examples:

```text
390x844-public-root.png
768x1024-stage-math-angka.png
1280x800-parent-report.png
```

## What this automation does not prove

A green Chromium matrix does not replace physical-device acceptance. The following remain external evidence items:

- iOS Safari and Android Chrome browser chrome/safe-area behavior;
- virtual keyboard resizing and focus recovery;
- real camera permission/orientation/recovery;
- real finger precision on trace/drawing/coloring;
- audible audio/TTS unlock and cleanup;
- VoiceOver/TalkBack;
- real offline/network-interruption behavior.

Canonical manual evidence remains `BATCH16_PHYSICAL_DEVICE_QA.md`.

## Release gate

On `main`, `Production smoke (Cloudflare)` depends on `Mobile route QA (Chromium)`. Once VQA-01 is merged, a production SHA cannot receive final CI success unless both the legacy responsive/runtime matrix and the permanent visual product baseline pass first.