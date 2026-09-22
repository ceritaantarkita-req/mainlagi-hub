# Learning Visual Containment Pilot — 22 September 2026

Status: **IMPLEMENTATION PILOT / STACKED ON ILLUSTRATION AUDIT**

Parent audit: PR #287 / `docs/LEARNING_ILLUSTRATION_CONSISTENCY_AUDIT_2026-09-22.md`

## Purpose

This pilot addresses a project-owner-reported product defect class: learning icons/illustrations that should remain inside a card or choice box can visually escape the box, collide with edges or overlays, become clipped, or become too small/unclear on desktop and mobile.

This is a **containment foundation**, not final illustration art. Existing emoji/glyph content may remain as a temporary semantic fallback in these exact pilot surfaces while the shared frame makes its sizing and clipping deterministic. Final recognition-critical production art is a later gated wave.

## Hard boundaries

This pilot does not change:

- Mainlagi World;
- character runtime or character production;
- English narration/audio;
- canonical activity IDs;
- prompts;
- choice order;
- correct answers;
- evidence contracts;
- mastery;
- progression;
- schema;
- stage ownership;
- gameplay pattern classification.

WS-05 remains closed at 900/900 activities / 47 active gameplay patterns, with no Pattern #48.

## Pilot surfaces

The first containment implementation is intentionally small but covers both the catalog entry surface and recognition-heavy runtime surfaces:

1. shared subject catalog — `ActivityGallery` picture previews;
2. Bahasa Indonesia — `InitialSoundActivity`;
3. Bahasa Indonesia + English — `PictureWordMatchActivity`;
4. Science — `FeatureFunctionLinkActivity`;
5. Science — `MaterialLabActivity`.

Representative existing QA routes include:

- `bahasa-awal-bola`;
- `bahasa-gambar-apel`;
- existing English picture-word reuse route covered by `run-picture-word-match-english-reuse-browser-tests.mjs`;
- `science-feature-duck-webbed-feet`;
- `science-material-raincoat-waterproof`.

These surfaces were chosen because the visual participates directly in recognition or reasoning and because they already have dedicated browser/evidence regression coverage.

## Shared containment primitive

New shared component:

- `src/components/learning/LearningVisualToken.tsx`;
- `src/components/learning/LearningVisualToken.module.css`.

Contract:

- explicit bounded square frame;
- explicit `overflow: hidden`;
- centered visual;
- configurable safe padding;
- configurable bounded visual/font size;
- preserved intrinsic aspect ratio for future image/SVG assets;
- `object-fit: contain` for image/SVG children;
- no dependence on unconstrained emoji font metrics;
- optional accessible image label where the visual itself conveys learning meaning;
- decorative instances remain hidden from assistive technology.

The component is deliberately future-compatible with approved local illustration assets so runtime renderers do not need another layout rewrite when emoji fallback is replaced.

## Runtime containment changes

### Activity Gallery

Picture-preview activity glyphs now use the same bounded token instead of raw unconstrained emoji spans. The picture-preview container explicitly owns overflow. Canonical mobile-route QA checks playable gallery tokens across its existing responsive matrix, plus a dedicated 1280x800 QA-unlock catalog inspection.

### Initial Sound

The recognition clue is rendered through the shared bounded visual token with a semantic label for the pictured word.

### Picture & Word

The recognition picture is rendered through the shared bounded visual token. Bahasa and English reuse the same containment contract.

### Feature / Function

Subject, feature and function-choice visuals use bounded tokens. Parent cards/buttons explicitly own overflow and minimum width.

### Material Lab

Object, purpose/test, sample, selected-sample and test-action icons use bounded tokens. Object/purpose cards, sample choices and test action explicitly own overflow/min-width behavior.

Prompt/decorative icons outside the assessed visual area are not the target of this pilot and remain outside the recognition-critical migration unless runtime evidence justifies expanding scope.

## Automated containment regression

New helper:

`scripts/lib/assert-learning-visual-containment.mjs`

For every `[data-learning-visual-token]` in an affected activity scope, browser QA now verifies:

- parent frame exists;
- inner glyph exists;
- visual frame does not collapse below 32x32;
- frame and glyph are visible and non-transparent;
- frame explicitly clips/bounds overflow;
- frame remains inside its parent box on all four sides;
- glyph remains inside the frame on all four sides.

This specifically prevents the previous class of defect where a page had no horizontal viewport overflow but an icon could still escape its own intended card.

## Viewports

Affected dedicated activity browser suites now run at:

- 320x720;
- 390x844;
- 768x1024;
- 1280x800.

The canonical subject-gallery path is additionally exercised by the broader mobile route matrix at 320, 360, 375, 390, 430, 768 and 1024 widths, plus a dedicated 1280x800 QA-unlock catalog inspection.

Desktop 1280 is deliberately included because the project owner reported unclear/poorly contained visuals on both desktop and mobile.

## Existing behavior regression retained

The existing browser suites still verify, where applicable:

- progression guard;
- canonical choice count and labels;
- touch target size;
- wrong/retry behavior;
- success/completion;
- evidence metadata and assessed semantics;
- horizontal viewport containment;
- success CTA visibility;
- page/console errors;
- screenshots.

The new containment assertion is additive and does not weaken those checks.

## Acceptance boundary

This pilot can be considered engineering-complete only when:

1. audit PR #287 is merged;
2. implementation PR CI is green;
3. all five affected browser suites pass all four viewports;
4. quality/build/Windows/security gates pass;
5. merged-main exact-SHA Cloudflare smoke passes;
6. human screenshot review finds no P0/P1 containment/readability blocker.

Even after this pilot closes, **recognition-critical emoji are not automatically approved final illustrations**. The next art wave must use centralized semantic illustration mapping plus provenance/rights and child-readable asset review before replacing fallback glyphs.

## Safe handoff

If work stops here:

- audit truth lives in `LEARNING_ILLUSTRATION_CONSISTENCY_AUDIT_2026-09-22.md`;
- this file is the runtime containment pilot handoff;
- no World, character, narration, evidence, mastery, progression, schema or gameplay-pattern contract is authorized to change;
- next safe execution is CI/visual acceptance for this pilot, then a separate production-illustration resolver/asset wave.
