# P3 — cross-engine interaction acceptance
**Date:** 5 November 2026  
**Baseline:** `main@9f9d3b0270a86af44c8f0235817bf564b4552eef` after P2 merge.  
**Status:** Automated gate proposal; physical-device acceptance remains open.

## Context and objective

P2 (PR #554) runs Chromium + Linux WebKit on eight representative routes at seven viewports and a landscape viewport. Those 120 automated checks and 72 screenshot captures test route rendering, hydration, images, primary controls and basic accessibility. The previous P0 issue #555 showed that a rendered activity can appear functional even if its recorded wrong-attempt evidence or pointer handler is not yet ready. A healthy screenshot is **not** proof that the learning action, stored attempt, accessibility focus, Share and Again are correct.

P3 adds **behavioral regression evidence**, not mass visual redesign or a new gameplay pattern.

## Implemented scope

`scripts/run-p3-cross-engine-interaction-qa.mjs` and `.github/workflows/p3-cross-engine-interaction.yml` run independent headless Chromium and Linux WebKit suites, each on 390×844 and 768×1024. Each engine exercises:

1. **English fallback choice (`english-find-blue`)**: wait for the actual LearningAttemptBridge listener; choice focus/touch, wrong feedback without completion; correct via Enter; exact persisted **one** assessed attempt, correct=1, incorrect=1, retry=1, accuracy=0.5, source `runtime-evidence-bridge`; canonical 3-star Back/Again/Next/Share; share safety; orientation without reload or duplicate attempt; Again resets only local view.
2. **Math Subitizing Glance (`math-subitize-4`)**: initialize the same **legitimate canonical math prerequisite** as the existing VSG-16 browser fixture, without disabling Stage locks; wait for actual runtime readiness; original four-dot spatial arrangement [0,2,6,8] and three choices; generic answer-safe first Help; wrong keyboard answer unlocks original canonical cue; correct tap/click with Help open; canonical 3-star completion; exactly one assessed attempt with wrong=1/retry=1/accuracy=0.5 and `subitizing-glance-runtime` metadata; orientation, safe Share and Again with no duplicate attempt.
3. **Physical-device evidence recorder (`/qa/device`)**: all 22 rows start `PENDING`, status selects accessible/44px; a synthetic **FAIL** remains in localStorage after reload, other entries remain PENDING; Reset returns all 22 to PENDING. **No synthetic PASS is emitted**, no manual hardware evidence implied.

Each workflow has isolated browser contexts/local data, exact-path assertions, document overflow checks, JS exception checks, screenshots of initial/wrong/completed/rotated/replay or checklist state, and machine-readable `manifest.json` with pass/fail details. Failures fail the workflow, rather than retrying or suppressing inconsistent attempt evidence.

Expected outcome: **3 flows × 2 viewports × 2 engines = 12 end-to-end checks**, with **26 images per engine = 52 PNG evidence files** (5+5+3 per viewport). Use the exact file count from CI, not assumptions, for the final report.

## Exclusions

This changes **QA scripts/workflow/docs only**. No canonical answers or curricula (900 activities, 47 gameplay families), scoring/mastery algorithms, Stage locks, creative tools, World, Motion, Shop/payment, auth/DB, art assets or TTS voices. The P3 fixtures stay in a local isolated browser session; they are not child profile records or server masteries.

**Linux headless WebKit is not a physical iPhone Safari.** Tests do not establish real-finger tracing, native iOS browser chrome/safe areas, camera/audio hardware, TalkBack/VoiceOver, OS zoom or offline account reconciliation. Hardware acceptance remains recorded solely in `docs/BATCH16_PHYSICAL_DEVICE_QA.md`, `/qa/device`, and [issue #83](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/83). If results are unavailable, keep those rows PENDING rather than claiming PASS.

## Acceptance and merge conditions

- P3 Chromium and WebKit jobs **both** pass at the PR's exact head, with true click/keyboard/touch input and deterministic persisted attempt assertions.
- Verify the two manifests and actual screenshot artifacts; inspect representative English/Math states and checklist evidence in both engines.
- Required Ubuntu, Windows, production build, dependency/security, Shop staging and mobile regression CI **7/7 PASS** at the same head.
- Protected squash merge to `main`, then independent **8/8 merged-main CI including exact-SHA Cloudflare smoke**.
- Physical iPhone Safari/Android Chrome acceptance is an independent gate, not auto-closed by this P3 PR.

## Release scope boundary

P3 is complete **for automated behavioral regression** only after all CI evidence has been verified. Mainlagi's **physical-device release acceptance** is still open until actual hardware evidence is available; never call 900/900 classified equal to 900 visually/behaviorally approved.
