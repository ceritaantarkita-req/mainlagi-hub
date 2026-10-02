# JM-17 — Petualangan Uang responsive Journey Map final closure

Date: **2 October 2026**  
Status: **CLOSED / MERGED / LIVE VERIFIED**  
Workstream: **Phase C — Canonical Journey Map System**

JM-16 predecessor:
- canonical closure: `JM16_MONEY_WORLD_DESKTOP_JOURNEY_MAP_FINAL_CLOSURE_2026-10-02.md`
- JM-16 runtime main: `544475c534a05176f9c6d349b32c3b37819f7e1f`
- JM-16 closure/docs main: `4e9f75d2f3f272388631f620cef50b459c17ec68`
- closure main CI **#2370 / run `36970834908` — FULL SUCCESS**
- exact Cloudflare smoke — **SUCCESS**

JM-17 runtime:
- PR **#432**
- final PR head `ed09dc20bea0f29060616e417d48a54f5916469c`
- PR CI **#2373 / run `36972969667` — FULL SUCCESS**
- merged main `b4473cc0582c096441e429b8ed94c20fc4bf1b8e`
- merged-main CI **#2374 / run `36974133135` — FULL SUCCESS**
- exact Production smoke (Cloudflare) — **SUCCESS**

## 1. Scope closed

JM-17 completes the **mobile/responsive Journey Map presentation for Petualangan Uang** on top of the JM-16 World-specific adapter.

No new progression model, curriculum model or Stage runtime was introduced.

The responsive presentation now covers:

- phone widths **320 / 390 / 430**;
- tablet width **768**;
- portrait → landscape → portrait same-document reflow;
- mobile-visible resume/checkpoint CTA;
- compact Chapter progress;
- explicit completed/current/locked Stage presentation;
- current Stage auto-return into view;
- minimum touch-target protection;
- illustrated World identity;
- no horizontal overflow;
- stable Stage routes.

## 2. Responsive presentation contract

### Phone

At phone widths, the map preserves the established **compact winding game-node** identity instead of turning Petualangan Uang into full-width lesson cards.

The phone presentation keeps:

- alternating left/right winding path;
- compact Stage node geometry;
- current Stage highlight;
- completed ★★★ state;
- semantic locked state;
- mobile resume/checkpoint card;
- Chapter banners contained inside the viewport.

### Tablet

At the audited 768px tablet width, the map uses a centered stacked responsive lane for clearer containment while consuming the same JM-16 adapter state.

### Rotation

The dedicated JM-17 regression verifies portrait → landscape → portrait reflow in the **same document**:

- no reload;
- progress preserved;
- resume route preserved;
- checkpoint intent preserved;
- current Stage projection preserved;
- no horizontal overflow.

## 3. World semantics preserved

JM-17 preserves the audited Petualangan Uang topology:

```text
World:                        money-festival
Chapters:                     2
Stages:                       8
Scenes:                       44
Segments:                     89
practice activity placements: 16
activities per Stage:         2
```

The runtime still uses:

```text
canonical World structure
+ existing MoneyWorldProgress
        ↓
buildMoneyWorldJourneyMap()
        ↓
responsive MoneyWorldMapScreen
        ↓
existing stable World Stage routes/runtime
```

Unchanged semantics:

- ordered-prefix Stage completion;
- Stage 1 initially unlocked;
- sequential Stage unlock;
- first incomplete Stage as current;
- completed Stage presentation exactly ★★★;
- `currentStageId + currentSegmentIndex` checkpoint/resume;
- World completion independent from Belajar mastery;
- existing stable Stage routes;
- no World Browse All;
- no second World progress store.

## 4. Permanent QA

JM-17 adds the marker:

```text
data-world-journey-responsive="jm17"
```

and permanent browser QA:

```text
test:ui:jm17-world-responsive
```

The test is wired into blocking `test:ui:mobile-routes` and verifies:

- 320 / 390 / 430 phone containment;
- 768 tablet containment;
- exact two Chapter banners;
- exact eight canonical Stage order;
- completed/current/locked state projection;
- checkpoint resume text + stable href;
- `aria-current="step"`;
- semantic locked state;
- current Stage visible after auto-return;
- resume and Stage touch-target dimensions;
- winding phone geometry;
- stacked tablet geometry;
- illustrated garden background;
- no Belajar Journey Map owner;
- no Browse All;
- no horizontal overflow;
- same-document rotation state preservation;
- zero browser/page errors.

Static World QA also locks the responsive marker and tablet-lane presentation contract.

## 5. PR validation history

Two earlier PR runs exposed presentation-test mismatches and were superseded by the final head:

1. CI #2371 rejected an initial full-width phone card direction because the permanent World contract requires compact game nodes on mobile;
2. CI #2372 then exposed an over-broad dedicated JM-17 expectation that all <=900px widths should be stacked; the final contract correctly distinguishes winding phones (<=430px) from the stacked tablet lane.

The final head `ed09dc20bea0f29060616e417d48a54f5916469c` passed full PR CI #2373.

## 6. Production verification

Merged runtime `main@b4473cc0582c096441e429b8ed94c20fc4bf1b8e` passed main CI **#2374 / run `36974133135` FULL SUCCESS**:

- Production dependency audit — SUCCESS
- Mobile route QA (Chromium) — SUCCESS
- Quality gate (Ubuntu) — SUCCESS
- Windows compatibility — SUCCESS
- Secret history scan — SUCCESS
- Production build — SUCCESS
- Production smoke (Cloudflare) — SUCCESS

Therefore:

```text
JM-17:
CLOSED / MERGED / LIVE VERIFIED
```

JM-18 may now perform the final **docs/authority closure** for the complete Canonical Journey Map program. No additional Journey Map runtime package is required by the canonical plan.
