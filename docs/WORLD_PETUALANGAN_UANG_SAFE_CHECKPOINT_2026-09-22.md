# Mainlagi World — Petualangan Uang Safe Checkpoint — 22 September 2026

Status: **SAFE CODE CHECKPOINT / DRAFT PR / NOT MERGED TO MAIN**  
Repository: `ceritaantarkita-req/mainlagi-hub`  
Branch: `feature/world-petualangan-uang-dummy-20260922`  
Draft PR: **#272**  
Production/main baseline at branch start: `8af5ce8a13d19f8aaeb3d8f06229dbcdeb555a41`  
Accepted code checkpoint head: `5c76f9812a93eb7ef07fff1880af4da5af2b4927`  
Frozen checkpoint branch: `checkpoint/world-petualangan-uang-green-20260922`  
Frozen checkpoint head: `faaca0eba4cbf6a75dfabb5f261cbf8e98e0912b`  
Latest visual-green checkpoint branch: `checkpoint/world-petualangan-uang-visual-green-20260922`  
Latest visual-green checkpoint head: `3b033405b41abcfab4c70d9db76265095ff7c5e2`  
Policy-green checkpoint branch: `checkpoint/world-petualangan-uang-policy-green-20260922`  
Policy-green checkpoint head: `6aacda2adc52906c9a505096defd376df098d685`  
Policy-green CI: #1334 / run `35683630094` — full PR matrix success

## 1. Verification at this checkpoint

Exact code head `5c76f9812a93eb7ef07fff1880af4da5af2b4927` passed PR CI:

```text
CI:                         #1290
Run:                        35679390492
Quality gate (Ubuntu):      PASS
Windows compatibility:      PASS
Secret history scan:        PASS
Production dependency audit:PASS
Production build:           PASS
Mobile route QA (Chromium): PASS
Production smoke:           skipped on draft PR, as expected
```

This is the safe rollback/restart point for the current World implementation. The checkpoint documentation/index synchronization was then verified again at `faaca0eba4cbf6a75dfabb5f261cbf8e98e0912b` by CI #1293 / run `35680206722`, with Ubuntu, Windows, secret scan, dependency audit, production build, and Mobile Chromium all passing. That exact docs-integrated state is frozen on `checkpoint/world-petualangan-uang-green-20260922`.

Later work on the feature branch may continue past this point without moving the frozen checkpoint branch.

## 2. Product boundary now implemented

Child-facing top-level product model:

```text
Belajar | World | Bermain
```

World is now a separate child experience rather than a renamed subject page.

Current pilot World:

```text
World: Petualangan Uang
Theme: preparing Festival Mainlagi
Structure: 2 Chapters × 4 Stages = 8 Stages
Primary age presentation: 6–8
Motion/camera dependency: none
```

The pilot stages are:

1. Uang Buat Apa?
2. Kok Jadi Lebih Mahal?
3. Uang Datang dari Mana?
4. Butuh atau Mau?
5. Simpan Dulu Yuk
6. Uang Bisa Bertambah?
7. Kalau Naik dan Turun?
8. Siapkan Festival!

## 3. Runtime contract implemented

The current runtime follows the agreed pattern:

```text
illustrated scene
-> short narrative / concept beat
-> mini-game or child choice
-> short feedback / story continuation
-> next segment
-> Stage completion
-> return to journey map
```

Important behavior now present:

- story text is intentionally short;
- fixed story segments are audio-first;
- the child must attempt narration before advancing a narrative/concept/payoff segment;
- if speech is muted or unavailable, readable caption text remains and progression fails open instead of trapping the child;
- mini-game prompts have an explicit replayable **Dengar** control;
- World remains usable without motion/camera;
- Stage checkpoint/resume is persisted;
- returning from a completed Stage focuses the next unlocked map stop.

## 4. World map and progression

The World map is now the main progression shell, not a generic list.

Current behavior:

- winding illustrated journey map;
- Chapter 1 and Chapter 2 markers;
- locked / unlocked / current / completed Stage states;
- next playable Stage gets a visible current-journey marker;
- each completed Stage shows three visual stars;
- completion of Stage 4 grants the Chapter 1 milestone **Pilih Pintar**;
- completing all 8 Stages changes the map to **Festival siap!**;
- World completion stars remain separate from canonical Skill Mastery.

Three-star World completion is currently a progression/reward signal. It is **not** canonical Belajar mastery evidence.

## 5. Current illustrated environment pass

This branch deliberately reuses approved existing Mainlagi artwork instead of introducing unreviewed binary art.

Current environment mapping:

```text
World hero             -> existing warung artwork
World map              -> existing Mainlagi garden artwork
Stage 1                -> playground
Stage 2                -> mini market
Stage 3                -> warung
Stage 4                -> mini market
Stage 5                -> number park
Stage 6                -> garden
Stage 7                -> playground
Stage 8                -> festival garden
Ambient companions     -> existing Paca / Gavi artwork
```

The Stage runtime now layers narrative/activity UI over illustrated locations rather than replacing the World with white cards.

Mobile rendering also reduces layered blur/backdrop effects to keep the illustrated World lighter on low/mid-range phones.

## 6. Visual QA reviewed from CI artifacts

World-specific CI screenshots include:

```text
390-child-demo-gian-worlds.png
390-child-demo-gian-world-money-festival.png
390-child-demo-gian-world-money-festival-stage-money-stage-01-money-use.png
320-world-money-stage-01-complete.png
390-world-money-stage-01-complete.png
430-world-money-stage-01-complete.png
390-world-money-stage-02-complete.png
390-world-money-chapter-01-complete.png
390-world-money-stage-05-order-complete.png
390-world-money-stage-08-complete.png
390-world-money-map-complete.png
390-world-money-public-share.png
```

