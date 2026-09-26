# Mainlagi Hub

**Mainlagi Hub** adalah platform belajar dan edutainment untuk anak usia **3–7 tahun** yang mempertahankan motion/vision engine Mainlagi sebagai salah satu runtime, bukan sebagai satu-satunya cara belajar.

Status: **public open-source core, active development**. Source repository menggunakan `AGPL-3.0-only`; jalur commercial/paid dapat memakai terms terpisah.

## Production

```text
GitHub protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> https://mainlagihub.my.id/
```

Production tidak memakai VPS/SSH sebagai jalur canonical.

## Current baseline — 25 September 2026

Current source-of-truth branch is `main`:

```text
current main docs checkpoint:          28ce12883802c92ba268029a8b3d8f3847cc1b0f  (#327)
latest semantic production checkpoint: 1e27869dfc71186e83ed8bb0a4dff2ca44dddfc9  (#324)
semantic merged-main CI:               #1610 / run 36036726413 — full success
Cloudflare semantic exact smoke:       PASS
```

The docs-only current-main checkpoint does not replace the implementation verification evidence recorded by its underlying closed waves.

Mainlagi Belajar WS-05 Logic repeating-pattern reuse is **FULLY CLOSED / MERGED / LIVE VERIFIED** via PR #273 -> `709e2b7d3e529cf37f10a05e9c9dc92884e0a781`; final PR CI #1321 and merged-main CI #1353 passed, including exact-SHA Cloudflare production smoke.

Current learning/product baseline:

- 9 subjects;
- 900 activities;
- 900/900 gameplay-classified;
- 47 active gameplay patterns;
- no approved Pattern #48;
- 683 assessed / 217 practice;
- 46 stages;
- 197 lessons;
- 197 content packs;
- 200 active skills.

Product UX work completed in the current WS-13 sequence includes canonical component/warning audit, child home/navigation + 3-column subject directory, activity gallery + QA unlock, shared completion, matching randomization, first-instruction narration latency, and parent/profile/settings responsive redesign.

**Character production/development is resumed/authorized.** Mainlagi World is now a first-class domain of the same Mainlagi product system. The five-character source bank uses isolated SVG states, while runtime activation remains gated by provenance/sanitization/validation.

Current subjects:

1. Bahasa Indonesia
2. English
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

Current frontend uses the Garden/Playroom visual system, responsive child and parent shells, child profile + continue-learning flow, subject/activity browsing, stage/progression protection, reusable activity runtimes, parent reporting, and retained motion games.

Learning visual containment/readability is **merged/live verified** through PR #294. Semantic P0 production integration through PR #324 approved 14/17 source/license-clear assets; Session 10 migrated the registry to SVG-aware v2, Session 11 promoted all 14 approved semantic SVGs, Session 12 activated the centralized fail-closed SVG resolver, and Session 13 completed responsive/browser verification through PR #350 -> main `d9fba856e3819c2a0f353624f5255f84c27bef9a` with merged-main CI #1695 + Cloudflare smoke. Current state is 14 approved SVGs + 14 preserved WebP rollback/history + 3 held + runtime `controlled-svg` + approved consumer coverage 14/14. The next SVG wave is Session 14 repository-wide approved-SVG sweep.

See `docs/CURRENT_STATE.md` for the canonical current handoff and `docs/SVG_NATIVE_ASSET_POLICY_2026-09-25.md` for the current asset-format policy.

## Retained Mainlagi games

Sepuluh motion/game experiences tetap dipertahankan dan dapat digunakan sebagai activity runtime atau direct game experience:

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

Canonical definitions: `src/lib/data/games.ts`.

## Learning architecture

```text
Account / Household
└── Child Profile
    └── Subject
        └── Learning Path / Stage
            └── Lesson
                └── Activity
                    └── Learning Attempt
                        └── Skill Evidence
                            └── Skill Mastery
                                └── Progress / Recommendation / Parent Report
```

Completion, reward/stars, and mastery are separate concepts. Drawing/Coloring remain practice/completion-only unless a validated assessed evidence model exists. Legacy `game_sessions` and `game_scores` are not reinterpreted as academic mastery.

## Activity runtimes

Current 900-activity inventory includes:

- `tap_choice`
- `listen_and_choose`
- `matching`
- `trace`
- `story`
- `motion_game`
- `coloring`
- `drawing`

The next phase prioritizes **quality and variety of the existing 900 activities**, not increasing the count.

## Current product-quality priorities

Canonical execution plans:

- [`docs/PRODUCT_UX_NEXT_WORK_2026-09-20.md`](docs/PRODUCT_UX_NEXT_WORK_2026-09-20.md) for the active product-UX sequence;
- [`docs/NEXT_PRODUCT_QUALITY_PLAN.md`](docs/NEXT_PRODUCT_QUALITY_PLAN.md) for broader product/gameplay quality gates.

Immediate priorities are:

