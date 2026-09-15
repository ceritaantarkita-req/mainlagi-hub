# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged baseline: `539b5717f5e77ccd7c883acb3e44a09c5557b54d` (post-#114 docs closure PR #115)
- latest merged gameplay change: PR #114 — Science Compare Properties, merge `4f3e2828aa3be804f6d896b10f8e3422c3180811`
- active gameplay branch: `agent/ws05-science-material-lab-20260915`
- active gameplay PR: **#116 — Science Material Lab, accepted implementation QA / unmerged**
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

```text
classified:           900 / 900
unclassified:           0
active patterns:       19
choice_grid           359 / 900 = 39.89%
compare_properties      3 / 900 = 0.33%
Science choice_grid     72 / 100
Logic choice_grid       77 / 100
```

### PR #116 Material Lab — ACCEPTED IMPLEMENTATION QA / UNMERGED

Exact scope:

```text
science-material-raincoat-waterproof
science-material-window-transparent
science-material-towel-absorbent
science-material-toy-block-rigid
```

Explicit exclusion:

```text
science-match-material-purpose-d
```

The four scoped activities ask which property lets a familiar object serve its purpose. The excluded activity remains canonical `matching` / `visible_matching` because it measures property-purpose pairing.

Interaction/evidence contract:
- explicit select-sample -> test-sample sequence;
- selection alone cannot complete;
- wrong test is retryable and cannot complete;
- correct tested sample completes;
- canonical three choices and `correctChoice` remain intact;
- runtime stays `tap_choice`;
- assessed fidelity `choice_material_lab_interaction`;
- exact four-ID allowlist prevents unrelated Wave D activities from reclassification.

Accepted implementation evidence:
- initial CI #532 caught and blocked an accidental removal of existing `@phosphor-icons/react` from `package.json`;
- dependency was restored at `^2.1.10` without otherwise changing dependency intent;
- implementation head `09dd638748d62da1da264ce3b4f6f8f6880354b7` passed full CI #533;
- gameplay regression reports exactly 4 `material_lab` activities;
- activity-quality remains **900 KEEP / 0 flagged**, structural findings 0;
- gameplay distribution verifies **20 patterns**, 900/900 classified, `choice_grid` 355/900 (39.44%), `material_lab` 4/900 and Science `choice_grid` 68/100;
- representative browser QA uses legitimate Science Wave C readiness and passes keyboard selection, explicit test, false-completion guards, pointer completion, evidence persistence, touch sizing, overflow and CTA checks at 320/390/768;
- manual screenshot review accepted idle/error/success at 320x720, 390x844 and 768x1024.

These remain PR-head QA figures until #116 merges.

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

1. Final docs-head CI for PR #116.
2. Clean review-thread/comment check and exact-head squash merge for #116.
3. Verify `main`, then close stale post-merge wording so 20 patterns become the canonical merged baseline.
4. Continue objective-driven Science exact-family audit; do not combine heterogeneous investigation/evidence tasks merely to add a pattern.
5. Audit Logic families after the Science pass; Logic remains at 77% `choice_grid` on merged baseline.
6. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
7. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