Spot review at this checkpoint confirms:

- journey map is visually primary on mobile;
- initial Stage runtime reads as an illustrated place rather than a lesson page;
- audio-first state is visually clear;
- completion actions fit at 320 / 390 / 430 widths;
- Chapter 1 milestone is visible without overwhelming the completion card;
- completed 8/8 journey visibly pays off on the map.

No World-specific P0/P1 visual blocker was observed in the reviewed CI screenshots at this checkpoint.

## 7. Mini-game architecture retained

World content continues to use reusable mechanics instead of one source-code game per lesson.

Current World pilot reuses/configures:

- `drag_to_target`
- `matching`
- `compare`
- `sort_classify`
- `tap_choice`
- `ordering_sequence`
- `tap_choice + take_away presentation`
- narrative choice

The intended authoring rule remains:

```text
MECHANIC + CONTENT + ART + RULE = ACTIVITY
```

## 8. Final Stage recap

Stage 8 now includes one visual recap before the final payoff.

It shows six concrete learning moments:

- barang punya harga;
- harga bisa berubah;
- kerja dan usaha;
- pilih yang dibutuhkan;
- simpan untuk nanti;
- hasil punya risiko.

The recap is visual and glanceable; it is not a long quiz or paragraph-heavy summary.

## 9. Share and privacy boundary

World completion retains:

```text
Back | Again | Next
        Share
```

The existing server-side parent gate remains authoritative.

Current fallback share options align with the shared Mainlagi completion surface:

- Copy link
- native device share
- WhatsApp
- Telegram
- X
- Facebook
- Threads

The public shared page is `/worlds/money-festival` and now has World-specific Open Graph/Twitter metadata.

Share payloads use a public World URL and generic completion message; they do not include child ID, account ID, mastery score, or private child progress.

Local/unconfigured QA still follows the existing project rule that the share gate is allowed. Configured production still requires the authenticated parent gate.

## 10. Progress and learning boundary

World progress is intentionally separate from canonical Belajar mastery.

Implemented World persistence:

- local/offline checkpoint fallback;
- authenticated `child_world_progress` cloud path;
- account-owned read boundary;
- server-owned `save_world_progress` write path;
- ownership + registered World + bounded segment + linear completion validation;
- fail-closed normalization of invalid local progress.

Not implemented by design:

- World completion does not automatically award canonical mastery;
- World does not bypass `record_learning_attempt`;
- World does not issue Belajar certificates/achievements;
- World does not weaken Belajar progression rules.

A future World -> Evidence bridge must be designed explicitly against the existing learning activity/evidence contract.

## 11. Current non-final assets / deliberate temporary boundaries

The following are still prototype/production-gap areas, not hidden as complete:

- Naya/Gian/Zia still do not have approved production foreground character binaries;
- the World currently uses existing fallback/avatar representation for human characters;
- narration uses the existing browser/AudioManager speech path, not final recorded character voice production;
- social preview currently reuses the safe existing `/og/math-warung.png`, not a custom final World share card;
- the World art pass reuses existing Mainlagi backgrounds rather than a final bespoke 8-Stage World art pack;
- World activity attempts remain practice/completion-only with respect to canonical mastery.

## 12. Important failures already found and fixed during this wave

Do not reintroduce these:

- synchronous state reset inside the narration effect triggered the React lint gate;
- old browser QA tried to click disabled **Lanjut** without satisfying the new audio-first gate;
- local QA incorrectly expected production parent-share denial even though the canonical local/unconfigured rule permits QA sharing;
- optional mechanic prompts were passed into a required-string audio helper and failed TypeScript;
- earlier World visuals were too card-centric; the map/runtime were changed to use illustrated environments as the primary surface.

Exact head `5c76f9812a93eb7ef07fff1880af4da5af2b4927` is green after these fixes.

## 13. Safe next work

Do not merge PR #272 only because the dummy is now functional.

Recommended next sequence:

1. keep this checkpoint and the PR draft intact;
2. review World-specific CI screenshots with the product owner;
3. if the visual direction is accepted, create the final World visual asset plan rather than adding ad-hoc images;
4. decide whether the pilot remains 6–8 only or receives explicit 3–5 / 9–12 presentation policies before generalizing the runtime;
5. decide the future World -> canonical Evidence bridge separately from World progress;
6. replace temporary human/avatar and narration assets only through the existing character/provenance/audio quality gates;
7. create a custom public World share card after visual identity is locked;
8. only after those decisions, evaluate merge/integration into `main`.

## 14. Restart instructions for another agent

Another developer/agent should begin by reading:

1. this checkpoint;
2. PR #272 description;
3. `src/lib/learning/world/moneyWorld.ts`;
4. `src/lib/learning/world/progress.ts`;
5. `src/components/learning/world-v2/MoneyWorldExperience.tsx`;
6. `src/components/learning/world-v2/MoneyWorldExperience.module.css`;
7. `scripts/run-world-money-tests.mjs`;
8. `scripts/run-mobile-route-browser-tests.mjs`;
9. the World migrations in `supabase/migrations/`;
10. existing canonical learning/evidence docs before designing any mastery bridge.

Before editing, verify:

```text
branch is still the isolated World branch
main has not moved in a way that requires rebase/reconciliation
PR #272 remains draft unless the product owner explicitly approves integration
the latest known-green World code checkpoint is preserved
```

This file is a safe handoff/checkpoint, not a declaration that the World is already production-complete.

## 15. Visual-green checkpoint — game-map node pass

