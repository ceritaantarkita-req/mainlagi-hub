# Mainlagi Expansion Batch 8 — Bahasa Indonesia to 100 Closure

Closed: 10 September 2026

## Decision

Expansion Batch 8 is production-complete. Canonical Bahasa Indonesia now contains exactly **100 meaningfully distinct playable activities**. The subject expanded from six historical activities through four separately reviewed and production-gated waves.

Canonical final implementation SHA:

`9347f2a6e1e7d27448d0d7f7a7a0c45408b0db2e`

Canonical production Supabase project ref:

`estvtgflwkebomsqlolv`

## Wave history

| Wave | Bahasa target | New activities | PR | Migration | Squash/main SHA | Production gate |
| --- | ---: | ---: | ---: | --- | --- | --- |
| A | 25 | 19 | #44 | `0019_batch8_bahasa_wave_a` | `47bf43240872bfedf4c22dacfc8d417a924411ac` | exact-SHA smoke success, main CI #226 |
| B | 50 | 25 | #45 | `0020_batch8_bahasa_wave_b` | `8e0654006105933830ee6637cd3169940404fbf2` | exact-SHA smoke success, main CI #229 |
| C | 75 | 25 | #46 | `0021_batch8_bahasa_wave_c` | `d84bf4929cd83d1cebf0017f4a987f04f2eeb0d2` | exact-SHA smoke success, main CI #231 |
| D | 100 | 25 | #47 | `0022_batch8_bahasa_wave_d` | `9347f2a6e1e7d27448d0d7f7a7a0c45408b0db2e` | exact-SHA smoke success, main CI #233 |

The six historical Bahasa activities remain stable. Batch 8 adds exactly **94** new Bahasa activity IDs: 19 in Wave A because the existing six count toward the 1–25 boundary, followed by 25 each in Waves B, C, and D.

## Final catalog state

Repository contracts and live database verification agree:

- 8 first-class subjects;
- 221 playable activities globally;
- Bahasa Indonesia: exactly 100 playable activities;
- Math: remains exactly 100 playable activities;
- 214 assessed activities;
- 7 practice activities;
- 18 stages;
- 8 learning paths;
- 54 lessons;
- 54 versioned content packs;
- 57 skills.

Bahasa itself closes at **99 assessed / 1 practice**. The one practice activity is the historical story activity; Batch 8 does not reclassify it merely to reach a count target.

Final runtime inventory:

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 147 |
| `listen_and_choose` | 24 |
| `matching` | 42 |
| `trace` | 2 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 2 |

## Curriculum coverage

Batch 8 covers the planned Bahasa progression:

- Wave A: vowel recognition/listening, vowel-vs-consonant classification, uppercase/lowercase matching, and initial sounds;
- Wave B: syllable recognition/blending, word/meaning matching, word listening, and picture-word matching;
- Wave C: sentence ordering, literal sentence comprehension, one-step listening instructions, vocabulary relations, and short-reading comprehension;
- Wave D: punctuation/capitalization, contextual sentence completion, vocabulary categories, listening for literal detail, and integrated short-reading comprehension/review.

The four waves add four stages, twenty lessons, twenty content packs, and twenty Bahasa skills. Core learning remains touch-first and camera-independent.

## Evidence integrity

All 94 Batch 8 additions are assessed only through existing measured runtime/evidence paths:

- tap choice -> `choice_accuracy_v1`;
- listen and choose -> measured choice evidence;
- matching -> `matching_accuracy_v1`.

Batch 8 does not weaken mastery or anti-farming boundaries. Measured all-wrong outcomes remain accuracy `0`, missing measurement still fails closed, rapid replay/retry protections remain active, and practice/completion-only activities cannot manufacture academic mastery.

The existing `letters-trace-a` completion-only boundary and Iqro expert-review requirements are unchanged.

## Database closure

Canonical Supabase has the migration chain through:

- `0019_batch8_bahasa_wave_a`;
- `0020_batch8_bahasa_wave_b`;
- `0021_batch8_bahasa_wave_c`;
- `0022_batch8_bahasa_wave_d`.

Post-`0022` live verification returned:

```text
active activities: 221
Bahasa activities: 100
Math activities:   100
assessed:           214
practice:             7
active skills:       57
active packs:        54
```

The Batch 8 migrations are additive/idempotent catalog upserts. They preserve historical activity identities and do not destructively remove learning-attempt, mastery, progress, game-session, or game-score history.

## Advisor state

Post-`0022` performance advisor reports no WARN-level regression. It reports the same 19 INFO-level unused-index observations.

Security advisor remains at the two known pre-existing warnings:

1. authenticated execution of protected SECURITY DEFINER `public.record_learning_attempt(...)`, intentional for the canonical authenticated attempt RPC and bounded by ownership/catalog/anti-farming controls;
2. leaked-password protection disabled under the current Supabase configuration/plan.

No new security warning was introduced by Batch 8.

## CI and production evidence

Each wave's post-merge `main` workflow completed successfully, including exact-SHA Cloudflare production smoke:

- Wave A — CI #226;
- Wave B — CI #229;
- Wave C — CI #231;
- Wave D — CI #233.

Final main CI #233 succeeded for:

- `Quality gate (Ubuntu)` including learning tests and simulations;
- `Windows compatibility`;
- `Mobile route QA (Chromium)`;
- `Production build`;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)`.

The final production smoke verified exact SHA `9347f2a6e1e7d27448d0d7f7a7a0c45408b0db2e`, branch `main`, canonical public deployment, Supabase backend, and project ref `estvtgflwkebomsqlolv`.

Automated evidence does not replace representative physical-device accessibility/audio/camera/trace acceptance, which remains part of Batch 16.

## Closure criteria

Batch 8 is closed because all required gates are satisfied:

- [x] four reviewable waves instead of one giant unreviewed content change;
- [x] Bahasa reaches exactly 100 real playable activities;
- [x] the six historical Bahasa IDs remain stable;
- [x] Math remains closed at exactly 100;
- [x] canonical hierarchy ownership remains complete;
- [x] all 94 additions use measured evidence paths;
- [x] migrations `0019`–`0022` are applied in canonical Supabase;
- [x] live DB counts match repository contracts;
- [x] post-DDL advisors show no new Batch 8 regression;
- [x] every wave passed post-merge CI and exact-SHA production smoke;
- [x] final Wave D release is verified in production.

## Next stage

The next planned expansion stage is **Batch 9 — English to 100**. English currently has six validated activities, so Batch 9 Wave A should add **19** meaningful activities to reach the canonical 25-activity boundary before continuing to 50, 75, and 100.
