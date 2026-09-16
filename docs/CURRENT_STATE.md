# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open PR status is called out explicitly below.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: **Pattern #33 — Math `equal_groups`**
- Pattern #33 implementation PR: **#145**
- Pattern #33 closure PR: **#146**
- Pattern #33 final verified `main`: `0f90a7fae1164ae6ace86f993024cef7b4989ca9`
- Pattern #33 final CI: **#700 / run `35058250562`**, full success including Cloudflare production smoke
- active implementation PR: **#147 — Pattern #34 Bahasa `initial_sound`**
- Pattern #34 accepted code head: `207153f8e88f7c5e64949354c12b4feb1ee583e8`
- Pattern #34 accepted code CI: **#704 / run `35069389333`**, full PR matrix success; Cloudflare production smoke correctly skipped on PR
- Pattern #34 status: **QA ACCEPTED / UNMERGED**

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, permanent gameplay-distribution audit, simulations, Batch17 and production smoke on `main`.

External physical-device acceptance, accessibility-specialist review, human art/pedagogical acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged `main`: 33 fully merged patterns

The current production/main baseline remains the fully closed Pattern #33 state:

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    33
choice_grid               295 / 900 = 32.78%
equal_groups                3 / 900 = 0.33%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Math choice_grid            43 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

Merged distance: **17** patterns to minimum 50 and **27** to working target 60.

### PR #147 accepted candidate state: 34 patterns

Exact-head CI #704 distribution evidence for Pattern #34:

```text
classified:               900 / 900
unclassified:               0
active candidate patterns: 34
choice_grid               292 / 900 = 32.44%
initial_sound               3 / 900 = 0.33%
equal_groups                3 / 900 = 0.33%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Bahasa choice_grid          44 / 100
Math choice_grid            43 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

Candidate distance after merge would be **16** patterns to minimum 50 and **26** to working target 60.

## Pattern #34 `initial_sound` — QA ACCEPTED / UNMERGED

Exact scope:

```text
bahasa-awal-bola
bahasa-awal-kucing
bahasa-awal-pisang
```

All three remain assessed `tap_choice` activities in stage `bahasa-dasar-huruf`, lesson `bahasa-bunyi-awal`, pack `bahasa.pack.bunyi-awal`, canonical skill `bahasa.bunyi.awal.recognition`, with exactly three canonical uppercase single-letter choices and unchanged `correctChoice`.

Explicit exclusions remain unchanged: `bahasa-match-awal-tas-susu` stays canonical `visible_matching`; vowel recognition/classification, `syllable_assembly`, English inverse initial-sound tasks, letter ordering, Math and every other subject remain outside Pattern #34.

Interaction/evidence contract:
- shows the existing familiar clue (`⚽`, `🐱`, `🍌`) and canonical word with only its first letter masked;
- asks the child to say/read the familiar word, then choose its first letter from the unchanged canonical choices;
- first-letter result stays masked as `?` until a correct assessment;
- keyboard/touch/pointer direct selection remains available; no drag-only dependency;
- wrong choice records assessed incorrect/retry, cannot complete and cannot reveal the first letter;
- correct choice completes the canonical activity and reveals the canonical initial letter;
- assessed fidelity `choice_initial_sound_interaction`;
- runtime metadata source `initial-sound-runtime` with `word`, `initialSound`, and `selectedChoice`;
- content seeds, activity IDs, stars, mastery, progression, schema and migrations remain unchanged.

QA evidence:
- CI #701 / run `35059536603` and CI #702 / run `35068097261` correctly caught invalid browser-QA progression fixtures;
- CI #703 / run `35068805216` confirmed the target stage was still locked because the immediate prior Bahasa stage had not been represented correctly;
- the final QA fixture follows the actual progression order and completion-only contract for prior stage `bahasa-cerita` / activity `bahasa-cerita-teman`;
- accepted code head `207153f8e88f7c5e64949354c12b4feb1ee583e8` passed full CI #704 / run `35069389333`;
- dedicated browser QA passed at 320x720, 390x844 and 768x1024 for idle/wrong/success, keyboard wrong-path, pointer success, masked answer, completion guard, evidence metadata, touch targets and in-viewport feedback/CTA;
- all nine Initial Sound screenshots passed manual visual review;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay distribution is **900/900 classified, 34 active candidate patterns, `choice_grid` 292, `initial_sound` 3**.

Pattern #34 is **not merged and not closed**. It still requires fresh docs-head full CI, clean exact-head review/thread/mergeability gate, exact-head implementation merge, live-main verification + post-merge Cloudflare smoke, then a separate docs-only closure PR with its own exact-head CI/merge/final-main verification.

## Pattern #33 `equal_groups` — FULLY CLOSED

Pattern #33 implementation PR #145 and closure PR #146 are complete. The implementation was squash merged as `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`; the closure chain finished at final verified `main` SHA `0f90a7fae1164ae6ace86f993024cef7b4989ca9`. Final CI #700 / run `35058250562` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution audits, simulations, Batch17 and Cloudflare production smoke.

## Pattern #32 `take_away` — FULLY CLOSED

Pattern #32 implementation PR #143 and closure PR #144 are complete. Final verified `main` SHA before Pattern #33 was `63285c6dd39b0cc1a521b042a492a83338bb2582`; final Pattern #32 CI #684 / run `35049954680` passed all gates including Cloudflare production smoke.

## Learning/mastery boundaries

Non-negotiable unless explicitly redesigned with migration/tests:
- mastery: `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured evidence;
- one perfect attempt cannot jump straight to mastery;
- retry/rapid replay cannot farm mastery;
- practice/completion-only cannot manufacture assessed mastery;
- Drawing/Coloring stay creative practice;
- legacy game scores stay separate from academic mastery;
- motion remains optional input/context;
- Iqro remains `expert_required`, not `expert_approved`.

## Current priority order

1. Finish Pattern #34 implementation PR #147: canonical docs -> fresh exact docs-head CI -> clean review/thread/mergeability gate -> exact-head squash merge -> independent `main` verification -> post-merge `main` CI + Cloudflare production smoke.
2. Open and finish a separate docs-only Pattern #34 closure PR from the exact implementation merge SHA.
3. Only after Pattern #34 is fully closed, run a fresh objective/evidence audit for Pattern #35; no family is pre-approved.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