A second safe checkpoint was created after the World map and activity presentation were pushed closer to the intended illustrated adventure reference:

```text
Checkpoint branch: checkpoint/world-petualangan-uang-visual-green-20260922
Checkpoint head:   3b033405b41abcfab4c70d9db76265095ff7c5e2
CI:                #1314
Run:               35682393320
Ubuntu:            PASS
Windows:           PASS
Production build:  PASS
Dependency audit:  PASS
Secret scan:       PASS
Mobile Chromium:   PASS
Production smoke:  skipped on draft PR, as expected
```

What changed in this visual wave:

- the Stage map no longer presents each Stage as a full-width lesson card;
- Stages are now compact illustrated game-map nodes alternating left/right along the winding path;
- the three-star indicator sits with each node and remains separate from mastery;
- Chapter 1 / Chapter 2 banners are spaced away from node stars and labels;
- current/unlocked/completed/locked map states remain visible after the compact-node change;
- the Stage activity panel is now a floating tray inside the illustrated environment instead of occupying the entire location;
- Stage 1 activity QA confirms the environment remains visible around gameplay;
- final `Festival siap!` payoff is explicitly kept below Stage 8 instead of overlapping the final node;
- Chromium QA now locks the compact-node width, left/right alternation, and final payoff non-overlap.

Reviewed CI artifact at this checkpoint:

```text
390-child-demo-gian-world-money-festival.png
390-world-money-stage-01-activity.png
390-world-money-map-stage-02-unlocked.png
390-world-money-map-complete.png
```

Manual visual review of the CI artifact confirms that the map is now substantially closer to the intended illustrated winding-level-map reference: children primarily read the path, icon node, stars and short label rather than a vertical list of cards.

### Checkpoint rule

Use `checkpoint/world-petualangan-uang-visual-green-20260922` as the newest known-green rollback point for the visual World work. Do not rewrite or force-push that checkpoint branch. The active feature branch may continue beyond it.

## 16. Age-band and production-asset policy wave

After the visual-green checkpoint, the feature branch added explicit contracts so the pilot cannot drift into an ambiguous one-World-for-all-ages implementation.

Code contracts:

```text
src/lib/learning/world/moneyWorldPresentation.ts
src/lib/learning/world/moneyWorldAssets.ts
```

Locked decisions:

- current pilot = **6–8**;
- 3–5 = future separate content/presentation variant;
- 9–12 = future separate series/variant;
- one World does not silently auto-morph across 3–12;
- completion ★★★ remains separate from mastery;
- motion/camera remains unnecessary for World V1.

Explicit production gaps now tracked in code/tests:

- `gian-foreground`;
- `naya-foreground`;
- `fixed-narration`;
- `public-share-card`.

Approved reused pilot art is also represented in the manifest and checked for file existence in the World contract test.

Detailed policy: `WORLD_PETUALANGAN_UANG_PRODUCTION_POLICY_2026-09-22.md`.

Until this wave receives a new green checkpoint, the safe rollback remains `checkpoint/world-petualangan-uang-visual-green-20260922` @ `3b033405b41abcfab4c70d9db76265095ff7c5e2`.

## 17. Fail-closed World → Evidence audit

A machine-readable audit now covers all 16 World activity placements:

```text
src/lib/learning/world/moneyWorldEvidenceBridge.ts
version: money-world-evidence-bridge-v0
enabled: false
```

Audit result:

- 2 candidate objective/evidence matches only;
- 14 explicit exclusions;
- all 16 placements covered exactly once;
- candidate canonical Skill IDs must exist in the catalog;
- candidate assessed evidence contract must match the reusable mechanic;
- no World placement changes from `practice` to `assessed`.

Candidates:

```text
money-s02-activity-01 -> math.quantity.comparison
money-s08-activity-02 -> math.operation.subtraction.within_10
```

The bridge remains disabled because World activity IDs are not canonical `learning_activities`, the current canonical Skill age contract still stops at 7, server-owned World activity → Skill registration is undefined, and World ★★★ must stay separate from mastery.

Detailed audit: `WORLD_PETUALANGAN_UANG_EVIDENCE_BRIDGE_AUDIT_2026-09-22.md`.

No SQL/evidence/mastery/progression mutation is authorized by this audit.

## 18. Global age migration audit — still fail-closed

The branch now also owns a machine-readable audit of the canonical 3–7 boundaries that block a safe age-8+ Belajar/evidence rollout:

```text
src/lib/learning/world/moneyWorldAgeMigrationAudit.ts
version: money-world-age-migration-v0
enabled: false
```

Verified blocker groups:

- cloud profile parser and profile creation;
- local/cloud profile age controls;
- canonical content age validator;
- `learning_skills` SQL age checks;
- content-pack SQL age checks;
- canonical 3–7 content metadata;
- age-filtered Belajar recommendation/playability;
- public 3–7 product copy;
- regression tests that intentionally preserve current ranges;
- age-8 incompatibility for the two World evidence candidates.

The audit specifically records that `player_profiles.age_group` is text and is not itself protected by a numeric 3–7 SQL check; the current profile hard stop is in learning app/parser/UI code.

Safe migration rule:

```text
do not change profile max first
do not blanket-rewrite ageMax 7 -> 12
do not activate World mastery to make age 8 look supported
```

Automated World tests now inspect the actual source/schema files for these audited boundaries. If a later branch changes them, the audit test must be updated rather than allowing stale documentation.

Detailed record: `WORLD_AGE_MIGRATION_AUDIT_2026-09-22.md`.

No profile/UI/schema/catalog/adaptive/public-copy migration is performed by this wave.



## 19. Policy-green frozen checkpoint

