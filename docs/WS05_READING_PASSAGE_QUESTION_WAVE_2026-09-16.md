# WS-05 Reading Passage Question Wave — 2026-09-16

Status: **Pattern #37 IMPLEMENTATION MERGED / LIVE VERIFIED; DOCS-ONLY CLOSURE IN PROGRESS**  
Implementation PR: **#153 — merged**  
Base: Pattern #36 final `main` `461b0fd59a6c238752aa858bf783716b225b548a`  
Final implementation head: `25baa6f103f4e3bb309fae8f0078c9fb099b9ab6`  
Exact-head implementation CI: **#738 / run `35097844249` — success**  
Implementation merge: `6a6f99ccb3a733af4e298ed8c48452e019f9980c`  
Post-merge `main` CI: **#739 / run `35098428328` — full success including exact Cloudflare production smoke**

## Why this family

The fresh objective/evidence audit after fully closing Pattern #36 selected the exact Bahasa short-reading family in lesson `bahasa-bacaan-pendek`. Its canonical objective is to answer literal questions from one- or two-sentence readings. The existing prompts already contain both the reading and the question in the form `Baca: '…' …?`; separating those unchanged strings into distinct reading and question surfaces makes the objective clearer without changing what is assessed.

This remains a direct canonical answer-choice interaction. Pattern #37 does not invent a new passage, open-ended answer, extra confirmation step or unmeasured reading behavior.

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

## Implementation QA evidence

Final implementation head:
`25baa6f103f4e3bb309fae8f0078c9fb099b9ab6`

Exact-head implementation CI:
- CI **#738** / run `35097844249` — success;
- typecheck and lint — success;
- engine + learning regression suites — success;
- deterministic activity-quality audit — success;
- gameplay-distribution audit — success;
- simulations + Batch17 — success;
- Windows compatibility — success;
- production dependency audit + production build/budgets — success;
- secret-history scan — success;
- Chromium mobile/accessibility/browser matrix — success;
- PR Cloudflare production smoke skipped by design because exact production verification is a post-merge `main` gate.

Implementation PR #153 was squash-merged exactly from that head to:
`6a6f99ccb3a733af4e298ed8c48452e019f9980c`

Independent post-merge production verification:
- CI **#739** / run `35098428328` — completed success on exact merge SHA;
- Production build — success;
- Production dependency audit — success;
- Secret history scan — success;
- Quality gate Ubuntu — success;
- Windows compatibility — success;
- Mobile route QA (Chromium) — success;
- **Production smoke (Cloudflare) — success**.

Dedicated representative: `bahasa-baca-lala-kucing`.

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

Merged gameplay-distribution:

```text
900 / 900 classified
0 unclassified
37 active merged patterns
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

Distance remaining: **13** patterns to minimum 50 and **23** to working target 60.

## Docs-only closure chain

Pattern #37 implementation is merged and live verified, but Pattern #37 is **not yet FULLY CLOSED**.

Closure branch must remain docs-only and be based exactly on implementation merge `6a6f99ccb3a733af4e298ed8c48452e019f9980c`.

Remaining gates:
1. update the canonical closure docs with the exact implementation head, merge and post-merge evidence;
2. fresh exact closure-head full CI;
3. clean closure scope/review/thread/mergeability gate with zero commits behind `main`;
4. exact-head docs-only closure squash merge;
5. final independent `main` verification including exact Cloudflare production smoke.

Only after those gates may Pattern #37 be marked **FULLY CLOSED**.

## Product sequencing after closure

Before Pattern #38 begins, run the production visual/product baseline audit across public/home, child flows, subject/gallery/stage states, representative activities, rewards, parent, account, auth, system states and desktop/tablet/mobile breakpoints. Record P0/P1/P2 findings, establish/update the WS-08 Art Bible and permanent visual QA baseline, fix P0/P1 blockers, then start a fresh Pattern #38 objective/evidence audit. No Pattern #38 family is pre-approved.
