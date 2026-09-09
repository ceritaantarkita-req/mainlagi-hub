# Architecture — Mainlagi Hub

This document separates **current implemented architecture** from **planned platform architecture**. Planned layers must not be described as production-ready until they exist in code and pass the repository quality gates.

## 1. Current implemented architecture

```text
Next.js App Router
├── Platform shell
│   ├── public pages
│   ├── auth/account
│   ├── discover/articles
│   ├── affiliate redirect/catalog
│   └── owner admin
├── GameShell + Preflight
├── 10 internal game experiences
├── Shared interaction/game engine
└── Shared browser vision runtime
    ├── camera stream
    ├── Hand Landmarker
    ├── Pose Landmarker
    ├── optional face signal
    ├── player assignment
    ├── hand ownership / primary-hand stabilization
    ├── gesture latch / smoothing
    └── body-action classifier
```

The current motion/vision engine is a retained core capability. Product expansion must integrate with it rather than replacing it without a demonstrated technical reason.

## 2. Current game layer

The canonical list is `src/lib/data/games.ts` and currently contains 10 internal experiences:

1. Math Pilih Jawaban
2. Math Motion Battle
3. Number Trace Adventure
4. Shape Quest
5. Pattern Race
6. Math Warung
7. Iqro Motion
8. AirBoard Presenter
9. Beat Motion
10. Run to Target

All continue to use internal `/play/[slug]` routes.

## 3. Vision modes

- `hand`: writing, tracing, whiteboard, or other hand-first interaction.
- `pose`: full-body interaction.
- `hybrid`: hand + pose ownership/association or multiplayer interaction.

Models are loaded according to the active runtime need rather than running every detector unconditionally.

## 4. Player assignment

One player maps to Player A and owns the full arena.

For supported two-player experiences:

1. Stable body observations initialize/maintain player slots.
2. Temporal tracking prevents raw detector ordering from casually swapping A/B.
3. Hands are associated with body ownership.
4. Missing observations retain a bounded reacquisition window.
5. The primary hand is stabilized so a second detected hand does not steal an in-progress pinch/drawing state.

## 5. Gesture contract

Typical writing interaction:

```text
pinch start      -> begin stroke
pinch hold       -> append points
pinch release    -> end stroke
open palm hold   -> submit
fist hold        -> clear
```

Gesture state uses hysteresis/debounce/hold behavior to reduce detector chatter and short dropouts.

## 6. Recognition today

Current recognition is activity-specific:

- digit/expected-answer recognition for writing games;
- path scoring for number tracing;
- shape/closure scoring for Shape Quest;
- Hijaiyah shape/dot handling for Iqro Motion;
- dwell/selection for choice activities;
- calibrated body classification for supported pose activities.

There is **no general AI OCR engine in production yet**.

## 7. Data/auth today

- Supabase Auth is used for configured cloud authentication flows.
- Supabase Postgres + RLS backs selected cloud/admin/content paths.
- Canonical Supabase production project is `inmydraft/mainlagi-hub` (`estvtgflwkebomsqlolv`).
- Some family/progress/leaderboard behavior remains local-first in the browser.
- Public content and affiliate data can use Supabase-backed repositories with defined fallbacks.
- Owner routes use a server-side owner gate and service-role operations where required.
- Learning attempts/mastery use the additive `0002`–`0006` schema/function hardening chain above the legacy game tables.

## 8. Learning-platform architecture

The current platform direction for children age 3–7 sits above the retained activity/game runtimes:

```text
Child / Parent identity
└── Learning Profile
    └── Subject
        └── Learning Path / Stage
            └── Activity
                ├── existing motion game/runtime
                ├── tracing
                ├── tap / dwell choice
                ├── matching
                ├── coloring
                ├── listening / audio
                └── future OCR / visual activity
                    -> Learning Attempt
                    -> Skill Evidence
                    -> Skill Mastery
```

Five current subject areas are Bahasa Indonesia, English, Matematika, Iqro, and Mewarnai.

See `docs/PRODUCT_DIRECTION.md` and `docs/LEARNING_ATTEMPTS_MASTERY.md`.

## 9. Planned OCR + AI boundary

OCR/AI must be a **separate engine boundary**, not coupled directly into MediaPipe or individual game components.

Preferred shape:

```text
Activity
  -> OCR request contract
      -> local/deterministic OCR or recognizer when sufficient
      -> optional AI verification/enrichment
          -> server-side OpenRouter adapter
              -> configured model
```

Requirements:

- OpenRouter API key stays server-side.
- No `NEXT_PUBLIC_` secret.
- No automatic raw-camera upload.
- Payload minimization before any external inference.
- Clear timeouts, size limits, error normalization, and provider failure behavior.
- The activity must remain understandable when AI is unavailable whenever practical.

See `docs/AI_OCR_OPENROUTER.md`.

## 10. Security and privacy boundaries

Mainlagi is child-facing software. Any feature that expands data collection or sends data to an external service must be treated as an architecture change, not a minor UI feature.

Required principles:

- least privilege;
- data minimization;
- explicit server/client boundaries;
- no secret values in client bundles;
- no camera-frame retention by default;
- RLS/server authorization for cloud data;
- bounded inputs and outputs;
- auditable third-party dependencies/providers.

## 11. Canonical production deployment

Production architecture confirmed 9 September 2026:

```text
GitHub `ceritaantarkita-req/mainlagi-hub`
  -> protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

Repository deployment/runtime files:

- `open-next.config.ts`
- `wrangler.jsonc`
- `next.config.mjs` OpenNext Cloudflare dev binding setup
- `package.json` Cloudflare build/preview/deploy scripts

GitHub Actions is the code/security quality gate and validates the OpenNext/Cloudflare production artifact. It does **not** deploy Mainlagi over SSH.

There is no canonical Mainlagi VPS production path. Earlier VPS-oriented workflow/docs are superseded and removed.

Capacitor remains a separate preparation path for a possible future native wrapper; it is not the web production deployment path.
