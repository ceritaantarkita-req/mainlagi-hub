# VQA-04 (Wave 1) — Investigation Board visual hierarchy

Date: 14 October 2026
Status: IMPLEMENTED IN REVIEW BRANCH / NOT LIVE VERIFIED
Parent issue: #501
Baseline: `main@770034122870492167632f41a8eb5bb258abfec3` (VQA integrated heading fix #498 merged; exact SHA production smoke pending when branched).

## Source evidence

Owner requested less `AI slop` / repetitive cards and less child-facing reading load. The production-run idle screenshot `390-investigation-board-idle.png` displays:
- canonical outer activity title;
- inner investigation instruction panel;
- four separately outlined `Amati / Jaga tetap / Prediksi / Simpulkan` step chips;
- another outer board card containing the **scenario** and **focus** panels;
- the three actual answer controls and feedback strip.

No clipping, false completion, or incorrect answers were proven. This is a **presentation hierarchy defect**, not a curriculum/scoring error. The scene's first action was already visible on 390×844 and must remain so.

## Bounded implementation

`src/components/learning/InvestigationBoardActivity.module.css` only:
1. Restyle four process labels as **one cream ribbon** with a clear green current step. Other labels no longer look like independent clickable cards.
2. Remove only the redundant outer `.board` border/background/shadow/padding. **Scenario** and **focus** remain separate readable panels to preserve pedagogy.
3. Keep original prompt card, choices, feedback, contrast, responsive widths and characters.
4. Preserve the existing background illustration; no opacity wash or new art.

`scripts/run-investigation-board-browser-tests.mjs`:
- 320×720, 390×844 and 768×1024 route regression verifies the ribbon, inactive/active visual distinction, and transparent outer board;
- existing 3 choices, original instructions, answer/attempt evidence, wrong/success feedback, canonical completion, local Again, keyboard and viewport tests still run.

## Boundaries

No changes to `InvestigationBoardActivity.tsx`, prompt/answer text, content/evidence, score, attempts, stage readiness, TTS, audio, World, Motion Engine, characters, Shop, Supabase or other game types.

## Required acceptance

- [ ] PR CI 7/7 blocking gates green with exact head.
- [ ] Review Chromium 320/390/768 idle/try/success screenshots. Ensure the process ribbon reads naturally, no clipping, no reduced hit areas and the **scenario/focus/3 choices** stand out.
- [ ] Exact-head squash merge.
- [ ] Main CI + Cloudflare smoke confirm exact deployed SHA.
- [ ] Owner physical Safari UX review separately.
- [ ] Document any residual text-density issue for human curriculum review; don't silently delete pedagogical instructions.

Only this Investigation Board P2 surface is included. Issue #501 remains open for 47-family prioritization and future separate evidence-backed waves.
