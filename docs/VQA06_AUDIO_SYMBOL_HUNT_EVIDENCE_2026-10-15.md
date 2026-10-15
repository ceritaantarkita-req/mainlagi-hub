# VQA-06 — Audio-first and Symbol Hunt evidence-first visual QA (15 Oct 2026)

Status: **review branch / unmerged / production unchanged**.
Base production: `main@3644a9270d7557ee3033ccbf393d06f7ed75c965`, PR #507 merged with exact-SHA Cloudflare smoke ([main run #38684386266](https://github.com/ceritaantarkita-req/mainlagi-hub/actions/runs/38684386266)).
Parent: [VQA quality issue #501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501).
This wave adds browser QA and evidence guidance **only**; it does not make a UX redesign or claim that uninspected screenshots are approved.

## A. Audited runtime ownership and invariants

| Family | Current owner / route | Read-only source finding | Must preserve |
| --- | --- | --- | --- |
| Audio-first | `AudioChoiceLearningActivity.tsx`; `/child/demo-gian/activity/english-find-blue-audio` | `speechStatus === "spoken"` alone enables choices. Before speech, unavailable and error states must remain blocked with a readable `role=status` fallback and a link back to the subject. Direct entry cannot bypass user gesture/audio capability. | Managed speech, real language-compatible voice, answer secrecy, accessible fallback, no synthetic attempt, canonical Completion/Share/Again |
| Symbol Hunt | `SymbolHuntChoiceActivity.tsx`; `/child/demo-gian/activity/letters-find-a` and `bahasa-vokal-o` | Garden owns the main title; a separate `promptCard` inside the illustration owns the task prompt and helper copy. The nested card is pedagogical instruction, **not** the removed title box in PR #507. The three field positions are deterministic and have keyboard/pointer targets. | Canonical letters/answer, deterministic placements, keyboard/pointer, Completion/Again, 3 playable choices, accessibility |
| Visual backgrounds | `GardenActivityFrame.module.css`, `SymbolHuntChoiceActivity.module.css` | VQA-05 localized `closest-side` title fade is distinct from the instruction card. Avoid broad `h1`, `.hint` or whole-scene opacity rules. | Nine approved subject scenes and character positioning; audio-workspace contrast |

These are **source-level findings**, not new physical-device observation. The latest production source and release log are the references.

## B. Added repeatable browser evidence

### Audio-first (existing `scripts/run-si06b1-literacy-audio-browser-tests.mjs`)

- Preserve original assessed wrong/correct, canonical Back/Again/Next/Share, one attempt and orientation tests.
- New idle-before-audio capture at 390px: all three answer buttons remain disabled.
- Existing viewport geometry/capture broadened to 320, 390, 430, 768, 844-landscape, **1280**, 1440. New successful-spoken captures show the enabled-choice state after a real Dengar gesture and compatible QA voice.
- Screenshot output now goes to dedicated `.vqa06-audio-first/`, with a separate `vqa06-audio-first-screenshots` GitHub artifact. The previous `.mobile-route-qa/si06b1-literacy-audio` output was deleted by the later `run-mobile-route-browser-tests.mjs` cleanup (`rmSync(.mobile-route-qa)`), so first-green PR #508 run #38700493138 had **no persisted VQA-06 AudioChoice screenshot set** despite passing browser assertions. This QA evidence gap is corrected in this follow-up commit, subject to a fresh CI artifact check.
- New **isolated simulated** missing matching voice (`unavailable`) and speech synthesis `error` at 320 and 390. Both must show a readable status and "Pilih permainan lain", keep all choices disabled, emit **zero target attempts** and avoid horizontal overflow.
- Wrong-answer screenshot is now retained before success. Mute is not simulated in this wave, and needs a separate controlled real-device/volume-setting verification. Mocked voices do not prove native spoken pronunciation quality.

### Symbol Hunt (existing `scripts/run-symbol-hunt-browser-tests.mjs`)

- Preserve permanent 320, 390, 430, 768, 1440 target/overflow, bounding-box, pointer, keyboard, completion and Bahasa vowel-O tests.
- Explicitly check that the **nested** instruction headline and helper copy exist, are within the illustrated board and do not overlap the uppermost playable letter.
- Capture `idle`, `wrong`, `success`, and `again` per viewport. The `again` reset must re-enable all three targets without changing the chosen answer.
- The instruction panel may still be too copy-dense for pre-readers even when all geometry checks pass. Do **not** delete it on a geometry-only result.

## C. Visual acceptance checklist after CI artifacts

Review the *actual PNGs*, not only green assertions. For 320/390 phones and 768/1280 larger viewports inspect:

1. Is a pre-reader's **first action** unmistakable before listening or letter tapping? Is an answer blocked until speech starts?
2. Is instruction copy duplicative between main Garden heading and nested prompt/status/hint? Can it be condensed without exposing the audio target, losing phonics context or reducing accessibility?
3. Does the first playable choice appear within a comfortable scroll distance? Are controls 44px or larger and text legible against the approved scene?
4. Wrong/retry/success/completion: no overlap, clipped instruction, hidden tap targets, duplicate attempts or forced reveal of a hidden answer.
5. No whole-scene opacity veil or reintroduction of a solid activity-title rectangle.
6. Validate muted/volume-setting behavior and Safari/iPhone touch/voice behavior **on physical devices**. Chromium screenshots are representative QA, not hardware acceptance.

### Stop / escalation conditions

- CI failure, unavailable/error allowing selection, speech transcript exposing hidden correct answer, clipped letter, unreadable fallback, failed keyboard focus, incorrect attempt count or stage-gate bypass: **do not merge** until the evidence identifies the owner and a narrow repair is retested.
- An aesthetic complaint without an observed functional defect should be documented as a screenshot-backed P2 candidate, not treated as a proven P0 regression.
- No global CSS cleanup, content changes, new pattern, voice-provider swap, World/Motion/Shop/auth/database modifications.

## D. Release gates (must be filled with evidence)

- [ ] Exact-head PR CI required checks (7/7 including Chromium).
- [ ] Review final screenshot artifact for each documented state; record viewport/route/filename and remaining P1/P2 items in the PR.
- [ ] Only then consider squash merge; post-merge main 8/8 with Cloudflare exact SHA is required before claiming live.
- [ ] Real Safari/iPhone and mute-provider quality sign-off remains **open** even after code QA.
- [ ] Issue #501 stays open until broader first-action quality and owner acceptance, not just this test matrix.

No 900-activity individual visual sign-off is claimed by this wave. The 900/900 classification across 47 active patterns is a structural audit, not representative-state approval.

## E. First artifact review and corrective follow-up

- Initial exact-head PR #508 run [#38700493138](https://github.com/ceritaantarkita-req/mainlagi-hub/actions/runs/38700493138) passed **7/7**, but its `mobile-route-qa-screenshots` artifact #11955729619 contained no `audio-idle`, `audio-spoken` or `audio-unavailable/error` files: the later route QA cleanup had removed their original directory. CI green **did not satisfy** audio screenshot acceptance.
- The initial artifact **did** retain the new Symbol Hunt 320/390/430/768/1440 `idle/wrong/success/again` captures. Manual inspection of `320-symbol-hunt-letters-find-a-idle.png`, `390-symbol-hunt-letters-find-a-idle.png`, and `320-symbol-hunt-letters-find-a-wrong.png` shows no clipped letter or obstructed first tap; the 320px Garden title and interior prompt are both readable. The main title `Temukan huruf A` plus interior `Mana huruf A?` is still **potentially redundant** for a pre-reader, a **P2 content-density review**, not proof of gameplay failure.
- Corrective change: preserve AudioChoice screenshots in dedicated path and upload them as `vqa06-audio-first-screenshots` without changing the pre-existing `mobile-route-qa-screenshots` artifact. The new artifact must be physically downloaded and reviewed before approval. No runtime CSS or copy has been changed.
- Current status remains **DRAFT / NOT MERGED** until fresh exact-head 7/7 CI and representative new audio PNG review. Real Safari and physical mute behavior remain separately unverified.
