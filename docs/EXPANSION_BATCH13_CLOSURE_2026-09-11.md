# Expansion Batch 13 — Science/Sains to 100 Production Closure

Closure date: 11 September 2026

## Status

**ENGINEERING / CONTENT-CATALOG PRODUCTION CLOSED.**

Expansion Batch 13 raises Science/Sains from the three validated historical activities to exactly **100 playable activities**. All four implementation waves are merged to `main`, migrations `0039`–`0042` are live in canonical Supabase, live database counts match repository contracts, and each wave passed exact-SHA Cloudflare production smoke.

Final implementation SHA: `e35d211ada182e0c5379da7b9b33614309994852`.

Final implementation PR: #71.

Final implementation main CI: #290 — success, including exact-SHA `Production smoke (Cloudflare)`.

## Final catalog state

Live canonical Supabase verification after Wave D:

- **702 active playable activities** globally;
- **683 assessed / 19 practice** globally;
- **Science/Sains exactly 100 = 100 assessed / 0 practice**;
- 38 stages;
- 8 learning paths;
- 157 lessons;
- 157 active content packs;
- 160 active learning skills;
- 22 active Science skills;
- 25 Wave D activity-skill links;
- zero active Science activities missing mechanic/evidence metadata.

Seven academic subjects are now at the canonical 100-activity target: Math, Bahasa Indonesia, English, Iqro, Letters/Menulis, Logic/Logika, and Science/Sains. Coloring/Mewarnai remains at 2 and Drawing/Menggambar is not first-class yet.

## Batch 13 inventory

Science entered Batch 13 with three historical assessed activities. Batch 13 adds exactly **97 measured assessed activities** and no practice-only additions.

| Wave | Science count | New | Primary scope | PR | Migration | Main SHA | Main CI |
| --- | ---: | ---: | --- | ---: | --- | --- | ---: |
| A | 25 | 22 | living/non-living, plant basics, animal features/habitats, senses/observation, weather/day-night | #68 | `0039_batch13_science_wave_a.sql` | `296b8c69513d5577233a8a777062741fd83163c9` | #283 |
| B | 50 | 25 | life cycles, organism needs/food, material properties, water state changes, forces/motion | #69 | `0040_batch13_science_wave_b.sql` | `92f6767ee3015fb7e160adb0cd8ce85309676eb9` | #285 |
| C | 75 | 25 | Earth/sky patterns, body/healthy habits, ecosystem dependencies, environment care, observation/measurement | #70 | `0041_batch13_science_wave_c.sql` | `1c956867fd912bfea25c7cb0105a97921299cf80` | #287 |
| D | 100 | 25 | investigation/evidence, living features/functions, material selection, weather/environment reasoning, mixed Science review | #71 | `0042_batch13_science_wave_d.sql` | `e35d211ada182e0c5379da7b9b33614309994852` | #290 |

All four post-merge runs passed exact-SHA Cloudflare production smoke.

## Evidence and safety boundary

Every Batch 13 addition uses existing measured `tap_choice` / `matching` evidence contracts (`choice_accuracy_v1` / `matching_accuracy_v1`). Science mastery is therefore based on measurable response evidence rather than completion-only participation.

The content remains age-appropriate and avoids relying on unsafe unsupervised experiments. Where investigation is represented, the assessed interaction is a simple prediction, observation, comparison, tool/use relation, or evidence choice supported by the current runtime.

Existing mastery and anti-farming rules remain unchanged: cumulative evidence is required, rapid/trivial replay cannot accelerate mastery, excessive retries do not qualify, measured zero remains weak evidence, and missing measurement fails closed.

## Production migration state

Canonical Supabase project: `estvtgflwkebomsqlolv` (`mainlagi-hub`, Singapore / `ap-southeast-1`). Applied Batch 13 registry entries:

```text
batch13_science_wave_a
batch13_science_wave_b
batch13_science_wave_c
batch13_science_wave_d
```

The repository migrations are:

```text
0039_batch13_science_wave_a.sql
0040_batch13_science_wave_b.sql
0041_batch13_science_wave_c.sql
0042_batch13_science_wave_d.sql
```

All are additive/idempotent catalog changes and preserve historical attempts, progress, scores, and mastery identities.

## Runtime inventory after Batch 13

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 481 |
| `listen_and_choose` | 76 |
| `matching` | 125 |
| `trace` | 14 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 2 |

Total: **702**.

## CI and regression evidence

Final Wave D PR CI and final main CI cover source/structure/asset validation, TypeScript, ESLint, engine/learning tests, content-architecture and DB contracts, adaptive/mastery/ownership/outbox/reporting regressions, simulations, Windows compatibility, Chromium mobile-route QA, dependency audit, full-history secret scan, OpenNext/Cloudflare production build, and exact-SHA public production smoke.

Wave D initially failed typecheck because five source authoring skill definitions included an `active` field that is not part of `LearningSkillDefinition`. The source-only field was removed without changing skill IDs, migration payloads, evidence contracts, or target counts. PR CI reran fully green before migration `0042` was applied, so no destructive production correction was required.

## Post-DDL advisor state

After Batch 13 Wave D:

- performance advisor: no WARN-level regression; 18 `unused_index` observations remain INFO-only;
- security advisor: the two existing WARN findings remain:
  - authenticated execution of protected `SECURITY DEFINER` function `public.record_learning_attempt(...)`;
  - Supabase leaked-password protection disabled under the current configuration/plan;
- no new Batch 13 security/performance warning was introduced.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Remaining boundaries

Iqro engineering/catalog completion remains separate from competent human religious-learning approval; all active Iqro packs remain `expert_required`.

Generic Latin tracing remains completion-only practice and is not evidence of handwriting shape accuracy/mastery.

Automated CI does not replace representative physical-device camera/audio/trace/accessibility acceptance. The existing account-level action to ensure `Secret history scan` is required by the active `main` protection ruleset remains outside current connector write capability; the scan itself is green.

## Next stage

With all seven academic subjects at 100, the next planned content expansion is **Batch 14 — Drawing/Menggambar and Coloring/Mewarnai to 100 each**, under creative-practice evidence rules and without fabricating academic mastery from free-form participation.
