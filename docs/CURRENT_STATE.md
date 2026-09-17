# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: **Pattern #37 — Bahasa `reading_passage_question`**
- Pattern #37 final verified `main`: `b1793adaabe19a9c73e021534899f8b50c4097f6`
- Pattern #37 final CI: **#741 / run `35103399012` — full success including exact Cloudflare production smoke**

Visual/product closure chain:
- VQA-01 permanent visual QA: PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751
- VUI-01 Parent Report: PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- VUI-02 Stage/Gallery: PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- VUI-03 Public/Auth/Account: PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776
- VUI-03 docs baseline: PR #161 -> `7c863ad2b1887fe0c39557b408b743036128abe1`, CI #778
- final residual visual-token closure: PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, independent main CI **#788 / run `35168877485` — full success including exact Cloudflare release smoke**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

The visual P1 checkpoint is now **FULLY CLOSED and live verified**.

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Permanent visual QA: BLOCKING / LIVE VERIFIED
Whole-product P1 visual checkpoint: CLOSED
Pattern #38: UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT
```

VBASE-P1-01 final live evidence:

```text
PR:                       #162
final PR head:            38b9eb7920d1e6796384b889f928dfcbf4d7e629
merge/main SHA:           2d3f95066e1106c43c76bf91dd29bf5707dca52c
independent main CI:      #788 / run 35168877485
Cloudflare smoke:         SUCCESS
exact release step:       Wait for exact Cloudflare release and smoke public endpoints — success
```

Accepted implementation evidence before merge:

```text
implementation head: 923635645c164f08e9d26cc84be0b527d0e13ae0
CI:                  #781 / run 35137266315 — full PR success
artifact id:         10464427013
digest:              sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
captures:            63 / 63
routes:              21
viewports:           390x844, 768x1024, 1280x800
status:              60 x HTTP 200 + 3 intentional HTTP 404
missing screenshots: 0
```

Manual screenshot review remains part of acceptance. CI #780 was structurally green but exposed a large empty card on the `/account/security` stub. That visual defect was fixed before #781 instead of being waived.

Full live closure record: `VBASE_P1_01_LIVE_CLOSURE_2026-09-17.md`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

```text
classified:                    900 / 900
unclassified:                    0
active merged patterns:         37
choice_grid                    277 / 900 = 30.78%
reading_passage_question         5 / 900 = 0.56%
sentence_order_cards             5 / 900 = 0.56%
picture_word_match               5 / 900 = 0.56%
Bahasa choice_grid               29 / 100
```

Remaining distance is **13 patterns** to minimum 50 and **23** to working target 60.

Pattern #38 is no longer blocked by the visual checkpoint. It is **not pre-approved for implementation**: next work must be a fresh objective/evidence audit against the current catalog, distribution and mastery boundaries.

Deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings**.

## Production visual/product baseline

Canonical audit: `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`.  
Canonical visual direction: `MAINLAGI_ART_BIBLE.md`.

P1 state:

1. **VBASE-P1-01 — visual-token fragmentation:** **CLOSED / LIVE VERIFIED** by PR #162, main `2d3f95066...`, CI #788 including exact Cloudflare smoke.
2. **VBASE-P1-02 — parent-report density/jargon:** **CLOSED** by PR #157.
3. **VBASE-P1-03 — stage/readiness hierarchy:** **CLOSED** by PR #158.
4. **VBASE-P1-04 — public/adult root IA:** **CLOSED** by PR #160.
5. **VBASE-P1-05 — permanent visual coverage gap:** **CLOSED** by PR #156; PR #162 strengthened permanent coverage from 14 routes / 42 screenshots to 21 routes / 63 screenshots.

Remaining P2 work:
- game detail/preflight legacy vocabulary;
- mixed canonical iconography and raw emoji;
- inline visual styles that increase drift risk.

These remain P2 and must not be retroactively promoted merely to keep Pattern #38 blocked.

## Product contracts preserved

The visual waves preserve:
- valid remembered-child fast resume;
- Supabase auth/session/recovery/callback behavior;
- account signed-in/signed-out behavior and existing destination routes;
- account component data operations;
- optional camera framing without unsupported privacy/security claims;
- learning/mastery/evidence/progression/content/schema/database semantics.

`/account/security` remains a stub. The visual closure does not claim password/session controls exist there.

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

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Current priority order

1. Run a **fresh Pattern #38 objective/evidence audit** from the current live-verified main baseline; do not preselect a mechanic.
2. If the audit identifies a justified pattern, implement it with exact-scope regression, evidence/progression checks, touch/keyboard/responsive QA and permanent visual review.
3. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
4. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
5. Address P2 visual cleanup without destabilizing accepted P1 surfaces.
6. Finish with full production end-to-end acceptance and canonical release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the remaining quality work is substantially complete.
