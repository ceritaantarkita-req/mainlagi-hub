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
- Pattern #39 implementation CI: **#809 / run `35187506724` — full success including exact Cloudflare production smoke**
- Pattern #39 docs closure: PR #171 -> main `98725727c866d410b2d0caa206e86e70cd0e5741`
- Pattern #39 final closure CI: **#811 / run `35190499794` — success**
- Pattern #40 objective/evidence audit: **MERGED PR #173 -> main `f1b4b13d3d9814d2ed06500022218848cd721419`**
- Pattern #40 implementation: **DRAFT PR #175 / `spatial_relation_board` / exact six-activity scope**
- Pattern #40 foundation head `1889e1b5ea954be3cab6978e1f82a680b8281ca8` passed **CI #821 / run `35213178491`**
- classifier/distribution, exact-scope regression, browser QA, answer masking and mobile composition are now implemented on PR #175 and require a final exact-head CI
- Pattern #40 is **not yet counted** in merged gameplay distribution
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
Pattern #40 audit: MERGED
Pattern #40 implementation: IN PROGRESS / NOT MERGED
```

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

Verified merged-main distribution after Pattern #39 remains:

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

Pattern #40 branch is expected to move exactly six audited activities from `choice_grid` into `spatial_relation_board`, producing `choice_grid` 261/900 and `spatial_relation_board` 6/900 while keeping 900 total activities. This remains an expected branch result until exact-head CI proves it.

Remaining merged-main distance is **11 patterns** to minimum 50 and **21** to working target 60. Pattern #40 is not counted until implementation is merged and independently verified.

Deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings** on the verified merged baseline.

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

## Pattern #40 — implementation in progress

The fresh audit is merged and implementation is isolated in draft PR #175. Pattern #40 is still **not production/merged state**.

Pattern:

```text
spatial_relation_board
```

Exact scope:

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

Implemented in PR #175:

- exact-scoped deterministic config for the six audited IDs;
- canonical prompt, choice order and `correctChoice` are frozen by fail-closed config checks;
- dedicated child-facing spatial relation board for left/right, between, turn-right, turn-left and opposite direction;
- turn/opposite result is hidden before success and remains hidden after wrong answers;
- route dispatch uses the exact classifier only;
- direct button answer input remains keyboard/touch/pointer accessible;
- wrong attempts remain measured/retryable and cannot complete;
- correct answer uses the existing measured completion path;
- runtime metadata source `spatial-relation-board-runtime`, evidence fidelity `choice_spatial_relation_interaction`, plus `mode`, `relationOrTurn` and `selectedChoice`;
- `canonicalGameplayPattern` registers Pattern #40 while delegating previous patterns unchanged;
- distribution audit now expects `spatial_relation_board`;
- exact-scope regression proves six-and-only-six classification, canonical content/skill evidence, all relation variants, and malformed/non-scope fail-closed cases;
- browser QA covers 320x720, 390x844 and 768x1024 idle/wrong/success states with keyboard wrong-state, pointer completion, result masking, evidence persistence, touch targets and overflow checks;
- mobile layout is compacted for 320x720 so the board, three short answer controls, feedback and success CTA remain usable;
- mastery, progression, schema and database remain unchanged.

Verified supporting checkpoint:

```text
Foundation head: 1889e1b5ea954be3cab6978e1f82a680b8281ca8
CI:              #821 / run 35213178491 — full success
```

That checkpoint predates the final classifier/regression/browser/docs state. Final implementation acceptance requires one newer exact-head CI containing all implementation changes.

## Pattern #40 current blocking gate

Before implementation merge:

1. exact-head Pattern #40 regression must pass;
2. branch distribution must prove 900/900 classified, 0 unclassified and exactly 40 active patterns;
3. mobile Chromium must pass Pattern #40 idle/wrong/success QA at all three required viewports;
4. permanent visual baseline must remain P0=0/P1=0;
5. activity-quality, Windows, Ubuntu, production build, dependency/security, simulations and final-acceptance gates must remain green;
6. PR #175 must be mergeable and have no unresolved review/thread blocker;
7. only the exact verified head may be squash-merged;
8. merged `main` must then be independently verified including production smoke;
9. a separate Pattern #40 closure-docs gate is required before **FULLY CLOSED** status.

Full in-progress evidence: `PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md` and `WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`.

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

1. Freeze the Pattern #40 implementation head and require one fresh exact-head full CI.
2. If CI is green, inspect gameplay-distribution evidence, browser/permanent visual evidence and clean PR review/thread/mergeability gates.
3. Mark PR #175 ready only after every blocking implementation gate is green.
4. Squash-merge only the exact verified implementation head.
5. Independently verify merged `main`, including exact production smoke, before calling Pattern #40 implementation-complete.
6. Run a separate Pattern #40 closure-docs PR and merged-main verification before **FULLY CLOSED** status.
7. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
8. Continue WS-02 narration, WS-10 external physical-device/accessibility/human acceptance, WS-11 governance and later P2/WS-12 work without destabilizing accepted product surfaces.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
