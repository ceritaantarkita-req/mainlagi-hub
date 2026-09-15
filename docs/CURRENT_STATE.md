# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest merged gameplay change: PR #112 — WS-05 Science Cause/Effect Water Changes
- latest verified gameplay merge SHA: `768b7f53a003d7677a74ea54e9686418c900eab4`
- active gameplay branch/PR: none during this docs closure
- next exact-family review candidate: Science `compare_properties` trio in Wave C observation/measurement
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

PR #112 is merged. Final docs-head CI #518 was full green before exact-head squash merge, and `main` was verified at `768b7f53a003d7677a74ea54e9686418c900eab4` immediately after merge.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete.

## Learning/catalog baseline

Totals: **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 18 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`.

Latest accepted merges:
- PR #105 Gameplay Distribution Audit — `02d4696760d7b697cfd319804cd655c0d2bfec4c`
- PR #106 Count-and-Select — `18beb9bc676d529cc5701bc964bdef26bea33132`
- PR #108 Number Line — `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`
- PR #109 More/Less Balance — `8a54534ac285013d22d2fc458bb302ae1fe1a87b`
- PR #110 Pattern Completion — `6c5566ea9465a26399f9c4637f252d316552636d`
- PR #112 Cause/Effect — `768b7f53a003d7677a74ea54e9686418c900eab4`

### Merged distribution after PR #112

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

Global `choice_grid` remains above the >35% advisory threshold. Science and Logic remain above the >60% subject-hotspot advisory threshold. Mechanic choice must remain objective-driven.

## Cause/Effect — DONE / PR #112

Exactly four reviewed Science Wave B choice activities use `cause_effect`:

```text
science-water-ice-melts
science-water-freezes
science-water-puddle-evaporates
science-water-cold-glass-droplets
```

Related `science-match-water-states-b` intentionally remains canonical `matching` / `visible_matching`.

Preserved contracts:
- runtime `tap_choice`;
- activity IDs and canonical choices/correctChoice;
- skill `science.water.state_changes.basic`;
- assessment, stars, progression, and completion identity;
- wrong choices cannot complete;
- assessed fidelity `choice_cause_effect_interaction`.

Accepted QA:
- CI #513 full green after a compact-phone layout fix;
- CI #518 final docs-head full green;
- CI #512 had correctly caught a real 320x720 success-CTA clipping bug before acceptance;
- clean review surface;
- manual visual review accepted idle/error/success at 320x720, 390x844, and 768x1024;
- deterministic activity quality remained **900 KEEP / 0 flagged**, structural findings 0;
- exact-head squash merge verified on `main` at `768b7f53a003d7677a74ea54e9686418c900eab4`.

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

## Next exact Science candidate

Read-only audit identified the Wave C observation/measurement comparison trio as the strongest current candidate for `compare_properties`:

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

Keep these outside that candidate unless a fresh branch audit proves otherwise:

```text
science-observe-record-same-time
science-match-observation-tools-c
```

The first measures recording discipline; the second is canonical matching/tool association. A fresh implementation branch must re-validate the trio from latest `main` before coding.

## Current priority order

1. merge this docs-only closure for PR #112 status;
2. create a fresh branch from latest `main` for the exact Science `compare_properties` trio only after re-validating objective/evidence fit;
3. require static allowlist regression, distribution delta, progression/evidence checks, keyboard/touch QA, and manual 320/390/768 review before merge;
4. continue Science exact-family audit while Science remains at 75% `choice_grid`;
5. audit Logic families against the 77% hotspot after the Science pass;
6. continue search/scene, audio, ordering, puzzle/path, literacy, creative, and story mechanics toward 60;
7. continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance, and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
