# WS-13 — Shared Completion Wave

Date: **20 September 2026**  
Status: **MERGED / LIVE VERIFIED**  
Base when branch opened: `main` = `fc49ca3f26133203024695bee3cf8b973617326e`
Merged PR: **#245** -> `53a5f04c6d5430f3feb6273d42f178c5419fe418`  
Validation: CI **#1128** exact-head success; merged-main CI **#1129** success including **Production smoke (Cloudflare)** for exact SHA `53a5f04`. Manual screenshot acceptance passed at 320px, 390px and 768px after the completion surface was changed to a focused overlay with all primary actions immediately visible.

## Goal

Replace one-off “Pilih permainan lain” success exits with one reusable child completion experience while preserving each mechanic's scoring/evidence logic.

## Shared completion contract

Compatible completed activities receive:

- animated praise selected deterministically from approved short praise copy;
- exactly three visual stars;
- **Back** — returns to the previous same-origin page, with subject fallback;
- **Try Again** — resets the current activity by reload unless the runtime later supplies a custom reset;
- **Next** — opens the next activity in the same stage; at the end of a stage it returns to the subject catalog instead of silently bypassing stage progression;
- **Share** — opens a child-side dialog but social options are released only after a server-verified parent gate.

## Share privacy / parent gate

The share gate is server-side at `/api/parent/share-gate`.

- configured production backend: requires an authenticated parent session;
- local prototype without Supabase: allowed for QA;
- no child name, age, account ID, mastery detail, stars total, or private progress is included in external share text;
- external share content is only a generic Mainlagi achievement message plus the public site origin.

Initial share targets:
- Copy link
- native device share when available
- WhatsApp
- Telegram
- X
- Facebook
- Threads

## First adoption set

This wave deliberately starts with representative mechanics rather than a risky mass edit:

- `PatternCompletionActivity`
- `TakeAwayActivity`
- `MemoryMatchActivity`

Their existing completion/evidence calls remain unchanged. Only the post-success navigation/presentation is replaced.

After browser/visual acceptance, the shared component can be rolled through the remaining compatible runtimes in small batches.

## QA

Representative browser QA at 390px must verify:

- shared completion appears only after correct completion;
- exactly three stars;
- Back / Try Again / Next;
- Share opens the dialog;
- parent gate resolves in local QA;
- Copy link, WhatsApp, Telegram, X, Facebook, and Threads are present;
- screenshot evidence is captured;
- normal console/error/overflow/touch/accessibility gates remain active.

## Non-goals

- no scoring, mastery, evidence, curriculum, or progression rewrite;
- no change to completion timing inside mechanics;
- no social sharing of child/private data;
- no claim that every runtime already uses the shared completion in this first adoption wave.
