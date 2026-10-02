# Changelog

## 2 October 2026 — P0-UIA-01 CANONICAL OWNER RETIREMENT CLOSED / MERGED / LIVE VERIFIED

- Runtime PR **#436** final head `8149522d9a3b2f73c0a61609f115f214806b9d35` merged as **`main@cd5c530d45a472ac2eb3f4efce740a2ae4654076`**.
- Retired route-dead duplicate child home/select/library/subject/stage/rewards owners, duplicate parent overview/children owners and old World presentation owners.
- Removed unreachable canonical-subject `ActivityGallery` + styles after JM-18 made all nine canonical subjects Journey Map-owned.
- Preserved active `ActivityScreen` fallback, Bermain `GamesScreen`, `WorldChildShell`, `WorldActivityScreen`, `WorldRewardsScreen`, cloud child/parent aliases, canonical Stage owners and world-v2 Petualangan Uang owners.
- Added permanent `test:learning:ui-owners` and wired it into the blocking learning gate.
- PR CI **#2385 / run `36991457873` FULL SUCCESS**.
- Merged-main CI **#2386 / run `36992697294` FULL SUCCESS**, including exact **Production smoke (Cloudflare) SUCCESS**.
- Closed superseded stale PR **#395** after confirming SI-08 is already closed and superseded by later Shared Interaction authority.
- Canonical closure: `P0_UIA01_CANONICAL_OWNER_RETIREMENT_FINAL_CLOSURE_2026-10-02.md`.
- **Next: read-only audit of remaining open P0/product workstreams, beginning with Shop #359 and dependency-bound child-surface #360.**


## 2 October 2026 — P0-UIA-01 PRE-EXECUTION SAFE CHECKPOINT

- Audit PR **#434** merged as `main@b07c293a97b6cc5c71421d296ac350d7dd9cd23b`.
- PR CI **#2377 / run `36980535324` FULL SUCCESS**.
- Merged-main CI **#2378 / run `36981780636` FULL SUCCESS**.
- Exact merged-main **Production smoke (Cloudflare) SUCCESS**.
- Added `P0_UIA01_PREEXECUTION_SAFE_CHECKPOINT_2026-10-02.md` as the canonical resume point before runtime cleanup.
- Runtime UIA-01 cleanup has **not** started at this checkpoint.
- Next package remains **P0-UIA-01 — canonical owner retirement / legacy isolation** with no visual redesign or product-semantic changes.


## 2 October 2026 — P0 CANONICAL UI ARCHITECTURE RE-BASELINE AUDIT

- Re-traced canonical production ownership against final Journey Map docs baseline `main@f5657c1d36493b2803a8e457ccf7e9f2e0b2ee1d`.
- Confirmed `Batch14WorldHome` as live child home and `PlayroomShell` as shared non-immersive child shell/navigation owner.
- Confirmed child-select and parent root/children cloud aliases through `LearningPlatform`.
- Corrected historical WS-13 subject ownership: all 9 canonical subjects now route through `BelajarJourneyMap`; `ActivityGallery` is not reachable through a current canonical subject ID.
- Classified route-dead duplicate home/select/overview and old World presentation exports separately from still-active fallback/Bermain/shell/rewards owners.
- Re-baselined the 20 September P0 backlog so already-closed nav, subject-grid, QA unlock, matching, Completion/Share, audio latency, parent responsive, public/auth/account and Journey Map work is not repeated.
- Closed superseded stale PR **#424** and PR **#429** with explicit supersession notes.
- Preserved Shop PR #359 and dependency-bound child-surface PR #360 as separate workstreams.
- Canonical audit: `P0_CANONICAL_UI_ARCHITECTURE_REBASE_AUDIT_2026-10-02.md`.
- **Next authorized package: P0-UIA-01 — canonical owner retirement / legacy isolation.**


## 2 October 2026 — Journey Map JM-17 RESPONSIVE + JM-18 FINAL CLOSURE

- JM-17 runtime PR **#432** final head `ed09dc20bea0f29060616e417d48a54f5916469c` merged as **`main@b4473cc0582c096441e429b8ed94c20fc4bf1b8e`**.
- Completed Petualangan Uang Journey Map phone/tablet/rotation presentation while reusing the JM-16 World-specific adapter.
- Phone 320/390/430 keeps compact alternating winding game nodes; 768 tablet uses a centered stacked lane.
- Mobile resume/checkpoint CTA, current-Stage visibility, Chapter containment, >=44px touch targets, stable Stage routes and no-horizontal-overflow behavior are permanently regression-tested.
- Portrait → landscape → portrait reflow preserves the same document, progress, current Stage and checkpoint intent.
- Preserved exact **2 Chapters / 8 Stages / 44 Scenes / 89 Segments**, sequential World progression, ★★★ completion presentation, stable routes and no World Browse All.
- Added blocking `test:ui:jm17-world-responsive` and responsive source-contract assertions.
- PR CI **#2373 / run `36972969667` FULL SUCCESS**.
- Merged-main CI **#2374 / run `36974133135` FULL SUCCESS**, including exact **Production smoke (Cloudflare) SUCCESS**.
- Added `JM17_MONEY_WORLD_RESPONSIVE_JOURNEY_MAP_FINAL_CLOSURE_2026-10-02.md`.
- Added `JM18_CANONICAL_JOURNEY_MAP_FINAL_CLOSURE_2026-10-02.md`.
- **Phase C — Canonical Journey Map System is complete through JM-00–JM-18. No JM-19 is authorized by default.**


## 2 October 2026 — Journey Map JM-16 WORLD DESKTOP CLOSED / MERGED / LIVE VERIFIED

