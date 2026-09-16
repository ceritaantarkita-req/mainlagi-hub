# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open implementation work is called out explicitly.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: **Pattern #36 — Bahasa `sentence_order_cards`**
- Pattern #36 implementation PR: **#151**
- Pattern #36 closure PR: **#152**
- Pattern #36 final verified `main`: `461b0fd59a6c238752aa858bf783716b225b548a`
- Pattern #36 final CI: **#732 / run `35094107947`**, full success including exact Cloudflare production smoke
- current implementation candidate: **Pattern #37 — Bahasa `reading_passage_question`**
- Pattern #37 implementation PR: **#153**
- Pattern #37 accepted code head: `6ac29623ce53940f45cdfea623340d833af68c4d`
- Pattern #37 accepted-head CI: **#733 / run `35096952272`**, full success
- Pattern #37 status: **IMPLEMENTATION ACCEPTED; DOCS + FRESH EXACT-HEAD CI / MERGE GATES PENDING**

## Engineering status

No known P0 engineering blocker is open on merged `main`. Pattern #36 is fully closed on exact final `main` `461b0fd59a6c238752aa858bf783716b225b548a`; CI #732 passed the complete matrix including exact **Production smoke (Cloudflare)**.

Pattern #37 is still an open PR and is not part of canonical `main` yet. Its accepted implementation head `6ac29623ce53940f45cdfea623340d833af68c4d` passed CI #733 including typecheck, lint, engine/learning tests, deterministic quality and gameplay-distribution audits, simulations, production build/budgets, dependency audit, secret-history scan, Windows compatibility and Chromium mobile/accessibility/browser QA. All nine dedicated 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual review.

External physical-device acceptance, accessibility-specialist review, human art/pedagogical acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Verified merged on `main`: 36 patterns

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    36
choice_grid               282 / 900 = 31.33%
sentence_order_cards        5 / 900 = 0.56%
picture_word_match          5 / 900 = 0.56%
Bahasa choice_grid          34 / 100
```

### Pattern #37 accepted implementation-head audit: 37 patterns

```text
classified:                    900 / 900
unclassified:                    0
active candidate patterns:      37
choice_grid                    277 / 900 = 30.78%
reading_passage_question        5 / 900 = 0.56%
sentence_order_cards             5 / 900 = 0.56%
picture_word_match               5 / 900 = 0.56%
Bahasa choice_grid               29 / 100
```

No global gameplay hotspot exceeds the advisory 35% threshold. If Pattern #37 is merged without scope changes, remaining distance becomes **13** patterns to minimum 50 and **23** to working target 60.

## Pattern #37 `reading_passage_question` — IMPLEMENTATION ACCEPTED / PR #153 OPEN

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
- lesson objective remains literal comprehension of one- or two-sentence short readings;
- content, IDs, stars, assessment, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- the existing canonical `Baca: '…' …?` prompt is parsed fail-closed into the same passage text and same literal question text;
- passage and question are rendered as separate visual reading surfaces;
- the child still makes one direct canonical keyboard/touch/pointer answer choice;
- no invented passage, changed answer payload, extra confirmation or intermediate assessment;
- wrong choice records assessed incorrect/retry and cannot complete;
- correct choice records the canonical answer and completes the existing activity;
- assessed fidelity `choice_reading_passage_question_interaction`;
- runtime metadata source `reading-passage-question-runtime` with canonical `selectedChoice`.

Accepted implementation evidence:
- branch started exactly from fully closed Pattern #36 final `main` `461b0fd59a6c238752aa858bf783716b225b548a`;
- accepted code head `6ac29623ce53940f45cdfea623340d833af68c4d` passed full CI #733 / run `35096952272`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual review;
- browser QA validates legitimate prior-stage readiness, canonical passage/question/answer text, keyboard wrong-state, pointer completion, >=44px answer targets, no horizontal overflow, visible feedback/CTA and measured evidence;
- accepted-head gameplay audit is 900/900 classified with 37 candidate patterns, `choice_grid` 277/900 (30.78%), `reading_passage_question` 5/900 (0.56%), Bahasa `choice_grid` 29/100 and no global hotspot;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #37 is **not merged and not fully closed**. Required next gates: finish canonical implementation docs, run a fresh exact docs-head PR CI, pass clean exact-head scope/review/thread/mergeability checks, squash merge implementation, independently verify `main` including exact Cloudflare smoke, then run the separate docs-only closure chain.

## Pattern #36 `sentence_order_cards` — FULLY CLOSED

Implementation PR #151 and closure PR #152 are complete. Final verified `main` is `461b0fd59a6c238752aa858bf783716b225b548a`; final CI #732 / run `35094107947` passed the complete matrix including exact Cloudflare production smoke.

Exact scope remains:

```text
bahasa-urut-ibu-memasak
bahasa-urut-adi-berlari
bahasa-urut-kucing-tidur
bahasa-urut-siti-membaca
bahasa-urut-burung-terbang
```

Its canonical `tap_choice` answers, `bahasa.kalimat.order` evidence, mastery/progression and content remain unchanged; presentation fidelity is `choice_sentence_order_cards_interaction`.

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

1. Finish Pattern #37 implementation PR #153: canonical docs -> fresh exact-head full CI -> clean scope/review/thread/mergeability gate -> exact-head squash merge.
2. Independently verify Pattern #37 implementation on `main`, including exact Cloudflare production smoke; then run the required separate docs-only closure PR and final `main` verification.
3. Only after Pattern #37 is **FULLY CLOSED**, run a fresh objective/evidence audit for Pattern #38; no family is pre-approved.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns, plus Art Bible, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
