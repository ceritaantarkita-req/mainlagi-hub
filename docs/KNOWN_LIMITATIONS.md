# Known Limitations

Last reviewed: **25 September 2026**

This file describes current known limitations. Historical ZIP/build-environment limitations belong in historical audit documents and must not be treated as current production state.

## Product/content quality

The catalog contains 9 subjects and 900 activity routes, but route count does not equal pedagogical or visual quality.

Current known issues include:

- many activities still rely on repeated `tap_choice` or `matching` patterns;
- some activity representations do not correctly measure the intended skill;
- some distractors/prompts are too trivial, repetitive, or age-inappropriate;
- Coloring contains duplicate/near-duplicate compositions and some complex scenes degrade visually;
- Drawing scaffolding is inconsistent across the full 100-activity set;
- activity variety needs to improve before expanding the catalog further.

The canonical remediation plan is `NEXT_PRODUCT_QUALITY_PLAN.md`.

## World → Evidence production state

World → Evidence is now **merged / live verified** through PR #312 and production main `ca7f0e77b296682935f9ecbe311cc1028168986f`. CI #1587 / run `35899987986` passed the full matrix including Cloudflare exact-SHA smoke.

Current boundaries:

- only `money-s08-activity-02` is active as supplemental assessed evidence;
- Stage 2 price comparison remains deferred;
- canonical evidence remains age 6–7 only; age 8 stays World completion-only;
- supplemental evidence rows remain `0`;
- no active age-eligible 6–7 or explicit eligible QA/test profile exists, so no synthetic evidence row was fabricated;
- World-only mastery remains capped at `exploring`;
- no second World mapping or broad age migration is authorized;
- `private.world_evidence_activation_registry` has RLS disabled and no policies. Read-only audit confirmed table owner `postgres`; `record_world_skill_evidence(...)` is also owned by `postgres` and is `SECURITY DEFINER`. `anon`/`authenticated` have no direct SELECT/INSERT/UPDATE and no RPC execute; `service_role` has RPC execute but no direct table SELECT/INSERT/UPDATE. RLS hardening remains an explicit operator decision.

Candidate hardening SQL, **not executed**:

```sql
ALTER TABLE private.world_evidence_activation_registry
ENABLE ROW LEVEL SECURITY;
```

Review function-owner/RLS semantics and policy requirements before applying it.

Canonical closure: `WORLD_EVIDENCE_PRODUCTION_CLOSURE_2026-09-24.md`.

## Stage progression vs activity gallery

The 20 September gallery/home work improved hierarchy and added isolated QA-unlock behavior, but the underlying product boundary remains: stage/progression truth and broad child browsing are different concerns.

Current presentation must continue to preserve recommendation, age eligibility, lock reasons and direct-route guards while avoiding an undifferentiated wall of activities. QA unlock must remain isolated from normal production profiles.

## Learning illustration semantic clarity

Learning-visual **containment/readability infrastructure is closed/live verified** through PR #294 -> main `6d0f9bd8972297e316bdf031603d160d901d8d04`, merged-main CI #1531 exact Cloudflare smoke.

The pilot now blocks the defect class where covered learning visuals escape their card/frame, collapse below the readability floor, or push required feedback/CTA outside the supported viewport. Covered pilot surfaces include Activity Gallery, Initial Sound, Picture & Word, Feature/Function and Material Lab.

The remaining limitation is **semantic clarity and cross-platform pictorial consistency**. Recognition-critical content still contains platform emoji/glyph fallbacks whose silhouette or meaning can vary and, in some cases, does not accurately depict the intended concept.

Confirmed examples include:

- English HEAD -> `🙂`;
- English JUMP -> `🤸`;
- Science gills -> `🫧`;
- Science beak -> `👄`;
- Science thick cactus stem -> `💚`;
- Science towel -> `🧺`;
- raincoat and toy-block cases using generic neighboring-object emoji.

The 43-source-file / 280-field emoji inventory remains an inventory signal, not a defect or replacement count. Exact letter/script glyphs, stable instructional symbols and decorative UI must not be swept into the pictorial-art migration.

The semantic illustration registry/provenance gate is closed/live verified through PR #297. The exact nine-item P0 generator and source refinements are closed/live verified through PR #300/#301. The exact-file human review evidence gate is merged through PR #304 -> main `f0b48cbdbe162fd19e0665f4b29945f6aaa16a5f`, with PR CI #1552 full success and merged-main CI #1553 / run `35824198610` full success including exact Cloudflare smoke.

