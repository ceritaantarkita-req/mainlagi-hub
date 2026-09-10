# Mainlagi Mobile Route Matrix

Last reviewed: 10 September 2026

This is the Batch 0 route inventory for the mobile rebuild. Batch 1 defines the shared responsive system; Batch 2 migrates and verifies these routes against it.

## Required viewport matrix

Every canonical learning surface must be checked at:

```text
320 px
360 px
375 px
390 px
430 px
768 px
1024+ px
```

The phone widths are release-critical. Tablet/desktop must remain functional, but mobile is the primary constraint.

## Child learning routes

| Route | Main surface | Batch 1/2 focus |
| --- | --- | --- |
| `/child` | child entry/redirect | safe transition; no layout flash/overflow |
| `/child/select` | profile selector/create profile | form controls, guide selector, narrow cards, keyboard |
| `/child/[childId]` | child entry/redirect | ownership/loading state |
| `/child/[childId]/home` | child home | hero, recommendation CTA, subject scroller, bottom nav |
| `/child/[childId]/learn` | full learning library | long catalog, subject/path/stage cards, scrolling |
| `/child/[childId]/subject/[subject]` | subject view | path/stage hierarchy, long titles, card grids |
| `/child/[childId]/stage/[stage]` | stage/lesson view | lessons, activity lists, optional-motion section |
| `/child/[childId]/activity/[activity]` | canonical learning activity | activity viewport, prompt, controls, result state |
| `/child/[childId]/games` | motion/game library | dense cards, explanatory copy, bottom nav |
| `/child/[childId]/rewards` | rewards | badges/cards and long progress states |

## Shared/global game routes

| Route | Main surface | Batch 1/2 focus |
| --- | --- | --- |
| `/games` | global game catalog where exposed | catalog grid/list responsiveness |
| `/games/[slug]` | existing motion/camera game wrapper | camera viewport, preflight, controls, related games, landscape |

Existing motion/camera games are optional activity runtimes and are not allowed to force camera usage into the core learning path.

## Parent routes

| Route | Main surface | Batch 1/2 focus |
| --- | --- | --- |
| `/parent` | parent overview | summary cards, navigation, responsive density |
| `/parent/children` | child list | profile rows/cards and actions |
| `/parent/children/[childId]` | child overview | ownership states, summaries, navigation |
| `/parent/children/[childId]/progress` | progress + stage readiness | data cards, progress bars, recommendation copy |
| `/parent/children/[childId]/reports` | Parent Report V2 | weekly metrics, recent attempts, strengths/needs-practice |
| `/parent/children/[childId]/certificates` | certificates | certificate cards, download/share actions |
| `/parent/plan` | plan/tier surface | comparison content and actions |
| `/parent/privacy` | privacy controls | readable text, toggles, safe wrapping |
| `/parent/settings` | parent settings | forms, toggles, keyboard, narrow labels |

## Activity/runtime matrix

Each reusable runtime must be tested independently because a route can be responsive while the game surface inside it is not.

| Runtime | Mobile risks |
| --- | --- |
| `tap_choice` | answer buttons too narrow/small; long answer wrapping |
| `listen_and_choose` | speech button/status plus choice layout; repeated taps |
| `matching` | pair grid overflow; target size; selection clarity |
| `trace` | canvas/SVG coordinate scaling; pointer mapping; orientation |
| `story` | long text; audio controls; reading line length |
| `coloring` | palette + canvas fit; touch target size |
| `motion_game` | camera aspect ratio, controls, preflight, landscape, browser chrome |

Batch 5 will add additional mechanics such as drag-to-target, draw-line matching, sort/classify, sequence, pattern completion, odd-one-out, connect-dots, memory pairs, simple maze/path selection, and observation games. Every new mechanic inherits this mobile acceptance requirement.

## Mobile release invariants

The rebuild must make the following true:

- no unexplained document-level horizontal overflow;
- no primary CTA hidden behind the fixed bottom navigation;
- safe-area insets are respected;
- child touch targets are approximately 44×44 CSS px or larger;
- long Bahasa/English labels wrap without widening the page;
- card grids collapse when actual available width is insufficient;
- horizontal scrolling exists only where explicitly designed, such as a subject scroller;
- activity controls remain reachable with browser chrome visible;
- virtual keyboard does not make profile/settings flows unusable;
- trace coordinates remain correct after responsive scaling;
- camera/motion games remain recoverable in portrait and do not trap the user;
- parent data views prefer readable stacking to dense desktop tables on phones.

## Batch 0 status

This document is an inventory/acceptance contract, not evidence that these routes already pass. The user-observed production issue is that mobile layout remains inconsistent. Batch 1 and Batch 2 are responsible for fixing and proving these surfaces rather than marking them green based on desktop build success.
