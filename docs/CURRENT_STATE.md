# Mainlagi Hub — Current State

Last reviewed: **18 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open implementation work must not be mistaken for merged production truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay pattern: **Pattern #41 — English `phrase_scene_match`**
- Pattern #41 final truth reconciliation: PR #185 -> main `e20b50431d907f9ca6f3ef254b7c69aa24a132a5`
- Pattern #41 final truth merged-main CI: **#869 / run `35241959755` — full success including exact Cloudflare production smoke**
- Pattern #42 objective/evidence audit: PR #186 -> main `541c2348507e976fb723c9c6e5b8f1b242cff490`
- Pattern #42 audit merged-main CI: **#871 / run `35255083348` — full success including exact Cloudflare production smoke**
- Pattern #42 implementation: **PR #187 / branch `agent/p42-growth-stage-transition-20260918` — IN PROGRESS / NOT MERGED**
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
Pattern #41: FULLY CLOSED / LIVE VERIFIED
Pattern #42: AUDIT MERGED + LIVE VERIFIED / IMPLEMENTATION IN PROGRESS
```

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

Verified merged-main distribution at Pattern #42 implementation start remains:

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

Pattern #42 implementation branch is gated to exactly:

```text
classified:                    900 / 900
unclassified:                    0
active implementation patterns: 42
choice_grid                    254 / 900
growth_stage_transition          3 / 900
```

The 42-pattern numbers are **implementation acceptance targets, not merged production truth** until PR #187 merges and resulting `main` is independently verified.

## Pattern #41 — fully closed

Pattern #41 `phrase_scene_match` remains fully closed/live verified for exactly:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Canonical ownership remains English / `english-phrases-review` / `english-simple-phrases` / `english.pack.simple-phrases` / `english.phrase.literal` / assessed `tap_choice` / `choice_accuracy_v1`.

Final verification chain:

```text
Audit PR:                #179
Audit main:              917e933b2d69db3d014b98f3aa49bb6962aec992
Audit main CI:           #860 / run 35223876877 — full success + Cloudflare smoke
Implementation PR:       #180
Implementation main:     f90a0d377fa7227b8857f6069a5e957c99eb0b11
Implementation main CI:  #862 / run 35229750381 — full success + Cloudflare smoke
Closure PR:              #184
Closure main:            552a3123b7352d6d5ab0eb2d9caecab50d60f09c
Closure main CI:         #867 / run 35240186539 — full success + Cloudflare smoke
Truth PR:                #185
Final truth main:        e20b50431d907f9ca6f3ef254b7c69aa24a132a5
Final truth main CI:     #869 / run 35241959755 — full success + Cloudflare smoke
```

## Pattern #42 — audit merged, implementation in progress

Pattern:

```text
growth_stage_transition
```

Exact audited/implemented scope:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Canonical ownership remains:

```text
subject:     science
stage:       science-life-material-motion
lesson:      science-life-cycles
pack:        science.pack.life-cycles
skill:       science.life_cycles.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Audit verification:

```text
Audit PR:      #186
Audit main:    541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI: #871 / run 35255083348 — full success + exact Cloudflare smoke
```

Implementation PR #187 currently adds:

- exact three-ID fail-closed config;
- deterministic `previous_stage`, `next_adult_stage`, and `next_young_stage` modes;
- child-facing two-stage transition board;
- target slot hidden on idle/wrong and revealed only after the canonical correct answer;
- unchanged canonical prompts, choice labels/order, submitted values and `correctChoice`;
- measured wrong/retry semantics and existing assessed completion path;
- metadata `growth-stage-transition-runtime` / `choice_growth_stage_transition_interaction`;
- exact-scope authoring/manifest/evidence regression;
- browser idle/wrong/success QA at 320x720, 390x844 and 768x1024;
- permanent test wiring and blocking gameplay-distribution assertions.

Explicit exclusions remain:

- `science-cycle-butterfly` — full ordered lifecycle sequence;
- `science-match-young-adult-b` — canonical matching runtime/evidence;
- existing `cause_effect`, `relative_order_track`, sequence and unrelated Science families.

No mastery/progression/schema/database migration is part of Pattern #42.

Full audit: `PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`.  
Implementation wave: `WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md`.

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

1. Finish Pattern #42 implementation PR #187 exact-head QA: typecheck/lint/engine, exact-scope regression, distribution, responsive browser screenshots and permanent visual baseline.
2. Merge only a clean exact verified PR head.
3. Independently verify resulting `main`, including exact Cloudflare production smoke.
4. Record post-merge Pattern #42 closure docs before calling it fully closed.
5. Only after closure begin a fresh Pattern #43 objective/evidence audit; no candidate is pre-approved.
6. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA in parallel, plus WS-02 narration, WS-10 external evidence, WS-11 governance and later P2/WS-12 cleanup.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
