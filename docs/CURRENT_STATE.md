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
- visual baseline / Art Bible checkpoint: PR **#155** -> `d3d600ed92e78d30da8172e0bdb300119990614f`; CI **#743 / run `35105996090`** full success including exact Cloudflare smoke
- permanent visual QA: PR **#156 — FULLY CLOSED**
- VQA-01 verified `main`: `9269e9fd576004d7d91fbd840e8c752acc7a5aae`
- VQA-01 final `main` CI: **#751 / run `35110724150` — full success including exact Cloudflare release smoke**
- current product PR: **#157 — VUI-01 Parent Report convergence**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

VQA-01 is **FULLY CLOSED**. The permanent blocking browser matrix now produces 42 exact-path captures across 14 canonical product surfaces at 390x844, 768x1024 and 1280x800, with a manifest that records requested path, expected path, final path and HTTP status. The gate is upstream of final Cloudflare smoke on `main`.

The intentional not-found probe still requires exact HTTP 404 and exact pathname. Only Chromium's exact document-load `404 (Not Found)` console message is allowed on that explicit expected-404 surface; unrelated console errors still fail and all normal status-200 surfaces retain the zero-console-error contract.

VUI-01 is in exact-head acceptance on PR #157. The implementation does **not** modify `buildBatch15ParentReport`, mastery/evidence calculation, progression, readiness, schema, migrations, activity data or learning answers. It changes only the Parent Report presentation layer and its regression coverage.

Accepted VUI-01 code head before docs closure: `6a4450467b8d9bd01cd9f2bc0806100c84d187f3`. CI **#753 / run `35112741852` passed the complete PR matrix**, including permanent visual QA. The #753 artifact `10452654695` contains all 42 screenshots; manual review of Parent Report at 390/768/1280 is accepted. A cramped three-column tablet layout discovered in CI #752 evidence was fixed before this acceptance by changing 768-class layout to 2+1 cards while retaining 3 columns on wide desktop.

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

Merged-main state after VQA-01 closure and before VUI-01 merge:

```text
P0 findings: 0
P1 findings: 4
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: FULLY CLOSED / BLOCKING
VUI-01 Parent Report: exact-head accepted, merge/live verification pending
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

P1 state:

1. **VBASE-P1-01 — visual-token fragmentation:** open; closed incrementally through scoped migration waves rather than a one-shot CSS rewrite.
2. **VBASE-P1-02 — parent-report density/jargon:** VUI-01 exact-head accepted on PR #157; remains formally open until exact merge + independent `main`/Cloudflare verification.
3. **VBASE-P1-03 — stage/readiness hierarchy:** next implementation wave, VUI-02.
4. **VBASE-P1-04 — public/adult root IA:** queued with public/auth/account convergence, VUI-03.
5. **VBASE-P1-05 — permanent visual coverage gap:** **CLOSED** by PR #156, main `9269e9fd...`, CI #751.

If VUI-01 completes exact merge and independent production verification without regression, P1 count becomes **3**.

## VUI-01 Parent Report contract

Primary parent-facing report now follows this hierarchy:
- family summary for the last 7 days;
- three readable weekly indicators;
- patterns that are explicitly framed as observed learning evidence, not diagnosis;
- grouped per-subject progress and next-step recommendation;
- recent activity;
- persisted achievements.

Internal terms such as `attempt`, `assessed`, `practice`, `qualifying evidence`, `retry` and mastery diagnostics are removed from the **primary reading layer** and preserved behind per-subject diagnostic disclosure. Counts, percentages, mastery score/coverage, stage-state counts, recommendations, recent results and awards continue to come from the same report fields.

Permanent VQA now asserts that the Parent Report primary layer contains the family summary and does not leak the guarded internal terminology. Diagnostic disclosure is intentionally excluded from that copy assertion.

Responsive visual acceptance from CI #753:
- **390x844:** single-column report hierarchy readable;
- **768x1024:** 2+1 summary-card layout readable with no pathological word wrapping;
- **1280x800:** three-column summary layout readable and balanced;
- all three Parent Report captures: exact expected path and HTTP 200;
- permanent full matrix: 42/42 captures green.

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

1. Finish PR #157 from its final docs head: fresh full CI -> clean exact-scope/review/thread gate -> exact-head squash merge -> independent `main` CI + exact Cloudflare release smoke.
2. **VUI-02 Stage/Gallery:** improve tablet/desktop composition, readiness/progress hierarchy and recommended-state emphasis without changing progression logic.
3. **VUI-03 Public/Auth/Account:** resolve clean-session adult/public entry and converge generic utility surfaces on the Art Bible.
4. Close remaining visual-token fragmentation through these scoped migrations and re-run the permanent baseline until **P0=0 / P1=0**.
5. Only then run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
6. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
7. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
8. Finish with full production end-to-end acceptance and canonical release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before this quality phase is substantially complete.