# SI-06A Fallback Belajar Owner — Safe Checkpoint — 28 September 2026

Status: **IMPLEMENTED ON BRANCH / FULL CI VALIDATION PENDING / NOT MERGED**

## Resume point

Continue this exact SI-06A batch. Do not expand into SI-06B or other Belajar families until this owner is merged/live verified.

```text
repository: ceritaantarkita-req/mainlagi-hub
base main:  40f02c0bc78a82dff4e30278b390ef3d4f9f7731
branch:     agent/si-06a-legacy-fallback-belajar-20260928
phase:      SI-06A — legacy/fallback Belajar owner
```

Closed prerequisites:

```text
SI-00 — coverage audit                    CLOSED
SI-01 — orientation foundation            CLOSED / LIVE
SI-02 — character presentation            CLOSED / LIVE
SI-03 — canonical Completion              CLOSED / LIVE
SI-04 — canonical Share                   CLOSED / LIVE
SI-05 — Belajar pilot                     CLOSED / LIVE
```

SI-05 documentation closure is production verified through main
`40f02c0bc78a82dff4e30278b390ef3d4f9f7731`, CI #2040 / run
`36369199696`, including exact Cloudflare production smoke.

## Current-main reachability preflight

SI-00 originally described the fallback owner as:

- choice;
- matching;
- trace;
- coloring;
- story;
- motion redirect separate;
- special `MathCountActivity`.

Current main has evolved since that audit. The exact production dispatcher now proves:

### Production-reachable fallback paths

```text
tap_choice fallback      -> ChildLearningPlatform::ChoiceActivity
matching fallback        -> ChildLearningPlatform::MatchingActivity
trace fallback           -> ChildLearningPlatform::TraceActivity
story fallback           -> ChildLearningPlatform::StoryActivity
motion_game fallback     -> ChildLearningPlatform::MotionActivity redirect only
```

### Superseded/unreachable fallback paths

```text
coloring
  -> intercepted earlier by CreativePracticeActivity
  -> remains SI-06G creative-workspace ownership

math-count-3 / MathCountActivity special fallback
  -> math-count-3 is in MATH_COUNT_SELECT_IDS
  -> intercepted earlier by CountAndSelectActivity
  -> old MathCountActivity is no longer the production route owner
```

SI-06A therefore does not claim production acceptance for legacy Coloring or the old
MathCount fallback. Their code is not used as evidence of current route coverage.

## Runtime migration

The shared fallback owner is:

`src/components/learning/ChildLearningPlatform.tsx::ActivityScreen`

Migration results:

### ChoiceActivity

Preserved:

```text
onDone(completeActivity(childId, activity.id))
```

New post-success presentation:

```text
feedback = "good"
→ ActivityCompletion
→ CanonicalCompletion
→ CanonicalShareDialog
```

Again resets only local choice feedback.

The old local `Hebat! Aktivitas selesai.` success banner is removed.

### MatchingActivity

Already canonical before SI-06A.

Preserved unchanged:

- pair-selection logic;
- matching seed/layout behavior;
- `completeActivity`;
- existing `ActivityCompletion`;
- local retry/reseed semantics.

SI-06A normalizes this as part of the bounded owner without rewriting it.

### TraceActivity

Preserved:

- canvas/pointer drawing owner;
- existing stroke state;
- `completeActivity`;
- existing reset that clears canvas/stroke state.

The old local success banner is replaced by `ActivityCompletion`.

Canonical Again reuses the existing canvas reset function.

### ColoringActivity

The legacy fallback code is normalized to `ActivityCompletion` if invoked directly,
but production coloring is no longer routed here.

Production ownership remains:

```text
runtime === "coloring"
→ CreativePracticeActivity
```

Creative workspace acceptance remains SI-06G.

### StoryActivity

Preserved:

- story content;
- narration source;
- renderer-owned `completeActivity`.

The old local post-story subject exit is replaced by `ActivityCompletion`.

Again resets only local completion state and leaves the story content mounted.

### MotionActivity

Untouched.

