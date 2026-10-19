# VQA-15 — Phrase–Scene single English first-action question

Date: 19 October 2026
Status: DRAFT / NOT MERGED / NOT LIVE VERIFIED
Base: `main@3b0cb07ed6a89cb043d36529c00f91ae06e91044` (VQA-14 label legibility #525 merged)
Parent: Issue #501

## Evidence and visual problem
Authentic exact-head 320×720/390×844/768×1024 VQA-14 screenshots (CI artifact #12127822550) show that full English labels are now readable and the 3 scene choices remain in first viewport. But the intro stacks *four* texts: Garden's existing activity title `A SMALL CAT`, a decorative `English phrases` badge, redundant Indonesian heading `Cocokkan frasa dengan scene`, and the canonical authored English question `Which phrase means a small cat?`. The latter, not the generic category/translated heading, is the real task instruction. The children are ages 3–7 and shouldn't have to decode extra heading chrome before tapping matching pictures. This is a presentation diagnosis, not a reason to modify the curriculum or correct answer.

## Minimal owned change
- Keep Garden's existing title and English narration untouched. In `PhraseSceneMatchActivity`, remove only the additional decorative category badge and redundant Indonesian scene heading; expose the unchanged authored **`activity.prompt`** as the one readable secondary `h2` question with the existing `data-phrase-scene-prompt` hook.
- Keep the existing light opaque/gradient-backed intro surface against the richly illustrated Garden artwork. Reduce vertical stacking using a single 20–28px, high-contrast semantic English question, responsive to 320/390/768.
- Keep the VQA-14 large **>=17px** original English `A SMALL CAT`/`A BIG DOG`/`TWO CATS` choices, all semantic picture shapes, canonical answer, responsive height, actual wrong feedback cue (size/noun/quantity), stage readiness, TTS, completion and Again. No changes to gameplay state/evidence, choices, stage locks, World/Bermain/Shop/DB/auth or shared Completion.
- CSS cleanup removes obsolete .intro h1 / .intro p / .badge selectors from this **single Phrase–Scene CSS module**; it retains the fixed-position modal ancestor rule from VQA-13.

## Fail-closed verification
1. Extend the *existing* 320×720, 390×844 and 768×1024 route test: one canonical prompt element, semantic h2, exactly no redundant "English phrases" badge or Indonesian heading, computed question font >=20px, question contained in backed intro and separate from scene cards, one first-view instruction; preserve all previous VQA-13/VQA-14 tests for 3 choices/full original labels/17px+ type, no clip/overflow, keyboard wrong/correct, `accuracy=0.5`, full viewport 3-star completion and Back/Again/Next/Share.
2. Existing `vqa13-phrase-completion-screenshots` artifact already produces precisely **12 genuine PNGs** from the same test: 320/390/768 × idle/try/success/Again. Do **not** add a duplicate uploader. Review all twelve on the exact new head, especially whether the actual question remains readable and original labels are untouched.
3. Exact-head 7/7 CI and screenshots are required before squash merge. Main Cloudflare deployed-SHA 8/8 and a real iOS Safari owner check are **separate** gates before claiming live verified.
4. Canonical 900 activities and 47 pattern classification are unchanged. This is representative route QA, not a claim that all four Phrase–Scene activities or 900 activities were individually signed off. Character development remains paused.