- preserve the closed WS-05 Logic `pattern_completion` reuse baseline; any next mechanic work starts from a fresh objective/evidence audit;
- execute the unified World + character integration without changing Belajar mastery/progression semantics;
- use direct SVG production/runtime for assets whose canonical approved source is already SVG;
- execute Session 14 repository-wide approved-SVG sweep before considering any verified cleanup of redundant WebP derivatives;
- keep raster-native subject backgrounds as their existing responsive WebP set;
- English narration quality after the completed first-instruction latency wave;
- continued visual/usability cleanup without weakening progression/evidence;
- real-device/accessibility acceptance and Iqro expert review;
- repository/security/governance hardening.

WS-05 Logic repeating-pattern runtime reuse is **fully closed/live verified** through PR #273 -> main `709e2b7d...`, merged-main CI #1353. Production truth is 900/900 activities, 47 active patterns, `choice_grid` 174, `pattern_completion` 10, KEEP 900, exact five-ID Logic scope and no Pattern #48.

**Quality first. Quantity later.**

## Motion/vision architecture

```text
Shared browser vision runtime
├── MediaPipe Hand Landmarker
├── MediaPipe Pose Landmarker
├── optional face signal
├── player assignment / hand ownership
├── gesture latch / smoothing
└── body-action classification
```

Motion remains a first-class optional capability. Core learning must remain usable on phone/tablet without requiring motion capture.

## Voice/audio direction

Fixed lesson narration should prefer **pre-generated, human-reviewed audio assets**. Runtime TTS is a fallback for genuinely dynamic content. Voice/model/provider choice must remain behind an abstraction and every engine/model/voice licence must be reviewed before commercial use.

Iqro/Hijaiyah pronunciation requires competent human review and must not treat generic TTS as final authority.

## OCR + AI — planned, not current priority

OCR/AI remains a modular future capability. It must not block current touch-first learning or replace deterministic runtimes where they are sufficient.

Requirements include:

- server-side provider keys only;
- no `NEXT_PUBLIC_` secret;
- no automatic raw-camera upload;
- payload minimization and explicit privacy boundaries;
- configurable provider/model.

See [`docs/AI_OCR_OPENROUTER.md`](docs/AI_OCR_OPENROUTER.md).

## Local setup

Requirements:

- Node.js 20.9+
- npm 10+
- Chrome/Edge modern
- `localhost` or HTTPS for camera access

```bash
git clone https://github.com/ceritaantarkita-req/mainlagi-hub.git
cd mainlagi-hub
npm ci
cp .env.example .env.local
npm run dev
```

Never commit `.env.local`, Supabase service-role keys, provider/API keys, Cloudflare tokens, or other credentials.

## Quality gates

Use repository scripts as the source of truth. Important aggregate/local commands include:

```bash
npm run check
npm run test:learning
npm run qa:local:product
npm run build:cloudflare
npm audit --omit=dev --audit-level=high
```

CI also covers Windows compatibility, mobile Chromium QA, production build/budgets, dependency audit, secret-history scan, and exact-SHA Cloudflare production smoke.

Physical-device testing is still required; headless CI cannot certify real touch, camera, Safari/Chrome device behavior, VoiceOver/TalkBack, or device audio quality.

## Privacy and safety

Mainlagi is child-facing software. Changes involving camera, child profiles, analytics, audio/voice, OCR, or AI must use:

- data minimization;
- least privilege;
- explicit server/client boundaries;
- no raw-camera retention by default;
- RLS/server authorization for cloud data;
- bounded external-provider input/output;
- auditable dependencies, models, assets, and licences.

See [`SECURITY.md`](SECURITY.md).

## Open source + commercial edition

Source code is released under **GNU Affero General Public License v3.0 only (`AGPL-3.0-only`)**, except files that explicitly state another licence.

AGPL permits commercial use when its obligations are followed. Mainlagi may separately offer commercial terms, services, premium/proprietary content, assets, or licences.

Software-code licensing does not automatically grant rights to Mainlagi trademarks, character artwork, voice identities, or proprietary premium content.

See:

- [`LICENSE`](LICENSE)
- [`OPEN_CORE.md`](OPEN_CORE.md)
- [`COMMERCIAL_LICENSE.md`](COMMERCIAL_LICENSE.md)
- [`TRADEMARKS.md`](TRADEMARKS.md)
- [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)

## Canonical documentation

Start with [`docs/README.md`](docs/README.md), then read:

- [`docs/NEXT_PRODUCT_QUALITY_PLAN.md`](docs/NEXT_PRODUCT_QUALITY_PLAN.md)
- [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md)
- [`docs/PROJECT_STATE_SYNC_2026-09-20.md`](docs/PROJECT_STATE_SYNC_2026-09-20.md)
- [`docs/PRODUCT_UX_NEXT_WORK_2026-09-20.md`](docs/PRODUCT_UX_NEXT_WORK_2026-09-20.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`](docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md)
- [`docs/LEARNING_ATTEMPTS_MASTERY.md`](docs/LEARNING_ATTEMPTS_MASTERY.md)
- [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md)

Historical audit/redesign documents describe the state at the time they were written and must not override the canonical current-state documents above.

## Disclaimer

Mainlagi Hub is actively developed software and is not a replacement for teachers, parents/guardians, healthcare professionals, or professional developmental assessment. Product learning signals are internal educational signals, not medical or intelligence diagnoses.
