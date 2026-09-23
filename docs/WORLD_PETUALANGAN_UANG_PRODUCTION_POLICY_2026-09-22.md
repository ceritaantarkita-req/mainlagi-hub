# Mainlagi World — Age Presentation & Asset Production Policy — 22 September 2026

Status: **ACTIVE POLICY FOR DRAFT PR #272 / NOT PRODUCTION-MERGED**

This document locks the next production boundary for the Petualangan Uang pilot after the visual-green checkpoint.

## 1. Age-band decision

Petualangan Uang currently ships as a **6–8 pilot presentation**.

The runtime must **not** silently transform the same World into a single 3–12 experience based on age.

```text
3–5  -> future separate content/presentation variant
6–8  -> current pilot
9–12 -> future separate series/variant
```

This keeps the story, cognitive load, vocabulary, interaction count and visual maturity coherent inside each World.

The current code contract is:

```text
src/lib/learning/world/moneyWorldPresentation.ts
version: money-world-presentation-v1
pilotBandId: 6-8
autoMorphSameWorldByAge: false
sameWorldSpansAge3To12: false
```

## 2. 3–5 policy — future, not currently shipping

Target behavior:

- audio-first;
- very little child-facing text;
- one idea per speech bubble;
- roughly 2–4 minutes per Stage;
- one-step interactions;
- no more than about three visible choices at once;
- very large touch targets;
- concrete object/action first;
- no runtime trick where later 6–8 Stages are merely simplified.

If this band is produced, it should be authored as a separate content/presentation variant with its own QA.

## 3. 6–8 policy — current pilot

Current Petualangan Uang rules:

- audio-first with short caption support;
- roughly 4–6 minutes per Stage;
- simple multi-step reasoning is allowed;
- child-facing narration remains short;
- concrete example appears before abstract vocabulary;
- wrong answers never reduce completion stars;
- ★★★ means Stage completion, not mastery;
- camera/motion is not required;
- no paragraph-like child copy.

Current automated content contract keeps fixed narration to the pilot low-text budget and treats all World activities as practice/completion-only until the canonical evidence bridge exists.

## 4. 9–12 policy — future, not currently shipping

Do not append many harder Stages to the current 6–8 World and call that the older experience.

Future 9–12 content should:

- keep Mainlagi visual identity while reducing toddler-like presentation;
- use richer causal scenarios;
- allow somewhat longer reasoning chains;
- keep story/context rather than becoming a finance dashboard or textbook;
- become a separate World series/variant with independent content QA.

## 5. Cross-band invariants

These do not change by age band:

- one bubble = one idea;
- audio remains available/replayable;
- child can recover if audio fails;
- concept before jargon;
- wrong answer never removes ★★★ completion;
- completion stars are not Skill Mastery;
- World progress remains separate from Belajar mastery;
- only compatible objective evidence may transfer mastery in a future evidence bridge;
- no required motion/camera path for World V1.

## 6. Asset production contract

Canonical pilot asset manifest:

```text
src/lib/learning/world/moneyWorldAssets.ts
version: money-world-assets-v1
```

Every World asset slot has an explicit state:

```text
approved-reused
temporary-runtime
production-ready
production-needed
```

`production-ready` is reserved for a production asset/route that is complete for the current pilot but is not part of the reused-public-file inventory.

This prevents placeholder/fallback assets from being mistaken for finished production art.

## 6A. Current runtime-character override — production wave 01

Character development remains **paused** by the project owner.

Until that boundary is explicitly resumed, World runtime presentation uses only the two approved production mascot assets:

```text
canonical story role Gian -> runtime dummy Gavi
canonical story role Naya -> runtime dummy Paca
```

Code source of truth:

```text
src/lib/learning/world/moneyWorldAssets.ts
MONEY_WORLD_RUNTIME_CHARACTER_POLICY
version: money-world-runtime-character-dummy-v1
mode: approved-mascot-dummy
finalHumanCharactersActivated: false
```

This is a **presentation mapping**, not a rewrite of canonical story-role metadata. Stable World IDs, narration cue IDs, progression, evidence semantics, and the future Gian/Naya production slots remain unchanged.

The World hero and Stage runtime must not render the current fallback human `CharacterAvatar(gian|naya)` representations while this override is active.

## 7. Approved reused assets in the pilot

Current approved reuse:

- existing Mainlagi warung background;
- existing Mainlagi garden background;
- existing playground wide/mobile backgrounds;
- existing mini-market wide/mobile backgrounds;
- existing number-park wide/mobile backgrounds;
- Paca ambient artwork;
- Gavi ambient artwork.

These assets are already checked by the World contract test to ensure the referenced files still exist.

## 8. Explicit production gaps

The pilot must continue to report these as unfinished:

### Gian foreground character

Current source:

```text
Gian story role -> approved Gavi runtime dummy
(no Gian production binary active)
```

Final requirement:

- transparent production foreground set;
- consistent body proportions;
- consistent scale;
- story-safe expressions;
- poses usable beside speech bubbles and scene props.

### Naya foreground character

Current source:

```text
Naya story role -> approved Paca runtime dummy
(no Naya production binary active)
```

Final requirement:

- same visual universe as Gian/Paca/Gavi;
- calm explainer/companion expression set;
- consistent framing with Gian across story scenes.

### Fixed narration/audio

Current source:

```text
moneyWorldNarrationProduction.ts approval manifest
-> fixed deterministic MP3 when explicitly approved
-> browser speech fail-safe when pending/failing
```

Current approval truth:

```text
88 total cues
0 approved
88 pending
productionReady=false
```

Final requirement:

- pre-generated/reviewed Indonesian narration;
- stable audio asset IDs;
- matching caption text;
- replay control;
- deterministic fallback if audio cannot play;
- no dependency on runtime browser voice quality for final production.

### Public World social card

Status: **production-ready pilot asset**

Current source:

```text
/worlds/money-festival/social-card
dynamic ImageResponse
1200 × 630 PNG
```

Contract:

```text
src/lib/learning/world/moneyWorldSocial.ts
version: money-world-social-card-v1
```

Requirements now locked in code/QA:

- dedicated Petualangan Uang card;
- public-safe;
- no child name, child ID, exact age, mastery, attempt history or private route;
- Open Graph and Twitter use the same dedicated route;
- World title and Mainlagi identity remain readable on small social previews.

Detailed record: `WORLD_SOCIAL_CARD_2026-09-22.md`.

## 9. Naming proposal for final production assets

Recommended stable pattern:

```text
/world/money-festival/backgrounds/stage-01-mobile.webp
/world/money-festival/backgrounds/stage-01-wide.webp
/world/money-festival/characters/gian/neutral.webp
/world/money-festival/characters/gian/curious.webp
/world/money-festival/characters/naya/explain.webp
/world/money-festival/audio/id-ID/money-s01-narrative-01.mp3
/world/money-festival/audio/id-ID/money-s01-concept-money.mp3
/og/world-money-festival.png
```

Do not rename stable Segment IDs merely to match filenames. Audio/art should reference stable content IDs, not become the source of truth for progression.

## 10. Production acceptance gates for new art/audio

A replacement asset is not accepted merely because it looks better.

Required checks:

1. matches the Mainlagi visual bible;
2. fits 320/390/430 mobile crops;
3. preserves readable gameplay/touch space;
4. does not hide important scene props;
5. does not introduce text baked into artwork when runtime text should own it;
6. has clear provenance/approved source;
7. does not add camera/motion dependency;
8. does not alter Stage IDs, evidence semantics or mastery;
9. passes existing browser QA after replacement;
10. checkpoint is created before large asset batches are swapped.

## 10A. Canonical World hierarchy

Production wave 02 locks the reusable authoring hierarchy:

```text
World -> Chapter -> Stage -> Scene -> Segment
```

Source contracts:

```text
src/lib/learning/world/worldStructure.ts
src/lib/learning/world/moneyWorldStructure.ts
docs/WORLD_CANONICAL_STRUCTURE_2026-09-22.md
```

Petualangan Uang currently validates as **1 World / 2 Chapters / 8 Stages / 44 Scenes / 89 Segments** with exact Segment-order preservation.

The Scene layer is presentation structure only. Existing Stage completion and Segment-index resume compatibility remain unchanged.

## 10B. Eight-Stage pilot production manifest

Production wave 03 makes the eight-Stage presentation contract data-driven:

```text
src/lib/learning/world/moneyWorldPilot.ts
version: money-world-pilot-v1
```

The manifest owns Stage background selection and ambience. React/CSS no longer owns eight separate visual mappings.

The pilot validator requires all canonical Stages in exact order and confirms every Stage has authored story/challenge/closing coverage. Stage 8 additionally requires its choice and recap Scenes.

