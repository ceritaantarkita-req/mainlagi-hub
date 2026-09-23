# Mainlagi World → Evidence — Stage 8 Activation — 23 September 2026

Status: **ACTIVATION CODE GREEN / ISOLATED BRANCH / NOT MERGED / NOT PRODUCTION-DEPLOYED**

This wave activates exactly one reviewed World supplemental-evidence source in code:

```text
World activity:   money-s08-activity-02
Stage:            money-stage-08-final-festival
mechanic:         tap_choice
assessment:       assessed
content version:  money-world-s08-subtraction-v2-assessed
canonical skill:  math.operation.subtraction.within_10
evidence contract: choice_accuracy_v1
evidence role:    supplemental
```

Stage 2 price comparison remains deferred. No second World activity is activated.

## 1. Lineage

Base docs checkpoint:

```text
checkpoint/world-evidence-implementation-wave2-docs-green-20260923
@ 7541a8cb11a836b8f1d9964b5a44ae40171d1c7e
```

Activation branch:

```text
feature/world-evidence-activation-wave-20260923
PR #309 — Draft / open / unmerged
```

Green code checkpoint:

```text
checkpoint/world-evidence-stage8-activation-green-20260923
@ 15f647b98cedcbe8a4580d15686013f6f066cd73
```

Exact-head acceptance:

```text
Mainlagi TV V3 CI #1573
run 35869765210
conclusion: success
```

PASS matrix:

- Quality gate (Ubuntu), including activation-specific engine tests, activity-quality audit, gameplay-distribution audit, simulations and final acceptance;
- Windows compatibility, including engine tests;
- Production build;
- Production dependency audit;
- Secret history scan;
- Mobile route QA (Chromium), accessibility/lazy-load matrix and permanent visual baseline.

Artifacts:

```text
mobile-route-qa-screenshots — 10754374194
activity-quality-audit      — 10754163633
gameplay-distribution-audit — 10754363461
```

## 2. Runtime activation

The reviewed activity is now authored as:

```text
money-s08-activity-02
assessment = assessed
```

Runtime path:

```text
Stage 8 tap_choice
→ raw answer sequence + timestamps + input mode
→ emitMoneyWorldEvidenceObservation(...)
→ POST /api/learning/world-evidence
→ authenticated parent/account boundary
→ service-role Supabase client
→ public.record_world_skill_evidence(...)
→ private activation registry
→ learning_supplemental_skill_evidence
→ source-aware mastery recompute
```

Evidence delivery is best-effort and does not block World UX or Stage completion.

## 3. Content-version cut

The active evidence version is:

```text
money-world-s08-subtraction-v2-assessed
```

The prior practice-era version:

```text
money-world-s08-subtraction-v1
```

is rejected by the active ingestion contract.

This prevents historical practice interactions from being reinterpreted retroactively as assessed evidence.

## 4. Client trust boundary

The client sends only raw observation data:

- child ID;
- client observation ID;
- exact World/Stage/activity/mechanic identity;
- content version;
- completed status;
- answer sequence;
- input mode;
- started/completed timestamps.

The client does **not** choose:

- canonical skill;
- canonical learning activity;
- assessment status;
- accuracy;
- correct/incorrect counts;
- retry count;
- evidence score;
- evidence weight;
- mastery qualification;
- progression/reward/certificate effects.

## 5. Delivery and idempotency

The browser adapter performs at most one retry for a transient network/server failure.

The retry reuses the same:

```text
clientObservationId
```

so the existing server/database idempotency boundary can collapse duplicate delivery.

Demo child:

```text
demo-gian
```

is skipped client-side and remains rejected from canonical evidence server-side.

## 6. Database activation

Migration:

```text
supabase/migrations/0050_world_evidence_stage8_activation.sql
```

adds:

```text
private.world_evidence_activation_registry
```

and activates only the reviewed Stage 8 + v2-assessed source.

The registry is revoked from:

```text
public
anon
authenticated
service_role
```

The evidence write RPC remains callable only by `service_role`.

Browser/authenticated clients still cannot execute the evidence RPC directly.

## 7. Anti-farming and ownership remain active

Activation preserves:

- real account-owned child requirement;
- deleted-child rejection;
- canonical evidence age 6–7 only;
- server-owned answer canonicalization;
- server receipt-time rapid replay protection;
- retry count >= 7 → non-qualifying;
- one qualifying evidence per activity + content version;
- bounded answer sequence/metadata;
- duplicate observation idempotency.

Age 8 remains World-only for this mapping.

## 8. Mastery/progression isolation remains active

World evidence remains **supplemental**.

```text
World-only qualifying evidence
→ maximum combined mastery level = exploring
```

Developing or higher requires canonical Belajar evidence.

World evidence still does not create:

```text
Belajar activity completion
Belajar stars
Belajar stage unlock by completion side effect
first-proficient/mastered achievement by itself
competency certificate by itself
```

Belajar progression/adaptive/certificate decisions continue to use canonical Belajar provenance.

## 9. Historical contracts remain historical

`moneyWorldEvidenceBridge.ts` remains the frozen **v1 design-only fail-closed historical baseline**.

It must not be rewritten to pretend the later activation existed at that earlier checkpoint.

Current activation truth lives in:

```text
moneyWorldEvidenceActivationDesign.ts
moneyWorldEvidenceIngestion.ts
moneyWorldEvidenceClient.ts
0050_world_evidence_stage8_activation.sql
```

## 10. Production/live status

Important:

```text
activation code: GREEN
PR #309: Draft / unmerged
main: untouched
production DB migration 0050: NOT APPLIED BY THIS WAVE
live Supabase verification: NOT COMPLETED
```

During this wave, the available Supabase connector returned:

```text
projects: []
```

Therefore no Supabase project ID was available for live migration, RLS/RPC verification, or production evidence-write testing.

Do **not** reinterpret the green GitHub checkpoint as proof that the production database has migrations 0048–0050 applied.

## 11. Remaining deployment boundary

Before production can be called live-activated:

1. resolve/connect the correct Supabase project;
2. verify migration history and schema drift read-only;
3. apply migrations 0048, 0049 and 0050 only if actually missing and in correct order;
4. run Supabase security/performance advisors;
5. verify registry/RPC privileges live;
6. perform controlled account-owned child test;
7. verify idempotent retry and replay behavior live;
8. verify supplemental evidence updates source-aware mastery;
9. verify Belajar stars/progression/certificate remain unchanged;
10. only then merge/deploy according to the separately authorized production release boundary.

Until then the precise status is:

```text
Stage 8 activation implementation = GREEN
production/live activation         = NOT VERIFIED / NOT DEPLOYED
```
