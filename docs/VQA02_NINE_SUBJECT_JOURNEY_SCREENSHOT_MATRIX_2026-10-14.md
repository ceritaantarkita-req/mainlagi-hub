# VQA-02 — Nine-subject Journey Map screenshot matrix

Date: 14 October 2026
Status: QA-ONLY REVIEW PR — NOT PRODUCTION VERIFIED
Baseline: main@33dcb7da0540dc424aca72567250c11b0756c0b7 (PR #497)

## Why
The permanent visual baseline previously photographed **26 routes at 390/768/1280 = 78 captures**, but only one of the nine Belajar subject Journey routes (Math) was explicitly represented. A shared component can still encounter art direction and title/layout differences across subject-specific scenic backgrounds. CI green for one subject cannot prove all nine look good.

## Implementation
Expand the existing production-build Playwright visual baseline without introducing a new Journey Map engine:
- Capture **all nine** real Belajar subject routes: `bahasa`, `english`, `math`, `iqro`, `letters`, `logic`, `science`, `color`, `drawing`.
- Three existing viewports: **390×844, 768×1024, 1280×800**.
- Photograph the **full page** for subject routes so the winding trail and all stage landmarks are visible.
- Verify exactly 100 Browse All catalog entries per subject, at least one accessible starting stage, valid canonical presentation-state vocabulary, existing subject-scene WebP background, and zero horizontal document overflow.
- Keep original Math Stage Detail interaction assertion and all existing baseline routes.

Expected permanent baseline: **34 routes × 3 viewports = 102 route captures** (plus three separately produced Stage-detail screenshots), up from 78 baseline route captures. This is a QA artifact increase, not a claim of visual acceptance.

## Not changed
No Belajar stage order, readiness, activities, audio, gameplay, assessment, attempts, progression, UX runtime components, CSS, World, Motion Engine, Shop, auth, DB or assets. No automated unlock-all, no mutation of completed stages. Screen captures use the existing `demo-gian` read-only QA fixture.

## Verification and acceptance
- [ ] Browser/CI run green for exact PR head.
- [ ] Inspect nine resulting full-page screenshots at each viewport for art clarity, legibility, stage label placement, landmarks, and overflow.
- [ ] File specific P0/P1/P2 visual findings rather than claiming 102 screenshot files equal 102 visually reviewed passes.
- [ ] Exact-head merge and merged-main Cloudflare smoke if all gates pass.
- [ ] Owner real-iPhone Safari review remains a separate sign-off.

This closes the **coverage gap** for Journey screenshot generation, not human review of all 46 Stages / 900 activities.