- Runtime PR **#430** final head `80cdd57c86943e1f888b8bfb122bf977cb3193d5` merged as **`main@544475c534a05176f9c6d349b32c3b37819f7e1f`**.
- Added pure `buildMoneyWorldJourneyMap()` projection from canonical World structure + existing `MoneyWorldProgress`.
- Petualangan Uang desktop now has a structured illustrated Journey Map with progress summary, resume/checkpoint CTA, Chapter progress banners, alternating Stage cards and explicit completed/current/open/locked states.
- Preserved exact **2 Chapters / 8 Stages / 44 Scenes / 89 Segments**, sequential World unlock, ★★★ completion presentation, Segment checkpoint/resume and stable World Stage routes.
- World remains independent of `BelajarJourneyMap`, Belajar readiness/mastery/evidence and Browse All.
- Added permanent static adapter regressions plus dedicated `test:ui:jm16-world-desktop` browser QA, wired into blocking Mobile route QA.
- Validation surfaced and repaired two stale test implementation assumptions plus a dedicated-test hydration race; final runtime semantics were not weakened.
- PR CI **#2367 / run `36962973475` FULL SUCCESS**.
- Merged-main CI **#2368 / run `36968729118` FULL SUCCESS**, including exact **Production smoke (Cloudflare) SUCCESS**.
- Canonical closure: `JM16_MONEY_WORLD_DESKTOP_JOURNEY_MAP_FINAL_CLOSURE_2026-10-02.md`.
- **JM-17 Petualangan Uang mobile/responsive Journey Map is next.**


## 2 October 2026 — Journey Map JM-15 WORLD READ-ONLY ADAPTER AUDIT COMPLETE

- Audited Petualangan Uang against live-verified JM-14 closure baseline **`main@cf0007d48734b3dcd3f9ad60bf340ab043ce02a6`**.
- Locked canonical World topology at **2 Chapters / 8 Stages / 44 Scenes / 89 Segments**, plus 16 practice activity placements with two per Stage.
- Locked stable World catalog/map/Stage routes and the existing `MoneyWorldMapScreen` / `MoneyWorldStageScreen` ownership.
- Confirmed progression remains ordered-prefix/sequential through `MoneyWorldProgress`; current Journey position is the first incomplete Stage and Segment resume remains `currentStageId + currentSegmentIndex`.
- Confirmed World ★★★ is completion presentation, not Belajar mastery/readiness.
- Rejected direct World integration into `BelajarJourneyMap`; JM-16 must use a World-specific read-only presentation adapter and must not invent World Browse All.
- Preserved the 6–8 pilot age policy, Completion/Share, supplemental-evidence behavior, story/narration, database/schema, Belajar, Bermain and Shop boundaries.
- Canonical audit: `JM15_MONEY_WORLD_READONLY_JOURNEY_MAP_ADAPTER_AUDIT_2026-10-02.md`.
- **JM-16 Petualangan Uang desktop redesign is next after the JM-15 audit closure merge/production gate.**


## 2 October 2026 — Journey Map JM-14 BELAJAR CLOSED / MERGED / LIVE VERIFIED

- JM-12/JM-13 runtime PR **#426** final head `ecb9699b04fc4c133d8c27a6e0f37946384f82bc` merged as **`main@5c9638303d562f96556bb16a18c40a716b27e73f`**.
- The single shared `BelajarJourneyMap` now serves **all 9 canonical subjects / 46 Stages / 900 activities**, exact 100 activities per subject.
- Mewarnai moved from the legacy subject gallery to the shared Journey Map while preserving its existing Coloring creative runtime.
- Menggambar moved to the shared Journey Map while preserving the canonical Stage-route handoff to `DrawingStageScreen`; direct activity routes and the creative workspace remain intact.
- Shared Journey Map browser QA now covers all nine subjects, exact Stage order, 100-activity Browse All membership, text-only Stage detail, JM-02 header ownership and Drawing Stage handoff.
- Mobile route QA now covers Mewarnai and Menggambar Journey Map subject routes while retaining Drawing Stage/runtime coverage.
- PR CI **#2351 / run `36945436676` FULL SUCCESS**.
- Merged-main CI **#2352 / run `36946329650` FULL SUCCESS**, including exact **Production smoke (Cloudflare) SUCCESS**.
- Canonical closure: `JM14_NINE_SUBJECT_BELAJAR_JOURNEY_MAP_FINAL_CLOSURE_2026-10-02.md`.
- **JM-15 Petualangan Uang read-only adapter audit is next.** JM-16/JM-17 remain blocked until JM-15 is closed.


## 1 October 2026 — Journey Map JM-06 CLOSED / MERGED / LIVE VERIFIED

- JM-06 runtime PR **#420** final head `e910211c5924ee806ed43ab9d9ac7d5c26845951` squash-merged as **`main@aec5233a8397eeb4e8cc17cf521e350596ed4ad0`**.
- Generalized `EnglishJourneyMap` into the single shared `BelajarJourneyMap` owner; Bahasa Indonesia is now the second consumer without duplicating the engine.
- English remains exact **5 Stages / 100 activities**; Bahasa Indonesia is exact **6 Stages / 100 activities**. Stable routes, readiness/evidence/mastery, JM-02 header, Completion/Share, World and creative boundaries are unchanged.
- Added dedicated shared-engine browser QA and migrated Session 13 Bahasa gallery regression to the canonical text-only Journey Map/no-answer-leak contract.
- Local FAST-SAFE gates passed; browser warning inventory remained **0**.
- Merged-main CI **#2340 / run `36833622638` FULL SUCCESS** passed Mobile route QA, Windows compatibility, Secret history scan, Production dependency audit, Production build, Ubuntu quality and exact **Production smoke (Cloudflare) SUCCESS**.
- Canonical closure: `JM06_SHARED_JOURNEY_MAP_BAHASA_FINAL_CLOSURE_2026-10-01.md`.
- **JM-07 through JM-11 are next:** Matematika, Iqro, Huruf & Menulis, Logika and Sains through the existing shared engine.

## 1 October 2026 — Journey Map JM-03 + JM-04 + JM-05 CLOSED / MERGED / LIVE VERIFIED

