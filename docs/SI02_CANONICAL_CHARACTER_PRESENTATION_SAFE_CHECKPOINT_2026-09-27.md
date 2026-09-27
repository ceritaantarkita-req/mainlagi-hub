# SI-02 Canonical Character Presentation — Safe Checkpoint — 27 September 2026

Status: **IMPLEMENTATION COMPLETE ON BRANCH / PR OPEN / FULL CI REVALIDATION REQUIRED BEFORE MERGE**

## Resume point

Continue from this exact workstream. Do **not** restart SI-02 from SI-00 or rebuild the character runtime.

```text
repository: ceritaantarkita-req/mainlagi-hub
base main:  f2b3768745f11e4fa33954d61aabb1a01acda2ff
branch:     agent/si-02-canonical-character-presentation-20260927
PR:         #363 — feat: complete SI-02 canonical character presentation
latest known safe-fix commit before docs:
            925ee36f515343cb0b066e9b3bb293a58955bfc6
```

SI-01 is already merged/live and is the required orientation substrate for this work.

## Scope completed on the SI-02 branch

### Shared CharacterLayer geometry

`src/components/learning/CharacterLayer.tsx` and `CharacterLayer.module.css` now define a shared geometry contract:

```text
data-character-geometry="safe-contain-v1"
```

The contract:

- reserves shared top/right/bottom/left safe-area insets;
- anchors characters inside the containing slot;
- bounds character height by the actual slot height rather than relying on clipping;
- preserves `object-fit: contain` and intrinsic SVG proportions;
- consumes the SI-01 `data-mainlagi-orientation="landscape"` signal for short-landscape composition;
- remains pointer-transparent and decorative;
- preserves reduced-motion behavior;
- does not change cast, character IDs, character state resolution, asset provenance, learning state, World state, or game state.

This is a geometry/presentation change only. It does not add or redesign character artwork.

### Belajar caller safety

The existing Belajar character presentation remains centralized through `GardenActivityFrame -> CharacterLayer`.

The SI-02 branch also tightens the Belajar content-safe geometry so decorative characters remain outside the task-content safe box in portrait and landscape.

No activity correctness, evidence, mastery, progression, attempt recording, or 900-activity routing is changed.

### World SpeechCard

The floating visible name below World character art has been removed at its source:

```tsx
<strong>{runtimeCharacter.name}</strong>
```

is no longer rendered.

The obsolete name-label CSS was removed.

Removing that text exposed an intrinsic-width dependency in `.storyCharacter`. Browser QA correctly caught the character art slot collapsing to width 0. The branch then fixed the caller geometry by giving `.storyCharacter` an explicit bounded width and making `.storyCharacterArt` fill that slot.

### World completion

World stage completion continues to use the existing Gavi + Paca `celebrate` presentation and its existing completion/evidence/progression semantics. SI-02 only applies the canonical no-crop geometry contract.

### Bermain RoundEndOverlay

The existing shared `RoundEndOverlay` still owns the nine terminal game surfaces that already use it. SI-02 applies only the character geometry contract to the existing Gavi + Paca `play_completion` presentation.

No canonical Completion migration is performed here. That belongs to SI-03 and later migration sessions.

## Regression coverage

New browser QA:

```text
scripts/run-si02-character-geometry-browser-tests.mjs
npm run test:ui:character-geometry
```

It is wired into `test:ui:mobile-routes`.

Required representative surfaces:

1. Belajar activity — English Naya + Zia;
2. World SpeechCard;
3. World stage completion;
4. Bermain RoundEndOverlay.

The QA checks portrait -> landscape -> portrait and asserts:

- `safe-contain-v1` geometry marker;
- measurable CharacterLayer slot geometry;
- non-zero decoded/rendered SVG geometry;
- no left/right/top/bottom crop inside the slot;
- intrinsic aspect ratio preservation;
- characters remain inside the viewport;
- no horizontal document overflow;
- Belajar characters stay outside the task-content safe box;
- orientation does not reset character/Scene/completion state;
- World SpeechCard has no floating character-name label.

Static character/world regression tests additionally lock the shared safe-area contract and forbid reintroducing `runtimeCharacter.name`.

## CI evidence so far

Historical failing attempts must not be treated as closure.

### PR CI #1835 / run 36313509709

Failed while SI-02 tests were still being hardened.

### PR CI #1841 / run 36314913042

All of the following passed:

```text
Quality gate (Ubuntu):       PASS
Windows compatibility:      PASS
Production build:            PASS
Production dependency audit: PASS
Secret history scan:         PASS
```

Only:

```text
Mobile route QA (Chromium): FAIL
```

failed, at the new SI-02 assertion:

```text
World SpeechCard portrait:
character slot must have measurable geometry
width = 0
```

The exact root cause was the World story-character column losing intrinsic width after the visible name label was removed.

Fix:

```text
925ee36f515343cb0b066e9b3bb293a58955bfc6
fix: preserve World story character slot after label removal
```

A fresh full CI run after that fix and the documentation commits was run as PR CI #1855 / run `36322945728`.

### PR CI #1855 / run 36322945728

All non-browser gates passed again:

```text
Quality gate (Ubuntu):       PASS
Windows compatibility:      PASS
Production build:            PASS
Production dependency audit: PASS
Secret history scan:         PASS
```

The new SI-02 browser suite advanced past Belajar, World SpeechCard and World completion, then correctly caught a second caller-contract violation:

```text
Bermain RoundEnd portrait / Gavi:
no top crop assertion failed
```

Root cause: `src/app/globals.css` still set `max-height: 120px` directly on `.round-end-character-layer img`. That selector was more specific than the shared CharacterLayer rule and bypassed the new slot-bounded max-height calculation.

