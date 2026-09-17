# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open PR work must not be mistaken for production closure.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay implementation: **Pattern #39 — Math `visual_word_problem`**
- Pattern #39 audit: PR #169
- Pattern #39 implementation: PR #170
- Pattern #39 implementation merge/main: `bcb8479514f44d46ebc68917981699240aabc3b2`
- Pattern #39 implementation merged-main CI: **#809 / run `35187506724` — full success including exact Cloudflare production smoke**
- Pattern #39 closure: **FULLY CLOSED**, closure PR #171 -> main `98725727c866d410b2d0caa206e86e70cd0e5741`, final main CI **#811 / run `35190499794` — full success including exact Cloudflare production smoke**
- Pattern #38: **FULLY CLOSED**, closure PR #168 -> main `86e6b69d576d72fec73158a7a1c6d8961de36887`, final main CI #803 including exact Cloudflare smoke
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
Pattern #39: FULLY CLOSED / LIVE VERIFIED
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

Remaining distance is **11 patterns** to minimum 50 and **21** to working target 60.

Deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings**.

## Pattern #38 closure

Pattern #38 `cloze_sentence_choice` is fully closed.

Canonical chain:

```text
Audit PR:        #165
Implementation:  #166
Implementation main: 76a2d87dca3689ed8206f5ce0556760dabe903b6
Implementation main CI: #801 / run 35179596668 — full success
Closure PR:      #168
Closure main:    86e6b69d576d72fec73158a7a1c6d8961de36887
Final main CI:   #803 / run 35180530822 — full success
Cloudflare smoke: success
```

Full evidence: `PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md`.

## Pattern #39 closure

Exact scope:

```text
math-problem-apples
math-problem-birds
math-problem-cars
math-problem-cookies
math-problem-balloons
```

Pattern:

```text
visual_word_problem
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

Presentation/evidence behavior:

- canonical everyday story remains primary prompt;
- deterministic quantity board shows start -> add/remove -> unknown result;
- result remains hidden before correct completion;
- wrong answer remains retryable/measured and cannot complete;
- keyboard/touch/pointer remain direct primary controls;
- runtime source `visual-word-problem-runtime`;
- evidence fidelity `choice_visual_word_problem_interaction`.

Canonical verification chain:

```text
Audit PR:                #169
Implementation PR:       #170
Implementation head:     df503b95abf86e2b530dd9ff18bd5d8b9707e2db
Implementation main:     bcb8479514f44d46ebc68917981699240aabc3b2
Implementation main CI:  #809 / run 35187506724 — full success
Closure PR:              #171
Closure main:            98725727c866d410b2d0caa206e86e70cd0e5741
Final main CI:           #811 / run 35190499794 — full success
Cloudflare exact smoke:  success
```

Merged-main gameplay-distribution artifact from implementation verification:

```text
id: 10482459288
digest: sha256:4bacc984852eb4befd352a727935daf8e75cb0b30ec1a58af8451895649ae967
```

Full implementation/closure evidence: `WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md` and `PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md`.

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

1. Run a **fresh objective/evidence audit for Pattern #40**; no mechanic, subject or activity family is pre-approved.
2. If justified, implement Pattern #40 on a small deterministic scope with permanent WS-08 visual QA running in parallel.
3. Continue WS-05 toward 50–60 meaningful patterns.
4. Continue WS-02 narration and WS-10 external physical-device/accessibility/human acceptance.
5. Continue WS-11 governance.
6. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
7. Perform later WS-12 technical cleanup and final end-to-end production acceptance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
