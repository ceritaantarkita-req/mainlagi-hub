# SI-06B1 Literacy/Audio Specialized — Safe Checkpoint — 28 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

## Resume point

Continue this exact workstream. Do not restart SI-06B preflight and do not start SI-06B2 before SI-06B1 is merged/live verified.

```text
repository: ceritaantarkita-req/mainlagi-hub
PR:          #373 — merged
final head:  ad5ed719da446314e3a131d7211c595e51b55eb4
merged main: 15058932eff424bc6ba7eb3e4e5bf0ad29ae05a1
phase:       SI-06B1 — CLOSED / LIVE
next:        SI-06B2 — sentence / reading specialized renderers
```

Closed prerequisites:

```text
SI-00  — coverage audit                     CLOSED
SI-01  — orientation foundation             CLOSED / LIVE
SI-02  — character presentation             CLOSED / LIVE
SI-03  — canonical Completion               CLOSED / LIVE
SI-04  — canonical Share                    CLOSED / LIVE
SI-05  — Belajar pilot                      CLOSED / LIVE
SI-06A — fallback Belajar owner             CLOSED / LIVE
```

SI-06A runtime PR #371 and docs closure PR #372 are production verified. Final docs main is `3dacf402647188d3a8119dc90d42595d4fe768c3`, main CI #2071 / run `36380976483` full success including exact Cloudflare smoke.

## Why SI-06B was split

SI-00 suggested nine literacy/audio owners:

```text
AudioChoiceLearningActivity
SymbolHuntChoiceActivity
SyllableAssemblyActivity
InitialSoundActivity
PhraseSceneMatchActivity
PictureWordMatchActivity
SentenceOrderCardsActivity
ReadingPassageQuestionActivity
ClozeSentenceChoiceActivity
```

Current preflight confirmed that one session would be too broad. SI-06B is therefore split before mutation:

```text
SI-06B1 — audio / symbol / early literacy
  AudioChoiceLearningActivity
  SymbolHuntChoiceActivity
  SyllableAssemblyActivity
  InitialSoundActivity

SI-06B2 — sentence / reading
  PhraseSceneMatchActivity
  PictureWordMatchActivity
  SentenceOrderCardsActivity
  ReadingPassageQuestionActivity
  ClozeSentenceChoiceActivity
```

SI-06B2 is **not started**.

## Current dispatcher ownership

Current production dispatcher still routes:

```text
runtime === listen_and_choose
  -> AudioChoiceLearningActivity

choicePresentation === symbol_hunt
  -> SymbolHuntChoiceActivity

isSyllableAssemblyActivity(...)
  -> SyllableAssemblyActivity

isInitialSoundActivity(...)
  -> InitialSoundActivity
```

All four B1 owners are production-reachable.

## Runtime migration

### AudioChoiceLearningActivity

Preserved:

- managed `AudioManager` / `speakPrompt` / entry-latency ownership;
- audio-only target versus visible prompt separation;
- mute/unavailable/error fallback behavior;
- renderer-owned `completeActivity`;
- non-success escape links for unavailable audio.

Changed only post-success presentation:

```text
correct answer
-> existing tone / feedback state
-> existing completeActivity
-> ActivityCompletion
-> CanonicalCompletion
-> CanonicalShareDialog
```

Removed:

- local success banner;
- persisted-progress `done` success exit;
- post-success local `Pilih permainan lain`.

Again resets only local feedback and leaves audio ownership intact.

### SymbolHuntChoiceActivity

Preserved:

- deterministic symbol-field variant;
- pointer / keyboard interaction;
- wrong-state feedback;
- renderer-owned `completeActivity`.

Removed:

- local “Ketemu!” success card;
- local subject-exit Link;
- orphaned success CSS.

Canonical Again resets only local feedback to `idle`.

### SyllableAssemblyActivity

Preserved:

- explicit `emitLearningRuntimeMeasurement`;
- evidence fidelity `choice_syllable_assembly_interaction`;
- syllable config / result masking;
- renderer-owned `completeActivity`;
- measurement -> progress -> success-presentation ordering.

Canonical Again resets:

```text
incorrectRef.current = 0
retryRef.current = 0
selected = null
feedback = idle
```

The local subject-exit CTA and orphaned `.nextLink` CSS are removed.

### InitialSoundActivity

Preserved:

- explicit `emitLearningRuntimeMeasurement`;
- evidence fidelity `choice_initial_sound_interaction`;
- semantic visual token / word clue ownership;
- renderer-owned `completeActivity`;
- measurement -> progress -> success-presentation ordering.

Again resets the same local measured-interaction state as the syllable owner.

The local subject-exit CTA and orphaned `.nextLink` CSS are removed.

## Learning/evidence boundary

SI-06B1 does not edit:

- `LearningAttemptBridge`;
- learning catalog/specs;
- audio manager architecture;
- database/schema;
- mastery/progression/evidence architecture;
- dispatcher ordering.

`LearningAttemptBridge` still:

