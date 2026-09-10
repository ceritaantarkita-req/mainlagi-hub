# Mainlagi Expansion Batch 6 Closure

Date: 10 September 2026

Batch 6 — New subject/curriculum foundations is production-complete.

## Canonical release

- PR: #37 — `feat: add Batch 6 subject and curriculum foundations`
- Squash merge SHA: `466634e0d673893cbe25fae68bfe5e22dad04f0a`
- Base before Batch 6: `822ed47995907aa77c17ba389bd58f0b02140cb6`
- Canonical branch: `main`
- Production URL: `https://mainlagihub.my.id/`
- Canonical Supabase project ref: `estvtgflwkebomsqlolv`

## Shipped subject foundations

Batch 6 adds three first-class academic subjects through the same canonical hierarchy used by the existing learning platform:

```text
Subject
 -> Learning Path
 -> Stage
 -> Lesson
 -> Content Pack
 -> Activity Instance
 -> Mechanic
 -> Skill mapping / evidence contract
```

New subjects:

- Letters / Menulis
- Logic / Logika
- Science / Sains

Each new subject ships with one starter path, one starter stage, one starter lesson, one versioned content pack, two starter skills, and three real playable activities.

## Final Batch 6 catalog baseline

- first-class subjects: **8**
- learning paths: **8**
- stages: **10**
- lessons: **16**
- versioned content packs: **16**
- playable activities: **34**
- assessed activities: **27**
- practice activities: **7**
- skills: **18**
- reusable mechanic contracts: **20**

The 25 activities that existed before Batch 6 keep their historical IDs. Batch 6 adds exactly nine intentional starter activities: three each for Letters/Menulis, Logic/Logika, and Science/Sains.

## Evidence integrity decisions

Logic and Science use measured assessed core activities plus measured assessed variation activities.

Letters uses a stricter boundary:

- `letters-find-a` — required + assessed;
- `letters-trace-a` — required guided practice, `completion_only_v1`;
- `letters-match-case` — assessed variation.

`letters-trace-a` is deliberately not allowed to create academic accuracy/mastery because the current validated trace-fidelity evaluator is digit-specific. Letter tracing remains completion-only until a letter-shape fidelity contract is explicitly implemented and validated.

No camera dependency was introduced for the three new subject foundations.

## Platform integration

The new subjects participate in the existing first-class systems instead of using isolated mini-app flows:

- child navigation and Mainlagi World entry;
- subject -> stage -> activity routing;
- canonical path/lesson/content-pack ownership;
- age eligibility;
- measured learning attempts where evidence fidelity is supported;
- completion-only fallback where evidence fidelity is not supported;
- skill mastery and stage readiness;
- adaptive subject-scoped recommendation ranking;
- Parent Dashboard summaries and skill rows;
- server-owned activity catalog registration;
- evidence-driven certificate eligibility.

The `all-subjects` achievement threshold is scaled from the old five-subject catalog to the current eight first-class subjects both locally and in the server-owned award refresher.

## Supabase production evidence

Canonical project: `estvtgflwkebomsqlolv`.

Verified applied migrations include:

- `0012_reusable_mechanic_library`
- `0013_new_subject_curriculum_foundations`
- `0014_batch6_award_catalog_scaling`

Live production catalog verification after `0013`/`0014`:

| Subject ID | Activities | Assessed | Practice |
| --- | ---: | ---: | ---: |
| `bahasa` | 6 | 5 | 1 |
| `english` | 6 | 6 | 0 |
| `math` | 7 | 5 | 2 |
| `iqro` | 4 | 3 | 1 |
| `letters` | 3 | 2 | 1 |
| `logic` | 3 | 3 | 0 |
| `science` | 3 | 3 | 0 |
| `color` | 2 | 0 | 2 |

Live totals also verify **18 active skills** and **16 active content packs**.

## CI and deployment evidence

PR-head CI:

- workflow: `Mainlagi TV V3 CI`
- run: #209
- head SHA: `8f9a248da6bef5982bc49ef5dc4ea48bae29bc99`
- conclusion: success

Post-merge `main` CI:

- workflow run: #210
- release SHA: `466634e0d673893cbe25fae68bfe5e22dad04f0a`
- `Quality gate (Ubuntu)` — success
- `Windows compatibility` — success
- `Mobile route QA (Chromium)` — success
- `Production build` — success
- `Production dependency audit` — success
- `Secret history scan` — success
- `Production smoke (Cloudflare)` — success

The production-smoke job successfully waited for and verified the exact Cloudflare release for the merge SHA plus the canonical public site/backend metadata.

## Post-DDL advisor state

Performance advisor: no WARN-level regression observed; current findings are INFO-level unused-index observations.

Security advisor still reports two known warnings:

1. authenticated access to protected `SECURITY DEFINER` `public.record_learning_attempt(...)`; this is intentional because it is the server-owned authenticated attempt RPC and remains covered by ownership/anti-farming hardening;
2. Supabase leaked-password protection disabled on the current plan; this is an existing accepted account-plan limitation, not introduced by Batch 6.

## Remaining boundaries

Batch 6 does not claim that:

- Drawing/Menggambar is first-class yet; it remains planned for Batch 14;
- Letters/Menulis has reached its 100-activity target; current baseline is 3/100;
- Logic/Logika has reached its 100-activity target; current baseline is 3/100;
- Science/Sains has reached its 100-activity target; current baseline is 3/100;
- free drawing/coloring creates academic mastery;
- code/CI approval equals expert religious-learning approval for Iqro content;
- automated browser tests replace later physical-device acceptance.

## Closure decision

Batch 6 is closed because implementation, regression tests, migrations, live DB verification, squash merge, post-merge CI, Cloudflare exact-SHA smoke, and evidence-integrity boundaries are all verified.

The next planned expansion stage is **Batch 7 — Math to 100**, beginning with the reviewable 1–25 activity wave rather than a single unreviewed 100-activity change.
