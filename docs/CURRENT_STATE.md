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
- Parent Report convergence: **VUI-01 FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758 / run `35115248445`
- Stage / Gallery convergence: **VUI-02 FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764 / run `35118210891`
- canonical docs through VUI-02 closure: PR #159 -> `ea32df85cab33e8510a086ae2af1a1bcadd870b3`, CI #766 including exact Cloudflare release smoke
- current product PR: **#160 — VUI-03 Public/Auth/Account convergence**
- VUI-03 accepted implementation head before docs: `96de380796cdcb16cd10f390805f4c7b62f9b83b`
- VUI-03 implementation CI: **#771 / run `35122985995` — full PR success**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

VQA-01, VUI-01 and VUI-02 are **FULLY CLOSED and live verified**. The permanent browser matrix remains blocking and produces 42 exact-path captures across 14 canonical product surfaces at 390x844, 768x1024 and 1280x800.

VUI-03 is **exact-head implementation accepted** on PR #160. It changes public/auth/account presentation and navigation-shell composition only. Known-child fast resume, Supabase operations, validation, session semantics, redirects, learning/mastery/evidence/progression, activity content and curriculum data are unchanged.

VUI-03 accepted implementation evidence:
- exact head before docs: `96de380796cdcb16cd10f390805f4c7b62f9b83b`;
- PR CI **#771 / run `35122985995` — full success** on production build, Windows compatibility, Ubuntu quality gate, dependency audit, secret scan and Chromium route/permanent visual QA;
- artifact `10458188042`, digest `sha256:c554eca3a218c659b97c07f6bfb6521b00fea7f28c6b9de18ac1a799ea3fcdbb`;
- permanent manifest: **42 / 42 captures, 14 routes x 3 viewports, zero final-path/status mismatches**;
- Cloudflare smoke is skipped on PR by design and remains required after exact-head merge.

Manual VUI-03 screenshot acceptance:
- **390x844 public root:** family value proposition, child CTA and parent CTA are visible before the lower discovery content; mobile public navigation remains usable;
- **768x1024 public root:** hero uses tablet width intentionally and preserves clear family/child/parent hierarchy;
- **1280x800 public root:** family hero uses the full desktop composition with Gavi/Paca context rather than child-playroom framing;
- **390x844 account:** signed-out family gate and settings stack cleanly; account remains clearly separate from child play;
- **768/1280 account:** settings use two-column family cards and remove the previous narrow-centered utility feel;
- **390/768/1280 login/signup/forgot/auth callback:** auth surfaces use one coherent Mainlagi family shell with restrained Garden context, readable forms/status states and no duplicate public navbar;
- `/reset-password` is also migrated to the same auth family shell/form styling, while its recovery/session behavior remains unchanged.

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

Merged-main state remains after VUI-02 closure until PR #160 is merged and independently verified:

```text
P0 findings: 0
P1 findings: 2
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: FULLY CLOSED / BLOCKING
VUI-01 Parent Report: FULLY CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery: FULLY CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account: EXACT-HEAD IMPLEMENTATION ACCEPTED
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

P1 state:

1. **VBASE-P1-01 — visual-token fragmentation:** OPEN; materially reduced again by VUI-03 through scoped public/auth/account modules, but remaining legacy/global clusters still require an evidence-backed closure pass.
2. **VBASE-P1-02 — parent-report density/jargon:** **CLOSED** by PR #157.
3. **VBASE-P1-03 — stage/readiness hierarchy:** **CLOSED** by PR #158.
4. **VBASE-P1-04 — public/adult root IA:** **EXACT-HEAD ACCEPTED** on PR #160 / CI #771; formal closure requires final docs-head CI, clean exact merge and independent `main` + Cloudflare verification.
5. **VBASE-P1-05 — permanent visual coverage gap:** **CLOSED** by PR #156.

If VUI-03 completes exact merge and independent production verification without regression, P1 count becomes **1**: residual visual-token fragmentation.

## VUI-03 Public/Auth/Account contract

Public root:
- clean session now uses the public/family AppShell rather than child `PlayroomShell`;
- valid known-child fast resume still uses the existing `readActiveChild()` + `childDestination()` path;
- primary family hero separates **Mulai untuk anak** and **Area orang tua**;
- copy states that Main Gerak camera use is optional without making unsupported privacy/security promises;
- existing subject directory remains available as discovery and still routes through child-profile preparation.

Auth:
- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` share one scoped Mainlagi family visual shell;
- auth routes own their viewport to avoid duplicate public/auth navigation shells;
- email/password/recovery/callback Supabase calls, validation, messages and redirects remain unchanged;
- auth controls use >=44px target sizing and scoped Mainlagi colors/focus states.

Account:
- `/account` no longer relies on its legacy global presentation cluster;
- signed-in/signed-out behavior and existing account destinations are unchanged;
- phone stacks settings; tablet/desktop use two readable columns and available width intentionally.

Permanent VQA additions on the existing 42-capture matrix assert:
- clean root family marker plus exactly one child CTA and one parent CTA;
- optional-camera copy remains present;
- family CTA target heights remain >=44px;
- auth family shell/context/panel markers exist;
- login/signup/forgot forms retain expected mode and >=44px controls;
- callback error state remains in the family status shell;
- account family/settings markers exist with seven settings links and readable card geometry;
- existing exact-path, status, overflow, page-error and console-error gates remain blocking.

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

1. Finish **PR #160 / VUI-03** from the final docs head: fresh full CI -> clean exact-scope/review/thread gate -> exact-head squash merge -> independent `main` CI + exact Cloudflare release smoke.
2. Close the remaining **VBASE-P1-01 visual-token fragmentation** with a targeted evidence-first cleanup; no one-shot stylesheet rewrite.
3. Re-run permanent visual acceptance until **P0=0 / P1=0**.
4. Only then run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
5. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
6. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
7. Finish with full production end-to-end acceptance and canonical release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before this quality phase is substantially complete.