# SI-08 Bermain Games 4–6 Safe Checkpoint — 30 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

This file is the canonical Shared Interaction resume point after SI-08. Do not restart SI-06A through SI-06G, SI-07, or SI-08 from older handoffs.

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

During documentation closure on 30 September, the dependency gate picked up newly published advisories against transitive `undici@7.29.0` in the Cloudflare tooling chain. Security PR #397 pinned patched `undici@7.29.1` without changing Mainlagi runtime/product behavior, merged to `main@42f0496d2a114ebb913574f840b497ef4d8b588a`, and merged-main CI #2286 / run `36655975699` passed all gates including exact Cloudflare production smoke.

## Migrated games

SI-08 is exactly canonical `GAME_SLUGS` games 4–6:

1. `shape-quest`
2. `pattern-race`
3. `math-warung`

SI-07 games 1–3 remain canonical and regression-covered. Games 7–10 are outside SI-08.

## Runtime contract

SI-08 reuses the canonical Bermain terminal path established in SI-07:

```text
existing game timer / score / progress sync
-> RoundEndOverlay(canonical)
-> BermainCompletion
-> CanonicalCompletion(context="bermain")
-> CanonicalShareDialog(context="bermain")
```

For games 4–6:

- **Back** returns to the existing public game detail;
- **Again** uses the existing local `GameShell.replay()` / `sessionKey` seam and does not reload the document;
- **Next** follows deterministic canonical `GAME_SLUGS` order;
- **Share** uses canonical parent-gated Bermain Share and a public play target without child/private identifiers;
- score context, leaderboard capture, timer/progress semantics and recalibration remain intact;
- the legacy gameplay-header Share is retired for the newly migrated games so the canonical completion owns Share;
- Motion Engine / gesture / tracing mechanics are unchanged.

The shared `DigitRace` terminal is canonical for both the historical SI-07 math variant and the SI-08 `pattern-race` variant. SI-07 regression was updated to preserve that shared ownership rather than falsely requiring `pattern-race` to stay legacy.

## Verification

Dedicated static regression:

```text
npm run test:interaction:si08-bermain
```

Dedicated browser regression:

```text
npm run test:ui:si08-bermain
```

Both are wired into blocking repository gates. Browser QA verifies all three SI-08 games reach canonical Completion, expose exactly one Back / Again / Next / Share action, retire the duplicate gameplay-header Share, retain score/calibration context, and preserve same-document Again replay.

## Explicit non-scope

SI-08 does not change:

- SI-09 games 7–10;
- AirBoard terminal semantics;
- World;
- Belajar;
- Journey Map;
- Shop;
- database/schema/migrations;
- learning attempt/mastery/evidence architecture;
- Motion Engine recognition/scoring mechanics.

## Resume authority

SI-08 runtime is merged and live verified at **`main@079481868b38f847193e4cda381609d88d0ce0b3`** via CI **#2282 / run `36617407662`**, including Production smoke (Cloudflare).

The SI-07 hard stop is historical and was superseded by the explicit project-owner authorization that started SI-08.

The SI-09 hard stop recorded at this checkpoint was subsequently superseded by explicit project-owner authorization. SI-09 is now merged/live verified and the AirBoard terminal-state decision is closed through the explicit `Selesai` workspace path.

**CURRENT RESUME AUTHORITY:** `docs/SI09_BERMAIN_GAMES_7_10_SAFE_CHECKPOINT_2026-09-30.md`. Its hard stop is SI-10 — World adapter.
