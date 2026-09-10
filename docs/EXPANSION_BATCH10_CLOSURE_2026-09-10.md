# Mainlagi Expansion Batch 10 — Iqro to 100 Closure

Closed: 10 September 2026

## Decision

Expansion Batch 10 is **engineering/content-catalog production-complete**. Canonical Iqro now contains exactly **100 meaningfully distinct playable activities** while preserving the four historical Iqro activity identities and existing learning-evidence boundaries.

This closure is **not** a claim of expert religious-learning approval. Every Iqro content pack remains `expert_required`; code review, automated tests, database verification, and production deployment do not replace review by a competent Iqro/religious-learning expert.

Canonical final implementation SHA:

`e927e3e283b3c15fb97239c9ce013ef6121d3947`

Canonical production Supabase project ref:

`estvtgflwkebomsqlolv`

## Wave history

| Wave | Iqro target | New activities | PR | Migration | Squash/main SHA | Production gate |
| --- | ---: | ---: | ---: | --- | --- | --- |
| A | 25 | 21 | #54 | `0027_batch10_iqro_wave_a` | `75152bcf5d930c5a0f072e77a2679ca1c9edef73` | exact-SHA smoke success, main CI #250 |
| B | 50 | 25 | #55 | `0028_batch10_iqro_wave_b` | `074026b1c8b62a5a63b3004e6d591c820dd3ec5d` | exact-SHA smoke success, main CI #252 |
| C | 75 | 25 | #56 | `0029_batch10_iqro_wave_c` | `dc367d2fa712c3ec793d6161d8fdde434197a17b` | exact-SHA smoke success, main CI #254 |
| D | 100 | 25 | #57 | `0030_batch10_iqro_wave_d` | `e927e3e283b3c15fb97239c9ce013ef6121d3947` | exact-SHA smoke success, main CI #256 |

The four historical Iqro activities remain stable. Batch 10 adds exactly **96** new activity IDs: 21 in Wave A because the existing four count toward the 1–25 boundary, followed by 25 each in Waves B, C, and D.

## Final catalog state

Repository contracts and live database verification agree:

- 8 first-class subjects;
- 411 playable activities globally;
- Math: exactly 100;
- Bahasa Indonesia: exactly 100;
- English: exactly 100;
- Iqro: exactly 100;
- 404 assessed activities;
- 7 practice activities;
- 26 stages;
- 8 learning paths;
- 94 lessons;
- 94 versioned content packs;
- 97 skills.

Iqro itself closes at **99 assessed / 1 historical practice**. Batch 10 does not reclassify the historical practice activity merely to reach the target.

Final runtime inventory:

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 251 |
| `listen_and_choose` | 76 |
| `matching` | 76 |
| `trace` | 2 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 2 |

The runtime total is 411 and matches the canonical playable catalog total.

## Curriculum coverage

Batch 10 expands Iqro through four bounded stages while keeping content in an explicit human-review state:

- Wave A: early Hijaiyah visual recognition and discrimination for Ba, Ta, Tsa, Jim, Ha, Kha; listening, dot-count awareness, and name/form matching;
- Wave B: Dal/Dzal, Ra/Zai, Sin/Syin recognition, listening, dot awareness, name/form matching, and family discrimination;
- Wave C: Shad, Dhad, Tha, Zha, Ain, Ghain, Fa, and Qaf through recognition, listening, dot features, name/form matching, and family discrimination;
- Wave D: Kaf, Lam, Mim, Nun, Ha besar, Wawu, Ya, standalone Hamzah, plus integrated review.

The 96 additions are not cosmetic shuffles. They represent distinct learning objectives/content groupings across recognition, listening, visual-feature discrimination, matching, and integrated review.

## Hijaiyah registry integrity

Batch 10 authoring metadata mirrors the canonical engine registry in `src/lib/engine/hijaiyah.ts`.

Automated architecture tests enforce parity for **29 registry entries**: the canonical 28 Hijaiyah letters plus the standalone Hamzah template. The gate checks:

- glyph;
- canonical Latin label;
- dot count;
- dot-zone metadata.

This prevents the expansion catalog from silently drifting away from the runtime Hijaiyah registry.

## Evidence integrity

All **96 Batch 10 additions** are assessed only through existing measured paths:

- tap choice -> `choice_accuracy_v1`;
- listen and choose -> measured choice evidence;
- matching -> `matching_accuracy_v1`.

