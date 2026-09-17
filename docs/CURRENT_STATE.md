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
- VQA-01: **FULLY CLOSED / LIVE VERIFIED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751
- VUI-01 Parent Report: **FULLY CLOSED / LIVE VERIFIED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- VUI-02 Stage/Gallery: **FULLY CLOSED / LIVE VERIFIED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- VUI-03 Public/Auth/Account: **FULLY CLOSED / LIVE VERIFIED**, PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776
- VBASE-P1-01 residual visual-token fragmentation: **FULLY CLOSED / LIVE VERIFIED**, PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, main CI **#788 / run `35168877485`** including exact Cloudflare release smoke

## Engineering and product-quality status

No known P0 engineering blocker is open on merged `main`.

The production visual checkpoint is now live-verified at:

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: CLOSED / BLOCKING / LIVE VERIFIED
VUI-01 Parent Report: CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery: CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account: CLOSED / LIVE VERIFIED
VBASE-P1-01 residual token closure: CLOSED / LIVE VERIFIED
Whole-product P0/P1 visual checkpoint: ACCEPTED
```

PR #162 merged exact candidate docs/head into `main` as `2d3f95066e1106c43c76bf91dd29bf5707dca52c`. Independent main CI **#788 / run `35168877485`** passed Quality, Windows, Production build, dependency audit, secret scan, broad Chromium route QA and the permanent visual baseline. Production smoke also passed the exact step **“Wait for exact Cloudflare release and smoke public endpoints”**.

The permanent blocking visual matrix is now **21 canonical routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800. It covers public, child, parent, account root, all six migrated account subpages, auth including reset-password, deterministic auth error and canonical not-found.

Accepted PR-head visual evidence before merge:

```text
implementation head: 923635645c164f08e9d26cc84be0b527d0e13ae0
PR CI:              #781 / run 35137266315
artifact id:        10464427013
digest:             sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
captures:           63 / 63
routes:             21
status:             60 HTTP 200 + 3 intentional 404
missing:            0
```

Manual screenshot review remains part of acceptance. CI #780 was structurally green but exposed a real empty-card defect on the `/account/security` stub; that defect was fixed before #781. No security functionality was invented: `/account/security` remains a stub.

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

## Gameplay variation state

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

Distance remains **13 patterns** to minimum 50 and **23** to working target 60. Deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings**.

Pattern #38 is no longer blocked by the visual P1 gate. Its next step is a **fresh objective/evidence audit**; no gameplay mechanic is pre-approved.

## P2 findings still open

1. **VBASE-P2-01 — games detail/preflight legacy vocabulary.** Dark camera runtime may remain where functionally useful; surrounding entry/preflight metadata/navigation should converge separately.
2. **VBASE-P2-02 — iconography mixes canonical symbols and raw emoji.** Emoji may remain decorative/content-level; permanent semantic UI should prefer `LearningSymbol` / `Icon`.
3. **VBASE-P2-03 — inline visual styles increase drift risk.** Cleanup is technical follow-up and must not destabilize accepted behavior.

These P2 items do not reopen the completed P0/P1 visual checkpoint.

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

1. Run a fresh objective/evidence audit for **Pattern #38**; choose a mechanic only if it fits the learning objective and evidence contract.
2. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
3. Continue WS-02 narration, WS-10 external acceptance and WS-11 governance.
4. Address P2 game-shell/iconography/inline-style convergence in scoped waves; do not reopen accepted family surfaces without evidence.
5. Continue WS-12 technical cleanup later, after behavior remains stable.
6. Finish with full production end-to-end and external acceptance closure.

Do not prioritize activity-count inflation, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites ahead of these quality gates.