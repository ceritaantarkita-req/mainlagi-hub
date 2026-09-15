# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged baseline: `a628a3a7d3dbb0be9faef2fd2e0c7efddd9c0649` (docs closure PR #113)
- latest merged gameplay change: PR #112 — Science Cause/Effect, merge `768b7f53a003d7677a74ea54e9686418c900eab4`
- active gameplay branch: `agent/ws05-gameplay-science-compare-properties-20260915`
- active gameplay PR: **#114 — Compare Properties, accepted QA / unmerged**
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 18 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`.

Merged distribution after PR #112:

```text
classified:          900 / 900
unclassified:          0
active patterns:      18
choice_grid          362 / 900 = 40.22%
cause_effect           4 / 900 = 0.44%
Math choice_grid       56 / 100
Science choice_grid    75 / 100
Logic choice_grid      77 / 100
```

### PR #114 Compare Properties — ACCEPTED QA / UNMERGED

Exact scope:

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

Explicit exclusions:

```text
science-observe-record-same-time
science-match-observation-tools-c
```

The first exclusion measures observation-recording discipline and remains default `tap_choice`. The second remains canonical `matching` / `visible_matching`.

Interaction/evidence contract:
- reusable direct comparison board for length, temperature, and relative water fill;
- visual comparison is qualitative only; no invented numeric measurements;
- canonical three choices and correctChoice remain intact;
- runtime stays `tap_choice`;
- wrong choice is retryable and cannot complete;
- keyboard and touch/pointer use the same accessible controls;
- assessed fidelity `choice_compare_properties_interaction`;
- exact three-ID allowlist prevents unrelated Science activities from reclassification.

Accepted implementation evidence:
- CI #522 full green before final visual polish;
- manual review of #522 found duplicate label text on the A/B cards; this was fixed rather than accepted as-is;
- current accepted implementation head `c962e0c05a38eecf2890a76bf6417545100238a1`;
- CI #523 full green across Ubuntu, Windows, production build, dependency audit, secret scan, and Mobile Chromium; Cloudflare smoke skipped as expected;
- latest manual visual review accepted idle/error/success at 320x720, 390x844, and 768x1024 after the duplicate-label fix;
- success CTA remains fully visible at 320x720;
- deterministic activity quality remains **900 KEEP / 0 flagged**, structural findings 0.

Measured PR #114 distribution:

```text
900 / 900 classified
0 unclassified
19 active patterns on PR head
choice_grid          359 / 900 = 39.89%
compare_properties     3 / 900 = 0.33%
Science choice_grid    72 / 100
Logic choice_grid      77 / 100
```

These are PR-head QA numbers, not merged `main` numbers until #114 merges.

## Deterministic activity-quality baseline

```text
900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings: 0
Q101–Q108: 0
```

This is deterministic engineering triage, not human pedagogical/art/expert approval.

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

1. Finalize canonical docs for PR #114 on the current accepted head.
2. Require final docs-head CI, clean review threads/comments, and exact-head squash merge before calling `compare_properties` shipped.
3. Verify `main` after merge and close any stale QA wording through a docs-only closure if needed.
4. Continue an objective-driven Science exact-family audit while Science remains above the >60% advisory hotspot threshold.
5. Audit Logic families after the Science pass; Logic remains at 77% `choice_grid` on merged baseline.
6. Continue search/scene, audio, ordering, puzzle/path, literacy, creative, and story mechanics toward 50–60 meaningful patterns.
7. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance, and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
