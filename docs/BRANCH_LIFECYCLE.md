# Branch Lifecycle

`main` is the only canonical branch for Mainlagi Hub.

## Normal workflow

```text
main
  -> create focused short-lived branch
  -> implement one coherent change
  -> open PR
  -> run required CI
  -> run visual/physical QA when the change requires it
  -> resolve review conversations
  -> squash merge
  -> delete the merged branch
  -> main is canonical again
```

Do not introduce a persistent `develop` branch. It would create a second ambiguous source of truth without solving a current product need.

## Branch naming

Use intent-first names such as:

```text
feature/<scope>-<date>
fix/<scope>-<date>
security/<scope>-<date>
docs/<scope>-<date>
```

Keep scope narrow enough that a PR can be reviewed and reverted conceptually as one change.

## Stacked PRs

Stacked PRs are allowed only when they materially help parallel development.

Rules:

- the base relationship must be explicit in the PR body;
- never assume a stacked child PR can be retargeted cleanly after its base is squash-merged;
- after a base PR is squash-merged, rebuild or rebase the child work onto current `main` and carry only its unique changes;
- close/supersede the obsolete stacked PR once a clean mainline PR exists.

This avoids replaying already-landed commits and keeps `main` history understandable.

## Temporary workflows

A temporary GitHub Actions workflow may be used only when there is no safer practical repository operation, for example branch-scoped generated-file maintenance or visual QA.

A temporary write-capable workflow must:

- run only for the exact intended same-repository branch;
- request only the minimum permission needed;
- never receive production secrets unless the operation genuinely requires them;
- push only to the intended non-protected working branch;
- be removed before the final merge head;
- be mentioned in the PR description/audit trail.

Temporary read-only QA workflows must also be removed unless there is an explicit decision to promote them into permanent CI.

## UI and motion changes

For meaningful UI changes, completion requires visual verification at representative mobile and desktop sizes.

For changes whose correctness depends on real camera hand/body tracking, physical camera QA is required in addition to automated engine/simulation tests.

## Local branch hygiene

After remote branches are deleted:

```bash
git switch main
git fetch origin --prune
git pull --ff-only origin main
```

Recommended one-time local setting:

```bash
git config fetch.prune true
```

Do not keep local feature branches as unofficial snapshots of product state. Use Git history/tags/releases for intentional historical references.
