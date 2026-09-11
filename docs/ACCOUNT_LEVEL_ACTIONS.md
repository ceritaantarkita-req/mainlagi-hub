# Account-Level Actions

Last reviewed: 11 September 2026

Only actions that genuinely require account/UI or physical-hardware access belong here. Never commit or paste secret values into repository issues, docs, screenshots, logs, or chat.

Canonical external tracker: **issue #83 — `Final external acceptance: physical-device QA and required secret-scan check`**.

## Resolved engineering/production state

```text
repository:          ceritaantarkita-req/mainlagi-hub
canonical branch:    main
production:          https://mainlagihub.my.id/
Supabase project:    estvtgflwkebomsqlolv
region:              ap-southeast-1
status:              ACTIVE_HEALTHY
Batch 17 main SHA:   d27b32124d3df1613c648132aa2f1ff0ed94ebaa
Main CI:             #322
Production smoke:    success, exact SHA
Final contract:      PASS
```

Repository, CI, Cloudflare production, and canonical Supabase work through Batch 17 engineering acceptance are complete.

## Required account action — Protect main

The active `Protect main` ruleset currently requires exactly:

1. `Production build`
2. `Quality gate (Ubuntu)`
3. `Windows compatibility`
4. `Production dependency audit`

`Secret history scan` runs and passes, including main CI #322, but is **not mandatory in the ruleset**.

In GitHub repository Settings, add:

```text
Secret history scan
```

to the required status checks. Do not remove or weaken existing checks.

The connected GitHub API surface can inspect rulesets but does not expose ruleset-administration writes, so this cannot be truthfully completed by the current automation session.

`Mobile route QA (Chromium)` also runs and is green; it is not currently mandatory in the ruleset. The explicit required governance action remains `Secret history scan`.

## Required physical-device acceptance

Canonical matrix: `BATCH16_PHYSICAL_DEVICE_QA.md`.

Full Batch 16/17 product acceptance still requires actual physical-hardware evidence on:

- representative physical iPhone + current Safari;
- representative physical Android + current Chrome;
- browser chrome/safe area/orientation/virtual keyboard;
- real finger trace/drawing/coloring coordinate behavior;
- audio/TTS timing, stop, fallback, and route transitions;
- camera permission, alignment, orientation changes, denial/fallback, and recovery;
- reduced-motion behavior;
- VoiceOver and TalkBack;
- text scaling/zoom where applicable;
- offline -> reconnect reconciliation;
- account/session isolation.

Do not mark a matrix row PASS unless it was actually exercised on the stated physical device/browser and the evidence is recorded.

Headless Chromium or responsive desktop mode is not physical-device certification.

## Live Supabase facts rechecked during Batch 17

- migration registry ends at `batch14_creative_wave_d`; Batches 15–17 have no DDL;
- 900 active/unique activities, 683 assessed / 217 practice;
- nine subjects exactly 100 each;
- 46 stages, 197 lessons/packs, 200 skills;
- creative evidence/runtime drift = 0;
- account/learning ownership tables have RLS enabled;
- `learning_attempt_child_ownership` remains installed;
- `record_learning_attempt(...)` is SECURITY DEFINER with `search_path=public`, authenticated execute = true, anon/public execute = false.

Security advisor still reports only the two known WARN categories:

1. intentional authenticated execution of the protected SECURITY DEFINER attempt RPC;
2. leaked-password protection disabled.

Performance advisor reports 17 `unused_index` INFO items and no WARN regression.

Do not change the intentional RPC boundary merely to silence the advisor; any replacement must preserve ownership/content/evidence validation and fail-closed semantics.

## Supabase leaked-password limitation

Leaked-password/HIBP protection is currently disabled. Existing mitigation remains minimum password requirements and secure/current-password change behavior. Revisit when account/plan capability permits.

## Optional controlled browser acceptance

These are useful additional human acceptance exercises but do not replace the physical-device matrix:

### Real cloud child lifecycle

1. sign in with a controlled test account;
2. create a disposable child profile;
3. verify persistence after reload/new session;
4. complete a measurable activity;
5. verify Parent Progress/Report cloud state;
6. soft-delete the disposable profile.

### Offline reconciliation

1. sign in with a controlled account;
2. load the app, then go offline;
3. complete a measurable activity;
4. confirm pending/local history remains visible;
5. reconnect;
6. confirm the account-bound outbox reconciles to cloud state.

Automated outbox/isolation contracts are already green; this exercise is end-user integration evidence.

## Branch hygiene

After merged branches are no longer needed, delete merged/superseded remote branches while preserving `main` and any intentionally unmerged branch carrying unique work. The current connector does not expose remote-branch deletion, so do not claim cleanup if it was not actually performed.

## Periodic governance review

Periodically recheck:

- required status checks;
- Dependabot/security alerts;
- secret scanning/push protection;
- Private Vulnerability Reporting;
- Cloudflare Git integration permissions and secrets;
- Supabase Auth security settings;
- deployment history/custom domain state;
- physical-device compatibility after significant browser/runtime changes.

Full external acceptance may be marked complete only after issue #83's required conditions are actually resolved or explicitly accepted as reviewed governance exceptions.