It remains a redirect/entry owner for Main Gerak and gets no invented completion
semantics in SI-06A.

## Global fallback exit cleanup

The old parent-level rule:

```text
done && runtime != motion_game && runtime != matching
→ "Pilih permainan lain"
```

is removed.

Canonical post-success navigation now lives in `ActivityCompletion`; persisted progress
no longer causes a generic local success/exit surface to appear merely by revisiting a
completed fallback route.

## Learning/evidence boundary

SI-06A does not edit:

- `LearningAttemptBridge`;
- activity catalog/specs;
- learning measurement architecture;
- mastery/evidence model;
- database/schema;
- progression semantics.

Every migrated fallback runtime still calls `completeActivity` from the renderer
that already owned success.

Canonical Completion/Share remain presentation-only.

## Static QA

New:

```text
scripts/run-si06a-fallback-belajar-tests.mjs
npm run test:learning:si06a-fallback
```

Locks:

- Choice/Matching/Trace/Coloring/Story fallback code uses `ActivityCompletion`;
- renderer-owned `completeActivity` calls remain;
- Choice/Trace/Story local Again semantics remain local;
- global duplicate `Pilih permainan lain` fallback exit is removed;
- Motion remains redirect-only;
- production coloring is intercepted by CreativePractice before fallback;
- `math-count-3` is intercepted by CountAndSelect before World fallback;
- SI-06A does not modify old `MathCountActivity` or claim it as reachable.

## Browser QA

New:

```text
scripts/run-si06a-fallback-belajar-browser-tests.mjs
npm run test:ui:si06a-fallback
```

Representative production routes:

```text
Choice:
  /child/demo-gian/activity/english-find-blue

Matching:
  /child/demo-gian/activity/english-match-hello

Trace:
  /child/demo-gian/activity/letters-trace-a

Story:
  /child/demo-gian/activity/bahasa-cerita-teman
```

Acceptance proves:

- each route resolves through its current production owner;
- Choice wrong answer does not complete;
- Choice correct answer writes one assessed attempt and preserves wrong/correct/retry/accuracy evidence;
- canonical Completion action order is Back / Again / Next / Share;
- canonical Share remains public-safe;
- opening Share and rotating portrait→landscape do not duplicate attempt/evidence;
- rotation does not reload the document;
- Again returns to the local Choice board without creating another attempt;
- fallback Matching reaches canonical Completion and Again resets/reseeds cards;
- fallback Trace reaches canonical Completion and Again clears stroke state;
- fallback Story reaches canonical Completion and Again keeps story content mounted;
- no fallback-local `Pilih permainan lain` exit remains.

The new static gate is wired into `test:learning`; browser QA is wired into the
permanent mobile route matrix after SI-05.

## Historical helper note

`scripts/run-local-garden-check.mjs` still contains old manual expectations such as
`Pilih permainan lain` after Matching. It was already stale before SI-06A because
Matching had used `ActivityCompletion` before this batch.

It is not used as the canonical SI-06A acceptance contract and is not rewritten in
this batch. The permanent wired CI path is the dedicated SI-06A browser QA plus the
main mobile-route matrix.

## Explicit non-scope

Do not expand SI-06A into:

- SI-06B literacy/audio specialized renderers;
- CreativePractice/coloring/drawing migration;
- CountAndSelect or Math family migration;
- any Logic/Science specialized family;
- World;
- Bermain;
- Journey Map;
- Shop;
- LearningAttemptBridge;
- catalog/spec changes;
- evidence/mastery/progression architecture.

## Merge gate

Do not merge until latest-head CI proves:

1. Ubuntu quality full green;
2. Windows compatibility full green;
3. production build full green;
4. dependency audit full green;
5. secret-history scan full green;
6. Chromium mobile-route matrix full green;
7. permanent visual baseline full green.

After merge require push-to-main full green plus exact Cloudflare smoke for the
merged SHA.

## Next after SI-06A closure

Only after SI-06A is merged/live verified:

`SI-06B — literacy/audio specialized renderers`

Preflight SI-06B before mutation and split the suggested set if one owner session
would be too large.
