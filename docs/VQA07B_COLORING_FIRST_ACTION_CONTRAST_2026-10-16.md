# VQA-07b — Coloring Instruction Contrast Pilot

Date: 16 Oct 2026. Status: **review-only branch, NOT merged or live**.
Parent: VQA #501; previous VQA-07 32-state screenshot QA PR #516 merged to `main@1b6b428e5b6f488e9783f16adc32ffff4c1278ff`.

## Evidence: narrowly observed
Artifact `#12021902313` from completed PR #516, actually reviewed all 32 screenshots:
- 320×720/390×844 idle + worked: the copy **"Pilih warna. Sentuh gambarnya."** appears on top of colorful framed artwork of the Coloring studio. It remains visible but has weaker contrast than the main title/canvas.
- 768 and 1280 have the same story-frame/color-wall backdrop under the instruction; no clipping or broken gameplay was observed.
- The 100 Coloring authored scenes, 100 Drawing authored scaffolds and all creative completion semantics are already accepted by regression. This is **minor child first-action legibility**, not an instruction rewriting or canvas algorithm defect.

## Deliberately scoped patch
- `CreativePracticeActivity.tsx`: add one CSS-module class and `data-creative-color-instruction="v1"` to **only** the existing Coloring instruction paragraph; preserve text verbatim.
- `CreativeStudio.module.css`: dark legible foreground, 15–18px support role, warm **localized transparent radial feather**, zero rectangular backplate and no extra container. No change to the drawing scaffold/instructions, canvas, palette, background art, coloring geometry, clickable/keyboard regions, Completion, Again, voice, progress or scoring.
- `run-vqa07-creative-visual-browser-tests.mjs`: fail-closed assertions for instruction text, 320/390/768/1280 contrast color, feathered no-backplate gradient, transparent background, no border, in-frame geometry and Drawing isolation. Existing 32 screenshots plus canvas and completion regression **must still pass unchanged**.

## Acceptance
1. PR exact-head 7/7 CI. Download the VQA-07 creative artifact and compare 320/390/768/1280 Coloring idle with pre-change `#12021902313`, plus all state screenshots.
2. Reject if the halo looks like a separate hard card, obscures the subject mural, reduces visible first artwork, or introduces clipping. Do not solve by editing authored text or changing progress/evidence/geometry.
3. Only then protected squash merge; merged-main 8/8 + exact-SHA Cloudflare and physical Safari remain separate acceptance.
4. No extra gameplay patterns or assets, no World/Motion Engine/Shop/auth/DB/character edits. Catalog 900/900 classified remains distinct from human visual acceptance.
