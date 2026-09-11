# Mainlagi Expansion Implementation Plan

Last reviewed: 11 September 2026

This is the canonical repository plan for scaling Mainlagi to nine structured learning/creative tracks. `main` remains the implementation source of truth; this document defines sequencing, target counts, evidence boundaries, and closure rules.

## Product target

Target: **900 meaningful playable activities** across:

- Math — 100
- Bahasa Indonesia — 100
- English — 100
- Iqro — 100
- Letters/Menulis — 100
- Logic/Logika — 100
- Science/Sains — 100
- Drawing/Menggambar — 100
- Coloring/Mewarnai — 100

Seven academic subjects therefore account for 700 activities; Drawing + Coloring add 200 creative-practice targets.

A distinct activity requires meaningful educational or interaction variation. Answer shuffling, cosmetic changes, or decorative asset swaps do not create a new count by themselves.

## Engineering rules

- mobile release widths remain 320, 360, 375, 390, and 430 px;
- core learning remains touch-first; camera remains optional;
- completion-only participation never manufactures academic accuracy;
- assessed activities require validated measurable evidence;
- measured all-wrong outcomes remain accuracy `0`; missing measurement fails closed;
- trivial replay/variant farming must not accelerate mastery;
- historical IDs remain stable;
- every activity needs valid subject/path/stage/lesson/pack ownership, age/difficulty metadata, skill mapping, mechanic, and evidence metadata;
- Iqro packs remain `expert_required` until competent human approval; engineering success is not expert religious-learning approval;
- generic Latin tracing remains practice-only until a validated glyph-shape fidelity evaluator exists;
- science activities must remain age-appropriate and must not depend on unsafe unsupervised experiments;
- free Drawing/Coloring practice must not fabricate academic mastery;
- migrations are additive/idempotent unless an explicitly reviewed corrective migration requires otherwise;
- every wave follows branch -> PR -> full CI -> migration verification -> live DB verification/advisors -> squash merge -> exact-SHA Cloudflare production smoke;
- target floors rise only when real playable instances exist and pass validation.

## Batch status

| Batch | Scope | Status |
| --- | --- | --- |
| 0 | Baseline, metrics, acceptance contracts | COMPLETE |
| 1 | Mobile design-system foundation | COMPLETE |
| 2 | Mobile route migration + Chromium QA | COMPLETE |
| 3 | AudioManager / voice latency architecture | COMPLETE |
| 4 | Scalable content architecture | COMPLETE IN PRODUCTION |
| 5 | Reusable mechanic library | COMPLETE IN PRODUCTION |
| 6 | Letters/Logic/Science foundations | COMPLETE IN PRODUCTION |
| 7 | Math to 100 | COMPLETE IN PRODUCTION |
| 8 | Bahasa Indonesia to 100 | COMPLETE IN PRODUCTION |
| 9 | English to 100 | COMPLETE IN PRODUCTION |
| 10 | Iqro to 100 | ENGINEERING/CATALOG COMPLETE IN PRODUCTION — EXPERT REVIEW STILL REQUIRED |
| 11 | Letters/Menulis to 100 | COMPLETE IN PRODUCTION |
| **12** | **Logic/Logika to 100** | **COMPLETE IN PRODUCTION** |
| **13** | **Science/Sains to 100** | **COMPLETE IN PRODUCTION** |
| **14** | **Drawing/Menggambar + Coloring/Mewarnai to 100 each** | **NEXT** |
| 15 | Adaptive/mastery/report scaling | PLANNED |
| 16 | Performance/accessibility/security/device QA | PLANNED |
| 17 | Final acceptance and production closure | PLANNED |

## Completed academic expansion sequence

### Batch 7 — Math to 100

Entered with 7 historical activities; Wave A added 18 and Waves B–D added 25 each. Detailed closure: `EXPANSION_BATCH7_CLOSURE_2026-09-10.md`.

### Batch 8 — Bahasa Indonesia to 100

Entered with 6 historical activities; Wave A added 19 and Waves B–D added 25 each. Detailed closure: `EXPANSION_BATCH8_CLOSURE_2026-09-10.md`.

### Batch 9 — English to 100

Entered with 6 historical activities; Wave A added 19 and Waves B–D added 25 each. Detailed closure: `EXPANSION_BATCH9_CLOSURE_2026-09-10.md`.

### Batch 10 — Iqro to 100

Entered with 4 historical activities; added 96 total through `0027`–`0030`. Closes at 99 assessed / 1 historical practice. All active Iqro packs remain `expert_required`. Detailed closure: `EXPANSION_BATCH10_CLOSURE_2026-09-10.md`.

### Batch 11 — Letters/Menulis to 100

Entered with 3 historical activities; added 97 total through `0031`–`0034`. Closes at 87 assessed / 13 practice. Generic formation traces remain `completion_only_v1`, non-gating practice. Detailed closure: `EXPANSION_BATCH11_CLOSURE_2026-09-11.md`.

### Batch 12 — Logic/Logika to 100 — COMPLETE

Logic entered with 3 historical assessed activities and added **97 measured assessed activities**:

- [x] Wave A — 3 -> 25, +22; PR #64; migration `0035`; main SHA `ce76d5f7d11385712005a1edaf4005c459ac0eb7`; main CI #274.
- [x] Wave B — 25 -> 50, +25; PR #65; migration `0036`; main SHA `1aa97490ab2d9f6625edfc027d4916784f719dfd`; main CI #276.
- [x] Wave C — 50 -> 75, +25; PR #66; migration `0037`; main SHA `1208d9487d150ff2825be417f82fe01ce0413d96`; main CI #279.
- [x] Wave D — 75 -> 100, +25; PR #67; migration `0038`; main SHA `553b9e28f91feefa9af9c2995f2f7e913bf31491`; main CI #281.

