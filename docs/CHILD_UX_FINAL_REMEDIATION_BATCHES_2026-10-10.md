# Mainlagi Child UX Final Remediation — Batch 00–07

**Created:** 10 October 2026  
**Status:** AUTHORIZED / BATCH 00 DOCUMENTED, IMPLEMENTATION + QA IN PROGRESS; NOT MERGED, NOT LIVE VERIFIED  
**Baseline:** `main@fbc993ccbd779b841061d37ed82c01daf00c1bd3`  
**Single execution branch:** `agent/child-ux-final-remediation-20261010`  
**Planned delivery:** one branch, one PR, sequential commits with transparent checkpoints; no parallel workstreams or automatic age-band expansion.  
**Primary evidence:** 10 real Safari iPhone screenshots supplied 10 October (Home, English Stage Detail, English/Science/Letters/Math/Matching game, Drawing track). Source code/architecture verified on baseline; context recorded in Issue #486.

## Non-negotiable product boundaries

- **World is a browseable catalog for every existing valid child profile.** The currently shipped **Petualangan Uang** remains playable exclusively for ages **6–8**. A demo-age 5 profile sees the catalog with an accurate “Untuk usia 6–8” gate, not an apparently dead World category. Age 3–5 and 9–12 future variants are not released by this UI work.
- Reuse `MONEY_WORLD_PILOT_AGE_BAND` / age policy as **single source of truth**. Confirm catalog, map, and stage deep links enforce the same playable age policy; no bypass by typing a URL. Never falsify Gian's canonical demo age.
- Preserve child identity/auth rules, 9 subjects, 46 stages, ~900 activities, stage readiness, evidence/mastery/progression, attempts, rewards, World stage data, audio assets, Motion Engine, Shop, and canonical character presentation.
- Child-friendly abbreviated instructions may accompany **unaltered source instructions** available for Dengar/accessibility. No new correctness logic. Age-eligible content stays age-eligible.

## Batch execution (in this same session, in order)

| Batch | Description | Files/owners | Exit criteria |
|---|---|---|---|
| **00** | Verify baseline, screenshot-to-owner audit, docs-first checkpoint | docs, main commit/PR state | exact SHA, screenshot issues mapped, scope/fallback and test matrix written |
| **01** | World catalog entry and age eligibility | `Batch14WorldHome`, World catalog/map/stage, age policy helper | Gian (5) browses; World 6–8 remains locked; 7 plays; 9 sees catalog only; direct URLs guard |
| **02** | Mobile Garden visual hierarchy & safe-area | `GardenActivityFrame.module.css`, scoped character placement | compact control/title/answer hierarchy at 320/390/430/landscape, no hidden tap targets |
| **03** | Child Home hero/composition | `Batch14WorldHome`, `Playroom.module.css` | short copy, correct continue route, three clear domain cards in view, no duplicate text |
| **04** | Journey Map and Stage Detail | `BelajarJourneyMap`, module CSS | status/header on one line, accurate required steps, no double CTA, stage unlock untouched |
| **05** | Choice/Matching/Drawing presentation | `ChildLearningPlatform`, `CreativeTrackViews`, scoped CSS | English/ID hint locale, answer prominence, no cropped characters, drawing child copy without internal mastery jargon |
| **06** | Targeted tests and full regression | existing mobile/visual + World guard tests, CI | age 5/7/9 + deep links; routes/stage/Again/Back/Next/audio, mobile screenshots; 7 required PR gates green |
| **07** | Squash merge + deploy check + final docs | GitHub PR, Cloudflare smoke, Issue #486 | merge after green CI, branch auto-deleted; exact-SHA smoke and real Safari approval required before LIVE VERIFIED |

## User screenshot diagnosis (10 October)