The age-presentation + asset-production policy wave is independently frozen at:

```text
branch: checkpoint/world-petualangan-uang-policy-green-20260922
head:   6aacda2adc52906c9a505096defd376df098d685
CI:     #1334 / run 35683630094
Ubuntu: PASS
Windows: PASS
Production build: PASS
Dependency audit: PASS
Secret scan: PASS
Mobile Chromium: PASS
```

This checkpoint includes the 6–8 pilot presentation policy, explicit 3–5 / 9–12 future boundaries, asset production manifest, and related docs/tests. It predates the newer evidence-bridge and global-age migration audits.

The evidence/age-audit work on the active feature branch must not cause this checkpoint branch to move.

## 20. Age/evidence-green frozen checkpoint

Before the fixed-narration wave, the feature branch reached another independently green rollback:

```text
branch: checkpoint/world-petualangan-uang-age-evidence-green-20260922
head:   f09c01dc54061cd3ce2d895bfa7f7477b9bf39c7
CI:     #1352 / run 35684673952
Ubuntu: PASS
Windows: PASS
Production build: PASS
Dependency audit: PASS
Secret scan: PASS
Mobile Chromium: PASS
```

This checkpoint includes the fail-closed evidence and global age-migration audits. Do not move this checkpoint branch.

## 21. Fixed narration contract wave

After the age/evidence-green checkpoint, the active feature branch adds:

```text
src/lib/learning/world/moneyWorldNarration.ts
version: money-world-narration-v1
productionReady: false
```

All currently spoken narrative/concept/payoff/activity prompts now have deterministic cue IDs. Runtime speech dedupe/replay keys use those IDs instead of copy text.

Fixed audio remains intentionally absent:

```text
status: fallback-runtime
productionSrc: null
fallback: browser-speech
expected path: /audio/world/money-festival/id-ID/<cue-id>.mp3
```

Detailed contract: `WORLD_PETUALANGAN_UANG_NARRATION_CONTRACT_2026-09-22.md`.

This wave does not approve a voice provider, final audio binary, Naya/Gian production artwork, evidence activation, or global age migration.

## 22. Production wave 01 — Garden-baseline runtime shell + Gavi/Paca dummy

Work continues on the isolated branch:

```text
feature/world-petualangan-uang-production-wave-20260922
base: db0cdfcb81d68a7fe2e8d67445e1b635090158e3
```

Scope completed in this wave:

- Stage runtime is now a full-viewport immersive shell instead of a centered card container;
- top chrome follows the approved Garden activity language: **Kembali | centered Mainlagi wordmark | Dengar**;
- the existing World environment artwork remains the primary background;
- Stage title/location/progress remain visible without reintroducing the global child navigation;
- the top-level Dengar control delegates to the active narration/prompt contract, so the existing audio-first gate remains intact;
- activity / narrative-choice / recap scenes can stage approved **Gavi + Paca** as ambient companions;
- story-role presentation maps **Gian -> Gavi** and **Naya -> Paca** while character development is paused;
- fallback human Gian/Naya `CharacterAvatar` artwork is no longer activated by the World hero or Stage story runtime;
- canonical story-role metadata and stable narration cue IDs are intentionally preserved for future final-character production;
- no Belajar runtime, motion engine, mastery/evidence activation, SQL schema, or global age migration was changed.

Machine-readable character policy:

```text
src/lib/learning/world/moneyWorldAssets.ts
MONEY_WORLD_RUNTIME_CHARACTER_POLICY
version: money-world-runtime-character-dummy-v1
mode: approved-mascot-dummy
finalHumanCharactersActivated: false
```

QA contracts added:

- static World contract asserts the dummy mapping and keeps human activation false;
- mobile/browser World QA asserts the Garden-baseline shell, centered wordmark, top Dengar control, Gavi/Paca activity presentation, and absence of Gian/Naya fallback artwork.

This section documents the branch work only. It does **not** move any frozen green checkpoint and does not authorize merging PR #272 or this production-wave branch.


## 23. Production wave 02 — canonical World hierarchy

The isolated production branch now has an explicit reusable hierarchy contract:

```text
World -> Chapter -> Stage -> Scene -> Segment
```

New sources:

```text
src/lib/learning/world/worldStructure.ts
src/lib/learning/world/moneyWorldStructure.ts
docs/WORLD_CANONICAL_STRUCTURE_2026-09-22.md
```

Current Petualangan Uang topology:

```text
Worlds:   1
Chapters: 2
Stages:   8
Scenes:   44
Segments: 89
```

Important compatibility decisions:

- all existing Stage IDs remain unchanged;
- all existing Segment IDs and order remain unchanged;
- narration cue identity remains unchanged;
- activity IDs remain unchanged;
- Stage ★★★ completion remains unchanged;
- local/cloud resume continues using the existing Segment index;
- Scene is an authored presentation layer and does not require a persistence/schema migration;
- every rendered Segment must resolve to one canonical Scene or runtime fails closed.

Runtime proof now exposes `data-world-scene-id` and `data-world-scene-kind`. Browser QA locks Stage 1 opening -> `money-scene-s01-opening` and the first mini-game -> `money-scene-s01-money-price-match`.

Static QA validates hierarchy uniqueness, ordering, no orphan Stage/Scene, no duplicate Segment, and exact 89-Segment coverage.

This wave does not modify Belajar, Bermain/motion, mastery/evidence activation, global age migration, or final human-character production.


## 24. Production wave 03 — eight-Stage pilot production pass

Production wave 03 closes the pilot runtime coverage contract without touching main or the frozen World checkpoint branches.

New source:

```text
src/lib/learning/world/moneyWorldPilot.ts
MONEY_WORLD_PILOT_CONTRACT_VERSION = money-world-pilot-v1
```

The production manifest now owns all eight Stage background/ambience mappings.

Runtime changes:

- Stage visual CSS variables are resolved from `getMoneyWorldPilotStage(stageId)`;
- the old `WORLD_STAGE_AMBIENCE` component constant is removed;
- eight per-order Stage background CSS blocks are removed;
- Stage count copy derives from `MONEY_WORLD_STAGES.length` rather than literal `8`;
- runtime exposes `data-world-pilot-stage` and `data-world-pilot-runtime-status`;
- a missing Stage production manifest fails closed.

Static QA locks all eight manifest entries, approved/existing artwork, canonical Scene coverage, and absence of the removed hardcoding patterns.

Browser QA adds a 390px closure checkpoint for **all eight Stages**. Each final Segment must resolve to a canonical closing Scene and reach ★★★ completion.

Existing deeper browser scenarios remain for representative interaction mechanics, Chapter 1 completion, Stage 5 ordering, Stage 8 choice/recap/finale, map unlock behavior, and share/completion behavior.

Detailed record:

```text
docs/WORLD_PETUALANGAN_UANG_PILOT_PRODUCTION_2026-09-22.md
```

No Belajar runtime, Bermain/motion engine, SQL schema, mastery/evidence activation, global age migration, or final human-character production is changed.

CI note: contracts are committed, but this wave is not labeled CI-green until a workflow run validates the new branch head.


## 25. Production wave 04 — fixed narration production/review pipeline

Production wave 04 turns the stable narration cue registry into a fail-closed fixed-audio pipeline.

New sources:

```text
src/lib/learning/world/moneyWorldNarrationProduction.ts
src/lib/learning/world/moneyWorldNarrationPlayback.ts
scripts/export-world-money-narration-cue-sheet.mjs
docs/WORLD_PETUALANGAN_UANG_NARRATION_PRODUCTION_2026-09-22.md
```

Canonical narration topology:

```text
89 total World Segments
1 visual-only recap
88 spoken cue slots
```

Current production truth:

```text
approved:        0
pending:        88
productionReady: false
```

Important behavior:

- every cue gets a deterministic copy/speaker/kind fingerprint;
- fixed files use `/audio/world/money-festival/id-ID/<cue-id>.mp3`;
- generated files do not self-approve;
- approval requires deterministic path + current fingerprint + speaker/locale + provider/source + redistribution rights + reviewer + pronunciation/pacing/loudness/mobile review;
- World narration/prompt runtime no longer calls browser speech directly;
- the runtime resolver attempts fixed audio only for an approved cue;
- failed fixed playback falls back to browser speech;
- current unapproved cues resolve to `data-world-narration-mode="browser-speech"`;
- cue-sheet export is generated from repository contracts and checks that approved asset files exist.

The `fixed-narration` production gap remains open because there are **no approved fixed binaries or final voices yet**. This wave closes the pipeline, not the asset-production work.

No Belajar runtime, Bermain/motion, SQL schema, mastery/evidence activation, age migration, or final human-character production is changed.

CI note: this wave must not be called CI-green until a workflow run validates the resulting branch head.


## 26. Production wave 05 — reusable Scene presentation/renderer

Production wave 05 makes canonical `Scene.kind` an actual reusable runtime presentation layer.

New sources:

```text
src/lib/learning/world/worldScenePresentation.ts
src/components/learning/world/WorldSceneRenderer.tsx
src/components/learning/world/WorldSceneRenderer.module.css
docs/WORLD_SCENE_PRESENTATION_2026-09-22.md
```

Reusable mapping:

```text
story     -> dialogue
challenge -> activity
choice    -> choice
recap     -> recap
closing   -> payoff
```

Runtime changes:

- every Petualangan Uang active Segment is rendered inside `WorldSceneRenderer`;
- the renderer consumes the already-authored canonical Scene;
- Scene label/title/surface metadata is now owned outside Petualangan Uang;
- ambient Gavi/Paca visibility is controlled by generic Scene presentation policy rather than a Petualangan-Uang-specific Segment conditional;
- the renderer accepts companion/content slots, so future Worlds are not required to use Gavi/Paca or finance payloads;
- Stage/Segment progress, IDs, narration cue IDs and completion behavior remain unchanged.

Static QA locks exact coverage of all five canonical Scene kinds and requires every authored Petualangan Uang Scene to resolve a generic presentation.

Browser QA now verifies:

```text
Stage 1 opening   story     -> dialogue
Stage 1 challenge challenge -> activity
Stage 8 choice    choice    -> choice
Stage 8 recap     recap     -> recap
all Stage endings closing   -> payoff
```

This covers all canonical Scene kinds while keeping World-specific content renderers separate.

No Belajar runtime, Bermain/motion, SQL schema, mastery/evidence activation, age migration or final human-character production is changed.

CI note: this wave is committed but must not be called CI-green until the branch receives a validating workflow run. The next task is end-to-end production QA/responsive cleanup and then a new green checkpoint.


## 27. Production wave 06 — responsive QA / checkpoint candidate

Production wave 06 is a checkpoint-candidate QA pass after the reusable Scene renderer.

Changes:

- reusable Scene progress is now local to the authored Scene rather than duplicating global Stage Segment position;
- active Segment membership inside the resolved Scene fails closed if inconsistent;
- Scene renderer metadata/content is hardened against narrow-width overflow;
- mobile story/activity minimum height now accounts for the Scene wrapper;
- permanent browser QA covers all five Scene kinds at **320 / 390 / 430**;
- the matrix checks horizontal overflow, frame/meta/content viewport containment, >=44px touch targets, page errors and console errors;
- selected 320px/430px screenshots are emitted for manual review;
- previous all-eight Stage closure QA remains intact.

