# VQA-09 — Cloze Sentence first-action hierarchy (Bahasa + English)

Date: **17 October 2026**
Status: **DRAFT / NOT MERGED / NOT LIVE VERIFIED**
Base: `main@377c465c51ac47412d51a250196f55ff094ad77c` after VQA-08 Picture–Word PR #518 passed 7/7 exact-head CI and 40 actual screenshots and was merged. Parent: VQA-04 [Issue #501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501).

## Actual source/screenshot problem
The shared `ClozeSentenceChoiceActivity` serves Bahasa (`bahasa-lengkap-ayah-minum`) and English (`english-complete-cat-sleeps`) through one runtime with localized strings. The existing `introCard` contains a title and an extra instruction, with a raised boxed treatment. `sentenceCard` shows a **pedagogically essential complete sentence around a blank**, including a true `data-cloze-slot`, and three canonical choices. A second idle status ribbon offers another hint before any attempt. The 320/390 representative screenshots from Chromium QA demonstrate instructional chrome competing with the sentence. Unlike idle advice, **sentence words, blank, choice labels and live wrong/correct feedback are essential**: never hide them to meet a cosmetic target.

The `GardenActivityFrame` title/scene and subject visual identity remain unchanged. The actual lesson sentence (Bahasa: "Ayah minum _____ setelah berolahraga."; English: "Complete: The cat _____ .") is task content, not an extra instruction.

## Proposed bounded pilot
- Keep exactly one localized visible instruction heading `Lengkapi kalimat` / `Complete the sentence`, but remove the intro's redundant raised panel and always-visible paragraph. No rewriting of authored copy.
- Preserve `ui.instruction` and `ui.idle` word for word in native `<details>` / `<summary>` in the idle status only. The disclosure is **Cara main** or **How to play**, starts collapsed, allows keyboard+pointer expansion and collapse, has a >=44px minimum touch height, and leaves essential sentence/blank/three choices in place.
- Once a wrong/correct attempt occurs, retain the untouched existing retry/success feedback and canonical three-star Completion with Back/Again/Next/Share, not a hidden help widget. No change to `choose`, assessment, activity completion, local Again, progression, audio narration, scene art or CSS outside this family.
- Browser tests remain the existing 320/390/768 Bahasa and English assessed-evidence suites. Add proof that each Help is hidden on idle, opens with original localized instruction, and closes; capture an extra Help-open screenshot at each width, while asserting old wrong-state slot, correct-state slot, three canonical answer strings and assessed evidence still pass. Each language copies exactly **12** screenshots to a separate `.vqa09-cloze-sentence/` directory before downstream mobile runners clear the shared screenshot folder. GitHub Actions uploads that directory (hidden files included) as `vqa09-cloze-sentence-screenshots`. Total **24 real PNGs** (2 languages × 3 widths × idle/help/try/success).

## Guardrails and acceptance
1. PR exact-head **7/7 green**; fail closed if the artifact does not contain exactly 24 PNGs, or if native help / answer-safe rendering fails.
2. Actually inspect all 24 images at 320/390/768 (especially the three choices/blank above the fold and no horizontal overflow). If visual hierarchy, answer word protection or Help accessibility fail, revise or reject; do not force a cosmetic style through failing test.
3. Squash merge only under protected-branch exact-SHA gate; merged-main 8/8 CI including exact deployed Cloudflare SHA separately, plus physical iOS Safari owner review.
4. No global refactor or alteration to the frozen 900 activities, 47 pattern classification, canonical answer, scoring/mastery/evidence, stage locks, DB/auth, World, Bermain Motion Engine, Shop, audio TTS or paused character work. This pilot proves two representative Cloze items, NOT full 900 visual approval.
5. `SentenceOrderCardsActivity` is a separate audited candidate. Its sentence tokens and 1→2→3 guide remain task material; **do not reuse Cloze styling globally**.
