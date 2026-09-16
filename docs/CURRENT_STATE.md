# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open work is called out explicitly.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: **Pattern #36 — Bahasa `sentence_order_cards`**
- current merged gameplay: **Pattern #37 — Bahasa `reading_passage_question`**
- Pattern #37 implementation PR: **#153 — MERGED**
- final implementation PR head: `25baa6f103f4e3bb309fae8f0078c9fb099b9ab6`
- final implementation PR CI: **#738 / run `35097844249` — success**
- implementation merge on `main`: `6a6f99ccb3a733af4e298ed8c48452e019f9980c`
- post-implementation `main` CI: **#739 / run `35098428328` — full success including exact Cloudflare production smoke**
- Pattern #37 status: **IMPLEMENTATION MERGED / LIVE VERIFIED; DOCS-ONLY CLOSURE IN PROGRESS**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

Pattern #37 is now part of canonical `main`. PR #153 was squash-merged from exact final head `25baa6f103f4e3bb309fae8f0078c9fb099b9ab6` to `6a6f99ccb3a733af4e298ed8c48452e019f9980c`. Exact-head PR CI #738 passed, then independent push CI #739 on the merge SHA passed the complete matrix including **Production smoke (Cloudflare)**.

Pattern #37 is not yet **FULLY CLOSED** because the separate docs-only closure chain is still required. No gameplay/code/schema change belongs in that closure.

External physical-device acceptance, accessibility-specialist review, human art/pedagogical acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

Merged `main` now has:

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

## Pattern #37 `reading_passage_question` — MERGED / LIVE VERIFIED

Exact scope:

```text
bahasa-baca-lala-kucing
bahasa-baca-dodi-sepeda
bahasa-baca-nina-bunga
bahasa-baca-raka-sarapan
bahasa-baca-sari-hujan
```

Canonical boundaries remain unchanged:
- subject `bahasa`;
- stage `bahasa-kalimat-pemahaman`;
- lesson `bahasa-bacaan-pendek`;
- pack `bahasa.pack.bacaan-pendek`;
- skill `bahasa.bacaan.short_comprehension`;
- assessed runtime remains `tap_choice`;
- exactly three canonical answer choices with unchanged order and `correctChoice`;
- content, IDs, stars, assessment, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- the existing canonical passage and literal question are separated visually without changing their text;
- the child still makes one direct canonical keyboard/touch/pointer answer choice;
- wrong choice records assessed incorrect/retry and cannot complete;
- correct choice records the canonical answer and completes the existing activity;
- assessed fidelity `choice_reading_passage_question_interaction`;
- runtime metadata source `reading-passage-question-runtime` with canonical `selectedChoice`.

Verified implementation chain:
- exact base: fully closed Pattern #36 `461b0fd59a6c238752aa858bf783716b225b548a`;
- final implementation head: `25baa6f103f4e3bb309fae8f0078c9fb099b9ab6`;
- exact-head CI: #738 / run `35097844249` — success;
- implementation PR #153 merged to `6a6f99ccb3a733af4e298ed8c48452e019f9980c`;
- independent `main` CI #739 / run `35098428328` — full success including exact Cloudflare production smoke;
- all dedicated 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- merged distribution is 900/900 classified, 37 patterns, `choice_grid` 277/900 and Bahasa `choice_grid` 29/100.

## Production visual/product audit baseline

Production verification is green, but visual/product acceptance is broader than deployment smoke or representative gameplay screenshots.

Current direction:
- Garden activity samples are visually accepted and should remain the child-facing visual anchor;
- the product still needs a systematic audit across public/home, child select/home, subject/gallery, stage/readiness, rewards, parent, account, auth, loading/error/empty states and responsive navigation;
- parent/account/public surfaces must be brought into the same family-friendly visual system rather than drifting toward a generic SaaS/dashboard feel;
- typography scale, spacing, radius, shadows, icon usage, card density, CTA hierarchy and responsive behavior need a permanent cross-surface consistency gate;
- full activity-route visual coverage must avoid false PASS caused by progression redirects.

The **production visual/product baseline audit is the next product task after Pattern #37 closure and before starting Pattern #38**. After that baseline is established, WS-08 visual QA runs in parallel with WS-05 gameplay diversification.

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

1. Finish the separate **Pattern #37 docs-only closure** from exact implementation merge `6a6f99ccb3a733af4e298ed8c48452e019f9980c`; run fresh closure-head CI, clean exact-scope/review/thread gate, exact-head merge, then final independent `main` CI + exact Cloudflare smoke.
2. Run a **production visual/product baseline audit** across public, child, parent/account/auth and system states on desktop/tablet/mobile; record P0/P1/P2 findings and a reusable visual acceptance matrix.
3. Establish/update WS-08 Art Bible + permanent visual QA rules from that audit.
4. Only then run a fresh objective/evidence audit for Pattern #38; no family is pre-approved.
5. Continue WS-05 toward 50–60 meaningful patterns while WS-08 visual QA runs in parallel.
6. Continue WS-02 narration, WS-03 public/parent frontend, WS-10 external acceptance, WS-11 governance, then WS-12 technical cleanup after product quality stabilizes.
7. Finish with full production end-to-end acceptance and canonical-doc/release closure.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion, or mastery/backend rewrites before this quality phase is substantially complete.
