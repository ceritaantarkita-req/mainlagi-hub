# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged baseline: `4f3e2828aa3be804f6d896b10f8e3422c3180811`
- latest merged gameplay change: PR #114 — Science Compare Properties
- active gameplay branch: none
- active gameplay PR: none
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

### Merged on `main`: 19 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`.

Merged distribution after PR #114:

```text
classified:           900 / 900
unclassified:           0
active patterns:       19
choice_grid           359 / 900 = 39.89%
compare_properties      3 / 900 = 0.33%
Science choice_grid     72 / 100
Logic choice_grid       77 / 100
```

### PR #114 Compare Properties — MERGED

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

Accepted implementation evidence before merge:
- CI #522 full green before final visual polish;
- manual review of #522 found duplicate label text on the A/B cards; this was fixed rather than accepted as-is;
- accepted implementation head `c962e0c05a38eecf2890a76bf6417545100238a1`;
- CI #523 full green across Ubuntu, Windows, production build, dependency audit, secret scan, and Mobile Chromium; Cloudflare smoke skipped as expected;
- latest manual visual review accepted idle/error/success at 320x720, 390x844, and 768x1024 after the duplicate-label fix;
- success CTA remained fully visible at 320x720;
- deterministic activity quality remained **900 KEEP / 0 flagged**, structural findings 0.

PR #114 merged to `main` as `4f3e2828aa3be804f6d896b10f8e3422c3180811`.

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

1. Keep canonical docs synchronized with the merged PR #114 baseline.
2. Continue an objective-driven Science exact-family audit while Science remains above the >60% advisory hotspot threshold.
3. Review Wave D investigation/evidence as the leading candidate family for gameplay pattern #20; do not commit scope until objective/evidence fit is exact.
4. Audit Logic families after the Science pass; Logic remains at 77% `choice_grid`.
5. Continue search/scene, audio, ordering, puzzle/path, literacy, creative, and story mechanics toward 50–60 meaningful patterns.
6. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance, and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
