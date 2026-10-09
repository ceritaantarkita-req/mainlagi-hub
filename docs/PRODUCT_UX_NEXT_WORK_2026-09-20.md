# Mainlagi — Product UX Next Work

Date: **20 September 2026**  
Last synchronized: **9 October 2026**
Status: **ACTIVE ROADMAP / CANONICAL UI REBASE AUDIT COMPLETE / JOURNEY MAP PHASE C COMPLETE**
Current synchronized Journey Map runtime baseline: `main` = `b4473cc0582c096441e429b8ed94c20fc4bf1b8e`. JM-00 through JM-18 are complete at runtime/final-closure scope; JM-17 passed main CI #2374 / run `36974133135` including exact Cloudflare smoke. Belajar and Petualangan Uang Journey Map work is complete; no JM-19 is authorized by default. Semantic Art P0 and Shared Interaction remain fully closed.

This document is the short human/AI handoff for Mainlagi product-quality work. It records the user-accepted UX direction without changing curriculum, mastery, evidence or progression. The latest WS-05 Logic reuse wave is closed; any later mechanic work remains a separate audited track.

## 9 October 2026 — USER-APPROVED CHILD VISUAL-FIRST REDESIGN (WAVE 1 ACTIVE)

Canonical handoff: [`CHILD_VISUAL_FIRST_UX_REDESIGN_2026-10-09.md`](CHILD_VISUAL_FIRST_UX_REDESIGN_2026-10-09.md). Four mobile screenshots expose text-heavy Child Home, administrative Belajar Journey Map, over-detailed Stage sheet, and visually busy matching activity. The user approved the visual correction. **Wave 1 = Child Home + shared Belajar Journey Map + Stage Detail presentation only**, one short-lived branch and one PR. Matching/Garden are follow-up waves; do not silently start them. Preserve stage data, learning evidence/mastery, child/profile ownership, World, Motion, Shop and all previous Journey Map runtime closure. This visual approval supersedes the old "no visual redesign next" instruction for these child-facing surfaces only, not the P0-UIA architecture hygiene roadmap. No LIVE VERIFIED claim until exact merged-SHA production smoke and user visual QA.

## 2 October post-JM canonical UI re-baseline

The canonical UI ownership audit has been re-run after JM-18. Current authority: `P0_CANONICAL_UI_ARCHITECTURE_REBASE_AUDIT_2026-10-02.md`.

Important correction to the historical 20 September plan:

- all 9 subject routes now use the shared `BelajarJourneyMap`; the old `ActivityGallery` subject-chain wording is stale;
- `Batch14WorldHome` remains the live child home;
- `PlayroomShell` remains the live child navigation/header owner;
- child select + parent root/children use cloud aliases through `LearningPlatform`;
- parent detail/progress/report/certificates/settings intentionally remain split across verified owners;
- several legacy similarly named components remain in source but are not active route owners.

Already-completed P0 items must not be repeated: Belajar/Bermain nav naming, 3-column subject directory, mobile profile sheet, QA unlock-all, matching randomization, shared Completion/Share, narration entry latency, parent responsive redesign, public/auth/account convergence and Journey Map.

**Next implementation:** `P0-UIA-01` canonical owner retirement / legacy isolation. This is maintenance/architecture cleanup only—no visual redesign.

## 2 October Journey Map JM-17 responsive + JM-18 final closure

JM-17 Petualangan Uang responsive Journey Map is **CLOSED / MERGED / LIVE VERIFIED** at `main@b4473cc0582c096441e429b8ed94c20fc4bf1b8e`. Runtime PR #432 final head `ed09dc20bea0f29060616e417d48a54f5916469c` passed PR CI #2373; merged-main CI #2374 completed full success including exact Cloudflare smoke.

JM-17 preserves compact winding game nodes on 320/390/430 phone widths, uses a stacked responsive lane at 768 tablet width, exposes the resume/checkpoint CTA on mobile, keeps current Stage visible, preserves same-document portrait↔landscape reflow, and adds no World Browse All or progression rewrite.

