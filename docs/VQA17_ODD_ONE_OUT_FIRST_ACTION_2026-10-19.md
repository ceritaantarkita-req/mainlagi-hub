# VQA-17 — Odd One Out first-action hierarchy and optional Logic help

**Date:** 19 October 2026
**Status:** Draft / not merged / not live verified
**Base:** protected `main@8af6fb005499ad820d679996eb2dff65acf085e9` after VQA-16 label readability PR #527 merged.
**Parent issue:** #501.

## Evidence-based problem

The genuine nine-image VQA-16 Chromium QA artifact #12164317568 was downloaded and manually reviewed at 320×720, 390×844 and 768×1024 (idle/wrong/success). The previous VQA-16 fix made the essential **Anjing, Kucing, Mobil** labels (≥18px mobile) and their dog/cat/car icons readable, with three choices in the first viewport, valid wrong feedback, accuracy 0.5 and complete three-star Back/Again/Next/Share.

However, at 320px the activity still stacks three separate *always-visible* sets of similar instructions ahead of/around the playfield:

1. Main intro heading `Cari yang beda` plus supplementary `Bandingkan tiga kartu. Dua punya ciri yang sama, satu berbeda.`
2. Canonical Logic clue `2 mirip • 1 beda`, `Dua pilihan sama-sama hewan`, plus extra authored prompt `Bandingkan jenis setiap gambar. Cari satu yang bukan hewan.`
3. Bottom pre-attempt idle advice `💡 Lihat ketiganya sebagai satu kelompok, lalu pilih satu kartu yang berbeda.`

**The child must see the main Logic clue and all three picture choices before secondary explanation.** Do not drop the canonical clue, change the correct outsider, or treat the clue as decorative text.

## Strict five-file change

- Keep exactly one visible task heading `Cari yang beda`, preserve the `🔎` affordance in a compact opaque title panel and keep **`2 mirip • 1 beda` + canonical `config.commonTrait`** plainly visible above the three illustrated choices. Do not hide the underlying logical relation that drives this particular activity.
- Preserve all three supplemental original strings, without rewriting, in **one native `<details>` / `<summary>`** labelled `Cara main` in the idle status region only. It starts collapsed, supports keyboard/pointer, and has a minimum 44×44px tap target. The original extra `config.promptHint` stays available in this Help. Upon a wrong attempt, the unchanged original retry advice appears immediately; after real success, the original success + common-trait summary and canonical Completion remain unchanged.
- Scope CSS to `OddOneOutActivity.module.css`: reduce nested card heights and decorative shadows **without shrinking the three picture/label cards** or making original text/contrast unreadable over the Space Garden art.
- Extend existing `scripts/run-odd-one-out-browser-tests.mjs` at 320/390/768 to validate one visible heading, one visible canonical Logic relation, Help collapsed/open/closed with **all three exact original instructional strings**, no false completion, no overflow, 44px Help and choice touch targets, **same three >=18px captions + >=38px mobile icons**, genuine wrong keyboard and correct pointer choice, `accuracy=0.5`, assessed evidence, three-star Back/Again/Next/Share and Again local reset.
- Archive **12 actual PNGs** (320/390/768 × idle/Help/wrong/success) to `.vqa17-odd-one-out/` immediately after browser captures, before other mobile runners reset the shared folder. Upload them through a new hidden-safe `vqa17-odd-one-out-first-action-screenshots` artifact with `if-no-files-found: error`. Existing **9-PNG VQA-16 proof remains independently required**; the new test must not break it.

## Fail-closed gates and boundaries

1. Latest exact PR head **7/7 required CI checks PASS**, including comprehensive Ubuntu, Windows, Shop, secret/dependency/build and full Chromium regression.
2. Download all **12 genuine screenshots**, inspect 320 and 390 especially to ensure the Help text is fully visible when expanded, original Logic relation still readable, the three answer cards visibly dominate first action, retry state remains legible, and canonical Completion/Share is not clipped. Any overlap or unreadable text fails the visual review regardless of CI outcome.
3. Protected exact-head squash merge only after acceptance. Separately verify **merged-main 8/8 Cloudflare exact-deployed SHA** and physical iOS Safari before claiming production *live verified*.
4. No change to 900 canonical activity content/IDs, 47 patterns, original clues/correct answer, scoring/mastery/assessed evidence, child progress or stage locks, World, Bermain Motion Engine, Shop, DB/auth, global typography or paused character work. The representative case does not authorize claiming 900 individual visual approvals.
