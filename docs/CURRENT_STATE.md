# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open implementation work must not be mistaken for production closure.

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
- Pattern #41 objective/evidence audit: PR #179 -> main `917e933b2d69db3d014b98f3aa49bb6962aec992`
- Pattern #41 audit merged-main CI: **#860 / run `35223876877` — full success including exact Cloudflare production smoke**
- Pattern #41 implementation: **IN PROGRESS** on `agent/p41-phrase-scene-match-20260917`; not merged and not production-accepted
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
Pattern #41: AUDIT MERGED + VERIFIED / IMPLEMENTATION IN PROGRESS / NOT MERGED
```

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

Verified merged-main distribution remains the Pattern #40 baseline:

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

Remaining merged-main distance is **10 patterns** to minimum 50 and **20** to working target 60. Pattern #41 must not be counted until implementation is merged and independently verified.

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

## Pattern #41 — audit merged, implementation in progress

Pattern:

```text
phrase_scene_match
```

Exact audited scope:

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

Audit chain:

```text
Audit PR:             #179
Audit main:           917e933b2d69db3d014b98f3aa49bb6962aec992
Audit merged-main CI: #860 / run 35223876877 — full success + Cloudflare smoke
```

Implementation branch currently contains:

- exact four-ID deterministic config with all twelve canonical choice scenes;
- fail-closed classifier registration as `phrase_scene_match`;
- dedicated child-facing `PhraseSceneMatchActivity` with canonical prompt and choice labels/order preserved;
- direct keyboard/touch/pointer answer controls;
- measured wrong/retry/correct completion using existing `choice_accuracy_v1` semantics;
- metadata source `phrase-scene-match-runtime` and evidence fidelity `choice_phrase_scene_interaction`;
- exact-scope regression covering authoring, manifest, lesson, pack, skill and evidence ownership;
- responsive browser QA for idle/wrong/success at 320x720, 390x844 and 768x1024;
- gameplay-distribution acceptance target wired as 900/900 classified, 41 active patterns, `choice_grid` 257/900, `phrase_scene_match` 4/900.

These implementation statements describe the open branch only. They are **not** merged-main or production acceptance claims yet.

Strict boundaries remain:

- only the four audited direct-choice activities classify as Pattern #41;
- `english-listen-phrase-blue-book` remains outside because its canonical runtime is listening;
- `english-complete-*` remains outside and continues to belong to cloze semantics when applicable;
- no arbitrary English phrase parser;
- canonical prompts, labels/order, submitted answer strings and `correctChoice` remain unchanged;
- no translation checkpoint, speech scoring, drag-only requirement, mastery/progression/schema/database rewrite.

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

1. Finish Pattern #41 implementation wiring, exact-scope tests, distribution checks, responsive browser QA and implementation evidence docs on one branch.
2. Open one implementation PR from `agent/p41-phrase-scene-match-20260917` to `main`.
3. Require exact-head Ubuntu, Windows, production build, security/dependency, activity-quality, gameplay-distribution, simulations and permanent visual QA to pass before merge.
4. Merge only the exact verified implementation head, then independently verify resulting `main` including exact Cloudflare production smoke.
5. Run a separate Pattern #41 closure-docs gate; only after that may Pattern #41 become **FULLY CLOSED**.
6. Continue WS-05 toward 50–60 with permanent WS-08 visual QA running in parallel.
7. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later P2/WS-12 work without destabilizing accepted product surfaces.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
