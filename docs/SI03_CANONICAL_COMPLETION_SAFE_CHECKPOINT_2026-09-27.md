# SI-03 Canonical Completion — Safe Checkpoint — 27 September 2026

Status: **IMPLEMENTED ON BRANCH / CI VALIDATION PENDING / NOT MERGED**

## Resume point

Continue this exact workstream. Do not restart Shared Interaction from SI-00.

```text
repository: ceritaantarkita-req/mainlagi-hub
base main:  7acad4aec11c54354dff3cf6304f484f669bfa38
branch:     agent/si-03-canonical-completion-20260927
phase:      SI-03 — Canonical Completion component
```

Closed prerequisites: SI-00, SI-01 and SI-02. SI-02 docs closure is production verified through main CI #1929 / run `36331440068`, including exact Cloudflare smoke.

## SI-03 objective

Build the approved reusable Completion visual contract without broad runtime migration:

```text
praise
★★★
Back | Again | Next
Share
```

The component must host future Belajar, World and Bermain context without owning curriculum, progression, scoring or Share-provider logic.

## Implemented branch contract

New shared shell:

```text
src/components/CanonicalCompletion.tsx
src/components/CanonicalCompletion.module.css
```

Stable QA contract:

```text
data-canonical-completion="v1"
data-completion-context="belajar|bermain|world"
data-completion-surface="overlay|inline"
data-completion-stars="3"
data-completion-action="back|again|next|share"
```

The shell owns presentation only: caller-supplied praise, exactly three stars, exact Back / Again / Next labels, Share below the action row, overlay/inline surfaces, heading focus, responsive portrait/landscape containment, reduced motion, and optional `eyebrow`, `characterSlot`, and `supportingContent` slots.

It does not know child IDs, activity IDs, mastery/evidence, World progression, Bermain scores, parent share gate, provider URLs or public share URL resolution.

## Belajar proof adapter

The pre-existing `ActivityCompletion` now renders through `CanonicalCompletion`. This is not a new runtime migration; it only changes the visual owner under the shared Completion path that already existed before SI-03.

Existing behavior remains: deterministic praise, same-origin Back with subject fallback, custom replay callback or reload fallback, stage-aware Next, existing Share gate, existing privacy-safe generic payload, and existing provider links.

Visible replay copy is now canonical **Again**, replacing the old visual label **Try Again**.

Existing direct shared users remain `PatternCompletionActivity`, `TakeAwayActivity`, and `MemoryMatchActivity`; the fallback `ChildLearningPlatform` owner also keeps using the same wrapper.

## SI-04 boundary

`CanonicalCompletion` owns the Share button position only. Current Belajar `ActivityCompletion` still owns `/api/parent/share-gate`, Copy link, Share device, WhatsApp, Telegram, X, Facebook and Threads. SI-04 will extract that behavior. Static SI-03 regression forbids provider/gate logic from entering the canonical shell.

## Explicit non-migration boundary

SI-03 does not import or use `CanonicalCompletion` inside `WorldStageCompletion` or `RoundEndOverlay`. Bermain migration stays SI-07 to SI-09; World migration stays SI-10. SI-05 remains the first specialized Belajar migration pilot.

## QA added

Static contract:

```text
scripts/run-si03-canonical-completion-tests.mjs
npm run test:learning:si03-completion
```

Browser acceptance:

```text
scripts/run-si03-canonical-completion-browser-tests.mjs
npm run test:ui:canonical-completion
```

Representative route: `/child/demo-gian/activity/letters-match-case-cd`.

Browser acceptance covers canonical marker/context/surface, exactly three stars, Back / Again / Next / Share order, >=44px targets, Share below navigation, heading focus, 390x844 portrait, 320x740 portrait, 844x390 short landscape, viewport containment, no horizontal overflow, legacy Share dialog handoff, and preserved activity completion/progression.

The browser test is wired into the permanent mobile route gate immediately after SI-01 orientation QA.

## Merge gate

Do not merge until latest-head Ubuntu, Windows, production build, dependency audit, secret scan, Chromium mobile route QA and permanent visual baseline are all green. After merge require push-to-main full green plus exact Cloudflare production smoke, then promote this checkpoint to merged/live verified.

## Non-scope

Do not expand SI-03 into SI-04 Share extraction, SI-05 pilot, mass Belajar migration, Bermain migration, World migration, Journey Map, Shop, new character work, or learning attempt/evidence/mastery/progression changes.

## Next after SI-03 closure

`SI-04 — Canonical Share component`