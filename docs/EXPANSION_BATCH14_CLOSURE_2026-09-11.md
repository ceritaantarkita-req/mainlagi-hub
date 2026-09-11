# Expansion Batch 14 — Drawing/Menggambar + Coloring/Mewarnai to 100 Production Closure

Closure date: 11 September 2026

## Status

**ENGINEERING / CONTENT-CATALOG PRODUCTION CLOSED.**

Expansion Batch 14 introduces Drawing/Menggambar as a first-class track and expands Coloring/Mewarnai from its two historical activities to exactly **100 playable activities each**. All four implementation waves are merged to `main`, migrations `0043`–`0046` are live in canonical Supabase, live database counts match repository contracts, and each wave passed exact-SHA Cloudflare production smoke.

Final implementation SHA: `b273edc282261bbec89b0c3d438822204cd925e5`.

Final implementation PR: #76.

Final implementation main CI: #308 — success, including exact-SHA `Production smoke (Cloudflare)`.

## Entry and final catalog state

Batch 14 entered from the Batch 13 production baseline:

- 702 playable activities globally;
- 683 assessed / 19 practice;
- 8 first-class subjects / 8 paths;
- Drawing 0;
- Coloring 2 historical practice activities.

Live canonical Supabase verification after Wave D:

- **900 active playable activities** globally;
- **683 assessed / 217 practice** globally;
- **Drawing exactly 100 = 0 assessed / 100 practice**;
- **Coloring exactly 100 = 0 assessed / 100 practice**;
- 9 first-class subjects / 9 learning paths;
- 46 stages;
- 197 lessons;
- 197 active content packs;
- 200 active learning skills;
- 20 active Drawing skills;
- 21 active Coloring skills;
- 8 reusable manifest mechanics;
- zero active creative activities with assessed/non-completion evidence drift;
- zero Drawing runtime/mechanic drift;
- zero Coloring runtime/mechanic drift;
- 50 Wave D activity-skill links.

All nine planned tracks are now exactly 100 activities. The planned 900-activity catalog target is complete.

## Batch 14 inventory

Batch 14 adds exactly **198 creative-practice activities**: Drawing 100 + Coloring 98. The two historical Coloring activities remain preserved, bringing Coloring to 100.

Canonical generated wave counts are `48 + 50 + 50 + 50`.

| Wave | Drawing count | Coloring count | New activities | Primary scope | PR | Migration | Final PR head | Main SHA | PR CI | Main CI |
| --- | ---: | ---: | ---: | --- | ---: | --- | --- | --- | ---: | ---: |
| A | 25 | 25 | 48 | Drawing first-class foundation; lines, curves, paths, shapes, connect-dots; simple Coloring/color exploration | #73 | `0043_batch14_creative_wave_a.sql` | `b168191e16b14c1180c4475542cf9136a35e393b` | `f27ea5b047e657e896d991656bfe64cdb215c84e` | #300 | #301 |
| B | 50 | 50 | 50 | objects from shapes, animals, nature, faces/scenes; warm/cool play, patterns, scenes, vehicles, fantasy | #74 | `0044_batch14_creative_wave_b.sql` | `09947cc7fd0ec826eeb785453baf504dd463dc80` | `62e88a5f696d2b4eb2e691298671e137e91caa30` | #303 | #304 |
| C | 75 | 75 | 50 | space/layers, textures, exploratory two-side balance, story sequence, inventions; palette relationships, contrast, mood, materials, story scenes | #75 | `0045_batch14_creative_wave_c.sql` | `44598c27bc68b0cca701826a444cb30c2114172f` | `e120d1fa098ff9f1a7949ba3d1ffa0dee00d312c` | #305 | #306 |
| D | 100 | 100 | 50 | composition/focus, character design, maps/worlds, visual design, open drawing studio; limited palettes, time/season, character palettes, scene storytelling, open color studio | #76 | `0046_batch14_creative_wave_d.sql` | `45cbea6b858cd18b4000c136e72f3af0dee62c48` | `b273edc282261bbec89b0c3d438822204cd925e5` | #307 | #308 |

All four post-merge main runs passed exact-SHA Cloudflare production smoke.

## Creative evidence boundary

Every Batch 14 generated activity uses:

```text
assessment: practice
evidence contract: completion_only_v1
```

Drawing activities use the `drawing` runtime/mechanic. Coloring activities use the `coloring` runtime/mechanic.

This is an intentional integrity boundary. Completion can support participation history and product reporting, but it does **not** establish drawing accuracy, coloring quality, creative proficiency, academic mastery, stage mastery, or certificate qualification. A future objectively assessed creative task must introduce a separately validated evaluator and evidence contract before it can influence mastery.

