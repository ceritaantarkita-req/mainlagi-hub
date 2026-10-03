# P0-OPEN-02B — owner-input validator safe checkpoint

Date: **3 October 2026**  
Status: **TOOLING GREEN / DRAFT HOLD / OWNER INPUTS STILL PENDING**

## Exact state

```text
current main:              e90ff8afaa00e5fe41c5f28a7ba0f0895ce3adad
production live SHA:       89cbfed2711f2c9d2c1ccebc5e4e17575e3ac1ad
Cloudflare blocker:        issue #450 — OPEN

tooling PR:                 #451
tooling head:               3021dfbe31db09c9bb40a9e69688287b5d2e65ba
PR CI:                      #2426 / run 37100806037 — FULL SUCCESS
PR state:                   DRAFT / OPEN / NOT MERGED

Shop convergence PR:       #442
Shop head:                  962044731d7852171ce2945c9a02b2f86061940f
Shop state:                 DRAFT / OPEN / NOT MERGED
01C staging:                #8 / run 37094508479 — SUCCESS
```

## What this tooling adds

Draft PR #451 adds a fail-closed validator for the canonical owner-input surface:

`docs/data/P0_OPEN02B_SHOP_OWNER_INPUT_TEMPLATE_2026-10-02.json`

Commands:

```bash
npm run shop:validate-owner-input
npm run shop:validate-owner-input:ready
npm run test:shop:owner-input
```

The normal validator accepts a structurally valid partially completed intake and reports `ready=false`.

The `:ready` command is the release-readiness gate and fails until the canonical intake proves all of:

- exactly 9 products;
- exactly 27 active SKU candidates;
- accepted verification method only: `physical_sample` or `supplier_production_sheet`;
- actual product facts for every production-verified product;
- actual SKU stock;
- actual packed weight;
- actual three-dimensional package measurements;
- applicable option measurements/facts;
- evidence reference, verifier, and timestamp;
- totals matching the underlying rows;
- explicit production `SHOP_ORDER_PII_RETENTION_DAYS` in the supported 30–3650 day range;
- owner decision evidence for PII retention.

## Canonical pending truth remains unchanged

The owner-input JSON itself was **not** populated or promoted.

Current real launch-input state remains:

```text
physically/supplier verified products:   0/9
verified active SKU candidates:          0/27
production PII retention:                pending
```

Candidate marketplace values remain comparison context only. Synthetic validator-test values exist only in test memory and are never written back to the canonical intake.

## CI proof

Exact head `3021dfbe31db09c9bb40a9e69688287b5d2e65ba` passed:

```text
Shop owner-input intake contract   SUCCESS
Quality gate (Ubuntu)              SUCCESS
Windows compatibility              SUCCESS
Mobile route QA (Chromium)         SUCCESS
Production build                   SUCCESS
Production dependency audit        SUCCESS
Secret history scan                SUCCESS
Production smoke (Cloudflare)      SKIPPED on PR by design
```

## Hold boundary

Do **not** merge PR #451 while issue #450 remains open.

The current production publication problem is external to this tooling:

- Cloudflare last successfully published `89cbfed2…`;
- Workers Builds failed for `14de47e3…`;
- Workers Builds failed again for deploy-sync main `e90ff8af…`;
- GitHub Actions OpenNext production builds remain green;
- exact-SHA production smoke correctly remains red.

Do not weaken the production smoke gate to hide that deployment failure.

## Safe next action

1. inspect Cloudflare Build ID `f17e3c6d-a87c-4e2e-9bd8-1ee6717e9cf7`;
2. repair/retry the Cloudflare Workers Builds integration while preserving existing production bindings/secrets;
3. verify production reports current `main` exact SHA again;
4. close issue #450 only after exact-SHA smoke is green;
5. keep #451 Draft until that external blocker is closed;
6. separately collect real P0-OPEN-02B owner/supplier evidence; do not fabricate missing values;
7. keep Shop convergence PR #442 Draft until owner launch blockers and a separate release decision are resolved.