1. **Child Home**: large multi-line hero + activity label + big CTA + image push subject choices down. World disabled with ambiguous “Belum tersedia”.
2. **English Stage Detail**: status broken across lines; progress bar excessive; “Berikutnya” card competes with “Ayo main!” CTA. Preserve actual completed/required numbers and full activity disclosure.
3. **English/Science Choice**: oversized header/title, bilingual hints inconsistent (“Sentuh pilihanmu.” in English activity), empty background competing with cards.
4. **Letters hunt & counting**: repeated instruction panel plus long title, layered containers; partly cropped companion figures along bottom Safari viewport.
5. **Matching**: tactile board improved but huge empty card cells for tiny emoji, bottom companion figures partly clipped.
6. **Drawing**: “Creative practice”, “completion”, “mastery” and “Lesson” are technical/adult vocabulary appearing on the child track; stage cards too verbose.
7. **Journey**: QA screenshots still resemble timeline/card list instead of playful paths; preserve node IDs and truth of locked/current/completed stages.

## Execution and CI policy

- Docs **must be committed first**, before any runtime commit.
- Batch steps are sequential commits **on the same branch**, with clear commit messages. Do not open 8 PRs.
- Update existing browser tests rather than removing assertions. A genuine new visual ratio may require changed expectations with evidence, not weaker QA.
- Run necessary focused checks where tool environment permits; full GitHub CI after opening the one PR. On failures, fix narrowly in same branch; do not bypass security/Shop/Bermain/World tests.
- Merge only when expected branch SHA and all required CI jobs are green. One merge, branch deletion afterward.
- PR smoke skipped is **not** successful deployment; verify exact merged `main` SHA via push-to-main Cloudflare production smoke + `/api/health`. If unavailable, leave LIVE VERIFIED pending.
- Real-device UX acceptance is separate from browser test result. Do not mark final visual acceptance without new iPhone proof.

## Checkpoint log

- **Batch 00 — docs-first**: branch based on `main@fbc993ccbd779b841061d37ed82c01daf00c1bd3` after verifying no open PR. This document is the canonical eight-batch plan. Subsequent commits and proof should be appended here, and `docs/CURRENT_STATE.md` synced. No feature implementation or test PASS claim at this checkpoint.

### 10 Oct implementation checkpoint — Batch 01–05 source committed, Batch 06 PR CI pending

- **01 World:** centralized `isMoneyWorldPilotAgeEligible`; age 5 Child Home World card links to nine-concept catalog; catalog labels 6–8 pilot “Untuk usia 6–8” and does not expose a playable link to ages 5/9; direct map/stage components guard eligibility **before mounting progress runtime**; canonical 6–8 stage IDs remain unchanged.
- **World test fixtures:** `scripts/world-age7-browser-fixture.mjs` adds a browser-local authorized age-seven profile for runtime QA, plus age-nine ineligible profile. Gian Demo remains five. Existing World Playwright routes are migrated to the eligible fixture as needed; main mobile QA adds direct demo-5/age-9 route guard assertions. Fixture never ships to production runtime.
- **02–03 mobile:** scoped CSS for compact Child Home, Garden header/activity spacing, iOS-safe character placement and answer targets. Existing hero artwork and 2:1 mobile hero ratio intentionally preserved.
- **04 Stage:** status presented inline, real completed/required counts and disclosure preserved, one active primary CTA instead of two links to same recommended activity; browser baseline screenshot now captures detail sheet open.
- **05 choice/drawing:** Choice English hints and wrong-answer feedback localized; Drawing removes “Creative practice / completion / mastery / Lesson” from child view while retaining existing completion behavior. Matching card sizes refined without touching correctness algorithms.
- **06 QA preparation:** Word/World tests use distinct profile fixtures for 5/7/9, iPhone visual baseline includes English Choice, Drawing, and open Stage sheet. **No automated PASS or live smoke evidence exists for this new branch yet.** CI results must be appended only after checks actually run.
- **07 not started:** no merge/deployment confirmation. If CI fails, keep this branch/PR open and correct narrowly. All production gates remain evidence-based.
