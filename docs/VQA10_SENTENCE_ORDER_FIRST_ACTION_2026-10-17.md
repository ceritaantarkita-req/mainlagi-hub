# VQA-10 — Sentence Order first-action hierarchy

Date: **17 October 2026**
Status: **DRAFT / NOT MERGED / NOT LIVE VERIFIED**
Base: `main@6831378db8cd4c2dd75d48488e3b03433f73c2db` (PR #519 VQA-09 Cloze merged after 7/7 and 24 screenshots). Parent Issue #501.

## Specific problem and preserved learning content
The Bahasa `SentenceOrderCardsActivity` (`bahasa-urut-ibu-memasak` representative test case) has redundant always-visible instructional copy in a raised `promptCard` and an idle status panel. It also has a **real visual 1→2→3→… sequence guide** (with the textual cue `Baca dari kiri ke kanan`) and three selectable sequences of **three pedagogically essential word cards each**. Those are learning content, not dispensable decoration; the nine word cards, order arrows, three canonical choices and semantics must remain first-class and immediately playable.

## Isolated pilot
- Preserve the exact heading `Pilih susunan kata yang benar`; eliminate only the redundant raised wrapper chrome and always-visible intro paragraph. Keep **the entire visual direction guide 1→2→3→… and text untouched**.
- Preserve the exact intro paragraph `Baca kartu dari kiri ke kanan, lalu pilih kalimat yang paling masuk akal.` and idle advice `💡 Perhatikan siapa yang melakukan apa, lalu cek urutan katanya.` in a native keyboard-accessible on-demand **Cara main** disclosure within the idle-only status region. Accessible touch target >=44px. Keep both sentences word-for-word. Opening Help cannot change selections, reveal the correct answer, or complete the activity.
- Wrong feedback continues to say `Belum tepat` and remains visible after a wrong keyboard choice; success still exposes `Tepat`, the correct ordered sentence, native canonical three-star Completion and Back/Again/Next/Share. No changes to the underlying `choose`, attempts, `accuracy=0.5` after one incorrect, `evidenceFidelity=choice_sentence_order_cards_interaction`, stage readiness, share, audio, or progress.
- Only scoped CSS module overrides, no global typography or body clipping and no World/Motion Engine/Shop/DB/auth changes.

## Verification gates
1. Exact-head PR **7/7 CI green**, including full Ubuntu/Windows engine and all Chromium learning, World, Shop boundaries.
2. Extend the existing `scripts/run-sentence-order-cards-browser-tests.mjs` for 320×720, 390×844 and 768×1024 to assert the **real order guide text and sequence elements**, exactly nine word cards, 3 canonical choices, Help closed/open/closed, visible initial instruction, 44px help trigger, keyboard wrong feedback, original correct choice, assessed evidence, Completion, no horizontal clipping. Capture idle/Help/wrong/success on each width. Tests archive exactly **12** PNGs into a dedicated hidden-safe folder `.vqa10-sentence-order/` before later mobile tests reset the standard screenshot folder; GitHub Actions uploads `vqa10-sentence-order-screenshots`.
3. Download the authentic artifact, inspect all 12 PNGs at 320/390/768, reject if the guide or choice rows clip or fall below playable viewport or the help obscures content. Merge protected exact-head squash only after screenshots accepted.
4. Separate **merged-main 8/8 Cloudflare exact deploy SHA** proof and real iOS Safari owner verification. Neither may be claimed from PR-green CI.
5. Family coverage is representative, **not 900 individual screenshot approvals**. Keep 47 patterns, 900 canonical content, answers, scoring/mastery/evidence/child progress/stage locks, World, Bermain/Motion Engine, Shop, DB/auth and paused character work unchanged.
