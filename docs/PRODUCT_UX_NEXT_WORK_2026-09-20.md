# Mainlagi — Product UX Next Work

Date: **20 September 2026**  
Last synchronized: **22 September 2026**  
Status: **ACTIVE ROADMAP / SUBJECT BACKGROUNDS LIVE VERIFIED / CHARACTER ASSET PIPELINE LIVE VERIFIED**  
Current synchronized baseline: production `main` = `709e2b7d3e529cf37f10a05e9c9dc92884e0a781` (PR #273 WS-05 Logic `pattern_completion` reuse, merged-main CI #1353 / run `35687996669` including exact Cloudflare smoke). Character asset pipeline PR #263 remains live and character production is paused; subject-background runtime implementation remains PR #256 live verified.

This document is the short human/AI handoff for Mainlagi product-quality work. It records the user-accepted UX direction without changing curriculum, mastery, evidence or progression. The latest WS-05 Logic reuse wave is closed; any later mechanic work remains a separate audited track.

## 22 September execution override

- **Mainlagi World is being developed separately and must not be modified by this workstream.**
- Character development is **PAUSED**; Drive character assets are reference-only.
- Mainlagi Belajar WS-05 Logic repeating-pattern -> existing `pattern_completion` reuse is **CLOSED / MERGED / LIVE VERIFIED** through PR #273 -> main `709e2b7d...`.
- Final PR CI #1321 and merged-main CI #1353 passed; production truth is 900/900 / 47 active / `choice_grid` 174 / `pattern_completion` 10 / KEEP 900.
- Do not mix World, character runtime, or broad UX refactors into any later WS-05 audit/runtime wave.


## Current product truth

- Production source of truth remains GitHub `main`; `mainlagihub.my.id` is deployed from `main`.
- Current learning catalog remains **9 subjects / 900 activities**.
- Current merged gameplay baseline is **47 active patterns / `choice_grid` 174 / `pattern_completion` 10**; the Logic repeating-pattern reuse is closed/live verified and any later WS-05 work requires a fresh audit.
- Garden visual identity is already live, but **20 September user acceptance reopened product UX work**. Automated green checks do not mean the current child/parent UX is accepted.
- The current codebase contains overlapping child/parent presentation paths. Before broad redesign, active/canonical components must be identified and legacy presentation paths retired or clearly isolated.

## Product characters
### Activity character presentation foundation

Canonical contract: [`CHARACTER_PRESENTATION_SYSTEM.md`](CHARACTER_PRESENTATION_SYSTEM.md).

- Activity character placement is centralized in the presentation resolver and remains merged/live verified.
- Canonical runtime asset lifecycle registry is live through PR #262.
- Production-only human asset directory, machine-readable provenance registry, WebP alpha/dimension/size validation, regression fixtures and deliberate git-staging friction are live through PR #263.
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
- Naya/Gian/Zia provenance records remain `reference-only` with no production path; `public/artwork/characters/` contains no approved human production binary yet.
- Fresh Drive intake audit found no separate human foreground candidate beyond the canonical design sheets; product/QA screenshots such as `child-demo-gian-*` are explicitly excluded as source artwork.

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

Canonical records:
- [`LEARNING_ILLUSTRATION_CONSISTENCY_AUDIT_2026-09-22.md`](LEARNING_ILLUSTRATION_CONSISTENCY_AUDIT_2026-09-22.md)
- [`LEARNING_VISUAL_CONTAINMENT_PILOT_2026-09-22.md`](LEARNING_VISUAL_CONTAINMENT_PILOT_2026-09-22.md)
- [`LEARNING_VISUAL_CONTAINMENT_CLOSURE_2026-09-23.md`](LEARNING_VISUAL_CONTAINMENT_CLOSURE_2026-09-23.md)\n- [`LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_PILOT_2026-09-23.md`](LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_PILOT_2026-09-23.md)\n- [`LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_CLOSURE_2026-09-23.md`](LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_CLOSURE_2026-09-23.md)

The containment/readability foundation is **CLOSED / MERGED / LIVE VERIFIED** through PR #294 -> main `6d0f9bd8972297e316bdf031603d160d901d8d04`, PR CI #1529 and merged-main CI #1531 exact Cloudflare smoke.

Closed containment scope:
- shared Activity Gallery;
- Bahasa Initial Sound;
- Bahasa + English Picture & Word;
- Science Feature/Function;
- Science Material Lab;
- bounded `LearningVisualToken`;
- blocking parent/frame/glyph assertions;
- 320/390/768/1280 dedicated runtime QA;
- responsive gallery matrix plus desktop 1280 catalog QA.

The semantic registry/provenance gate is now **CLOSED / MERGED / LIVE VERIFIED** through PR #297 -> main `ed7db8a6c5b8a3ee4acc9bcca260b4e0b5776773`, PR CI #1536 and merged-main CI #1537 exact Cloudflare smoke. It starts at 17 review-required / 0 approved / 0 production binary / 0 runtime activation. The active next sub-wave is **exact P0 semantic-art candidate production/review**, not more generic containment or registry work.

Rules for the next semantic-art pilot:

- do not bulk-replace all 280 inventoried `emoji:` fields;
- prioritize recognition-critical content only;
- start with known semantic mismatches and a small set of high-confidence reusable Mainlagi assets;
- use centralized semantic keys such as `object.apple`, `body.head`, `action.jump`, `feature.gills`;
- separate asset provenance approval from runtime mapping;
- fail closed when an asset is missing/unapproved;
- use `LearningSymbol` for controlled concept/symbol semantics where pictorial artwork is not appropriate;
- keep Latin/Arabic instructional glyphs as controlled typography/vector rendering;
- preserve the merged `LearningVisualToken` containment contract for all pictorial assets;
- require exact semantic recognition, provenance/redistribution review and human screenshot review before scale-up;
- keep canonical activity identity, prompt, choices/order, answer, evidence, mastery, progression, schema and stage ownership unchanged;
- do not mix World, character, narration or gameplay-pattern work into this wave.

Known P0/P1 semantic candidates include HEAD=`🙂`, JUMP=`🤸`, gills=`🫧`, beak=`👄`, cactus thick stem=`💚`, towel=`🧺`, generic raincoat and generic toy-block representations.

Existing `public/artwork/activity-previews/` contains some visually clear candidates (for example apple, cat, fish, umbrella, car, cup, house, bird and flower), but **file existence/name does not equal semantic or provenance approval**. The existing `color-object-ball.webp` was visually reviewed and rejected as a semantic ball candidate.

## Execution status — 20 September 2026

- Canonical UI / warning audit: **done**.
- Homepage/header/3-column subject directory: **merged**.
- Activity gallery + isolated QA unlock: **merged**.
- Shared completion: **merged / live verified** at `53a5f04`, CI #1129 exact Cloudflare smoke.
- Matching randomization/difficulty: **merged / live verified** at `61f8fb6`, CI #1134 exact Cloudflare smoke.
- Audio first-instruction latency: **merged / live verified** at `770d8b6`, PR CI #1144 + merged-main CI #1145 exact Cloudflare smoke.
- Parent/profile/settings responsive redesign: **merged / live verified** at `77bee68`, PR #251; exact-head CI #1159 + merged-main CI #1160 exact Cloudflare smoke.
- Subject-background wave: **merged / live verified** via PR #256 at `7502c708c998c87bb273639025fcb10ba6c81e12`, with 54 scene families / 108 responsive WebP assets / deterministic 900-activity mapping and merged-main CI #1183 exact production smoke. Project-owner desktop preview represents all nine subjects; docs closure PR #257 is live at `41df41c9dc0edc449af8260bbfe3887e0175bfb0` with CI #1186 exact production smoke.
- Activity character presentation foundation: **merged / live verified** via PR #259 at `b5acbfcde66ea1451f3e55a8d469d33ba4845af1`; merged-main CI #1190 / run `35589937017` passed including exact Cloudflare production smoke. Runtime remains fail closed to approved Gavi/Paca assets until Naya/Gian/Zia production files pass the next gate.

## Implementation order

Completed / live-verified:
1. Canonical component/route audit + console-warning audit.
2. Homepage/header/navigation + 3-column subject directory.
3. Activity gallery/catalog.
4. Shared completion system.
5. Matching randomization and difficulty rules.
6. Audio first-instruction latency.
7. Parent/profile/settings responsive redesign.
8. All-subject background integration.
9. Activity character presentation foundation.

Current character-production gate:
10. Character production specification + fail-closed asset/provenance infrastructure: **CLOSED / MERGED / LIVE VERIFIED** through PR #263.
11. **NOW:** create/review an isolated Naya candidate outside the public production directory; after acceptance repeat the same gated process for Gian, then Zia.
12. Confirm provenance/redistribution for each exact reviewed derivative, then integrate only approved transparent WebP binaries at the canonical production paths.
13. Keep runtime activation as a separate wave; then run responsive visual QA through the central allowlist/resolver.
14. Validate English -> Naya + Zia and Math -> Gian + Paca; preserve fail-closed fallback and leave other subject pairings unchanged.
15. Revisit the five-character homepage hero using approved production identities; keep hero composition separate from activity foreground assets.

Character production is currently **PAUSED by the project owner**. The character-specific sequence above remains future/reference planning only and must not be resumed implicitly.

Fixed English audio generation/listening is also **DEFERRED** by the project owner after the merged/live-verified narration gates. It remains a resumable future track, not the active execution item.

Current active independent track:
16. learning-illustration audit + containment/readability foundation: **CLOSED / LIVE VERIFIED**.
17. semantic illustration registry/provenance gate: **CLOSED / LIVE VERIFIED** via PR #297.
18. **NOW:** exact P0 semantic-art candidate production/review, then separate approved runtime mapping.
19. Expand semantic artwork only from measured recognition/readability evidence; never bulk-replace all emoji.
20. Expanded human visual/usability + physical-device acceptance and cleanup of superseded components.
19. Resume fixed English audio candidate generation/listening only when re-authorized.
20. Resume character production only when re-authorized.

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
