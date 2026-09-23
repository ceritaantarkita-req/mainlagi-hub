# Mainlagi World → Evidence v1 — Design Closure — 23 September 2026

Status: **DESIGN GREEN / FAIL-CLOSED / BRIDGE DISABLED**

This document is the compact handoff for the World → Evidence architecture work. It is not an activation record.

## 1. Branch / PR boundary

```text
branch: feature/world-evidence-bridge-contract-20260923
PR:     #295
state:  Draft / open / unmerged
base:   feature/world-petualangan-uang-production-wave-20260922
```

No merge to `main` is authorized by this closure.

## 2. Immutable checkpoints

Design implementation:

```text
checkpoint/world-evidence-bridge-contract-green-20260923
@ 38bbe5704d4d63781410842cbf134dcb76c3ab54
CI #1530 / run 35764121287 — full success
```

Docs synchronization before this closure cleanup:

```text
checkpoint/world-evidence-bridge-docs-green-20260923
@ eb793f442cbee8d38f528cb5dbff0d15784a6200
CI #1532 / run 35765390710 — full success
```

Do not move or force-push either checkpoint.

## 3. Core invariant

```text
World completion / ★★★
≠ Belajar activity completion
≠ canonical skill evidence
≠ mastery
≠ Belajar stars
≠ stage readiness
≠ certificate eligibility
```

World and Belajar remain separate progression domains.

## 4. Current audited World activity state

Petualangan Uang currently contains:

```text
16 World activity placements
16 practice
0 assessed
```

Exactly two relationships are kept as **candidate-only / unapproved**:

```text
money-s02-activity-01
→ candidate math.quantity.comparison
→ possible choice_accuracy_v1 relation

money-s08-activity-02
→ candidate math.operation.subtraction.within_10
→ possible choice_accuracy_v1 relation
```

Both remain World `practice`.

Neither candidate has:

- an approved pedagogical mapping;
- a canonical `learning_activity` ID;
- permission to write attempts/evidence;
- permission to affect mastery/progression/rewards.

The other 14 World activity placements are explicit exclusions from current canonical mastery mapping.

## 5. Why direct `record_learning_attempt(...)` reuse is forbidden

The existing canonical Belajar RPC is not an evidence-only sink.

A completed canonical learning attempt can also mutate:

- `child_learning_progress.completed_activity_ids`;
- Belajar stars/reward state;
- stage readiness indirectly through canonical completion/evidence state.

Therefore World must not borrow/guess a Belajar activity ID and call the existing RPC.

A future active bridge requires a server-owned write boundary that can preserve:

```text
progressionEffect = none
rewardEffect      = none
```

unless a later product decision explicitly changes that rule.

## 6. Current v1 source contract

```text
src/lib/learning/world/moneyWorldEvidenceBridge.ts
version: money-world-evidence-bridge-v1
mode:    design-only-disabled
enabled: false
```

All side-effect capabilities remain false:

```text
local learning-attempt write:        false
cloud learning-attempt write:        false
skill evidence write:                false
mastery recompute:                   false
Belajar progress mutation:           false
Belajar reward mutation:             false
certificate mutation:                false
schema migration authorization:      false
runtime hook authorization:          false
direct record_learning_attempt use:  false
```

Even a structurally valid candidate observation returns `blocked`.

## 7. Fail-closed source validation

The design contract rejects:

- unknown World activity IDs;
- Stage mismatch;
- mechanic mismatch;
- caller promotion of `practice → assessed`;
- excluded/unmapped activities;
- incomplete attempts;
- candidate observations with missing measured outcomes.

Mechanic measurability alone never changes authored assessment semantics.

## 8. Activation blockers

Every activation prerequisite is currently unsatisfied.

Required before any runtime activation:

1. explicit product authorization;
2. approved pedagogical mapping for the chosen candidate scope;
3. age-8 Belajar/catalog decision;
4. validated assessed evaluator for each promoted World activity;
5. server-owned ingestion/canonicalization boundary;
6. strict isolation from Belajar completion/stars/progression side effects;
7. ownership and child isolation;
8. idempotency;
9. server receipt-time replay protection;
10. retry/anti-farming handling;
11. bounded metadata/canonicalization;
12. cloud/local behavior definition;
13. security regression coverage;
14. parent-report wording that distinguishes World evidence from direct Belajar attempts;
15. separately reviewed SQL/RPC/schema changes if the chosen server architecture requires them.

## 9. Financial-literacy catalog gap

Most Petualangan Uang objectives are not existing Math/Logic mastery skills.

Current World concepts include:

- money and price;
- price changes / inflation introduction;
- work/business income sources;
- needs vs wants;
- saving;
- investment introduction;
- uncertainty/risk.

The bridge must not invent false mastery by borrowing unrelated skills simply because an interaction can emit a score.

A future financial-literacy skill family is a separate curriculum/product/schema decision.

## 10. Age boundary

```text
Petualangan Uang pilot: 6–8
canonical Belajar contract: 3–7
```

Age 8 is an explicit blocker.

Do not solve this by silently changing every Belajar skill/content `ageMax`.

## 11. QA truth

The green v1 design checkpoint verifies:

- bridge disabled;
- 16/16 activity audit coverage;
- 16 practice placements;
- 2 candidate-only Math relations;
- 14 exclusions;
- 0 canonical learning-activity mappings;
- all write/runtime/schema permissions false;
- all activation prerequisites unsatisfied;
- valid candidate still blocked;
- practice-to-assessed spoof blocked;
- excluded and unknown sources blocked;
- World runtime contains no evidence-write hook;
- direct existing-RPC reuse remains prohibited.

## 12. What this closure did not do

```text
SQL migrations:                  0
RPC changes:                     0
RLS changes:                     0
new learning_activity rows:      0
new learning_skill rows:         0
World runtime evidence hooks:    0
canonical mastery writes:        0
Belajar progression mutations:   0
Belajar reward mutations:        0
```

Audio/provider work is unrelated and remains under its separate authorization boundary.

Final Gian/Naya character production remains paused.

Bermain/motion remains out of scope.

## 13. Next-work rule

Do not continue into activation automatically.

The next World → Evidence wave starts only after the project owner explicitly selects/approves:

```text
candidate scope
+ pedagogical mapping
+ age-8 handling
+ server-owned evidence write architecture
+ progression/reward isolation
+ security/anti-farming contract
```

Until then:

```text
World → Evidence = designed, green, fail-closed, disabled
```


## 14. Final closure checkpoint

The complete design-closure head is green and immutable:

```text
checkpoint/world-evidence-bridge-design-closure-green-20260923
@ 82faddd6b90eac603cb2449b8f16d7aff98a1792
CI #1535 / run 35768996360 — full success
```

This checkpoint includes the green v1 contract plus synchronized architecture/current-state/limitations/QA/policy handoff.

Checkpoint hierarchy:

```text
implementation contract:
checkpoint/world-evidence-bridge-contract-green-20260923
@ 38bbe5704d4d63781410842cbf134dcb76c3ab54

docs synchronization:
checkpoint/world-evidence-bridge-docs-green-20260923
@ eb793f442cbee8d38f528cb5dbff0d15784a6200

final design closure:
checkpoint/world-evidence-bridge-design-closure-green-20260923
@ 82faddd6b90eac603cb2449b8f16d7aff98a1792
```

Do not move or force-push any of these branches.

The next step is **not implementation activation**. It is a new owner-authorized decision wave covering candidate mapping approval, age-8 handling, isolated server ingestion, progression/reward isolation, and security/anti-farming acceptance.
