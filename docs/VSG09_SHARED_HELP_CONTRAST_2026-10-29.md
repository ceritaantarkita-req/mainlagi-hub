# VSG-09 — Shared contrast-safe on-demand gameplay Help

**Date:** 29 October 2026
**Base:** `main@8adf89c1469d4321e7d94d47f67057b18f327fea` after Relative Order #543.
**Source:** [issue #544](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/544).
**Status:** DRAFT IMPLEMENTATION, not a production-verified visual sign-off.

## Why

Manual review of the first VSG-08 screenshot at 320px found `Cara main` text over a detailed illustrated background. Scoped Relative Order `helpPanel` restored an opaque background. The existing child hierarchy `.assistance` intentionally defined **only typography** and was used directly by other gameplay components without consistent solid backing. That pattern is code-confirmed; do not assert that all five families had a visually proven contrast failure prior to this change.

## Design decision

Reuse `ChildVisualHierarchy.module.css` with **opt-in** `.assistancePanel` alongside existing `.assistance`. Do **not** alter the plain `.assistance` role, all `p` tags, canonical lesson text or background art.

- Opaque `#fffdf4` surface and `#193b55` text, 2px light border, padding, subtle shadow, 16px rounding, word-safe wrapping, minimum 14px readable help font.
- Five scoped scene consumers: `CauseEffectActivity`, `InvestigationBoardActivity`, `RulePipelineActivity`, `SetReasoningActivity`, `TransitiveChainActivity`.
- `RelativeOrderTrackActivity` already uses a validated local contrast panel, so **do not replace its accepted visual behavior** in this wave.
- `MaterialLabActivity` already provides `helpCopy` (its own translucent cream surface); leave it unchanged and revisit in a separate UI-diff inspection only if necessary.

## QA

New `scripts/assert-child-help-contrast.mjs` is invoked by the existing **real Chromium family suites**, with their canonical learning, keyboard and scoring assertions unchanged. At **320/390/430/768/1280px** it checks: expanded Help is present exactly once; computed background equals opaque `rgb(255,253,244)`; text equals dark `rgb(25,59,85)`; readable inset/font; help bounds stay horizontally inside the viewport. It saves 25 actual `fullPage:false` screenshots to `.vsg09-shared-help/` for independent review in artifact `vsg09-shared-help-contrast-screenshots`.

### Acceptance

- [ ] All seven exact-head PR CI checks PASS.
- [ ] All five family suites pass and 25 screenshot files are archived.
- [ ] Manually review the 320, 390, 768 and 1280 originals for alignment, contrast, overlap and no lost question/answer affordances.
- [ ] Preserve all original help text, visible necessary task rules, audio, attempts, assessment/mastery, and stage locks.
- [ ] Merge only after acceptable gates; Cloudflare exact deployed SHA and physical iOS Safari are **separate**, not inferred from CI.

Do not add universal layout cards, modify 900 content entries or introduce Pattern #48. World, Motion Engine, Shop, DB and auth are out of scope.
