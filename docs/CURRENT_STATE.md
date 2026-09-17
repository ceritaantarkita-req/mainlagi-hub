# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open PR work must not be mistaken for production closure.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay pattern: **Pattern #39 — Math `visual_word_problem`**
- Pattern #39 audit: PR #169
- Pattern #39 implementation: PR #170
- Pattern #39 implementation merge/main: `bcb8479514f44d46ebc68917981699240aabc3b2`
- Pattern #39 implementation merged-main CI: **#809 / run `35187506724` — full success including exact Cloudflare production smoke**
- Pattern #39 docs closure: PR #171 -> main `98725727c866d410b2d0caa206e86e70cd0e5741`
- Pattern #39 final closure CI: **#811 / run `35190499794` — success**
- Pattern #40 objective/evidence audit: **OPEN PR #173**, candidate `spatial_relation_board`; implementation not started
- permanent visual QA foundation: **VQA-01 FULLY CLOSED**
- visual P1 baseline: **P0=0 / P1=0 / P2=3**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

The production visual checkpoint remains accepted and blocking:

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Permanent visual QA: 21 canonical routes / 63 captures / BLOCKING
VUI-01 Parent Report: FULLY CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery: FULLY CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account: FULLY CLOSED / LIVE VERIFIED
VBASE-P1-01 residual token fragmentation: FULLY CLOSED / LIVE VERIFIED
Pattern #38: FULLY CLOSED
Pattern #39: FULLY CLOSED
Pattern #40 audit: OPEN / IMPLEMENTATION NOT STARTED
```

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

Verified merged-main distribution after Pattern #39:

```text
classified:                    900 / 900
unclassified:                    0
active merged patterns:         39
choice_grid                    267 / 900
visual_word_problem              5 / 900
cloze_sentence_choice            5 / 900
reading_passage_question         5 / 900
sentence_order_cards             5 / 900
picture_word_match               5 / 900
```

Remaining distance is **11 patterns** to minimum 50 and **21** to working target 60. Pattern #40 is not counted until an implementation is merged and independently verified.

Deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings**.

## Pattern #39 closure

Pattern #39 `visual_word_problem` is fully closed.

Exact scope:

```text
math-problem-apples
math-problem-birds
math-problem-cars
math-problem-cookies
math-problem-balloons
```

Preserved contracts:

- canonical IDs, prompts, choices/order and `correctChoice`;
- subject `math`;
- stage `math-ukur-ruang`;
- lesson `math-visual-problems`;
- pack `math.pack.visual-problems`;
- skill `math.problem.visual`;
- assessed `tap_choice` runtime;
- `choice_accuracy_v1` evidence semantics;
- mastery, progression, content schema and database unchanged.

Verification chain:

```text
Audit PR:              #169
Implementation PR:     #170
Implementation main:   bcb8479514f44d46ebc68917981699240aabc3b2
Implementation CI:     #809 / run 35187506724 — full success
Closure PR:            #171
Final closure main:    98725727c866d410b2d0caa206e86e70cd0e5741
Final closure CI:      #811 / run 35190499794 — success
```

Full evidence: `PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`, `WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md`, and `PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md`.

## Pattern #40 objective/evidence audit — open

Fresh audit PR #173 selects a candidate only; it does not claim implementation or production availability.

Working pattern:

```text
spatial_relation_board
```

Exact candidate scope:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

Canonical ownership:

```text
subject:     logic
stage:       logic-patterns-sequences-relations
lesson:      logic-spatial-relations
pack:        logic.pack.spatial-relations
skill:       logic.spatial.relation.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Audit rationale: the lesson objective explicitly measures left/right/between, turns and opposite directions, while the current generic `choice_grid` under-represents those spatial relations. A deterministic spatial board can improve objective fidelity while retaining the unchanged canonical answers and evidence contract.

Boundaries:

- audit only until PR #173 is accepted and merged;
- no Pattern #40 runtime is live yet;
- no canonical prompt/choice/answer rewrite;
- no mastery/progression/schema/database rewrite;
- exact-scope classifier must fail closed;
- keyboard/touch/pointer controls remain required;
- wrong attempts remain measured/retryable and cannot complete;
- implementation must independently prove 900/900 classification and 40 active patterns before Pattern #40 can be called implemented.

## P1 state

All baseline P1 findings are closed and live verified. Remaining visual backlog is P2:

- VBASE-P2-01 game detail/preflight legacy vocabulary;
- VBASE-P2-02 semantic iconography drift;
- VBASE-P2-03 inline visual-style drift risk.

Admin-only utility styling remains separate unless user-facing leakage is proven.

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

1. Complete **Pattern #40 objective/evidence audit PR #173** with canonical docs synchronized and a clean exact-head gate.
2. If the audit is accepted, merge it without runtime changes, then start Pattern #40 implementation from the resulting latest `main` on a separate branch.
3. Implement only the exact six audited Logic spatial activities with deterministic config, evidence-safe completion, keyboard/touch/pointer support, responsive browser QA and permanent visual QA.
4. Independently verify merged-main distribution remains 900/900 classified and becomes exactly 40 active child-facing patterns before claiming Pattern #40 implementation complete.
5. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
6. Continue WS-02 narration and WS-10 external physical-device/accessibility/human acceptance.
7. Continue WS-11 governance and P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
8. Perform later WS-12 technical cleanup and final end-to-end production acceptance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
