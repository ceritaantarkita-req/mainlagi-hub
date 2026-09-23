# Mainlagi World → Evidence — Implementation Wave 2 — 23 September 2026

Status: **SOURCE-AWARE MASTERY ISOLATION IMPLEMENTED / PRE-ACTIVATION / RUNTIME DISCONNECTED / NOT PRODUCTION-MERGED**

Implementation Wave 2 builds on the frozen Wave 1 backend checkpoint:

```text
checkpoint/world-evidence-implementation-wave1-green-20260923
@ 335a076b795ec349feb204d707ba85f8ac2fdb96
```

Branch:

```text
feature/world-evidence-implementation-wave2-20260923
```

This wave prepares source-aware mastery, progression isolation, certificate isolation and parent-report provenance **without activating World evidence ingestion**.

## 1. Non-negotiable activation state

These gates remain closed:

```text
World ingestion application switch:
MONEY_WORLD_EVIDENCE_INGESTION_ENABLED = false

World database mapping:
v_mapping_active = false

money-s08-activity-02:
assessment = practice

World runtime observation emission:
absent
```

Therefore Migration 0049 is implementation foundation, not production activation.

## 2. Source-aware mastery storage

Migration:

```text
supabase/migrations/0049_source_aware_mastery_isolation.sql
```

adds provenance to `child_skill_mastery`:

```text
combined/source-aware:
mastery_score
confidence
mastery_level
evidence_count
qualifying_evidence_count
last_evidence_at

canonical Belajar:
canonical_mastery_score
canonical_confidence
canonical_mastery_level
canonical_evidence_count
canonical_qualifying_evidence_count
canonical_last_evidence_at

supplemental:
supplemental_evidence_count
supplemental_qualifying_evidence_count

provenance:
evidence_source_policy
```

Existing rows are backfilled as `belajar-only` so the migration preserves pre-World canonical state.

## 3. Recompute semantics

`public.recompute_child_skill_mastery(...)` becomes source-aware.

Canonical Belajar evidence continues to come from:

```text
learning_attempt_skill_evidence
```

Supplemental World evidence comes from:

```text
learning_supplemental_skill_evidence
```

Combined mastery may use both sources, preserving the existing eight-recent-evidence weighted model.

However the level contract is intentionally asymmetric.

### World-only

```text
canonical qualifying evidence = 0
→ maximum combined mastery level = exploring
```

World supplemental evidence alone can never produce:

```text
developing
proficient
mastered
```

### Developing

Requires at least:

```text
1 canonical Belajar qualifying evidence
+
2 combined qualifying evidence
+
combined score >= 0.45
```

### Proficient

Requires at least:

```text
2 canonical Belajar qualifying evidence
+
combined score >= 0.70
```

### Mastered

Requires at least:

```text
3 canonical Belajar qualifying evidence
+
combined score >= 0.85
+
combined confidence >= 0.65
+
latest two canonical Belajar evidence scores >= 0.80
```

World can therefore remain supplemental without replacing direct Belajar assessment.

## 4. Belajar progression is canonical-only

Stage readiness and recommendation policy now use:

- canonical qualifying evidence count;
- canonical mastery score;
- canonical confidence;
- canonical mastery level;
- canonical last-evidence timestamp.

They do **not** use combined/source-aware values for unlock decisions.

Therefore:

```text
World supplemental evidence
≠ Belajar evidence readiness
≠ Belajar stage unlock
≠ adaptive spacing signal
```

Even if a combined snapshot is numerically high, a weak canonical Belajar snapshot remains weak for Belajar progression.

## 5. Adaptive-learning isolation

Adaptive Learning V2 now uses canonical Belajar provenance for:

- first-evidence detection;
- strengthen-skill ranking;
- confidence-building decisions;
- proficient/mastered cooling;
- spaced-review age.

`canonical_last_evidence_at` prevents a later World observation from resetting the Belajar spaced-review clock.

## 6. Achievement isolation

Both database-issued and client-derived learning achievements use canonical Belajar mastery for:

```text
first-proficient
first-mastered
```

A combined mastery level enriched by World evidence cannot create either achievement on its own.

World completion continues to have no Belajar-star effect.

## 7. Certificate isolation

Competency certificate eligibility remains subject completion plus canonical Belajar mastery.

For every assessed skill:

```text
canonical_mastery_level ∈ {proficient, mastered}
AND
canonical_qualifying_evidence_count >= 2
```

Supplemental World evidence cannot satisfy this gate.

Issued certificate snapshots now record:

```text
evidence_policy = belajar-canonical-only-v2
```

and preserve both canonical and combined values for auditability.

The certificate criteria identity remains:

```text
subject-v1
```

This wave changes provenance enforcement, not the public certificate version identifier.

## 8. Parent-report semantics

Weekly activity metrics remain based on Belajar learning attempts.

The weekly `qualifyingEvidence` count remains:

```text
Belajar attempt evidence only
```

If supplemental World evidence exists in a combined mastery snapshot, parent reports label it explicitly, for example:

```text
Belajar + evidence tambahan dari World
```

or:

```text
Evidence tambahan dari World; belum cukup untuk progres Belajar
```

Parent-facing combined mastery may show the supplemental context, but progression and certificates remain canonical Belajar.

## 9. Security and trigger boundary

A private trigger:

```text
private.refresh_world_supplemental_mastery()
```

can recompute the source-aware snapshot after supplemental evidence changes.

It is:

- SECURITY DEFINER;
- search_path pinned;
- revoked from `public`, `anon`, `authenticated`, and `service_role`;
- trigger-only.

The public recompute function remains service-role-only.

Wave 1's server-owned write RPC remains the only intended supplemental evidence creation path, and its database mapping gate is still false.

## 10. Regression contract

Dedicated regression:

```text
scripts/run-world-evidence-source-aware-tests.mjs
npm run test:learning:world-evidence-source-aware
```

covers a deliberate semantic attack:

```text
combined mastery = mastered
canonical Belajar = exploring
```

Expected result:

```text
Belajar stage readiness     -> blocked
certificate eligibility     -> blocked
first-proficient achievement -> absent
first-mastered achievement   -> absent
weekly Belajar evidence      -> unchanged
parent mastery               -> visible only with source label
```

Schema tests also lock Migration 0049 into the main learning engine gate.

## 11. Still not implemented / not activated

The following remain open:

1. Stage 8 `practice -> assessed` content/pedagogy decision;
2. application ingestion enablement;
3. database mapping enablement;
4. World runtime observation emission;
5. production application of migrations 0048/0049;
6. live database/RLS/RPC verification;
7. activation-specific end-to-end replay/idempotency testing against a real deployed database.

## 12. Invariant after Wave 2

```text
World completion / ★★★
≠ Belajar activity completion
≠ Belajar stars
≠ Belajar stage readiness
≠ competency certificate

World supplemental evidence
may enrich source-aware mastery
but cannot replace canonical Belajar evidence.
```
