# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

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
- permanent visual QA: **VQA-01 FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 / run `35110724150` including exact Cloudflare release smoke
- Parent Report convergence: **VUI-01 FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`
- VUI-01 final `main` CI: **#758 / run `35115248445` — full success including exact Cloudflare release smoke**
- current product PR: **#158 — VUI-02 Stage / Gallery convergence**
- VUI-02 accepted implementation head before docs: `7e85721bf42a1b31605bc87cd58594a8bbc55bd7`
- VUI-02 code-head CI: **#759 / run `35116294362` — full PR success**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

VQA-01 and VUI-01 are **FULLY CLOSED and live verified**. The permanent browser matrix remains blocking and produces 42 exact-path captures across 14 canonical product surfaces at 390x844, 768x1024 and 1280x800. Parent Report presentation is now family-facing while preserving its original report/mastery/evidence semantics.

VUI-02 is **exact-head implementation accepted** on PR #158. It changes Stage / Subject presentation only: readiness calculation, stage gates, prerequisites, mastery, lesson/activity ordering semantics, activity content and completion requirements remain sourced from the existing learning system.

CI #759 passed production build, Windows compatibility, Ubuntu quality gate, secret scan, dependency audit and Chromium route QA including the permanent visual baseline and new geometry assertions. Artifact `10455798162`, digest `sha256:41ee08ebb674a7f2ccebd6d7498c6f60e2c4032618dd268c3db2290686eed012`, contains the 42 canonical screenshots.

Manual review accepted the canonical VUI-02 surfaces:
- **390x844 subject:** phone stage journey intentionally remains a compact horizontal carousel with the next stage peeking into view as a scroll affordance; no page overflow or CTA regression;
- **768x1024 subject:** all six Math stages are readable in a two-column journey grid with no internal horizontal scrolling;
- **1280x800 subject:** stages use the available width as a responsive grid instead of clipped horizontal cards;
- **390x844 stage:** hero/readiness stack cleanly and lesson activity cards remain readable in one column;
- **768x1024 stage:** stage/readiness hierarchy is explicit and the two canonical lesson activities expand evenly across available width;
- **1280x800 stage:** hero becomes an intentional two-column composition and the two lesson cards fill the lesson canvas instead of leaving a large empty right region.

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

Merged-main state after VUI-01 closure:

```text
P0 findings: 0
P1 findings: 3
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: FULLY CLOSED / BLOCKING
VUI-01 Parent Report: FULLY CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery: exact-head accepted, merge/live verification pending
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

P1 state:

1. **VBASE-P1-01 — visual-token fragmentation:** OPEN; reduced wave-by-wave rather than via a one-shot stylesheet rewrite.
2. **VBASE-P1-02 — parent-report density/jargon:** **CLOSED** by PR #157, main `e212002e...`, CI #758 including exact Cloudflare smoke.
3. **VBASE-P1-03 — stage/readiness hierarchy:** VUI-02 implementation accepted on PR #158 / CI #759; remains formally open until final docs-head CI + exact merge + independent `main`/Cloudflare verification.
4. **VBASE-P1-04 — public/adult root IA:** OPEN; next product wave VUI-03 Public/Auth/Account.
5. **VBASE-P1-05 — permanent visual coverage gap:** **CLOSED** by PR #156, main `9269e9fd...`, CI #751.

If VUI-02 completes exact merge and independent production verification without regression, P1 count becomes **2**: token fragmentation and public/adult entry IA.

## VUI-02 Stage / Gallery contract

VUI-02 addresses the specific baseline defect rather than rewriting the learning path.

Stage presentation:
- stage identity + readiness become one Garden-aligned hero;
- readiness uses the existing status and `completedCount / requiredCount` values;
- lessons become explicit panels with lesson objective and existing done counts;
- lesson activity layout uses content-aware `auto-fit` columns so one to three activities use available tablet/desktop width instead of inheriting a fixed global 3/4-column grid;
- the same existing adaptive `recommendedId` receives visual emphasis without reordering activities;
- optional motion remains explicitly separate and optional.

Subject journey presentation:
- the same stage items, statuses and links remain canonical;
- phone keeps the compact horizontal journey behavior;
- tablet/desktop use a responsive grid so stage cards do not remain partially clipped behind an internal horizontal scroller.

Permanent VQA now additionally asserts on the canonical Math routes that:
- tablet/desktop journey does not require internal horizontal scrolling;
- journey cards retain readable width;
- stage readiness summary is present;
- exactly one canonical recommended stage activity remains visually marked;
- the canonical lesson grid has no internal overflow and its cards use a minimum readable width appropriate to tablet/desktop.

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

1. Finish **PR #158 / VUI-02** from its final docs head: fresh full CI -> clean exact-scope/review/thread gate -> exact-head squash merge -> independent `main` CI + exact Cloudflare release smoke.
2. **VUI-03 Public/Auth/Account:** resolve clean-session adult/public entry and converge generic utility surfaces on the Art Bible while preserving known-child fast resume.
3. Close residual visual-token fragmentation through these scoped migrations and targeted cleanup; re-run permanent baseline until **P0=0 / P1=0**.
4. Only then run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
5. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
6. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
7. Finish with full production end-to-end acceptance and canonical release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before this quality phase is substantially complete.