# SI-05 Belajar Pilot — Safe Checkpoint — 28 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

## Resume point

Continue this exact SI-05 pilot. Do not expand into SI-06 until SI-05 is merged and live verified.

```text
repository: ceritaantarkita-req/mainlagi-hub
PR:          #369 — merged
final head:  e5af8c287920ff74a7571812bd6af8fff558d31f
merged main: 26160cd4823b4777013d989549a8bfc39729673c
phase:       SI-05 — CLOSED / LIVE
pilot:       OddOneOutActivity
next:        SI-06+ — bounded Belajar runtime-family migration
```

Closed prerequisites:

```text
SI-00 — coverage audit                    CLOSED
SI-01 — orientation foundation            CLOSED / LIVE
SI-02 — character presentation            CLOSED / LIVE
SI-03 — canonical Completion              CLOSED / LIVE
SI-04 — canonical Share                   CLOSED / LIVE
```

SI-04 docs closure is production verified through main `24b49fb9673108d618119bccdd03cb291ddb001c`, CI #2002 / run `36365180448`, including exact Cloudflare production smoke.

## Why OddOneOut is the pilot

SI-00 required one currently-inline, finite, assessed Belajar renderer with a clear local success state.

`OddOneOutActivity` is a strong pilot because it already owns:

- finite three-choice board interaction;
- explicit wrong/retry state;
- explicit assessed runtime measurement;
- `choice_accuracy_v1` evidence semantics;
- one existing `completeActivity(childId, activity.id)` write;
- local success presentation and local subject-exit CTA.

The pilot therefore tests the exact Shared Interaction migration boundary without inventing new learning behavior.

## Runtime change

The success write order remains:

```text
emitLearningRuntimeMeasurement(...)
→ completeActivity(childId, activity.id)
→ setFeedback("good")
→ ActivityCompletion
→ CanonicalCompletion
→ CanonicalShareDialog
```

SI-05 does **not** move measurement, evidence, progress, mastery, or attempt recording into the completion UI.

The old local `Pilih permainan lain` success CTA is removed.

When `feedback === "good"`, the renderer now mounts:

```tsx
<ActivityCompletion
  childId={childId}
  activity={activity}
  onTryAgain={restart}
/>
```

## Again / replay semantics

The pilot passes an explicit local `restart` callback.

Again resets only renderer-local interaction state:

- `incorrectRef.current = 0`;
- `retryRef.current = 0`;
- `selected = null`;
- `feedback = "idle"`.

It does not reload the route, undo completed progress, or create a new attempt until the learner completes another real replay.

## Evidence boundary

Unchanged owners:

- `emitLearningRuntimeMeasurement` continues to publish the explicit measured outcome;
- `completeActivity` continues to publish progress completion;
- `LearningAttemptBridge` continues to prefer the explicit outcome;
- duplicate-attempt guard remains owned by `LearningAttemptBridge`;
- canonical Completion and Share remain presentation-only.

Expected representative attempt remains:

```text
assessed: true
evidenceFidelity: choice_odd_one_out_interaction
commonTrait: Dua pilihan sama-sama hewan
outsiderChoice: 🚗
selectedChoice: 🚗
correctCount: 1
incorrectCount: 1
retryCount: 1
accuracy: 0.5
```

## Existing family QA update

`scripts/run-odd-one-out-browser-tests.mjs` now expects canonical Completion instead of the removed local success CTA while preserving its existing:

- 320 / 390 / 768 responsive matrix;
- keyboard wrong-answer path;
- pointer completion path;
- exact assessed evidence assertions;
- trio layout/touch target checks.

## New SI-05 closure gates

Static:

```text
scripts/run-si05-belajar-pilot-tests.mjs
npm run test:learning:si05-pilot
```

It locks:

- explicit measurement remains;
- `completeActivity` remains;
- measurement → progress → presentation ordering;
- local replay reset;
- canonical Completion + Share adoption;
- legacy success CTA removal;
- LearningAttemptBridge remains the attempt/evidence owner.

Browser:

```text
scripts/run-si05-belajar-pilot-browser-tests.mjs
npm run test:ui:si05-pilot
```

Representative route:

```text
/child/demo-gian/activity/logic-odd-category-animal-vehicle
```

Browser acceptance proves:

- wrong answer writes no completion attempt;
- correct answer writes exactly one assessed attempt;
- explicit evidence fidelity/metadata/accuracy are preserved;
- existing `completeActivity` progress write remains;
- canonical praise / ★★★ / Back / Again / Next / Share appears;
- opening Share creates no duplicate attempt;
- Share remains public-safe Belajar origin;
- portrait → landscape with Share open does not reload;
- Completion and Share stay mounted through rotation;
- rotation creates no duplicate attempt/evidence;
- Again hides Completion and resets only local board state;
- Again alone creates no second attempt.

The static pilot gate is wired into `test:learning`; the browser pilot gate is wired into the permanent mobile-route matrix after SI-04.

## Explicit non-scope

SI-05 does not migrate:

- any second Belajar renderer;
- the remaining four OddOneOut catalog activities as a separate copy path — they already share this same renderer and therefore inherit the renderer-level presentation migration;
- legacy/fallback `ChildLearningPlatform`;
- SI-06B literacy/audio family;
- other Logic renderers;
- creative workspaces;
- Bermain;
- World;
- Journey Map;
- Shop;
- database schema;
- learning catalog/specs;
- mastery/progression/evidence architecture.

The phrase “one pilot renderer” means one shared runtime owner, not one catalog activity ID.

## Final verification

SI-05 completed the full closure chain:

```text
PR:                     #369 — merged
final PR head:          e5af8c287920ff74a7571812bd6af8fff558d31f
final PR CI:            #2021 / run 36366256145 — FULL SUCCESS
merged main:            26160cd4823b4777013d989549a8bfc39729673c
merged-main CI:         #2026 / run 36367563039 — FULL SUCCESS
Cloudflare smoke:       SUCCESS — exact merged main SHA verified
```

Final PR CI and merged-main CI both passed:

- Ubuntu quality;
- Windows compatibility;
- production build;
- dependency audit;
- secret-history scan;
- Chromium mobile-route matrix;
- permanent visual product baseline.

The exact production smoke verified merged SHA `26160cd4823b4777013d989549a8bfc39729673c`.

The pilot therefore proves the intended migration pattern: explicit renderer-owned measurement and `completeActivity` remain intact while the old local success exit is replaced by the canonical Completion + Share path, with no duplicate attempt/evidence caused by Share, rotation, or Again.

## Closure state

SI-05 is **closed / merged / live verified**.

The next authorized Shared Interaction work is:

`SI-06+ — bounded Belajar runtime-family migration batches`

Use the SI-05 migration pattern as the canonical template: preserve renderer learning/evidence writes, replace only post-success presentation, provide explicit local replay semantics, and prove duplicate-attempt/orientation safety.

Per SI-00, do not migrate all Belajar renderers at once. Select one bounded owner/family per session.
