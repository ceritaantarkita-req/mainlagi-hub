# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA: `6c5566ea9465a26399f9c4637f252d316552636d`
- latest merged gameplay change: PR #110 — WS-05 Pattern Completion Math Wave
- active gameplay branch/PR: none; next family review is Science `cause_effect`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete.

## Learning/catalog baseline

Totals: **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 17 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`.

Latest accepted merges:
- PR #105 Gameplay Distribution Audit — `02d4696760d7b697cfd319804cd655c0d2bfec4c`
- PR #106 Count-and-Select — `18beb9bc676d529cc5701bc964bdef26bea33132`
- PR #108 Number Line — `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`
- PR #109 More/Less Balance — `8a54534ac285013d22d2fc458bb302ae1fe1a87b`
- PR #110 Pattern Completion — `6c5566ea9465a26399f9c4637f252d316552636d`

### Merged distribution after PR #110

```text
classified:          900 / 900
unclassified:          0
active patterns:      17
choice_grid          366 / 900 = 40.67%
pattern_completion     5 / 900 = 0.56%
more_less_balance      6 / 900 = 0.67%
number_line             6 / 900 = 0.67%
Math choice_grid       56 / 100
Science choice_grid    79 / 100
Logic choice_grid      77 / 100
```

Global `choice_grid` is still above the >35% advisory threshold. Math is now below the >60% subject-hotspot threshold. Science and Logic are the next concentration priorities, but mechanic choice must remain objective-driven.

## Pattern Completion — DONE / PR #110

Exactly five reviewed Math Wave B choice activities use `pattern_completion`:

```text
math-pattern-ab-shapes
math-pattern-aab-colors
math-pattern-number-step-one
math-pattern-number-step-two
math-pattern-size
```

The two matching activities `math-pattern-match-ab` and `math-pattern-match-aab` intentionally remain canonical `matching` / `visible_matching`.

Preserved contracts:
- runtime `tap_choice`;
- activity IDs and canonical choices/correctChoice;
- skill `math.pattern.sequence`;
- assessment, stars, progression, and completion identity;
- wrong choices cannot complete;
- assessed fidelity `choice_pattern_completion_interaction`.

Accepted QA:
- implementation CI #503 full green;
- final docs-head CI #508 full green;
- clean review surface;
- manual visual review accepted idle/error/success at 320x720, 390x844, and 768x1024;
- deterministic activity quality remained **900 KEEP / 0 flagged**, structural findings 0.

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

1. close the PR #110 documentation status record on `main`;
2. implement the next exact Science family only after objective review — current strongest candidate is `cause_effect` for four Wave B water-change activities;
3. audit remaining Science families against the 79% `choice_grid` hotspot;
4. audit Logic families against the 77% hotspot;
5. only then revisit Math missing-number / make-total where objective fit genuinely warrants it;
6. continue search/scene, audio, ordering, puzzle/path, literacy, creative, and story mechanics toward 60;
7. continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance, and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