Session 3 froze all **17/17 P0** visual decisions, and the separately authorized production-integration wave has now promoted the **14/17 source/license-clear assets** into exact SHA-bound production WebP binaries. The remaining production limitation is the same three held visuals: car 499718, towel 288034, and raincoat 212019 remain fail-closed for public-repository redistribution. Current state is **14 production approvals / 14 production binaries / 3 held / 0 runtime semantic activation**. Because runtime mapping remains separate, the child-facing learning surfaces may still show their existing glyph/emoji fallbacks until the later activation + visual-regression wave.

**New 25 September format decision:** those 14 approved assets came from canonical SVG sources, so the next implementation should migrate their production binding to the reviewed SVG directly instead of activating the derived WebP as the long-term runtime format. This requires an SVG-aware provenance/validator/path migration first. Existing WebPs remain rollback/history until the SVG runtime is verified. The three held assets stay held; SVG format does not solve missing redistribution rights.

Canonical records:
- `LEARNING_ILLUSTRATION_CONSISTENCY_AUDIT_2026-09-22.md`;
- `LEARNING_VISUAL_CONTAINMENT_CLOSURE_2026-09-23.md`;
- `LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_CLOSURE_2026-09-23.md`;
- `LEARNING_SEMANTIC_P0_SESSION3_STOCK_LIBRARY_APPROVAL_FREEZE_2026-09-24.md`;
- `LEARNING_SEMANTIC_P0_PRODUCTION_APPROVAL_INTEGRATION_2026-09-25.md`.

## Voice and narration

The first-instruction narration latency/preload wave is merged/live verified. English narration quality Wave 1 is also merged/live verified via PR #278 -> main `8d60a69a...`: all 27 English listening activities are explicitly reviewed, 22 vocabulary/letter/phrase activities use target-first spoken copy, 5 comprehension activities retain sentence-level narration, and the browser fallback now prefers higher-quality exact-locale English voices when available.

This is still a browser-dependent fallback improvement. Mainlagi does **not** yet claim final production-quality native Indonesian and English character narration.

The English fixed-narration production-asset gate is **merged/live verified** via PR #280 -> main `2cc7d5be...`, merged-main CI #1372 / run `35701448136` with exact Cloudflare production smoke. The gate locks exact 27-slot provenance metadata, provider/right review fields, human pronunciation/child-learning approval fields, checksum validation, registry/runtime transcript synchronization, and stray-public-audio rejection. It intentionally remains at **27 review-required / 0 approved production audio / 0 production binary / no static runtime activation**.

The four-item provider-pilot **harness** is also merged/live verified via PR #283 -> implementation baseline `4b975130...`, merged-main CI #1396 / run `35719862989` with exact Cloudflare production smoke. It prepares an OpenAI API pilot candidate using pinned `gpt-4o-mini-tts-2025-12-15` plus `marin`/`cedar`, but deliberately generated **0 audio candidates** in the repository wave and did not approve or activate anything.

The four-item **human-review evidence gate** is now also merged/live verified via PR #285 -> main `dd845796...`, PR CI #1412 and merged-main CI #1415 with exact Cloudflare production smoke. It binds human review to the exact generation manifest and candidate SHA-256 values and requires 16/16 listening-rubric checks for `accepted`, but it deliberately cannot approve the production registry, copy audio to `public/`, or activate runtime playback. The current limitation therefore remains actual candidate generation/listening: **0 generated pilot audio / 0 human-reviewed generated pilot audio / 0 approved production audio**.

Remaining work:

- run the prepared four-item local/server-side provider pilot and human-review the exact candidate audio;
- choose/confirm a production provider/model/voice only from reviewed evidence, then approve fixed English narration assets through the existing gate;
- add the later runtime static-audio resolver/playback activation with browser speech fallback;
- define and human-review stable character voice identities separately from the already-live visual character runtime;
- reviewed Indonesian production voices/assets;
- runtime TTS only for justified dynamic content.

Iqro/Hijaiyah pronunciation requires competent human review. Generic TTS must not be treated as final pronunciation authority.

## Character production assets

Character source/provenance/production/runtime foundation and product-surface integration are **closed through Session 09**.

Current verified truth:

