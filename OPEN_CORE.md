# Mainlagi Hub — Open Core Model

Mainlagi Hub uses an **open-source core + paid/commercial offerings** model.

This document is the canonical product/architecture guide for deciding what belongs in the public community repository and what may remain in separately licensed commercial products or services. It does not replace the actual license text in `LICENSE` or a signed commercial agreement.

## 1. Community source license

Unless a file or directory explicitly states otherwise, original source code in this public repository is licensed under **GNU Affero General Public License v3.0 only (`AGPL-3.0-only`)**.

The AGPL is an open-source license and it **permits commercial use**. A person or company may use, modify, host, distribute, or sell AGPL-covered software if they comply with the applicable AGPL requirements.

For network use, the AGPL has an important additional obligation: users interacting with a modified covered program over a network must be offered the corresponding source code of the modified version as required by the license.

A separate Mainlagi commercial license is therefore **not a fee simply for using Mainlagi commercially**. It is an alternative path for organizations that need separately negotiated rights or terms that differ from the AGPL, such as an eligible closed-source deployment, OEM/white-label arrangement, or another proprietary integration covered by a written agreement.

See:

- `LICENSE`
- `COMMERCIAL_LICENSE.md`
- `NOTICE.md`

## 2. What belongs in the open-source core

The public/community layer should contain reusable capabilities that make Mainlagi genuinely useful as an open-source learning platform, including, as the project evolves:

- the browser motion/vision runtime and its reusable interaction engine;
- the activity runtime/contracts used by learning experiences;
- baseline learning activities and examples intentionally released as community content;
- learning catalog/schema definitions intended for public interoperability;
- local/basic learner progress capabilities intentionally released in the public repository;
- public developer tooling, tests, simulations, documentation, and adapters intended for community use;
- security fixes and shared platform improvements that affect the public core.

The exact set of open-source features is determined by the source actually released in the public repository and its file-specific license notices, not by marketing labels alone.

## 3. What may be paid or proprietary

Paid Mainlagi products may contain capabilities or materials that are separate from the AGPL community repository, for example:

- premium curriculum, lesson packs, assessment content, worksheets, or localized educational content;
- premium character artwork, animation, voice packs, music, sound libraries, and production assets;
- hosted Mainlagi cloud services;
- subscription and entitlement infrastructure;
- advanced parent reports and longitudinal analytics;
- school/organization administration, dashboards, roster integrations, or enterprise controls;
- managed AI/OCR/TTS services and paid inference infrastructure;
- commercial support, SLA, deployment, migration, or training services;
- OEM, white-label, co-branding, or negotiated redistribution rights;
- other separately licensed proprietary modules or services.

A feature being "paid" does not automatically make it proprietary, and a feature being "commercial" does not remove AGPL obligations from AGPL-covered code. The applicable license follows the actual component and rights granted for that component.

## 4. Repository boundary rule

To keep the model understandable and enforceable:

1. **Public source is presumed AGPL-covered** unless a file/directory clearly states another valid license or third-party provenance.
2. Proprietary premium source should normally live in a **separate private repository, private package, or separately operated service**, rather than being mixed into the public AGPL tree.
3. Brand/character assets should not be committed to the public repository unless their distribution rights and asset license are explicit.
4. Third-party assets, models, datasets, fonts, audio, and dependencies keep their original terms; Mainlagi cannot relicense rights it does not own.
5. A README sentence or product tier name is not sufficient to change a file's copyright/license status.

For new commercial modules, prefer a clean interface boundary such as an API, event contract, entitlement contract, or package interface rather than hidden license coupling inside community code.

## 5. Mainlagi brand and characters are separate

The source-code license does not grant a trademark or character-brand license.

Unless explicitly released under separate terms, Mainlagi reserves its brand/creative identity, including:

- Mainlagi and Mainlagi Hub product branding;
- logos and visual marks;
- official identities and commercial presentation of **Naya, Gian, Zia, Paca, and Gavi**;
- official character artwork, animation, and voice identity;
- premium curriculum branding and merchandising identity.

Forks may comply with the AGPL while still being required to use their own branding. See `TRADEMARKS.md`.

## 6. Dual/commercial licensing and contributor rights

Alternative commercial licensing is straightforward only for code for which the commercial licensor has sufficient rights.

Third-party contributions can create shared copyright ownership or other licensing constraints. Therefore:

- contributions merged into the community core remain subject to the repository's contribution/licensing policy;
- substantial external contributions may require a Contributor License Agreement (CLA) or another explicit rights grant before merge if Mainlagi needs to preserve an alternative commercial licensing path;
- no maintainer should promise proprietary relicensing rights over third-party code they do not have authority to relicense.

See `CONTRIBUTING.md`.

## 7. Suggested product tiers

The following is a product-direction model, not a promise that every listed feature already exists.

### Community / Open Source

Suitable for families, developers, contributors, experimentation, and self-hosting under AGPL terms:

- open activity runtime;
- motion/vision engine;
- baseline learning experiences;
- local/basic progress where released;
- public schemas, documentation, and developer tooling.

### Mainlagi Plus / Family (paid)

Potential hosted consumer offering:

- premium curriculum/stage packs;
- premium character voice/animation packs;
- cloud sync across devices;
- advanced parent reports;
- additional certificates/rewards/content;
- managed AI-assisted learning features where child-privacy requirements are satisfied.

### Mainlagi School / Organization (paid)

Potential institutional offering:

- teacher/school administration;
- roster and organization controls;
- cohort/class analytics;
- managed deployment/support;
- organization policies and reporting;
- negotiated SLA/integration services.

Commercial tier names and packaging may change without changing the license of code already released under the AGPL.

## 8. Rule for future development

When adding a new feature, answer these questions before implementation:

1. Is this intended to be part of the public community core?
2. Who owns the code/content/assets and do we have the right to license them?
3. If proprietary, is it physically separated from the AGPL repository?
4. Does it use Mainlagi brand/characters that need separate rights treatment?
5. Does it introduce third-party model/data/content licenses?
6. If an external contributor is involved, do we have the rights needed for the intended licensing model?
7. Does the architecture still allow the open-source core to function meaningfully without the paid component?

If those answers are unclear, do not merge the component into `main` until the boundary is documented.

## 9. Legal note

This repository documentation explains the project's intended licensing structure but is not individualized legal advice. For major commercial licensing, fundraising, OEM/white-label deals, trademark registration, or contributor-rights programs, obtain advice from qualified counsel for the relevant jurisdiction.
