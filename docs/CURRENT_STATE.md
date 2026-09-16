# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open work is called out explicitly.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: **Pattern #37 — Bahasa `reading_passage_question`**
- Pattern #37 final verified `main`: `b1793adaabe19a9c73e021534899f8b50c4097f6`
- Pattern #37 final CI: **#741 / run `35103399012` — full success including exact Cloudflare production smoke**
- permanent visual QA: **VQA-01 FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 / run `35110724150`
- Parent Report convergence: **VUI-01 FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- Stage / Gallery convergence: **VUI-02 FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- Public/Auth/Account convergence: **VUI-03 FULLY CLOSED**, PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`
- VUI-03 final `main` CI: **#776 / run `35124809180` — full success including exact Cloudflare release smoke**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

VQA-01, VUI-01, VUI-02 and VUI-03 are **FULLY CLOSED and live verified**. The permanent browser matrix remains blocking and produces 42 exact-path captures across 14 canonical product surfaces at 390x844, 768x1024 and 1280x800.

VUI-03 changed presentation and navigation-shell composition only. Known-child fast resume, Supabase operations, validation, session semantics, recovery/callback behavior, redirects, learning/mastery/evidence/progression, activity content and curriculum data remain unchanged.

VUI-03 closure evidence:
- accepted implementation head before docs: `96de380796cdcb16cd10f390805f4c7b62f9b83b`;
- accepted implementation CI: **#771 / run `35122985995` — full success**;
- accepted artifact: `10458188042`, digest `sha256:c554eca3a218c659b97c07f6bfb6521b00fea7f28c6b9de18ac1a799ea3fcdbb`;
- final PR head: `d6569864e0149816abea5bff65cbc2a948b4f58b`;
- final PR CI: **#775 / run `35124156787` — full success**;
- squash merge: `415008a4a0503da98937ee8df0a1e5feb1a08c62`;
- independent `main` CI: **#776 / run `35124809180` — full success**;
- exact Cloudflare step **“Wait for exact Cloudflare release and smoke public endpoints” — success**.

Manual VUI-03 acceptance remains recorded for public root, account, login, signup, forgot-password and auth callback at 390 / 768 / 1280. `/reset-password` uses the same accepted auth family shell/form presentation while preserving the existing recovery/session flow.

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

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

Remaining distance is **13 patterns** to minimum 50 and **23** to working target 60. WS-05 remains paused before Pattern #38 until the visual P1 checkpoint reaches zero.

Deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings**.

## Production visual/product baseline

Canonical audit: `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`.  
Canonical visual direction: `MAINLAGI_ART_BIBLE.md`.

Merged-main state after VUI-03 closure:

```text
P0 findings: 0
P1 findings: 1
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: FULLY CLOSED / BLOCKING
VUI-01 Parent Report: FULLY CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery: FULLY CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account: FULLY CLOSED / LIVE VERIFIED
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

P1 state:

1. **VBASE-P1-01 — visual-token fragmentation:** OPEN; this is the sole remaining P1. VUI-01/02/03 removed the highest-risk family-facing drift, but residual legacy/global system clusters still need one targeted evidence-first closure pass.
2. **VBASE-P1-02 — parent-report density/jargon:** **CLOSED** by PR #157.
3. **VBASE-P1-03 — stage/readiness hierarchy:** **CLOSED** by PR #158.
4. **VBASE-P1-04 — public/adult root IA:** **CLOSED** by PR #160, main `415008a4...`, CI #776 including exact Cloudflare smoke.
5. **VBASE-P1-05 — permanent visual coverage gap:** **CLOSED** by PR #156.

Initial residual-token audit already confirms at least one family/system surface still on legacy globals: the canonical not-found page uses `center-page`, `dialog-card` and legacy `.button--primary`. Admin-only utility styling is not automatically a product P1 and must not be mass-migrated merely for token purity.

## VUI-03 product contract

Public root:
- clean session uses the public/family AppShell rather than child `PlayroomShell`;
- valid known-child fast resume continues through the existing `readActiveChild()` + `childDestination()` path;
- child-start and parent/account actions are explicit and separate;
- Main Gerak camera use is described as optional without unsupported privacy/security claims;
- subject discovery remains available and continues through child-profile preparation.

Auth:
- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` share one scoped Mainlagi family visual shell;
- family auth routes own the viewport to avoid duplicate public/auth navigation;
- Supabase operations, validation, recovery/callback behavior, messages and redirects remain unchanged;
- controls use scoped Mainlagi colors/focus states and >=44px targets.

Account:
- `/account` uses scoped family presentation rather than the old global account cluster;
- signed-in/signed-out behavior and existing destination routes remain unchanged;
- phone stacks settings; tablet/desktop use two readable columns.

Permanent VQA additions keep the existing 42-capture matrix blocking on public family CTA/camera copy, auth family-shell/form/status markers and account family/settings geometry.

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

1. Close the sole remaining **VBASE-P1-01 visual-token fragmentation** with a targeted, evidence-first wave; do **not** mass-rewrite `globals.css`.
2. Re-run permanent visual QA and manual 390 / 768 / 1280 acceptance until **P0=0 / P1=0** is live-verified and documented.
3. Only then run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
4. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
5. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
6. Finish with full production end-to-end acceptance and canonical release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before this quality phase is substantially complete.