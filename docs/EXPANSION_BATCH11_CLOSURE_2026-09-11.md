# Expansion Batch 11 — Letters/Menulis to 100 Production Closure

Closure date: 11 September 2026

## Status

**ENGINEERING / CONTENT-CATALOG PRODUCTION CLOSED.**

Expansion Batch 11 raises Letters/Menulis from the three validated historical activities to exactly **100 playable activities**. All four implementation waves are merged to `main`, their additive catalog migrations are live in canonical Supabase, live database counts match repository contracts, and each wave passed exact-SHA Cloudflare production smoke.

Final implementation SHA: `1ec8c69bce010424807d918a3b4655cd18b1f357`.

Final implementation PR: #62.

Final implementation main CI: #270 — success, including exact-SHA `Production smoke (Cloudflare)`.

## Final catalog state

Live canonical Supabase verification after Wave D:

- **508 active playable activities** globally;
- **489 assessed / 19 practice** globally;
- **Letters/Menulis exactly 100 = 87 assessed / 13 practice**;
- 30 stages;
- 8 learning paths;
- 117 lessons;
- 117 active content packs;
- 120 active learning skills;
- 25 active Letters skills;
- 25 Wave D activity-skill links;
- zero active Letters activities missing mechanic/evidence metadata.

The five completed 100-activity subjects are Math, Bahasa Indonesia, English, Iqro, and Letters/Menulis. Logic and Science remain at three activities each; Coloring remains at two; Drawing is still planned rather than first-class.

## Batch 11 inventory

Letters entered Batch 11 with three historical activities: two assessed and one practice. Batch 11 adds exactly **97 meaningful activities**: **85 assessed + 12 practice**.

| Wave | Letters count | New | Assessed new | Practice new | Primary scope |
| --- | ---: | ---: | ---: | ---: | --- |
| A | 25 | 22 | 19 | 3 | B–F upper/lower recognition, case matching, visual discrimination, pre-writing strokes |
| B | 50 | 25 | 22 | 3 | G–M upper/lower recognition, case matching, sequence, discrimination, representative formation practice |
| C | 75 | 25 | 22 | 3 | N–T upper/lower recognition, case matching, sequence, discrimination, representative formation practice |
| D | 100 | 25 | 22 | 3 | U–Z upper/lower recognition, case matching, end-alphabet sequence, discrimination, representative formation practice |

The four Batch 11 waves add four stages, 23 lessons, 23 versioned content packs, and 23 skills.

## Evidence and mastery boundary

Batch 11 deliberately does **not** equate tracing completion with Latin letter-writing accuracy.

- Recognition, matching, sequencing, and visual-discrimination activities use existing measured evidence contracts such as `choice_accuracy_v1` and `matching_accuracy_v1` and can be assessed.
- Generic pre-writing/letter-formation traces remain `practice` and use `completion_only_v1`.
- Practice traces are not `required_for_stage` and cannot manufacture assessed mastery evidence.
- `letters-trace-a` keeps its historical completion-only boundary.
- No generic Latin letter trace is promoted to shape-fidelity mastery because no validated Latin letter-shape fidelity evaluator exists yet.

Existing mastery and anti-farming rules remain unchanged: cumulative evidence is required, trivial/rapid replay cannot accelerate mastery, excessive retries do not qualify, measured zero remains evidence, and missing measurement fails closed.

## Production wave evidence

| Wave | PR | Repo migration | Main SHA | Main CI | Exact-SHA smoke |
| --- | ---: | --- | --- | ---: | --- |
| A | #59 | `0031_batch11_letters_wave_a.sql` | `cb6dfb662f0f14b8c66de29db30319ea08e06644` | #261 | success |
| B | #60 | `0032_batch11_letters_wave_b.sql` | `3c3f446b70c6047236216b0b505e3f5fe9da9c88` | #263 | success |
| C | #61 | `0033_batch11_letters_wave_c.sql` | `fdd0dae049b1cd4740286dd1b1a56700d9641154` | #267 | success |
| D | #62 | `0034_batch11_letters_wave_d.sql` | `1ec8c69bce010424807d918a3b4655cd18b1f357` | #270 | success |

Canonical deployment remains GitHub `main` -> Cloudflare Git integration -> OpenNext Worker `mainlagi-hub` -> `https://mainlagihub.my.id/`. The production smoke verifies the exact main SHA plus canonical backend metadata.

## Migration state

Repository migrations introduced by Batch 11:

```text
0031_batch11_letters_wave_a.sql
0032_batch11_letters_wave_b.sql
0033_batch11_letters_wave_c.sql
0034_batch11_letters_wave_d.sql
```

The Supabase migration registry records the corresponding applied entries as `batch11_letters_wave_a` through `batch11_letters_wave_d`. All four migrations are additive/idempotent catalog changes; they do not destructively rewrite historical attempts, progress, scores, or mastery identities.

Canonical production project: `estvtgflwkebomsqlolv` (`mainlagi-hub`, Singapore / `ap-southeast-1`).

## CI and regression evidence

Final Wave D PR CI and final main CI cover:

- source/structure/asset validation;
- TypeScript typecheck and ESLint;
- engine and learning tests;
- content-architecture and DB migration contracts;
- adaptive/mastery/ownership/outbox/reporting regressions;
- simulations;
- Windows compatibility;
- Chromium mobile-route QA;
- production dependency audit;
- full-history secret scan;
- OpenNext/Cloudflare production build;
- exact-SHA public production smoke on `main`.

Final automated contracts lock 508 global activities, 489 assessed / 19 practice, Letters 100 = 87 assessed / 13 practice, 30 stages, 117 lessons/packs, 120 skills, four Batch 11 wave counts `22 + 25 + 25 + 25`, 97 unique Batch 11 activity IDs, and the completion-only boundary for Batch 11 practice traces.

## Issues caught before production

Two useful failures proved the gates were doing real work:

1. Wave C initially reused historical activity ID `letters-discriminate-lower-pq`. CI caught the stage mismatch before migration; the Wave C activity was renamed to the unique `letters-discriminate-lower-pq-late`, then CI was rerun green before production migration.
2. Wave D initially added a redundant test asserting `evidenceContractId` on the catalog learning-spec object, where that property is not exposed. The manifest/content-architecture contract already verifies `completion_only_v1`; the redundant assertion was removed and the full CI reran green before migration.

Neither issue required destructive production correction.

## Post-DDL advisor state

After Batch 11 Wave D:

- performance advisor: no WARN-level regression; **18 unused-index observations remain INFO-only**;
- security advisor: the two existing WARN findings remain:
  - authenticated execution of protected `SECURITY DEFINER` function `public.record_learning_attempt(...)`;
  - Supabase leaked-password protection disabled under the current configuration/plan;
- no new Batch 11 security/performance warning was introduced.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Remaining boundaries

Batch 11 closes the Letters/Menulis **catalog target**, not every possible handwriting capability. A future validated Latin glyph-shape evaluator may support objectively assessed handwriting, but current generic tracing remains practice-only by design.

Automated CI also does not replace representative physical-device camera/audio/trace/accessibility acceptance; that remains part of the later device/acceptance batches.

The existing account-level action to ensure `Secret history scan` is included in the active `main` protection ruleset remains outside the current connector write capability; the scan itself is green.

## Next stage

The next planned content expansion is **Batch 12 — Logic/Logika to 100**. Logic currently has three validated activities, so its first canonical 1–25 wave must add **22 meaningful activities**, not 25 blindly.
