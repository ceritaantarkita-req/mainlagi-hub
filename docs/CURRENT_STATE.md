# Mainlagi Hub — Current State

Last reviewed: **17 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open PR work must not be mistaken for production closure.

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
- Public/Auth/Account convergence: **VUI-03 FULLY CLOSED**, PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776 / run `35124809180`
- VUI-03 docs/live baseline: PR #161 -> `7c863ad2b1887fe0c39557b408b743036128abe1`, CI #778 / run `35130270215`
- residual visual-token closure: **VBASE-P1-01 FULLY CLOSED / LIVE VERIFIED**, PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI **#788 / run `35168877485` including exact Cloudflare release smoke**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

The production visual checkpoint is now:

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
Pattern #38: UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT
```

PR #162 closed the final P1 without a global CSS rewrite. Scope:

- `/account/profile`, `/account/players`, `/account/preferences`, `/account/security`, `/account/delete`, `/account/about` use one scoped family account-section shell;
- canonical not-found uses a scoped Mainlagi system state instead of the legacy generic dialog / old blue-primary cluster;
- `/reset-password` and every migrated account subpage are part of permanent exact-path visual evidence;
- existing account/auth/data behavior remains unchanged;
- no learning/mastery/evidence/progression/readiness/curriculum/schema/database change.

`/account/security` remains a stub; no security feature was invented.

## Final P1 closure evidence

Accepted implementation head before candidate docs:

```text
923635645c164f08e9d26cc84be0b527d0e13ae0
```

Accepted implementation CI:

```text
#781 / run 35137266315 — full PR success
```

Accepted implementation artifact:

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

A manual #780 screenshot review found a real empty-card defect on `/account/security` despite green structural checks. The defect was fixed rather than waived; #781 and manual 390 / 768 / 1280 review verified the corrected presentation.

Final PR #162 candidate-doc head:

```text
38b9eb7920d1e6796384b889f928dfcbf4d7e629
```

Fresh exact-head PR CI:

```text
#787 / run 35138385672 — full success
```

Clean merge gate passed with behind=0, intended 17-file scope, and zero comments/reviews/review threads.

Squash merge:

```text
2d3f95066e1106c43c76bf91dd29bf5707dca52c
```

Independent merged-main verification:

```text
#788 / run 35168877485 — full success
Production smoke (Cloudflare) — success
Wait for exact Cloudflare release and smoke public endpoints — success
```

Merged-main visual artifact:

```text
id: 10476008006
digest: sha256:6fe0aa3de9bfadfc8e40229948edaca1cf633b33705a429515779b78f077266c
head SHA: 2d3f95066e1106c43c76bf91dd29bf5707dca52c
```

The live permanent matrix is therefore **21 canonical routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800.

Full closure evidence: `VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md`.

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

Remaining distance is **13 patterns** to minimum 50 and **23** to working target 60.

Pattern #38 is now **unblocked only for a fresh objective/evidence audit**. No gameplay family is pre-approved. The active merged pattern count remains 37 until a future Pattern #38 implementation independently passes its own evidence/progression, interaction, responsive, visual, CI and production gates.

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

Current visual convergence preserves:

- valid remembered child fast-resume through existing destination logic;
- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` Supabase operations, validation, recovery/callback semantics and redirects;
- signed-in/signed-out account behavior and canonical destination routes;
- optional-camera framing without unsupported privacy/security claims;
- learning/mastery/evidence/progression/content/schema/database semantics.

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

1. Run a **fresh objective/evidence audit for Pattern #38**; do not preselect a mechanic merely to increase the pattern count.
2. If the audit identifies a justified Pattern #38 candidate, implement it with exact-scope interaction, evidence/progression, keyboard/touch, responsive, visual and production gates.
3. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
4. Continue WS-02 narration and WS-10 external physical-device/accessibility/human acceptance.
5. Continue WS-11 governance.
6. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
7. Perform later WS-12 technical cleanup and final end-to-end production acceptance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.