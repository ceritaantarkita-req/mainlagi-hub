# Mainlagi Subject Background System

Status: **CANONICAL DESIGN/IMPLEMENTATION HANDOFF — ASSET REVIEW BEFORE CODE**  
Date: **20 September 2026**

Use this document as the short source of truth for subject/activity backgrounds. Read it with `MAINLAGI_ART_BIBLE.md` and `PRODUCT_UX_NEXT_WORK_2026-09-20.md`.

## Goal

- Stop using one Garden background for most activities.
- Keep Mainlagi as one coherent visual world while giving subjects and activities distinct scene identity.
- Keep backgrounds decorative; gameplay, text, answers and evidence stay in UI/runtime layers.
- Build a reusable system, not 900 unrelated background files.

## Current pilot — Math + Science

- Pilot subjects: **Math** and **Science**.
- Current landscape candidates are staged outside the public repo for visual review; they are **not production-approved assets yet**.
- Math candidates:
  - `math-scene-number-park-v1.png`
  - `math-scene-playground-park-v1.png`
  - `math-scene-mini-market-v1.png`
  - `math-scene-shape-playground-v1.png`
  - `math-scene-block-yard-v1.png`
  - `math-scene-measurement-workshop-v1.png`
- Science candidates:
  - `science-scene-garden-lab-v1.png`
  - `science-scene-pond-v1.png`
  - `science-scene-weather-meadow-v1.png`
  - `science-scene-greenhouse-v1.png`
  - `science-scene-nature-trail-v1.png`
  - `science-scene-material-workshop-v1.png`

## Immediate next image work

- Generate **12 mobile/portrait counterparts**, one for every Math/Science landscape candidate.
- Recompose each scene for portrait; **do not merely crop the landscape file**.
- Keep the same scene identity, palette and major edge props between wide/mobile pairs.
- Suggested candidate naming: same base name plus `-mobile-v1.png`.
- Review each wide/mobile pair before any runtime integration.
- Do not generate the remaining subjects until the Math/Science pair system is visually accepted.

## Visual composition contract

- Style: current Mainlagi Garden 2D illustration language; friendly, rounded, clean and low-noise.
- No photorealism, no unrelated style changes, no platform emoji as core artwork.
- Keep the central gameplay zone visually quiet and lower-contrast.
- Prefer large decorative props near the outer edges; avoid critical objects at crop-sensitive extremes.
- Keep top/header space readable and avoid busy detail behind titles/instructions.
- Keep bottom foreground controlled so it cannot cover answers, CTA or completion controls.
- Do not bake task text, answers, letters, numbers, progress or instructions into the background.
- Do not draw decorative objects that look like tappable answer controls unless the runtime actually uses them.
- A scene may communicate context (market, pond, greenhouse, workshop) but must not change the learning objective.

## Responsive art-direction contract

- Treat desktop/tablet landscape and phone portrait as one **scene pair**.
- Use separate mobile artwork when a `cover` crop would remove context or place decoration behind controls.
- The background layer must be bounded to the activity viewport; never solve overflow by hiding document-level overflow.
- Gameplay/UI lives in its own foreground layer above the scene.
- A scene is acceptable only when the same activity remains readable and usable at:
  - 320x720;
  - 390x844;
  - 768x1024;
  - 1280x800;
  - 1440x900 for wide-crop review.
- Motion-game/camera surfaces may keep their dedicated dark runtime and are not forced into Garden scenery.

## Runtime architecture to implement after asset approval

- Add a data-driven `SubjectTheme`.
- Add reusable `SceneVariant` records for wide/mobile assets and positioning.
- Resolve visual treatment centrally with a function equivalent to `resolveActivityVisualTheme(activity)`.
- Resolution must be deterministic: the same activity should not receive a random scene on each render.
- Scene selection may use subject + stage/lesson + activity identity; it must not parse answers or change content.
- Shared Garden activities should consume the resolved scene through `GardenActivityFrame`.
- Special runtimes (Math Trace, creative workspace, World runtime, motion, etc.) may render differently but should consume the same visual-theme context where appropriate.
- Do not hardcode subject background choices independently across dozens of activity components.

## Scale rule

- Target roughly **5–8 scene families per normal subject**, not one asset per activity.
- Reuse is allowed when neighboring activities still feel varied and the scene remains semantically appropriate.
- Current rollout order after Math/Science approval:
  - Bahasa Indonesia + English;
  - Logic + Iqro;
  - Huruf & Menulis;
  - Coloring + Drawing with lighter workspace-oriented scenery.
- Candidate ideas already approved for later exploration:
  - Bahasa: Taman Baca, Perpustakaan Kecil, Kebun Huruf, Panggung Cerita, Kampung Kata, Picnic Story Garden.
  - English: Playroom, Playground, Picnic Park, Little Town, Story Corner, Adventure Garden.

## Production naming and storage

- Candidate PNGs may stay outside the public repository during review.
- After approval, optimize production assets and prefer a structure equivalent to:
  - `public/artwork/backgrounds/<subject>/<scene>-wide.webp`
  - `public/artwork/backgrounds/<subject>/<scene>-mobile.webp`
- Final file naming must be stable; runtime config should reference scene IDs, not ad-hoc filenames scattered through components.
- Public-repo binaries require the provenance/rights review in `ASSET_PROVENANCE.md`.

## Acceptance checklist

- Wide/mobile pair clearly represents the same scene.
- No important object is lost on phone.
- No horizontal page overflow.
- Title/instruction contrast remains readable.
- Choices, board, characters and feedback are not covered.
- Foreground decoration does not look interactive by accident.
- Scene variation is visible without making the product feel like unrelated mini-apps.
- Manual screenshot review passes in addition to automated QA.
- No mastery, evidence, answer, progression, schema or activity-order behavior changes.

## AI-agent execution order

1. Read this file, `MAINLAGI_ART_BIBLE.md`, `MOBILE_DESIGN_SYSTEM.md`, and the current activity route/frame code.
2. Confirm the Math/Science wide + mobile pairs have been visually approved.
3. Confirm provenance/redistribution status before adding binaries to the public repo.
4. Implement `SubjectTheme` + `SceneVariant` + one central resolver.
5. Integrate the shared Garden frame first; then cover explicit runtime exceptions.
6. Run responsive screenshots at the required viewports and review them manually.
7. Only after the pilot is accepted, expand scene generation to the remaining subjects.
8. Update current-state docs with exact PR/SHA/CI evidence after implementation.


## 21 September 2026 pair-review checkpoint

The first Math + Science pilot now has all 12 wide/mobile scene pairs available outside the public repository and the composition-level pair review is complete.

- 6 Math scene pairs: PASS for pair identity / mobile recomposition / gameplay-safe composition.
- 6 Science scene pairs: PASS for pair identity / mobile recomposition / gameplay-safe composition.
- Candidate binaries remain **non-production** pending provenance / redistribution approval.
- Runtime integration must stay fail-closed until approved WebP assets exist under the canonical public artwork path.
- Detailed review record: `docs/SUBJECT_BACKGROUND_PAIR_REVIEW_2026-09-21.md`.

The runtime foundation may now be implemented independently of binary activation: typed subject/scene contracts, deterministic activity-to-scene resolution, route-level theme context, and `GardenActivityFrame` support for approved responsive sources. This separation lets architecture move forward without silently promoting candidate art into the public AGPL tree.
