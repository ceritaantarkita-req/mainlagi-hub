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
- Pattern #37 implementation PR: **#153 — merged**
- final implementation head: `25baa6f103f4e3bb309fae8f0078c9fb099b9ab6`
- implementation exact-head CI: **#738 / run `35097844249` — success**
- implementation merge: `6a6f99ccb3a733af4e298ed8c48452e019f9980c`
- post-implementation `main` CI: **#739 / run `35098428328` — full success including exact Cloudflare production smoke**
- Pattern #37 closure PR: **#154 — merged**
- Pattern #37 final verified `main`: `b1793adaabe19a9c73e021534899f8b50c4097f6`
- Pattern #37 final CI: **#741 / run `35103399012` — full success including exact Cloudflare production smoke**
- current product task: **Production Visual / Product Baseline + P1 remediation**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

Pattern #37 is **FULLY CLOSED**. Its implementation and separate docs-only closure both passed exact-head merge discipline and independent `main` verification including exact Cloudflare production smoke.

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

No global gameplay hotspot exceeds the advisory 35% threshold. Remaining distance is **13 patterns** to minimum 50 and **23** to working target 60.

Deterministic activity-quality remains:

```text
KEEP                  900
POLISH                   0
REDESIGN                 0
REPLACE                  0
structural findings      0
```

## Pattern #37 `reading_passage_question` — FULLY CLOSED

Exact scope:

```text
bahasa-baca-lala-kucing
bahasa-baca-dodi-sepeda
bahasa-baca-nina-bunga
bahasa-baca-raka-sarapan
bahasa-baca-sari-hujan
```

Canonical content, answer order, `correctChoice`, skill `bahasa.bacaan.short_comprehension`, assessment, stars, mastery, progression, schema and migrations remain unchanged. Presentation fidelity is `choice_reading_passage_question_interaction`; runtime source is `reading-passage-question-runtime` with canonical `selectedChoice`.

Final chain:
- implementation PR #153 -> merge `6a6f99ccb3a733af4e298ed8c48452e019f9980c`;
- post-implementation CI #739 -> exact Cloudflare smoke success;
- closure PR #154 -> final `main` `b1793adaabe19a9c73e021534899f8b50c4097f6`;
- final CI #741 / run `35103399012` -> full success including exact Cloudflare production smoke.

## Production visual/product baseline

Canonical audit: `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`.  
Canonical visual direction: `MAINLAGI_ART_BIBLE.md`.

Baseline decision:

```text
P0 findings: 0
P1 findings: 5
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED until P1 remediation + permanent visual QA
```

Primary P1 findings:

1. Garden/Playroom, `LearningPlatform.module.css`, and `globals.css` currently express three different visual/token systems.
2. Parent report exposes dense internal analytics/evidence language and reads like a generic dashboard.
3. Stage/readiness layout is structurally correct but underuses tablet/desktop space and has weak progress/recommendation hierarchy.
4. Clean-session public/adult root-entry information architecture is not yet deliberate; root is primarily a child playroom/resume surface.
5. Permanent screenshot coverage does not yet represent profile select, rewards, account/auth, public clean state and loading/error/empty/degraded states.

The accepted Garden activity experience remains the child-facing anchor. Visual remediation must not alter curriculum answers, evidence, mastery or progression just to simplify UI.

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

1. Merge the production visual/product baseline docs and Art Bible from exact fully closed Pattern #37 `main`.
2. **VQA-01:** implement a permanent deterministic visual-baseline route/screenshot gate at 390x844, 768x1024 and 1280x800, with exact-pathname assertions; retain 320px for high-risk child/activity routes.
3. **VUI-01:** converge parent report to family-friendly copy/hierarchy while preserving underlying evidence semantics.
4. **VUI-02:** converge stage/gallery tablet/desktop hierarchy, readiness/progress and recommended-state emphasis without changing progression logic.
5. **VUI-03:** resolve clean-session public entry and converge auth/account/public surfaces on the Art Bible.
6. Re-run the baseline until **P0=0 / P1=0**.
7. Only then run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
8. Continue WS-05 toward 50–60 meaningful patterns with WS-08 visual QA permanently running in parallel.
9. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
10. Finish with full production end-to-end acceptance and canonical-doc/release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before this quality phase is substantially complete.