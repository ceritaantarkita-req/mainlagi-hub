# Mainlagi World → Evidence — Implementation Wave 1 — 23 September 2026

Status: **BACKEND FOUNDATION IMPLEMENTED / FAIL-CLOSED / RUNTIME DISCONNECTED / NOT PRODUCTION-MERGED**

This wave implements the backend foundation selected by the World → Evidence activation-decision contract. It does **not** activate World evidence or mastery.

## 1. Branch boundary

```text
base checkpoint:
checkpoint/world-evidence-activation-design-green-20260923
@ a8cbbada1895d998211a0340c33424b3d2c67f74

implementation branch:
feature/world-evidence-implementation-wave1-20260923
```

The previous immutable architecture/design checkpoints are not moved.

## 2. Implemented surfaces

### Additive database foundation

```text
supabase/migrations/0048_world_supplemental_evidence_foundation.sql
```

Adds:

```text
public.learning_supplemental_skill_evidence
public.record_world_skill_evidence(...)
```

The new table is separate from:

- `learning_attempts`;
- `learning_attempt_skill_evidence`;
- `child_learning_progress`;
- Belajar rewards/stars;
- certificates.

### Server ingestion contract

```text
src/lib/learning/world/moneyWorldEvidenceIngestion.ts
```

The browser observation contains raw source identity and answer sequence only. It is not allowed to choose:

- canonical skill;
- evidence contract;
- accuracy;
- correct/incorrect counts;
- retry count;
- evidence score;
- evidence weight;
- mastery qualification;
- assessment mode;
- progression/reward/certificate effects.

### Server route

```text
POST /api/learning/world-evidence
src/app/api/learning/world-evidence/route.ts
```

When a later wave enables it, the route requires a server-verified authenticated session and uses the server-only Supabase service-role client.

The route does not call `record_learning_attempt(...)`.

## 3. Why the write RPC is in public schema

The design wave described a private server write function. In this implementation the callable RPC is:

```text
public.record_world_skill_evidence(...)
```

This does **not** mean browser-public access.

Reason: the current Supabase/PostgREST RPC path exposes callable database functions through an API-exposed schema. The security boundary is therefore privilege-based:

```text
EXECUTE:
public        -> revoked
anon          -> revoked
authenticated -> revoked
service_role  -> granted
```

Direct table mutation is also revoked from `public`, `anon`, `authenticated`, and `service_role`. The SECURITY DEFINER function is the only intended write path.

## 4. Dual kill switch

Application:

```text
MONEY_WORLD_EVIDENCE_INGESTION_ENABLED = false
```

Database:

```text
v_mapping_active constant boolean := false
```

Therefore:

```text
changing only application code
≠ enough to activate evidence writes

changing only database code
≠ enough to connect World runtime
```

A later activation must deliberately pass both boundaries.

## 5. Exact source mapping

The database owns the only implemented mapping:

```text
world:            money-festival
stage:            money-stage-08-final-festival
World activity:   money-s08-activity-02
mechanic:         tap_choice
content version:  money-world-s08-subtraction-v1
skill:            math.operation.subtraction.within_10
contract:         choice_accuracy_v1
role:             supplemental
weight:           0.5000
```

No skill/evidence mapping parameter exists in the RPC signature.

Stage 2 price comparison remains excluded from this implementation.

## 6. Assessment gate remains closed

Current source activity remains:

```text
money-s08-activity-02
assessment = practice
```

The ingestion evaluator checks the authored runtime content directly. It therefore produces:

```text
source-activity-not-assessed
```

even if a caller tries to submit an otherwise valid observation.

The client cannot promote `practice → assessed` because assessment is not an accepted client canonical field.

## 7. Raw outcome canonicalization

The caller sends:

```text
answerSequence
```

For the current subtraction item the only accepted option IDs are:

```text
answer-4
answer-6
answer-8
```

The completed sequence must contain exactly one canonical correct answer and end in:

```text
answer-6
```

The database derives:

```text
correctCount
incorrectCount
retryCount
accuracy
durationMs
evidenceScore
qualification
```

Caller-supplied `accuracy`, counts, retry count, evidence score/weight or qualification are forbidden.

## 8. Ownership and age boundary

Supplemental evidence requires a real, undeleted, account-owned `player_profiles` row.

```text
demo-gian -> blocked
```

Current explicit age mapping remains compatible with the canonical learning range:

```text
SD 1 -> 6
SD 2 -> 7

eligible evidence age = 6–7
```

Age 8 is not silently introduced into the canonical learning profile/schema contract.

## 9. Anti-farming

The backend foundation includes:

- idempotency by `account_id + child_key + client_observation_id`;
- server receipt-time 30-second rapid-repeat detection;
- retry count >= 7 => non-qualifying;
- one qualifying evidence row per `account + child + World activity + content version`;
- child-row serialization before qualifying checks;
- a partial unique index as the final database invariant;
- metadata capped at 8 KiB;
- answer sequence capped at 32 entries.

Repeated `8 - 2` cannot become unlimited qualifying evidence.

## 10. Mastery remains disconnected

Migration 0048 deliberately does **not** call:

```text
recompute_child_skill_mastery(...)
```

It does not insert or mutate:

```text
learning_attempts
child_learning_progress
child_skill_mastery
learning_certificates
child_learning_achievements
```

Therefore even the new supplemental table is not currently a mastery source.

## 11. Runtime remains disconnected

`MoneyWorldExperience.tsx` does not import the ingestion contract and does not call:

```text
/api/learning/world-evidence
record_world_skill_evidence
```

World Stage completion and ★★★ behavior remain unchanged.

## 12. Still open before activation

The following remain intentionally incomplete:

1. reviewed Stage 8 promotion from `practice` to `assessed`;
2. database mapping activation (`v_mapping_active` remains false);
3. application ingestion activation;
4. World runtime observation emission;
5. source-aware mastery recompute with World-only `exploring` ceiling;
6. canonical Belajar evidence requirement for `developing+`;
7. certificate source isolation implementation;
8. parent-report World supplemental-evidence labeling;
9. live database migration/security verification;
10. final activation-specific regression review.

## 13. Non-negotiable invariant

```text
World completion / ★★★
≠ Belajar activity completion
≠ Belajar stars
≠ Belajar stage readiness
≠ certificate issuance
```

Implementation Wave 1 creates infrastructure only. It does not change that invariant.
