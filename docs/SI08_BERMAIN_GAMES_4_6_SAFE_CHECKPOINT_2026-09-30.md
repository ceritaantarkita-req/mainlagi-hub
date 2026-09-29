# SI-08 Bermain Games 4–6 Safe Checkpoint — 30 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

This file is the canonical resume point for Shared Interaction after SI-08. Do not restart SI-06A through SI-06G, SI-07, or SI-08 from older handoffs.

## Verified baseline

```text
pre-SI-08 main:          1aeae074031e11f59f71371160b5975f751b8012
runtime PR:              #394 — merged
final PR head:           3a459ddfe9629ffdf7259c8df04106c4af72a3e5
final PR CI:             #2281 / run 36616112219 — FULL SUCCESS
merged runtime main:     079481868b38f847193e4cda381609d88d0ce0b3
merged-main CI:          #2282 / run 36617407662 — FULL SUCCESS
Cloudflare smoke:        SUCCESS — exact merged runtime SHA verified
checkpoint:              docs/SI08_BERMAIN_GAMES_4_6_SAFE_CHECKPOINT_2026-09-30.md
```

Merged-main CI #2282 passed Production build, Quality gate (Ubuntu), Windows compatibility, Secret history scan, Mobile route QA (Chromium), Production dependency audit, and Production smoke (Cloudflare).

## Migrated games

SI-08 is exactly canonical games 4–6:

1. `shape-quest` — `ShapeQuestGame`
2. `pattern-race` — `PatternRaceGame -> DigitRace(kind="pattern")`
3. `math-warung` — `MathWarungGame`

SI-07 games 1–3 remain canonical and unchanged. Games 7–10 remain outside SI-08.

## Runtime contract

SI-08 reuses the proven SI-07 seam rather than creating a second terminal system:

```text
existing game timer / score / progress sync
-> RoundEndOverlay(canonical)
-> BermainCompletion
-> CanonicalCompletion(context="bermain")
-> CanonicalShareDialog(context="bermain")
```

For games 4–6:

- **Back** -> existing public game detail `/games/{slug}`;
- **Again** -> existing `GameShell.replay()` session-key remount without document reload;
- **Next** -> next entry in canonical `GAME_SLUGS` order;
- **Share** -> canonical parent-gated Bermain Share with public `/play/{slug}` target;
- existing score/winner context remains visible;
- existing `LeaderboardCapture` remains active;
- existing recalibration remains available;
- Gavi + Paca completion presentation remains shared through `BermainCompletion`;
- gameplay-header legacy `ShareButton` is retired for the migrated games only.

Batch markers are now scoped by game position:

```text
data-si07-bermain="games-1-3" -> games 1–3 only
data-si08-bermain="games-4-6" -> games 4–6 only
```

## Shared-owner details

### Shape Quest

Only the terminal opt-in changes. Guided shape tracing, closure requirements, scoring thresholds, retry behavior, timer, and progress sync are unchanged.

### Pattern Race

`DigitRace` is shared by:

- `MathMotionGame(kind="math")` — migrated in SI-07;
- `PatternRaceGame(kind="pattern")` — migrated in SI-08.

After SI-08 both uses of `DigitRace` intentionally terminate through the canonical Bermain completion. Math/pattern question generation, difficulty, handwriting confirmation, scoring, and per-player progression remain unchanged.

### Math Warung

Only the timer terminal path changes. Product selection, pinch/drag cart interaction, checkout, total/change choice logic, score, timer, and progress sync remain unchanged.

## QA added

Static regression:

```text
npm run test:interaction:si08-bermain
```

Browser regression:

```text
npm run test:ui:si08-bermain
```

The static suite is wired into `test:interaction`; the browser suite is wired into the blocking canonical mobile-route matrix.

Browser QA opens all three production routes in demo/challenge mode, advances the existing timer to completion, and verifies:

- SI-08 batch-specific canonical Completion appears;
- exact three-star contract;
- exactly one Back / Again / Next / Share control;
- score context remains;
- recalibration remains;
- legacy gameplay-header Share is absent;
- Shape Quest Again dismisses completion and returns to local session flow without a document reload.

## CI-discovered QA refinement

The first PR run (#2280) reached the SI-08 browser test and failed only because its Again regression waited for the replayed game HUD after the countdown. That wait tested CI timing rather than the actual ownership guarantee.

The final regression does not weaken the runtime contract. It now:

1. installs a same-document probe on `window`;
2. clicks canonical Again;
3. requires the local countdown screen to appear;
4. requires the probe to survive, proving no document reload;
5. requires the SI-08 completion overlay to be dismissed.

Final PR CI #2281 and merged-main CI #2282 both passed the corrected blocking regression.

## Explicit non-scope

SI-08 does not change:

- SI-09 games 7–10;
- `iqro-motion`;
- `airboard-presenter`;
- `dodge-motion`;
- `run-to-target`;
- AirBoard terminal semantics;
- Motion Engine recognition/scoring mechanics;
- World;
- Belajar;
- Journey Map;
- Shop;
- database/schema/migrations;
- learning attempt/mastery/evidence architecture.

## Resume authority

SI-08 runtime is merged and live verified at **`main@079481868b38f847193e4cda381609d88d0ce0b3`** via CI **#2282 / run `36617407662`**, including Production smoke (Cloudflare).

**CURRENT HARD STOP:** SI-09 — Bermain games 7–10 — is PAUSED / not authorized.

SI-09 contains the open-ended `airboard-presenter` exception. AirBoard currently has no explicit terminal state, so a future SI-09 authorization must not silently invent completion semantics. An explicit product decision is required for what counts as AirBoard completion before canonical Completion can be applied there.
