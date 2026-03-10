---
type: reference
title: Director Notes History Detail Reconstruction
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

# Director Notes History Detail Reconstruction

## Visual Goal

Prove that Unified History is actionable by opening one entry into the detail modal and framing it as a drill-down surface, not a static log.

## Source Of Truth

- `src/renderer/components/HistoryDetailModal.tsx`
- `docs/director-notes.md`
- `[[director-notes-feature-research]]`

## Exact Beat To Reconstruct

- Modal shell centered over the dark overlay.
- Session or agent name in the header.
- `AUTO` or `USER` pill plus timestamp and success state.
- Full response body rendered as markdown.
- Prev/Next arrow affordances in the header flow.
- Session jump/resume affordance treated as part of the actionable evidence story.

## On-Screen Requirements

- Keep the detail modal visually subordinate to the Director's Notes parent shell.
- Preserve the keyboard-navigation implication from the docs: arrow keys move between entries and `Esc` closes the detail view.
- Frame this as evidence review, not generic transcript browsing.
