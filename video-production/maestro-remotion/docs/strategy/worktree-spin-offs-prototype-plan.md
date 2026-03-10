---
type: analysis
title: Worktree Spin-offs Standalone Video Strategy
created: 2026-03-10
tags:
  - remotion
  - maestro
  - autorun
  - worktree
  - strategy
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[approved-feature-video-narrative-structures]]'
  - '[[worktree-spin-offs-feature-research]]'
---

# Worktree Spin-offs Standalone Video Strategy

## Strategy Snapshot

- Runtime target: `35 seconds`
- Tone: `practical`, `reassuring`, `quietly technical`
- Copy density: `low-medium`
- Voiceover vs text: `text-first`; no required voiceover, with optional short narration only if it does not carry essential meaning for muted playback

## Narrative Structure

Selected structure: `Risk -> Isolation -> Handoff` from `[[approved-feature-video-narrative-structures]]`.

Beat breakdown:

1. `Risk`: establish the fear of letting a long Auto Run touch the current checkout and muddy the branch the developer is already using.
2. `Isolation`: open `Run in Worktree`, enable `Dispatch to a separate worktree`, and show the branch, path, and PR intent becoming explicit.
3. `Handoff`: resolve into proof that the run now has its own directory, branch, and review path while the parent context stays clean.

## Why This Structure Fits

This feature sells safety and clarity more than spectacle. Developers immediately understand a branch-contamination problem, and they trust the solution when they can see the exact knobs that isolate the run. Ending on branch or PR handoff proof makes the video feel operationally credible instead of sounding like abstract workflow marketing.

## Platform Plan

- Primary: `16:9` master for product pages, docs, and launch demos where the full worktree form and follow-through states can remain visible together.
- Secondary: `1:1` cutdown for social feeds, centering the toggle row, branch naming fields, and PR option so the before/after remains legible without extra narration.
- Tertiary: `9:16` cutdown for muted-first short-form clips after safe zones are defined, using stacked crops and comparison beats instead of wide modal coverage.

## Messaging Guardrails

- Market the piece as `Auto Run Worktree Spin-offs`, but keep all on-screen product labels exact, including `Run in Worktree`, `Dispatch to a separate worktree`, `Create New Worktree`, `Base Branch`, `Worktree Branch Name`, and `Automatically create PR when complete`.
- Show the flow only inside a git-backed session; do not imply the worktree controls are always visible.
- Preserve the create-new default behavior and generated branch naming so the feature reads like Maestro's real workflow, not a generic git form.
- Do not imply the Auto Run document set moves away from the parent agent; the isolation is execution and branch context, not document ownership.

## Story Beats

1. Frame the problem as a branch-safety bottleneck: the developer wants Auto Run help without dirtying the current checkout.
2. Reveal the `Run in Worktree` section and its toggle so the control surface feels native to Auto Run rather than a separate git utility.
3. Walk through `Create New Worktree`, `Base Branch`, `Worktree Branch Name`, and optional PR creation as one deliberate isolation step.
4. Prove the spin-off by showing the isolated path, worktree list or open worktree state, and cleaner review handoff.
5. End on the outcome: parallel progress with a clean main working tree.
