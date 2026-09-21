# Required Secret-Scan Enforcement Closure — 22 September 2026

Status: **FULLY CLOSED / MERGED / LIVE VERIFIED**

## 1. Historical governance gap

The repository already ran a standalone redacted full-Git-history Gitleaks job named `Secret history scan`, but the active `Protect main` ruleset did not list that standalone context as a required status check.

The ruleset required these four contexts:

1. `Production build`;
2. `Quality gate (Ubuntu)`;
3. `Windows compatibility`;
4. `Production dependency audit`.

That meant the standalone secret-scan context itself was visible but was not a merge-blocking ruleset context.

Historical audit records that describe this gap remain valid for their original checkpoint and must not be rewritten.

## 2. Enforcement design

PR **#269** closed the gap without weakening the active ruleset.

The implementation:

- centralizes pinned Gitleaks execution in `scripts/run-secret-history-scan.sh`;
- keeps the standalone `Secret history scan` job for visibility;
- changes the ruleset-required `Production dependency audit` job to use `fetch-depth: 0`;
- runs the same full-history Gitleaks scan inside that required job as `Required full-history secret gate`;
- keeps redacted output and pinned Gitleaks `v8.30.1`;
- keeps the existing production dependency audit behavior after the secret gate.

Because `Production dependency audit` is already a strict required status check, any failure of the embedded secret-history gate makes the required context fail and blocks merge.

The standalone `Secret history scan` context is still not directly listed in the ruleset. Enforcement is achieved through the already-required dependency-audit context.

## 3. Verification

Implementation PR:

```text
PR:        #269
Head:      60c59cdcae44b756fb43eca36bdfe21ebda42538
PR CI:     #1208 / run 35625095287
Result:    full success
```

The PR run explicitly showed:

```text
Production dependency audit
  Required full-history secret gate: SUCCESS
```

Merged production baseline:

```text
Main:      6fd9e3fc7ffa57aab687b5529033f1a995e0e5ba
Main CI:   #1209 / run 35625953536
Result:    full success
Cloudflare exact production smoke: PASS
```

The merged-main run again showed the embedded required secret gate succeeding before dependency audit completion.

## 4. Closure truth

Secret-history scanning is now **merge-blocking** for normal protected-main PR flow because it is executed inside a ruleset-required context.

No application runtime, learning schema, mastery/evidence/progression logic, catalog data, activity identity, asset binary, character runtime, or background runtime changed.

Issue #83 now correctly tracks only remaining physical-device acceptance. No separate account/UI action is required to make secret scanning merge-blocking.

## 5. Remaining governance / acceptance work

This closure does not imply every governance item is complete.

Still open:

- approving-review count remains zero;
- `Mobile route QA (Chromium)` runs in CI but is not directly listed as a ruleset-required context;
- legally reviewed executable CLA/signature workflow remains future governance work;
- physical iPhone/Safari and Android/Chrome acceptance remains pending issue #83;
- Iqro expert review remains external to engineering closure.

These remaining items must not be confused with the now-closed secret-scan enforcement gap.
