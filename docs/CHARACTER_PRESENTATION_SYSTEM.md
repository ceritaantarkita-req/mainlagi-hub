# Activity Character Presentation System — 21 September 2026

Status: **FOUNDATION MERGED / LIVE VERIFIED / HUMAN PRODUCTION ASSETS NOT YET ACTIVATED**

This document defines how Mainlagi activity characters sit above the now-live subject-background system.

## Goal

- keep characters as a dynamic foreground presentation layer;
- never bake Naya, Gian, Zia, Paca, or Gavi into gameplay background art;
- let subject presentation prefer an appropriate character pair without changing curriculum, answers, mastery, evidence, progression, or activity identity;
- fail closed to production-approved artwork when a preferred character does not yet have an approved runtime asset.

## Current production asset truth

Approved activity foreground assets currently available in the repository:

- `/artwork/garden-gavi.webp`;
- `/artwork/garden-paca.webp`.

Naya, Gian, and Zia have reviewed **design/reference sheets** in the project Google Drive workflow:

- `kak-naya-character-design-set-v1.png`;
- `gian-character-design-set-v1.png`;
- `zia-character-design-set-v1.png`.

Those three files are multi-view / expression / pose design sheets on a white canvas. They are useful as identity references, but they are **not direct production foreground sprites** and must not be wired into runtime as-is.

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

`src/lib/learning/activityVisualTheme.ts` now owns:

- subject scene resolution;
- subject character preference;
- approved runtime character asset allowlist;
- fail-closed character fallback.

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

A preferred character may not render until it exists in the production-approved character asset map.

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

## Next gate

Create and review isolated transparent production assets for **Naya, Gian, and Zia** from the approved design references. After those assets pass visual/provenance/responsive QA, activate them through the central approved asset map rather than adding character logic inside individual activity renderers.

## Production closure

The fail-closed character-presentation foundation is live in production.

- implementation PR: **#259**;
- merged main: `b5acbfcde66ea1451f3e55a8d469d33ba4845af1`;
- PR CI: **#1189 / run 35587881989 — full success**;
- merged-main CI: **#1190 / run 35589937017 — full success including exact Cloudflare production smoke**;
- production smoke confirmed `https://mainlagihub.my.id` is serving exact SHA `b5acbfcde66ea1451f3e55a8d469d33ba4845af1` with the canonical Supabase target.

Runtime behavior remains intentionally unchanged for unapproved human artwork: English and Math still fail closed to the approved Gavi/Paca pair until Naya/Zia/Gian production sprites pass the next asset gate.
