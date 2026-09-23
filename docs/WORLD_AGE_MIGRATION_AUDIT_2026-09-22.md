# Mainlagi World — Age 3–12 Migration Audit — 22 September 2026

Status: **AUDIT ONLY / FAIL-CLOSED / NO GLOBAL AGE MIGRATION**

This audit exists because the Petualangan Uang pilot is presented for ages **6–8**, while the canonical Belajar implementation is still intentionally authored and validated around ages **3–7**.

The goal is to identify the exact migration boundary without turning a World pilot into an accidental global curriculum rewrite.

## 1. Current decision

Do **not** replace every `7` with `12`.

The current safe contract is:

```text
Petualangan Uang presentation: 6–8
Canonical Belajar content:      reviewed 3–7 catalog
Global age migration:           disabled
World -> mastery bridge:        disabled
```

The code audit is:

```text
src/lib/learning/world/moneyWorldAgeMigrationAudit.ts
version: money-world-age-migration-v0
enabled: false
```

## 2. Verified profile-age blockers

### Cloud profile parser

`src/lib/learning/cloud.ts` currently accepts numeric `age_group` only when:

```text
3 <= age <= 7
```

An authenticated profile carrying numeric age 8 would therefore not resolve through the canonical learning-profile parser today.

### Cloud profile creation

`createCloudLearningProfile(...)` currently rejects:

```text
input.age > 7
```

### Local child-profile UI

`src/components/learning/ChildLearningPlatform.tsx` currently exposes:

```text
[3, 4, 5, 6, 7]
```

### Cloud profile UI

`src/components/learning/CloudProfileScreens.tsx` currently exposes the same age choices:

```text
[3, 4, 5, 6, 7]
```

### Important database detail

`public.player_profiles.age_group` is currently a nullable `text` column in the base schema; the profile table itself does not impose a numeric 3–7 SQL check.

Therefore the profile-age hard stop is primarily the learning application/parser/UI contract, not a `player_profiles` numeric database constraint.

## 3. Verified curriculum/catalog blockers

### Content architecture validator

`src/lib/learning/contentArchitecture.ts` currently requires:

```text
ageMin >= 3
ageMax <= 7
ageMin <= ageMax
```

Any reviewed content with `ageMax: 8` or higher would currently fail canonical architecture validation.

### Existing canonical content

The existing Belajar paths, lessons, packs, Skills, and activities are authored with age ceilings at 7 across the base catalog and expansion waves.

This is a **content truth**, not merely a technical constant.

Changing a validator to 12 would not make existing early-childhood content reviewed for ages 8–12.

## 4. Verified database blockers

### Canonical Skill age metadata

`supabase/migrations/0002_learning_attempt_schema.sql` created `public.learning_skills` with:

```sql
age_min between 3 and 7
age_max between 3 and 7
```

A future Skill explicitly reviewed through age 8+ requires a forward migration of these constraints.

### Content-pack age metadata

`supabase/migrations/0011_scalable_content_architecture.sql` created content-pack age checks with the same 3–7 ceiling.

Older-age packs therefore need a deliberate forward constraint migration before they can be registered canonically.

## 5. Runtime risk if profile ages are widened first

Canonical Belajar recommendation/progression logic filters activities by:

```text
activity.ageMin <= profile.age <= activity.ageMax
```

This happens in canonical system/progression and child-learning surfaces.

If profile age 8 is enabled before reviewed age-8 Belajar content or an explicit no-content fallback exists, an age-8 child can end up with no eligible canonical learning activities.

That is why the safe order is **not**:

```text
change profile max from 7 -> 12
then fix content later
```

## 6. Public product claim blocker

`src/components/HomePage.tsx` still describes the family product as:

> Untuk keluarga dengan anak usia 3–7 tahun

That claim is currently aligned with shipped canonical Belajar coverage.

Public copy should change only when the actual shipped surfaces support the expanded range.

World can advertise its own narrower pilot age recommendation without silently changing the whole Mainlagi family age claim.

## 7. Test contracts that intentionally preserve 3–7

Examples verified in the current suite:

- `scripts/run-curriculum-tests.mjs` asserts canonical learning paths stay within age 3–7;
- `scripts/run-batch6-subject-foundation-tests.mjs` protects historical foundation activities with ageMax <= 7.

