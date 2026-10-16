# VQA-08 — Picture–Word First-Action Hierarchy (Bahasa + English)
Date: 16 October 2026
Status: **DRAFT / NOT MERGED / NOT PRODUCTION VERIFIED**
Base: `main@a3ae530e422050f70b2ee4625d954ea7370e4742` (VQA-07b Coloring merged).
Parent Issue: #501 (first-action hierarchy across 47 patterns).

## Source evidence and approved interpretation
Existing Chromium screenshot artifact #12021887501 (same runtime code as #517 baseline before this pilot) includes `320/390/768/1280-picture-word(-english)-{idle,try,success}.png`. All 30 picture–word screenshots from those five core widths (320/390/430/768/1280), Bahasa and English, show the **same density pattern**:
- Garden's subject-specific context/title/scene stays purposeful, and must not leak answer words (`Find JUMP` / `Choose the action JUMP.` are forbidden).
- `PictureWordMatchActivity.promptCard` displays a localized task heading **plus** nearly identical always-visible instructional sentence inside a raised white rounded plate.
- `pictureBoard` contains essential semantic SVG image, unknown `?` word slot, and a question accessible label. This is the actual educational target and must remain.
- Three canonical option buttons (Bahasa apple `apel/ayam/awan`; English action `EAT/JUMP/READ`) must remain directly playable.
- A second always-visible idle status strip repeats picture and choice instructions without representing a new attempt state; wrong `Belum tepat/Not quite` and success `Tepat/Correct` status **do** represent new information and remain.

The visual problem is therefore redundant **idle** copy/plates, not incorrect scoring or broken illustrations. This pilot does not hide the task image, unknown answer slot, label or any of the three choices. It does **not** rewrite the learning question.

## Scoped change
1. In `PictureWordMatchActivity.tsx`, the `promptCard` shows the exact canonical localized **single primary** task heading. The existing `ui.instruction` and `ui.idle` strings are preserved unchanged in a native `<details>` within the existing idle status live region. Its keyboard/touch reachable `<summary>` is **Cara main** (Bahasa) or **How to play** (English). Initially collapsed, manually expandable and re-collapsible. Dynamic retry/success feedback and completion are unchanged.
2. In `PictureWordMatchActivity.module.css`, only this family's promptCard loses the redundant solid rounded background and shadow. The live educational image board and three answer buttons retain their necessary panels, borders and 44px+ touch targets. The idle status becomes a transparent help trigger; expansion reveals legible support text on a small soft surface. No document `overflow-x:hidden`.
3. Extend existing Bahasa and English picture-word Chromium tests (the current 320/390/430/768/1280 route and semantic SVG tests) to assert the help trigger is localized, has >=44px geometry, help text is initially hidden, expands to the full unchanged canonical instruction, can close again, and then existing keyboard wrong/real correct/accuracy/evidence/Completion checks proceed unchanged.
4. Emit ten additional Help-state screenshots. Dedicated `vqa08-picture-word-screenshots` artifact archives **40 PNGs**: 2 languages × 5 widths × (idle/help/try/success) from the exact PR head, retaining existing mobile QA screenshot coverage.

## Safety boundaries
**Frozen:** 900 canonical activities, 47 gameplay patterns, answer values, image semantics and image files, Stage/unlock gates, audio narration (private answer-safe narration stays unchanged), three choices, scoring, mastery/evidence fidelity, progress persistence, Completion (Back/Again/Next/Share), World, Motion Engine, Shop, auth, DB, character art. Do not apply a global title or container CSS selector.

`picture_word_match` counts 23 activity instances in latest distribution artifact, but only two representative IDs are exercised in browser visual QA. Do not assert 23/23 individual screenshot approvals or 900 visual approvals.

## Must pass before merge
- Exact-head 7/7 PR CI, including Ubuntu and Windows and full Chromium/Stage/English localization/semantic asset/evidence gates.
- Download and visually inspect all 40 PNGs. In particular compare old 320/390 mobile idle screenshot and new idle + Help-open; verify first answer row stays above fold and feedback on wrong/complete remains readable.
- Reject if necessary learning copy disappears from Help or the opened help pushes the child's answer buttons off-screen irreversibly. Preserve native keyboard behavior and reduced motion.
- Merge via protected main exact head only after acceptance. Separate merged-main 8/8 exact-SHA Cloudflare and real iOS Safari/owner check.
