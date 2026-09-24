# Mainlagi World → Evidence — Production Closure — 24 September 2026

Status: **MERGED / MAIN CI GREEN / CLOUDFLARE EXACT-SHA LIVE VERIFIED / FIRST ELIGIBLE EVIDENCE WRITE PENDING**

This document closes the application-release portion of the reviewed Petualangan Uang → supplemental evidence wave.

It does not claim that a real Stage 8 evidence row has already been created. The production database currently has no age-eligible 6–7 child profile and no explicit QA/test child that can be used without fabricating or mutating user learning history.

## 1. Production release

```text
PR #312: merged (squash)
production main: ca7f0e77b296682935f9ecbe311cc1028168986f
Mainlagi TV V3 CI #1587 / run 35899987986: success
Production smoke (Cloudflare): success / exact-SHA release verified
```

PASS matrix:

- Quality gate (Ubuntu);
- Windows compatibility;
- Production build;
- Production dependency audit;
- Secret history scan;
- Mobile route QA (Chromium);
- Production smoke (Cloudflare).

Production artifacts:

```text
mobile-route-qa-screenshots — 10769285947
activity-quality-audit      — 10768138492
gameplay-distribution-audit — 10768008347
```

## 2. Safe checkpoints

```text
release-ready:
checkpoint/world-evidence-release-ready-green-20260924
@ bdc8d145d0fd124edc08dd5df7971ea4372fae9e
CI #1586 / run 35895347882 — full success

post-merge/pre-smoke:
checkpoint/world-evidence-main-merged-pending-smoke-20260924
@ ca7f0e77b296682935f9ecbe311cc1028168986f

production-green:
checkpoint/world-evidence-production-green-20260924
@ ca7f0e77b296682935f9ecbe311cc1028168986f
CI #1587 / run 35899987986 — full success + Cloudflare exact-SHA smoke
```

These refs are immutable recovery/audit points.

## 3. Live Supabase state

```text
project: estvtgflwkebomsqlolv / mainlagi-hub / ap-southeast-1
status: ACTIVE_HEALTHY
migrations: 0047–0051 live
```

Post-release counts:

```text
child_world_progress rows                  0
supplemental World evidence rows           0
child_skill_mastery rows                  26
canonical evidence rows                   51
Belajar progress rows                      3
achievement rows                          10
certificate rows                           0
active player profiles                     3
age-eligible 6–7 profiles                  0
explicit eligible QA/test profiles         0
```

The release did not mutate existing Belajar learning history.

## 4. Production evidence path

```text
Stage 8 assessed tap-choice observation
→ POST /api/learning/world-evidence
→ parent auth + child ownership
→ server-owned validation
→ service-role-only record_world_skill_evidence(...)
→ private Stage 8 registry
→ learning_supplemental_skill_evidence
→ source-aware mastery recompute
```

Only this mapping is active:

```text
money-s08-activity-02
money-stage-08-final-festival
money-world-s08-subtraction-v2-assessed
math.operation.subtraction.within_10
choice_accuracy_v1
supplemental
eligible age 6–7
World-only mastery ceiling: exploring
```

Stage 2 remains deferred. No second mapping is authorized.

## 5. First live evidence write remains pending

A controlled evidence row was deliberately **not fabricated**.

There are active player profiles, but none are currently age-eligible 6–7 and none are explicit eligible QA/test profiles. Creating or mutating one solely to manufacture a success row would contaminate learning history.

When a legitimate eligible child or dedicated QA profile exists, verify through the authenticated World runtime:

1. one valid Stage 8 v2 observation is accepted;
2. exact observation replay is idempotent;
3. repeated static content cannot farm qualifying mastery evidence;
4. World-only mastery remains capped at exploring;
5. Belajar completion/stars/progression/achievements/certificates remain isolated.

## 6. Security hardening decision — not auto-applied

Supabase table inspection surfaced `private.world_evidence_activation_registry` with RLS disabled and labeled it as a critical hardening item.

Privilege verification:

```text
anon schema USAGE:          true
authenticated schema USAGE: true

anon SELECT/INSERT/UPDATE on registry:          false / false / false
authenticated SELECT/INSERT/UPDATE on registry: false / false / false
```

So direct table privileges are currently denied, and `record_world_skill_evidence` remains service-role-only. RLS itself is still disabled.

Candidate hardening SQL, **not executed**:

```sql
ALTER TABLE private.world_evidence_activation_registry
ENABLE ROW LEVEL SECURITY;
```

Before applying it, verify function-owner/RLS behavior and whether an explicit policy is needed. This requires an explicit operator decision.

Current Supabase security advisors also show WARN-level existing items:

- authenticated execution of SECURITY DEFINER `record_learning_attempt(...)`;
- authenticated execution of SECURITY DEFINER `save_world_progress(...)`;
- leaked-password protection disabled.

Those are separate hardening items and do not change the Stage 8 service-role-only evidence-write boundary.

## 7. Preserved invariants

- World completion / ★★★ ≠ Belajar activity completion.
- World evidence does not award Belajar stars.
- World evidence does not directly unlock Belajar stages.
- World evidence does not independently issue certificates.
- Age 8 remains World completion-only for canonical evidence.
- Stage 2 remains deferred.
- Direct World reuse of `record_learning_attempt(...)` remains forbidden.
- Character development remains paused.

## 8. Next boundary

The application-release wave is closed.

Remaining follow-up is narrow:

```text
explicit decision on private-registry RLS hardening
+ eventual first legitimate age-eligible Stage 8 observation
+ post-write isolation verification
```

Do not reopen candidate expansion, broad age migration, or character work as part of that follow-up.

## 9. Private registry RLS read-only audit

A follow-up read-only database audit verified the actual ownership and privilege boundary before any RLS change is considered.

Observed production facts:

```text
table:
private.world_evidence_activation_registry

table owner:
postgres

RLS enabled:
false

RLS policies:
none

record_world_skill_evidence owner:
postgres

record_world_skill_evidence:
SECURITY DEFINER = true
```

Effective direct privileges:

```text
anon:
SELECT=false
INSERT=false
UPDATE=false
RPC EXECUTE=false

authenticated:
SELECT=false
INSERT=false
UPDATE=false
RPC EXECUTE=false

service_role:
SELECT=false
INSERT=false
UPDATE=false
RPC EXECUTE=true
```

This confirms the intended application boundary remains server-owned: browser roles cannot call the World evidence RPC and cannot directly read/write the activation registry.

It does **not** remove the RLS hardening item. The table still has RLS disabled, and no policy currently exists.

Candidate hardening SQL remains **not executed**:

```sql
ALTER TABLE private.world_evidence_activation_registry
ENABLE ROW LEVEL SECURITY;
```

Because both the table and SECURITY DEFINER RPC are owned by `postgres`, the ownership relationship is now documented, but production behavior after enabling RLS still requires an explicit operator decision and validation. No schema/database change was made in this audit.

