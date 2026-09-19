# Production Dependency Audit Recovery — 20 September 2026

Status: **FULLY RECOVERED / MERGED-MAIN LIVE VERIFIED / SECURITY THRESHOLD PRESERVED / NO DEPENDENCY VERSION CHANGE**

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

## Root-cause confirmation

This incident did **not** report a high/critical vulnerability.

The installed application tree continued to pass `npm ci`, production build, Ubuntu quality, Windows, Chromium, learning QA, permanent visual QA, and the full runtime test matrix.

The initial Node 22 bundled npm 10.9.8 run surfaced the failure after fallback to the legacy Quick Audit endpoint as `400 Invalid package tree`.

Recovery PR #235 then pinned npm 11.19.1. Its first CI attempt exposed the upstream cause directly at the preferred Bulk Advisory endpoint:

```text
503 Service Unavailable
POST https://registry.npmjs.org/-/npm/v1/security/advisories/bulk
We are currently performing maintenance.
```

This confirms the blocker is npm registry advisory-service availability rather than a newly introduced application dependency or package-lock mutation.

npm documentation states that the Bulk Advisory endpoint is the primary audit endpoint and the Quick Audit endpoint is a fallback when bulk audit fails or returns invalid data.

## Recovery

The dependency-audit job is hardened in three narrow layers:

1. pin the primary audit client to `npm 11.19.1`;
2. retry only explicitly transient registry conditions up to four total npm attempts with bounded backoff;
3. if and only if those attempts all fail for an explicit transient registry condition, run pinned Google OSV-Scanner `v2.3.5` against `package-lock.json` as an independent production-only fallback.

Transient retry is limited to signals such as:
- HTTP 502 / 503 / 504;
- HTTP 429;
- npm registry maintenance;
- `ECONNRESET`;
- `ETIMEDOUT`;
- `EAI_AGAIN`.

A real npm vulnerability result does not match those transient conditions and therefore fails immediately. After a persistent npm advisory-service outage, OSV-Scanner becomes the fallback security gate. Its configuration ignores packages classified as dev-only and otherwise fails on any vulnerability finding, which is stricter than the primary npm high-severity threshold. If OSV installation, OSV service access, parsing, or scanning fails, the CI job fails.

The recovery intentionally preserves:
- Node 22;
- the existing committed `package-lock.json`;
- the existing `npm ci --no-audit --no-fund` install;
- production-only audit scope via `--omit=dev`;
- blocking severity threshold `--audit-level=high`;
- dependency-audit as a required upstream dependency of production smoke;
- fail-closed behavior when neither npm advisory service nor the independent OSV fallback can produce a clean result.

It does **not**:
- disable `npm audit`;
- lower the threshold;
- use `continue-on-error`;
- treat vulnerability findings as transient;
- treat `400 Invalid package tree` as transient under the pinned npm 11 client;
- change dependency versions;
- run `npm audit fix --force`;
- rewrite the package lock without evidence.

## Recovery verification

```text
Recovery PR:              #235
Recovery exact head:      767f09353be48d55f52fe0598b40c2d19f3a7fba
Recovery PR CI:           #1082 / run 35458478740 — full success
Recovery main:            0917b8292986d496f96d4150aef9f1fcf5499c4f
Recovery-main CI:         #1083 / run 35459558615 — full success
Cloudflare production:    exact recovery-main SHA PASS
```

The recovery PR dependency gate completed successfully and reported:

```text
found 0 vulnerabilities
```

Recovery-main CI #1083 also completed the production dependency audit successfully with the hardened npm/OSV workflow.

Exact production proof:

```text
EXPECTED_SHA:
0917b8292986d496f96d4150aef9f1fcf5499c4f

Production is serving expected commit
0917b8292986d496f96d4150aef9f1fcf5499c4f
with canonical Supabase target.
```

Production health:

```text
ok:                 true
service:            motion-learning-hub-mainlagitv-v2
modules:            9
release.sha:        0917b8292986d496f96d4150aef9f1fcf5499c4f
release.branch:     main
siteUrl:            https://mainlagihub.my.id
dataBackend:        supabase
supabaseProjectRef: estvtgflwkebomsqlolv
result:             PASS
```

Recovery-main artifacts:

```text
mobile-route-qa-screenshots
artifact: 10589502912
sha256:c608cdae067e8de516eb689d3d539dc792c3d765b0300435bec2af62963130b8

gameplay-distribution-audit
artifact: 10588812698
sha256:e67ca7d01ad6893459de7b94258c226989f4f58677d7c0dbc3808cd32ec92f49

activity-quality-audit
artifact: 10588677876
sha256:47ac5980aeb0422ace904cfb173f8c9a8f3fdc433740331f9ee6583d9f69a31e
```

## Final decision

The final publication CI infrastructure gate is **FULLY RECOVERED / LIVE VERIFIED**.

The incident was caused by npm advisory-service maintenance, not a newly introduced vulnerability or package-lock mutation.

The blocking production dependency audit remains in place with:
- npm 11.19.1 primary audit;
- production-only `--omit=dev`;
- `--audit-level=high`;
- bounded retry only for explicit transient registry/network failures;
- pinned OSV-Scanner v2.3.5 production-lock fallback when npm advisory service remains unavailable;
- fail-closed behavior on real vulnerability findings, fallback failure, persistent service failure, or unexpected audit errors.

No dependency version, package-lock version, gameplay runtime, curriculum or mastery behavior changed during this recovery.

No further recovery closure gate remains open.
