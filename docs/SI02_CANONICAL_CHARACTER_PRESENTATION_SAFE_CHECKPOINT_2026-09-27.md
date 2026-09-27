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

A fresh full CI run after that fix and the documentation commits is mandatory.

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