JM-18 is the final docs/authority closure for Phase C. Canonical final closure: `JM18_CANONICAL_JOURNEY_MAP_FINAL_CLOSURE_2026-10-02.md`. Final Belajar truth is 9 subjects / 46 Stages / 900 activities through one shared engine; final Petualangan Uang truth is 2 Chapters / 8 Stages / 44 Scenes / 89 Segments through a separate World adapter.

**Journey Map Phase C has no next session.** Do not create JM-19 unless a new concrete product requirement or verified regression explicitly reopens this area.

## 2 October Journey Map JM-16 World desktop closure

JM-16 is **CLOSED / MERGED / LIVE VERIFIED**. Canonical closure: `JM16_MONEY_WORLD_DESKTOP_JOURNEY_MAP_FINAL_CLOSURE_2026-10-02.md`.

Runtime PR #430 final head `80cdd57c86943e1f888b8bfb122bf977cb3193d5` merged as `544475c534a05176f9c6d349b32c3b37819f7e1f`. The World map now consumes a pure World-specific Journey Map adapter and uses a clean illustrated desktop composition with progress summary, resume/checkpoint CTA, Chapter banners and alternating semantic Stage cards.

Exact **2 Chapters / 8 Stages / 44 Scenes / 89 Segments**, sequential unlock, ★★★ completion presentation, Segment checkpoint/resume, stable routes, Completion/Share, evidence/age boundaries and World runtime remain unchanged. World is not routed through the Belajar Journey Map engine and no Browse All was introduced.

PR CI #2367 and merged-main CI #2368 completed full success; exact Cloudflare production smoke passed for the merged runtime SHA.

**Next:** JM-17 Petualangan Uang mobile/responsive Journey Map. Reuse the JM-16 adapter and preserve runtime semantics while adding mobile/tablet presentation, resume CTA, current-Stage visibility, rotation/reflow safety and no-overflow coverage.

## 2 October Journey Map JM-15 World read-only adapter audit

JM-15 audit is **COMPLETE / READ-ONLY / NO RUNTIME CHANGE**. Canonical audit: `JM15_MONEY_WORLD_READONLY_JOURNEY_MAP_ADAPTER_AUDIT_2026-10-02.md`.

Petualangan Uang remains a separate first-class World semantic system with **2 Chapters / 8 Stages / 44 Scenes / 89 Segments** and sequential Stage progression. The audit explicitly rejects putting World into the Belajar activity/Browse-All progression engine.

The safe JM-16 architecture is canonical World structure + existing `MoneyWorldProgress` -> World-specific read-only presentation adapter -> desktop Journey Map presentation -> existing World Stage routes/runtime.

World ★★★ remains completion presentation rather than mastery; Segment checkpoint/resume, 6–8 pilot age policy, Completion/Share, supplemental-evidence behavior, stable routes, story/narration, database/schema and gameplay remain unchanged.

**Next:** JM-16 Petualangan Uang desktop redesign after this read-only audit passes its merge/production gate. JM-17 is the responsive/mobile package; JM-18 is final Journey Map closure.

## 2 October Journey Map JM-14 Belajar final closure

JM-00 through JM-14 Belajar are **CLOSED / MERGED / LIVE VERIFIED**. Canonical closure: `JM14_NINE_SUBJECT_BELAJAR_JOURNEY_MAP_FINAL_CLOSURE_2026-10-02.md`.

Runtime PR #426 final head `ecb9699b04fc4c133d8c27a6e0f37946384f82bc` completed JM-12 Mewarnai + JM-13 Menggambar and merged as `5c9638303d562f96556bb16a18c40a716b27e73f`. One shared `BelajarJourneyMap` now serves all 9 canonical subjects / 46 Stages / 900 activities.

Mewarnai keeps the existing Coloring runtime. Menggambar keeps the canonical Drawing Stage handoff to `DrawingStageScreen`. Creative workspace state, guides, Completion/Again, creative completion-only evidence, stable routes, progression/evidence semantics, database/schema, auth/profile, World and Shop boundaries remain unchanged.