- Bahasa Inggris reference Journey Map runtime PR **#418** final head `1694df8d39dd2ba11a61c2779912388be5d5fdd5` squash-merged as **`main@bd67e22e9eaced707eb8ef6da5384f7300be2699`**.
- JM-03 closes the clean full-page desktop Journey Map default; JM-04 closes contextual text-only Stage detail + Continue learning; JM-05 closes portrait/tablet/landscape responsiveness, mobile bottom sheet, touch/keyboard behavior and rotation-state preservation.
- Canonical English scope remains exact **5 Stages / 100 activities**. Browse All, stable direct routes, JM-02 header ownership, readiness/evidence/mastery, Completion/Share, World and creative-workspace boundaries are preserved.
- Local FAST-SAFE gates passed typecheck, lint with 0 errors, Journey Map tests, production build, dedicated English Journey Map browser QA and full `test:ui:mobile-routes` in **873.92s** with browser warning inventory **0**.
- Merged-main CI **#2336 / run `36807942571` FULL SUCCESS** passed Mobile route QA, Windows compatibility, Secret history scan, Production dependency audit, Production build, Ubuntu quality and exact **Production smoke (Cloudflare) SUCCESS**.
- Canonical closure: `JM03_JM05_ENGLISH_JOURNEY_MAP_FINAL_CLOSURE_2026-10-01.md`.
- **JM-06 — shared Journey Map engine extraction + Bahasa Indonesia is next.** Preserve English behavior exactly; do not duplicate the engine or pull JM-07+ forward.

## 1 October 2026 — Journey Map JM-02 CLOSED / MERGED / LIVE VERIFIED

- JM-02 immersive Mainlagi header runtime PR **#415** passed PR CI **#2328 / run `36743194635`** and squash-merged as **`main@4fab9369a238805ddd53ff357d5b3587eb1ac05c`**.
- The merged header provides route-aware Kembali, compact Mainlagi logo, profile/menu, Belajar/Bermain/World product navigation, touch/keyboard disclosure behavior, and immersive-route suppression while keeping Shop disabled/fail-closed because no canonical child Shop route exists.
- Main CI #2329 then surfaced newly published critical Next.js advisory **GHSA-vcvr-r3jv-pc5j / CVE-2026-94545**. Security PR **#416** upgraded Next.js to 16.3.6, refreshed matching lock entries, aligned stale local Playroom QA contracts, passed PR CI run `36755582780`, and merged as **`main@84ab23778ab1013cdc0d9cddcbbb8237067236af`**.
- Local FAST-SAFE verification passed production audit with **0 vulnerabilities**, Journey Map tests, typecheck, lint with 0 errors, production build, full Playroom QA, and the complete blocking mobile/browser regression.
- Main CI **#2332 / run `36795318859` completed FULL SUCCESS**, including exact Cloudflare smoke proving production serves `84ab23778ab1013cdc0d9cddcbbb8237067236af` with the canonical Supabase target.
- Canonical closure: `JM02_IMMERSIVE_HEADER_FINAL_CLOSURE_2026-10-01.md`.
- JM-02 is closed/live verified. The next authorized FAST-SAFE package is **JM-03 + JM-04 + JM-05 — Bahasa Inggris complete reference implementation**.

## 30 September 2026 — Journey Map JM-02 pre-execution safe checkpoint

- Added `JM02_IMMERSIVE_HEADER_PREEXECUTION_SAFE_CHECKPOINT_2026-09-30.md`.
- Froze the canonical child-shell owner as `child layout -> WorldChildShell -> PlayroomShell` before header changes.
- Recorded current header/navigation/profile behavior and immersive suppression boundaries.
- JM-02 is authorized for Kembali + compact logo + profile/menu + expandable Belajar/Bermain/World/Shop across desktop/touch/keyboard.
- Shop is explicitly fail-closed because no canonical child Shop route exists and adult/public affiliate commerce must not be fabricated into child learning.
- No runtime code or visual behavior changed in this checkpoint. JM-03+ remains not started.
- Checkpoint PR **#413** head `b830a1f4d47dc896a5a79a22fa94da01d78ca8d6` passed PR CI **#2323 / run `36727660551`** and squash-merged to **`main@bd93ffaa92521c55f2414d13f44a62fcf022d865`**.
- Merged-main CI **#2324 / run `36729548045` FULL SUCCESS** passed Production build, Ubuntu quality, Windows compatibility, Secret history scan, Mobile route QA, Production dependency audit, and exact Cloudflare production smoke.

## 30 September 2026 — Journey Map JM-01 CLOSED / MERGED / LIVE VERIFIED

- Added the shared read-only Belajar Journey Map data/state foundation in `src/lib/learning/journeyMap.ts`.
- The adapter derives Stage order from canonical `CONTENT_PATHS.stageIds`, Stage metadata/membership from canonical `STAGES`, and readiness from `getSubjectStageReadiness()`; no second curriculum/progression source was introduced.
- Presentation state is now `completed | current | open | locked` while canonical `locked | in_progress | evidence_needed | ready` remains preserved.
- Child-facing English presentation is explicitly **Bahasa Inggris / Inggris** while the stable internal ID stays `english`.
- Blocking regression `test:learning:journey-map` covers all **9 subjects / 46 Stages / 100 activities per subject**, exact order/routes, evidence-gated Math behavior, and practice-only Coloring advancement; it is wired into aggregate `test:learning`.
- Runtime PR **#411** final head `9ae8ad4e5debcc4fb13738919db94b80d23c4b97` passed PR CI **#2319 / run `36716608349`** and squash-merged to **`main@756e3bd7bb24588041a3644f08018783e7b3b0f2`**.
- Merged-main CI **#2320 / run `36717855442`** concluded **SUCCESS**; the main workflow requires exact Cloudflare production smoke downstream of normal blocking gates.
- No Journey Map visual, Browse All behavior, curriculum, Stage membership, mastery/evidence/progression, World, creative workspace, database/schema, Completion, or Share behavior changed.
- Canonical checkpoint: `JM01_SHARED_JOURNEY_MAP_FOUNDATION_SAFE_CHECKPOINT_2026-09-30.md`.
- **JM-02 — Immersive Mainlagi Header is next.**

## 30 September 2026 — Journey Map JM-00 CLOSED / MERGED / LIVE VERIFIED

