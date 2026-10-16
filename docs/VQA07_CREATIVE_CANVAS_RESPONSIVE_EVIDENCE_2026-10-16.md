# VQA-07 — Creative Canvas First-Action and Completion Evidence

Date: 16 October 2026
Status: **DRAFT QA-ONLY / NOT MERGED / NOT PRODUCTION VERIFIED**
Base: `main@fb98114202effdd94561449488e5a9c511ca2d44`
Parent: VQA issue #501. This wave follows merged #509 foundation, #510 Sorting, #512 Audio/Symbol Hunt QA, #513 shared tap-choice and #515 Drawing Stage catalog.

## Why this wave exists
The catalog has 100 Coloring and 100 Drawing creative activities. They are **not** 200 tap-choice screens. `CreativePracticeActivity` owns live coloring-region and freehand canvas behavior; canonical catalog/guide tests already assert 100 scene/guide identities. `run-si06g-creative-browser-tests.mjs` proves representative 390px completion, persisted artwork and local Again. None of those checks establishes a 320px, 768px, 1280px **visual** matrix for the full creative workspace including first action and 3-star completion.

This wave is deliberately **evidence collection and release gating**, not a presumptive redesign. The first child action is the drawing canvas or the coloring picture, not the decorative title; palette colors and essential creative scaffolds are pedagogy, not duplicated explanatory copy.

## Scope
New `scripts/run-vqa07-creative-visual-browser-tests.mjs` runs on local Next.js production build and validates, for:
- `/child/demo-gian/activity/drawing-line-horizontal`
- `/child/demo-gian/activity/color-gavi`
- **320×720**, **390×844**, **768×1024**, **1280×860**
- **idle**, **worked**, **completion**, **Again** states

Expected: **32 PNG screenshots** under isolated `.vqa07-creative-canvas/`, each independently archived by Actions as `vqa07-creative-canvas-screenshots`. Paths keyed by runtime, viewport, and state. No artifact re-use or screenshot fabricated from CSS mocks.

The checks also assert:
1. Exact canonical direct activity URL; artwork visible and at least 160px; no horizontal clipping or document-level overflow. On 320/390, at least **80px of the picture/canvas is visible before scrolling**.
2. All 10 standard color palette buttons remain present. Coloring can paint a named region via keyboard; drawing captures real pointer strokes; neither has false-positive Completion at idle.
3. The creative `Selesai` action unlocks only once work is performed. After completion: 3 stars, Belajar context and exactly **Back / Again / Next / Share** in that order; completion controls retain >=44px touch targets.
4. Activity completion is persisted; drawing pixels remain unchanged under Completion. Again returns to the same creative workspace without document reload, preserving strokes/region fills and avoiding duplicate navigation.
5. JavaScript page errors are absent; no forced motion/gameplay compatibility changes.

## Explicit non-goals / prohibitions
- **Do not change** the underlying coloring geometry, drawing scaffold, canvas interaction, ten-color palette, activity text, progress/evidence semantics, completion engine, or creative assessment model merely to make the screenshot fit.
- No 900-activity screenshot signoff is asserted by this representative QA. The 200-activity count describes catalog scope, **not 200 separate captures**.
- No new pattern #48, no World/Motion Engine/Shop/auth/Supabase/DB changes, no character development; keep 47 patterns and 900 canonical activities.
- Real iOS Safari/VoiceOver and owner+child observation remain separate.

## Acceptance before merge
1. Exact PR head 7/7 CI PASS, including required mobile route/creative suite and the existing 900 content/gameplay contract checks.
2. Download and manually inspect **all 32** PNGs. Record observed first-action visibility, content density, palette/coloring geometry, completion legibility and Again state at each viewport. Rework visual code **only if demonstrated**.
3. Strict fail-closed regression; do not remove tests, skip screens, or hide cropping with `overflow-x:hidden`.
4. Protected squash merge, then separately verify merged-main 8/8 including production Cloudflare exact SHA before LIVE VERIFIED.