Detailed implementation record: `WORLD_PETUALANGAN_UANG_PILOT_PRODUCTION_2026-09-22.md`.

## 10C. Fixed narration production/review pipeline

Production wave 04 adds:

```text
src/lib/learning/world/moneyWorldNarrationProduction.ts
src/lib/learning/world/moneyWorldNarrationPlayback.ts
scripts/export-world-money-narration-cue-sheet.mjs
```

The pipeline covers all **88 spoken cue slots** and fails closed. A generated MP3 is not runtime-eligible until its explicit approval record matches the current cue fingerprint, deterministic path, speaker/locale, provider/source, redistribution rights, reviewer metadata, pronunciation, pacing, loudness and mobile playback gates.

Current runtime truth remains **0/88 approved**, so narration resolves to browser speech. Fixed-file playback is wired and automatically falls back to browser speech on construction/load/playback failure.

Detailed record: `WORLD_PETUALANGAN_UANG_NARRATION_PRODUCTION_2026-09-22.md`.

## 10D. Reusable Scene presentation layer

Production wave 05 adds a World-generic Scene presentation policy and renderer:

```text
src/lib/learning/world/worldScenePresentation.ts
src/components/learning/world/WorldSceneRenderer.tsx
docs/WORLD_SCENE_PRESENTATION_2026-09-22.md
```

The five canonical Scene kinds now resolve to reusable surfaces:

```text
story -> dialogue
challenge -> activity
choice -> choice
recap -> recap
closing -> payoff
```

Petualangan Uang no longer owns the ambient-companion visibility rule. It supplies Gavi/Paca as a companion slot while the generic Scene policy decides when that slot appears.

## 11. Evidence boundary remains unchanged

This policy does **not** turn World activities into mastery evidence.

Current World pilot remains:

```text
practice/completion-only
```

The World -> canonical Evidence bridge is now specified as a **design-only, fail-closed v1 contract** in `WORLD_EVIDENCE_BRIDGE_ARCHITECTURE_2026-09-23.md`. It remains disabled and is not an activation decision.

Do not let age adaptation or final art production become a shortcut around the existing learning-attempt/evidence contract.

Global profile/content/schema age expansion is a separate migration boundary. See `WORLD_AGE_MIGRATION_AUDIT_2026-09-22.md`; the current pilot must not trigger a blanket `ageMax 7 -> 12` rewrite.

## 12. Next production sequence

Current ordered work:

1. **DONE on isolated branch** — Garden-baseline Stage runtime shell;
2. **DONE on isolated branch** — canonical World -> Chapter -> Stage -> Scene -> Segment contract;
3. **DONE on isolated branch** — eight-Stage Petualangan Uang pilot production manifest + closure QA;
4. **DONE on isolated branch** — fixed narration production/review/resolution pipeline, currently 0/88 assets approved;
5. **DONE on isolated branch** — reusable Scene presentation/renderer layer for all five canonical Scene kinds;
6. **DONE / GREEN** — 320/390/430 production QA matrix + responsive Scene cleanup;
7. **DONE / GREEN** — CI #1382 validated code head `e8f795b7...` and froze `checkpoint/world-petualangan-uang-production-green-20260922`;
8. **DONE / GREEN** — dedicated public-safe 1200×630 Petualangan Uang social card, validated at `9f695330...` by CI #1391;
9. **DONE / CHECKPOINTED** — froze `checkpoint/world-petualangan-uang-social-green-20260922` at the exact validated head;
10. **DONE / GREEN / CHECKPOINTED** — eight narration Stage batches + fail-closed voice-identity gate; CI #1403; checkpoint `checkpoint/world-petualangan-uang-narration-readiness-green-20260922`;
11. **DONE / GREEN / CHECKPOINTED** — permanent narration binary provenance gate blocks stray audio, rights gaps, unresolved disclosure, missing human review, invalid MP3 payloads and SHA-256 drift; CI #1411; checkpoint `checkpoint/world-petualangan-uang-narration-gate-green-20260922`;
12. **DONE / GREEN / CHECKPOINTED** — exact four-cue Stage-1 provider/voice pilot scope validated by CI #1414 at `76443c05...`; checkpoint `checkpoint/world-petualangan-uang-provider-pilot-green-20260922`;
13. **DONE / GREEN / CHECKPOINTED** — provider-neutral four-cue human listening review gate validated by CI #1429 at `a2e46c9c...`; checkpoint `checkpoint/world-petualangan-uang-provider-pilot-review-green-20260922`;
14. **DEFERRED WHILE NON-AUDIO WORK CONTINUES** — narration voice identity/source/rights decision remains required before the four-cue listening pilot may be generated;
15. **DONE / GREEN / CHECKPOINTED** — semantic Chapter navigation + 320px map-hero polish validated by CI #1457 at `55505f17...`; checkpoint `checkpoint/world-petualangan-uang-visual-nav-polish-green-20260922`;
16. **DONE / GREEN / CHECKPOINTED** — completion UX derives canonical Chapter milestones, preserves ★★★ + Back / Again / Next + Share, and is validated by CI #1467 at `40436d41...`; checkpoint `checkpoint/world-petualangan-uang-completion-ux-green-20260922`;
17. **DONE / GREEN / CHECKPOINTED** — eight-Stage content consistency audit + four Indonesian continuity refinements validated by CI #1491 at `ef0a0ab6...`; checkpoint `checkpoint/world-petualangan-uang-content-audit-green-20260922`;
18. **DONE / GREEN / CHECKPOINTED** — accessibility semantics/focus/forced-colors pass validated in CI #1516 at `1a74e5da...`;
19. **DONE / GREEN / CHECKPOINTED** — World-specific visual budgets + route-scoped background lazy-load boundary validated in the same CI #1516;
20. **DONE / FROZEN** — combined non-audio checkpoint `checkpoint/world-petualangan-uang-non-audio-production-green-20260922` at `1a74e5da...`;
21. **DONE / GREEN / CHECKPOINTED / DESIGN ONLY** — World -> Evidence v1 architecture validated by CI #1530 at `38bbe570...`; checkpoint `checkpoint/world-evidence-bridge-contract-green-20260923`; 16/16 World activities audited, 2 unapproved Math candidates, 14 exclusions, direct `record_learning_attempt` reuse forbidden, no runtime/schema/write activation;
22. **DONE / GREEN / FINAL DESIGN HANDOFF** — synchronized design closure validated by CI #1535 at `82faddd6...`; checkpoint `checkpoint/world-evidence-bridge-design-closure-green-20260923`;
23. **DONE / DECISION SELECTED / PRE-ACTIVATION** — the isolated activation-decision wave defers Stage 2 price comparison, selects Stage 8 `8 - 2` as the sole future supplemental-evidence mapping to `math.operation.subtraction.within_10`, keeps age 8 World-only, selects a dedicated server-owned supplemental-evidence boundary, and defines replay/mastery-ceiling isolation; runtime/schema/writes remain disabled;
24. **IMPLEMENTED ON ISOLATED BRANCH / RUNTIME DISABLED** — Implementation Wave 1 adds migration 0048, additive supplemental-evidence storage, a service-role-only write RPC, disabled server ingestion route, raw-answer canonicalization and anti-farming/security contracts; application and database kill switches remain false;
25. **IMPLEMENTED ON ISOLATED BRANCH / PRE-ACTIVATION** — Implementation Wave 2 adds source-aware mastery provenance, World-only `exploring` ceiling, canonical-Belajar-only progression/adaptive/certificate/achievement gates, parent-report source labels and dedicated isolation regression coverage;
26. **NEXT ACTIVATION DECISION BOUNDARY** — Stage 8 assessed promotion, application/database gate activation, runtime observation emission, production migration, and live database/security verification remain separately blocked;
27. Gian/Naya visual character production remains paused;
28. bespoke Stage/background art remains optional because current reused backgrounds are approved for the pilot;
29. **ACTIVATION CODE GREEN ON ISOLATED BRANCH** — only `money-s08-activity-02` is promoted to assessed supplemental evidence with content version `money-world-s08-subtraction-v2-assessed`, runtime raw-observation emission and migration `0050`; exact code checkpoint `15f647b9...` passed CI #1573;
30. **NOT PRODUCTION-DEPLOYED / NOT LIVE-VERIFIED** — PR #309 remains Draft/unmerged, `main` is untouched, and the available Supabase connector returned zero projects, so migrations 0048–0050 and live RLS/RPC/idempotency behavior were not applied/verified against production;
31. no second World evidence mapping, age-8 expansion, direct `record_learning_attempt(...)` reuse, Belajar completion/star mutation or certificate side effect is authorized by this activation wave.


This policy is intentionally narrower than the long-term Mainlagi 3–12 ambition. It prevents the pilot runtime from drifting into an incoherent one-World-fits-all model.
