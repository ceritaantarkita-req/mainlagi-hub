# VQA-16 — Odd One Out choice legibility (Logic)

Date: **19 October 2026**
Status: **DRAFT / NOT MERGED / NOT LIVE VERIFIED**
Base: `main@0d8b0e7787e0660f5e734588b0375907306ac9ce`, after VQA-15 PR #526 passed 7/7 and merged. Parent: Issue #501.

## Grounded visual finding
Reviewed actual `320-odd-one-out-idle.png`, `320-odd-one-out-try.png` and `320-odd-one-out-success.png` from representative old Chromium screenshot artifact `#12021887501`, alongside source `OddOneOutActivity.module.css`. The three answer picture cards **Anjing / Kucing / Mobil** are visible with tactile width, but their labels shrink under `@media (max-width:560px)` to **.78rem (~12.5px)**. Children have to read tiny captions under icons. The activity contains multiple simultaneous directions (`Cari yang beda`, clue panel and idle hint), but some of those describe the pedagogical shared trait **Dua pilihan sama-sama hewan**. Do not aggressively hide source content or change instructions in this word-readability pilot. 320/390/768 baseline image review found no demonstrated clipping, route/scoring issue, so avoid inventing one.

## Narrow design and code scope
- Make the **actual three choice names** legible at **>=18px at 320/390/768**, without changing canonical strings, order, icon meaning, semantic choice buttons or game engine.
- Enlarge the **existing** child-choice picture glyph to >=38px at mobile <=560px and give the same real options a little more vertical breathing room (>=146px). Preserve three columns, keyboard focus, logical two-of-one trait, clue content and Garden visual theme; no additional panels.
- Add first-view computed-style and geometry regressions to original `scripts/run-odd-one-out-browser-tests.mjs`, asserting exactly the three unchanged label texts, at least 18px label size, unobstructed geometry inside each button, <=560px icon >=38px, no horizontal overflow, all three taps visible in first viewport; retain previous stage readiness, wrong keyboard attempt, real correct result, scored evidence `accuracy=0.5`, canonical three-star Completion and local Again without reload.
- Preserve original 320×720, 390×844 and 768×1024 **idle/try/success** screenshots as 9 real PNGs in dedicated `.vqa16-odd-one-out/` before later mobile QA cleans the shared folder. CI uploads `vqa16-odd-one-out-label-screenshots` with `if-no-files-found: error` and hidden uploads enabled.

## Release acceptance and boundaries
1. Exact-head PR 7/7 CI success with no ignored failures, including full Ubuntu/Windows/Chromium/browser QA/Shop/security/build.
2. Download and manually review all nine 320/390/768 screenshot states. Confirm answer names readable, picture glyphs clear and card labels uncut. If they look worse or clip, revise and rerun on final SHA before merge.
3. Protected squash merge only with expected head SHA and clean current main. Separate merged-main production Cloudflare smoke verifying deployed exact SHA and physical iOS Safari owner acceptance before calling anything **LIVE VERIFIED**.
4. No changes to frozen **900 canonical activities, 47 active patterns**, answer identity, scoring, mastery/evidence/attempts/stage locks, shared UI, 9 backgrounds, World, Motion Engine, Shop, DB/auth or paused character development.
5. This is **one Logic representative** three-viewport signoff, not a visual approval of all 900 activities or all patterns. Future instruction-density cleanup should be a separate evidence-based wave.
