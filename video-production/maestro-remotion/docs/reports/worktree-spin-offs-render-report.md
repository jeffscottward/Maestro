---
type: report
title: Worktree Spin-offs Render Report
created: 2026-03-10
tags:
  - remotion
  - maestro
  - worktree
  - render
related:
  - '[[master-production-plan]]'
  - '[[worktree-spin-offs-feature-research]]'
  - '[[worktree-spin-offs-prototype-plan]]'
  - '[[Worktree Spin-offs Storyboard]]'
---

# Worktree Spin-offs Render Report

## Summary

The `WorktreeSpinOffsStandalone` validation and 16:9 master render completed successfully on March 10, 2026 without requiring code repairs during this run.

The final export was rendered to `renders/worktree-spin-offs-standalone-16x9-master.mp4` from the isolated Remotion workspace, then spot-checked against the checked-in Auto Run, worktree inventory, and configuration reference captures plus two extracted master frames.

## Validation Commands

- `git up`
- `pnpm test -- tests/worktree-standalone-validation.test.ts tests/worktree-render-smoke.test.ts`
- `pnpm validate`

## Render Command

- `pnpm exec remotion render src/index.ts WorktreeSpinOffsStandalone renders/worktree-spin-offs-standalone-16x9-master.mp4`

## Render Settings

| Setting | Value |
| --- | --- |
| Composition | `WorktreeSpinOffsStandalone` |
| Dimensions | `1920x1080` |
| Aspect ratio | `16:9` |
| FPS | `30` |
| Frames | `1050` |
| Target runtime | `35.00s` |
| Observed file duration | `35.050667s` |
| Video codec | `h264` |
| Audio codec | `aac` |
| Output size | `21,223,230 bytes` (`21.2 MB`) |
| Average bit rate | `4,844,011` |

## Output Locations

- `renders/worktree-spin-offs-standalone-16x9-master.mp4`
- `Auto Run Docs/Working/worktree-spin-offs-master-frame-01.png`
- `Auto Run Docs/Working/worktree-spin-offs-master-frame-02.png`

## Source Assets Used

- `capture/docs/worktree/autorun-worktree-reference.png`
- `capture/docs/worktree/worktree-inventory-reference.png`
- `capture/docs/worktree/worktree-configuration-reference.png`
- `capture/derived/worktree/terminal-proof.json`

## Fidelity Notes

- The master keeps the delivery title as `Auto Run Worktree Spin-offs`, but all in-product UI stays aligned to current Maestro labels such as `Run in Worktree`, `Dispatch to a separate worktree`, `Open in Maestro`, `Available Worktrees`, and `Automatically create PR when complete`.
- Scenes 1 through 4 use source-backed reconstructed UI rather than literal screenshot crops so the worktree toggle, branch naming, and PR-intent beats stay readable and motion-safe while matching the shipped form structure from `WorktreeRunSection.tsx`.
- The inventory beat combines the checked-in list and configuration captures into one proof state; the render compresses the long worktree list into curated inventory cards while preserving the real product framing from the reference assets.
- No live-capture `.mov` trims were required for the final 16:9 master because the approved worktree doc captures and derived terminal proof covered all six storyboard scenes.
