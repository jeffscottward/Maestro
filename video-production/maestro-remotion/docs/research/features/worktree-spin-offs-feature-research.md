---
type: research
title: Worktree Spin-offs Feature Research
created: 2026-03-10
tags:
  - remotion
  - maestro
  - autorun
  - worktrees
  - research
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[symphony-feature-research]]'
  - '[[director-notes-feature-research]]'
---

# Worktree Spin-offs Feature Research

## Source References

- `docs/autorun-playbooks.md`
- `docs/git-worktrees.md`
- `src/renderer/components/AutoRunSetupModal.tsx`
- `src/renderer/components/BatchRunnerModal.tsx`
- `src/renderer/components/WorktreeRunSection.tsx`
- `src/renderer/components/WorktreeConfigModal.tsx`
- `src/renderer/components/CreateWorktreeModal.tsx`
- `src/renderer/hooks/batch/useAutoRunHandlers.ts`
- `src/renderer/hooks/batch/useBatchProcessor.ts`
- `src/renderer/hooks/batch/useWorktreeManager.ts`

## In-Product Labels To Preserve

- `Auto Run`
- `Select Auto Run Folder`
- `Change Auto Run Folder`
- `Run in Worktree`
- `Dispatch to a separate worktree`
- `Open in Maestro`
- `Available Worktrees`
- `Create New Worktree`
- `Base Branch`
- `Worktree Branch Name`
- `Automatically create PR when complete`
- `Create Pull Request`
- `Worktree Directory`
- `Watch for new worktrees`

## One-Sentence Takeaway

The `Run in Worktree` flow lets a long-running Auto Run branch off into its own isolated directory and PR path without polluting the user’s current working tree.

## Value Proposition

- Users keep the main checkout clean while still letting Auto Run tackle multi-step work on the same repository.
- The feature makes parallel experimentation and background automation feel safe instead of risky.
- The before-and-after contrast is concrete: one active branch becomes a bottleneck before the run, then isolated worktree branches open cleaner parallel review paths after dispatch.
- For video storytelling, this is a strong visual before/after because the branch, path, and PR intent are all visible in one configuration surface.

## Technical Description

The capture story starts with `AutoRunSetupModal.tsx`, where the user assigns an `Auto Run Folder` containing runnable markdown documents and checkbox tasks to the current agent. First-time selection uses the CTA text `Select Auto Run Folder`, while the modal title itself remains `Change Auto Run Folder`, which is a small but real copy nuance worth preserving in the research notes. The worktree-specific behavior lives in `BatchRunnerModal.tsx`, which only renders `WorktreeRunSection.tsx` when the active session is in a git repository. If no worktree configuration exists, the section shows `Configure →`; once configured, the toggle row is labeled `Dispatch to a separate worktree`.

Enabling the section always defaults to `Create New Worktree`. If open worktree agents already exist, they appear under `Open in Maestro`; scanned but unopened directories appear under `Available Worktrees`. If none exist, the UI auto-selects `Create New Worktree` and shows `No worktrees found — create one below`. In create-new mode, the component loads branches, sorts the current branch first, defaults `Base Branch` accordingly, generates a default `Worktree Branch Name` in the form `auto-run-{branch}-{MMDD}`, previews the worktree path, and optionally enables `Automatically create PR when complete`.

`WorktreeConfigModal.tsx` defines the supporting setup surface with `Worktree Directory`, `Watch for new worktrees`, and inline `Create New Worktree` creation, while `CreateWorktreeModal.tsx` provides the lighter-weight quick-create flow from the session context menu. The marketing wrapper for the video is `Auto Run Worktree Spin-offs`, but the on-screen UI should preserve Maestro’s exact labels: `Run in Worktree`, `Dispatch to a separate worktree`, and worktree review actions such as `Create Pull Request`.

## Before Workflow

1. Point Auto Run at a folder of markdown tasks.
2. Keep the current checkout as the only place the run can land, or manually create a worktree in separate git tooling.
3. The main branch becomes a bottleneck because long-running Auto Run changes and active manual development compete for the same checkout and review path.

## After Workflow

1. Open the Auto Run queue and select the documents to run.
2. Expand `Run in Worktree`, enable `Dispatch to a separate worktree`, and choose an existing worktree or `Create New Worktree`.
3. Confirm `Base Branch`, `Worktree Branch Name`, and optional `Automatically create PR when complete`.
4. Launch the run so Auto Run executes in an isolated branch and directory while the main working tree stays clean and the follow-up review path stays attached to the worktree.

## Primary Pain Solved

The feature removes the branch-safety and workspace-clutter risk that comes from running lengthy automation directly inside the user’s current checkout.

## Who Benefits Most

Developers using Auto Run on active repositories, especially when they want background automation, safer experimentation, or multiple concurrent work streams on the same codebase.

## Transformation Shown On Screen

The visual transformation is from “Auto Run would touch my current branch” to “Auto Run cleanly spins off into a named branch, isolated path, and optional PR flow that is clearly separate from the parent agent.”

## Capture-Critical UI States

- `Auto Run Folder` setup and document-oriented framing from the setup modal.
- `Run in Worktree` section shown inside the batch runner only for git-backed sessions.
- Disabled state with `Configure →` when worktrees are not configured.
- Enabled state showing `Open in Maestro`, `Available Worktrees`, `Create New Worktree`, and `No worktrees found — create one below` when applicable.
- Create-new controls with `Base Branch`, `Worktree Branch Name`, path preview, and `Automatically create PR when complete`.
- Supporting config modal fields for `Worktree Directory` and `Watch for new worktrees`.

## Source-of-Truth Notes

- `Auto Run Worktree Spin-offs` is the delivery title, not a product label. Research notes, storyboards, and UI copy should keep the shipped interface text as `Run in Worktree`, `Dispatch to a separate worktree`, and `Create Pull Request` where relevant.
- The `Run in Worktree` section is hidden for non-git repositories, so capture plans need a git-backed session from the start.
- The create-new flow is opinionated: it defaults on enable, it biases to the current branch for `Base Branch`, and it generates a branch name automatically before the user edits anything.
- The parent agent keeps ownership of the Auto Run document set even when execution is dispatched into a separate worktree agent, so the story should show branch isolation, parallel experimentation, and cleaner review handoff without implying the documents move elsewhere.
