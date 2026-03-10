---
type: reference
title: Worktree Terminal Proof Reconstruction
created: 2026-03-10
tags:
  - remotion
  - worktree
  - reconstruction
related:
  - '[[worktree-spin-offs-feature-research]]'
  - '[[worktree-spin-offs-storyboard]]'
  - '[[phase-02-source-material-log]]'
---

# Worktree Terminal Proof Reconstruction

## Visual Goal

Close the video by proving that the run moved into its own branch and directory while the parent workspace stayed clean.

## Source Of Truth

- `src/renderer/components/WorktreeRunSection.tsx`
- `src/renderer/components/WorktreeConfigModal.tsx`
- `docs/autorun-playbooks.md`
- `docs/git-worktrees.md`

## Exact Beat To Reconstruct

- Isolated worktree path preview derived from the selected base path and branch name.
- Branch naming proof tied to `Worktree Branch Name`.
- PR intent proof tied to `Automatically create PR when complete`.
- Terminal-style or proof-card framing that communicates a separate checkout and branch context.

## On-Screen Requirements

- Keep the close anchored in the Auto Run worktree story, not the standalone Git worktree configuration flow.
- Use exact labels: `Run in Worktree`, `Dispatch to a separate worktree`, and `Automatically create PR when complete`.
- Emphasize clean-parent-checkout and isolated branch execution in the proof text.
