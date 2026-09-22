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
production-needed
```

This prevents placeholder/fallback assets from being mistaken for finished production art.

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
CharacterAvatar(gian)
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
CharacterAvatar(naya)
```

Final requirement:

- same visual universe as Gian/Paca/Gavi;
- calm explainer/companion expression set;
- consistent framing with Gian across story scenes.

### Fixed narration/audio

Current source:

```text
AudioManager / browser speech path
```

Final requirement:

- pre-generated/reviewed Indonesian narration;
- stable audio asset IDs;
- matching caption text;
- replay control;
- deterministic fallback if audio cannot play;
- no dependency on runtime browser voice quality for final production.

### Public World social card

Current source:

```text
/og/math-warung.png
```

Final requirement:

- dedicated Petualangan Uang card;
- public-safe;
- no child name, child ID, exact age, mastery, attempt history or private route;
- World title and Mainlagi identity remain readable on small social previews.

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

## 11. Evidence boundary remains unchanged

This policy does **not** turn World activities into mastery evidence.

Current World pilot remains:

```text
practice/completion-only
```

The future World -> canonical Evidence bridge must be a separate architecture decision.

Do not let age adaptation or final art production become a shortcut around the existing learning-attempt/evidence contract.

Global profile/content/schema age expansion is a separate migration boundary. See `WORLD_AGE_MIGRATION_AUDIT_2026-09-22.md`; the current pilot must not trigger a blanket `ageMax 7 -> 12` rewrite.

## 12. Next production sequence

Recommended next work after this policy:

1. keep 6–8 as the current pilot;
2. create/approve Gian + Naya production foreground set;
3. define fixed narration asset generation/review workflow;
4. create bespoke World social card;
5. replace reused backgrounds only where a dedicated World scene materially improves storytelling;
6. rerun visual/mobile/full-playthrough QA;
7. create a new green checkpoint;
8. only then begin World -> Evidence bridge design.

This policy is intentionally narrower than the long-term Mainlagi 3–12 ambition. It prevents the pilot runtime from drifting into an incoherent one-World-fits-all model.
