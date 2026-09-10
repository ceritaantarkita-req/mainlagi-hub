# Mainlagi Expansion Batch 7 — Math to 100 Closure

Closed: 10 September 2026

## Decision

Expansion Batch 7 is production-complete. Canonical Math now contains exactly **100 meaningfully distinct playable activities**. The expansion landed through four separately reviewed waves rather than one giant 100-activity change.

Canonical final implementation SHA:

`82acd7d39c6cab98f38c92e4f6d7be6afe52cdcd`

Canonical production Supabase project ref:

`estvtgflwkebomsqlolv`

## Wave history

| Wave | Math target | PR | Migration | Squash/main SHA | Production gate |
| --- | ---: | ---: | --- | --- | --- |
| A | 25 | #39 | `0015_batch7_math_wave_a` | `94c21cf84bc809272c93d997b1e994abfc8e9bbb` | exact-SHA smoke success, main CI #214 |
| B | 50 | #40 | `0016_batch7_math_wave_b` | `3c2be1bac0c5f15c559bc3f5a4ab099f4fedf53f` | exact-SHA smoke success, main CI #216 |
| C | 75 | #41 | `0017_batch7_math_wave_c` | `add22b874174ebbb797461f9a0b8c52fe60f9250` | exact-SHA smoke success, main CI #218 |
| D | 100 | #42 | `0018_batch7_math_wave_d` | `82acd7d39c6cab98f38c92e4f6d7be6afe52cdcd` | exact-SHA smoke success, main CI #220 |

Wave D PR CI #219 also completed successfully before merge. PR production smoke was correctly skipped because the workflow only performs production smoke for pushes to `main`.

## Final catalog state

Repository and live database closure counts agree:

- 8 first-class subjects;
- 127 playable activities globally;
- Math: exactly 100 playable activities;
- 120 assessed activities;
- 7 practice activities;
- 14 stages;
- 8 learning paths;
- 34 lessons;
- 34 versioned content packs;
- 37 skills.

Final runtime inventory:

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 91 |
| `listen_and_choose` | 5 |
| `matching` | 23 |
| `trace` | 2 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 2 |

The seven historical Math activities remain intact. Batch 7 adds exactly 93 Math activity IDs: Wave A adds 18 because the existing seven activities count toward the 1–25 target, then Waves B, C, and D add 25 each.

## Curriculum coverage

Batch 7 covers the planned progression:

- Wave A: numeral recognition, counting, number/quantity matching, and early quantity intuition;
- Wave B: quantity comparison, number ordering, shapes/properties, and patterns;
- Wave C: missing numbers, grouping, addition/subtraction within 10, and size/length comparison;
- Wave D: spatial position, measurement intuition, mixed operations, visual problems, and integrated review/challenge.

All Batch 7 additions reuse supported touch-first `tap_choice` and `matching` runtimes. No camera dependency was introduced for core Math progression.

## Evidence integrity

All 93 Batch 7 Math additions are assessed only through existing measured evidence contracts:

- `choice_accuracy_v1` for tap-choice activities;
- `matching_accuracy_v1` for matching activities.

Batch 7 does not weaken the existing evidence boundaries. Practice/completion-only activities elsewhere remain unable to manufacture academic mastery. Measured zero-score attempts remain evidence with accuracy `0`, missing measurement still fails closed, and existing mastery anti-farming rules remain unchanged.

The existing `letters-trace-a` boundary is unchanged: it remains completion-only practice until letter-shape trace fidelity is explicitly validated.

## Database closure

Canonical Supabase has the complete migration chain through:

- `0015_batch7_math_wave_a`;
- `0016_batch7_math_wave_b`;
- `0017_batch7_math_wave_c`;
- `0018_batch7_math_wave_d`.

Post-`0018` live verification returned:

```text
active activities: 127
Math activities:   100
assessed:           120
practice:             7
active skills:       37
active packs:        34
```

The Batch 7 migrations are additive/idempotent catalog upserts. They do not rename or delete historical activity identities or destructively remove learning-attempt, mastery, progress, game-session, or game-score history.

## Advisor state

Post-`0018` performance advisor reports no WARN-level regression. It reports 19 INFO-level unused-index observations.

Security advisor remains at the known pre-existing warnings:

1. authenticated execution of the protected SECURITY DEFINER `public.record_learning_attempt(...)`, intentional for the canonical authenticated attempt RPC and still bounded by ownership/catalog/anti-farming controls;
2. leaked-password protection disabled, an existing Supabase plan/configuration limitation rather than a Batch 7 regression.

No new security warning was introduced by the Math expansion migrations.

## CI and production evidence

Final main CI run #220 succeeded for:

- `Quality gate (Ubuntu)` including learning tests and simulations;
- `Windows compatibility`;
- `Mobile route QA (Chromium)`;
- `Production build`;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)`.

The final production smoke verified exact SHA `82acd7d39c6cab98f38c92e4f6d7be6afe52cdcd`, branch `main`, canonical public site, Supabase backend, and project ref `estvtgflwkebomsqlolv`.

Automated evidence does not replace later physical-device accessibility/audio/camera/trace acceptance; that broader device work remains scheduled for Batch 16.

## Closure criteria

Batch 7 is closed because all required gates are satisfied:

- [x] four reviewable waves instead of one giant unreviewed change;
- [x] Math reaches exactly 100 real playable activities;
- [x] stable historical IDs preserved;
- [x] canonical hierarchy ownership remains complete;
- [x] measured evidence contracts preserved;
- [x] migrations `0015`–`0018` applied to canonical Supabase;
- [x] live DB counts match repository expectations;
- [x] post-DDL advisors reviewed with no new Batch 7 regression;
- [x] PR CI succeeded for the final wave;
- [x] final implementation squash merge completed;
- [x] final exact-SHA Cloudflare production smoke succeeded.

## Next stage

The next planned expansion stage is **Batch 8 — Bahasa Indonesia to 100**, again using reviewable 25-activity wave boundaries and the same evidence/content-integrity gates.
