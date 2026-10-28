# VSG-06 — Set Reasoning first-action, legibility and two-rule preservation

**Date:** 27 October 2026
**Base:** `main@7742aef8c7f746f4c349c4a8d1e001d32465fdfd` after Rule Pipeline PR #537.
**Status:** Runtime changes in branch only; CI and visual acceptance pending.

## Confirmed defect and fix

The old CSS explicitly hides the entire question card at widths up to 340px: `@media (max-width:340px) { .promptCard { display:none } }`. That means the 320px mobile viewport can lack an actionable visible question. In parallel the title, explanatory paragraph, and idle status repeat a similar instruction. **This was source-confirmed, not visually inferred.**

VSG-06:
- Uses existing `planChildVisualHierarchy`, one visible first question **"Mana yang cocok?"**. The canonical activity title remains accessible as section context, and narration still uses the canonical `activity.prompt`.
- Moves only the extra instruction "Baca dua aturan, lalu pilih jawaban yang memenuhi keduanya." to explicit **Cara main (?)**. Neither set rule is moved or hidden.
- Keeps both `in/out` membership rules, `operationLabel`, target label, choices and original IDs visible.
- At 320–560px, two rules sit side by side; operation spans a second row instead of three tiny columns. Target and answer choices are retained below.
- Removes idle status repetition. Visible retry is **"Belum tepat. Coba lagi!"**; the full canonical success explanation remains announced via screen readers. Completion remains the existing three-star component with concise heading.
- Choice targets remain at least 44px and word wrapping avoids breaking terms arbitrarily.

## Non-functional boundary

All 10 guarded `setReasoningConfig` variants, both Logic challenge and reused basic stage, existing `correctChoice`, membership semantics, `ruleCount:2`, `setRules` evidence, score/accuracy/retry counts, stage locks, and progression untouched. No edits to World, Motion Engine, Shop, auth or database.

## QA gates

- [ ] Exact-head 7/7 CI jobs success; Cloudflare smoke is separately conditioned.
- [ ] `scripts/run-set-reasoning-browser-tests.mjs` checks **320, 390, 430, 768, 1280px**, idle/help/try/success. A dedicated artifact `vsg06-set-reasoning-screenshots` contains 20 PNGs.
- [ ] `scripts/run-set-reasoning-reuse-browser-tests.mjs` continues to check basic-stage answer, rules, touch/keyboard, evidence and replay at 320/390/768.
- [ ] The 320px question must be visible in initial viewport (not merely in DOM); no overflow; two canonical rules and target still present; attempts/accuracy unchanged.
- [ ] Manually inspect screenshots of all states, especially 320px/long-label variants, before claiming full visual sign-off.
- [ ] Merge only with passing CI and evidence. Exact-SHA Cloudflare smoke and physical Safari are separate and cannot be assumed from PR CI.

Source audit and issue: [#538](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/538).