PR CI #2351 and merged-main CI #2352 completed full success; exact Cloudflare production smoke passed for the merged runtime SHA.

**Next:** JM-15 Petualangan Uang read-only adapter audit. Do not redesign World during JM-15. JM-16 desktop and JM-17 responsive work remain blocked until the read-only adapter boundary is closed.

## 1 October Journey Map JM-06 final closure

JM-06 is **CLOSED / MERGED / LIVE VERIFIED**. Canonical closure: `JM06_SHARED_JOURNEY_MAP_BAHASA_FINAL_CLOSURE_2026-10-01.md`.

Runtime PR #420 final head `e910211c5924ee806ed43ab9d9ac7d5c26845951` merged as `aec5233a8397eeb4e8cc17cf521e350596ed4ad0`. The shared `BelajarJourneyMap` owner now serves English and Bahasa Indonesia with the same map/detail/Browse All/responsive interaction system while preserving exact subject content and progression semantics.

Local FAST-SAFE checks passed, including dedicated English + shared-engine browser QA, migrated Session 13 Bahasa text-only/no-answer-leak coverage, and the remaining mobile/browser regression tail. Merged-main CI #2340 / run `36833622638` completed full success including exact Cloudflare smoke.

**Next:** JM-07 through JM-11 standard-subject rollout for Matematika, Iqro, Huruf & Menulis, Logika and Sains. Reuse the existing engine; do not duplicate it or start creative JM-12/JM-13 yet.

## 1 October Journey Map JM-03 + JM-04 + JM-05 final closure

JM-03 + JM-04 + JM-05 are **CLOSED / MERGED / LIVE VERIFIED**. Canonical closure: `JM03_JM05_ENGLISH_JOURNEY_MAP_FINAL_CLOSURE_2026-10-01.md`.

Runtime PR #418 final head `1694df8d39dd2ba11a61c2779912388be5d5fdd5` merged as `bd67e22e9eaced707eb8ef6da5384f7300be2699`. The English subject now defaults to the production Journey Map with exact five canonical Stages / 100 activities, text-only Stage detail + Continue learning, Browse All, JM-02 header ownership, and responsive portrait/tablet/landscape behavior with touch/keyboard and rotation-state preservation.

Local FAST-SAFE checks and the complete blocking mobile/browser regression passed; merged-main CI #2336 / run `36807942571` completed full success including exact Cloudflare smoke.

**Next:** JM-06 shared Journey Map engine extraction + Bahasa Indonesia. Preserve English behavior exactly; do not duplicate the engine and do not start JM-07+ yet.

## 1 October Journey Map JM-02 final closure gate

JM-02 is **CLOSED / MERGED / LIVE VERIFIED**. Canonical closure: `JM02_IMMERSIVE_HEADER_FINAL_CLOSURE_2026-10-01.md`.

Runtime PR #415 passed PR CI #2328 / run `36743194635` and merged as `4fab9369a238805ddd53ff357d5b3587eb1ac05c`. The subsequent main run surfaced a newly published critical Next.js advisory; security PR #416 moved Next.js to 16.3.6, passed PR CI run `36755582780`, and merged as `84ab23778ab1013cdc0d9cddcbbb8237067236af`.

The active `PlayroomShell` is the single shared child-header owner. Kembali, compact logo, profile/menu, Belajar/Bermain/World navigation, touch/keyboard behavior, and immersive-route suppression are implemented. Shop remains disabled/fail-closed because no canonical child Shop route exists.

Main CI #2332 / run `36795318859` completed full success including exact Cloudflare smoke. JM-02 is closed/live verified. The next FAST-SAFE package is JM-03 + JM-04 + JM-05 for Bahasa Inggris.

## 30 September Journey Map Phase C override — JM-01 CLOSED / LIVE VERIFIED

JM-00 and JM-01 are complete.

