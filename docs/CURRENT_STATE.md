# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open PR work is called out explicitly and must not be mistaken for production closure.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: **Pattern #37 — Bahasa `reading_passage_question`**
- Pattern #37 final verified `main`: `b1793adaabe19a9c73e021534899f8b50c4097f6`
- Pattern #37 final CI: **#741 / run `35103399012` — full success including exact Cloudflare production smoke**
- permanent visual QA foundation: **VQA-01 FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 / run `35110724150`
- Parent Report convergence: **VUI-01 FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- Stage / Gallery convergence: **VUI-02 FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- Public/Auth/Account convergence: **VUI-03 FULLY CLOSED**, PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`
- VUI-03 final `main` CI: **#776 / run `35124809180` — full success including exact Cloudflare release smoke**
- VUI-03 docs closure: PR #161 -> `7c863ad2b1887fe0c39557b408b743036128abe1`, independent `main` CI **#778 / run `35130270215` — full success including exact Cloudflare release smoke**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

VQA-01, VUI-01, VUI-02 and VUI-03 are fully closed and live verified. The currently merged production baseline remains **P0=0 / P1=1 / P2=3** because VBASE-P1-01 has not yet completed independent post-merge production verification.

PR #162 is the accepted **implementation candidate** for the final P1. It is intentionally not yet counted as a merged-production closure.

PR #162 scope:
- migrate `/account/profile`, `/account/players`, `/account/preferences`, `/account/security`, `/account/delete` and `/account/about` to one scoped family account-section shell;
- migrate canonical not-found away from the legacy generic dialog/blue-primary cluster;
- preserve existing account/auth/data behavior;
- expand permanent exact-path visual evidence to all six migrated account subpages plus `/reset-password`;
- no mass `globals.css` rewrite;
- no learning/mastery/evidence/progression/readiness/curriculum/schema/database change.

Accepted implementation head before candidate docs: `923635645c164f08e9d26cc84be0b527d0e13ae0`.

Accepted implementation CI: **#781 / run `35137266315` — full PR success**. Cloudflare is skipped on PR by design.

Accepted #781 visual artifact:

```text
name: mobile-route-qa-screenshots
id: 10464427013
digest: sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
63 / 63 captures
21 canonical routes
3 canonical viewports
60 HTTP 200 captures
3 intentional HTTP 404 captures
0 missing screenshot files
```

The permanent candidate matrix now covers **21 routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800. All six migrated account subpages, reset-password and the canonical not-found state have explicit deterministic evidence.

Manual #781 artifact review confirms the migrated account/system surfaces remain readable without horizontal overflow or blank-card artifacts. A security-stub empty-card defect was discovered in the prior #780 artifact and fixed before #781; it is not being waived as an acceptable visual difference.

Full candidate evidence: `VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md`.

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

Remaining distance is **13 patterns** to minimum 50 and **23** to working target 60. WS-05 remains paused before Pattern #38 until the visual P1 checkpoint is live-verified at zero on merged `main`.

Deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings**.

## Production visual/product baseline

Canonical audit: `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`.  
Canonical visual direction: `MAINLAGI_ART_BIBLE.md`.

Merged-main state remains:

```text
P0 findings: 0
P1 findings: 1
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: FULLY CLOSED / BLOCKING
VUI-01 Parent Report: FULLY CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery: FULLY CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account: FULLY CLOSED / LIVE VERIFIED
VBASE-P1-01 implementation candidate: ACCEPTED ON PR #162 / LIVE CLOSURE PENDING
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

P1 state:

1. **VBASE-P1-01 — visual-token fragmentation:** **IMPLEMENTATION CANDIDATE ACCEPTED / LIVE CLOSURE PENDING**. PR #162 passed exact-head implementation CI #781 and final 63-capture artifact review, but merged `main` still counts this P1 as open until independent post-merge CI + exact Cloudflare smoke succeed.
2. **VBASE-P1-02 — parent-report density/jargon:** **CLOSED** by PR #157.
3. **VBASE-P1-03 — stage/readiness hierarchy:** **CLOSED** by PR #158.
4. **VBASE-P1-04 — public/adult root IA:** **CLOSED** by PR #160, main `415008a4...`, CI #776 including exact Cloudflare smoke.
5. **VBASE-P1-05 — permanent visual coverage gap:** **CLOSED** by PR #156; PR #162 further expands the blocking evidence matrix from 14 routes / 42 captures to 21 routes / 63 captures on the candidate head.

The final residual pass is deliberately scoped. Admin-only utility styling is not automatically a product P1. Game shell/preflight remains P2, and lower-priority discover/leaderboard/legal cleanup must not be pulled into a mass token rewrite simply to claim purity.

## Product contracts preserved

Public/auth/account convergence must continue to preserve:
- valid remembered child fast-resume through the existing child destination logic;
- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` Supabase operations, validation, recovery/callback semantics and redirects;
- signed-in/signed-out account behavior and canonical destination routes;
- optional camera framing without unsupported privacy/security claims;
- learning/mastery/evidence/progression/content/schema/database semantics.

PR #162 changes presentation only for the residual account/system surfaces. `/account/security` remains a stub; the candidate only removes a visually false empty utility card and does not invent security controls that do not exist.

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

1. Finish PR #162 candidate documentation and require a fresh exact-head full PR CI.
2. Run the clean merge gate and squash-merge exact head only if behind=0, scope/reviews/threads are clean and all checks are green.
3. Require independent `main` CI plus exact Cloudflare release smoke on the merged SHA.
4. Only after that production evidence, update canonical docs to **P0=0 / P1=0** and mark VBASE-P1-01 fully closed/live verified.
5. Then run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
6. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
7. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
8. Finish with full production end-to-end acceptance and canonical release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before this quality phase is substantially complete.