---
type: reference
title: Director Notes Evidence Link Reconstruction
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

# Director Notes Evidence Link Reconstruction

## Visual Goal

Connect the raw history timeline to the generated synopsis so the AI Overview reads as grounded synthesis.

## Source Of Truth

- `src/main/ipc/handlers/director-notes.ts`
- `src/renderer/components/DirectorNotes/UnifiedHistoryTab.tsx`
- `src/renderer/components/DirectorNotes/AIOverviewTab.tsx`

## Exact Beat To Reconstruct

- Left-side evidence column representing multiple history entries or sessions.
- Right-side synopsis card representing grouped accomplishments, challenges, and next steps.
- A clear visual bridge between evidence and summary.

## On-Screen Requirements

- The composition should imply "history files in, synopsis out."
- Preserve Director's Notes terminology rather than generic analytics language.
- This reconstruction can appear as a motion overlay layered on top of the ready AI Overview screenshot.