Detailed QA record:

```text
docs/WORLD_PRODUCTION_QA_2026-09-22.md
```

This is **not yet a green checkpoint**. Freeze a new checkpoint branch only after GitHub Actions validates the exact production-wave head.

PR #272 remains untouched and Draft. Production-wave validation must stay isolated from merge/integration decisions.


## 28. Production-green checkpoint — PR #282 / CI #1382

The production-wave responsive/runtime pass is now independently green.

Validation surface:

```text
Draft PR: #282
base:     feature/world-petualangan-uang-dummy-20260922
head:     feature/world-petualangan-uang-production-wave-20260922
```

This PR exists only to run pull-request CI. It does **not** target `main`, does not replace PR #272, and is not merge authorization.

Exact validated code head:

```text
e8f795b7d26a2cb3bf19fc787f6f58b2b85ed60a
```

CI:

```text
Mainlagi TV V3 CI
#1382
run 35704255936

Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

The 320/390/430 responsive Scene matrix initially found a sub-44px challenge control. The final code head fixes this in two layers:

- prompt audio control minimum height = 44px;
- every button/link inside `data-world-scene-content` is guaranteed at least 44 × 44px.

The final mobile matrix passed after that fix.

Frozen checkpoint:

```text
branch: checkpoint/world-petualangan-uang-production-green-20260922
head:   e8f795b7d26a2cb3bf19fc787f6f58b2b85ed60a
```

CI artifact reviewed:

```text
mobile-route-qa-screenshots
artifact id 10683524631
```

Selected visual review:

- `320-world-scene-story.png`;
- `320-world-scene-challenge.png`;
- `430-world-scene-choice.png`;
- `430-world-scene-recap.png`;
- `430-world-scene-closing.png`.

No P0/P1 World-specific visual blocker was observed in those selected screenshots.

### Checkpoint rule

Do not move or force-push `checkpoint/world-petualangan-uang-production-green-20260922`.

PR #272 remains Draft and untouched. Character development remains paused. World -> Belajar evidence remains disabled. Fixed narration production remains **0/88 approved assets** even though its pipeline is implemented.


## 29. Production wave 07 — dedicated social card

The next isolated production wave closes the Petualangan Uang public social-card gap.

New sources:

```text
src/lib/learning/world/moneyWorldSocial.ts
src/app/worlds/money-festival/social-card/route.tsx
docs/WORLD_SOCIAL_CARD_2026-09-22.md
```

Public metadata now uses:

```text
/worlds/money-festival/social-card
1200 × 630 PNG
```

for both Open Graph and Twitter.

The previous generic `/og/math-warung.png` social fallback is removed from the World page.

Asset manifest truth:

```text
public-share-card: production-ready
remaining gaps:
- fixed-narration
- gian-foreground
- naya-foreground
```

The dedicated card is generated from repository-owned public-safe copy and does not include child identity, account identity, progress, mastery, attempts, or private routes.

Character production remains paused. Fixed narration remains **0/88 approved**. World -> Belajar evidence remains disabled.

This section is a checkpoint candidate only. Record a new immutable checkpoint only after Draft PR #282 validates the exact branch head.


## 30. Social-card green checkpoint — PR #282 / CI #1391

Production wave 07 is independently green and frozen.

Exact validated head:

```text
9f6953302ee82db62a7362288233a77db2251743
```

Validation surface:

```text
Draft PR: #282
base:     feature/world-petualangan-uang-dummy-20260922
head:     feature/world-petualangan-uang-production-wave-20260922
target:   NOT main
```

CI:

```text
Mainlagi TV V3 CI
#1391
run 35716360918

Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Relevant artifact:

```text
mobile-route-qa-screenshots
artifact id 10689696970
```

Frozen checkpoint:

```text
branch: checkpoint/world-petualangan-uang-social-green-20260922
head:   9f6953302ee82db62a7362288233a77db2251743
```

Do not move or force-push this checkpoint branch.

What this checkpoint includes beyond the earlier responsive/runtime checkpoint:

- dedicated public-safe Petualangan Uang social-card contract;
- dedicated `/worlds/money-festival/social-card` 1200×630 PNG route;
- Open Graph + Twitter metadata pointed to that route;
- Gavi/Paca social copy aligned with the active dummy-character policy;
- generic `/og/math-warung.png` fallback removed from Petualangan Uang metadata;
- static QA for social-card dimensions/privacy/contract;
- browser QA for metadata + HTTP 200 PNG social-card response;
- `public-share-card` production gap closed.

Remaining explicit production gaps at this checkpoint:

```text
fixed-narration
gian-foreground
naya-foreground
```

Character development remains paused by owner decision, so the practical next gap is fixed narration asset production/approval. The fixed narration pipeline is already implemented, but approved assets remain **0/88**.

PR #282 remains Draft and is not merge authorization. PR #272 remains Draft and untouched. World -> Belajar evidence remains disabled.


## 31. Production wave 08 — narration Stage batches / voice-identity gate

The active production branch now makes the remaining fixed-narration work operationally batchable without authorizing premature permanent audio.

New sources:

```text
src/lib/learning/world/moneyWorldNarrationPlan.ts
scripts/prepare-world-money-narration-batch.mjs
docs/WORLD_NARRATION_BATCH_PLAN_2026-09-22.md
```

Current machine-readable truth:

```text
Stage batches:               8
total cues:                 88
approved cues:              0
generation-authorized cues: 0
blocked cues:              88
voice blocker: voice-identity-not-approved
```

