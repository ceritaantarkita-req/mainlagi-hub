# Activity Character Presentation System — 21 September 2026

Status: **FOUNDATION MERGED / LIVE VERIFIED / CHARACTER DEVELOPMENT RESUMED / SVG RUNTIME MIGRATION PENDING**

This document defines how Mainlagi activity characters sit above the now-live subject-background system.

## Goal

- keep characters as a dynamic foreground presentation layer;
- never bake Naya, Gian, Zia, Paca, or Gavi into gameplay background art;
- let subject presentation prefer an appropriate character pair without changing curriculum, answers, mastery, evidence, progression, or activity identity;
- fail closed to production-approved artwork when a preferred character does not yet have an approved runtime asset.

## 25 September 2026 shared-character update — CURRENT DECISION

Character development is resumed/authorized for the unified Mainlagi integration. The target is one shared character runtime for Naya, Gian, Zia, Paca and Gavi using reviewed **single-character SVG assets directly**.

Locked states: `hero`, `welcome`, `pointing`, `thinking`, `correct`, `try_again`, `celebrate`. `hero` is neutral/default.

The project owner confirmed `gavi-panel-hero.svg` as the canonical Gavi hero source. Design-set SVGs and the Illustrator collection remain reference/master assets only.

Target presentation behavior:

- entry/greeting -> `welcome`;
- neutral/default card or quiet story -> `hero`;
- guide/hint -> `pointing`;
- waiting/considering -> `thinking`;
- correct feedback -> `correct`;
- retry -> `try_again`;
- lesson/stage completion -> `celebrate`.

Subject pairing remains Bahasa Gavi+Paca; English Naya+Zia; Math Gian+Paca; Iqro/Huruf/Logic/Science Gavi+Paca; creative workspaces may hide decorative characters.

Petualangan Uang keeps Gavi+Paca as authored cast. Do not force all five characters into the existing story. Home may use the full five-character cast once exact assets are production-approved.

Runtime must resolve only repository-approved production SVG paths; never fetch Drive files directly and never inject unsanitized raw SVG markup. Existing Gavi/Paca Garden WebP paths remain temporary fallback until the SVG migration is verified.

The sections below describe the **current pre-migration implementation baseline** where relevant; they do not override this 25 September target decision.

---
## Current implementation asset truth (pre-SVG migration)

Approved activity foreground assets currently available in the repository:

- `/artwork/garden-gavi.webp`;
- `/artwork/garden-paca.webp`.

Naya, Gian, and Zia have reviewed **design/reference sheets** in the project Google Drive workflow:

- `kak-naya-character-design-set-v1.png`;
- `gian-character-design-set-v1.png`;
- `zia-character-design-set-v1.png`.

Those three files are multi-view / expression / pose design sheets on a white canvas. They are useful as identity references, but they are **not direct production foreground sprites** and must not be wired into runtime as-is.

Production binary/provenance contract: [`CHARACTER_ASSET_PIPELINE.md`](CHARACTER_ASSET_PIPELINE.md).

Before Naya/Gian/Zia activation, each character still needs:

1. an isolated production-ready full-body asset;
2. transparent background;
3. approved pose/silhouette at child activity scale;
4. visual consistency review against the design sheet;
5. provenance/redistribution record;
6. responsive screenshot QA.

## Current subject preferences

Only previously established pairings are encoded as future preferences. Subjects without an approved pairing remain on the current mascot pair.

| Subject | Preferred pair | Current runtime pair |
| --- | --- | --- |
| Bahasa Indonesia | Gavi + Paca | Gavi + Paca |
| English | Naya + Zia | Gavi + Paca (fail-closed) |
| Matematika | Gian + Paca | Gavi + Paca (fail-closed for Gian) |
| Iqro | Gavi + Paca | Gavi + Paca |
| Huruf & Menulis | Gavi + Paca | Gavi + Paca |
| Logika | Gavi + Paca | Gavi + Paca |
| Sains | Gavi + Paca | Gavi + Paca |
| Mewarnai | Gavi + Paca | hidden in creative workspace |
| Menggambar | Gavi + Paca | hidden in creative workspace |

This table is presentation-only. It does not make a guide character the child's profile identity.

## Runtime architecture

`src/lib/learning/activityVisualTheme.ts` owns subject scene resolution, subject character preference, and fail-closed presentation fallback.

