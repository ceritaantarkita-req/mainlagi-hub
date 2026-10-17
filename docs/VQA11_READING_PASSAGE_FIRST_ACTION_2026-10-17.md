# VQA-11 — Reading Passage first-action clarity (Bahasa)

Date: **17 October 2026**
Status: **DRAFT / NOT MERGED / NOT PRODUCTION VERIFIED**
Base: `main@6831378db8cd4c2dd75d48488e3b03433f73c2db`, pending unrelated Sentence Order PR #520. Parent Issue #501.

## Screenshot-backed hypothesis and code-owned constraints
The existing Reading Passage Question (`reading_passage_question`) already has a **VQA-04 paper-like storybook** that intentionally wraps one actual passage, question and exactly three choices. Screenshot checks explicitly demand a warm paper background, a single book frame with two semantic regions and a readable **mostly opaque light intro backing** over the Garden art. This is NOT excess dashboard chrome and must remain. At 320/390 baseline, duplicated always-visible introductory explanatory text and idle hint compete for room with the essential story, question and answer row.

## Scope
- Keep the main task heading **Baca lalu jawab** visibly backed by the same opaque introduction; leave `storyBook`, semantic passage `Lala punya kucing putih.`, question `Apa warna kucing Lala?`, and all three answer choices fully unchanged.
- Remove only the always-open second introductory explanatory paragraph; preserve exact original `Temukan jawaban yang tertulis langsung di bacaan.` and `💡 Jawab berdasarkan informasi yang tertulis di bacaan.` strings in one native, keyboard- and pointer-operable idle-only **Cara main** disclosure in the same live status area. On wrong response, the original `Belum tepat` hint remains; on correct, the original `Tepat` feedback and canonical Completion remain. No change to activity response logic.
- Scoped CSS adjusts idle region/Help, but **must preserve** warm book and introduction opaque contrast requirements. No global selector.
- Extend existing 320×720, 390×844, 768×1024 Playwright Reading Passage test with Help collapsed/open/closed, 44px visible Help trigger, original advice retrieval, original VQA-04 warm-book semantic assertions, canonical story/question/3 options, original scored keyboard wrong and correct actions (`accuracy=0.5`), Completion and no overflow.
- Archive exactly **12 genuine screenshots** (3 widths × idle/help/try/success) to dedicated `.vqa11-reading-passage/` folder before later mobile suites clear shared screenshots. New `vqa11-reading-passage-screenshots` artifact step includes hidden files and fails closed.

## Gate and boundaries
1. Keep this branch **draft** while VQA-10 PR #520 is still running; do not skip protected main/required rebasing or CI gates.
2. Exact-head 7/7 PR CI then download and visually inspect all 12 screenshots for first-view visibility of the actual reading passage/question/options and nonobstructive Help. A screenshot that puts essential text below first fold, introduces clipping or reduces book contrast fails.
3. Protected squash merge separately after main updated; exact merged-main 8/8 + deployed Cloudflare exact SHA and real physical iOS Safari remain additional acceptance gates.
4. Frozen: 900 canonical activity IDs, 47 patterns, actual authored passage/question/choices/correct answers, scoring/mastery/attempt evidence, child progress, stage locks, World, Bermain Motion Engine, Shop, auth/DB, characters, audio. Do not claim full family/all-activity or production visual approval from one representative three-viewport case.
