# Expansion Batch 16 Progress — Performance / Accessibility / Security / Device QA

Date: 11 September 2026

## Status

**IN PROGRESS — AUTOMATED HARDENING COMPLETE IN PRODUCTION; REPRESENTATIVE PHYSICAL-DEVICE ACCEPTANCE PENDING**

Batch 16 does not add catalog content or change learning-evidence semantics. Its automated performance, accessibility, security, responsive-browser, dependency, secret-scan, and production-smoke hardening is now merged and live. Batch 16 is intentionally **not** marked complete until representative physical-device evidence is recorded.

```text
Implementation PR:       #80
PR head:                32ff7389b2755436f448f41bfbf476df894f569d
Main SHA:               8193bccbab8293ec7e30fb4de54a0f86537cfa59
Main CI:                #318
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The post-merge Cloudflare smoke verified the exact main SHA `8193bccbab8293ec7e30fb4de54a0f86537cfa59` on the canonical public deployment.

## Automated performance baseline

Batch 16 adds `scripts/run-batch16-build-budget.mjs` to production-build CI and the mobile-browser build path.

Current production-build observations from CI #317/#318 remain comfortably inside the explicit regression budgets:

| Metric | Observed | Budget |
| --- | ---: | ---: |
| Largest static JavaScript chunk | 0.35 MiB | <= 5 MiB |
| Total static JavaScript | 2.03 MiB | <= 18 MiB |
| Root/main JavaScript | 0.42 MiB | <= 2 MiB |
| App entry JavaScript | no entry above gate | <= 3 MiB per entry |

The gate also verifies:

- MediaPipe executable code remains behind dynamic `import()` boundaries in the vision overlay/runtime;
- type-only MediaPipe imports remain allowed because they disappear from runtime JavaScript;
- `AudioManager` construction does not eagerly call the remote `/api/tts` endpoint before user interaction.

These budgets are regression ceilings, not claims that every device/network has identical load time or responsiveness.

## Automated accessibility and lazy-load hardening

`Mobile route QA (Chromium)` now keeps the existing seven-width responsive matrix and adds representative Batch 16 checks under `prefers-reduced-motion: reduce`.

Representative routes validate:

- document language remains `id`;
- visible images have an `alt` attribute;
- visible form inputs/selects/textareas have an accessible label;
- focusable controls are not trapped inside `aria-hidden="true"` content;
- repeated keyboard `Tab` navigation reaches an actual focus target;
- long animation/transition durations are suppressed under reduced-motion preference;
- representative non-vision routes do not eagerly request MediaPipe/landmarker/WASM/task assets;
- representative routes do not eagerly request `/api/tts` before user interaction.

The existing overflow, framework-overlay, browser-console/page-error, route-boundary, runtime-representative, and phone touch-target checks remain in force.

## Automated security hardening

Batch 16 adds `scripts/run-batch16-security-tests.mjs` to the canonical Ubuntu quality path.

The regression gate now locks the following boundaries:

- client modules may not reference server-only service/API credential names;
- the repository raw-HTML surface remains limited to the two reviewed sinks in article rendering and the static theme bootstrap;
- article HTML must pass through the repository sanitizer and JSON-LD through the safe serializer;
- sanitizer URL schemes and blocked active-embed tags remain constrained;
- the theme bootstrap script cannot interpolate runtime/user-controlled values;
- every migration occurrence of `SECURITY DEFINER` must keep a nearby pinned `search_path`;
- `record_learning_attempt(...)` must preserve its explicit revoke/grant boundary and remain unavailable to `anon`;
- browser learning-outbox entries remain account-bound and credential-free;
- the Supabase service-role helper remains server-side and environment-backed.

This complements, rather than replaces, the existing schema/RLS/ownership/RPC/outbox tests, production dependency audit, and full-history secret scan.

## Persistence / catalog impact

Batch 16 automated hardening introduces **no Supabase migration or DDL** and does not change the production catalog.

The production catalog remains:

- 900 playable activities;
- 683 assessed / 217 practice;
- 9 subjects at exactly 100 activities each;
- 46 stages;
- 197 lessons / 197 content packs;
- 200 active skills;
- 8 manifest mechanics.

The existing learning boundaries remain unchanged: completion-only participation cannot fabricate assessed mastery, Drawing/Coloring remain completion-only creative practice, generic Latin tracing remains practice-only, and active Iqro packs remain `expert_required` pending competent human review.

## Physical-device acceptance remains open

Canonical manual matrix: `BATCH16_PHYSICAL_DEVICE_QA.md`.

Physical evidence is still required on at least:

- one physical iPhone with current Safari available to the tester;
- one physical Android phone with current Chrome available to the tester.

The matrix covers real browser chrome/safe areas, orientation, virtual keyboard, finger tracing/drawing/coloring, audio/TTS unlock/replay/fallback, camera allow/deny/recovery/orientation, VoiceOver/TalkBack, text/zoom behavior, and offline/reconnect/session-isolation behavior.

A headless-Chromium pass, responsive desktop mode, or emulator result must not be recorded as physical-device `PASS` evidence.

## Remaining known non-Batch-16 blockers / boundaries

No DDL changed, so the prior Supabase advisor baseline remains applicable:

- the intentional authenticated `SECURITY DEFINER` attempt-recording RPC remains a known security-advisor WARN;
- leaked-password protection remains disabled under the current Supabase configuration/plan;
- the previously observed unused-index advisor items remain informational unless a later query/index review changes that state;
- `Secret history scan` is green but remains a separate account-level required-status-check configuration item unless the GitHub ruleset is changed.

## Decision

The repository/CI/production automated portion of Batch 16 is complete and live on `8193bccbab8293ec7e30fb4de54a0f86537cfa59` with exact-SHA Cloudflare smoke green.

**Batch 16 remains IN PROGRESS. Batch 17 must not start until the required representative physical-device acceptance is actually evidenced or an explicit reviewed blocker is recorded.**
