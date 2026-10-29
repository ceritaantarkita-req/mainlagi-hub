# VSG-10 — Stage Detail keyboard/focus safety across nine Journey Maps

**Date:** 29 October 2026
**Base:** `main@82d627724db3070e7b1ad5ad3e67b939ef832e75` (VSG-09 merged).
**Status:** Scoped accessibility change in Draft PR; no live deployment or full Stage redesign claimed.

## Confirmed source defect

`BelajarJourneyMap.tsx` previously opened a `role="dialog" aria-modal="true"` Stage Detail with a global Escape listener, but did not deliberately move keyboard focus into the dialog, contain Tab traversal or restore focus to the exact opening Stage/Resume button on closure. This can cause keyboard users to lose their place in the Journey Map even when stage locks and the visible UI remain correct.

## Implementation

- Capture the exact opener for both Stage nodes and the Ayo lanjut Resume button (not simply the first stage).
- On opening, focus the named 44px Close control; the modal retains its existing title and actual Stage state.
- Trap forward/backward Tab **only while Stage Detail is present**, including hidden-list handling; Escape closes safely.
- On close, return focus to the original connected/enabled opener after the modal unmounts.
- Add visible `:focus-visible` styling for the Close control, in the existing Stage CSS. No new component or design system.
- Keep current subject-specific Journey artwork, mobile bottom sheet, activity disclosures, text-only detail, Drawing stage handoff, and Stage lock/readiness source of truth untouched.

## Regression evidence

Existing `scripts/run-jm06-shared-journey-browser-tests.mjs` tests all nine subjects and exact stage ordering, 100 activities/subject, locked and accessible states and actual navigation. This wave extends **each** subject's Stage Detail test to prove:
1. Focus enters Close when dialog opens.
2. Shift+Tab from first control cycles to the final Continue action, not a background navbar.
3. Tab from Continue wraps to Close.
4. Escape closes and restores focus to the exact Stage node.
5. No horizontal overflow; existing Journey and Drawing tests still run.

## Gates

- [ ] 7/7 exact-head CI PASS, especially full Chromium mobile route QA and visual baseline.
- [ ] Existing screenshot artifacts reviewed for mobile sheet/desktop dialog and focus outline.
- [ ] Merge with scoped implementation only; no claim of 900/900 manual UX approval.
- [ ] Exact merged-SHA Cloudflare smoke and real iOS Safari remain separate.

**Exclusions:** Gameplay mechanics, all 900 activity records, 47 patterns, attempts/evidence/mastery, Shop, World, Motion Engine, data migrations, parent settings, auth.