- Phase C — Canonical Journey Map System is now explicitly authorized by the project owner.
- JM-00 audited the exact canonical Belajar map inputs at `main@f6b9f97fc5c6917188d228d0d724421c346579e5`: **9 subjects / 900 activities / 46 stages**, stage order/membership, subject/stage/activity routes, readiness states, and Browse All.
- Petualangan Uang was audited as a separate World source: **2 chapters / 8 stages / 89 segments**, stable World routes, ordered-prefix completion progression, and sequential stage unlock.
- No runtime, visual, curriculum, stage membership, mastery/evidence/progression, database/schema, creative workspace, World story, or gameplay behavior changed.
- Canonical checkpoint: `JM00_CANONICAL_JOURNEY_MAP_READONLY_AUDIT_2026-09-30.md`.
- PR **#408** head `e825432a769e606a64755ae7ad5eb1574012efe6` passed required PR CI **#2314 / run `36712169029`** and merged to **`main@6c32ab6d4e8de1fc7ba1634077f8e466b7b509fa`**.
- Merged-main CI **#2315 / run `36713525016` FULL SUCCESS** passed Production build, Ubuntu quality, Windows compatibility, Secret history scan, Mobile route QA, Production dependency audit, and exact **Production smoke (Cloudflare) SUCCESS**.
- **JM-01 — Shared map data/state foundation is the next authorized Journey Map step.** JM-02+ visual work remains out of scope until JM-01 is complete.

## 30 September 2026 — Semantic Art P0 canonical closure reconciliation

- Reconciled canonical roadmap/handoff truth with the already-completed Semantic Art P0 implementation: **17/17 visual decisions resolved, 14/17 source/license-clear semantic assets approved as SVG production assets, 14/14 approved consumer/browser coverage, 3/3 held-key fallback coverage**.
- The exact held set remains `vehicle.car`, `object.towel`, and `object.raincoat`; these are intentional fail-closed rights/provenance holds, not unfinished P0 implementation.
- Existing verified lineage is unchanged: production integration PR #324 -> SVG production PR #346 -> controlled runtime PR #348 -> responsive closure PR #350 -> Session 16 final SVG-program verification.
- No artwork bytes, semantic runtime, learning semantics, mastery/evidence/progression, World, character, narration, Journey Map, or gameplay code changed in this reconciliation.
- Canonical checkpoint: `SEMANTIC_ART_P0_FINAL_CLOSURE_2026-09-30.md`. New semantic-art expansion requires a fresh objective; expanded human visual/usability + physical-device acceptance is the next already-eligible product-quality track.

## 30 September 2026 — Shared Interaction SI-11 CLOSED / MERGED / LIVE VERIFIED / PROGRAM COMPLETE

- Runtime PR **#405** final head `ee20dbc9e3c360fcf718b0ccdfc073c8b31344ec` passed final PR CI **#2308 / run `36684442616` FULL SUCCESS** and squash-merged to **`main@a4619c31f9ed928c420dab6704b93ad22d4d28c3`**.
- Merged-main CI **#2309 / run `36685743612` FULL SUCCESS** passed Production build, Ubuntu quality, Windows compatibility, Secret history scan, Mobile route QA (Chromium), Production dependency audit, and exact **Production smoke (Cloudflare) SUCCESS**.
- SI-11 preflight found one real missed production-reachable Belajar owner: `SubitizingGlanceActivity`, covering exactly three audited Math activities. It now uses canonical `ActivityCompletion` while preserving runtime measurement, `completeActivity`, assessed evidence, and local Again reset semantics.
- The final static closure gate locks **42/42 specialized Belajar renderers**, finite fallback Belajar paths, **9/9 finite Main Gerak terminals + AirBoard workspace completion**, canonical World stage/finale completion, one canonical Share owner, no World character-name label, representative `safe-contain-v1` geometry, rotation state preservation, and duplicate-attempt/evidence protections.
- The obsolete gameplay-header `ShareButton` implementation and its `GameShell` compatibility list are removed. `CanonicalShareDialog` is now the single achievement Share implementation owner across Belajar, World, and Bermain.
- Shared Interaction **SI-00 through SI-11 is complete**. There is no next SI session. Journey Map redesign was not authorized or performed by SI-11 and remains a separate workstream.
- Canonical final Shared Interaction checkpoint: `SI11_SHARED_INTERACTION_INTEGRATED_CLOSURE_SAFE_CHECKPOINT_2026-09-30.md`.

## 30 September 2026 — Shared Interaction SI-10 CLOSED / MERGED / LIVE VERIFIED

- Runtime PR **#403** final head `e290fa08d418fee4761574b836a6ae19c888f56e` passed PR CI **#2302 / run `36675680322` FULL SUCCESS** and squash-merged to **`main@62a4676a50dc4f7a2b068118479bc0758bd40881`**.
- Merged-main CI **#2303 / run `36676747658` FULL SUCCESS** passed Production build, Ubuntu quality, Windows compatibility, Secret history scan, Mobile route QA (Chromium), Production dependency audit, and exact **Production smoke (Cloudflare) SUCCESS**.
- World Stage completion now consumes `CanonicalCompletion(context="world", surface="inline")`; World achievement sharing consumes `CanonicalShareDialog(context="world")`. The bespoke World clipboard/native/provider/share-gate implementation is retired.
- Back / Again / Next / Share, three stars, eight-stage order, chapter milestones, final Festival semantics, World progress/evidence, narration, Gavi/Paca celebration and the public-safe `/worlds/money-festival` target are preserved.
- SI-02 already owned World `SpeechCard` visible-name-label removal and `safe-contain-v1` character geometry; SI-10 preserves those live guarantees rather than reopening character work.
- Dedicated SI-10 static + production-browser regressions are blocking through `test:learning` and `test:ui:mobile-routes`. Existing World focus/selector regressions were advanced from the retired fixed heading ID to the canonical `aria-labelledby` / completion owner contract.
- Canonical resume checkpoint is now `SI10_WORLD_ADAPTER_SAFE_CHECKPOINT_2026-09-30.md`. **SI-11 integrated closure is PAUSED / not authorized.** Journey Map redesign remains out of scope.


