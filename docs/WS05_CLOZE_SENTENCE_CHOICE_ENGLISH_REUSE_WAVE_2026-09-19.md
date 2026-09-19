# WS-05 English Cloze Sentence Choice Reuse Wave — 19 September 2026

Status: **IMPLEMENTATION ACCEPTED / EXACT 5-ID ENGLISH REUSE / PR #219 / FINAL DOCS CI PENDING / PATTERN COUNT STAYS 47**

## Verified base

```text
base main:                     218c93dcda5fca28e02554ce8379f8f99b590e93
Math measurement reuse:       FULLY CLOSED / LIVE VERIFIED
Math measurement main:        365070772554d3f00ff7b8124e9f71e97b5252a6
Math measurement main CI:     #995 / run 35425340216 — full success + exact Cloudflare smoke
English reuse audit:          PR #211 -> main 76e1eeb0 / main CI #975 live verified
base merged distribution:     47 active / choice_grid 219 / cloze_sentence_choice 5
```

## Exact implementation scope

```text
english-complete-cat-sleeps
english-complete-bird-flies
english-complete-i-read
english-complete-two-apples
english-complete-mother-family
```

Existing Bahasa scope remains exactly:

```text
bahasa-lengkap-ayah-minum
bahasa-lengkap-burung-terbang
bahasa-lengkap-kucing-tidur
bahasa-lengkap-ibu-pasar
bahasa-lengkap-rina-payung
```

No Pattern #48 is created.

## Implementation contract

The existing Pattern #38 `cloze_sentence_choice` is generalized through an exact canonical 10-ID config.

Every approved activity validates:
- exact activity ID;
- exact subject;
- exact stage;
- `tap_choice` runtime;
- exact canonical prompt;
- exactly three canonical choices in exact order;
- exact canonical correct answer;
- one parseable non-empty `___` slot;
- exact locale.

Any subject/stage/prompt/choice-order/correct-answer/runtime drift fails closed.

## Subject-aware presentation

Bahasa remains:
- `id-ID`;
- existing Indonesian heading, instruction, ARIA labels, feedback and CTA.

English uses:
- `en-US`;
- “Complete the sentence”;
- reviewed English instruction, ARIA labels, feedback and success CTA.

The canonical activity prompt, choices and answers are not rewritten.

## Preserved evidence

All five English activities remain:
- subject `english`;
- stage `english-phrases-review`;
- lesson `english-sentence-completion`;
- pack `english.pack.sentence-completion`;
- skill `english.sentence.completion`;
- assessed `tap_choice`;
- evidence `choice_accuracy_v1`.

Runtime metadata remains:
- `source: cloze-sentence-choice-runtime`;
- `evidenceFidelity: choice_cloze_sentence_interaction`;
- `selectedChoice`.

No mastery/progression/schema/database migration or activity-count change is included.

## Browser QA

Legacy Bahasa QA remains wired:

```text
scripts/run-cloze-sentence-choice-browser-tests.mjs
```

New English reuse QA:

```text
scripts/run-cloze-sentence-choice-english-reuse-browser-tests.mjs
representative route: /child/demo-gian/activity/english-complete-cat-sleeps
viewports:
- 320x720
- 390x844
- 768x1024
```

It verifies:
- legitimate English progression readiness;
- English locale/copy and ARIA labels;
- exact canonical sentence and choice order;
- keyboard wrong/retry;
- pointer correct completion;
- real Playwright touchscreen correct completion;
- assessed evidence with incorrect=1 / retry=1 / accuracy=0.5;
- >=44px touch targets;
- no horizontal overflow;
- feedback and success CTA visibility;
- no page/console errors;
- idle / wrong / success screenshots at all three viewports.

## Accepted code checkpoint

```text
PR:                         #219
code checkpoint head:       a054b76b1e13cba03a255b9c60f0bd43deb9051f
CI:                         #1003 / run 35430916587 — full success
manual visual review:       ACCEPTED / 9 screenshots / P0=0 / P1=0
activity quality:           KEEP 900 / 0 flagged
activities classified:      900 / 900
unclassified:               0
active patterns:            47
choice_grid:                214
cloze_sentence_choice:      10
```

CI #1003 passed:
- Production build;
- Quality gate (Ubuntu);
- Windows compatibility;
- Production dependency audit;
- Secret history scan;
- Mobile route QA (Chromium).

PR-head Cloudflare smoke is intentionally skipped by workflow policy; exact production smoke is required after merge to `main`.

## Artifacts

```text
mobile-route-qa-screenshots:
  artifact 10580398187
  sha256:d3b380376970fffb9c66fac904a076e644599f21d6f8e04529659f9a8934296e

gameplay-distribution-audit:
  artifact 10580617590
  sha256:6491e2aa4522b53eec7f018e69130cd48b002c461daf260b1294dc56888ec60a

activity-quality-audit:
  artifact 10580677555
  sha256:3054c5b04a29f7d6021e9c0e9535722fb1f527752e2d2d054be9bebf1b2c9d8d
```

Manual review covered the nine dedicated English screenshots:
- 320 idle / try / success;
- 390 idle / try / success;
- 768 idle / try / success.

No P0/P1 visual blocker was found.

## Verified branch distribution

```text
activities:                    900
classified:                    900
unclassified:                    0
active patterns:                47
choice_grid                    214
cloze_sentence_choice           10
spatial_relation_board          11
set_reasoning                   10
compare_properties               7
healthy_habit_routine            4
```

English subject distribution now contains:
- `choice_grid` 35;
- `listen_choose` 27;
- `visible_matching` 25;
- `cloze_sentence_choice` 5;
- `phrase_scene_match` 4;
- `symbol_hunt` 4.

## Final merge gate

Before merge:
1. final docs/checkpoint commit receives exact-head CI full success;
2. PR remains mergeable with no unresolved review threads;
3. distribution remains 900/900 / 47 active / choice_grid 214 / cloze 10;
4. activity quality remains KEEP 900 / 0 flagged;
5. legacy Bahasa + new English cloze regressions remain green;
6. permanent visual QA remains green;
7. merge exact final head only.

After merge:
- require merged-main CI + exact-SHA Cloudflare production smoke;
- add closure/live-verification docs;
- only then advance Science environment-care reuse to runtime implementation.
