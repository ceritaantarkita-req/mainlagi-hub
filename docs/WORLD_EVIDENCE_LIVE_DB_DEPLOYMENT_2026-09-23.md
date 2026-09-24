# Mainlagi World → Evidence — Live Database Deployment — 23 September 2026

Status: **SUPABASE MIGRATIONS 0047–0051 LIVE / STRUCTURALLY VERIFIED / APP ACTIVATION NOT MERGED**

This record closes the database-deployment portion of the reviewed Stage 8 World supplemental-evidence wave.

It does **not** claim that the Stage 8 evidence runtime is live in the Cloudflare application, because the activation/hardening PR stack remains Draft and unmerged.

## 1. Production target

Canonical Supabase project verified directly by project ref:

```text
project ref: estvtgflwkebomsqlolv
name:        mainlagi-hub
region:      ap-southeast-1
status:      ACTIVE_HEALTHY
```

Repository `main` observed during this verification:

```text
17b9ca79749e171f62d3adb86df494badef11732
```

The World evidence activation PR stack is not part of that `main` commit.

## 2. Safe Git checkpoints

Activation final closure:

```text
checkpoint/world-evidence-stage8-activation-final-closure-green-20260923
@ 3e30cae5f8f8ebb888e4d58c229bd953e576f615
CI #1580 / run 35876309816 — full success
```

Live DB advisor hardening:

```text
checkpoint/world-evidence-live-db-hardening-green-20260923
@ 45638d6d345c294f8a5087eb939d862a0db127b0
CI #1581 / run 35884912348 — full success
```

CI #1581 artifacts:

```text
mobile-route-qa-screenshots — 10761808661
activity-quality-audit      — 10761808102
gameplay-distribution-audit — 10762182630
```

Both checkpoints are immutable and must not be force-moved.

## 3. Read-only preflight before DDL

Before applying any World migrations, the live database was checked read-only.

Initial World schema state:

```text
child_world_progress                    absent
learning_supplemental_skill_evidence   absent
world_evidence_activation_registry     absent
```

Existing learning-state counts:

```text
child_skill_mastery rows               26
learning_attempt_skill_evidence rows   51
child_learning_progress rows           3
child_learning_achievements rows       10
learning_certificates rows             0
```

Mastery rows without a qualifying canonical source:

```text
0
```

Potential trigger side effects were also checked before migration 0049:

```text
missing eligible first-attempt achievements   0
missing eligible five-activity achievements   0
missing eligible first-proficient achievements 0
missing eligible first-mastered achievements  0
missing eligible all-subject achievements     0
eligible subject certificates                 0
missing subject certificates                  0
```

The 0049 canonical recompute formula was recalculated read-only against all 26 existing mastery rows.

Mismatch result:

```text
score mismatch                 0
confidence mismatch            0
mastery-level mismatch         0
evidence-count mismatch        0
qualifying-count mismatch      0
last-evidence mismatch         0
```

Therefore the source-aware rematerialization was expected to preserve existing Belajar mastery exactly.

## 4. Migration sequence applied live

The following repository migrations were applied to the canonical production Supabase project in order:

```text
0047_world_progress_persistence
live version: 20260923154936

0048_world_supplemental_evidence_foundation
live version: 20260923155002

0049_source_aware_mastery_isolation
live version: 20260923155050

0050_world_evidence_stage8_activation
live version: 20260923155129

0051_world_evidence_advisor_hardening
live version: 20260923160118
```

No migration was skipped or reordered.

## 5. Migration 0047 live verification

`public.child_world_progress` is live with:

- RLS enabled;
- authenticated SELECT permitted;
- authenticated direct INSERT denied;
- `save_world_progress(...)` executable by authenticated;
- `save_world_progress(...)` not executable by anon.

The authenticated SECURITY DEFINER RPC is intentional: clients write through the validated ownership-bound RPC instead of direct table mutation.

## 6. Migration 0048 live verification

`public.learning_supplemental_skill_evidence` is live.

Verified boundary before activation:

- RLS enabled;
- authenticated direct SELECT denied;
- authenticated direct INSERT denied;
- service-role SELECT allowed;
- service-role direct INSERT denied;
- `record_world_skill_evidence(...)` executable by service_role;
- RPC not executable by authenticated;
- RPC not executable by anon;
- supplemental evidence row count remained `0`;
- the Wave 1 database mapping kill switch was confirmed false before migration 0050.

No fabricated World evidence was inserted for testing.

## 7. Migration 0049 live verification

After source-aware mastery migration:

```text
mastery rows              26
canonical evidence rows   51
supplemental rows          0
learning progress rows     3
achievements rows          10
certificates rows          0
```

Every existing mastery row remained equivalent to canonical Belajar state:

```text
canonical score mismatch              0
canonical confidence mismatch         0
canonical level mismatch              0
canonical evidence-count mismatch     0
canonical qualifying-count mismatch   0
canonical last-evidence mismatch      0
supplemental count nonzero            0
supplemental qualifying nonzero       0
source-policy mismatch                0
```

Privilege/trigger verification:

- source-aware recompute executable by service_role;
- source-aware recompute not executable by authenticated;
- private supplemental trigger helper not API-callable by service_role;
- supplemental mastery trigger exists.

## 8. Migration 0050 live verification

The private activation registry contains exactly the reviewed mapping:

```text
world_activity_id: money-s08-activity-02
content_version:   money-world-s08-subtraction-v2-assessed
active:            true
activated_at:      set
```

Live RPC boundary:

```text
service_role execute:  true
authenticated execute: false
anon execute:          false
```

The private registry is not directly readable by service_role or authenticated.

