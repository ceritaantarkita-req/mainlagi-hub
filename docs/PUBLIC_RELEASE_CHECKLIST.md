# Public Repository Readiness & Ongoing Audit Checklist

Last reviewed: 22 September 2026

`ceritaantarkita-req/mainlagi-hub` is Public. This checklist separates verified engineering/release evidence from remaining external physical-device acceptance.

Canonical external tracker: issue #83 — `Final external acceptance: physical-device QA`.

## Latest verified engineering release

```text
main SHA:               6fd9e3fc7ffa57aab687b5529033f1a995e0e5ba
Governance hardening PR: #269
Main CI:                #1209 / run 35625953536
Production smoke:       success, exact SHA
Supabase target:        estvtgflwkebomsqlolv
Final acceptance gate:  PASS
Physical-device cert:   PENDING_EXTERNAL_EVIDENCE
```

## Release-critical engineering state

- [x] Canonical repository/branch are `ceritaantarkita-req/mainlagi-hub` / `main`.
- [x] Cloudflare Git integration deploys canonical `main`.
- [x] OpenNext production build is a permanent CI gate.
- [x] Ubuntu quality gate is active.
- [x] Windows compatibility gate is active.
- [x] Production dependency audit is active.
- [x] Full-history pinned Gitleaks runs and passes both as standalone `Secret history scan` and inside ruleset-required `Production dependency audit`, making secret-scan failure merge-blocking.
- [x] Chromium mobile-route/accessibility/lazy-load QA is active.
- [x] Batch 16 production JS/lazy-load budgets are active.
- [x] Batch 16 security-boundary regressions are active.
- [x] Batch 17 final acceptance contract is active.
- [x] Exact-commit Cloudflare smoke verifies SHA, branch, site URL, backend, and canonical Supabase project ref.
- [x] Offline authenticated outbox, account ownership, multi-child isolation, mastery, awards/certificates, Parent reporting, and adaptive-learning contracts remain regression tested.
- [x] Canonical Supabase live state was reverified during Batch 17 and matches repository counts/contracts.

## Final catalog/evidence state

- [x] 9 subjects / 9 paths.
- [x] 46 stages.
- [x] 197 lessons.
- [x] 197 content packs.
- [x] 900 unique playable activities.
- [x] Every subject exactly 100 activities.
- [x] 683 assessed / 217 practice.
- [x] 200 active skills.
- [x] Exact runtime inventory is regression locked.
- [x] Every activity has exact content-pack coverage.
- [x] Drawing/Coloring remain practice-only with `completion_only_v1` evidence.
- [x] Generic Latin tracing remains completion-only until a validated evaluator exists.
- [x] Iqro remains `expert_required`; engineering success is not expert religious-learning approval.

## Live Supabase verification

- [x] Project `estvtgflwkebomsqlolv` is `ACTIVE_HEALTHY` in `ap-southeast-1`.
- [x] 900 active/unique activities live.
- [x] 683 assessed / 217 practice live.
- [x] 9 subjects exactly 100 each live.
- [x] 46 stages / 197 lessons / 197 active+unique packs / 200 active+unique skills live.
- [x] Creative evidence drift = 0.
- [x] Drawing/Coloring runtime drift = 0.
- [x] Relevant account/learning tables have RLS enabled.
- [x] `learning_attempt_child_ownership` trigger is present.
- [x] `record_learning_attempt(...)` is SECURITY DEFINER with `search_path=public`, authenticated execute allowed, anon/public denied.
- [x] Migration registry remains through Batch 14 Wave D; Batches 15–17 add no DDL.

## Advisor state

- [x] Security advisor has no new Batch 17 regression.
- [x] The intentional authenticated SECURITY DEFINER RPC warning remains documented and regression protected.
- [x] Leaked-password-protection warning remains documented as a current platform/configuration limitation.
- [x] Performance advisor currently has 17 `unused_index` INFO observations and no WARN regression.

Do not remove indexes merely because they are currently reported unused; evaluate query history/workload first.

## Repository / licensing baseline

