# Mainlagi Belajar Character Responsive QA — Session 07 Closure

Date: **25 September 2026**  
Status: **SESSION 07 COMPLETE / RESPONSIVE CHARACTER MATRIX CLEAN / NO CSS CORRECTION REQUIRED**  
Base main: `edef9ab9b52580e19b8281fa7a473d59197e3625`  
PR: **#335**  
Baseline PR CI: **#1646 / run `36104751650` — full success**

## Scope

Session 07 verifies the already-integrated shared SVG character runtime from Session 06 across the canonical responsive widths without changing learning semantics or redesigning the activity presentation.

Viewport matrix:

```text
320
390
430
768
1280
```

Representative routes:

```text
Bahasa   /child/demo-gian/activity/bahasa-cari-a
English  /child/demo-gian/activity/english-find-blue
Math     /child/demo-gian/activity/math-count-2
Science  /child/demo-gian/activity/science-living-cat
Iqro     /child/demo-gian/activity/iqro-cari-alif
Color    /child/demo-gian/activity/color-gavi
Drawing  /child/demo-gian/activity/drawing-line-horizontal
```

This produces **35 route × viewport captures**.

## Permanent regression

New command:

```bash
npm run test:ui:character-responsive
```

The command is included in:

```bash
npm run test:ui:mobile-routes
```

Artifacts are written to:

```text
.mobile-route-qa/character-session07/
```

The test also writes a machine-readable `report.json`.

A stable non-visual QA hook was added to the activity frame:

```text
data-character-safe-content
```

It exposes the child activity content boundary to browser QA without coupling tests to CSS-module class hashes. It changes no product behavior.

## Automated acceptance result

Session 07 requires and passes:

- direct approved `.svg` runtime paths for every visible character;
- successful SVG load with non-zero intrinsic dimensions;
- exactly two characters on normal Belajar presentation surfaces;
- correct canonical subject pair:
  - English = Naya + Zia;
  - Math = Gian + Paca;
  - Bahasa / Science / Iqro = Gavi + Paca;
- `hero` as the stable neutral state after entry;
- zero horizontal overflow;
- both character images contained inside the activity frame;
- zero geometric overlap with critical prompt / answer / canvas / tool regions;
- `pointer-events: none` on the character layer and character images;
- character layer never wins hit testing over critical child interactions;
- decorative character layer remains `aria-hidden="true"`;
- character images keep empty alt text and are non-draggable;
- reduced-motion context resolves character animation to `none`;
- `object-fit: contain` preserves character artwork containment;
- Coloring and Drawing workspaces render **zero** `CharacterLayer` while their creative canvas/tool surfaces remain present.

Result:

```text
35/35 route × viewport captures PASS
horizontal overflow: 0
critical-content overlap: 0
pointer blocking: 0
broken character SVG: 0
creative-workspace character leakage: 0
```

## Manual visual review

The CI artifact `mobile-route-qa-screenshots` from baseline run **36104751650** was reviewed as five contact sheets plus representative full-size 768px and 1280px captures.

Observed result:

- characters remain visually crisp at all tested widths;
- mobile 320/390/430 keeps characters in the lower corners without obscuring prompts or choices;
- 768 keeps the cast clear while preserving the activity center;
- 1280 leaves the main interaction visually dominant and keeps characters as supporting foreground guides;
- English Naya/Zia and Math Gian/Paca remain visually distinct and correctly paired;
- Gavi/Paca remain consistent on Bahasa, Science and Iqro;
- Coloring/Drawing remain character-free inside the active creative workspace.

**No responsive CSS correction was justified by the evidence.**

Session 07 intentionally does not change `CharacterLayer.module.css` or `GardenActivityFrame.module.css`. Avoiding an unnecessary visual patch reduces regression risk.

## Hard boundaries preserved

Session 07 does **not**:

- change activity IDs;
- change prompts, choices or answer keys;
- change the 900-activity baseline;
- change the 47-pattern baseline;
- change mastery or progression;
- change learning-attempt/evidence schema;
- change rewards or certificates;
- change World;
- change Home;
- change Bermain or Motion Engine;
- change character provenance or production approval;
- convert SVGs to WebP;
- delete legacy fallback files;
- alter creative activity semantics.

## Closure decision

The Belajar character integration is now responsive-verified and regression-protected.

No presentation defect was found that required a Session 07 CSS fix.

Next allowed work:

```text
Session 08 — Integrate shared character runtime into Mainlagi World
```

Session 08 must begin from merged latest `main` and must preserve the World structure/progress/evidence boundaries defined in the canonical integration plan.
