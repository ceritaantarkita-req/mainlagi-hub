# WS-05 Reading Passage Question Wave — 2026-09-16

Status: **Pattern #37 IMPLEMENTATION ACCEPTED; PR #153 OPEN**  
Implementation PR: **#153**  
Base: Pattern #36 final `main` `461b0fd59a6c238752aa858bf783716b225b548a`  
Accepted code head: `6ac29623ce53940f45cdfea623340d833af68c4d`  
Accepted-head CI: **#733 / run `35096952272` — full success**

## Why this family

The fresh objective/evidence audit after fully closing Pattern #36 selected the exact Bahasa short-reading family in lesson `bahasa-bacaan-pendek`. Its canonical objective is to answer literal questions from one- or two-sentence readings. The existing prompts already contain both the reading and the question in the form `Baca: '…' …?`; separating those unchanged strings into distinct reading and question surfaces makes the objective clearer without changing what is assessed.

This is deliberately still a direct canonical answer-choice interaction. Pattern #37 does not invent a new passage, open-ended answer, extra confirmation step or unmeasured reading behavior.

## Exact scope

```text
bahasa-baca-lala-kucing
bahasa-baca-dodi-sepeda
bahasa-baca-nina-bunga
bahasa-baca-raka-sarapan
bahasa-baca-sari-hujan
```

Canonical shared boundary:
- subject `bahasa`;
- stage `bahasa-kalimat-pemahaman`;
- lesson `bahasa-bacaan-pendek`;
- pack `bahasa.pack.bacaan-pendek`;
- skill `bahasa.bacaan.short_comprehension`;
- assessment `assessed`;
- runtime `tap_choice`;
- exactly three canonical choices with unchanged order and `correctChoice`.

Explicit exclusions:
- Bahasa generic sentence meaning remains generic choice where not otherwise specialized;
- Bahasa listening remains `listen_choose`;
- Sentence Order Cards, Picture Word Match, Syllable Assembly and Initial Sound remain unchanged;
- vocabulary relations remain `visible_matching`;
- no content seed, mastery, progression, schema or migration rewrite.

## Interaction contract

`reading_passage_question` parses the existing reviewed prompt fail-closed into:
- `passage`: text already present inside the quoted `Baca:` segment;
- `question`: the existing literal question after that quoted segment.

Those strings are displayed separately, followed by the same three canonical answer buttons.

Wrong choice:
- assessed incorrect count increases;
- retry count increases;
- activity does not complete.

Correct choice:
- records the measured canonical answer choice;
- completes the existing canonical activity;
- shows the return CTA.

Accessibility/input:
- keyboard direct choice;
- touch/pointer direct choice;
- >=44px tested answer targets;
- no drag-only dependency;
- responsive QA at 320x720, 390x844 and 768x1024.

## Evidence contract

Assessed fidelity: `choice_reading_passage_question_interaction`.

Runtime metadata source: `reading-passage-question-runtime` with:
- `selectedChoice` — unchanged canonical answer.

Representative wrong-then-right browser path validates:
- `correctCount = 1`;
- `incorrectCount = 1`;
- `retryCount = 1`;
- `accuracy = 0.5`;
- wrong answer cannot complete the activity.

The mechanic does not claim an additional measured “read passage” event; the assessed evidence remains the canonical answer selection.

## QA evidence

Accepted code head:
`6ac29623ce53940f45cdfea623340d833af68c4d`

Accepted-head implementation CI:
- CI **#733** / run `35096952272` — full success;
- typecheck and lint — success;
- engine + learning regression suites — success;
- deterministic activity-quality audit — success;
- gameplay-distribution audit — success;
- simulations + Batch17 — success;
- Windows compatibility — success;
- production dependency audit + production build/budgets — success;
- secret-history scan — success;
- Chromium mobile/accessibility/browser matrix — success;
- Cloudflare production smoke is intentionally a post-merge `main` gate, not a PR-head gate.

Dedicated representative: `bahasa-baca-lala-kucing`.

Progression fixture uses legitimate completion + qualifying measured evidence for the ten required activities in immediate prior stage `bahasa-suku-kata-kata`, without seeding the target or future-stage completion.

Manual screenshot review: **9/9 accepted**.
- 320x720 idle/wrong/success;
- 390x844 idle/wrong/success;
- 768x1024 idle/wrong/success.

Observed acceptance:
- no horizontal overflow or clipping;
- passage and question are visually distinct;
- all three canonical answer labels remain visible/readable;
- wrong state is visibly distinct and does not complete;
- success state visibly confirms the canonical answer;
- feedback and success CTA remain fully visible, including 320x720;
- Garden UI character/background framing remains intact.

## Distribution/quality evidence

Accepted implementation-head gameplay-distribution:

```text
900 / 900 classified
0 unclassified
37 active candidate patterns
choice_grid                    277 / 900 = 30.78%
reading_passage_question         5 / 900 = 0.56%
Bahasa choice_grid                29 / 100 = 29.00%
```

Global advisory hotspots: none.

Deterministic activity-quality evidence remains:

```text
KEEP                  900
POLISH                   0
REDESIGN                 0
REPLACE                  0
structural findings      0
```

## Remaining implementation and closure chain

Pattern #37 is **not yet merged or FULLY CLOSED**. Required remaining gates:
1. this canonical implementation documentation becomes part of the PR head;
2. fresh exact docs-head full CI;
3. clean exact-head implementation scope/review/thread/mergeability gate with zero commits behind `main`;
4. exact-head implementation squash merge;
5. independent post-implementation `main` verification including exact Cloudflare production smoke;
6. create a separate docs-only closure branch based exactly on the implementation merge;
7. fresh exact closure-head full CI;
8. clean closure scope/review/thread/mergeability gate;
9. exact-head closure squash merge;
10. final independent `main` verification including exact Cloudflare production smoke.

Only after all gates may Pattern #37 be marked **FULLY CLOSED**. Pattern #38 objective/evidence audit must not start before that point.
