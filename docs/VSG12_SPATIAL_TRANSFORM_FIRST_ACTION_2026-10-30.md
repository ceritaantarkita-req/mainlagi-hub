# VSG-12 — Spatial Transform 320px first-action repair

**Date:** 30 October 2026
**Base:** `main@2d77f3e346f38a65dd0b9a519568046234f09056`, after VSG-11 Drawing QA-only #548.
**Status:** IMPLEMENTED ON REVIEW BRANCH; QA and manual screenshot acceptance pending.

## Source-confirmed defect

`SpatialTransformActivity.module.css` hid the **entire primary prompt** under
`@media (max-width:340px) { .promptCard { display:none } }`.
That removes the question on 320px phones. The renderer additionally stacked
a generic title, paragraph, and idle-status instruction around the actual
visual board. This is a code-grounded problem, not evidence that every
Spatial Transform variant was visually reviewed.

## Deliberately narrow change

- The first-action question is **"Arah akhirnya ke mana?"**, implemented through
  the existing `planChildVisualHierarchy`, visible at 320px and up.
- Optional **Cara main (?)** reveals "Lihat arah awal, ikuti putaran atau cermin, lalu pilih hasilnya."
  This assistance never states the answer.
- The source visual problem is unchanged: **Mulai → operation → Hasil (?)**,
  `config.operationLabel`, original `operationHint` and all original choices
  remain visible. The hidden answer stays `?` until a real answer.
- Voice uses the untouched canonical `activity.prompt`. Answer metadata
  `transformKind`, `quarterTurns`, `mirrorAxis`, assessment and correctChoice
  are unchanged.
- Empty duplicate idle status no longer occupies space. Wrong feedback uses
  **Belum tepat. Coba lagi!**; the full original correct explanation remains in
  the `role=status` announcement for accessibility. Concise canonical
  completion retains stars, Back/Again/Next/Share.
- Only scoped Spatial Transform CSS controls question size, help trigger,
  word-safe choice labels and 320px behavior. No global CSS overrides.

## Browser evidence, acceptance and exact-release gates

`scripts/run-spatial-transform-browser-tests.mjs` exercises
**320/390/430/768/1280px × idle/help/wrong/success**, creating 20 PNGs
in `vsg12-spatial-transform-screenshots`. Assertions retain original
three answer labels, start direction, operation, hidden result, keyboard
wrong answer, 0.5 assessed accuracy after retry, canonical measurement
metadata, correct selection, accessible success reason, completion and
local Again without second attempt.

- [ ] All seven exact-head CI checks PASS (PR Cloudflare smoke is not production approval).
- [ ] Inspect final 20 screenshots at all sizes, especially visible 320px question, operation hint legibility and completion.
- [ ] Confirm no horizontal overflow, 44px+ answer targets, no answer leaks.
- [ ] Merge only after QA and visual acceptance.
- [ ] Merged-main exact-SHA Cloudflare smoke, real iOS Safari and accessibility device QA separately.

## Immutable boundaries

Do **not** modify `spatialTransformConfig` variants, correct answers,
rotation/mirror math, 47 gameplay pattern classifier, 900 canonical content,
scoring/mastery/Stage locks, World, Motion Engine, Shop, DB or character art.
This is one source-confirmed family fix, not a 47-pattern mass rewrite.

Related 47-pattern coverage tracking: [issue #501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501).