The fix routes caller preferences through the shared custom property instead:

```text
--character-max-height
```

and removes direct image `max-height` overrides from RoundEnd, Preflight and the legacy motion hero caller. Static regression now forbids those caller overrides.

Fix commits:

```text
cde2bb7346f7c9ca674f4a38c8083b4b7832b7b5
fix: route Bermain character sizing through shared geometry

e94f94b2db270b65c54daf9ad103ccbcecf920f2
fix: preserve shared character height ownership

7bc1a62afc96dd528bd733b722ca0643074acb6a
test: forbid caller max-height overrides on CharacterLayer
```

A fresh latest-head full CI after these fixes remains mandatory.

### PR CI #1862 / run 36323609731

This run included the shared height-ownership fixes. All non-browser gates passed and SI-02 browser QA advanced through the previous RoundEnd top-crop assertion. The next assertion then caught aspect-ratio distortion on the same RoundEnd character.

Root cause:

- shared/caller CSS still used a definite `width`;
- the shared slot then applied a smaller `max-height`;
- the browser could clamp height while leaving the definite width, distorting the image box.

Canonical sizing was corrected so CharacterLayer images use:

```text
width: auto
max-width: <presentation preference>
max-height: <shared slot bound>
```

The same presentation-only correction was applied to known CharacterLayer caller width preferences in Bermain, World and the legacy motion hero so intrinsic 500x650 SVG proportions remain authoritative.

Fix commits:

```text
e9743583ed9d0a627e23f1a697f76d90bb34885a
fix: preserve intrinsic character aspect ratio

96e147235af2aa3a8405f12df9259bc2ff4f1879
fix: use max-width preferences for Bermain characters

e93194edf57a04cb1d27c6788af59b620d78caf0
fix: preserve World character intrinsic ratio

cfdccf373f41f727feb6d458c57cfffda0510f8f
fix: preserve motion character intrinsic ratio

5222d0b0733e54d4e52479eb7ccb84fa58b1f0fa
test: lock intrinsic-ratio character sizing
```

This checkpoint remains branch-safe only until a later latest-head run is full green.

### PR CI #1872 / run 36324344473

The intrinsic-ratio fixes passed all non-browser gates. The permanent Session 07 Belajar character regression then caught a narrow-portrait separation regression before the SI-02-specific suite ran:

```text
Bahasa / 320x740 portrait:
Gavi + Paca overlapped the symbol-hunt task field
```

The first attempted fix only increased bottom padding. Diagnostic PR CI #1883 proved that padding alone did **not** change the absolute CharacterLayer geometry; the same 320px overlap remained. That attempt is historical evidence only and is superseded.

Canonical fix:

- keep the normal overlay behavior at 390px+, tablet and desktop;
- keep the SI-01/SI-02 landscape side-gutter contract;
- only for narrow portrait phones `<=380px`, move the shared Belajar `CharacterLayer` into a dedicated flow-safe band **after** task content;
- reduce the now-unneeded large bottom padding in that narrow mode;
- keep creative workspaces excluded.

Current rule:

```css
@media(max-width:380px) and (orientation:portrait) {
  .garden:not(.workspace) {
    padding-bottom: max(28px, env(safe-area-inset-bottom));
  }

  .garden:not(.workspace) .characterLayer {
    position: relative;
    inset: auto;
    width: 100%;
    height: 150px;
    margin: 12px auto 0;
  }
}
```

This is a structural caller safe-area fix: characters are no longer geometrically capable of covering the task field in the affected narrow portrait class.

Current fix commits:

```text
d7bd8ec548f3e431ff2c3951686bd6a19e728e4e
fix: move narrow portrait characters into flow-safe band

29ce76d768702b8d2f2626ddc47f7c755ab5fc88
test: lock narrow portrait flow-safe character band
```

Earlier padding-only commits `5d0dbb4...`, `52308ea...`, `7f59d0b...`, and `c4d1b13...` remain in branch history but are superseded by the flow-safe-band rule above.

Any CI run whose head predates `29ce76d768702b8d2f2626ddc47f7c755ab5fc88` is superseded and cannot close SI-02.

## Merge/production gate

Do **not** merge PR #363 until:

1. latest-head PR CI is full green;
2. canonical mobile route QA including SI-02 is green;
3. permanent visual baseline is green;
4. PR is still based cleanly on current `main`;
5. after merge, push-to-main CI is full green;
6. exact Cloudflare production smoke verifies the merged `main` SHA.

Only then may this checkpoint be promoted from **branch-safe** to **merged/live verified**.

## Explicit non-scope

SI-02 must not expand into:

- new character identities, states, assets or redesign;
- canonical Completion implementation — SI-03;
- canonical Share implementation — SI-04;
- mass Belajar migration — SI-05/SI-06+;
- Bermain completion migration — SI-07 to SI-09;
- World Completion/Share migration — SI-10;
- Journey Map — JM-00 onward;
- Shop;
- learning attempt/evidence/mastery/progression/schema changes;
- World evidence architecture changes.

## Next work after SI-02 closure

Only after SI-02 is merged and production-smoke verified:

```text
SI-03 — Canonical Completion component
```

SI-03 should implement the already approved Completion visual/component without mass-migrating runtime families in the same session.

## Safe handoff summary

If another agent resumes this branch:

1. fetch PR #363 and use its latest head;
2. do not recreate the CharacterLayer safe-area system;
3. do not restore the World name label;
4. run/fix the latest CI only;
5. preserve the four-surface SI-02 browser acceptance;
6. merge only after full green;
7. run/verify post-merge production smoke;
8. then update this document from branch-safe to merged/live verified and move the roadmap to SI-03.