- captures generic tap/listen choice evidence where no explicit outcome exists;
- prefers explicit runtime measurement when present;
- deletes runtime stats/explicit outcome after recording an attempt;
- owns duplicate-attempt protection.

Canonical Completion/Share remain presentation-only.

## Existing permanent QA updated

### SymbolHunt

`scripts/run-symbol-hunt-browser-tests.mjs`

Preserves pointer, keyboard, geometry and responsive checks, but success now asserts canonical Completion action order instead of the retired local “Ketemu!” status card.

### SyllableAssembly

`scripts/run-syllable-assembly-browser-tests.mjs`

Preserves wrong-state, masked-result and exact assessed evidence checks; success now requires canonical Back / Again / Next / Share instead of local subject-exit CTA.

### InitialSound

`scripts/run-initial-sound-browser-tests.mjs`

Preserves semantic SVG/visual coverage and exact assessed evidence checks; success now requires canonical Completion.

## New SI-06B1 static gate

```text
scripts/run-si06b1-literacy-audio-tests.mjs
npm run test:learning:si06b1-literacy-audio
```

Locks:

- all four B1 owners use `ActivityCompletion`;
- each renderer keeps its existing `completeActivity` ownership;
- AudioChoice retains managed audio/fallback behavior and drops persisted success presentation;
- SymbolHunt drops its local success card/navigation owner;
- Syllable/Initial keep explicit evidence metadata and ordering;
- local replay reset semantics remain local;
- dispatcher ownership remains unchanged;
- `LearningAttemptBridge` remains evidence owner;
- all five B2 renderers are explicitly forbidden from being migrated inside B1.

## New SI-06B1 browser gate

```text
scripts/run-si06b1-literacy-audio-browser-tests.mjs
npm run test:ui:si06b1-literacy-audio
```

Representative production route:

```text
/child/demo-gian/activity/english-find-blue-audio
```

The browser test reuses the repository's deterministic SpeechSynthesis QA pattern rather than changing production audio behavior.

Acceptance proves:

- audio choices stay locked until managed speech starts;
- wrong answer writes no completion attempt;
- one wrong + one correct writes exactly one assessed attempt;
- generic listening evidence remains `choice_interaction`;
- correctCount=1, incorrectCount=1, retryCount=1, accuracy=0.5;
- canonical Completion exposes Back / Again / Next / Share;
- canonical Share remains public-safe at `/`;
- opening Share creates no duplicate attempt;
- portrait -> landscape does not reload the document;
- Completion/Share stay mounted through rotation;
- rotation creates no duplicate attempt;
- Again hides Completion, returns to the same audio-choice board, and creates no second attempt before another real completion.

## CI wiring

New scripts are wired into permanent gates:

```text
test:learning
  ... SI-06A
  -> SI-06B1 static gate
  -> remaining learning gates

test:ui:mobile-routes
  ... SI-06A browser gate
  -> SI-06B1 AudioChoice browser gate
  -> permanent route matrix
```

The existing SymbolHunt, SyllableAssembly and InitialSound browser suites remain in the permanent matrix.

## Explicit non-scope

Do not expand SI-06B1 into:

- SI-06B2 sentence/reading owners;
- SI-06C matching/order/drag owners;
- SI-06D Math;
- SI-06E Logic;
- SI-06F Science;
- SI-06G creative workspace;
- Bermain;
- World;
- Journey Map;
- Shop;
- LearningAttemptBridge changes;
- catalog/spec/schema changes;
- audio provider/narration redesign.

## Final verification

SI-06B1 completed the full closure chain:

```text
PR:                     #373 — merged
final PR head:          ad5ed719da446314e3a131d7211c595e51b55eb4
final PR CI:            #2077 / run 36383476672 — FULL SUCCESS
merged main:            15058932eff424bc6ba7eb3e4e5bf0ad29ae05a1
merged-main CI:         #2078 / run 36384334431 — FULL SUCCESS
Cloudflare smoke:       SUCCESS — exact merged main SHA verified
```

Both PR-side and merged-main CI passed:

- Ubuntu quality;
- Windows compatibility;
- production build;
- dependency audit;
- secret-history scan;
- Chromium mobile-route matrix;
- permanent visual product baseline.

Merged-main CI #2078 also passed exact Cloudflare production smoke for
`15058932eff424bc6ba7eb3e4e5bf0ad29ae05a1`.

The closure proves all four B1 owners keep their existing audio/measurement/progress/evidence
ownership while post-success presentation uses the canonical Completion + Share path.

## Closure state

SI-06B1 is **closed / merged / live verified**.

The next authorized Shared Interaction batch is:

`SI-06B2 — sentence / reading specialized renderers`

Keep the B2 owner set bounded to:

- `PhraseSceneMatchActivity`;
- `PictureWordMatchActivity`;
- `SentenceOrderCardsActivity`;
- `ReadingPassageQuestionActivity`;
- `ClozeSentenceChoiceActivity`.

Preflight current dispatcher ownership before mutation. Do not start SI-06C or later
families until B2 is independently closed and production verified.
