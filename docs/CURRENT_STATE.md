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
- Pattern #40 closure: PR #176 -> main `43d69c42ca456ab41011f1d198e021f2b0d53cae`
- Pattern #40 final closure CI: **#850 / run `35219083042` — full success**
- Pattern #40 final truth reconciliation: PR #177 -> main `7c7f715a18a36e76fbf7483e5bc3e25d9ff8a32f`
- Pattern #40 truth-reconciliation merged-main CI: **#853 / run `35222303192` — full success including exact Cloudflare production smoke**
- Pattern #41 objective/evidence audit: **OPEN PR #179**, candidate `phrase_scene_match`; implementation has not started
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
Pattern #41: AUDIT OPEN / IMPLEMENTATION NOT STARTED
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

Remaining distance is **10 patterns** to minimum 50 and **20** to working target 60. Pattern #41 is not counted until implementation is merged and independently verified.

## Pattern #40 — fully closed

Pattern: `spatial_relation_board`.

Exact scope:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

Canonical ownership remains Logic / `logic-patterns-sequences-relations` / `logic-spatial-relations` / `logic.pack.spatial-relations` / `logic.spatial.relation.basic` / assessed `tap_choice` / `choice_accuracy_v1`.

The implementation remains exact-scoped, deterministic, keyboard/touch/pointer accessible, retry-safe and evidence-safe. Canonical prompts/choices/answers, mastery, progression, schema and database remain unchanged.

Verification chain:

```text
Audit PR:                #173
Implementation PR:       #175
Implementation main:     fd017b81137f03bb30eca19a2ceb71c734cb3ba9
Implementation main CI:  #848 / run 35217949039 — full success
Closure PR:              #176
Closure main:            43d69c42ca456ab41011f1d198e021f2b0d53cae
Closure CI:              #850 / run 35219083042 — full success
Truth reconciliation:    #177 -> 7c7f715a18a36e76fbf7483e5bc3e25d9ff8a32f
Truth reconciliation CI: #853 / run 35222303192 — full success + Cloudflare smoke
```

Full evidence: `PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`, `WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`, `PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md`, and `PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md`.

## Pattern #41 objective/evidence audit — open

PR #179 is a docs-only audit. It selects a candidate but does **not** claim runtime implementation or production availability.

Working pattern:

```text
phrase_scene_match
```

Exact candidate scope:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Canonical ownership:

```text
subject:     english
stage:       english-phrases-review
lesson:      english-simple-phrases
pack:        english.pack.simple-phrases
skill:       english.phrase.literal
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Audit rationale: the objective measures literal understanding of short compositional English phrases, while the four activities currently mix emoji and text-only answer representations. A deterministic scene per canonical choice can make color, quantity, size and noun composition visible without changing the submitted answer or evidence contract.

Audit boundaries:

- exactly four direct-choice activities only;
- `english-listen-phrase-blue-book` remains outside because it is listening;
- `english-complete-*` remains outside and should reuse `cloze_sentence_choice` if separately approved;
- no arbitrary English phrase parser;
- canonical prompts, labels/order and `correctChoice` stay unchanged;
- no translation, speech-scoring, drag-only requirement, mastery/progression/schema/database rewrite;
- implementation begins only after the audit passes exact-head CI and merges to `main`.

## P1/P2 state

All baseline P1 findings are closed and live verified. Remaining visual backlog is P2:

- VBASE-P2-01 game detail/preflight legacy vocabulary;
- VBASE-P2-02 semantic iconography drift;
- VBASE-P2-03 inline visual-style drift risk.

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

1. Complete Pattern #41 audit PR #179 on one exact head with clean CI/review/mergeability gates.
2. If accepted, merge the docs-only audit and independently verify resulting `main`.
3. Start `phrase_scene_match` implementation from that latest `main` on a separate branch, exact-scoped to the four audited activities.
4. Require deterministic config, canonical classifier/distribution registration, measured completion regression, keyboard/touch/pointer QA and responsive browser screenshots before implementation merge.
5. Continue WS-05 toward 50–60 with permanent WS-08 visual QA running in parallel.
6. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later P2/WS-12 work without destabilizing accepted product surfaces.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
