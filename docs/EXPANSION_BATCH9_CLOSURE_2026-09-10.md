# Mainlagi Expansion Batch 9 — English to 100 Closure

Closed: 10 September 2026

## Decision

Expansion Batch 9 is production-complete. Canonical English now contains exactly **100 meaningfully distinct playable activities**. The subject expanded from six historical activities through four separately reviewed and production-gated waves while preserving historical activity identities and evidence boundaries.

Canonical final implementation SHA:

`cc9430e1d3543de809b26a47d3dd16cad3803897`

Canonical production Supabase project ref:

`estvtgflwkebomsqlolv`

## Wave history

| Wave | English target | New activities | PR | Migration | Squash/main SHA | Production gate |
| --- | ---: | ---: | ---: | --- | --- | --- |
| A | 25 | 19 | #49 | `0023_batch9_english_wave_a` | `eb4181df311011eb7724cfcef1565c50ab966120` | exact-SHA smoke success, main CI #237 |
| B | 50 | 25 | #50 | `0024_batch9_english_wave_b` | `3dd380f736c3821546e531da2b82593d39519271` | exact-SHA smoke success, main CI #239 |
| C | 75 | 25 | #51 | `0025_batch9_english_wave_c` | `4096e68cb6916d7fedd0cf37896a67f6153edd30` | exact-SHA smoke success, main CI #243 |
| D | 100 | 25 | #52 | `0026_batch9_english_wave_d` | `cc9430e1d3543de809b26a47d3dd16cad3803897` | exact-SHA smoke success, main CI #245 |

The six historical English activities remain stable. Batch 9 adds exactly **94** new English activity IDs: 19 in Wave A because the existing six count toward the 1–25 boundary, followed by 25 each in Waves B, C, and D.

## Final catalog state

Repository contracts and live database verification agree:

- 8 first-class subjects;
- 315 playable activities globally;
- English: exactly 100 playable activities;
- Bahasa Indonesia: remains exactly 100 playable activities;
- Math: remains exactly 100 playable activities;
- 308 assessed activities;
- 7 practice activities;
- 22 stages;
- 8 learning paths;
- 74 lessons;
- 74 versioned content packs;
- 77 skills.

English itself closes at **100 assessed / 0 practice**. Batch 9 does not fabricate practice or reclassify historical activities merely to satisfy the count target.

Final runtime inventory:

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 194 |
| `listen_and_choose` | 48 |
| `matching` | 65 |
| `trace` | 2 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 2 |

The runtime total is 315 and matches the canonical playable catalog total.

## Curriculum coverage

Batch 9 covers the planned English progression:

- Wave A: alphabet recognition/listening, basic initial-sound awareness, colors, and numbers one to five;
- Wave B: animals, everyday objects, body vocabulary, and family vocabulary;
- Wave C: food, actions, semantic categories, expanded word-picture matching, and listening identification;
- Wave D: opposites, literal short phrases, simple sentence completion, listening for sentence detail, and integrated English review.

The four waves add four English stages, twenty lessons, twenty content packs, and twenty English skills. English now has 23 mapped skills in total: three historical skills plus twenty Batch 9 skills. Core learning remains touch-first and camera-independent.

## Evidence integrity

All 94 Batch 9 additions are assessed only through existing measured runtime/evidence paths:

- tap choice -> `choice_accuracy_v1`;
- listen and choose -> measured choice evidence;
- matching -> `matching_accuracy_v1`.

Final live verification returned 100 English activity-skill links and zero active English activities missing mechanic or evidence-contract metadata.

Batch 9 does not weaken mastery or anti-farming boundaries. Measured all-wrong outcomes remain accuracy `0`, missing measurement still fails closed, rapid replay/retry protections remain active, and completion-only practice cannot manufacture academic mastery.

The existing conservative trace boundaries and Iqro expert-review requirements remain unchanged.

## Wave C collision caught before production

