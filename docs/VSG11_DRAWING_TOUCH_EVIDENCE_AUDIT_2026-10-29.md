# VSG-11 — Drawing Creative Workspace: Evidence-first browser audit

**Date:** 29 October 2026
**Base:** `main@ff3c1146b13ac1615edb72da3339cc1f7ee1a775` after VSG-10 Stage Detail #546 merged.
**Status:** QA-ONLY PR. No runtime/CSS changes authorized by this step.

## Code-backed baseline

- `CreativePracticeActivity.tsx` owns Drawing; the Drawing Stage catalog remains in `CreativeTrackViews.DrawingStageScreen` → shared Stage engine.
- Drawing has a **480×480 logical canvas**, `ReactPointerEvent` pointer capture for strokes and a single-point dot render, `DrawingScaffold`, ten canonical palette colors, Undo, Reset, optional guide toggle, and Finish.
- CSS `CreativeStudio.module.css` switches the desktop two-column workbench into a single column at ≤760px. Canvas and tools may scroll vertically; this is *not* by itself a defect. The `.canvas` uses `touch-action:none`.
- Existing SI-06G/VQA-07 Chromium QA proves mouse stroke, completion, Again and 320/390/768/1280 canvas visibility. It **does not independently prove** single-tap touch strokes, undo/reset, guide toggle and short-landscape control reachability.
- One historical Drawing Finish-after-stroke assertion failed and passed on rerun without runtime modifications. Treat it as possible test flakiness until reproduced.

## Added narrow, independent QA

`npm run test:ui:vsg11-drawing` runs Chromium with touch emulation against the canonical `drawing-line-horizontal` activity at:

| Viewport | Mode |
|---|---|
| 320×720 | small phone |
| 390×844 | phone |
| 430×860 | wide phone |
| 768×1024 | tablet |
| 1280×800 | desktop |
| 568×320 | short landscape |

It checks that:
1. The source 480×480 coordinate contract, square canvas, first-action discoverability (portrait mobile), `touch-action:none` and **no horizontal page overflow** remain intact.
2. All ten palette swatches and tool buttons retain ≥44×44px targets even when vertically scrollable; no clipped horizontal tools.
3. **One touchscreen tap** draws an actual single-point mark and enables Finish; Undo returns the exact previous pixels, disables Finish and doesn't falsely complete.
4. Two touch marks can be Reset; Reset clears pixels and disables Finish without writing progress.
5. If a guide exists, toggling guide on/off never erases the drawing.
6. A full pointer stroke enables Finish; the canonical three-star overlay writes completion once; Again hides the overlay while preserving the same artwork.
7. Browser page errors remain empty. Original screenshots are archived at each of seven states per viewport: idle, single-tap, undo, reset, guide-off (or no-guide), worked, completion (**42 expected PNG files**).

Dedicated CI artifact: `vsg11-drawing-workspace-screenshots`. The audit tests **simulated touch in Chromium**, not physical Safari touch or real-device screen reader acceptance.

## Release / decision gates

- [ ] Seven exact-head CI jobs PASS, including independent VSG-11 script.
- [ ] Review original 42 screenshots and classify concrete text/canvas/control issues before proposing runtime/CSS changes.
- [ ] If a source-backed issue appears, file a separate scoped Drawing runtime PR; preserve 480×480 coordinates, stroke/Undo/Reset semantics, completion-only evidence and all 100 Drawing activities.
- [ ] Cloudflare merged-SHA production smoke and physical iOS Safari sign-off separately verified; neither is implied by GitHub CI.
- [ ] No World, Motion Engine, Shop, DB, Stage locks, scoring/mastery, Coloring or canonical learning-content edits.

Reference: [VSG-11 issue #547](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/547).
