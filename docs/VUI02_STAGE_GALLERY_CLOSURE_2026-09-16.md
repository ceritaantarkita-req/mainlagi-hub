# VUI-02 Stage / Gallery Closure — 2026-09-16

Status: **FULLY CLOSED / LIVE VERIFIED**

## Canonical outcome

- PR: **#158 — `feat: converge stage and subject journey presentation`**
- exact final PR head: `cba874f0b43904999c1ca905137fb092076b9334`
- final PR CI: **#763 / run `35117490284` — full success**
- squash merge on `main`: `fe260ba7a239586ca2362fbabfca3e0a5019d453`
- independent `main` CI: **#764 / run `35118210891` — full success**
- exact Cloudflare release smoke: **success**
- production: `https://mainlagihub.my.id/`

## Scope that closed

VUI-02 corrected presentation hierarchy only.

Stage:
- stage title/subtitle + existing readiness state form one Garden-aligned hero;
- lesson title/objective/progress form explicit lesson groups;
- lesson activities use content-aware columns so one to three activities fill usable width naturally;
- the existing adaptive recommendation receives visual emphasis without changing ranking or activity order;
- motion activities remain separate and optional.

Subject journey:
- phone keeps intentional horizontal stage navigation;
- tablet/desktop use a responsive grid so later stages are not partially clipped behind an internal horizontal scroller.

## Non-change boundary

VUI-02 did **not** change:
- readiness calculation;
- stage gates or prerequisites;
- mastery/evidence rules;
- curriculum answers or activity content;
- lesson/activity ordering semantics;
- recommendation source/ranking;
- completion requirements;
- schema or migrations.

## Permanent regression evidence

Canonical visual QA now asserts on Math subject/stage routes:
- tablet/desktop journey does not require internal horizontal scrolling;
- journey cards retain readable width;
- stage readiness marker exists;
- exactly one canonical recommended activity remains visually marked;
- lesson grid does not overflow;
- canonical lesson cards retain minimum readable widths on tablet/desktop.

Implementation evidence:

```text
head:     7e85721bf42a1b31605bc87cd58594a8bbc55bd7
CI:       #759 / run 35116294362
artifact: 10455798162
digest:   sha256:41ee08ebb674a7f2ccebd6d7498c6f60e2c4032618dd268c3db2290686eed012
captures: 42 / 42
```

Final docs-head visual artifact:

```text
head:     cba874f0b43904999c1ca905137fb092076b9334
CI:       #763 / run 35117490284
artifact: 10455910819
digest:   sha256:53de9bb689fb55ee2f4f52333f2a98f93325b2ee6c5a7cbfac18c45703fca9da
captures: 42 / 42
```

Manual screenshots were accepted at 390x844, 768x1024 and 1280x800 for canonical Math subject + stage.

## Baseline impact

After independent main/Cloudflare verification:

```text
P0 findings: 0
P1 findings: 2
P2 findings: 3
VBASE-P1-03 stage/readiness hierarchy: CLOSED
Pattern #38: BLOCKED
```

Remaining P1 findings:
1. `VBASE-P1-01` visual-token fragmentation;
2. `VBASE-P1-04` public/adult root information architecture.

## Next wave

**VUI-03 Public/Auth/Account convergence** starts from the live-verified VUI-02 baseline after canonical docs closure. Its initial source/screenshot audit is recorded in `CURRENT_STATE.md`, `NEXT_PRODUCT_QUALITY_PLAN.md`, and `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`.