- [x] Repository visibility is Public.
- [x] Source declares `AGPL-3.0-only`.
- [x] `LICENSE`, `NOTICE.md`, `OPEN_CORE.md`, `COMMERCIAL_LICENSE.md`, and `TRADEMARKS.md` exist.
- [x] Community/Plus/School code boundaries are documented.
- [x] Contributor-rights strategy is documented in `CLA_POLICY.md`.
- [ ] Legally reviewed executable CLA/signature workflow remains future governance work; a policy document is not a signed agreement.

## Secret / credential posture

- [x] Full Git history passes pinned Gitleaks scanning.
- [x] Client code is regression-protected from server-only credential names.
- [x] Learning outbox is credential-free and account-bound.
- [x] Service-role usage is server-only/environment-backed.
- [x] `/api/health` exposes no secret values.
- [ ] Continue periodic archived-log/secret-scanning review as operational hygiene.

## Child privacy / data handling

- [x] Parent routes require server-verified authentication when Supabase is configured.
- [x] Real child routes enforce account ownership and reject deleted/foreign child IDs.
- [x] Guest mode remains local-only.
- [x] No pronunciation microphone recording/upload was introduced.
- [ ] Any future microphone, external AI/OCR, continuous camera upload, or child-media feature requires explicit privacy/consent review.
- [ ] Do not commit real child photo/video/audio without documented authorization and distribution rights.

## Asset provenance

- [x] Affiliate provenance controls exist.
- [x] Unverified local affiliate imagery is fail-closed.
- [x] Asset provenance validation runs in CI.
- [ ] Continue provenance review for future artwork, fonts, models, datasets, audio, and generated assets.

## GitHub Protect main

Verified active controls:

- [x] default branch targeting;
- [x] no bypass actors;
- [x] pull request required;
- [x] conversation resolution required;
- [x] squash only;
- [x] strict/up-to-date required checks;
- [x] linear history;
- [x] deletion protection;
- [x] non-fast-forward protection;
- [x] required `Production build`;
- [x] required `Quality gate (Ubuntu)`;
- [x] required `Windows compatibility`;
- [x] required `Production dependency audit`;
- [x] **merge-blocking secret scan** — PR #269 embeds pinned full-history Gitleaks inside ruleset-required `Production dependency audit`; PR CI #1208 and main CI #1209 passed the embedded gate.

The standalone `Secret history scan` context remains separate for visibility. The ruleset itself still directly names four contexts, and approving-review count remains zero.

## Physical-device product acceptance

Automated browser gates are green, but full hardware acceptance is still open.

- [ ] physical iPhone + current Safari core routes;
- [ ] physical Android + current Chrome core routes;
- [ ] safe areas/browser chrome/orientation/virtual keyboard;
- [ ] trace/drawing/coloring real finger coordinates;
- [ ] audio/TTS timing/stop/fallback;
- [ ] camera permission/alignment/orientation/recovery/fallback;
- [ ] reduced-motion behavior;
- [ ] VoiceOver;
- [ ] TalkBack;
- [ ] text scaling/zoom;
- [ ] offline -> reconnect reconciliation;
- [ ] account/session isolation on representative hardware.

Canonical matrix: `BATCH16_PHYSICAL_DEVICE_QA.md`.

Headless Chromium/responsive desktop evidence must not be relabeled as physical-device certification. This is the other external item in issue #83.

## Optional controlled end-user browser acceptance

- [ ] disposable real-child create/use/report/delete exercise;
- [ ] intentional signed-in offline -> online reconciliation exercise.

The underlying ownership/outbox/isolation behavior is already covered by automated tests; these items provide additional end-user integration evidence.

## Branch/project-state hygiene

- [x] `main` is the canonical product branch.
- [x] Persistent `develop` is not part of the workflow.
- [x] Branch lifecycle policy is documented.
- [ ] Delete merged/superseded remote branches when possible; the current connector does not expose branch deletion, so cleanup must not be claimed unless actually performed.

## Final status

All repository/code/CI/Cloudflare/Supabase work through Batch 17 engineering acceptance is complete and production-verified.

Full product acceptance remains **PENDING issue #83** because representative physical-hardware evidence remains external. The prior secret-scan enforcement gap is closed by PR #269.