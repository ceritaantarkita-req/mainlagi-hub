# Mainlagi — Product UX Next Work

Date: **20 September 2026**  
Last synchronized: **21 September 2026**  
Status: **ACTIVE ROADMAP / SUBJECT BACKGROUNDS LIVE VERIFIED / CHARACTER LAYER FOUNDATION ACTIVE**  
Current synchronized baseline: production `main` = `41df41c9dc0edc449af8260bbfe3887e0175bfb0` (PR #257 docs closure, CI #1186 exact Cloudflare smoke); subject-background runtime implementation = `7502c708c998c87bb273639025fcb10ba6c81e12` (PR #256, CI #1183 exact Cloudflare smoke).

This document is the short human/AI handoff for the next Mainlagi product-quality wave. It records the user-accepted UX direction without changing curriculum, mastery, evidence, progression, or the active WS-05 gameplay audit.

## Current product truth

- Production source of truth remains GitHub `main`; `mainlagihub.my.id` is deployed from `main`.
- Current learning catalog remains **9 subjects / 900 activities**.
- Current merged gameplay baseline remains **47 active patterns**; the Logic repeating-pattern -> existing `pattern_completion` audit is a separate WS-05 track.
- Garden visual identity is already live, but **20 September user acceptance reopened product UX work**. Automated green checks do not mean the current child/parent UX is accepted.
- The current codebase contains overlapping child/parent presentation paths. Before broad redesign, active/canonical components must be identified and legacy presentation paths retired or clearly isolated.

## Product characters
### Activity character presentation foundation

Canonical contract: [`CHARACTER_PRESENTATION_SYSTEM.md`](CHARACTER_PRESENTATION_SYSTEM.md).

- Activity character placement is moving from hardcoded Garden mascots to a central presentation resolver.
- Runtime remains fail closed to approved assets: Gavi/Paca only today.
- English is prepared for Naya + Zia and Math for Gian + Paca, but those human characters do not activate until isolated transparent production files pass visual/provenance/responsive QA.
- Naya/Gian/Zia design-set PNGs in Drive are reference sheets, not direct runtime sprites.
- Creative workspace routes continue to hide decorative character layers.
- No new pairing is inferred for the other subjects without product approval.


Mainlagi has five primary characters:

1. **Naya** — older sister figure, approximately 8, wears hijab; warm and encouraging.
2. **Gian** — boy, approximately 5; active, curious and playful.
3. **Zia** — girl, approximately 3; expressive and beginner-friendly.
4. **Paca** — friendly male-coded robot; hints, system guidance and discovery.
5. **Gavi** — orange cat; humor, rewards and reactions.

Paca and Gavi are already exposed in the current Garden UI. Naya, Gian, and Zia still need production-ready visual assets.

### Character rules

- Homepage hero must eventually show all five characters in one coherent Mainlagi scene.
- Extend the existing canonical `MAINLAGI_ART_BIBLE.md` with a production-grade character section before generating many new assets: proportions, clothing, face, palette, front/three-quarter/back views, expressions, and allowed variations.
- Do not use unrelated emoji as a substitute for production character art.
- Child profile identity and Mainlagi guide character are separate concepts.

### Current character asset truth

- Paca: production Garden WebP exists at `public/artwork/garden-paca.webp`.
- Gavi: production Garden WebP exists at `public/artwork/garden-gavi.webp`.
- Naya/Gian/Zia: no production image files under `public/artwork` yet.
- Current `CharacterAvatar` uses inline fallback SVGs for Naya/Gian/Zia.
- Paca/Gavi coloring previews exist; this art wave does not authorize new Naya/Gian/Zia coloring activities.
- Generated character candidates require visual review plus asset provenance/rights documentation before production integration.

## P0 — next implementation wave

### 1. Canonical UI architecture

- Audit active routes and decide the canonical child, activity, catalog, profile, and parent components.
- Remove, retire, or explicitly mark legacy presentation paths.
- Shared UX must not be implemented separately in many activity renderers when one reusable component can own it.

### 2. Console and runtime hygiene

- Inventory browser warnings seen during real production use.
- Fix unexpected warnings instead of hiding them.
- Acceptance target: **0 unexpected console errors and 0 unexpected console warnings** on the canonical QA routes.

### 3. Homepage and navigation

- Rebuild the child homepage hero with a clean responsive composition.
- Hero target: five-character Mainlagi scene, clear greeting/CTA, no overlapping layout.
- Rename child navigation:
  - `Beranda` -> **Belajar**
  - `Main gerak` -> **Bermain**
- Keep motion-game meaning clear through icon/copy; do not change route semantics silently.

### 4. Subject cards

- Remove `100 aktivitas` from subject cards.
- Use a clean **3-column grid** on mobile and desktop; mobile cards must be redesigned for this density rather than only changing CSS column count.
- Keep icon size, title height, card height, spacing, and touch targets consistent.
- Nine subjects should read as a clear 3 x 3 directory where space allows.

### 5. QA unlock mode

- Add a temporary **unlock-all QA mode**, preferably for `demo-gian` and/or an explicit development/QA flag.
- Do **not** delete or weaken the real progression/mastery rules.
- Normal production profiles must still be testable with the real unlock path.

### 6. Activity catalog redesign

- Replace cramped mini-question thumbnails with picture-first, child-readable previews.
- Prevent clipped/wrapped word fragments like the current Science examples.
- Do not present 100 activities as an undifferentiated wall.
- Recommended structure: **Continue / Recommended / lesson or category groups / All games**.
- Preserve direct access for QA while keeping the child-facing hierarchy simple.

### 7. Matching gameplay

- Randomize matching positions so correct pairs are not revealed by adjacency.
- Shuffle left/right groups independently.
- Retry should generate a new valid arrangement.
- Difficulty should scale from fewer pairs to more pairs/distractors where the canonical activity permits it.
- Randomization must not change canonical answer/evidence semantics.

### 8. Shared completion experience

Create one reusable completion system for compatible activities:

- animated praise such as **Great Job**, **Excellent**, and equivalent approved copy;
- three-star celebration;
- **Back**;
- **Try Again**;
- **Next**;
- **Share**.

Share opens a modal with at least Copy Link, WhatsApp, Threads, X, Telegram, and Facebook where supported. External/social sharing must be parent-gated and must not expose child name, age, account ID, detailed progress, or private learning data.

### 9. Narration entry latency

- A child who cannot yet read should receive the instruction immediately or as soon as browser audio permission allows.
- Preload/prefetch the next activity narration and warm the audio path before the activity needs it.
- Keep a clear replay control.
- Measure start latency; do not rely only on subjective QA.
- Browser autoplay restrictions must be handled honestly rather than bypassed.

### 10. Parent and settings UX

- Redesign `/parent` for mobile and desktop; current wrapped top navigation is not accepted.
- Parent home should answer: **what did my child do, how are they progressing, and what is next?**
- Surface useful progress, attempts, mastery/evidence where valid, recent activity, stars/streak if supported, recommendations, reports, and certificates.
- Separate demo profile from real family profiles.
- Separate child identity/avatar from guide character.
- Replace the mobile profile/settings dropdown with a responsive sheet/menu that does not cover the child page.
- Add/organize About, FAQ, Policy/Privacy/Terms, and Recommendations/Affiliate on parent/public surfaces, not in the child menu.

## P1 — after the P0 structure is stable

### Voice quality

- English narration must sound natural/native enough for a children's English-learning product.
- Browser `speechSynthesis` may remain fallback, but production narration should evaluate pre-generated/cached audio so voice quality is stable across devices.
- Keep Indonesian and English voice paths language-correct.
- Review voice provider/licensing/cost before locking the implementation.

### Subject visual themes / backgrounds

Canonical execution spec: [`SUBJECT_BACKGROUND_SYSTEM.md`](SUBJECT_BACKGROUND_SYSTEM.md).

- The system is live in production across all **9 subjects / 900 activities**.
- There are **54 reusable scene families**: six per subject.
- The approved production set contains **108 optimized WebP assets**: 54 wide + 54 mobile.
- Activity mapping remains centralized in `activityVisualTheme.ts`; no renderer owns its own subject mapping.
- Resolution is deterministic and presentation-only; it does not inspect canonical answers or alter evidence/mastery/progression.
- Desktop/mobile artwork remains an art-directed pair rather than a blind crop.
- Gameplay/text/canvas UI stays in a safe foreground layer; gameplay backgrounds do not bake in characters, answers or instructions.
- Drawing and Coloring use the same shared frame in workspace mode; dedicated runtime surfaces may remain explicit exceptions.
- Integration is **merged / live verified** at `7502c708c998c87bb273639025fcb10ba6c81e12`; merged-main CI #1183 passed exact Cloudflare production smoke.
- Detailed implementation record: [`SUBJECT_BACKGROUND_ALL_SUBJECTS_INTEGRATION_2026-09-21.md`](SUBJECT_BACKGROUND_ALL_SUBJECTS_INTEGRATION_2026-09-21.md).
- Project-owner production preview now covers one live desktop route in each of the nine subjects; see [`SUBJECT_BACKGROUND_PRODUCTION_PREVIEW_REVIEW_2026-09-21.md`](SUBJECT_BACKGROUND_PRODUCTION_PREVIEW_REVIEW_2026-09-21.md).

### Learning illustrations

- Replace ambiguous or tiny learning emoji/icons with consistent child-readable artwork where recognition is part of the task.
- Minimum requirement: the pictured object must be recognizable without relying on the text answer.
- Maintain one visual language across Windows, Android, and iOS rather than depending on platform emoji rendering.

## Execution status — 20 September 2026

- Canonical UI / warning audit: **done**.
- Homepage/header/3-column subject directory: **merged**.
- Activity gallery + isolated QA unlock: **merged**.
- Shared completion: **merged / live verified** at `53a5f04`, CI #1129 exact Cloudflare smoke.
- Matching randomization/difficulty: **merged / live verified** at `61f8fb6`, CI #1134 exact Cloudflare smoke.
- Audio first-instruction latency: **merged / live verified** at `770d8b6`, PR CI #1144 + merged-main CI #1145 exact Cloudflare smoke.
- Parent/profile/settings responsive redesign: **merged / live verified** at `77bee68`, PR #251; exact-head CI #1159 + merged-main CI #1160 exact Cloudflare smoke.
- Subject-background wave: **merged / live verified** via PR #256 at `7502c708c998c87bb273639025fcb10ba6c81e12`, with 54 scene families / 108 responsive WebP assets / deterministic 900-activity mapping and merged-main CI #1183 exact production smoke. Project-owner desktop preview now represents all nine subjects; docs closure PR #257 is live at `41df41c9dc0edc449af8260bbfe3887e0175bfb0` with CI #1186 exact production smoke.

## Implementation order

1. Canonical component/route audit + console-warning audit.
2. Homepage/header/navigation + 3-column subject directory.
3. Activity gallery/catalog.
4. Shared completion system.
5. Matching randomization and difficulty rules.
6. Audio first-instruction latency.
7. Parent/profile/settings responsive redesign.
8. Extend canonical Art Bible character production spec + create/review Naya/Gian/Zia production assets.
9. All-subject background integration — **closed / live verified**.
10. Activity character presentation foundation + production Naya/Gian/Zia assets.
11. English voice-quality upgrade.
11. Expanded visual/usability QA and cleanup of superseded components.

WS-05 gameplay-mechanic work may continue independently only when it preserves its existing objective/evidence gates. Do not mix a broad UX refactor into a mechanic-reuse PR.

## Acceptance gates

A wave is not complete only because CI is green.

Required evidence for affected surfaces:

- 320x720, 390x844, 768x1024, and desktop 1280x800 where relevant;
- no horizontal clipping/overflow;
- child-readable icon/illustration scale;
- touch targets remain accessible;
- idle, wrong/retry, success, loading, audio-unavailable, and completion states where applicable;
- Back / Try Again / Next behavior correct;
- matching arrangement does not leak the answer;
- narration language is correct and start latency is recorded;
- profile menu and parent navigation do not cover or break the page;
- **0 unexpected console errors/warnings**;
- manual screenshot review by a human;
- final child/parent usability review remains separate from automated checks.

## Guardrails / non-goals

This wave must **not**:

- rewrite mastery, evidence, curriculum, or database schema without a separately justified requirement;
- permanently bypass progression just to make QA easier;
- invent Pattern #48 to satisfy a numeric target;
- expose affiliate/social links directly in child mode;
- leak child/private data through sharing;
- claim 900 unique experiences merely because 900 routes exist;
- mix large AI tutor, OCR, marketplace, or paywall work into this UX wave.

## AI-agent handoff

Before coding:

1. Read `docs/CURRENT_STATE.md`.
2. Read `docs/NEXT_PRODUCT_QUALITY_PLAN.md`.
3. Read this document.
4. Confirm current `main` SHA and active PR/branch state.
5. Keep UX work in a dedicated branch/PR.
6. Preserve canonical learning/evidence behavior unless the task explicitly changes it.
7. Update this plan and `CURRENT_STATE.md` after each completed wave with exact PR/SHA/CI/production evidence.
