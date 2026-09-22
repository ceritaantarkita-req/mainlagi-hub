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