JM-01 adds the shared Belajar Journey Map data/state foundation from canonical path/stage/readiness sources while leaving all current subject visuals intact.

Canonical checkpoint: `JM01_SHARED_JOURNEY_MAP_FOUNDATION_SAFE_CHECKPOINT_2026-09-30.md`.

Verified closure: PR #411 -> `main@756e3bd7bb24588041a3644f08018783e7b3b0f2`; PR CI #2319 / run `36716608349` required gates success; merged-main CI #2320 / run `36717855442` success.

**Next authorized Journey Map step: JM-02 — Immersive Mainlagi Header.** Implement Kembali, compact logo, profile/menu, and expandable `Belajar | Bermain | World | Shop` across desktop/touch/keyboard. Do not start the JM-03 Bahasa Inggris map visual in JM-02.

## 30 September Semantic Art P0 closure override

- Semantic Art P0 is **CLOSED / MERGED / LIVE VERIFIED**; it is not the active implementation item.
- All **17/17** P0 visual decisions are resolved.
- **14/17** source/license-clear assets are approved SVG production assets and run through the centralized controlled SVG resolver with **14/14** approved consumer/browser coverage.
- `vehicle.car`, `object.towel`, and `object.raincoat` remain intentional fail-closed production holds with **3/3** fallback coverage. Do not reinterpret them as unfinished implementation.
- The old candidate-generator / exact human-review / production-promotion steps are historical and already superseded.
- Canonical closure: `SEMANTIC_ART_P0_FINAL_CLOSURE_2026-09-30.md`.
- New semantic-art scope or held-key approval requires a fresh objective and exact provenance/redistribution evidence.
- Journey Map remains a separate workstream and is explicitly authorized. JM-00 and JM-01 are complete; JM-02 is next. Character production remains paused; fixed English audio remains deferred.

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
- [`LEARNING_VISUAL_CONTAINMENT_CLOSURE_2026-09-23.md`](LEARNING_VISUAL_CONTAINMENT_CLOSURE_2026-09-23.md)
- [`LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_PILOT_2026-09-23.md`](LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_PILOT_2026-09-23.md)
- [`LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_CLOSURE_2026-09-23.md`](LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_CLOSURE_2026-09-23.md)

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

The semantic registry/provenance gate is now **CLOSED / MERGED / LIVE VERIFIED** through PR #297 -> main `ed7db8a6c5b8a3ee4acc9bcca260b4e0b5776773`, PR CI #1536 and merged-main CI #1537 exact Cloudflare smoke. It starts at 17 review-required / 0 approved / 0 production binary / 0 runtime activation.

Historical note: PR #300/#301 created and refined the exact P0 candidates, but that review boundary has since been completed. Session 3 froze 17/17 visual decisions; PR #324 promoted the 14 source/license-clear assets; Sessions 10–13 moved those assets to SVG-aware production, controlled runtime, and responsive/browser verification. The three uncleared keys remain explicit fail-closed holds.

The P0 review/promotion/runtime sequence is therefore closed. Any new semantic-art expansion must begin from measured recognition/readability need plus provenance approval rather than extending the old candidate wave.

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

Current independent track status:
16. learning-illustration audit + containment/readability foundation: **CLOSED / LIVE VERIFIED**.
17. semantic illustration registry/provenance gate: **CLOSED / LIVE VERIFIED** via PR #297.
18. Semantic Art P0 candidate/review/production/runtime/responsive sequence: **CLOSED / LIVE VERIFIED** — 17/17 decisions, 14 approved SVGs, 3 intentional held fallbacks.
19. Semantic-art expansion: **NOT AUTHORIZED BY THIS CLOSURE**; require fresh measured recognition/readability + provenance evidence.
20. **NEXT ELIGIBLE:** expanded human visual/usability + physical-device acceptance and cleanup of genuinely superseded components.
21. Fixed English audio candidate generation/listening: **DEFERRED** until re-authorized.
22. Character production: **PAUSED** until re-authorized.

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
