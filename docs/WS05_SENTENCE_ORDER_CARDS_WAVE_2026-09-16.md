# WS-05 Sentence Order Cards Wave — 2026-09-16

Status: **Pattern #36 QA ACCEPTED / UNMERGED; CANONICAL DOCS GATE IN PROGRESS**  
Implementation PR: **#151**  
Base: Pattern #35 final `main` `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`  
Accepted code head: `595bc4e94065eb5250aef27797858641ca959c67`  
Accepted code CI: **#728 / run `35089266590` — full PR success**

## Why this family

The fresh objective/evidence audit after fully closing Pattern #35 selected the Bahasa Wave C sentence-order family. Its canonical lesson objective is explicitly to choose a word order that forms a simple, sensible sentence. Presenting each unchanged sentence choice as a visible left-to-right sequence of word cards externalizes exactly that objective while preserving the existing assessed choice evidence.

This is deliberately not a free reorder/drag mechanic: the current canonical payload contains three sentence alternatives rather than independent draggable tokens. Pattern #36 therefore does not invent a new answer construction step or claim evidence the content does not currently support.

## Exact scope

```text
bahasa-urut-ibu-memasak
bahasa-urut-adi-berlari
bahasa-urut-kucing-tidur
bahasa-urut-siti-membaca
bahasa-urut-burung-terbang
```

Canonical shared boundary:
- subject `bahasa`;
- stage `bahasa-kalimat-pemahaman`;
- lesson `bahasa-kalimat-urutan`;
- pack `bahasa.pack.kalimat-urutan`;
- skill `bahasa.kalimat.order`;
- assessment `assessed`;
- runtime `tap_choice`;
- exactly three canonical sentence choices with unchanged `correctChoice`.

Explicit exclusions:
- Bahasa sentence meaning/comprehension remains generic choice where not otherwise specialized;
- Bahasa listening remains `listen_choose`;
- Bahasa vocabulary relations remain `visible_matching`;
- Picture Word Match, Syllable Assembly and Initial Sound remain unchanged;
- Letters sequence, Logic relative order and Math number order remain their existing specialized patterns;
- no content seed, mastery, progression, schema or migration rewrite.

## Interaction contract

`sentence_order_cards` renders each canonical answer sentence as its existing words in left-to-right cards. The whole sentence alternative remains one direct choice button.

Wrong choice:
- assessed incorrect count increases;
- retry count increases;
- activity does not complete.

Correct choice:
- records the measured canonical sentence choice;
- completes the existing canonical activity;
- shows the existing return CTA.

Accessibility/input:
- keyboard direct choice;
- touch/pointer direct choice;
- >=44px tested choice targets;
- no drag-only dependency;
- responsive QA at 320x720, 390x844 and 768x1024.

## Evidence contract

Assessed fidelity: `choice_sentence_order_cards_interaction`.

Runtime metadata source: `sentence-order-cards-runtime` with:
- `selectedChoice` — unchanged canonical sentence answer;
- `selectedWords` — display tokens derived only by removing terminal punctuation and splitting that selected canonical sentence on whitespace.

Representative wrong-then-right browser path validates:
- `correctCount = 1`;
- `incorrectCount = 1`;
- `retryCount = 1`;
- `accuracy = 0.5`;
- wrong answer cannot complete the activity.

## QA evidence

Accepted code head:
`595bc4e94065eb5250aef27797858641ca959c67`

Exact-head code CI **#728 / run `35089266590`**:
- Ubuntu structure/assets/source, security boundary, physical-device harness contract, typecheck, lint, engine/learning suite, deterministic activity quality, gameplay distribution, simulations and Batch17 — success;
- Windows compatibility — success;
- production build and build budgets — success;
- production dependency audit — success;
- secret-history scan — success;
- Chromium mobile/accessibility/browser matrix — success;
- Cloudflare production smoke skipped on PR as designed.

Dedicated representative: `bahasa-urut-ibu-memasak`.

Progression fixture uses legitimate completion + qualifying measured evidence for the ten required activities in immediate prior stage `bahasa-suku-kata-kata`, without seeding the target or future-stage completion.

Manual screenshot review: **9/9 accepted**.
- 320x720 idle/wrong/success;
- 390x844 idle/wrong/success;
- 768x1024 idle/wrong/success.

Observed acceptance:
- no horizontal overflow or clipping;
- all three canonical sentence alternatives stay readable;
- word-card order and arrows are clear across phone/tablet layouts;
- wrong state is visibly distinct and does not complete;
- success state highlights only the selected canonical sentence;
- feedback and success CTA stay visible;
- Garden UI character/background framing remains intact.

## Distribution/quality evidence

CI #728 gameplay-distribution artifact:

```text
900 / 900 classified
0 unclassified
36 active candidate patterns
choice_grid          282 / 900 = 31.33%
sentence_order_cards   5 / 900 = 0.56%
Bahasa choice_grid     34 / 100 = 34.00%
```

Global advisory hotspots: none.

Deterministic activity-quality artifact:

```text
KEEP                  900
POLISH                   0
REDESIGN                 0
REPLACE                  0
structural findings      0
```

## Remaining implementation chain

Pattern #36 is **not yet merged or fully closed**. Required remaining gates:
1. commit canonical docs from the accepted code head;
2. fresh exact final implementation docs-head full CI;
3. clean exact-head implementation scope/review/thread/mergeability gate;
4. exact-head implementation squash merge;
5. independent `main` verification and full CI including Cloudflare production smoke;
6. separate docs-only closure PR based exactly on that implementation merge;
7. fresh closure-head CI, clean closure gate, exact-head closure merge;
8. final independent `main` verification and Cloudflare production smoke.

Only after all gates may Pattern #36 be marked **FULLY CLOSED**. Pattern #37 objective/evidence audit must not start before that point.
