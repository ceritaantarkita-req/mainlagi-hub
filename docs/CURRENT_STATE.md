# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA before active PR #112: `06477dbc8fc4d2c4f990b19f2edb3e217b3e26ae`
- latest merged gameplay implementation: PR #110 — WS-05 Pattern Completion Math Wave
- active gameplay branch: `agent/ws05-gameplay-science-cause-effect-20260915`
- active gameplay PR: #112 — Science `cause_effect` water-change wave
- accepted implementation QA head: `ad5f427afc9cb0c755872ee88588534066942d47`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

PR #112 implementation QA is accepted but **not merged yet**. CI #513 is full green after fixing a real 320x720 success-CTA clipping issue first caught by CI #512.

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
- PR #110 Pattern Completion implementation — `6c5566ea9465a26399f9c4637f252d316552636d`
- post-#110 docs closure baseline — `06477dbc8fc4d2c4f990b19f2edb3e217b3e26ae`

### Pattern #18 accepted QA / PR #112: `cause_effect`

Exact four Science Wave B choice activities:

```text
science-water-ice-melts
science-water-freezes
science-water-puddle-evaporates
science-water-cold-glass-droplets
```

Related `science-match-water-states-b` remains canonical `matching` / `visible_matching`.

Preserved contracts:
- runtime `tap_choice`;
- canonical activity IDs and choices/correctChoice;
- skill `science.water.state_changes.basic`;
- assessment and stars;
- stage/progression prerequisites;
- canonical completion identity.

Interaction/evidence:
- child-facing **Awal -> Kondisi -> Hasil** flow;
- result is unrevealed before selection;
- explicit per-activity process config, no prompt parsing;
- wrong answer stays retryable and cannot complete;
- assessed fidelity `choice_cause_effect_interaction`.

Accepted QA:
- CI #513 full green on implementation head `ad5f427afc9cb0c755872ee88588534066942d47`;
- legitimate Science Wave A readiness with progression guard enabled;
- keyboard wrong-state + false-completion guard;
- pointer correct completion + evidence persistence;
- >=44px controls, no horizontal overflow, success CTA in viewport;
- manual visual review accepted idle/error/success at 320x720, 390x844, and 768x1024;
- deterministic activity quality **900 KEEP / 0 flagged**, structural findings 0.

PR #112 accepted-QA distribution:

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

`cause_effect` remains unmerged until final docs-head CI and exact-head merge complete.

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

1. finish PR #112 canonical docs and final docs-head CI;
2. check PR review surface, exact-head squash merge, and verify `main`;
3. close the final merge SHA in canonical status if needed;
4. audit the remaining Science exact families after the accepted PR #112 delta leaves Science at 75% `choice_grid`;
5. choose the next Science mechanic only from objective/evidence fit, not from concentration alone;
6. audit Logic families against the 77% hotspot after the Science pass;
7. continue search/scene, audio, ordering, puzzle/path, literacy, creative, and story mechanics toward 60;
8. continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance, and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
