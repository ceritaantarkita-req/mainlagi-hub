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
- production visual baseline / Art Bible checkpoint: PR **#155**, merged as `d3d600ed92e78d30da8172e0bdb300119990614f`
- baseline checkpoint CI: **#743 / run `35105996090` — full success including exact Cloudflare production smoke**
- current implementation PR: **#156 — VQA-01 permanent visual product baseline**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

Pattern #37 is **FULLY CLOSED**. The visual/product baseline and `MAINLAGI_ART_BIBLE.md` are merged and live verified on `d3d600ed92e78d30da8172e0bdb300119990614f`.

VQA-01 is in final pre-merge acceptance. Its first CI #744 correctly failed only because the intentional not-found route produces Chromium's document-level `404 (Not Found)` console message. The gate was not weakened globally: the allowance is exact and scoped only to routes whose expected status is 404. Fresh exact-head CI **#745 / run `35108485349` passed the complete PR matrix**, including the permanent visual product baseline.

The #745 artifact contains **42 / 42 exact-path captures**: 14 canonical product surfaces across 390x844, 768x1024 and 1280x800, plus a manifest recording requested path, final path, status and screenshot. Manual review confirmed the matrix is useful as the permanent shell baseline. PR #156 still requires its final docs-head CI, clean merge gate, exact-head merge and independent `main` + Cloudflare verification before VBASE-P1-05 is fully closed.

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

No global gameplay hotspot exceeds the advisory 35% threshold. Remaining distance is **13 patterns** to minimum 50 and **23** to working target 60. WS-05 is paused before Pattern #38 until the current visual P1 gate is cleared.

Deterministic activity-quality remains 900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings.

## Production visual/product baseline

Canonical audit: `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`.  
Canonical visual direction: `MAINLAGI_ART_BIBLE.md`.

Current baseline before PR #156 merges:

```text
P0 findings: 0
P1 findings: 5
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: exact-head accepted, merge/live verification pending
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

P1 state:

1. **VBASE-P1-01 — visual-token fragmentation:** open; addressed wave-by-wave rather than one-shot CSS rewrite.
2. **VBASE-P1-02 — parent-report density/jargon:** next product implementation after VQA-01 closure.
3. **VBASE-P1-03 — stage/readiness hierarchy:** queued after parent report.
4. **VBASE-P1-04 — public/adult root IA:** queued with public/auth/account convergence.
5. **VBASE-P1-05 — permanent visual coverage gap:** implementation accepted on CI #745; closes only after PR #156 exact merge + independent production verification.

Manual review of the #745 baseline confirms the existing priorities rather than inventing new blockers: parent report is the densest/most technical adult surface; stage desktop/tablet underuses space; auth/system cards are visually under-scaled on desktop. Child home, profile-select, representative Garden activity and rewards are suitable baseline references.

## VQA-01 contract

Permanent blocking coverage is added inside `Mobile route QA (Chromium)` for:
- 390x844, 768x1024 and 1280x800;
- public root, child select/home, Math subject/stage/activity, rewards, parent report, account, login, signup, forgot-password, deterministic auth error and not-found;
- expected HTTP status and **exact final pathname**;
- main landmark + H1;
- expected route boundary where applicable;
- no Next.js error overlay;
- no horizontal overflow;
- child phone touch-target floor;
- no page errors and no unexpected console errors;
- deterministic screenshots + manifest artifact.

The intentional not-found route remains required to return 404. Only Chromium's exact document-level 404 console message is permitted on that expected-404 surface; unrelated console errors still fail the gate.

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

1. Finish PR #156: fresh final docs-head CI -> clean exact-scope/review/thread gate -> exact-head squash merge -> independent `main` CI + exact Cloudflare smoke.
2. **VUI-01 Parent Report:** family-friendly hierarchy/copy while preserving every underlying metric and evidence/mastery semantic.
3. **VUI-02 Stage/Gallery:** improve tablet/desktop hierarchy, readiness/progress and recommended-state emphasis without progression changes.
4. **VUI-03 Public/Auth/Account:** resolve clean-session adult/public entry and converge generic utility surfaces on the Art Bible.
5. Re-run permanent baseline until **P0=0 / P1=0**.
6. Only then run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
7. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
8. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
9. Finish with full production end-to-end acceptance and canonical release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before this quality phase is substantially complete.