The active RPC definition was verified to:

- consult `private.world_evidence_activation_registry`;
- require `money-world-s08-subtraction-v2-assessed`;
- not reference `record_learning_attempt(...)`.

Data counts remained unchanged and supplemental evidence remained empty.

## 9. Migration 0051 advisor hardening

Post-0050 Supabase advisors surfaced two new INFO findings caused by the additive schema:

1. RLS enabled with no explicit policy on `learning_supplemental_skill_evidence`;
2. unindexed `skill_key` foreign key.

Migration 0051 adds:

- `idx_supplemental_evidence_skill_key`;
- explicit deny-all API RLS policy for `anon` and `authenticated`;
- reasserted direct-table revoke boundary;
- service-role SELECT only.

Live verification after 0051:

```text
skill_key index exists          true
explicit deny policy exists     true
authenticated SELECT            false
authenticated INSERT            false
service_role SELECT             true
service_role INSERT             false
```

The two new advisor findings are gone.

## 10. Final Supabase advisor state

Security advisor now reports only:

- authenticated SECURITY DEFINER warning for `record_learning_attempt(...)`;
- authenticated SECURITY DEFINER warning for `save_world_progress(...)`;
- leaked-password protection disabled.

The two SECURITY DEFINER warnings are known/intentional RPC boundaries at this checkpoint. Direct underlying-table writes remain restricted and both RPCs have server/database validation contracts.

Leaked-password protection is an existing Supabase Auth configuration issue and was not changed by the World evidence migration wave.

Performance advisor now reports only `unused_index` INFO observations. The supplemental `skill_key` foreign-key missing-index finding is closed.

Because the supplemental table currently has zero rows, its new indexes being reported as unused is expected and is not evidence of a regression.

## 11. Final live data invariants

After migrations 0047–0051:

```text
child_world_progress rows                  0
learning_supplemental_skill_evidence rows 0
child_skill_mastery rows                  26
learning_attempt_skill_evidence rows      51
child_learning_progress rows              3
child_learning_achievements rows          10
learning_certificates rows                0
```

No existing Belajar learning-state counts changed.

No synthetic child evidence was created merely to prove the write path.

## 12. Application deployment boundary

Database readiness and application rollout are intentionally separate.

Current state:

```text
Supabase migrations 0047–0051: LIVE
Stage 8 activation DB registry: LIVE
supplemental evidence rows:     0

PR #309 activation app/code:     closed / superseded by PR #312
PR #310 DB hardening/docs:       closed / superseded by PR #312
repository main observed:        17b9ca79749e171f62d3adb86df494badef11732
Cloudflare Stage 8 runtime:      NOT DEPLOYED BY THIS WAVE
```

The live database is schema-ahead but backward-compatible with the current application.

A real end-to-end World evidence write should not be fabricated before the reviewed runtime is deployed. After deployment, verification should use an authorized real/QA child flow and confirm:

- one Stage 8 v2 observation is accepted;
- retry with the same observation ID is idempotent;
- replay/static-content farming stays bounded;
- source-aware mastery is updated correctly;
- Belajar completion/stars/stage readiness/certificates remain isolated.

## 13. Next release boundary

No merge to `main` was performed in this database deployment wave.

The next separately controlled step is:

```text
review stacked PRs
→ resolve base/merge order
→ merge through protected main flow
→ Cloudflare Git deploy
→ exact-SHA production smoke
→ controlled real Stage 8 evidence verification
→ final current-state/docs closure
```

Do not activate any second World evidence mapping or expand canonical evidence to age 8 as part of that release.

## 14. Application integration release-candidate follow-up

The application stack has now been integrated with the current main baseline on a dedicated release branch.

```text
current-main parent:
17b9ca79749e171f62d3adb86df494badef11732

World/live-DB parent:
94062af9944943e5f82011087bff9e4dfd12e2b7

integration merge:
e4999265033b0263e906c2fe287fc08d09bde0bc

Historical release-candidate PR:
#312 -> main
(state at this checkpoint: Draft / unmerged)
```

Integration checkpoint:

```text
checkpoint/world-evidence-main-integration-green-20260923
@ e4999265033b0263e906c2fe287fc08d09bde0bc

CI #1584 / run 35892514511 — full success
```

The integration preserved current-main semantic/narration/illustration gates while adding the World runtime/evidence stack. Database state was not changed in this integration wave and remains live through 0051 with zero supplemental evidence rows.

At this historical checkpoint, this did **not** yet change the production-app claim: PR #312 was Draft/unmerged and exact-SHA Cloudflare smoke was still pending a main deployment. Section 16 records the later production release.

## 15. PR stack consolidation follow-up

After the current-main integration passed CI, historical Draft PRs #282, #295, #305, #307, #308, #309 and #310 were closed as superseded.

Their heads are all ancestors of the integrated release head with no missing commits.

The only active release path at that historical checkpoint was:

```text
PR #312
release/world-evidence-integration-20260923
→ main
Draft / unmerged / mergeable (historical state)
```

Historical branches and immutable checkpoints remain intact for audit/recovery.


## 16. Application production release follow-up

The application has caught up with the live database: PR #312 is merged at `main` `ca7f0e77b296682935f9ecbe311cc1028168986f`; CI #1587 / run `35899987986` and Cloudflare exact-SHA smoke succeeded.

Post-release `learning_supplemental_skill_evidence` remains 0. No current child is age-eligible 6–7 and no explicit eligible QA/test profile exists, so no synthetic evidence write was performed.

See `WORLD_EVIDENCE_PRODUCTION_CLOSURE_2026-09-24.md`.