No new generic trace is classified as assessed. Existing generic tracing remains conservative/completion-only unless shape-fidelity measurement is explicitly validated.

Final live verification returned:

- 100 Iqro activity-skill links;
- zero active Iqro activities missing mechanic/evidence-contract metadata;
- 99 Iqro assessed activities;
- 1 historical Iqro practice activity.

Mastery and anti-farming controls remain unchanged: measured zero-score attempts remain evidence with accuracy `0`, missing measurement fails closed, rapid replays/retry-heavy attempts do not qualify for mastery farming, and completion-only practice cannot manufacture assessed mastery.

## Expert-review boundary

All **22 active Iqro packs** are `expert_required` after Batch 10. They are not marked `expert_approved`.

Therefore this closure means:

- catalog implementation complete;
- migration/data registration complete;
- automated architecture/evidence checks complete;
- production deployment verified;
- **formal expert review still remains a separate human-content requirement**.

In particular, audio labels/pronunciation and pedagogical sequencing must not be represented as expert-approved until a competent reviewer explicitly approves them.

## Database closure

Canonical Supabase contains the complete Batch 10 migration chain:

- `0027_batch10_iqro_wave_a`;
- `0028_batch10_iqro_wave_b`;
- `0029_batch10_iqro_wave_c`;
- `0030_batch10_iqro_wave_d`.

Post-`0030` live verification returned:

```text
active activities:                411
Iqro activities:                  100
Iqro assessed:                     99
Iqro practice:                      1
global assessed:                  404
global practice:                    7
active skills:                     97
active packs:                      94
Iqro expert_required packs:        22
Iqro activity-skill links:        100
Iqro missing evidence metadata:     0
```

The migrations are additive/idempotent catalog upserts. They preserve historical learning identities and do not destructively remove attempt, mastery, progress, game-session, or game-score history.

## Advisor state

Post-`0030` performance advisor reports **no WARN-level regression**. It reports 18 INFO-level `unused_index` observations only.

Security advisor remains at the two known warnings:

1. authenticated execution of protected SECURITY DEFINER `public.record_learning_attempt(...)`, intentional for the canonical authenticated attempt RPC and bounded by ownership/catalog/anti-farming controls;
2. leaked-password protection disabled under the current Supabase configuration/plan.

No new Batch 10 security warning was introduced.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## CI and production evidence

Each wave's post-merge `main` workflow completed successfully, including exact-SHA Cloudflare production smoke:

- Wave A — CI #250, SHA `75152bcf5d930c5a0f072e77a2679ca1c9edef73`;
- Wave B — CI #252, SHA `074026b1c8b62a5a63b3004e6d591c820dd3ec5d`;
- Wave C — CI #254, SHA `dc367d2fa712c3ec793d6161d8fdde434197a17b`;
- Wave D — CI #256, SHA `e927e3e283b3c15fb97239c9ce013ef6121d3947`.

Final main CI #256 succeeded for Ubuntu quality/learning/simulations, Windows compatibility, Chromium mobile-route QA, production build, dependency audit, full-history secret scan, and exact-SHA Cloudflare production smoke.

Automated evidence does not replace representative physical-device accessibility/audio/camera/trace acceptance, which remains scheduled for Batch 16.

## Closure criteria

- [x] four reviewable waves instead of one giant content change;
- [x] Iqro reaches exactly 100 real playable activities;
- [x] four historical Iqro activity IDs remain stable;
- [x] Batch 10 adds exactly 96 unique activities (`21 + 25 + 25 + 25`);
- [x] all 96 additions use measured evidence paths;
- [x] no new generic trace is promoted to assessed;
- [x] canonical Hijaiyah metadata parity is automatically tested;
- [x] every Iqro pack remains `expert_required`;
- [x] migrations `0027`–`0030` are applied in canonical Supabase;
- [x] live DB counts match repository contracts;
- [x] post-DDL advisors show no new Batch 10 regression;
- [x] every wave passed post-merge CI and exact-SHA production smoke;
- [x] final Wave D implementation is verified in production;
- [ ] expert religious-learning approval — deliberately **not claimed** by this engineering closure.

## Next stage

The next expansion stage is **Batch 11 — Letters/Menulis to 100**.

Letters currently has three validated activities, so Batch 11 Wave A must add **22 meaningful activities** to reach the canonical 25-activity boundary. The existing `letters-trace-a` remains completion-only practice until letter-shape fidelity is explicitly implemented and validated; Batch 11 must not promote generic trace completion into assessed writing mastery.