These tests should not be broadly deleted.

A future migration should distinguish:

```text
platform can support older profiles/content
!=
all historical foundation content is suddenly reviewed through age 12
```

## 8. Evidence bridge implication

The World evidence audit currently has two candidate mappings:

```text
money-s02-activity-01 -> math.quantity.comparison
money-s08-activity-02 -> math.operation.subtraction.within_10
```

Those canonical Skills currently declare ageMax 7.

Because the World pilot includes age 8, the candidates cannot be activated for the full pilot population under the current canonical age semantics.

The World evidence bridge therefore remains:

```text
enabled: false
```

## 9. Safe migration phases

### Phase 0 — audit

Status: **complete in this branch**

- inventory profile/UI/parser limits;
- inventory canonical content/validator limits;
- inventory SQL age constraints;
- inventory recommendation/runtime risk;
- inventory public-copy/test assumptions;
- keep World evidence disabled.

### Phase 1 — profile capability

Status: **blocked pending separate approval**

Goal: support a wider child-profile age range without breaking Belajar.

Before implementation define:

- supported profile age range;
- behavior when Belajar has no reviewed content for that age;
- local/cloud UI parity;
- parent-facing explanation;
- migration/compatibility for existing `age_group` strings.

A safe implementation must not expose an age choice that sends the child into an empty or misleading Belajar journey.

### Phase 2 — reviewed older-age content

Status: **blocked**

Add age-8+ content only after content review.

Do not blanket-widen existing:

- paths;
- lessons;
- packs;
- Skills;
- activities.

Historical 3–7 content may remain 3–7.

### Phase 3 — database + validator migration

Status: **blocked**

In the same reviewed-content wave:

- add forward SQL migration for Skill age constraints;
- add forward SQL migration for content-pack age constraints;
- update architecture validator ceiling;
- update schema tests;
- preserve historical records and IDs.

### Phase 4 — runtime/adaptive QA

Status: **blocked**

Verify per supported age:

- Home/Belajar entry;
- subject/stage activity eligibility;
- adaptive recommendation;
- no empty loops;
- parent report;
- progress/mastery;
- mobile route QA;
- accessibility;
- no camera dependency for core learning.

### Phase 5 — World evidence age 8

Status: **blocked**

Only after the canonical age contract supports the mapped Skill for age 8 should the two World candidate activities be considered for assessed evidence.

That remains a separate server-owned registration wave.

## 10. Recommended migration architecture

Separate these concerns:

```text
Profile supported age
        |
        +---- World eligibility
        |
        +---- Belajar reviewed-content eligibility
                    |
                    +---- canonical Skill age semantics
                    |
                    +---- adaptive/progression
```

Do not make `profile.age` automatically imply that every Mainlagi content surface is suitable for that age.

## 11. Non-negotiable invariants

The machine-readable audit locks these principles:

- no blanket `ageMax: 7 -> 12` rewrite;
- historical foundation ranges remain reviewed facts;
- profile age capability cannot outrun a safe Belajar fallback;
- public age claim must match shipped coverage;
- World evidence remains disabled until the age contract closes;
- separate World presentation bands remain required.

## 12. Automated drift guard

`scripts/run-world-money-tests.mjs` now reads the current source files and verifies the audited 3–7 boundaries are still present.

This is intentional.

If another branch later changes one of those boundaries, the World audit test should fail and force the audit/plan to be updated instead of silently leaving stale documentation.

## 13. What this audit does not change

No change is made here to:

- `player_profiles` schema;
- profile age choices;
- cloud profile parser;
- canonical content age ranges;
- canonical Skill age ranges;
- content-pack SQL constraints;
- adaptive recommendation;
- public 3–7 copy;
- World activity assessment mode;
- mastery;
- certificates;
- achievements.

This is a safe architecture/audit wave only.

## 14. Next implementation decision

Before coding a global age migration, choose one of these explicitly:

1. keep canonical Belajar 3–7 for now while World 6–8 remains a separately presented pilot; or
2. start a separate age-capability migration branch that first defines safe profile age 8+ behavior and reviewed older-age Belajar content.

Do not use PR #272 as an excuse to silently migrate all of Mainlagi to 3–12.