- Shared Interaction **SI-09 Bermain games 7–10** is CLOSED / MERGED / LIVE VERIFIED. Runtime PR #399 final head `5d7460543b608763b6ab4aa2316a6a0f13d92ee3` passed final PR CI #2290 / run `36662285110`; it squash-merged to runtime main `9109f57978ea7e834772859be01227e720be8de0`, and merged-main CI #2291 / run `36663304501` passed all gates including exact Cloudflare smoke.
- SI-09 canonicalizes exactly `iqro-motion`, `airboard-presenter`, `dodge-motion`, and `run-to-target`. The three finite games preserve existing timer/score/progress/leaderboard/recalibration semantics; AirBoard receives an explicit `Selesai` terminal action and workspace-mode canonical Completion with no fake score, leaderboard write, or invented progress evidence.
- Back / Again / Next / Share are canonical across the final batch, same-document replay remains owned by the existing `GameShell.replay()` / `sessionKey` seam, and the legacy gameplay-header Share is retired across all ten canonical Bermain games.
- Dedicated SI-09 static + production-browser regressions are wired into blocking interaction/mobile gates. AirBoard QA proves workspace completion, canonical Next ordering, calibration retention, and same-document Again reset without score-result rendering.
- Canonical Shared Interaction resume checkpoint is now `SI09_BERMAIN_GAMES_7_10_SAFE_CHECKPOINT_2026-09-30.md`. SI-06A through SI-06G and SI-07 through SI-09 are completed history; **SI-10 World adapter is PAUSED / not authorized**.
- During SI-09 documentation closure, a newly published `brace-expansion` high-severity advisory set tripped the production dependency gate. Isolated security PR #401 refreshed only lockfile entries to patched `2.1.7` / `5.0.12`, merged to `main@50a56748f11168da76ae22f3977c3a8c1a333da2`, and merged-main CI #2295 / run `36666750509` passed all gates including exact Cloudflare smoke. SI-09 product-runtime behavior was unchanged.

- Shared Interaction **SI-08 Bermain games 4–6** is CLOSED / MERGED / LIVE VERIFIED. Runtime PR #394 final head `3a459ddfe9629ffdf7259c8df04106c4af72a3e5` passed final PR CI #2281 / run `36616112219`; it squash-merged to runtime main `079481868b38f847193e4cda381609d88d0ce0b3`, and merged-main CI #2282 / run `36617407662` passed all gates including exact Cloudflare smoke.
- SI-08 migrates exactly `shape-quest`, `pattern-race`, and `math-warung` to canonical Completion + canonical parent-gated Share. Existing timer/score/progress, leaderboard capture, recalibration and local same-document Again replay remain intact; the legacy gameplay-header Share is retired for games 4–6.
- SI-08 adds dedicated static + browser regressions to blocking interaction/mobile gates and updates the SI-07 shared `DigitRace` regression so both math and pattern variants remain canonical without reopening SI-07.
- Historical SI-08 resume checkpoint remains `SI08_BERMAIN_GAMES_4_6_SAFE_CHECKPOINT_2026-09-30.md`; its SI-09 hard stop was superseded by explicit authorization and SI-09 is now merged/live verified. Current resume authority is `SI09_BERMAIN_GAMES_7_10_SAFE_CHECKPOINT_2026-09-30.md`, with SI-10 World adapter paused pending explicit authorization.

- Shared Interaction **SI-07 Bermain games 1–3** is CLOSED / MERGED / LIVE VERIFIED. Runtime PR #392 final head `a33a365cc31f79a9b406b5c5b7a20d5a29935625` passed final PR CI #2276 / run `36586675110`, squash-merged to runtime main `b76c0fd5a116c060b06e3c1bcfc5f70992168e79`, and merged-main CI #2277 / run `36588104198` passed all gates including exact Cloudflare smoke.
- SI-07 migrates exactly `math-choice`, `math-motion-battle`, and `number-trace` to canonical Completion + canonical parent-gated Share. Back returns to the public game detail, Again reuses the existing session replay without document reload, Next follows canonical `GAME_SLUGS` order, and score/leaderboard/recalibration remain intact. The legacy gameplay-header Share is retired only for the three migrated games.
- SI-07 CI caught both a stale SI-02 selector and a real Paca bottom-crop in the new canonical completion cast. The regression now follows the canonical owner and retains full no-crop portrait/landscape assertions; the completion slot reserves the ensemble stagger safely rather than weakening QA.
- Historical SI-07 checkpoint remains `SI07_BERMAIN_GAMES_1_3_SAFE_CHECKPOINT_2026-09-29.md`; its SI-08 and later SI-09 hard stops were superseded by explicit authorization. Current resume authority is the SI-09 checkpoint above, with SI-10 World adapter paused.

- Shared Interaction **SI-06G Creative** is CLOSED / MERGED / LIVE VERIFIED. Runtime PR #389 final head `4cef902b5f6fd149492b94b1487e88befa6eeedb` passed CI #2268 / run `36512437374`, squash-merged to runtime main `5c9aa4b55c908745c8d7cf5aceef941c327a7404`, and merged-main CI #2269 / run `36513392973` passed all gates including exact Cloudflare smoke.
- SI-06G production Drawing/Coloring now use canonical Completion + Share; local Again resumes the same mounted creative workspace, preserving Drawing strokes and Coloring fill/history. Persisted historical completion does not auto-cover a reopened workspace. Representative Coloring QA uses legitimate progression through `color-gavi` + `color-paca` before `color-exploration-basics`.
- SI-06G closure docs PR #390 merged to verified post-SI-06G closure baseline `899b9a00abd1ea1ab9598b03e29f49d9c778cbe8`; closure-main CI #2271 / run `36515742967` passed Production build, Ubuntu, Windows, Secret history scan, Mobile Chromium, dependency audit, and exact Cloudflare production smoke.
- At the historical SI-06G closure checkpoint, `SI06G_CREATIVE_SAFE_CHECKPOINT_2026-09-29.md` was the resume authority and SI-07 was still paused. That boundary was later superseded by explicit SI-07 and SI-08 authorization; the current resume authority is the SI-08 checkpoint above.
- Post-SI-06G documentation synchronization only updates handoff/closure truth; it does not change runtime, gameplay, mastery/evidence/progression semantics, schema, World, Journey Map, Shop, or Bermain.

