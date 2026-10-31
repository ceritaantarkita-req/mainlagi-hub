# VSG-13 — Shape Attribute Board: one canonical question

**Date:** 30 October 2026
**Base:** `main@a6193c9a0cbbb996b7afeef05bea39799360899b`, following VSG-12 #549.
**Status:** Review branch — no merge/live claim until QA.

## Confirmed source-level duplication

`ShapeAttributeBoardActivity` previously displayed an Activity Frame title, badge "Kenali bentuk", heading "Amati bentuknya", the **actual canonical question**, a permanent full hint ribbon, and a second idle instruction at the bottom. For visual-first 3–7 year old gameplay this makes the task unnecessarily text heavy, even though the correct shape symbols remain available.

## Presentation-only solution

- Use the exact canonical `activity.prompt` as the **single visible primary heading** (no generic replacement); this preserves all four distinct questions: circle, triangle, square and three-sided shape.
- Keep the complete canonical prompt as narration in the existing `Dengar` action.
- Move the **original `config.cue`** to explicit accessible **Cara main (?)** with the existing high-contrast shared help panel. It is not erased or rewritten.
- Preserve three large shape tiles, original glyphs, accessible labels, button order, exact correctChoice, and the original successful scientific/shape insight.
- Replace duplicate initial status with empty status and brief retry "Belum tepat. Coba lagi!". Preserve full `config.successText` in accessible status, the separate `config.successInsight` learning detail, and the canonical 3-star **concise** completion/Again reset.
- Retain subject's distinct visual treatment; no general CSS selectors or Stage/World changes. At 320px heading uses readable 20px and help target stays 44px.

## Non-functional boundaries

No edits to `shapeAttributeBoardConfig` or four content variants, correctChoice, runtime measurement, accuracy/retry math, 900 activity records, 47 pattern identities, mastery, stage readiness/locks, Shop, Motion Engine, World, auth or DB.

## Acceptance

- [ ] Exact PR-head 7/7 CI PASS (Cloudflare PR smoke is conditional and does not prove live).
- [ ] Existing representative circle fixture still verifies 3 shape buttons, keyboard wrong + pointer/touch right, one assessed attempt, accuracy 0.5, single Again without duplicate attempt and accessible correct explanation.
- [ ] Chromium viewports **320/390/430/768/1280**, four states **idle/help/wrong/success**, with artifact `vsg13-shape-attribute-screenshots` containing **20 PNGs**.
- [ ] Manually review 20 final screenshots; check first-action clarity, contrast, shape glyph identity, wrapping, touch target and success.
- [ ] Check remaining three canonical shape variants in follow-up sampling; representative circle QA is **not** four-variant visual approval.
- [ ] Merge only with passing automated gates; Cloudflare deployed-SHA and physical iOS Safari remain distinct unverified acceptance steps.

Tracks global visual-system [issue #501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501).
