# English Narration Safe Checkpoint — 22 September 2026

Status: **SAFE CHECKPOINT / MERGED / LIVE VERIFIED**

Repository: `ceritaantarkita-req/mainlagi-hub`  
Canonical branch: `main`

This document is the compact handoff for the English learning narration work completed on 22 September 2026. It is intentionally conservative: it records what is live, what is still blocked, and what a future agent may safely do next without reopening closed work.

## 1. Current production source of truth

```text
current main:                    2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48
merged-main CI:                  #1372 / run 35701448136
merged-main CI result:           FULL SUCCESS
Cloudflare production smoke:     SUCCESS — exact merged main SHA
production URL:                  https://mainlagihub.my.id
production data backend:         Supabase
```

The production health check explicitly returned release SHA:

```text
2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48
```

Do not use an older gameplay/documentation checkpoint as the current production head.

## 2. English narration work now closed

### Wave 1 — narration copy + browser fallback quality

```text
PR:                         #278
merged main:                8d60a69a076cc6e5253650112f2ffe79add345ea
final PR CI:                #1366 / run 35697216106 — FULL SUCCESS
merged-main CI:             #1367 / run 35697909785 — FULL SUCCESS
Cloudflare smoke:           SUCCESS — exact merged main SHA
```

Verified English listening truth:

```text
English listen_and_choose:  27
target-first narration:     22
sentence comprehension:      5
registry/runtime drift:      BLOCKED BY TEST
```

Wave 1 improved:

- target-first spoken copy for vocabulary/letter/phrase listening;
- preservation of full sentence + question for comprehension activities;
- exact-locale English browser voice ranking;
- English prompt pace at `0.92`;
- regression coverage preserving choices, correct answers, stage ownership, runtime and evidence boundaries.

Wave 1 did **not** activate pre-generated production audio.

### Wave 1 docs closure

```text
PR:                         #279
merged main:                397bcab1ee2d101ebd89f2377bd7dffb2705d7c0
merged-main CI:             #1369 / run 35699976551 — FULL SUCCESS
Cloudflare smoke:           SUCCESS — exact merged main SHA
```

### Wave 2 — production narration asset gate

```text
PR:                         #280
final PR head:              6d66ce14847440d54c6778a35cc6f116d4b9cb24
final PR CI:                #1371 / run 35700739978 — FULL SUCCESS
merged main:                2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48
merged-main CI:             #1372 / run 35701448136 — FULL SUCCESS
Cloudflare smoke:           SUCCESS — exact merged main SHA
```

Wave 2 introduced a production-only fail-closed gate for the exact 27 reviewed English narration slots.

Current production-asset truth:

```text
registry slots:             27
review-required:            27
approved production audio:   0
production binaries:         0
runtime static audio:         NOT ACTIVATED
browser speech fallback:     PRESERVED
```

Permanent gate:

```bash
npm run validate:assets:narration
npm run test:assets:narration
npm run validate:assets
npm run test:learning:english-narration
```

The merged CI proved:

```text
narration assets OK:
0 approved English production asset(s);
27 review-required slot(s)

English narration asset validator regression:
PASS — fail-closed provenance, commercial-use,
human-review, MP3, and checksum gates

English narration quality regression:
PASS — 27 reviewed / 22 target-first / 5 comprehension /
asset registry transcripts synchronized
```

## 3. Canonical narration files

Read these before changing narration:

```text
docs/ENGLISH_NARRATION_SAFE_CHECKPOINT_2026-09-22.md
docs/ENGLISH_NARRATION_QUALITY_WAVE_2026-09-22.md
docs/ENGLISH_NARRATION_ASSET_PIPELINE_2026-09-22.md
src/lib/data/english-narration-asset-provenance.json
scripts/validate-english-narration-assets.mjs
scripts/run-english-narration-asset-validator-tests.mjs
scripts/run-english-narration-quality-tests.mjs
src/lib/audio/AudioManager.ts
src/lib/learning/system.ts
```

Reserved production audio path:

```text
public/audio/narration/en/<activity-id>-v1.mp3
```

The public audio directory is production-only and ignored by default. An approved binary must be deliberately force-added only after its provenance/human-review record is complete.

## 4. What remains intentionally open

Final production English voice is **not** selected and **not** activated.

Still open:

- provider/model/voice selection;
- human listening acceptance;
- pronunciation approval;
- child-learning pacing/suitability approval;
- commercial-use rights review;
- public-repository redistribution review;
- AI-voice disclosure decision;
- exact binary SHA-256;
- static-audio runtime resolver/playback activation;
- Indonesian production narration;
- any stable character/voice identity work.

The current browser `speechSynthesis` path remains the production fallback until separately approved static audio is activated.

## 5. Next safe English narration step

The next safe step is a **four-item provider/voice pilot only**:

```text
english-listen-bird
  "Bird."

english-listen-letter-a
  "Letter A."

english-listen-phrase-blue-book
  "A blue book."

english-detail-red-ball
  "The ball is red. What color is the ball?"
```

This sample intentionally covers:

- simple noun;
- letter name;
- short phrase;
- sentence-level comprehension.

For each candidate output:

1. generate outside browser/client runtime;
2. do not expose provider credentials in client code;
3. listen to the exact generated binary;
4. review pronunciation and child-learning pacing;
5. review provider/model/voice terms again at generation time;
6. confirm commercial-use and repository redistribution rights;
7. record AI-disclosure requirement;
8. compute SHA-256;
9. update exactly the matching registry record;
10. add only the reviewed binary;
11. pass permanent narration asset gates;
12. do **not** activate runtime static-audio playback in the same approval step.

Do not bulk-generate all 27 files before the four-item pilot is accepted.

## 6. Hard execution boundaries

These remain non-negotiable for the narration workstream:

- **Mainlagi World: DO NOT TOUCH.**
- **Character production/development: PAUSED.**
- Do not use narration work as an excuse to resume Naya/Gian/Zia production.
- WS-05 Logic `pattern_completion`: closed/live verified.
- Pattern #48: still unjustified.
- Preserve 9 subjects / 900 activities / 47 active gameplay patterns.
- Preserve current mastery, evidence, progression and schema contracts.
- Do not change choices/correct answers merely to accommodate narration.
- Do not place provider secrets/API keys in browser code or the public repository.
- Do not treat a green technical validator as human pronunciation approval.
- Do not treat a provenance-approved binary as automatically runtime-active.

## 7. Safe resume instruction for another agent

A future agent can safely resume from this checkpoint with:

> Start from main `2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48`. Preserve Mainlagi World untouched, keep character development paused, keep WS-05 closed, and preserve the 900-activity / 47-pattern learning baseline. English narration Wave 1 and the production asset gate are closed/live verified. There are 27 narration registry slots, 0 approved production audio files and 0 runtime static-audio activation. If continuing narration, begin with a four-item provider/voice pilot and human listening/provenance review; do not bulk-generate all 27 and do not activate runtime playback until the pilot assets are separately approved.

## 8. Checkpoint rule

If later work changes `main`, this file remains a historical safe checkpoint. Current truth must then be updated in:

- `CURRENT_STATE.md`;
- `NEXT_PRODUCT_QUALITY_PLAN.md`;
- `PROJECT_STATE_SYNC_2026-09-20.md`;
- `docs/README.md`;
- subsystem closure records as appropriate.