- Semantic P0 production integration PR #324 is now merged/live verified: main `1e27869dfc71186e83ed8bb0a4dff2ca44dddfc9`, PR CI #1609 full success, merged-main CI #1610 / run `36036726413` full success including exact Cloudflare release smoke. Canonical state is 14 approvals / 14 binaries / 3 held / runtime activation 0; next boundary is discussion-first runtime design.
- Semantic P0 production-integration wave: 14/17 clear assets promoted as exact deterministic 512x512 alpha WebP binaries with SHA-bound provenance and approved child-readability records; car/towel/raincoat remain held; runtime semantic activation stays 0.
- Added production attribution for Darius Dan CC BY bird/cat/fish + beak/gills derivatives and Yu-Chun Chou CC BY house; Public Domain/CC0 assets remain source-bound in the canonical provenance registry.
- Hardened the historical P0 production-readiness preflight so clear-scope records may be either pre-approval or approved while the three held keys remain strict fail-closed.
- World evidence private-registry RLS read-only audit: table owner `postgres`, RLS disabled/no policies; `record_world_skill_evidence(...)` owner `postgres` + SECURITY DEFINER; browser roles have no direct table privileges/RPC execute; service_role has RPC execute only. No DB change applied; RLS enablement remains explicit operator decision.
- World evidence PR #312 merged/live verified ke `main` `ca7f0e77b296682935f9ecbe311cc1028168986f`; merged-main CI #1587 / run `35899987986` full success termasuk exact-SHA Cloudflare smoke. Production checkpoint `checkpoint/world-evidence-production-green-20260924`; DB tetap 0 supplemental evidence rows; first eligible live write pending; private-registry RLS hardening dicatat sebagai explicit operator decision.
- Historical World Draft PRs #282/#295/#305/#307/#308/#309/#310 ditutup sebagai superseded setelah ancestry diverifikasi; seluruh head sudah terkandung di PR #312, yang pada saat itu masih Draft/unmerged sebagai satu-satunya release path.
- Historical World evidence release-candidate checkpoint integrated the then-current `main` semantic/narration/illustration work with the full Petualangan Uang + evidence stack via two-parent merge `e4999265033b0263e906c2fe287fc08d09bde0bc`; PR #312 was Draft and CI #1584 was full success at that time. Supabase was live through 0051 while main/Cloudflare deployment and controlled Stage 8 evidence verification were still pending.
- Semantic P0 human-review gate PR #304 merged ke main `f0b48cbdbe162fd19e0665f4b29945f6aaa16a5f`; PR CI #1552 / run `35816166334` full success. Gate mengikat review ke exact 9 file + manifest/file SHA, mendukung per-item accept/reject, dan tetap 0 human decision / 0 production approval / 0 runtime activation.
- PR #302 ditutup sebagai superseded agar docs prereview lama tidak mengembalikan wording next-gate yang sudah usang.
- Semantic P0 source refinement PR #301 merged/live verified ke main `9f6270c79bb92f7cb6ce1d29a2165df54801debf`; merged-main CI #1548 / run `35807137419` full success termasuk exact Cloudflare production smoke.
- Semantic P0 human-review evidence gate disiapkan pada branch `agent/semantic-p0-human-review-gate-20260923`: exact 9 files + manifest/file SHA binding, per-item accept/reject, tamper/stale rejection, dan zero registry/public/runtime mutation. Human decision belum direkam dan tidak boleh difabrikasi.
- Safe checkpoint baru: `LEARNING_SEMANTIC_SAFE_CHECKPOINT_2026-09-23.md`.
- Semantic P0 candidate generator PR #300 merged/live verified ke main `89adf887e270c2451ae81af8cd6a9bae0b798fbd`; merged-main CI #1546 / run `35805378889` full success termasuk exact Cloudflare production smoke.
- AI visual pre-review 96/64/48/32px menemukan tujuh candidate cukup jelas untuk lanjut exact human review; source `action.jump` dan `feature.cactus-thick-stem` diperjelas sebelum human review. Tidak ada production approval/runtime activation.

## Unreleased — 23 September 2026

