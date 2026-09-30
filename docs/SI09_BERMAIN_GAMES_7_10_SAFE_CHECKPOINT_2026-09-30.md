# SI-09 — Bermain Games 7–10 Safe Checkpoint — 30 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

This is the canonical Shared Interaction resume authority after SI-09. It supersedes the SI-08 hard stop and freezes the verified runtime truth for the final Bermain completion-migration batch.

## Verified runtime baseline

```text
pre-SI-09 main:           d693f49107406f906f955657ee93259bbc3ba9e2
runtime PR:               #399 — merged
final PR head:            5d7460543b608763b6ab4aa2316a6a0f13d92ee3
final PR CI:              #2290 / run 36662285110 — FULL SUCCESS
verified runtime main:    9109f57978ea7e834772859be01227e720be8de0
merged-main CI:           #2291 / run 36663304501 — FULL SUCCESS
Production smoke:         SUCCESS — exact merged runtime SHA verified
SI-07 games 1–3:          CLOSED / MERGED / LIVE VERIFIED
SI-08 games 4–6:          CLOSED / MERGED / LIVE VERIFIED
SI-09 games 7–10:         CLOSED / MERGED / LIVE VERIFIED
next Shared Interaction:  SI-10 — World adapter — AUTHORIZED / IN PROGRESS
```

All merged-main gates passed: Production build, Quality gate (Ubuntu), Windows compatibility, Secret history scan, Mobile route QA (Chromium), Production dependency audit, and Production smoke (Cloudflare).

During documentation closure on 30 September, the dependency gate picked up newly published high-severity advisories against transitive `brace-expansion` versions in production tooling paths. Isolated security PR #401 refreshed only `package-lock.json` to patched `brace-expansion@2.1.7` and `brace-expansion@5.0.12`; it did not change Mainlagi product/runtime behavior. PR CI #2294 / run `36665820491` passed all gates, the fix squash-merged to `main@50a56748f11168da76ae22f3977c3a8c1a333da2`, and merged-main CI #2295 / run `36666750509` passed all gates including exact Cloudflare production smoke.

## Scope closed by SI-09

SI-09 owns exactly the final four canonical `GAME_SLUGS`:

7. `iqro-motion`
8. `airboard-presenter`
9. `dodge-motion`
10. `run-to-target`

The three finite/timed games preserve their existing timer, score, progress, leaderboard and recalibration semantics while opting their existing `RoundEndOverlay` into canonical Bermain Completion.

Canonical runtime path:

```text
existing game timer / score / progress
-> RoundEndOverlay(canonical)
-> BermainCompletion
-> CanonicalCompletion(context="bermain")
-> CanonicalShareDialog(context="bermain")
```

The duplicate gameplay-header Share is retired for games 7–10, completing the retirement across all ten canonical Bermain games.

## Canonical navigation contract

For SI-09:

- **Back** returns to the existing public game-detail route.
- **Again** uses the existing local `GameShell.replay()` / `sessionKey` seam in the same document; it does not reload the page.
- **Next** follows canonical `GAME_SLUGS` order.
- AirBoard Next resolves to `/play/dodge-motion`.
- final `run-to-target` Next wraps to `/play/math-choice`.
- **Share** uses the canonical parent-gated Bermain share flow and targets the public `/play/{slug}` surface without child/private identifiers.

## AirBoard terminal decision — CLOSED

SI-09 resolves the genuine open-ended AirBoard exception explicitly instead of inventing timer or score semantics.

AirBoard remains an open-ended presenter/workspace and now exposes an explicit **Selesai** action.

Its terminal path is:

```text
AirBoard workspace
-> explicit Selesai
-> BermainCompletion(resultMode="workspace")
-> CanonicalCompletion(context="bermain")
-> CanonicalShareDialog(context="bermain")
```

The workspace completion deliberately:

- does **not** invent a score;
- does **not** write a leaderboard result;
- does **not** invent learning/game progress evidence;
- preserves calibration access;
- preserves canonical Back / Again / Next / Share;
- resets through the existing local replay/session seam when Again is chosen.

This decision closes the SI-00 AirBoard terminal-state blocker for Bermain completion coverage.

## Verification

Dedicated static regression:

```text
npm run test:interaction:si09-bermain
```

Dedicated production-browser regression:

```text
npm run test:ui:si09-bermain
```

Both are wired into blocking repository gates.

Browser QA proves all four SI-09 games reach canonical Completion, expose exactly one Back / Again / Next / Share action, retire the legacy gameplay-header Share, retain calibration, and preserve existing score context for the three finite games. It separately proves AirBoard workspace completion has no fake score result, follows canonical Next ordering, and Again stays in the same document while resetting through the existing session seam.

SI-08 historical regression was updated only to acknowledge the later SI-09 canonicalization and explicit AirBoard decision. SI-07/SI-08 runtime mechanics were not reopened.

## Explicit non-scope

SI-09 does not change:

- Motion Engine recognition/scoring mechanics;
- World runtime or World completion/share;
- Belajar;
- Journey Map;
- Shop;
- database/schema/migrations;
- learning attempt/mastery/evidence architecture;
- World progression/evidence;
- game catalog ordering.

## Resume authority

SI-09 runtime is merged and live verified at **`main@9109f57978ea7e834772859be01227e720be8de0`** via merged-main CI **#2291 / run `36663304501`**, including exact Production smoke (Cloudflare).

The SI-08 hard stop is historical and was superseded by the explicit project-owner authorization that started SI-09.

The SI-10 hard stop recorded by this checkpoint was superseded on 30 September 2026 by explicit project-owner authorization. Current execution authority is `docs/SI10_WORLD_ADAPTER_EXECUTION_CHECKPOINT_2026-09-30.md`. Repository truth also records that SI-02 already closed the `SpeechCard` visible-name-label removal and World safe-character geometry; SI-10 preserves those contracts while migrating World Completion/Share. SI-11 and Journey Map work remain unauthorized.
