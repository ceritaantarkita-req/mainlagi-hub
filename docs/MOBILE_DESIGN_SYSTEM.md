# Mainlagi Mobile Design System

Last reviewed: 10 September 2026

This document defines the shared mobile layout foundation introduced in Expansion Batch 1. Batch 1 establishes the primitives and inherited tokens. Batch 2 is responsible for migrating every canonical child/parent/game route and proving visual behavior at the viewport matrix in `MOBILE_ROUTE_MATRIX.md`.

## Source of truth

```text
src/components/learning/mobile/MobileFoundation.module.css
src/components/learning/mobile/MobilePrimitives.tsx
```

The child profile selector, `/child/[childId]/*`, and `/parent/*` inherit `MobileFoundation` so the same variables are available across learning surfaces.

## Core tokens

| Token | Purpose |
| --- | --- |
| `--ml-page-max` | normal content max width |
| `--ml-page-narrow` | narrow/form/report content max width |
| `--ml-page-gutter` | responsive page gutter |
| `--ml-section-gap` | vertical section rhythm |
| `--ml-card-gap` | card/grid spacing |
| `--ml-card-radius` | shared card radius |
| `--ml-control-radius` | shared control radius |
| `--ml-touch-min` | minimum control height/width baseline, 44px |
| `--ml-header-min` | child/parent header baseline |
| `--ml-dock-control` | bottom dock item height |
| `--ml-safe-*` | safe-area inset aliases |
| `--ml-content-bottom` | content space reserved above fixed child navigation |
| `--ml-title-size` | responsive primary title scale |
| `--ml-section-title-size` | responsive section title scale |
| `--ml-body-size` | responsive body scale |

## Canonical primitives

- `MobileFoundation` — inherited token/baseline boundary.
- `MobilePage` — regular or narrow safe-area-aware page container.
- `MobileSection` — canonical section rhythm.
- `MobileStack` — vertical layout with shared gaps.
- `MobileGrid` — auto-fit grid that collapses when width is insufficient.
- `MobileActionRow` — wrapping CTA row; stacks on the narrowest phones.
- `MobileScrollRow` — deliberate horizontal content scroller.
- `MobileCard` — width-safe card boundary.
- `MobileTouchButton` / `MobileTouchLink` — explicit 44px-class interactive target.
- `MobileStickyHeader` — safe-area-aware sticky header primitive.
- `MobileBottomDock` — safe-area-aware fixed child navigation primitive.
- `MobileActivityViewport` — bounded game/activity viewport.
- `MobileDialogSurface` — viewport-bounded scrollable modal/sheet surface.
- `MobileFullBleed` — deliberate full-bleed mobile section within page gutters.

## Narrow-width behavior

At widths below 360px:

- gutters reduce to 12px;
- card gaps reduce;
- action rows become a single-column grid;
- CTA children use full available width;
- card radii and title scale tighten without shrinking touch targets.

The foundation intentionally does **not** use `overflow-x: hidden` or `overflow-x: clip`. Overflow must be fixed at the component causing it rather than hidden at the document boundary.

## Grid rule

Do not default child content to `repeat(2, 1fr)` on narrow phones.

Use `MobileGrid` or an equivalent component-owned rule that can collapse based on available width. Two columns are acceptable only when the content itself remains legible and touch targets fit.

## Safe areas and fixed navigation

All future fixed/sticky child surfaces should derive spacing from the foundation safe-area tokens. Main content must reserve enough bottom space for fixed navigation rather than relying on route-specific magic numbers.

## Touch targets

44 CSS px is the minimum design-system baseline for child-facing controls. Larger targets are preferred for primary game choices. A visual icon may be smaller than 44px, but its interactive hit area must not be.

## Text rules

Long Indonesian and English labels must wrap inside their own grid/flex track. Flex/grid children must be allowed to shrink with `min-width: 0`; fixed-width text containers should be treated as exceptions that require evidence.

## Media/runtime rules

Images/video/canvas should not exceed their containing mobile layout width. SVG/game coordinate systems still require runtime-specific scaling logic; `max-width: 100%` alone is not accepted as proof that trace/camera pointer mapping is correct.

## Batch 2 migration rule

A route is considered migrated only when its production component uses the shared primitives/tokens or an intentionally documented compatible equivalent, and it passes targeted responsive acceptance. Batch 1 does not mark every route mobile-clean merely because all routes inherit `MobileFoundation`.

## Test contract

`scripts/run-mobile-foundation-tests.mjs` locks:

- canonical gutter/touch/safe-area/dynamic-viewport tokens;
- auto-collapsing grid behavior;
- narrow/tablet media transitions;
- prohibition on hiding document overflow in the foundation;
- presence of the required layout primitives;
- foundation coverage for child, child-select, and parent roots;
- required viewport matrix and mobile release invariants.
