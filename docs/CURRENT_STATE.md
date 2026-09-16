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
- Stage / Gallery convergence: **VUI-02 FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`
- VUI-02 final `main` CI: **#764 / run `35118210891` — full success including exact Cloudflare release smoke**
- next product wave: **VUI-03 Public/Auth/Account convergence**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

VQA-01, VUI-01 and VUI-02 are **FULLY CLOSED and live verified**. The permanent browser matrix remains blocking and produces 42 exact-path captures across 14 canonical product surfaces at 390x844, 768x1024 and 1280x800.

VUI-02 closed the stage/readiness hierarchy defect without changing readiness calculation, stage gates, prerequisites, mastery, lesson/activity ordering semantics, activity content, recommendation source or completion requirements.

Closure evidence:
- PR #158 final exact head: `cba874f0b43904999c1ca905137fb092076b9334`;
- final PR CI **#763 / run `35117490284` — full success**, including permanent visual baseline;
- squash merge `main`: `fe260ba7a239586ca2362fbabfca3e0a5019d453`;
- independent `main` CI **#764 / run `35118210891` — full success**;
- exact Cloudflare step **“Wait for exact Cloudflare release and smoke public endpoints” — success**.

VUI-02 implementation evidence remains artifact `10455798162`, digest `sha256:41ee08ebb674a7f2ccebd6d7498c6f60e2c4032618dd268c3db2290686eed012`, with 42 canonical screenshots. Final docs-head PR CI #763 also produced artifact `10455910819`, digest `sha256:53de9bb689fb55ee2f4f52333f2a98f93325b2ee6c5a7cbfac18c45703fca9da`.

Manual acceptance remains:
- **390x844 subject:** phone stage journey intentionally remains a compact horizontal carousel with the next stage peeking into view as a scroll affordance;
- **768x1024 subject:** all six Math stages are readable in a two-column journey grid with no internal horizontal scrolling;
- **1280x800 subject:** stages use available width as a responsive grid;
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

Merged-main state after VUI-02 closure:

```text
P0 findings: 0
P1 findings: 2
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: FULLY CLOSED / BLOCKING
VUI-01 Parent Report: FULLY CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery: FULLY CLOSED / LIVE VERIFIED
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

P1 state:

1. **VBASE-P1-01 — visual-token fragmentation:** OPEN; reduced wave-by-wave rather than via a one-shot stylesheet rewrite. VUI-03 is expected to remove another major legacy/global styling cluster but closure still requires evidence.
2. **VBASE-P1-02 — parent-report density/jargon:** **CLOSED** by PR #157, main `e212002e...`, CI #758 including exact Cloudflare smoke.
3. **VBASE-P1-03 — stage/readiness hierarchy:** **CLOSED** by PR #158, main `fe260ba7...`, CI #764 including exact Cloudflare smoke.
4. **VBASE-P1-04 — public/adult root IA:** OPEN; next product wave VUI-03 Public/Auth/Account.
5. **VBASE-P1-05 — permanent visual coverage gap:** **CLOSED** by PR #156, main `9269e9fd...`, CI #751.

## VUI-03 pre-implementation audit

The next wave is based on exact source and final VUI-02 screenshots, not a generic redesign request.

Confirmed baseline:
- `/` preserves known-child fast resume through `readActiveChild()` + `router.replace(childDestination(id))`, but a clean session renders `HomePage` inside `PlayroomShell`, so the public root still reads primarily as child play mode rather than an adult/family entry;
- clean-session root copy is child-first (`Main, belajar, temukan hal baru`, `Mulai bermain`) and does not yet explain the parent path, account role or camera/data expectations at the first decision point;
- `/login`, `/signup` and `/forgot-password` all reuse the correct `AuthForm` behavior but are presented as a generic `center-page` + `dialog-card`, with legacy global auth styling and substantial unused desktop canvas;
- `/auth/callback` uses the same generic dialog presentation even though its state/error behavior is correct;
- `/account` is already materially closer to the Mainlagi family language than auth and should receive targeted polish/regression rather than a full rewrite;
- auth/account security semantics and Supabase flows are **not** the defect and must remain unchanged.

VUI-03 intended scope:
- explicit clean-session public/family entry while preserving known-child fast resume;
- separate and obvious child-start vs parent/account actions;
- shared scoped family shell for login/signup/forgot/callback without changing auth operations;
- targeted account convergence only where evidence shows drift;
- permanent 390/768/1280 assertions for the new public/auth contract.

## VUI-02 Stage / Gallery contract

Stage presentation:
- stage identity + readiness are one Garden-aligned hero;
- readiness uses existing status and `completedCount / requiredCount` values;
- lessons are explicit panels with lesson objective and existing done counts;
- lesson activity layout uses content-aware `auto-fit` columns so one to three activities use available tablet/desktop width;
- the same adaptive `recommendedId` receives visual emphasis without reordering activities;
- optional motion remains explicitly separate and optional.

Subject journey presentation:
- the same stage items, statuses and links remain canonical;
- phone keeps compact horizontal journey behavior;
- tablet/desktop use a responsive grid so stage cards do not remain partially clipped behind an internal horizontal scroller.

Permanent VQA additionally asserts on canonical Math routes that tablet/desktop journey has no internal horizontal scrolling, journey cards retain readable width, stage readiness is present, exactly one canonical recommendation remains visually marked, and the lesson grid has no internal overflow.

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

1. **VUI-03 Public/Auth/Account:** resolve clean-session adult/public entry, converge generic auth utility surfaces on the Art Bible and preserve known-child fast resume + existing auth semantics.
2. Close residual visual-token fragmentation with evidence; re-run permanent baseline until **P0=0 / P1=0**.
3. Only then run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
4. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
5. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
6. Finish with full production end-to-end acceptance and canonical release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before this quality phase is substantially complete.