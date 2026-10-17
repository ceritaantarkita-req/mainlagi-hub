# VQA-12 — Syllable Assembly first-action and duplicate-cue removal

**Date:** 18 October 2026
**Status:** DRAFT / NOT MERGED / NOT LIVE VERIFIED
**Base:** `main@f342071ef5fd8d2aef04c83807dc36af4c35697c` (VQA-11 Reading Passage merged)
**Parent:** Issue #501

## Baseline evidence and what is actually wrong

Reviewed original authentic Chromium mobile-route artifact `#12021887501` from VQA-07 baseline (same Syllable CSS/runtime as just before this wave), including 320×720, 390×844 and 768×1024 representative idle PNGs for `bahasa-gabung-baju`.

- At **320×720** `@media(max-width:360px) .promptCard{display:none}` removes the main **Satukan suku katanya** task heading completely. Yet the child's `ba + ju = ?` exercise, `Petunjuk: Baca dari kiri ke kanan: ba lalu ju.` and separate *identical* `💡 Baca dari kiri ke kanan: ba lalu ju.` status both remain visible.
- At 390×844 and 768×1024 the heading does render, but the introductory secondary sentence and both duplicated cue panels compete with the essential exercise and three canonical words.
- The `ba` + `ju` = `?` pieces and the three choice buttons `baju / buku / bola` are essential core learning content; never remove, rescore or leak `baju` before a true correct assessment. Existing TTS narration, audio access, Garden backdrop and local Progress/Completion remain unchanged.

## Scoped implementation

1. Keep **Satukan suku katanya** as the single on-screen primary task instruction at all widths, including 320px. Compact its backed prompt area for mobile without deleting it or exposing raw text against illustration.
2. Remove only the always-visible duplicate cue cards: preserve the original supplemental instruction `Baca dua bagian dari kiri ke kanan, lalu pilih kata yang terbentuk.` and the exact `Petunjuk` cue `Baca dari kiri ke kanan: ba lalu ju.` in a **single, native keyboard/touch `<details>`** within the idle status area. It starts closed; visible trigger **Cara main** has minimum 44×44px hit geometry. The original cue remains in a `data-syllable-cue` element, just hidden until requested. No new output answer.
3. Upon an incorrect choice, the original `Belum tepat. ${config.cue}` is displayed immediately; after a real correct choice, the original `Tepat` and canonical three-star Back/Again/Next/Share Completion remain. Assessment, scoring, evidence, choice order, result masking and retry counts untouched.
4. Only `SyllableAssemblyActivity.tsx` and its own CSS module are changed; no shared styles, curriculum data, World, Motion Engine, Shop, DB/auth, paused characters or other game patterns.

## Mandatory acceptance

- Existing full 7/7 PR CI, including Ubuntu, Windows, Chromium, dependency/security/build/Shop staging.
- Expanded existing canonical `scripts/run-syllable-assembly-browser-tests.mjs` retains stage readiness, `ba`/`ju` content, hidden result, three original choices, keyboard wrong state, true correct, assessed `accuracy=0.5`, completion, no horizontal clipping and 44px options. Add strict assertions that 320px heading exists and visible, Help is collapsed/expanded/collapsed, original cue restored on demand without answer leak.
- Archive actual **12 screenshots** (3 widths 320/390/768 × idle/help/wrong/success) to dedicated hidden-safe `.vqa12-syllable-assembly/` and Actions `vqa12-syllable-first-action-screenshots`; fail closed on missing counts or hidden upload.
- Download and review all 12 genuine screenshot PNGs before protected squash merge. At 320 ensure task title appears while all choice buttons and Help remain in first viewport and Help-open is not clipped. Correctness, mask and persisted evidence checks must pass. If failed, fix only the discovered issue and rerun full CI on exact final head.
- Verify production exact-commit Cloudflare smoke 8/8 on merged main, and physical iOS Safari/owner separately. Do not claim either solely because PR CI passed.
- 900 canonical activities/47 patterns remain frozen; tested case is representative, **not a claim of 900 human visual approvals**.