- Semantic illustration provenance gate PR #297 sudah merged/live verified ke main `ed7db8a6c5b8a3ee4acc9bcca260b4e0b5776773`; PR CI #1536 / run `35769098899` dan merged-main CI #1537 / run `35770021133` full success termasuk exact Cloudflare smoke.
- Menambahkan registry semantic illustration 17-slot + dedicated `public/artwork/learning-illustrations/` fail-closed validator: 17 review-required / 0 approved / 0 production binary / 0 runtime activation.
- Preliminary reuse review: apple/cat/fish/umbrella/car/cup/house/bird visually-suitable tetapi provenance-pending; `color-object-ball.webp` eksplisit rejected sebagai semantic ball.
- Next aktif bukan infrastructure lagi: exact P0 art untuk HEAD/JUMP/gills/beak/cactus stem/towel/raincoat/toy-block, lalu provenance + child-readability approval + SHA, dan runtime mapping terpisah.
- Learning-illustration audit PR #287 sudah merged/live verified ke main `bea1380e...`, main CI #1453 exact Cloudflare smoke; inventory 43 source files / 280 canonical batch-wave `emoji:` fields tetap dianggap inventory signal, bukan 280 defect.
- Learning visual containment PR #294 sudah merged/live verified ke main `6d0f9bd8972297e316bdf031603d160d901d8d04`; PR CI #1529 / run `35763091032` dan merged-main CI #1531 / run `35764397545` full success termasuk exact Cloudflare production smoke.
- Menambahkan shared `LearningVisualToken` + blocking bounding-box QA untuk Activity Gallery, Bahasa Initial Sound, Bahasa/English Picture & Word, Science Feature/Function, dan Science Material Lab pada 320/390/768/1280 plus canonical gallery matrix. CI menemukan dan memaksa fix Material Lab 30px collapse serta short-desktop feedback/CTA fit tanpa melemahkan assertion.
- Representative screenshot artifact #10710764036 direview; tidak ditemukan P0/P1 containment/readability blocker pada pilot surfaces.
- Containment sekarang closed. Next aktif adalah semantic illustration/provenance pilot kecil; mismatch seperti HEAD=`🙂`, JUMP=`🤸`, gills=`🫧`, beak=`👄`, towel=`🧺` tidak dianggap final production art.
- English narration quality Wave 1 PR #278 sudah merged/live verified: 27 English listening activities direview, terdiri dari 22 target-first narration + 5 sentence-level comprehension; browser English fallback sekarang memprioritaskan exact-locale Natural/Neural/Premium/Enhanced voice bila tersedia dan memakai prompt rate 0.92.
- English narration docs closure PR #279 sudah merged/live verified di main `397bcab1...`, CI #1369 exact Cloudflare smoke.
- English narration production asset gate PR #280 sudah merged/live verified ke main `2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48`; PR CI #1371 dan merged-main CI #1372 full success termasuk exact Cloudflare smoke.
- Registry produksi English narration sekarang mengunci exact 27 slot + exact runtime transcript, dengan status sengaja tetap 27 `review-required` / 0 approved / 0 binary / tanpa static-audio runtime activation.
- Permanent narration gate memblok stray public audio, missing provider/model/voice rights review, commercial-use/redistribution clearance, unresolved AI-disclosure decision, missing pronunciation/child-learning approval, invalid MP3 payload, SHA-256 drift, dan registry/runtime transcript drift.
- Safe handoff baru: `ENGLISH_NARRATION_SAFE_CHECKPOINT_2026-09-22.md`.
- Provider-pilot harness PR #283 sudah merged/live verified ke implementation baseline `4b975130bf6e5fc28cecbf6aea5373b7a1430c65`; PR CI #1395 / run `35719163695` dan merged-main CI #1396 / run `35719862989` full success, termasuk exact Cloudflare smoke.
- Harness mengunci exact empat activity, candidate OpenAI `gpt-4o-mini-tts-2025-12-15`, voice `marin`/`cedar`, dry-run default, output hanya di gitignored `internal/`, dan explicit `OPENAI_API_KEY` gate. Tidak ada audio candidate yang di-generate/commit oleh wave ini, registry tetap 27 `review-required`, 0 approved, 0 production binary, dan runtime static audio tetap tidak aktif.
- Next aman WS-02 sekarang adalah actual local/server-side candidate generation + human listening/provenance review untuk empat item itu; jangan bulk generate 27 dan jangan activate runtime playback dalam approval step yang sama.
- Human-review evidence gate PR #285 sudah **merged/live verified** ke main `dd84579624212b387a4e54dc93a5892c04de83d6`; exact-head PR CI #1412 / run `35724918622` dan merged-main CI #1415 / run `35725713601` full success, termasuk exact Cloudflare production smoke. Gate memverifikasi candidate manifest/path/MP3/bytes/SHA/transcript, mengikat review ke exact manifest/file SHA, dan human `accepted` wajib 16/16 rubric checks pass + reviewer/timestamp/listening attestation. Tool tidak bisa auto-approve registry, copy ke `public/`, atau activate runtime. Status tetap 0 generated pilot audio / 0 human-reviewed generated audio / 0 approved production audio.

- Menyelesaikan rangkaian WS-13 product UX sampai parent/profile/settings responsive redesign.
- Menambahkan child home/header/navigation baru dan subject directory 3 kolom.
- Menambahkan activity gallery hierarchy + QA unlock yang terisolasi.
- Menyatukan completion experience, memperbaiki matching randomization/retry, dan mengurangi first-instruction narration latency.
- Parent mobile sekarang memakai sticky header + fixed 5-item bottom navigation di bawah 760px; desktop memakai sidebar.
- Memisahkan identity child profile dari guide character pada parent UI dan memisahkan real family data dari `demo-gian`.
- Parent runtime live verified melalui PR #251 -> main `77bee682...`, CI #1160 exact Cloudflare smoke.
- Logic repeating-pattern audit PR #240 dan runtime reuse PR #273 sekarang **fully closed/live verified**; PR #273 merged ke main `709e2b7d...`, final PR CI #1321 dan merged-main CI #1353 full success termasuk exact Cloudflare smoke: 900/900, 47 active, `choice_grid` 174, `pattern_completion` 10, KEEP 900, tanpa Pattern #48.
- Dedicated Logic Pattern Completion browser QA lulus 320/390/768 dengan legitimate Wave A progression prerequisites, keyboard retry, touch/pointer completion, grouped `● ●` one-step evidence, dan permanent visual baseline 63 exact-path captures; merged-main artifacts tersimpan pada CI #1353.
- Subject-background system sudah merged/live verified untuk 9 subject / 900 activity dengan 54 scene family dan 108 responsive WebP.
- Activity character-presentation foundation sudah merged/live verified via PR #259 -> `b5acbfcde66ea1451f3e55a8d469d33ba4845af1`; merged-main CI #1190 / run `35589937017` sukses termasuk exact Cloudflare production smoke.
- Runtime character sekarang fail closed: Gavi/Paca tetap satu-satunya approved foreground runtime asset; Naya/Gian/Zia design sheets hanya reference sampai production asset terpisah lolos review.
- Canonical five-character runtime asset registry PR #262 sudah merged/live verified di `ceb2546b...`; CI #1196 / run `35594336327` full success termasuk exact Cloudflare production smoke.
- Menambahkan production-only path `public/artwork/characters/`, machine-readable provenance registry Naya/Gian/Zia, WebP alpha/dimension/size validator, serta regression fixtures; wave ini tidak menambah atau mengaktifkan binary karakter manusia.
- Character asset pipeline PR #263 sudah merged/live verified di `e4d7b428...`; merged-main CI #1198 / run `35599025558` full success termasuk exact Cloudflare production smoke. Next gate adalah candidate production asset review/provenance, bukan runtime activation langsung.
- Docs closure PR #264 sudah merged/live verified di `bb0645d...`; CI #1201 / run `35600793815` full success termasuk exact Cloudflare production smoke.
- Fresh Drive candidate intake audit tidak menemukan separate Naya/Gian/Zia foreground candidate; hanya tiga canonical design sheet. Next order dikunci Naya first -> Gian -> Zia, tanpa binary/runtime activation pada audit wave ini.
- Character production/development sekarang **PAUSED** oleh project owner; asset Drive karakter dipakai sebagai reference-only sampai ada instruksi eksplisit untuk resume. Mainlagi World juga dikerjakan terpisah dan tidak disentuh WS-05.
- Cloud learning analytics bug sudah ditutup melalui PR #267 -> main `89a2bc629e...`: fixed-cap 500 attempts / 2000 evidence diganti complete pagination; authenticated cloud failure tidak lagi diam-diam memakai local browser analytics.
- Regression baru mengunci 1.201 attempts + 3.603 evidence rows, small server caps, later-page failure, reconnect, stale request dan guest isolation; `test:learning:cloud-analytics` masuk aggregate learning suite.
- Merged-main CI #1205 / run `35621724090` full success termasuk exact Cloudflare production smoke; analytics closure record ada di `CLOUD_ANALYTICS_PAGINATION_CLOSURE_2026-09-21.md`.
- Repository governance hardening PR #269 sudah merged/live verified di `6fd9e3fc...`; PR CI #1208 dan merged-main CI #1209 full success termasuk exact Cloudflare production smoke.
- Pinned full-history Gitleaks sekarang juga berjalan sebagai `Required full-history secret gate` di dalam ruleset-required `Production dependency audit`, sehingga secret finding memblok merge; standalone `Secret history scan` tetap dipertahankan untuk visibility.
- Issue #83 sekarang hanya melacak physical-device acceptance; tidak ada lagi account/UI action terpisah untuk secret-scan enforcement.
- Tidak ada perubahan mastery/evidence/progression/schema dari sinkronisasi dokumentasi ini.


