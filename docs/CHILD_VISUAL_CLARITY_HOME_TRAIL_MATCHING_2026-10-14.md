# Mainlagi — Public Home, Belajar Journey Trail, Matching scene clarity

Date: 14 October 2026
Status: IMPLEMENTED IN REVIEW BRANCH / NOT LIVE VERIFIED
Baseline: `main@7ebfffb97948e430c650cb0417a08b6bbb0c41a9` (PR #496 merged)

## Owner-reported problems
Screens supplied by owner show:
1. Public Home still asks the family to read too much before starting.
2. Bahasa Indonesia Journey Map repeats rectangular, card-like stage nodes over a scenic trail.
3. Matching activity has a pale, low-saturation Garden scene, especially compared with the sharper `bahasa-cari-a` choice screenshot.

**Observation:** public screenshot also shows a Chrome zoom popover reading 33%; this makes the website appear abnormally tiny on desktop, independent of the copy problem. Review the redesigned home at 100% browser zoom as well as narrow viewport widths.

## Presentation changes
- `HomePage.tsx` and `PublicHome.module.css`: short hero headline/lead; remove duplicated section instructions and device-footnote; three recognizable Belajar / Petualangan / Main Gerak choices; parent summary reduced to one line with **Kamera opsional di Main Gerak** retained. Child and parent CTA URLs, character cast, child auto-resume logic and `SubjectDirectory` remain unchanged.
- `BelajarJourneyMap.module.css`: reuse the approved subject-specific scenic artwork and the single canonical Journey Map model, but strengthen landscape saturation and present each step as compact, asymmetric trail signposts rather than repeated nested white cards. Reduce the icon-in-a-square effect. Ensure locked/current/completed steps remain visually distinguishable without global opacity and retain clear labeling.
- `GardenActivityFrame.module.css`: only matching-focus `::before` wash changes from near-opaque white/green across the viewport to a subtle localized radial highlight. The matching task panel, audio and interaction model are unchanged.
- `run-visual-baseline-browser-tests.mjs`: enforce simplified public copy, keep three entry paths, assert opaque/legible locked stages with non-boxed landmark icons, reject matching-focus heavy background wash.

## Frozen boundaries
No new artwork or unapproved character state, activity metadata, 900-answer content, scoring, mastery, evidence, unlock logic, completion, audio, narration, Stage membership/order, World, Motion Engine, Shop, Supabase/database or profile/auth changes.

The changes use shared presentation code, not one-off per-activity overrides. Home is a distinct public/family surface; child home is not modified.

## Release checklist (pending)
- [ ] 7/7 PR checks PASS (including Chromium mobile route & permanent visual baseline).
- [ ] Compare before/after at 320 / 390 / 430 / 768 / 1440px, 100% browser zoom.
- [ ] Manually inspect real iPhone Safari and desktop for home CTA clarity, nine Journey Maps, stage lock/focus behavior, matching contrast and exact answer order.
- [ ] Only after checks, exact-head squash merge, Cloudflare Workers Build, and exact-SHA production smoke.
- [ ] Mark LIVE VERIFIED only after SHA-and-site proof, not solely GitHub PR green.

## Known limits
A single shared Journey Map CSS change covers nine subjects but does not prove all 46 Stages or 900 activities visually perfect. The opacity wash fix is intentionally scoped to matching-focused tasks; other activity renderers may need independent visual audits. Owner screenshot acceptance remains a separate gate.
