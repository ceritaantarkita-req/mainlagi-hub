# SI-07 Bermain Games 1–3 Safe Checkpoint — 29 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

This file is the canonical resume point for Shared Interaction after SI-07. Do not restart SI-06A through SI-06G or SI-07 from older handoffs.

## Verified baseline

```text
pre-SI-07 main:          c4889088d255035319b65875869795c53747e227
runtime PR:              #392 — merged
final PR head:           a33a365cc31f79a9b406b5c5b7a20d5a29935625
final PR CI:             #2276 / run 36586675110 — FULL SUCCESS
merged runtime main:     b76c0fd5a116c060b06e3c1bcfc5f70992168e79
merged-main CI:          #2277 / run 36588104198 — FULL SUCCESS
Cloudflare smoke:        SUCCESS — exact merged runtime SHA verified
checkpoint:              docs/SI07_BERMAIN_GAMES_1_3_SAFE_CHECKPOINT_2026-09-29.md
```

Merged-main CI #2277 passed Production build, Quality gate (Ubuntu), Windows compatibility, Secret history scan, Mobile route QA (Chromium), Production dependency audit, and Production smoke (Cloudflare).

## Migrated games

SI-07 is exactly the first three canonical `GAME_SLUGS`:

1. `math-choice` — `MathChoiceGame`
2. `math-motion-battle` — `MathMotionGame -> DigitRace(kind="math")`
3. `number-trace` — `NumberTraceGame`

Games 4–10 are not migrated by SI-07.

In particular, `DigitRace(kind="pattern")` for `pattern-race` remains on the legacy terminal path.

## Runtime contract

The shared `RoundEndOverlay` remains the terminal seam, but canonical migration is explicit and opt-in through its SI-07 adapter.

For the three migrated games:

```text
existing game timer / score / progress sync
-> RoundEndOverlay(canonical)
-> BermainCompletion
-> CanonicalCompletion(context="bermain")
-> CanonicalShareDialog(context="bermain")
```

Canonical Completion behavior:

- **Back** -> existing public game detail `/games/{slug}`;
- **Again** -> existing `GameShell.replay()` seam, which remounts the game session through `sessionKey` and does not reload the document;
- **Next** -> next entry in canonical `GAME_SLUGS` order;
- **Share** -> canonical parent-gated Bermain Share using the public `/play/{slug}` target;
- existing score and winner presentation remain visible;
- existing `LeaderboardCapture` remains active;
- existing recalibration remains available as supporting completion action;
- Gavi + Paca `play_completion` character presentation remains active.

The legacy gameplay-header `ShareButton` is retired only for these three migrated games so there are not two competing Share experiences. Non-SI-07 games keep the existing gameplay-header Share until their own migration batch.

## Character geometry fix found by CI

The first SI-07 browser run exposed two separate issues:

1. the historical SI-02 browser regression still waited for the old `.round-end-overlay` selector after `math-choice` intentionally moved to canonical Completion;
2. after updating that regression to the new owner, it correctly detected Paca extending below the canonical completion ensemble safe box.

The final implementation:

- updates SI-02 geometry QA to follow `[data-si07-bermain="games-1-3"]`;
- keeps the original full-body/no-crop assertions;
- reserves the ensemble's intentional vertical stagger inside the SI-07 completion slot;
- passes portrait <-> landscape geometry QA without weakening the assertion.

## Verification

New static regression:

```text
npm run test:interaction:si07-bermain
```

It is wired into the existing `test:interaction` / engine gate.

The blocking browser matrix also re-verifies the existing SI-02 character geometry path against the new SI-07 completion owner.

Verified invariants include:

- exactly the first three games opt into canonical completion;
- `pattern-race` remains legacy;
- no document reload for Again;
- canonical Share receives no child/private identifiers;
- score/leaderboard/recalibration semantics remain available;
- character cast is contained in portrait and short landscape;
- legacy header Share remains for non-migrated games.

## Explicit non-scope

SI-07 does not change:

- SI-08 games 4–6;
- SI-09 games 7–10;
- AirBoard terminal semantics;
- Motion Engine recognition/scoring mechanics;
- World;
- Belajar;
- Journey Map;
- Shop;
- database/schema/migrations;
- learning attempt/mastery/evidence architecture.

## Resume authority

SI-07 runtime is merged and live verified at **`main@b76c0fd5a116c060b06e3c1bcfc5f70992168e79`** via CI **#2277 / run `36588104198`**, including Production smoke (Cloudflare).

The SI-06G hard stop is historical and was superseded by the explicit user authorization that started SI-07.

**CURRENT HARD STOP:** SI-08 — Bermain games 4–6 — is PAUSED / not authorized. Do not start SI-08 or SI-09 without explicit user authorization.
