# English Narration Human-Review Gate — 22 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED / NO AUDIO GENERATED / NO PRODUCTION APPROVAL**

This document defines the human listening evidence gate between local/server-side provider generation and any later production-asset approval.

## 1. Hard boundary

This gate may validate and record a human decision about local pilot candidates. It must **not**:

- generate audio by itself;
- modify `src/lib/data/english-narration-asset-provenance.json`;
- copy any candidate to `public/audio/narration/en/`;
- mark a production asset `approved`;
- select a permanent production provider;
- activate static narration playback;
- modify learning content, answers, evidence, mastery, progression, schema, stage ownership, Mainlagi World, character work, or WS-05 gameplay.

Human review acceptance and production approval are different states.

## 2. Tooling

```text
generation:
  scripts/generate-english-narration-openai-pilot.mjs

human review:
  scripts/review-english-narration-pilot.mjs

regression:
  scripts/run-english-narration-pilot-review-tests.mjs
```

Package commands:

```bash
npm run pilot:narration:generate
npm run pilot:narration:review -- --voice marin
npm run test:assets:narration-pilot-review
```

The new regression is included in `npm run validate:assets`.

## 3. Exact review evidence

Before a review sheet can be created, the tool requires all four generated candidate files and `pilot-manifest.json` to match:

- provider;
- pinned model;
- allowed voice;
- MP3 format;
- exact four activity IDs;
- exact canonical transcripts;
- local candidate path;
- byte count;
- SHA-256;
- production registry lifecycle still `review-required`;
- AI-disclosure requirement still recorded.

The review sheet is then cryptographically bound to the exact manifest SHA-256 and each candidate SHA-256.

## 4. Human rubric

Each of the four activities has four required fields:

```text
exactWordFidelity
pronunciation
childLearningPace
audioCleanliness
```

Allowed values:

```text
pending
pass
fail
```

A completed review also requires:

- reviewer name;
- valid reviewed-at timestamp;
- `listenedToExactFiles = true`;
- explicit attestation that production-registry/runtime changes are separate work.

An `accepted` decision fails closed unless **all 16 rubric checks pass**. A `rejected` decision must have no pending checks and at least one failure.

## 5. Operator sequence

After the merged/live-verified PR #285:

```powershell
# 1. Dry run — no network / no writes
npm run pilot:narration:generate -- --dry-run --voice marin

# 2. Put OPENAI_API_KEY only in the current local/server process by your secret-management method.
#    Do not commit it, paste it into source, or expose it in CI/browser code.

# 3. Generate exact four local candidates
npm run pilot:narration:generate -- --generate --voice marin

# 4. Verify exact files + manifest
npm run pilot:narration:review -- --voice marin

# 5. Create non-overwriting review sheet
npm run pilot:narration:review -- --voice marin --write-template

# 6. Listen to the exact MP3 files and fill pilot-human-review.json manually.

# 7. Validate the recorded human decision
npm run pilot:narration:review -- --voice marin --validate-review
```

Repeat with `cedar` only when a comparison candidate is useful.

## 6. Meaning of HUMAN ACCEPTED

If the CLI prints `HUMAN ACCEPTED`, it means only:

> the reviewer listened to the exact locally generated files tied to the exact manifest and all required listening rubric fields passed.

It does **not** mean:

- rights/commercial/redistribution review is current;
- production registry is approved;
- file is allowed in the public AGPL repository;
- AI disclosure UI is implemented;
- runtime playback is activated.

Those remain later explicit gates.

## 7. Current truth

```text
reviewed English listening activities: 27
pilot activity scope:                  4
generated pilot audio:                 0
human-reviewed generated pilot audio:  0
approved production audio:             0
production narration binary:           0
static-audio runtime activation:        0
browser speech fallback:                preserved
```

Provider evidence was rechecked on 22 September 2026 before this implementation wave: the OpenAI Speech API still documents `gpt-4o-mini-tts-2025-12-15`, MP3, `marin` and `cedar`; the TTS guide still requires clear AI-voice disclosure.

## 8. Preserved project boundaries

- Mainlagi World: **DO NOT TOUCH**.
- Character development: **PAUSED**.
- WS-05: **CLOSED**.
- Preserve 9 subjects / 900 activities / 47 active gameplay patterns.
- No Pattern #48.


## 9. Closure evidence

```text
implementation PR:             #285
exact PR head:                 6e2a22057abb59c4bf6fc0f3298cd92e32de6463
exact-head PR CI:              #1412 / run 35724918622 — FULL SUCCESS
merged main:                   dd84579624212b387a4e54dc93a5892c04de83d6
merged-main CI:                #1415 / run 35725713601 — FULL SUCCESS
Cloudflare production smoke:   SUCCESS / exact merged SHA + canonical Supabase target
```

PR CI passed Ubuntu quality, Windows compatibility, secret history scan, required production dependency audit, mobile route QA including permanent visual baseline, and production build.

Merged-main CI passed the same blocking matrix plus production smoke. The smoke verified production was serving exact SHA `dd84579624212b387a4e54dc93a5892c04de83d6` on branch `main`, `https://mainlagihub.my.id`, backend `supabase`, with the canonical Supabase target.

Closure record: `ENGLISH_NARRATION_HUMAN_REVIEW_GATE_CLOSURE_2026-09-22.md`.