`src/lib/learning/characterAssets.ts` is the canonical activity-character asset lifecycle gate. It records all five character IDs and distinguishes:

- `approved` — a concrete runtime path may resolve;
- `reference-only` — design/reference material exists but no runtime path may resolve.

Current registry truth keeps **Gavi/Paca = approved** and **Naya/Gian/Zia = reference-only**.

`ResolvedActivityVisualTheme` includes a `characters` presentation object with:

- `preferredIds`;
- `runtimeCharacters`;
- explicit `source`:
  - `subject-preference` when both preferred assets are approved;
  - `approved-fallback` when one or more preferred assets are unavailable.

`GardenActivityFrame` no longer hardcodes Gavi/Paca file paths. It renders the resolved character slots generically and exposes diagnostic attributes:

- `data-character-source`;
- `data-character-left`;
- `data-character-right`;
- per-image `data-character-id` and `data-character-side`.

The existing visual layout remains unchanged while only Gavi/Paca are production-approved.

## Creative workspace rule

Coloring and Drawing continue to use their subject scenery, but decorative foreground characters remain hidden in workspace mode so they do not compete with the canvas/tools.

## Fail-closed rule

A preferred character may not render until `characterAssets.ts` marks it `approved` **and** exposes a concrete `runtimeSrc`. Merely adding a file under `public/artwork` must not activate a character.

Example:

- English prefers Naya + Zia;
- neither currently has a production foreground file;
- runtime therefore stays Gavi + Paca;
- once both are approved and entered into the allowlist, English can switch without activity-specific hardcoding.

The same rule applies to Math's future Gian + Paca pair.

## Regression contract

The visual-theme regression must verify:

- all 900 activities still resolve deterministically;
- two foreground character slots resolve for normal Garden activities;
- the canonical five-character registry is complete;
- only `approved` registry entries can expose a runtime path;
- Naya/Gian/Zia remain `reference-only` with `runtimeSrc=null` until explicit production approval;
- only production-approved asset IDs are returned;
- the same character cannot occupy both slots;
- GardenActivityFrame contains no hardcoded Gavi/Paca runtime path;
- creative workspace CSS hides the generic character layer;
- English remains fail-closed to Gavi/Paca until Naya/Zia production assets are approved.

## Non-goals

This foundation does not:

- approve Naya/Gian/Zia production artwork;
- infer new subject pairings that were not already established;
- change child profile/guide identity;
- change coloring content;
- change narration identity;
- change learning evidence/mastery/progression/schema.

## Merge / production verification

The character-presentation foundation is merged through PR **#259** at `b5acbfcde66ea1451f3e55a8d469d33ba4845af1`.

Merged-main CI **#1190 / run `35589937017`** passed the quality gate, production build, mobile-route/permanent visual QA, Windows compatibility, dependency audit, and exact Cloudflare production smoke.

This closes the architecture/fail-closed foundation. It does **not** approve Naya/Gian/Zia artwork for runtime.

## Paused gate / resume conditions

The production asset directory, machine-readable provenance registry, and blocking character-asset validator remain the pre-activation gate. No human production binary is approved or activated by that infrastructure alone.

**Character production/development is currently paused by the project owner. Do not execute the steps below until an explicit resume instruction is given. Mainlagi World is developed separately and is not part of this character workstream.**

When explicitly resumed, execute the human-character production wave in this order:

1. lock the production character specification against the reviewed Naya/Gian/Zia design sheets;
2. create isolated transparent full-body runtime assets with stable scale, silhouette, pose and identity;
3. record provenance, ownership and redistribution status for each production file;
4. review visual consistency against the design references;
5. run responsive activity screenshots and check that foreground characters never cover instructions, choices, canvas/tools or completion controls;
6. activate only approved assets through the central approved-character map/resolver;
7. verify English -> Naya + Zia and Math -> Gian + Paca while preserving fail-closed fallback for any missing asset;
8. keep all other subject pairings unchanged until separately approved.

The **five-character homepage hero is a separate composition task**. It should use the same approved production identities, but it must not be treated as the source asset for activity foreground characters or finalized from unapproved human-character sprites.

The paused character gate does not block separately approved Mainlagi Belajar work such as English narration quality, learning-illustration consistency, public/parent information architecture cleanup, or external physical-device acceptance. Any such work should be opened as its own scoped wave.
