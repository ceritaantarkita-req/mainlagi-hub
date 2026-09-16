# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: Pattern #32 — Math `take_away`
- Pattern #32 final verified `main`: `63285c6dd39b0cc1a521b042a492a83338bb2582`
- Pattern #32 final CI: #684 / run `35049954680`, full success including Cloudflare production smoke
- latest merged gameplay: Pattern #33 — Math `equal_groups`
- Pattern #33 implementation PR: #145
- final implementation docs head: `11f278a0150ff31b1ba89394c23b78fa244038aa`
- final implementation PR CI: #692 / run `35053984870`, full success
- verified implementation merge SHA: `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`
- post-merge implementation CI: #693 / run `35054346467`, full success including Cloudflare production smoke
- Pattern #33 closure PR: **#146**
- Pattern #33: **MERGED / LIVE VERIFIED / CLOSURE PR #146 OPEN**

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, permanent gameplay-distribution audit, simulations, Batch17 and production smoke on `main`.

External physical-device acceptance, accessibility-specialist review, human art/pedagogical acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Verified merged on `main`: 33 patterns

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

Remaining distance: **17** patterns to minimum 50 and **27** to working target 60.

## Pattern #33 `equal_groups` — merged/live closure record

Exact scope:

```text
math-group-6-by-2
math-group-8-by-2
math-group-9-by-3
```

All three remain assessed `tap_choice` activities in stage `math-operasi-awal`, lesson `math-grouping`, pack `math.pack.grouping`, canonical skill `math.grouping.equal_groups`, with exactly three canonical numeric choices and unchanged `correctChoice`.

Explicit exclusions remain outside Pattern #33: the grouping matching activities `math-group-match-2s` and `math-group-match-3s` stay `visible_matching`; missing-number, addition, subtraction, length/size, existing Math specialized families, and all non-Math families remain unchanged.

Interaction/evidence contract:
- renders the reviewed total as visibly separated equal-size groups;
- validates total 2..10, a positive proper `groupSize`, exact divisibility, and `totalCount / groupSize === Number(correctChoice)`;
- keeps the group-count result masked as `?` until a correct assessment;
- preserves canonical keyboard/touch/pointer direct-selection choices;
- wrong choice records assessed error/retry, cannot complete, and cannot reveal the result;
- correct choice completes the canonical activity and reveals the canonical group count;
- no changed choice set, extra confirmation, drag-only dependency, or intermediate assessment;
- assessed fidelity `choice_equal_groups_interaction`;
- runtime metadata source `equal-groups-runtime` with `totalCount`, `groupSize`, `groupCount`, and `selectedChoice`;
- content, IDs, stars, mastery, progression, schema, and migrations remain unchanged.

Acceptance and merge evidence:
- CI #685 / run `35052200287` correctly caught success CTA clipping at 320x720;
- CI #686 / run `35052577160` correctly caught idle-feedback clipping at 390x844 after the first fix;
- accepted code head `26c2b2355099c4097c015ba5767703035b33aa63` passed full CI #687 / run `35053008065`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- deterministic quality remained **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- final canonical implementation docs head `11f278a0150ff31b1ba89394c23b78fa244038aa` passed full CI #692 / run `35053984870`;
- PR #145 passed exact-head clean gate: mergeable, 15 exact changed files, behind 0, zero comments, zero reviews, zero review threads;
- PR #145 exact-head squash merged as `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #693 / run `35054346467` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution audits, simulations, Batch17 and Cloudflare production smoke;
- docs-only closure PR #146 was opened from exact implementation merge SHA and is restricted to the five canonical Pattern #33 docs.

Pattern #33 is **not fully closed yet**. Closure PR #146 still requires fresh exact closure-head CI, clean closure merge gate, exact-head closure merge, independent final `main` verification, and final post-closure `main` CI including Cloudflare production smoke.

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

1. Finish Pattern #33 closure PR #146: fresh exact closure-head CI -> clean review/thread/mergeability gate -> exact-head merge -> independent `main` verification -> final post-closure `main` CI + Cloudflare production smoke.
2. Only after Pattern #33 is fully closed, run a fresh objective/evidence audit for Pattern #34; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