All four post-merge runs passed exact-SHA Cloudflare smoke. Logic closes at **100 assessed / 0 practice**. Detailed closure: `EXPANSION_BATCH12_CLOSURE_2026-09-11.md`.

### Batch 13 — Science/Sains to 100 — COMPLETE

Science entered with 3 historical assessed activities and added **97 measured assessed activities**:

- [x] Wave A — 3 -> 25, +22; PR #68; migration `0039`; main SHA `296b8c69513d5577233a8a777062741fd83163c9`; main CI #283.
- [x] Wave B — 25 -> 50, +25; PR #69; migration `0040`; main SHA `92f6767ee3015fb7e160adb0cd8ce85309676eb9`; main CI #285.
- [x] Wave C — 50 -> 75, +25; PR #70; migration `0041`; main SHA `1c956867fd912bfea25c7cb0105a97921299cf80`; main CI #287.
- [x] Wave D — 75 -> 100, +25; PR #71; migration `0042`; main SHA `e35d211ada182e0c5379da7b9b33614309994852`; main CI #290.

All four post-merge runs passed exact-SHA Cloudflare smoke. Science closes at **100 assessed / 0 practice**. Detailed closure: `EXPANSION_BATCH13_CLOSURE_2026-09-11.md`.

## Current production baseline after Batch 13

- 702 playable activities;
- 683 assessed / 19 practice;
- 8 first-class subjects / 8 paths;
- 38 stages;
- 157 lessons;
- 157 content packs;
- 160 skills;
- all seven academic subjects exactly 100;
- Coloring 2;
- Drawing not first-class yet.

Remaining catalog gap to the planned 900 target: **198**.

## Batch 14 — Drawing/Menggambar + Coloring/Mewarnai to 100 each — NEXT

### Drawing

Drawing must first become a first-class track through the canonical ownership model. The target is 100 meaningful creative-practice activities.

- Wave A 1–25: straight/curved lines, paths, simple shapes, connect-dots.
- Wave B 26–50: guided objects from basic shapes, symmetry, pattern drawing.
- Wave C 51–75: copy/complete simple pictures, faces, animals, objects, scene parts.
- Wave D 76–100: guided scenes, creative prompts, mixed practice, child-safe open creation.

Free-form participation should default to practice/reporting evidence. Any objectively assessed drawing/tracing task requires an explicit validated evaluator and evidence contract before it can affect mastery.

### Coloring

Coloring preserves its two historical practice activities; Wave A must therefore add **23 meaningful activities** to reach 25, not blindly add 25.

- Wave A 1–25: large simple shapes/objects and basic color exploration.
- Wave B 26–50: animals, food, vehicles, nature, everyday objects.
- Wave C 51–75: scenes, patterns, category-guided coloring, finer regions.
- Wave D 76–100: themed scenes, creative palettes, guided/free coloring, review collections.

Palette/background swaps or nearly identical outlines alone do not count as distinct activities.

## Batch 15 — Adaptive/mastery/report scaling

Scale recommendations and reporting for hundreds of activities using skill weakness, confidence, evidence spacing, mechanic/content repetition, age, stage, difficulty, frustration/retry, and motion preferences. Prefer different items/mechanics for a weak skill instead of exact replay. Keep Parent UI summarized rather than dumping raw activity lists.

## Batch 16 — Performance, accessibility, security, device QA

Audit catalog payload size, route/mechanic code splitting, assets, initial JS, TTS initialization, and query volume. Re-run accessibility, RLS/ownership/RPC/outbox/dependency/secret/advisor checks plus representative physical-device mobile/camera/audio/trace flows.

## Batch 17 — Final acceptance and production closure

CI must verify final target counts, unique IDs, content references, evidence contracts, adaptive/mastery/outbox regressions, mobile overflow gates, typecheck/lint/Ubuntu/Windows/simulations/build/audit/secret scan. Then run guest/authenticated/offline/multi-child acceptance, exact-SHA Cloudflare production smoke, and synchronize canonical docs.

## Content-wave rule

```text
Wave A: canonical count 1–25
Wave B: canonical count 26–50
Wave C: canonical count 51–75
Wave D: canonical count 76–100
```

Existing validated activities count toward the boundary. Never add 25 blindly on top of a non-zero baseline.

Completed entry baselines:

- Math 7 -> Wave A +18;
- Bahasa 6 -> Wave A +19;
- English 6 -> Wave A +19;
- Iqro 4 -> Wave A +21;
- Letters 3 -> Wave A +22;
- Logic 3 -> Wave A +22;
- Science 3 -> Wave A +22.

Next creative baseline:

- Coloring 2 -> Wave A must add **23**;
- Drawing 0 -> Wave A may add 25 only after first-class ownership/evidence architecture is in place.

## Production closure rule

No batch is production-closed until:

- target counts and unique-ID/content/evidence contracts pass automated gates;
- required migrations are applied to canonical Supabase;
- live DB counts match repository contracts;
- advisor changes are reviewed;
- PR is merged to `main`;
- final `main` CI is green;
- exact-SHA Cloudflare production smoke succeeds;
- canonical handoff/coverage/deployment docs are synchronized;
- remaining limitations are documented explicitly.

Iqro engineering closure remains separate from expert approval. Generic Latin tracing remains separate from objectively measured handwriting accuracy. Creative-practice completion remains separate from academic mastery.
