# WS-05 Pattern #34 — Bahasa Initial Sound

Date: **16 September 2026**  
Implementation PR: **#147**  
Implementation branch: `agent/ws05-bahasa-initial-sound-20260916`  
Implementation base `main`: `0f90a7fae1164ae6ace86f993024cef7b4989ca9`  
Accepted code head: `207153f8e88f7c5e64949354c12b4feb1ee583e8`  
Accepted code-head CI: **#704 / run `35069389333` — full PR success**  
Final implementation docs head: `e12d9eef073a9989bb8e9b6f8d374e098e17edde`  
Final implementation docs-head CI: **#709 / run `35072401631` — full PR success**  
Implementation merge SHA: `42da6cfd2114bd29b9aa4ddd36361bb975db2bf1`  
Post-merge main CI: **#710 / run `35072815182` — full success including Cloudflare production smoke**  
Closure branch: `docs/ws05-initial-sound-closure-20260916`  
Closure PR: **pending**  
Status: **MERGED / LIVE VERIFIED / CLOSURE PR PENDING**

## Why this family was selected

Pattern #33 `equal_groups` was fully closed before this wave started. A fresh objective/evidence review selected the exact Bahasa initial-sound choice family because the three reviewed activities share one precise learning objective: use a familiar word/clue to identify its first sound/letter from three canonical uppercase single-letter choices.

This family is semantically distinct from existing mechanics. `syllable_assembly` constructs a word from syllable pieces; `visible_matching` still handles canonical matching activities such as `bahasa-match-awal-tas-susu`; vowel recognition/classification remains separate; English inverse initial-sound work is not included; letter ordering is not included; and all Math/other-subject mechanics remain outside scope. Selection was based on objective/evidence fit, not concentration thresholds.

## Exact canonical scope

```text
bahasa-awal-bola
bahasa-awal-kucing
bahasa-awal-pisang
```

Canonical boundaries for all three:
- subject `bahasa`;
- stage `bahasa-dasar-huruf`;
- lesson `bahasa-bunyi-awal`;
- pack `bahasa.pack.bunyi-awal`;
- skill `bahasa.bunyi.awal.recognition`;
- assessment `assessed`;
- runtime remains `tap_choice`;
- exactly three unique canonical uppercase single-letter choices;
- canonical `correctChoice` remains unchanged.

Explicit exclusions include `bahasa-match-awal-tas-susu`, vowel recognition/classification, syllable assembly, English inverse initial-sound tasks, letter ordering, Math and every other subject/family. No catalog content, activity identity, stars, mastery, progression, schema or migration changed.

## Mechanic and evidence contract

`initial_sound`:
- renders the canonical familiar visual clue and canonical word context;
- masks only the first letter of the word as `?` before a correct assessment while keeping the remaining canonical word visible;
- requires exactly three unique uppercase single-letter choices and requires the canonical `correctChoice` to equal the first letter of the configured word;
- keeps canonical keyboard/touch/pointer direct-selection interaction;
- wrong choice records assessed incorrect/retry evidence, cannot complete the activity, and cannot reveal the masked initial sound;
- correct choice completes the canonical activity and reveals the canonical first letter;
- no changed choice set, extra confirmation, drag-only dependency or intermediate assessment;
- fidelity `choice_initial_sound_interaction`;
- runtime metadata source `initial-sound-runtime` with canonical word, initial sound and selected choice.

Reviewed mappings:

```text
bahasa-awal-bola    -> ⚽ bola    -> B
bahasa-awal-kucing  -> 🐱 kucing -> K
bahasa-awal-pisang  -> 🍌 pisang -> P
```

## Progression/browser QA defect history

The browser QA was intentionally not weakened when progression failures appeared. The failures exposed incorrect test-fixture assumptions and were fixed by making the fixture follow the canonical stage order.

