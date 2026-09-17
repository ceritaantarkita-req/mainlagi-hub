# Mainlagi Hub — Current State

Last reviewed: **18 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open implementation work must not be mistaken for merged production truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay pattern: **Pattern #41 — English `phrase_scene_match`**
- Pattern #41 final truth reconciliation: PR #185 -> main `e20b50431d907f9ca6f3ef254b7c69aa24a132a5`
- Pattern #41 final truth merged-main CI: **#869 / run `35241959755` — full success including exact Cloudflare production smoke**
- Pattern #42 objective/evidence audit: PR #186 -> main `541c2348507e976fb723c9c6e5b8f1b242cff490`
- Pattern #42 audit merged-main CI: **#871 / run `35255083348` — full success including exact Cloudflare production smoke**
- Pattern #42 implementation: **PR #187 — implementation code verified / final docs-head gate pending / NOT MERGED**
- Pattern #42 verified implementation-code checkpoint: `0ded3a43e49654a34e5a35aaffb7edf8c9fa4469`
- Pattern #42 code-checkpoint CI: **#878 / run `35256885341` — full success**
- permanent visual QA foundation: **VQA-01 FULLY CLOSED**
- visual P1 baseline: **P0=0 / P1=0 / P2=3**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Permanent visual QA: 21 canonical routes / 63 captures / BLOCKING
VUI-01 Parent Report: FULLY CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery: FULLY CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account: FULLY CLOSED / LIVE VERIFIED
VBASE-P1-01 residual token fragmentation: FULLY CLOSED / LIVE VERIFIED
Pattern #38: FULLY CLOSED
Pattern #39: FULLY CLOSED
Pattern #40: FULLY CLOSED
Pattern #41: FULLY CLOSED / LIVE VERIFIED
Pattern #42: AUDIT MERGED + LIVE VERIFIED / IMPLEMENTATION CODE VERIFIED / NOT MERGED
```

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

Verified merged-main distribution remains:

```text
classified:                    900 / 900
unclassified:                    0
active merged patterns:         41
choice_grid                    257 / 900
phrase_scene_match               4 / 900
spatial_relation_board           6 / 900
visual_word_problem              5 / 900
cloze_sentence_choice            5 / 900
reading_passage_question         5 / 900
sentence_order_cards             5 / 900
picture_word_match               5 / 900
```

Pattern #42 implementation-code checkpoint `0ded3a43...` independently verified the intended branch distribution:

```text
classified:                    900 / 900
unclassified:                    0
active implementation patterns: 42
choice_grid                    254 / 900
growth_stage_transition          3 / 900
```

These 42-pattern numbers are **verified implementation evidence, not merged production truth** until PR #187 merges and resulting `main` passes independent CI + exact Cloudflare smoke.

## Pattern #42 — implementation code verified, not merged

Pattern:

```text
growth_stage_transition
```

Exact scope:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Canonical ownership:

```text
subject:     science
stage:       science-life-material-motion
lesson:      science-life-cycles
pack:        science.pack.life-cycles
skill:       science.life_cycles.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Verification chain so far:

```text
Audit PR:                 #186
Audit main:               541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:            #871 / run 35255083348 — full success + exact Cloudflare smoke
Implementation PR:        #187
Verified code checkpoint: 0ded3a43e49654a34e5a35aaffb7edf8c9fa4469
Code checkpoint CI:       #878 / run 35256885341 — full success
```

The verified implementation includes exact three-ID fail-closed config, deterministic `previous_stage` / `next_adult_stage` / `next_young_stage` boards, hidden target until correct completion, unchanged canonical prompt/choices/answers, measured retry/accuracy semantics, exact authoring/manifest/evidence regression, blocking 42-pattern distribution, and permanent browser wiring.

Browser evidence at 320x720, 390x844 and 768x1024 covers idle/wrong/success, keyboard wrong-answer handling, pointer completion, actual touch `tap()` completion at 390x844, measured attempt evidence, zero horizontal overflow and permanent visual QA.

Manual review of all nine Pattern #42 screenshots is **ACCEPTED**: no P0/P1 Pattern #42 visual blocker; idle/wrong do not reveal the target; success reveals the correct target only after completion; feedback/CTA remain readable. The 768px Garden mascot remains decorative and does not obscure controls.

Artifacts for CI #878:

```text
mobile-route screenshots: 10513557620
sha256:de116a80764e2b87716cc377e807aabbd4e3c9107961306039d6e480d1cbb5bd

gameplay distribution:    10513402146
sha256:f20941e33f33cd0a9bca8e519b0137536f6eb66a745bda156697c16230fb8943

activity quality:          10513197363
sha256:cd85e039cdd632e081b1b0cd3ad42d610c3de0d64fbe9be6be67f2539b1b7244
```

Explicit exclusions remain `science-cycle-butterfly`, `science-match-young-adult-b`, existing `cause_effect`, `relative_order_track`, sequence and unrelated Science families. No mastery/progression/schema/database migration is part of Pattern #42.

This docs-only truth refresh advances PR #187 beyond checkpoint `0ded3a43...`; therefore the new final PR head must still pass full CI before merge.

Full audit: `PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`.  
Implementation wave: `WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md`.

## P1/P2 state

All baseline P1 findings are closed and live verified. Remaining visual backlog is P2:

- VBASE-P2-01 game detail/preflight legacy vocabulary;
- VBASE-P2-02 semantic iconography drift;
- VBASE-P2-03 inline visual-style drift risk.

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

1. Run full CI on the final docs-only head of Pattern #42 PR #187.
2. Re-check exact-head mergeability, reviews/comments and unresolved review threads.
3. Merge only the clean exact verified final head.
4. Independently verify resulting `main`, including exact Cloudflare production smoke.
5. Record post-merge Pattern #42 closure truth before calling it fully closed.
6. Only after closure begin a fresh Pattern #43 objective/evidence audit; no candidate is pre-approved.
7. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA, plus WS-02 narration, WS-10 external evidence, WS-11 governance and later P2/WS-12 cleanup.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
