# Mainlagi Contributor Rights / CLA Policy

Status: **policy requirement; not yet an executable legal agreement**

This file documents the contributor-rights model Mainlagi intends to use. It is not a signed Contributor License Agreement, does not identify a final contracting legal entity, and should not be presented as legal advice. The final agreement text and signature workflow require legal review before activation.

## Why this is needed

Mainlagi Hub is an AGPL open-source project with a separate commercial licensing/product path. External contributors normally retain copyright in the code they write. If Mainlagi later wants to distribute the same contributed code under an alternative commercial license, ordinary AGPL contribution terms alone may not provide the rights needed for that relicensing.

Therefore substantial external code that may become part of both Community and alternatively licensed commercial editions should not be merged until the contributor-rights position is explicit.

## Intended contributor model

A future formal CLA should let contributors retain copyright while granting the Mainlagi project/operator sufficient rights to:

- reproduce, modify, and distribute the contribution as part of Mainlagi;
- distribute the contribution under the repository's AGPL community license;
- sublicense/relicense the contribution as part of separately licensed Mainlagi commercial editions/services;
- combine the contribution with other Mainlagi code and products;
- exercise an appropriate patent license for patents necessarily infringed by the contribution, where legally appropriate.

The contributor should also represent that:

- they have the right to submit the contribution;
- the contribution is original or its third-party components are clearly identified and compatible;
- they are not knowingly contributing confidential/proprietary material they lack authority to disclose;
- required third-party notices/provenance are provided.

## What requires the formal CLA

Until the signed process exists, maintainers should be conservative with external contributions.

A CLA should normally be required before merging substantial external source code that:

- adds a meaningful feature or subsystem;
- changes core runtime/learning architecture;
- may be included in a separately licensed commercial edition;
- includes substantial original implementation work.

Small issue reports, review comments, factual documentation corrections, trivial typo fixes, and other de minimis contributions may be handled under normal repository contribution terms at maintainer discretion, subject to legal review if necessary.

## DCO is not a substitute for this business requirement

A Developer Certificate of Origin can help document that a contributor has the right to submit a patch, but sign-off by itself does not necessarily provide the alternative relicensing rights needed for Mainlagi's intended dual/open-core commercial path.

If a DCO is introduced later, it should complement rather than silently replace the contributor-rights strategy.

## No retroactive assumptions

Do not assume that an external contribution already merged under AGPL can automatically be relicensed commercially just because it is in the repository.

Before any commercial relicensing of externally authored code, verify the actual rights granted for that contribution.

## Activation checklist for a future formal CLA

Before enabling a CLA bot/form or accepting signatures:

1. identify the legal person/entity receiving the grant;
2. obtain legal review for the applicable jurisdictions and business model;
3. publish the exact agreement text and version;
4. define how individual and corporate contributors sign;
5. record signed agreement/version evidence;
6. make PR checks clearly indicate when an agreement is required;
7. document privacy/retention for signature records;
8. update `CONTRIBUTING.md` from "policy requirement" to the actual signing process.

Until then, substantial third-party code may be declined or held for review even when technically valuable.
