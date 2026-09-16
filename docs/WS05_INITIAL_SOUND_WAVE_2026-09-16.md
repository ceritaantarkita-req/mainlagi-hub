# WS-05 Pattern #34 — Bahasa Initial Sound

Date: **16 September 2026**  
Implementation PR: **#147**  
Implementation branch: `agent/ws05-bahasa-initial-sound-20260916`  
Implementation base `main`: `0f90a7fae1164ae6ace86f993024cef7b4989ca9`  
Accepted code head: `207153f8e88f7c5e64949354c12b4feb1ee583e8`  
Accepted code-head CI: **#704 / run `35069389333` — full PR success**  
Latest pre-wave-doc docs head: `7899a451a76e5fef3be770b147bcb22acf161380`  
Pre-wave-doc docs-head CI: **#708 / run `35070215436` — full PR success**  
Status: **QA ACCEPTED / UNMERGED**

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
bahasa-awal-bola    -> ⚽ bola   -> B
bahasa-awal-kucing  -> 🐱 kucing -> K
bahasa-awal-pisang  -> 🍌 pisang -> P
```

## Progression/browser QA defect history

The browser QA was intentionally not weakened when progression failures appeared. The failures exposed incorrect test-fixture assumptions and were fixed by making the fixture follow the canonical stage order.

### CI #702

The representative browser target was corrected to the legitimate canonical activity `bahasa-awal-bola` and future completion of the target activity was removed from the seed. The run still exposed that target-stage activity completion is not a valid substitute for prior-stage readiness.

### CI #703 / run `35068805216`

Head `28a9477cef351f464748aa1edb3e26d6e6356a91` seeded canonical required/evidence activity from `bahasa-huruf`, but Chromium still correctly redirected the target to the Bahasa subject page. Investigation showed that `bahasa-cerita` sits immediately before `bahasa-dasar-huruf`; the progression contract checks the immediate previous stage.

### CI #704 / run `35069389333` — accepted code head

Accepted code head `207153f8e88f7c5e64949354c12b4feb1ee583e8` seeded the immediate prior stage exactly as the canonical contract requires: required practice activity `bahasa-cerita-teman` is complete, with historical Bahasa core progress preserved. No fake target completion or target-stage bypass is seeded.

Full CI passed: Ubuntu quality gate, Windows compatibility, production build, production dependency audit, secret-history scan, Chromium mobile/accessibility/browser matrix, deterministic activity-quality audit, gameplay-distribution audit, simulations and Batch17. Cloudflare smoke is correctly skipped on pull-request runs.

## Manual visual acceptance

Nine screenshots from CI #704 were manually reviewed:

```text
320x720   idle / wrong / success
390x844   idle / wrong / success
768x1024  idle / wrong / success
```

Accepted observations: the familiar clue and word remainder remain clear; the first letter is `?` in idle and wrong states; wrong selection does not reveal the answer or complete the activity; success reveals canonical `B` only after correct selection on representative `bahasa-awal-bola`; canonical choices remain readable/tappable; feedback and success CTA remain visible; and no clipping or horizontal overflow was found.

Manual screenshot acceptance is not external physical-device certification, accessibility-specialist review, or human pedagogical/art acceptance.

## Accepted audit state

```text
activities:               900
KEEP:                     900
flagged:                    0
structural findings:        0
classified:               900
unclassified:               0
active candidate patterns: 34
choice_grid               292 / 900 = 32.44%
initial_sound               3 / 900 = 0.33%
equal_groups                3 / 900 = 0.33%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Bahasa choice_grid          44 / 100
```

The three scoped activities move from `choice_grid` to `initial_sound`; all other pattern assignments remain unchanged. Distance after merge would be **16** patterns to minimum 50 and **26** to working target 60.

## Canonical docs state before final implementation gate

The four standing canonical WS-05 docs were updated after code/manual acceptance and pre-wave-doc docs head `7899a451a76e5fef3be770b147bcb22acf161380` passed full PR CI #708 / run `35070215436`.

This wave document is the fifth canonical Pattern #34 documentation file. Therefore CI #708 is useful evidence but is not the final implementation docs-head gate; a fresh full CI run is required on the exact head containing this document.

## Remaining implementation closure sequence

Pattern #34 is **QA ACCEPTED / UNMERGED** at this record. Required sequence remains:

1. require fresh exact-head full CI success after this wave document is committed;
2. verify PR #147 exact head, mergeability, base freshness, changed-file scope, zero relevant comments, zero reviews and zero unresolved review threads;
3. exact-head squash merge PR #147;
4. independently verify `main` at the exact implementation merge SHA;
5. require post-merge `main` CI full success including Cloudflare production smoke;
6. create a separate docs-only closure branch/PR from the exact implementation merge SHA;
7. update exactly the five canonical Pattern #34 docs with implementation merge/live evidence;
8. require fresh exact closure-head full CI and clean closure merge gate;
9. exact-head squash merge the closure PR;
10. independently verify final `main` and require final post-closure CI full success including Cloudflare production smoke.

Only after all ten steps pass may Pattern #34 be marked **FULLY CLOSED**.

No family is pre-approved for Pattern #35; the next mechanic requires a fresh objective/evidence audit only after Pattern #34 is fully closed.
