# SI-05 Belajar Pilot — Safe Checkpoint — 28 September 2026

Status: **IMPLEMENTED ON BRANCH / FULL CI VALIDATION PENDING / NOT MERGED**

## Resume point

Continue this exact SI-05 pilot. Do not expand into SI-06 until SI-05 is merged and live verified.

```text
repository: ceritaantarkita-req/mainlagi-hub
base main:  24b49fb9673108d618119bccdd03cb291ddb001c
branch:     agent/si-05-belajar-pilot-odd-one-out-20260928
phase:      SI-05 — Belajar pilot runtime
pilot:      OddOneOutActivity
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

## Merge gate

Do not merge until latest-head CI proves:

1. Ubuntu quality full green;
2. Windows compatibility full green;
3. production build full green;
4. dependency audit full green;
5. secret-history scan full green;
6. Chromium mobile-route matrix full green;
7. permanent visual product baseline full green.

After merge require push-to-main full green plus exact Cloudflare smoke for the merged SHA.

## Next after SI-05 closure

Only after SI-05 is merged/live verified:

`SI-06A / SI-06+ — bounded Belajar runtime-family migration batches`

The exact next batch should be selected from SI-00 ownership and kept to one bounded owner/family per session.