- 5 canonical characters × 7 locked states = 35/35 production-approved SVG variants;
- all 35 are exact source/hash/provenance bound under `public/artwork/characters/`;
- Belajar uses the shared SVG runtime;
- Petualangan Uang uses the same runtime with authored Gavi + Paca cast;
- Home uses the approved five-character ensemble;
- Bermain uses shared Gavi + Paca entry/preflight/completion presentation;
- Session 09 PR #340 and merged-main CI #1674 are live verified including Cloudflare production smoke;
- design-set SVGs and the Illustrator collection remain reference/master material only;
- legacy Garden Gavi/Paca WebPs remain compatibility fallback/history.

Character surface coverage is no longer the current blocker. Remaining separate scopes include Motion Engine/game mechanics, voice identity, narration activation, semantic illustration migration, and any future character state/identity. Child profile identity remains separate from guide-character identity.

Canonical Session 08 closure: `MAINLAGI_WORLD_CHARACTER_INTEGRATION_SESSION08_2026-09-25.md`. Canonical Session 09 closure: `MAINLAGI_HOME_BERMAIN_CHARACTER_INTEGRATION_SESSION09_2026-09-25.md`.

## About, FAQ, and affiliate discoverability

`/about`, `/faq`, affiliate redirect/catalog infrastructure, and `/discover/products` already exist.

Current limitations:

- About/FAQ copy still reflects older Mainlagi positioning;
- recommendations are not sufficiently discoverable from primary navigation;
- parent/public information architecture needs cleanup;
- affiliate content must remain outside the child learning flow and retain clear disclosure.

## Physical-device acceptance

Headless/synthetic QA does not prove real-device behavior.

Issue #83 still tracks representative physical validation for:

- iPhone + Safari;
- Android + Chrome;
- touch targets;
- tracing;
- drawing;
- coloring;
- audio/TTS;
- camera permission/recovery/denial;
- orientation and safe areas;
- reduced motion;
- text scaling;
- VoiceOver/TalkBack;
- offline/reconnect/session isolation.

## Iqro expert review

The current Iqro catalog contains 100 activities. Active Iqro content remains `expert_required`; it is not `expert_approved` merely because engineering tests pass.

Human expert review is still required for content, glyph/dot handling, transliteration where present, pronunciation/audio, and pedagogical appropriateness.

## Motion/camera accuracy

Synthetic landmark tests cannot certify every physical environment. Real-camera behavior can vary with:

- device/camera quality;
- lighting/backlight;
- child/adult proportions;
- left/right hand;
- occlusion/crossing hands;
- multi-player positioning;
- long-session camera restart/recovery.

Motion is optional for core learning and must not become a hidden requirement for phone/tablet users.

## Full-body depth

Run to Target estimates forward/back movement from relative torso scale. Standard webcams do not provide true depth sensing. Calibration and physical testing remain necessary.

## AirBoard

Known retained limitations include:

- PDF uses the browser object renderer rather than per-page rendering;
- audience-window synchronization is not a current canonical learning feature;
- screen recording is not a current canonical learning feature.

## Browser/device support

Chrome/Edge are the best-covered automated targets. Real Safari/iOS and Android Chrome acceptance is still part of issue #83.

Automated Chromium checks do not substitute for device-level touch/audio/accessibility testing.

## Affiliate content

Affiliate infrastructure is implemented, including validated redirect and disclosure flow, but operator-managed destinations/assets must be real, valid, and appropriately licensed before being treated as production-quality recommendations.

Affiliate recommendations belong to parent/public surfaces, not child learning activities.

## Repository governance

The protected `main` branch requires PR-based changes and four required CI contexts. The standalone `Secret history scan` is still not directly listed as a ruleset-required context, but PR #269 closed the enforcement gap by running the same pinned full-history Gitleaks scan inside ruleset-required `Production dependency audit`. A secret-scan failure therefore fails a required context and blocks merge.

Remaining governance limitations include approving-review count = 0 and `Mobile route QA (Chromium)` not being directly listed as a required ruleset context. Secret-scan enforcement itself is no longer an open limitation.

## OCR / AI

General OCR/AI learning support is planned, not production-complete, and is **not a priority before the current product-quality work is closed**.

Any future provider integration must keep secrets server-side, minimize child data, avoid automatic raw-camera uploads, and remain optional to core learning.
