# Mainlagi Product Tiers and Code Boundary

Status: architecture and licensing policy

This document translates the open-core policy into implementation boundaries. It does not change the AGPL license or create a new license.

## Mainlagi Community — public AGPL core

Community must remain a meaningful, runnable learning product rather than a nonfunctional teaser.

Community is the default home for generally reusable platform capabilities, including:

- motion/vision runtime and activity adapters;
- learning catalog and public learning contracts;
- baseline activities and sample curriculum;
- child profiles;
- basic/local progress;
- canonical learning-attempt and mastery contracts;
- baseline parent progress views;
- public accessibility/localization infrastructure;
- public developer tooling, tests, documentation, and security hardening.

Community code in this repository is `AGPL-3.0-only` unless a file explicitly states otherwise.

## Mainlagi Plus — paid consumer product

Plus may package Community with separately owned/licensed value such as:

- premium curriculum/stage packs;
- premium Mainlagi character animation and voice assets;
- cloud synchronization and multi-device continuity;
- advanced parent reports and insights;
- premium rewards/certificates;
- subscription/entitlement-backed content access;
- managed content/audio delivery.

Public interfaces/contracts needed for interoperability may live in Community. Proprietary implementations/assets should not be silently committed into the AGPL public tree.

## Mainlagi School — paid institutional product

School may add separately maintained capabilities such as:

- school/teacher account realm;
- classes, rosters, and assignments;
- aggregate classroom/school analytics;
- teacher dashboards and reporting;
- institution policy/configuration controls;
- SSO/integration services;
- managed deployments and support.

Child-data collection must remain purpose-limited and subject to the applicable privacy/legal requirements. School features do not justify weakening the public child-safety boundaries.

## Proprietary service layer

The following are strong candidates for private packages/repositories/services when implemented as paid infrastructure:

- billing and subscription orchestration;
- entitlement service implementation;
- hosted cloud-sync backend beyond the public contract;
- managed AI/OCR/TTS providers;
- premium asset production/distribution pipelines;
- enterprise/OEM/white-label management;
- commercial SLA/support infrastructure.

Preferred relationship:

```text
Public AGPL Mainlagi Community
        |
        | explicit API / schema / package contract
        v
Private paid service or asset layer
```

Do not solve licensing boundaries by placing proprietary source in a public folder and adding a comment that says "premium".

## Character, brand, voice, and curriculum assets

The source-code license does not automatically grant rights to Mainlagi trademarks or reserved creative identity.

Naya, Gian, Zia, Paca, Gavi, official Mainlagi branding, premium voice identity, premium artwork/animation, and premium curriculum content must have explicit distribution/licensing terms independent of the AGPL code grant.

Where an asset does not belong in the public distribution, keep it outside this repository and reference it through a reviewed service/content interface.

## Shared contracts

Some contracts should intentionally be public even when a paid implementation exists. Examples:

- entitlement tier identifiers (`community`, `plus`, `school`);
- capability keys;
- learning attempt/result schema;
- skill/mastery schema;
- localization and audio metadata schema;
- provider interfaces where a Community-compatible implementation can exist.

A public contract is not a promise that every provider implementation or premium content pack is open source.

## Contributor-rights constraint

If community-contributed code may also be distributed in an alternatively licensed commercial edition, Mainlagi must have sufficient contributor rights before merging that contribution. See `CLA_POLICY.md` and `CONTRIBUTING.md`.

## Decision rule for new features

Before implementation, classify the feature:

1. Is it a general reusable platform capability required for a meaningful Community product? Prefer Community.
2. Is it proprietary content, premium creative IP, managed infrastructure, billing, institutional operations, or commercial service delivery? Prefer the paid/private layer.
3. Does the public core need an interface to the paid implementation? Put the smallest stable contract in Community and keep the implementation boundary explicit.
4. Does a third-party license/model/dataset permit the intended distribution and commercial use? If not verified, do not bundle it.

When uncertain, document the boundary in the PR before merging source or assets.
