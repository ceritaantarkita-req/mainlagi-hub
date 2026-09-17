# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open closure work must not be mistaken for final closure.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay pattern: **Pattern #40 — Logic `spatial_relation_board`**
- Pattern #40 final truth reconciliation: PR #177 -> main `7c7f715a18a36e76fbf7483e5bc3e25d9ff8a32f`
- Pattern #40 truth-reconciliation merged-main CI: **#853 / run `35222303192` — full success including exact Cloudflare production smoke**
- Pattern #41 objective/evidence audit: PR #179 -> main `917e933b2d69db3d014b98f3aa49bb6962aec992`
- Pattern #41 audit merged-main CI: **#860 / run `35223876877` — full success including exact Cloudflare production smoke**
- Pattern #41 implementation: PR #180 -> main `f90a0d377fa7227b8857f6069a5e957c99eb0b11`
- Pattern #41 implementation merged-main CI: **#862 / run `35229750381` — full success including exact Cloudflare production smoke**
- Pattern #41 closure: **IN PROGRESS** on `agent/p41-phrase-scene-match-closure-20260917`
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
Pattern #41: IMPLEMENTATION LIVE VERIFIED / CLOSURE IN PROGRESS
```

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

Verified merged-main distribution after Pattern #41 implementation:

```text
classified:                    900 / 900
unclassified:                    0
active merged patterns:         41
choice_grid                    257 / 900
phrase_scene_match               4 / 900
spatial_relation_board           6 / 900
visual_word_problem              5 / 900
cloze_sentence_choice            5 / 900
reading_passage_question         5 / 900
sentence_order_cards             5 / 900
picture_word_match               5 / 900
```

Remaining distance is **9 patterns** to minimum 50 and **19** to working target 60.

## Pattern #41 — implementation live verified, closure in progress

Pattern:

```text
phrase_scene_match
```

Exact scope:

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

Verified implementation behavior:

- exact four-ID deterministic config with all twelve canonical choice scenes;
- canonical prompts, choice labels/order, answer payloads and `correctChoice` unchanged;
- scene semantics cover color, quantity, size and noun composition;
- direct keyboard/touch/pointer answer controls remain primary;
- wrong attempts remain measured/retryable and cannot complete;
- correct answer completes through the existing measured path;
- runtime metadata identifies `phrase-scene-match-runtime` and `choice_phrase_scene_interaction` without changing correctness semantics;
- responsive browser QA passes at 320x720, 390x844 and 768x1024;
- permanent visual QA remains green;
- `english-listen-phrase-blue-book`, sentence-completion activities and unrelated vocabulary/opposites remain outside Pattern #41;
- mastery, progression, schema and database remain unchanged.

Verification chain:

```text
Audit PR:                #179
Audit main:              917e933b2d69db3d014b98f3aa49bb6962aec992
Audit main CI:           #860 / run 35223876877 — full success + Cloudflare smoke
Implementation PR:       #180
Verified PR head:        03886f191d089a37bbaf7c9d429d6d9a8020ec6d
Implementation main:     f90a0d377fa7227b8857f6069a5e957c99eb0b11
Implementation main CI:  #862 / run 35229750381 — full success + Cloudflare smoke
Closure docs:            agent/p41-phrase-scene-match-closure-20260917 — in progress
```

Full implementation evidence: `PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`, `WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md`, and `PATTERN41_PHRASE_SCENE_MATCH_CLOSURE_2026-09-17.md`.

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

1. Finish the Pattern #41 closure-docs gate and verify the exact closure head.
2. Merge only the verified closure head, then independently verify resulting `main` including exact Cloudflare production smoke.
3. Only after that mark Pattern #41 **FULLY CLOSED** and start a fresh Pattern #42 objective/evidence audit; no mechanic/subject/content family is pre-approved.
4. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
5. Continue WS-02 narration, WS-10 external physical-device/accessibility/Iqro evidence, WS-11 governance and later P2/WS-12 cleanup.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
