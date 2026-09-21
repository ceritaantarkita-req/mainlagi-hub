# Character Candidate Intake Audit — 21 September 2026

Status: **AUDIT COMPLETE / NO PRODUCTION CANDIDATE FOUND / NO RUNTIME OR BINARY CHANGE**

This audit checks whether a usable Naya, Gian, or Zia **activity-foreground production candidate** already exists in the current Mainlagi project Drive before any new artwork is created or committed.

## Canonical references found

The Drive contains the three reviewed identity/design sheets:

- `kak-naya-character-design-set-v1.png`
- `gian-character-design-set-v1.png`
- `zia-character-design-set-v1.png`

These remain the canonical identity references for the first human-character production pass.

They are multi-view / expression / pose sheets on a white canvas. They are **not** isolated transparent activity sprites and therefore do not satisfy the production contract by themselves.

## Candidate search result

Searches for Naya/Gian/Zia candidate, transparent, and activity assets did not return a separate production candidate for any of the three characters.

The Drive also contains many `child-demo-gian-*` product/QA screenshots. Those are application screenshots around the demo child profile and are **not character-production source artwork**. They must not be treated as a Gian activity sprite or used to derive one implicitly.

Current candidate inventory:

| Character | Canonical identity reference | Separate foreground candidate | Production binary | Runtime activation |
| --- | --- | --- | --- | --- |
| Naya | present | **missing** | none | blocked |
| Gian | present | **missing** | none | blocked |
| Zia | present | **missing** | none | blocked |

## Candidate acceptance contract

A future candidate can enter review only when it is:

- one isolated full-body character;
- visually consistent with the canonical identity reference;
- transparent-background capable;
- free of baked text, scenery, answer content, UI and permanent props;
- neutral-friendly or lightly encouraging enough for repeated activity use;
- complete within the canvas with no clipped hijab, hair, hands or shoes;
- suitable for the shared activity foreground slot without covering instructions or controls;
- accompanied by a clear creation/source basis for later provenance review.

A candidate is still **not production-approved** at this stage.

## Rejection rules

Reject as a production candidate if it is:

- a design/reference sheet rather than an isolated character;
- a screenshot of the Mainlagi UI;
- a five-character hero/group composition;
- a background scene containing the character;
- a candidate with a white/solid background baked into the visible character area;
- a pose with permanent task-specific props;
- visually inconsistent with the locked face, clothing, age-readable silhouette or hairstyle/hijab identity;
- missing a traceable source/creation basis.

## Locked next order

Because no separate candidate exists yet, the next product step is **asset creation/review**, not repository activation:

1. create one isolated candidate for **Naya** outside `public/artwork/characters/`;
2. review it against the Naya identity reference and this acceptance contract;
3. only if accepted, establish provenance/redistribution for the exact reviewed derivative and export the canonical WebP;
4. repeat the same process for **Gian**;
5. repeat the same process for **Zia**;
6. integrate approved binaries + provenance in a dedicated asset PR;
7. keep runtime activation in a later PR with responsive activity QA.

No candidate or generated image is authorized merely by this audit.

## Repository boundary

This audit changes documentation only.

It does not:

- generate artwork;
- add image binaries;
- approve redistribution rights;
- change `characterAssets.ts`;
- activate Naya/Gian/Zia;
- change subject pairings;
- change curriculum, mastery, evidence, progression, schema or narration.