- CI #701 / run `35059536603` caught the first invalid progression fixture.
- CI #702 / run `35068097261` used canonical representative `bahasa-awal-bola` without future-completing the target but still exposed an invalid readiness assumption.
- CI #703 / run `35068805216` showed that `bahasa-cerita`, not `bahasa-huruf`, is the immediate prior stage checked by progression.
- Accepted code head `207153f8e88f7c5e64949354c12b4feb1ee583e8` seeds canonical historical progress plus required prior-stage practice `bahasa-cerita-teman` and passed full CI #704 / run `35069389333`.

## Manual visual acceptance

Nine screenshots from CI #704 were manually reviewed:

```text
320x720   idle / wrong / success
390x844   idle / wrong / success
768x1024  idle / wrong / success
```

Accepted observations: the familiar clue and word remainder remain clear; the first letter is `?` in idle and wrong states; wrong selection does not reveal the answer or complete the activity; success reveals canonical `B` only after correct selection on representative `bahasa-awal-bola`; canonical choices remain readable/tappable; feedback and success CTA remain visible; and no clipping or horizontal overflow was found.

Manual screenshot acceptance is not external physical-device certification, accessibility-specialist review, or human pedagogical/art acceptance.

## Verified implementation audit state

```text
activities:               900
KEEP:                     900
flagged:                    0
structural findings:        0
classified:               900
unclassified:               0
active merged patterns:    34
choice_grid               292 / 900 = 32.44%
initial_sound               3 / 900 = 0.33%
equal_groups                3 / 900 = 0.33%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Bahasa choice_grid          44 / 100
```

The three scoped activities move from `choice_grid` to `initial_sound`; all other pattern assignments remain unchanged. Remaining distance is **16** patterns to minimum 50 and **26** to working target 60.

## Implementation merge and live evidence

- Final implementation docs head `e12d9eef073a9989bb8e9b6f8d374e098e17edde` passed full PR CI #709 / run `35072401631`.
- PR #147 clean gate was exact-head and mergeable, `behind_by=0`, with exactly 16 scoped implementation/test/docs files and zero comments, reviews or review threads.
- PR #147 was exact-head squash merged as `42da6cfd2114bd29b9aa4ddd36361bb975db2bf1`.
- `main` was independently verified at that exact SHA.
- Post-merge main CI #710 / run `35072815182` passed Ubuntu quality, Windows compatibility, production build, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution audits, simulations, Batch17 and **Cloudflare production smoke**.

Pattern #34 implementation is therefore **MERGED / LIVE VERIFIED**.

## Docs-only closure

The closure branch was created from the exact implementation merge SHA `42da6cfd2114bd29b9aa4ddd36361bb975db2bf1`. Closure is restricted to exactly these five canonical Pattern #34 documentation files:

```text
docs/CURRENT_STATE.md
docs/ACTIVITY_QUALITY_AUDIT.md
docs/GAMEPLAY_VARIATION_CATALOG.md
docs/NEXT_PRODUCT_QUALITY_PLAN.md
docs/WS05_INITIAL_SOUND_WAVE_2026-09-16.md
```

No runtime, catalog, test, mastery, progression, schema, migration or application code belongs in the closure PR.

## Remaining closure sequence

Pattern #34 is **not fully closed yet**. Required remaining sequence:

1. open the docs-only closure PR and record its actual PR number in all five canonical docs;
2. require fresh exact closure-head full CI success;
3. verify exact head, mergeability, `behind_by=0`, exactly five docs-only files, zero relevant comments, zero reviews and zero unresolved review threads;
4. exact-head squash merge the closure PR;
5. independently verify final `main` at the exact closure merge SHA;
6. require final post-closure `main` CI full success including Cloudflare production smoke.

Only after all remaining closure gates pass may Pattern #34 be marked **FULLY CLOSED**.

No family is pre-approved for Pattern #35; the next mechanic requires a fresh objective/evidence audit only after Pattern #34 is fully closed.
