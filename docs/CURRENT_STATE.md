# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open PR work must not be mistaken for production closure.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay pattern: **Pattern #40 — Logic `spatial_relation_board`**
- Pattern #40 audit: PR #173 -> main `f1b4b13d3d9814d2ed06500022218848cd721419`
- Pattern #40 implementation: PR #175 -> main `fd017b81137f03bb30eca19a2ceb71c734cb3ba9`
- Pattern #40 implementation merged-main CI: **#848 / run `35217949039` — full success**
- Pattern #40 closure: PR #176 -> final main `43d69c42ca456ab41011f1d198e021f2b0d53cae`
- Pattern #40 final closure CI: **#850 / run `35219083042` — full success**
- Pattern #39 remains **FULLY CLOSED**
- permanent visual QA foundation: **VQA-01 FULLY CLOSED**
- visual P1 baseline: **P0=0 / P1=0 / P2=3**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

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
Pattern #40: FULLY CLOSED
```

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

Verified merged-main distribution after Pattern #40:

```text
classified:                    900 / 900
unclassified:                    0
active merged patterns:         40
choice_grid                    261 / 900
spatial_relation_board           6 / 900
visual_word_problem              5 / 900
cloze_sentence_choice            5 / 900
reading_passage_question         5 / 900
sentence_order_cards             5 / 900
picture_word_match               5 / 900
```

Remaining distance is **10 patterns** to minimum 50 and **20** to working target 60.

Deterministic activity-quality remains clean on the verified merged baseline.

## Pattern #40 — fully closed

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

Closed behavior:

- exact six-ID deterministic config;
- canonical prompt, choice order and `correctChoice` remain unchanged;
- dedicated child-facing relation/turn/opposite-direction board;
- inferred turn/opposite result remains hidden before success and after wrong answers;
- direct keyboard/touch/pointer answer controls remain primary;
- wrong attempts remain measured/retryable and cannot complete;
- correct answer completes through the existing measured path;
- runtime metadata identifies `spatial-relation-board-runtime` and `choice_spatial_relation_interaction` without changing correctness semantics;
- responsive QA passes at 320x720, 390x844 and 768x1024;
- permanent visual baseline remains green;
- mastery, progression, schema and database remain unchanged.

Verification chain:

```text
Audit PR:                #173
Implementation PR:       #175
Implementation main:     fd017b81137f03bb30eca19a2ceb71c734cb3ba9
Implementation main CI:  #848 / run 35217949039 — full success
Closure PR:              #176
Final closure main:      43d69c42ca456ab41011f1d198e021f2b0d53cae
Final closure CI:        #850 / run 35219083042 — full success
```

Full evidence: `PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`, `WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`, `PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md`, and `PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md`.

## P1/P2 state

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

1. Run a **fresh Pattern #41 objective/evidence audit**; no mechanic, subject or content family is pre-approved.
2. If a Pattern #41 candidate is justified, implement only a small exact scope with preserved evidence/mastery/progression semantics.
3. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
4. Continue WS-02 narration and WS-10 external physical-device/accessibility/human/Iqro acceptance.
5. Continue WS-11 governance.
6. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
7. Perform later WS-12 technical cleanup and final end-to-end production acceptance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
