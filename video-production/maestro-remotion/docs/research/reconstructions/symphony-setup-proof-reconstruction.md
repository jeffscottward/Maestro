---
type: reference
title: Symphony Setup Proof Reconstruction
created: 2026-03-10
tags:
  - remotion
  - symphony
  - reconstruction
related:
  - '[[symphony-feature-research]]'
  - '[[symphony-storyboard]]'
  - '[[phase-02-source-material-log]]'
---

# Symphony Setup Proof Reconstruction

## Visual Goal

Show the setup sequence as a grounded operational checklist rather than abstract automation branding.

## Source Of Truth

- `src/main/services/symphony-runner.ts`
- `docs/symphony.md`
- `[[symphony-feature-research]]`

## Exact Beat To Reconstruct

- Clone repository into the Symphony workspace.
- Create the contribution branch.
- Configure git identity.
- Create the empty setup commit.
- Push the branch.
- Create the draft PR before Auto Run begins.
- Stage the Auto Run docs into `Auto Run Docs/`.

## On-Screen Requirements

- Present the steps as a compact proof card or checklist overlay.
- Preserve the current behavior mismatch noted in research: implementation creates the empty commit and draft PR during setup, while docs still describe PR claiming on first commit.
- Use exact product terms: `Create Agent`, `Auto Run Docs`, and `draft PR`.
