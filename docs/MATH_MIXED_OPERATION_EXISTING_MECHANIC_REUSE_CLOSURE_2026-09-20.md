# Math Mixed-Operation Existing-Mechanic Reuse Closure — 20 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED / TERMINAL DOCS PUBLICATION**

## Closed scope

Exactly four Math mixed-operation direct-result activities reuse existing arithmetic mechanics:

```text
make_total
- math-mixed-add-2-3
- math-mixed-add-4-4

take_away
- math-mixed-sub-6-1
- math-mixed-sub-9-3
```

Explicit exclusion remains:

```text
math-mixed-choose-add
```

That activity asks the learner to select an operation expression, not compute a numeric result, so it remains outside both mechanics.

No Pattern #48 was created.

## Audit verification

```text
Audit PR:            #237
Audit exact head:    64952f163ff426c2f79e1e5ca18d243627022072
Audit PR CI:         #1086 / run 35461546179 — full success
Audit main:          c01d0bac15e438640cacb5958db31c1a6ad36c66
Audit-main CI:       #1087 / run 35461876251 — full success
Cloudflare smoke:    exact audit-main SHA PASS
```

## Runtime verification

```text
Runtime PR:              #238
Accepted runtime head:   33d05c520ee6439f0c4d60ed80e8d238a2e18218
Acceptance CI:           #1090 / run 35488429991 — full success
Final PR head:           643369783d0f9d08c136485854c6f26349c0b4d5
Final exact-head CI:     #1095 / run 35488941575 — full success
Runtime main:            710ecdbad3f68b88bc3d6330f9c77cc7f9ad7f24
Runtime-main CI:         #1096 / run 35490566915 — full success
Cloudflare production:   exact runtime-main SHA PASS
```

Exact production proof:

```text
EXPECTED_SHA:
710ecdbad3f68b88bc3d6330f9c77cc7f9ad7f24

Production is serving expected commit
710ecdbad3f68b88bc3d6330f9c77cc7f9ad7f24
with canonical Supabase target.
```

Production health:

```text
ok:                 true
service:            motion-learning-hub-mainlagitv-v2
modules:            9
release.sha:        710ecdbad3f68b88bc3d6330f9c77cc7f9ad7f24
release.branch:     main
siteUrl:            https://mainlagihub.my.id
dataBackend:        supabase
supabaseProjectRef: estvtgflwkebomsqlolv
result:             PASS
```

## Final merged gameplay truth

```text
activities:          900
classified:          900
unclassified:          0
active patterns:      47
choice_grid:         179
make_total:            7
take_away:             7
number_line:          11
Math choice_grid:      13
```

Activity quality:

```text
KEEP       900
POLISH       0
REDESIGN     0
REPLACE      0
findings      0
```

## Exact mechanic families

`make_total` is now exactly seven audited activities:
- five legacy Wave C addition activities;
- two Math mixed-add direct-result activities.

`take_away` is now exactly seven audited activities:
- five legacy Wave C subtraction activities;
- two Math mixed-sub direct-result activities.

Both eligibility configs fail closed on:
- exact activity ID;
- Math subject;
- exact expected stage;
- `tap_choice` runtime;
- canonical title;
- canonical prompt;
- exact ordered choices;
- canonical correct answer;
- reviewed arithmetic quantities;
- arithmetic result consistency.

`gameplayPresentation.ts` delegates mechanic eligibility to those configs instead of keeping a second broad allowlist.

## Curriculum and evidence preservation

The four mixed-operation activities retain their canonical learning identity:

```text
subject:      math
stage:        math-ukur-ruang
lesson:       math-mixed-operations
pack:         math.pack.mixed-operations
skill:        math.operation.mixed
runtime:      tap_choice
assessment:   assessed
evidence:     choice_accuracy_v1
```

Mechanic-specific runtime evidence remains:

```text
make_total
source: make-total-runtime
evidenceFidelity: choice_make_total_interaction
leftCount
rightCount

take_away
source: take-away-runtime
evidenceFidelity: choice_take_away_interaction
startCount
removeCount
```

No curriculum ID, skill, mastery model, progression rule, stars, database schema or authored activity content changed.

## Responsive QA and visual acceptance

Dedicated representative routes:

```text
/child/demo-gian/activity/math-mixed-add-4-4
/child/demo-gian/activity/math-mixed-sub-9-3
```

Verified at:
- 320x720 — actual touchscreen;
- 390x844 — pointer;
- 768x1024 — actual touchscreen.

Checks passed:
- legitimate Math prerequisite readiness;
- exact route retention;
- canonical quantities and choice order;
- result masked until correct completion;
- keyboard wrong-answer/retry;
- wrong answer cannot complete;
- pointer/touch correct completion;
- >=44px interaction targets;
- no horizontal overflow;
- assessed evidence integrity;
- explicit `math-mixed-choose-add` exclusion;
- legacy Make Total and Take Away browser suites;
- no page/console errors.

During implementation, responsive QA found two real success-state layout issues:
1. subtraction CTA outside the 320x720 viewport;
2. subtraction CTA outside the 390x844 viewport.

Both were fixed in responsive CSS without weakening assertions or hiding evidence.

Eighteen dedicated screenshots were manually reviewed:

```text
add + subtract
× idle / retry / success
× 320 / 390 / 768

P0 = 0
P1 = 0
result = ACCEPTED
```

## Runtime-main artifacts

CI #1096:

```text
gameplay-distribution-audit
artifact: 10599081942
sha256:5ea82ac6e492a6948d84b0658ffb6e75effbaacea98f2c3ff65c9fa069a3a2c8

mobile-route-qa-screenshots
artifact: 10598882284
sha256:e7ca78728ab9b05a6cd672328ffc18a8774ecb263020ac00166dac6e45606d8e

activity-quality-audit
artifact: 10598877263
sha256:5c01b2c03de33c2d0a665a7f347b92f29bdbc41ddf14b2bcb4893eb2428a447f
```

## Product decision

Math mixed-operation direct-result -> existing `make_total` / `take_away` is **FULLY CLOSED / LIVE VERIFIED**.

Pattern count remains **47**.

Pattern #48 remains **NO JUSTIFIED NEW PATTERN YET**.

No next runtime family is pre-approved by this closure. The next WS-05 step must begin with a fresh objective/evidence audit of the remaining 179 `choice_grid` activities, with reuse-first discipline and Iqro still excluded pending expert acceptance.

This file is the terminal documentation publication for this wave. After this docs changeset is merged and its normal main CI / exact production smoke are green, no additional closure-doc PR is required.