Reason:

- canonical story roles remain Gian/Naya;
- runtime presentation temporarily maps those roles to Gavi/Paca;
- character development remains paused;
- temporary presentation mapping must not silently become a permanent voice identity decision.

Every Stage batch is therefore `blocked-voice-identity` until an explicit future product/production authorization resolves voice identity/source/rights.

The new Stage packet tool exports deterministic cue IDs, text, fingerprints, expected MP3 paths and required approval metadata, but prints an explicit STOP instruction while generation is unauthorized.

No audio binary is created or approved by this wave.

No Belajar, Bermain/motion, SQL schema, mastery/evidence, age migration, progression, or final character artwork is changed.

Checkpoint rule: validate the exact wave-08 head through Draft PR #282. If fully green, freeze a new immutable narration-readiness checkpoint without moving any prior checkpoint branches.


## 32. Production wave 09 — fixed narration binary provenance gate

The active production branch now has a fail-closed binary provenance gate before any fixed World narration can enter production.

New files:

```text
scripts/world-money-narration-asset-gate.mjs
scripts/validate-world-money-narration-assets.mjs
scripts/run-world-money-narration-asset-validator-tests.mjs
docs/WORLD_NARRATION_ASSET_GATE_2026-09-22.md
```

Approval metadata was strengthened to require:

- provider model;
- voice identity;
- source terms;
- rights basis;
- commercial-use clearance;
- redistribution clearance;
- explicit AI-disclosure decision;
- child-learning review;
- exact SHA-256.

The gate validates deterministic production paths, MP3 signature, file size, checksum, duplicate paths and rejects stray public narration binaries.

Regression fixtures cover stray audio, rights, disclosure, human review, invalid MP3, checksum drift and a valid approved fixture.

Current runtime/production truth remains:

```text
88 canonical spoken cues
0 approved fixed binaries
0 generation-authorized cues
88 voice-gated cues
browser speech fallback active
```

No provider/voice is selected by this wave.

No Belajar, Bermain/motion, SQL schema, evidence/mastery, age migration, World progression or final character artwork is changed.

Checkpoint rule: validate the exact wave-09 head through Draft PR #282. If fully green, freeze a new immutable narration-readiness checkpoint without moving any prior checkpoint.


## 33. Narration-readiness green checkpoint — CI #1403

Production wave 08 is independently green and frozen.

```text
head:   e545b3b0355b1edbb152667bd7b37ef8aa271217
CI:     #1403 / run 35722329709
branch: checkpoint/world-petualangan-uang-narration-readiness-green-20260922
```

Full matrix:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

This checkpoint freezes the eight-Stage narration batch plan and explicit `voice-identity-not-approved` gate.

Do not move or force-push the checkpoint branch.

## 34. Narration binary-gate green checkpoint — CI #1411

Production wave 09 is independently green and frozen.

```text
head:   31a2bdd41add5bca57e1606e875519cb83704bbe
CI:     #1411 / run 35723689117
branch: checkpoint/world-petualangan-uang-narration-gate-green-20260922
```

Full matrix:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

This checkpoint adds the permanent fixed-narration binary provenance gate:

- provider model + voice identity provenance;
- source terms + rights basis;
- commercial and redistribution clearance;
- explicit AI-disclosure decision;
- human pronunciation/child-learning/pacing/loudness/mobile review;
- exact SHA-256 binding;
- MP3 signature/size/path checks;
- stray-public-audio rejection;
- regression fixtures for the fail-closed cases.

Current truth remains:

```text
88 canonical spoken cues
0 approved fixed binaries
0 generation-authorized cues
88 voice-gated cues
browser speech fallback active
```

No provider/voice has been selected. Gian/Naya character development remains paused. PR #282 remains Draft; PR #272 remains Draft and untouched; World -> Belajar evidence remains disabled.

Do not move or force-push this checkpoint branch.


## 35. Production wave 10 — provider-neutral four-cue narration pilot scope

The active production branch now defines the smallest useful listening pilot without selecting a provider or voice.

New sources:

```text
src/lib/learning/world/moneyWorldNarrationPilot.ts
scripts/prepare-world-money-narration-provider-pilot.mjs
docs/WORLD_NARRATION_PROVIDER_PILOT_2026-09-22.md
```

Exact scope:

```text
money-s01-narrative-01       Gian · narrative
money-s01-concept-money      Naya · concept
money-s01-activity-01-prompt Naya · activity_prompt
money-s01-payoff-01          Gian · payoff
```

Machine truth:

```text
providerStatus:      unselected
generationAuthorized:false
publicOutput:        false
productionOutput:    false
runtimeActive:       false
registryAutoApproval:false
```

The pilot preparation tool is offline/provider-neutral and contains no provider API endpoint, credential requirement or generation call.

This wave does not authorize any audio generation. It only freezes a reproducible four-cue human-review scope.

No Belajar, Bermain/motion, SQL schema, evidence/mastery, age migration, World progression or final character artwork is changed.

Checkpoint rule: validate the exact wave-10 head through Draft PR #282. If fully green, freeze a new immutable provider-pilot-readiness checkpoint.


## 36. Provider-pilot readiness green checkpoint — CI #1414

Production wave 10 is independently green and frozen.

```text
head:   76443c05dcf6f50a0e65787180f7c13542ca87f9
CI:     #1414 / run 35725346949
branch: checkpoint/world-petualangan-uang-provider-pilot-green-20260922
```

Full matrix:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

This checkpoint freezes:

- exact four-cue Stage-1 provider-neutral listening pilot scope;
- 2 Gian-role + 2 Naya-role sample balance;
- narrative/concept/activity_prompt/payoff coverage;
- provider remains unselected;
- generation remains unauthorized;
- output remains internal/non-public/non-production;
- no registry auto-approval;
- no runtime fixed-audio activation.

Current production truth remains:

```text
88 canonical spoken cues
0 approved fixed binaries
0 generation-authorized cues
88 voice-gated cues
browser speech fallback active
```

Do not move or force-push this checkpoint branch.

PR #282 remains Draft and is not merge authorization. PR #272 remains Draft and untouched. Character production remains paused. World -> Belajar evidence remains disabled.


## 37. Production wave 11 — provider-pilot human review gate

The active production branch now defines the deterministic human listening gate for the exact four-cue narration provider pilot.

New sources:

```text
src/lib/learning/world/moneyWorldNarrationReview.ts
scripts/prepare-world-money-narration-review-sheet.mjs
docs/WORLD_NARRATION_REVIEW_GATE_2026-09-22.md
```

Every pilot cue must pass all nine blocking dimensions:

```text
exact_copy
pronunciation
child_comprehension
pacing
warmth
role_fit
loudness_consistency
artifact_free
mobile_playback
```

Acceptance is fail-closed:

- exact four-cue scope required;
- cue fingerprint must still match canonical copy;
- reviewer + timestamp required;
- all dimensions must equal `pass`;
- any `pending` or `fail` keeps `accepted=false`;
- partial review is invalid.

Static QA includes pending/all-pass/fail/stale-fingerprint/partial-scope fixtures.

Current provider state remains unselected. Generation remains unauthorized. No audio binary is created.

No Belajar, Bermain/motion, SQL schema, mastery/evidence, age migration, World progression or final character artwork is changed.

Checkpoint rule: validate the exact wave-11 head through Draft PR #282. If fully green, freeze a new immutable provider-pilot-review checkpoint without moving any prior checkpoint branches.


## 38. Provider-pilot human-review green checkpoint — CI #1429

Production wave 11 is independently green and frozen.

```text
head:   a2e46c9c3b023f04c19042e1dabebe4a55f82053
CI:     #1429 / run 35732394571
branch: checkpoint/world-petualangan-uang-provider-pilot-review-green-20260922
```

Full matrix:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Relevant artifacts:

```text
mobile-route-qa-screenshots — 10696402137
activity-quality-audit      — 10696012304
gameplay-distribution-audit — 10696097090
```

This checkpoint freezes the exact provider-neutral human review contract:

- four pilot cues exactly;
- nine blocking review dimensions;
- untouched templates may remain pending without reviewer metadata;
- once review starts, reviewer + timestamp become mandatory;
- stale cue fingerprint invalidates review;
- partial scope is invalid;
- all four cues must pass all nine dimensions before `accepted=true`;
- no provider, voice, binary, or runtime activation is authorized.

Current narration truth remains:

```text
provider selected:            NO
voice selected:               NO
generation authorized:        NO
approved fixed binaries:      0/88
browser speech fallback:      ACTIVE
```

Do not move or force-push this checkpoint branch.

PR #282 remains Draft and is not merge authorization. PR #272 remains Draft and untouched. Character production remains paused. World -> Belajar evidence remains disabled.


## 39. Production wave 12 — semantic Chapter navigation checkpoint candidate

The active production branch continues with non-audio World polish.

Changes:

- journey-map Chapter banners are now real runtime DOM derived from `MONEY_WORLD_CHAPTERS`;
- CSS pseudo-content Chapter titles were removed;
- each Chapter banner exposes completed Stage count from canonical membership;
- Stage shell exposes canonical Chapter ID/order/title;
- Stage shell secondary metadata now carries Stage/location/global Segment position;
- narrow Chapter banners are explicitly QA'd at 320 and 430px.

Browser QA additionally requires:

```text
after Stage 1:
Chapter 1 = 1/4 Stage selesai
Chapter 2 = 0/4 Stage selesai

completed World:
Chapter 1 = 4/4 Stage selesai
Chapter 2 = 4/4 Stage selesai
```

Detailed record:

```text
docs/WORLD_VISUAL_NAVIGATION_POLISH_2026-09-22.md
```

No audio generation, provider selection, final character art, Belajar, Bermain/motion, SQL schema, mastery/evidence, or World progression contract is changed.

Checkpoint rule: validate this exact wave head through Draft PR #282. If fully green, freeze a new immutable visual-navigation checkpoint without moving earlier checkpoints.


## 40. Visual-navigation green checkpoint — CI #1457

Production wave 12 is green and frozen after semantic Chapter navigation plus the 320px map-hero refinement.

```text
head:   55505f17d08a3a0218e142a7a9d637ba561f75fe
CI:     #1457 / run 35747546100
branch: checkpoint/world-petualangan-uang-visual-nav-polish-green-20260922
```

Full matrix:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Relevant artifact:

```text
mobile-route-qa-screenshots — 10703377795
```

Manual screenshot review found and fixed one narrow visual issue: at 320px the compact map hero previously split `Petualangan` across two fragments, producing a three-line title. The final validated CSS keeps `Petualangan Uang` within two readable lines and the browser matrix now locks that condition.

This checkpoint freezes:

- semantic Chapter 1/2 map banners;
- dynamic Chapter completion counts;
- Stage-shell Chapter identity/title;
- no CSS pseudo-content Chapter titles;
- 320/430 Chapter-map containment QA;
- two-line compact map-hero title QA.

Do not move or force-push this checkpoint branch.

Audio generation remains deferred. PR #282 remains Draft and is not merge authorization. PR #272 remains Draft and untouched. Character production remains paused. World -> Belajar evidence remains disabled.
