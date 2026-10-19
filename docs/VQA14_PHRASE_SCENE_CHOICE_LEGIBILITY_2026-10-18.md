# VQA-14 — Phrase–Scene choice-label legibility

Date: **18 October 2026**
Status: **DRAFT / NOT MERGED / NOT LIVE VERIFIED**
Base: `main@0600c42e0abb09dd13b824fc0312da736fa52579` (VQA-13 fullscreen Completion #523 already merged)
Parent: [VQA Issue #501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501)

## Verified child-first readability defect

In original authentic 320×720 and 390×844 Phrase–Scene Chromium screenshots, image/choice labels `A SMALL CAT`, `A BIG DOG`, `TWO CATS` are very small against a large visual selection card. The source `PhraseSceneMatchActivity.module.css` sets `.choiceLabel` to `.76rem` under 560px, `.7rem` under 340px and **`.68rem` (~10.9px)** for height <=760px. This is not suitable as a text-based learning prompt for ages 3–7. VQA-13 fixed an unrelated Completion overlay clipping defect but did not fix visual answer label typography.

## Strictly owned presentation fix

- Override only Phrase–Scene CSS module: all choice labels have a responsive **minimum 17px**, line-height 1.17, high contrast, balanced natural word wrapping (not cut-off words), and enough choice-card height to keep the image plus the full phrase readable at 320×720 and 390×844.
- Preserve three distinct visual choices **small cat / big dog / two cats**, all illustrations, their semantics/accessible names, original prompt `Which phrase means a small cat?`, sound, stage gating, correct answer, wrong hint and scoring/evidence.
- Preserve existing VQA-13 fixed full-viewport Completion overlay and Back/Again/Next/Share; the `sceneDone` saturation filter must remain removed. No new shared Completion changes, no World/Bermain/Shop/DB/auth changes.
- Extend existing representative 320/390/768 Playwright test: canonical three word labels with original order, **font >=17px** each, every label contained inside its button without horizontal or vertical content clipping, full three-option scene visible above the first fold, original >=44px option touch targets, and all old stage/keyboard wrong/correct, `accuracy=0.5` and completion/Again/overlay geometry checks.
- Continue using CI's **already isolated VQA-13 Phrase screenshot artifact**, since the same permanent browser script captures exactly 12 PNGs per PR head (3 widths × idle/wrong/success/Again) to `.vqa13-phrase-completion/`. No new duplicate CI upload step is justified.

## Release criteria
1. Full latest **7/7 PR CI** green, including Ubuntu/Windows/Chromium; do not disable old tests to pass typography.
2. Download and actually inspect **12 screenshots** from the latest commit. In 320/390 idle and wrong screenshots the scene images, complete large English choice text and next action/status must be visible, legible and unclipped; completion fullscreen and Again must not regress. Rework CSS if 17px wrapping fails to fit.
3. Protected exact-head squash merge only after review. Exact deployed main Cloudflare SHA and physical iOS Safari remain separate outstanding proof, not implied by PR CI.
4. Frozen: all 900 canonical activity data, 47 gameplay pattern classification, content/answers, score, mastery, stage locks, runtime evidence, character work, World, Bermain Motion Engine, Shop, DB/auth and shared visual system.
