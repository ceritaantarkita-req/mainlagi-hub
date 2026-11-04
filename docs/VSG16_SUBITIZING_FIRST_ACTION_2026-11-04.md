# VSG-16 — Subitizing Glance child-first question and dot-pattern preservation

Date: 4 November 2026. Base: `main@363c1dbc069d50833564a03ad06b4a7c3894847d` (VSG-15 merged).
Status: **review branch only**. NOT merged, NOT live verified; screenshot acceptance pending.
Tracker: #501. Scope: **Pattern 44 Subitizing Glance only**.

## Source-backed first-action issue

The previous renderer displayed a separate Garden activity title, generic "Lihat polanya" heading,
"Jumlah sekilas" badge, source `activity.prompt`, generic "Kenali pola titiknya",
generic "Berapa jumlahnya?", and a persistent idle hint. These are several competing
instruction surfaces before the child can choose the amount. **Source evidence confirms
the copy stack; actual screenshot severity must be reviewed, not presumed.**

## Scoped presentation change

- Use the **exact canonical activity.prompt** as one primary question;
  `GardenActivityFrame` retains original `Dengar` narration but drops duplicate
  visual title. The existing approved child visual hierarchy is reused.
- Keep all nine cells and all original `dotCells` indexes visible at all times;
  do not shorten stimulus duration, hide dots, or reveal answers through Help.
- Keep all three original number choices and their order, color/state feedback,
  keyboard/touch behavior and accessible `aria-label`.
- Show an **answer-safe generic** `Cara main (?)` hint before the first
  attempt, 44px/keyboard operable and initially closed. Some original canonical
  `config.cue` values *literally name the correct number* (e.g. "dua" and
  "empat"), so expose the exact original cue **only after an incorrect answer**
  in the same high-contrast Help panel. Never leak answer in pre-attempt Help.
- Remove repeated pattern/choice subtitles; retain semantic group and pattern
  accessibility labels. Idle status empty; wrong = "Belum tepat. Coba lagi!";
  original successful reasoning remains announced to screen readers,
  while canonical three-star completion is concise.
- Mobile answer targets >=70px at <=520px and >=72px for short 320px.
  Leave the core 3x3 dot grid dimensions and contrast unchanged.

## Immutable learning contracts

`subitizingGlanceConfig`, all three source prompts, dot positions
(`pair`: [3,5], `square`: [0,2,6,8], `dice_five`: [0,2,4,6,8]),
original choice IDs/order, expected answers, assessed accuracy/incorrect/retry,
`metadata.patternMode`, `selectedChoice`, `visibleDotCount`, mastery,
stage locks, 900 catalog entries, 47 gameplay pattern identities, audio engine,
World, Motion Engine, Shop, auth and database are untouched.

## Release gates (must all pass)

- [ ] Exact-head 7/7 required GitHub CI checks successful;
      PR-side Cloudflare production smoke may be skipped by design.
- [ ] Browser QA: representative **four-dot** pattern @ 320/390/430/768/1280,
      idle/help/wrong/success (20 captures), plus distinct **two-dot** and
      **five-dot** patterns @ 320/390/768 x four states (24 captures),
      total **44 original PNGs** archived as `vsg16-subitizing-screenshots`.
- [ ] Manual review all 44 PNGs: 320 question and dots visible, output wording,
      contrast, no overflow, number targets, short viewport Completion.
- [ ] Confirm keyboard wrong/actual mobile touch correct, one assessed attempt
      with 0.5 accuracy after wrong, original dots unchanged, Again and Share
      preserve state and do not create duplicate attempts.
- [ ] Once merged, **main** CI 8/8 and Cloudflare exact deployed-SHA smoke;
      physical Safari device acceptance separately tracked.

Avoid claiming 900 visual approvals from 900/900 deterministic classification.
Do not merge before all source/test/screenshot gates are proven.
