# Mainlagi Hub — Current State

Last reviewed: **18 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open closure work must not be mistaken for final closure truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay pattern: **Pattern #42 — Science `growth_stage_transition`**
- Pattern #42 implementation: PR #187 -> main `37190f5dabd5d8421d7575b8f220d2824e831f23`
- Pattern #42 implementation merged-main CI: **#884 / run `35260402125` — full success including exact Cloudflare production smoke**
- Pattern #42 closure: PR #188 -> main `ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710`
- Pattern #42 closure merged-main CI: **#886 / run `35290502532` — full success including exact Cloudflare production smoke**
- permanent visual QA foundation: **VQA-01 FULLY CLOSED**
- visual P1 baseline: **P0=0 / P1=0 / P2=3**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Permanent visual QA: 21 canonical routes / 63 captures / BLOCKING
Pattern #38: FULLY CLOSED
Pattern #39: FULLY CLOSED
Pattern #40: FULLY CLOSED
Pattern #41: FULLY CLOSED / LIVE VERIFIED
Pattern #42: FULLY CLOSED / LIVE VERIFIED
```

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Current WS-05 finish target: **50 meaningful patterns**. The former 60-pattern working target is non-blocking/deferred and is not part of the current finish scope.

Verified merged-main distribution after Pattern #42 implementation:

```text
classified:                    900 / 900
unclassified:                    0
active merged patterns:         42
choice_grid                    254 / 900
growth_stage_transition          3 / 900
phrase_scene_match               4 / 900
spatial_relation_board           6 / 900
visual_word_problem              5 / 900
cloze_sentence_choice            5 / 900
reading_passage_question         5 / 900
sentence_order_cards             5 / 900
picture_word_match               5 / 900
```

Remaining distance is **8 patterns** to the WS-05 finish target of 50. Pattern #43 audit PR #190 is merged/live-verified; implementation PR #191 is in progress, while merged gameplay truth remains 42 until implementation is verified.

## Pattern #42 — FULLY CLOSED / LIVE VERIFIED

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

Verification chain:

```text
Audit PR:                 #186
Audit main:               541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:            #871 / run 35255083348 — full success + exact Cloudflare smoke
Implementation PR:        #187
Verified code checkpoint: 0ded3a43e49654a34e5a35aaffb7edf8c9fa4469
Code checkpoint CI:       #878 / run 35256885341 — full success
Final PR head:            bc115708c83c1f4829901455d4a5d39d7ea3261c
Final PR CI:              #883 / run 35259699934 — full success
Implementation main:      37190f5dabd5d8421d7575b8f220d2824e831f23
Implementation main CI:   #884 / run 35260402125 — full success + exact Cloudflare production smoke
Closure PR:               #188
Closure head:             ee2f57c7fdd89e393cc4fb8dcbb22c2bdb28b885
Closure PR CI:            #885 / run 35261277441 — full success
Closure main:             ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710
Closure main CI:          #886 / run 35290502532 — full success + exact Cloudflare production smoke
```

Merged behavior preserves canonical prompts/choices/answers and `choice_accuracy_v1`, uses exact three-ID fail-closed config, hides the target until correct completion, records measured wrong/retry evidence, supports keyboard/pointer/touch, and introduces no mastery/progression/schema/database migration.

Manual review of all nine dedicated Pattern #42 screenshots remains accepted with no P0/P1 Pattern #42 visual blocker. Merged-main permanent visual QA also passed.

Merged-main CI #884 artifacts:

```text
mobile-route screenshots: 10514976832
sha256:ce7f6fc566952f8d20261eda8eb6c86c7fe6a2f0464f4c4fe72658d128451f4d

gameplay distribution:    10514382620
sha256:12212009d77256bb32b08a32de3a8e1dc4067c3899d7d410c8651f5bc2687b4f

activity quality:          10513967944
sha256:aa38d751cfdb5f24268c818dcf79a84d6d2fc30a2117bf8900df3f52ea3a6cc6
```

Explicit exclusions remain `science-cycle-butterfly`, `science-match-young-adult-b`, existing `cause_effect`, `relative_order_track`, sequence and unrelated Science families.

Closure evidence: `PATTERN42_GROWTH_STAGE_TRANSITION_CLOSURE_2026-09-18.md`.

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

1. Pattern #43 audit selected `single_rule_apply` for exactly five Logic Wave C conditional-rule activities; implementation has not started.
2. Verify/merge the audit PR, then implement only that exact scope from the resulting verified `main`.
3. Preserve mastery/progression/evidence boundaries and permanent WS-08 visual QA.
4. Continue WS-05 toward minimum 50 without adding unproven families.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