- Draft PR #272 menambahkan implementasi terisolasi **Mainlagi World / Petualangan Uang**: 8 Stage, illustrated journey map, audio-first story segments, reusable mini-game mechanics, Chapter 1 milestone, final visual recap, public-safe share landing, dan World-progress persistence terpisah dari canonical mastery.
- Known-green World code checkpoint `5c76f9812a93eb7ef07fff1880af4da5af2b4927` lulus CI #1290 / run `35679390492` pada Ubuntu, Windows, secret scan, dependency audit, production build, dan Mobile Chromium. PR tetap draft dan belum production.
- World checkpoint/restart record: `WORLD_PETUALANGAN_UANG_SAFE_CHECKPOINT_2026-09-22.md`.
- Visual World wave: Stage map diubah dari card-list menjadi compact alternating game-map nodes mengikuti winding path; activity UI dibuat sebagai floating tray di dalam illustrated scene; Chapter banner/star/finale spacing dipoles agar tidak saling menutup.
- Latest visual-green rollback: `checkpoint/world-petualangan-uang-visual-green-20260922` @ `3b033405b41abcfab4c70d9db76265095ff7c5e2`, CI #1314 / run `35682393320` full pass.
- World presentation policy dikunci di code: pilot tetap usia **6–8**, 3–5 adalah future separate variant, 9–12 future separate series; satu World tidak boleh diam-diam berubah menjadi rentang 3–12 berdasarkan umur.
- Asset production manifest baru mencatat reuse yang sudah approved dan gap yang belum final: Gian foreground, Naya foreground, fixed narration, dan dedicated World social card.
- Production policy/handoff: `WORLD_PETUALANGAN_UANG_PRODUCTION_POLICY_2026-09-22.md`.
- World → Evidence audit ditambahkan fail-closed: hanya `money-s02-activity-01` → `math.quantity.comparison` dan `money-s08-activity-02` → `math.operation.subtraction.within_10` yang lolos sebagai **candidate only**; 14 activity lain eksplisit excluded; bridge tetap disabled.
- Evidence audit/handoff: `WORLD_PETUALANGAN_UANG_EVIDENCE_BRIDGE_AUDIT_2026-09-22.md`.
- Global age migration tetap fail-closed: audit menemukan blocker di cloud profile parser/create, local+cloud profile UI, content validator, learning-skill/content-pack SQL age constraints, canonical catalog 3–7, age-filtered Belajar runtime, public copy, dan regression tests.
- Audit age migration menegaskan `player_profiles.age_group` sendiri adalah text tanpa numeric 3–7 SQL check; hard stop profile saat ini berada pada parser/UI/app contract.
- Age migration audit/handoff: `WORLD_AGE_MIGRATION_AUDIT_2026-09-22.md`; tidak ada blanket `ageMax 7 -> 12` rewrite.
- Narration registry World sekarang memakai stable cue ID untuk narrative/concept/payoff/activity prompt + final narrative-choice prompt; runtime speech key tidak lagi berbasis copy text.
- Fixed narration tetap fail-closed: semua cue `fallback-runtime`, `productionSrc=null`, future path deterministic di `/audio/world/money-festival/id-ID/<cue-id>.mp3`.
- Narration contract/handoff: `WORLD_PETUALANGAN_UANG_NARRATION_CONTRACT_2026-09-22.md`.
- Age/evidence-green rollback: `checkpoint/world-petualangan-uang-age-evidence-green-20260922` @ `f09c01dc54061cd3ce2d895bfa7f7477b9bf39c7`, CI #1352 / run `35684673952` full success.

## 2.0.1 — 5 Agustus 2026

- Memperbaiki urutan `VERIFY_WINDOWS.ps1`: `npm install` sekarang berjalan sebelum gate yang memerlukan TypeScript.
- Menambahkan pemeriksaan eksplisit untuk `node_modules\.bin\tsc.cmd`.
- Mengoreksi dokumentasi portable gate.
- Tidak mengubah gameplay, vision runtime, recognizer, maupun UI.
