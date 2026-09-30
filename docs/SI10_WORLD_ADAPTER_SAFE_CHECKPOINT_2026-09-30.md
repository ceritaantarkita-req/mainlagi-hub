# SI-10 — World Adapter Safe Checkpoint — 30 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

This is the historical live-verified predecessor checkpoint after SI-10. It superseded the SI-10 execution checkpoint at the time and freezes the verified World Completion/Share migration truth. Current Shared Interaction authority is `SI11_SHARED_INTERACTION_INTEGRATED_CLOSURE_SAFE_CHECKPOINT_2026-09-30.md`.

## Verified runtime baseline

```text
pre-SI-10 main:           c73e450581c8c4542933ab251a9b3880b81722c7
runtime PR:               #403 — merged
final PR head:            e290fa08d418fee4761574b836a6ae19c888f56e
final PR CI:              #2302 / run 36675680322 — FULL SUCCESS
verified runtime main:    62a4676a50dc4f7a2b068118479bc0758bd40881
merged-main CI:           #2303 / run 36676747658 — FULL SUCCESS
Production smoke:         SUCCESS — exact merged runtime SHA verified
SI-09:                    CLOSED / MERGED / LIVE VERIFIED
SI-10:                    CLOSED / MERGED / LIVE VERIFIED
historical next at SI-10: SI-11 — now CLOSED / LIVE VERIFIED
```

All merged-main gates passed on exact `main@62a4676a50dc4f7a2b068118479bc0758bd40881`: Production build, Quality gate (Ubuntu), Windows compatibility, Secret history scan, Mobile route QA (Chromium), Production dependency audit, and Production smoke (Cloudflare).

## Scope closed by SI-10

SI-10 migrates the remaining World-specific Completion/Share duplication:

```text
MoneyWorldExperience::WorldStageCompletion
-> CanonicalCompletion(context="world", surface="inline")
-> CanonicalShareDialog(context="world")
```

The canonical World adapter preserves:

- exactly three completion stars;
- Back -> existing Petualangan Uang map route;
- Again -> existing `restartMoneyWorldStage(childId, stageId)` same-document restart seam;
- Next -> existing `nextMoneyWorldStage(stageId)` order, with final Stage returning to the World map;
- chapter/stage hierarchy context;
- Chapter milestone supporting content;
- final Festival completion semantics;
- canonical Gavi + Paca celebration cast;
- the public-safe `/worlds/money-festival` share target;
- parent-gated canonical Share;
- existing narration behavior.

The World component no longer owns duplicate clipboard/native-share/provider/share-gate logic.

## Progression and evidence boundary — PRESERVED

SI-10 does not rewrite World learning/progression behavior.

The existing owners remain intact:

- `completeMoneyWorldStage(childId, stageId)`;
- `restartMoneyWorldStage(childId, stageId)`;
- `syncMoneyWorldProgressCloud`;
- World supplemental evidence observation/emission;
- eight-stage authored order;
- Chapter / Stage / Scene / Segment structure.

No database/schema migration, mastery rewrite, evidence mapping expansion, or attempt-bridge activation was introduced.

## SI-02 character guarantees — PRESERVED, not reimplemented

The historical SI-00 scope listed World `SpeechCard` label cleanup and character safe geometry under SI-10, but repository truth had already advanced.

SI-02 had already:

- removed the visible `SpeechCard` character-name label at source;
- live-verified the shared `safe-contain-v1` geometry contract;
- covered World SpeechCard and World completion in portrait and landscape.

SI-10 preserves those guarantees through permanent regression. It does not reopen character production or create new character assets/states.

## Permanent regression coverage

Dedicated static regression:

```text
npm run test:learning:si10-world
```

Dedicated production-browser regression:

```text
npm run test:ui:si10-world
```

They are wired into the blocking repository gates:

- static SI-10 contract through `test:learning` / Engine tests;
- browser SI-10 contract through `test:ui:mobile-routes` / Mobile route QA (Chromium).

The existing World route and `world-money` regressions were also advanced from the retired bespoke completion-heading implementation detail to the canonical `aria-labelledby` / `data-canonical-completion="v1"` contract.

Final browser acceptance proves:

- canonical World Completion ownership;
- canonical World Share ownership;
- exact Back / Again / Next / Share action order;
- public-only World share payloads;
- same-document Again;
- stage-order Next routing;
- Gavi/Paca cast preservation;
- portrait -> landscape -> portrait completion-state preservation;
- SI-02 no-visible-name-label preservation;
- World completion geometry through the existing SI-02 browser suite.

## Explicit non-scope

SI-10 does not change:

- Journey Map design;
- World story content;
- eight-stage order;
- World progression/evidence semantics;
- database/schema/migrations;
- learning attempt/mastery architecture;
- Belajar;
- Bermain gameplay;
- Motion Engine;
- Shop;
- character development/assets.

## Resume authority / hard stop

SI-10 runtime is merged and live verified at **`main@62a4676a50dc4f7a2b068118479bc0758bd40881`** via merged-main CI **#2303 / run `36676747658`**, including exact Production smoke (Cloudflare).

The SI-10 execution checkpoint is now historical authorization evidence only.

**Historical SI-10 hard stop:** SI-11 required explicit authorization. That authorization was subsequently given; SI-11 is now merged/live verified at `main@a4619c31f9ed928c420dab6704b93ad22d4d28c3` via merged-main CI #2309 / run `36685743612`, including exact Cloudflare smoke.

Current Shared Interaction authority is `SI11_SHARED_INTERACTION_INTEGRATED_CLOSURE_SAFE_CHECKPOINT_2026-09-30.md`. Journey Map redesign remains separate and was not authorized by SI-11.
