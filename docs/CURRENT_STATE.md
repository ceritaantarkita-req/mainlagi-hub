# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open PR work must not be mistaken for production closure.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest live-verified gameplay implementation: **Pattern #38 — Bahasa `cloze_sentence_choice`**
- Pattern #38 implementation merge: `76a2d87dca3689ed8206f5ce0556760dabe903b6`
- Pattern #38 merged-main CI: **#801 / run `35179596668` — full success including exact Cloudflare production smoke**
- Pattern #38 closure docs: **IN PROGRESS on dedicated docs-only branch; implementation itself is live verified**
- permanent visual QA foundation: **VQA-01 FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 / run `35110724150`
- Parent Report convergence: **VUI-01 FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- Stage / Gallery convergence: **VUI-02 FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- Public/Auth/Account convergence: **VUI-03 FULLY CLOSED**, PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776 / run `35124809180`
- VUI-03 docs/live baseline: PR #161 -> `7c863ad2b1887fe0c39557b408b743036128abe1`, CI #778 / run `35130270215`
- residual visual-token closure: **VBASE-P1-01 FULLY CLOSED / LIVE VERIFIED**, PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI **#788 / run `35168877485` including exact Cloudflare release smoke**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

The production visual checkpoint remains:

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: FULLY CLOSED / BLOCKING / 63 CAPTURES LIVE
VUI-01 Parent Report: FULLY CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery: FULLY CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account: FULLY CLOSED / LIVE VERIFIED
VBASE-P1-01 residual token fragmentation: FULLY CLOSED / LIVE VERIFIED
Visual P1 checkpoint: ACCEPTED
Pattern #38 implementation: MERGED / LIVE VERIFIED
Pattern #38 docs closure: IN PROGRESS
```

PR #162 closed the final visual P1 without a global CSS rewrite. Its accepted account/system-state scope and permanent 21-route × 3-viewport visual matrix remain unchanged by Pattern #38.

`/account/security` remains a stub; no security feature was invented.

## Pattern #38 live implementation evidence

Objective/evidence audit: PR #165.

Implementation PR #166 exact head:

```text
7bfb58d93c5c61200dc6a91c5fd5243c1369c3bd
```

Implementation PR CI:

```text
#795 / run 35176307842 — full success
```

Squash merge:

```text
76a2d87dca3689ed8206f5ce0556760dabe903b6
```

Independent merged-main verification:

```text
#801 / run 35179596668 — full success
Production smoke (Cloudflare) — success
Wait for exact Cloudflare release and smoke public endpoints — success
```

Responsive Pattern #38 QA covered 320x720, 390x844 and 768x1024 across idle/wrong/success states. Accepted PR screenshot artifact:

```text
id: 10478269865
digest: sha256:92c561e8afd029cc618a966e1686a5e601cbc72580c387c608f73bafc814246b
```

Merged-main gameplay-distribution evidence:

```text
900 / 900 classified
0 unclassified
38 active child-facing patterns
choice_grid                    272 / 900 = 30.22%
cloze_sentence_choice           5 / 900 = 0.56%
```

Artifact:

```text
id: 10479619607
digest: sha256:2bc2b1734091a6de2c71c6545d3e07a27cab02c685c537cf002ac9a8a3092381
```

Full Pattern #38 closure evidence: `PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md`.

Draft PR #167 was a duplicate implementation path and failed its gameplay-presentation regression; it was closed as superseded and is not canonical.

## Final P1 closure evidence

Final visual P1 implementation/closure remains live verified on PR #162 / main `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI #788 including exact Cloudflare smoke. The live permanent matrix remains **21 canonical routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800.

Full visual closure evidence: `VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md`.

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

```text
classified:                    900 / 900
unclassified:                    0
active merged patterns:         38
choice_grid                    272 / 900 = 30.22%
cloze_sentence_choice            5 / 900 = 0.56%
reading_passage_question         5 / 900 = 0.56%
sentence_order_cards             5 / 900 = 0.56%
picture_word_match               5 / 900 = 0.56%
```

Remaining distance is **12 patterns** to minimum 50 and **22** to working target 60.

Pattern #38 exact scope is five Bahasa context-completion activities. Runtime, assessment/evidence, mastery/progression, schema and activity content remain canonical; only the justified presentation/interaction is specialized.

Deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings**.

## P1 state

All baseline P1 findings are closed and live verified:

1. **VBASE-P1-01 — visual-token fragmentation:** **CLOSED / LIVE VERIFIED** by PR #162, main `2d3f95066e...`, CI #788 including exact Cloudflare smoke.
2. **VBASE-P1-02 — parent-report density/jargon:** **CLOSED** by PR #157.
3. **VBASE-P1-03 — stage/readiness hierarchy:** **CLOSED** by PR #158.
4. **VBASE-P1-04 — public/adult root IA:** **CLOSED** by PR #160.
5. **VBASE-P1-05 — permanent visual coverage gap:** **CLOSED** by PR #156; PR #162 strengthened the blocking gate to 21 routes / 63 captures.

The remaining visual backlog is P2, not hidden P1 work:

- VBASE-P2-01 game detail/preflight legacy vocabulary;
- VBASE-P2-02 semantic iconography drift;
- VBASE-P2-03 inline visual-style drift risk.

Admin-only utility styling remains separate unless user-facing leakage is proven.

## Product contracts preserved

Current visual/gameplay convergence preserves:

- valid remembered child fast-resume through existing destination logic;
- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` Supabase operations, validation, recovery/callback semantics and redirects;
- signed-in/signed-out account behavior and canonical destination routes;
- optional-camera framing without unsupported privacy/security claims;
- learning/mastery/evidence/progression/content/schema/database semantics;
- Pattern #38 canonical prompts, choices, correct answers, `tap_choice` runtime and `bahasa.kalimat.context_completion` evidence.

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

1. Finish the **Pattern #38 docs-only closure gate**: exact-head CI, clean merge, then independent merged-main CI + exact Cloudflare smoke.
2. After Pattern #38 is fully closed, run a **fresh objective/evidence audit for Pattern #39**; do not preselect a mechanic merely to increase the pattern count.
3. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
4. Continue WS-02 narration and WS-10 external physical-device/accessibility/human acceptance.
5. Continue WS-11 governance.
6. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
7. Perform later WS-12 technical cleanup and final end-to-end production acceptance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.