# English Narration Provider-Pilot Harness Closure — 22 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED / AUDIO GENERATION NOT STARTED**

This is the canonical closure record for the provider-specific **generation harness**, not for generated narration assets and not for static-audio runtime playback.

## 1. Closed scope

PR #283 closed the exact four-item harness: `english-listen-bird`, `english-listen-letter-a`, `english-listen-phrase-blue-book`, and `english-detail-red-ball`, with transcripts locked to the canonical narration registry.

Implemented contracts: machine-readable pilot spec; OpenAI API as a primary pilot candidate rather than permanent provider lock; pinned `gpt-4o-mini-tts-2025-12-15`; `marin`/`cedar` allowlist; MP3; exact transcript lock; dry-run default; explicit `--generate` plus local/server `OPENAI_API_KEY`; output restricted to gitignored `internal/`; no automatic production-registry lifecycle change; no runtime static-audio activation; and permanent regression in `npm run validate:assets`.

## 2. Verification evidence

```text
implementation PR:            #283
final PR head:                ed1a0d08107fb35b5030fe296268eeb90b759170
PR CI:                        #1395 / run 35719163695 — FULL SUCCESS
merged implementation main:   4b975130bf6e5fc28cecbf6aea5373b7a1430c65
merged-main CI:               #1396 / run 35719862989 — FULL SUCCESS
Cloudflare production smoke:  SUCCESS — exact merged implementation SHA
```

Merged-main smoke reported exact release SHA `4b975130bf6e5fc28cecbf6aea5373b7a1430c65`, branch `main`, `https://mainlagihub.my.id`, backend `supabase`, and the canonical Supabase target.

## 3. Product truth after closure

```text
English listening activities reviewed: 27
target-first prompts:                   22
sentence-level comprehension prompts:   5
production narration registry slots:    27
review-required registry slots:         27
approved production narration:          0
generated pilot candidates in repo:     0
production narration binaries:          0
static-audio runtime activation:         0
browser speech fallback:                 preserved
```

PR #283 did not change assessed activity content, answers, evidence, mastery, progression, schema, stage ownership, or gameplay classification.

## 4. Preserved global boundaries

- **Mainlagi World: DO NOT TOUCH.**
- **Character production/development: PAUSED.**
- WS-05 Logic `pattern_completion`: closed/live verified.
- Preserve 9 subjects / 900 activities / 47 active gameplay patterns.
- No Pattern #48.
- No provider secrets in browser/client source or committed repository files.
- Technical CI success is not human listening approval.
- Human listening approval is not automatic runtime activation.

## 5. What is still open

The harness is closed; the **audio pilot itself is not**. The fail-closed human-review evidence gate is now also merged/live verified through PR #285 -> `dd845796...`, PR CI #1412 and merged-main CI #1415 exact Cloudflare smoke. Next: put `OPENAI_API_KEY` only in an authorized local/server environment; generate the exact four candidates with `marin`; use `cedar` as the planned comparison; listen to the exact binaries through the verified review gate; record exact-word fidelity, pronunciation, child-learning pace and audio cleanliness; recheck provider terms at production-approval time; then and only then consider production provenance changes. Static-audio runtime resolution remains a later separate wave.

Do not bulk-generate all 27 before the four-item pilot is accepted.

## 6. Safe resume instruction

> Fetch current `main` and verify it contains provider-pilot baseline `4b975130bf6e5fc28cecbf6aea5373b7a1430c65` and human-review gate main `dd84579624212b387a4e54dc93a5892c04de83d6`. Keep Mainlagi World untouched, character development paused, WS-05 closed, 900 activities / 47 active patterns preserved, and no Pattern #48. No pilot audio has been generated or approved. Resume at exact-four local/server-side candidate generation + human listening review; do not auto-approve production assets and do not activate static narration playback.
