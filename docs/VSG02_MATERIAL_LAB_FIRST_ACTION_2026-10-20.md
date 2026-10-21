# VSG-02 — Material Lab child-first instruction & compact feedback

Date: 20 October 2026
Base: `main@b86e0277166202ac21b3610e11f7e5a1bdefc4cb` (VSG-01, PR #531 merged).
Status: **IMPLEMENTED ON REVIEW BRANCH / CI, SCREENSHOT AND LIVE QA PENDING**.

## Evidence and purpose

The previously generated production-build screenshot matrix (main CI for PR #529, screenshot `390-material-lab-idle.png`, plus 320/768 samples) showed three simultaneous instruction-like elements: Garden title **Bahan jas hujan**, inner title **Laboratorium bahan** and paragraph **Pilih sifat bahan yang paling cocok, lalu uji pilihanmu.** Another full-sentence idle status appears below the choose → test workbench. These crowd the first action. The material object, purpose, sample labels and actual test action are **task content**, not optional chrome.

Material Lab is one of the Science-specific 47 patterns; its canonical material choice and explicit **second Test button** must remain. This wave is one scoped adoption of the pre-existing `planChildVisualHierarchy` system, not a new global renderer.

## Source changes

- `MaterialLabActivity.tsx` retains original `activity.title` in the accessible activity section, original `activity.prompt` for `Dengar`, and the unmodified 3 choices/true answers. Remove only the redundant *visible* Garden title; present a single main instruction **Pilih sifat, lalu uji!**. Place the previous explanatory line behind a keyboard/touch-accessible **Cara main** toggle. The two-step selection/test control, sample, object and purpose panels remain.
- The idle bottom status is empty and visually absent; after choosing a sample, provide a short cue to the named test; on wrong selection, **Belum cocok. Coba sifat lain!**. Keep the complete success explanation in the status live region for assistive technology, not repeated behind the 3-star completion modal.
- Use the existing opt-in child typography role, conservative narrow-screen whole-word wrapping, minimum 44px Help/Test targets and legible choice labels. Remove the extra large instruction box but **not** the scientific setup, the three materials or the testing workbench.
- Use canonical concise three-star completion, with Back / Again / Next / Share unchanged. No reward/accounting changes.
- Extend the existing Material Lab Chromium QA at **320, 390, 430, 768, 1280px**: one primary question, optional help initially hidden, original answer labels and semantic visual provenance, choice/test correctness, failure/retry, attempts/evidence, completion and Again semantics.

## Strict non-goals

No changes to the 900 activity catalog, 47 pattern classification, answer order/correctness, explicit Test gate, `materialLabConfig`, stage/readiness, evidence/mastery, progress, World, Motion Engine, Shop, authentication, database, or audio provider. No new character art/assets or global CSS overrides.

## Acceptance gates

- [ ] Exact PR-head CI **all seven required jobs PASS** (including Chromium).
- [ ] Manually review idle/wrong/success screenshots at 320/390/430/768/1280; confirm question/choices/test target readability and completion within viewport.
- [ ] Confirm tested wrong samples never complete, selecting correct sample alone never completes, explicit test completes only once, Again resets local state without extra assessed write.
- [ ] Confirm **Cara main** remains keyboard accessible with truthful full instruction.
- [ ] Squash-merge only after acceptance. Exact-merged-SHA Cloudflare smoke and physical iOS Safari approval are separate gates; never call a PR build live.

Next family after this pilot is chosen from fresh screenshots and source inventory, not a bulk search-and-replace of 47 components.

Reference: `docs/MAINLAGI_CHILD_GAMEPLAY_GLOBAL_VISUAL_AUDIT_2026-10-20.md`; `docs/VSG01_ODD_ONE_OUT_SHARED_VISUAL_ROLES_2026-10-20.md`; issue #501.

## CI screenshot acceptance evidence (added 21 October)

The canonical Chromium suite already captures 5 viewports × idle/try/success (320, 390, 430, 768, 1280), but the default `mobile-route-qa-screenshots` archive is ~220 MB and cumbersome to review. To make visual sign-off reproducible, the exact same original PNGs are copied into ignored `.vsg02-material-lab/` at capture time and uploaded separately as `vsg02-material-lab-screenshots` (15 original screenshots, never rendered mockups). No runtime or scoring changes. Review this artifact from the **last PR commit**, and leave PR unmerged until appearance, clipping, first action, and completion are reviewed; Cloudflare exact-SHA verification remains a separate post-merge requirement.
