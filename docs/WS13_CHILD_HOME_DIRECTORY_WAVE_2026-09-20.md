# WS-13 — Child Home + Subject Directory Wave

Date: **20 September 2026**  
Status: **IMPLEMENTATION PR / VALIDATION PENDING**  
Base: `main` = `3854d04ded18f1859e1829712273053037ed32ad`

This is the first visible WS-13 implementation wave after the product-UX plan.

## Scope

- Active child home only: `Batch14WorldHome`.
- Child shell/navigation: `PlayroomShell`.
- Shared subject directory: `SubjectDirectory`.
- Responsive styles: `Playroom.module.css`.

## Changes

- Child navigation labels become **Belajar** and **Bermain**.
- Subject cards no longer show `100 aktivitas`.
- All nine subject cards stay in a **3-column grid** on phone, tablet, and desktop.
- Mobile cards are compacted so icon/title/touch area remain readable at 320px.
- Mobile profile menu becomes a bottom-sheet style panel instead of a narrow desktop dropdown.
- The active child-home hero becomes one cleaner composition and exposes all five current character representations through the shared `CharacterGroup`.

## Character-art boundary

This wave exposes Naya, Gian, Zia, Paca, and Gavi using the **current repository representations** so layout/brand structure can be tested now.

It does **not** claim Naya/Gian/Zia artwork is final. Final character bible and production-grade human character assets remain a later WS-13 art wave.

## Regression gates

Browser checks require:

- one **Belajar** child-nav link;
- one **Bermain** child-nav link;
- exactly nine subject links;
- no `100 aktivitas` subtitle on child-home subject cards;
- exactly three computed subject-grid columns at every canonical viewport;
- no existing mobile-route errors/overflow/touch-target regressions.

No mastery, evidence, scoring, curriculum, progression, or WS-05 mechanic behavior changes in this wave.