The first Wave C PR CI run correctly rejected a duplicate new skill identifier, `english.word.picture_matching`, because that identity already belonged to the historical catalog. No Wave C migration or merge was performed while that failure existed.

The new Wave C skill was renamed to `english.word.picture_matching.expanded`, with its activity mappings and migration corrected consistently. The following CI run passed, and live verification after migration confirmed both the historical and expanded skill identities exist as separate records. This preserved learning history rather than overwriting an existing skill identity.

## Database closure

Canonical Supabase has the Batch 9 migration chain through:

- `0023_batch9_english_wave_a`;
- `0024_batch9_english_wave_b`;
- `0025_batch9_english_wave_c`;
- `0026_batch9_english_wave_d`.

Post-`0026` live verification returned:

```text
active activities:              315
English activities:             100
English assessed:               100
English practice:                 0
global assessed:                308
global practice:                  7
active skills:                   77
active packs:                    74
English activity-skill links:   100
English missing evidence meta:    0
```

The Batch 9 migrations are additive/idempotent catalog upserts. They preserve historical activity identities and do not destructively remove learning-attempt, mastery, progress, game-session, or game-score history.

## Advisor state

Post-`0026` performance advisor reports **no WARN-level regression**. It currently reports 18 INFO-level unused-index observations only.

Security advisor remains at the two known warnings:

1. authenticated execution of protected SECURITY DEFINER `public.record_learning_attempt(...)`, intentional for the canonical authenticated attempt RPC and bounded by ownership/catalog/anti-farming controls;
2. leaked-password protection disabled under the current Supabase configuration/plan.

No new Batch 9 security warning was introduced.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## CI and production evidence

Each wave's post-merge `main` workflow completed successfully, including exact-SHA Cloudflare production smoke:

- Wave A — CI #237, SHA `eb4181df311011eb7724cfcef1565c50ab966120`;
- Wave B — CI #239, SHA `3dd380f736c3821546e531da2b82593d39519271`;
- Wave C — CI #243, SHA `4096e68cb6916d7fedd0cf37896a67f6153edd30`;
- Wave D — CI #245, SHA `cc9430e1d3543de809b26a47d3dd16cad3803897`.

Final main CI #245 succeeded for:

- `Quality gate (Ubuntu)` including learning tests and simulations;
- `Windows compatibility`;
- `Mobile route QA (Chromium)`;
- `Production build`;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)`.

The final production smoke verified the exact Wave D implementation release on branch `main` against the canonical public Cloudflare deployment and Supabase backend/project ref.

Automated evidence does not replace representative physical-device accessibility/audio/camera/trace acceptance, which remains part of Batch 16.

## Closure criteria

Batch 9 is closed because all required implementation gates are satisfied:

- [x] four reviewable waves instead of one giant unreviewed content change;
- [x] English reaches exactly 100 real playable activities;
- [x] the six historical English IDs remain stable;
- [x] Math and Bahasa Indonesia remain closed at exactly 100 each;
- [x] canonical hierarchy ownership remains complete;
- [x] all 94 additions use measured evidence paths;
- [x] migrations `0023`–`0026` are applied in canonical Supabase;
- [x] live DB counts match repository contracts;
- [x] duplicate historical skill identity was caught and corrected before Wave C production release;
- [x] post-DDL advisors show no new Batch 9 regression;
- [x] every wave passed post-merge CI and exact-SHA production smoke;
- [x] final Wave D release is verified in production.

## Next stage

The next planned expansion stage is **Batch 10 — Iqro to 100**. Iqro currently has four validated activities, so Batch 10 Wave A must add **21** meaningful activities to reach the canonical 25-activity boundary before continuing to 50, 75, and 100.

Iqro content/audio review states remain explicit. Code, database, CI, and production deployment success do not equal expert religious-learning approval, and assessed tracing remains blocked unless measurement fidelity is explicitly validated.
