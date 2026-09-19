# Production Dependency Audit Recovery — 20 September 2026

Status: **CI RECOVERY ACTIVE / SECURITY THRESHOLD PRESERVED / NO DEPENDENCY VERSION CHANGE**

## Trigger

Final Number Line closure verification PR #234 merged to:

```text
main: c023a5757daea7c7948fb09764c672b9c2ff74ea
push CI: #1071 / run 35457323652
```

On the first push-to-main attempt:
- Ubuntu quality passed;
- Windows compatibility passed;
- Chromium mobile/permanent visual QA passed;
- production build passed;
- secret-history scan passed;
- production dependency audit failed before producing a vulnerability report;
- production smoke was skipped because dependency audit is a required upstream gate.

The dependency-audit failure was:

```text
npm audit --omit=dev --audit-level=high
400 Bad Request
POST https://registry.npmjs.org/-/npm/v1/security/audits/quick
Invalid package tree, run npm install to rebuild your package-lock.json
npm error audit endpoint returned an error
```

A targeted retry of only the failed dependency-audit job produced the same registry response.

## Interpretation

This incident did **not** report a high/critical vulnerability.

The installed application tree continued to pass `npm ci`, production build, Ubuntu quality, Windows, Chromium, learning QA, permanent visual QA, and the full runtime test matrix.

npm's own audit documentation states that modern npm first uses the Bulk Advisory endpoint and falls back to the legacy Quick Audit endpoint when the bulk request fails or returns invalid data. The observed failure occurred at that fallback Quick Audit endpoint.

## Recovery

The dependency-audit job is hardened by pinning its audit client to:

```text
npm 11.19.1
```

The recovery intentionally preserves:
- Node 22;
- the existing committed `package-lock.json`;
- the existing `npm ci --no-audit --no-fund` install;
- production-only audit scope via `--omit=dev`;
- blocking severity threshold `--audit-level=high`;
- dependency-audit as a required upstream dependency of production smoke.

It does **not**:
- disable `npm audit`;
- lower the threshold;
- use `continue-on-error`;
- change dependency versions;
- run `npm audit fix --force`;
- rewrite the package lock without evidence.

## Required closure

This recovery is complete only when:
1. recovery PR CI passes with the pinned audit client;
2. all existing product/runtime gates remain green;
3. recovery PR merges exact-head;
4. merged-main CI passes;
5. exact merged-main Cloudflare production smoke passes.

Until then, the Number Line product/runtime closure remains valid, but the final publication commit `c023a575...` has an open CI infrastructure gate.
