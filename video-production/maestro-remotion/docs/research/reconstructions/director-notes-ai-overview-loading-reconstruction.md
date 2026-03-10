---
type: reference
title: Director Notes AI Overview Loading Reconstruction
created: 2026-03-10
tags:
  - remotion
  - director-notes
  - reconstruction
related:
  - '[[director-notes-feature-research]]'
  - '[[director-notes-storyboard]]'
  - '[[phase-02-source-material-log]]'
---

# Director Notes AI Overview Loading Reconstruction

## Visual Goal

Show that the summary is generated from recent history rather than appearing instantly.

## Source Of Truth

- `src/renderer/components/DirectorNotes/AIOverviewTab.tsx`
- `src/renderer/components/DirectorNotes/DirectorNotesModal.tsx`
- `docs/director-notes.md`

## Exact Beat To Reconstruct

- `AI Overview` tab in the tab strip with a spinning indicator.
- Header controls visible:
  - `Lookback: N days`
  - range slider
  - disabled or active `Regenerate`
  - `Save`
  - `Copy`
- First-load progress row with progress bar and `Generating synopsis...`.

## On-Screen Requirements

- Keep the loading state distinct from the ready screenshot so the viewer sees causality.
- Use the dark modal shell and existing tab labels exactly as shipped.
- Treat this as a short intermediate state, not the hero frame.