Creative skill links use sub-assessed weights (Drawing 0.4; Coloring 0.3 in the production migration mapping) and do not override the completion-only assessment classification.

## Drawing first-class foundation

Wave A did more than add content. It introduced Drawing into the canonical learning ownership/runtime system, including:

- Drawing as a first-class subject/path;
- a dedicated `drawing` runtime/mechanic;
- playable touch-canvas support;
- Drawing world/stage navigation;
- content-pack/lesson/skill ownership;
- mobile-route coverage;
- database vocabulary support for the Drawing subject/mechanic.

This established the foundation used by Waves B–D without creating a parallel learning model.

## Production migration state

Canonical Supabase project: `estvtgflwkebomsqlolv` (`mainlagi-hub`, Singapore / `ap-southeast-1`). Applied Batch 14 registry entries:

```text
batch14_creative_wave_a
batch14_creative_wave_b
batch14_creative_wave_c
batch14_creative_wave_d
```

Repository migrations:

```text
0043_batch14_creative_wave_a.sql
0044_batch14_creative_wave_b.sql
0045_batch14_creative_wave_c.sql
0046_batch14_creative_wave_d.sql
```

All are additive/idempotent catalog changes and preserve historical attempts, progress, scores, profiles, achievements, certificates, and mastery identities.

## Runtime inventory after Batch 14

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 481 |
| `listen_and_choose` | 76 |
| `matching` | 125 |
| `trace` | 14 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 100 |
| `drawing` | 100 |

Total: **900**.

## CI and regression evidence

Every implementation wave passed the repository's full PR quality gates before its migration was applied. Final Wave D PR CI #307 and main CI #308 cover:

- repository/source/asset validation;
- TypeScript typecheck;
- ESLint;
- engine and learning tests;
- content-architecture and migration-ID contracts;
- mastery/anti-farming/adaptive/ownership/outbox/award/report regressions;
- simulations;
- Windows compatibility;
- Chromium mobile-route QA;
- production dependency audit;
- full-history secret scan;
- OpenNext/Cloudflare production build;
- exact-SHA public production smoke on `main`.

Wave B had one pre-production CI failure caused by a regression test checking `evidenceContractId` on the learning-spec object, where that field is not exposed. The test was corrected to verify the canonical content-pack evidence contract instead. The rerun (#303) was fully green before migration `0044` was applied; no production repair migration was required.

## Post-DDL advisor state

Final advisor review after `0046`:

- security advisor: exactly two known WARN findings remain:
  - authenticated execution of `SECURITY DEFINER` `public.record_learning_attempt(...)`; this is intentional for the guarded attempt-recording RPC boundary;
  - leaked-password protection disabled under the current Supabase configuration/plan;
- performance advisor: **17 `unused_index` INFO findings**, with no WARN-level performance regression;
- no new Batch 14 security/performance WARN was introduced.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Preserved integrity boundaries

The following boundaries remain unchanged by Batch 14:

- all active Iqro packs remain `expert_required`; engineering/catalog closure is not competent human religious-learning approval;
- the 22 `EXPERT_REVIEW_REQUIRED` content-architecture warnings remain intentional;
- generic Latin tracing remains completion-only practice and is not evidence of handwriting-shape accuracy/mastery;
- assessed mastery continues to require qualifying measured evidence and anti-farming rules;
- measured all-wrong interactions remain accuracy `0` evidence;
- missing measurement fails closed;
- Science remains age-appropriate and does not require unsafe unsupervised experiments;
- account-owned child isolation and durable authenticated attempt outbox behavior remain intact.

## Repository protection observation

The active `Protect main` ruleset requires:

- `Production build`;
- `Quality gate (Ubuntu)`;
- `Windows compatibility`;
- `Production dependency audit`.

`Secret history scan` runs and passed every Batch 14 release pipeline, but it is not currently configured as a required status check. Adding it remains a manual account-level action because ruleset administration writes are not exposed through the connected GitHub API surface. See `ACCOUNT_LEVEL_ACTIONS.md`.

## Remaining product boundaries

Automated CI does not replace representative physical-device camera/audio/trace/accessibility/touch-canvas acceptance. These remain part of Batch 16.

Batch 14 completion does not mean all product engineering is complete; it closes the planned **catalog expansion target**.

## Next stage

**Batch 15 — Adaptive/mastery/report scaling** is next.

The next work should optimize recommendations, remediation diversity, confidence/evidence spacing, and Parent reporting over the full 900-activity catalog while preserving the distinction between measured academic evidence and completion-only creative practice.
