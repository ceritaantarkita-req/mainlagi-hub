# Required Secret-Scan Enforcement Closure — 21 September 2026

Status: **FULLY CLOSED / MERGED / LIVE VERIFIED**

## 1. Governance gap

The active repository ruleset `Protect main` requires pull requests, linear history, squash merge, and these four status contexts:

1. `Production build`
2. `Quality gate (Ubuntu)`
3. `Windows compatibility`
4. `Production dependency audit`

The standalone `Secret history scan` job was green but was not itself listed as a required status context. That meant a standalone secret-scan failure was not independently guaranteed to block merge.

The connected GitHub integration can read rulesets but cannot administer them.

## 2. Enforcement implemented

PR **#269** implemented a repository-side equivalent enforcement without weakening the ruleset:

- added `scripts/run-secret-history-scan.sh` as the single pinned Gitleaks full-history scan implementation;
- kept the standalone `Secret history scan` job for visibility;
- changed the required `Production dependency audit` job to checkout full history with `fetch-depth: 0`;
- added `Required full-history secret gate` to that already-required job;
- both jobs use the same pinned Gitleaks `v8.30.1` implementation with redacted output;
- the required dependency job continues to run the production dependency audit after the secret gate.

Therefore a secret-scan failure now fails `Production dependency audit`, which is required by the active ruleset, and blocks merge.

The standalone job is still not directly listed as a fifth ruleset context. The merge-blocking property comes from the scan being embedded in an existing required context.

## 3. Verification

Implementation PR:

```text
PR:        #269
PR head:   60c59cdcae44b756fb43eca36bdfe21ebda42538
CI:        #1208 / run 35625095287
Result:    full success
```

PR evidence included:

- standalone `Secret history scan`: PASS;
- `Production dependency audit` -> `Required full-history secret gate`: PASS;
- dependency audit: PASS;
- Ubuntu quality: PASS;
- Windows compatibility: PASS;
- production build: PASS;
- Chromium route/accessibility/permanent visual QA: PASS.

Merged implementation:

```text
main:      6fd9e3fc7ffa57aab687b5529033f1a995e0e5ba
CI:        #1209 / run 35625953536
Result:    full success
Cloudflare exact production smoke: PASS
```

Merged-main evidence again showed `Required full-history secret gate` passing inside the required `Production dependency audit` job before the dependency audit continued.

## 4. Closure truth

The audit finding “full-history secret scan runs but is not merge-blocking” is **resolved**.

The current contract is:

- standalone full-history scan remains visible;
- the same scan also runs inside a ruleset-required context;
- secret findings are redacted;
- failure of the required secret gate blocks the required dependency check and therefore merge;
- no application/runtime, dependency version, learning schema, mastery, evidence, progression, curriculum, asset, or character behavior changed.

A future administrator may choose to add `Secret history scan` as a separate fifth required context for clearer GitHub UI semantics, but that is no longer required to obtain merge-blocking enforcement.

## 5. Remaining external acceptance

This closure does not close physical-device acceptance. Representative iPhone/Safari and Android/Chrome evidence, real touch/audio/camera/accessibility behavior, and the Iqro expert-review boundary remain separate work.
