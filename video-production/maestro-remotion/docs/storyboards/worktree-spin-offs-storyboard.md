---
type: analysis
title: Worktree Spin-offs Storyboard
created: 2026-03-10
tags:
  - remotion
  - maestro
  - worktree
  - storyboard
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[worktree-spin-offs-prototype-plan]]'
  - '[[worktree-spin-offs-feature-research]]'
---

# Worktree Spin-offs Storyboard

## Delivery Snapshot

- Delivery title: `Auto Run Worktree Spin-offs`
- Runtime target: `35 seconds`
- FPS: `30`
- Primary ratio: `16:9`
- Final edit: `text-led`; no voiceover, music, or SFX planned in the isolated workspace
- Pacing emphasis: give `Create New Worktree` and the PR option longer holds than the initial problem setup
- Matching spec: `src/data/specs/worktree-spin-offs-standalone-spec.ts`
- Source-of-truth note: market the piece as `Auto Run Worktree Spin-offs`, but keep on-screen UI labels exact as `Run in Worktree`, `Dispatch to a separate worktree`, and `Create Pull Request` in supporting review-handoff references

## Scene Board

| scene_number | purpose                                                                     | on_screen_copy                                                                                                                              | visual_composition                                                                               | ui_state_shown                                                                              | user_action                                                         | system_response                                                                                         | motion_style                                                           | duration_seconds |
| ------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------- |
| 1            | Frame the single-branch bottleneck inside the real Auto Run workflow.       | One busy checkout should not bottleneck Auto Run.<br>Worktree isolation opens a safer parallel lane.                                        | Batch runner modal with Auto Run context visible before the worktree section takes focus.        | Auto Run run-launch surface in a git-backed session.                                        | Open the Auto Run run launcher for a git-backed repository.         | `Run in Worktree` appears as the built-in way to move the run off the busy parent checkout.             | Tight reveal from document list into the lower configuration surface.  | 5                |
| 2            | Reveal the isolation controls as a native part of Auto Run.                 | `Run in Worktree` lives inside Auto Run.<br>`Dispatch to a separate worktree` makes the isolation choice explicit.                          | Center the toggle row and section expansion so the control change reads instantly.               | `Run in Worktree` section expanding from collapsed to enabled.                              | Enable `Dispatch to a separate worktree`.                           | The section opens and defaults into `Create New Worktree`.                                              | Short vertical expansion with a crisp control-state flash.             | 5                |
| 3            | Show the exact create-new workflow the product ships today.                 | `Create New Worktree` defaults on.<br>`Base Branch`, `Worktree Branch Name`, and path preview stay readable.                                | Keep the branch fields, generated name, and path preview all readable at once.                   | Create-new worktree mode with `Base Branch`, `Worktree Branch Name`, and directory preview. | Inspect or edit the suggested branch inputs.                        | Maestro proposes a sane starting branch, generated worktree branch name, and target path.               | Guided pan across the form with inline field highlights.               | 7                |
| 4            | Add review handoff proof to the isolation story.                            | `Automatically create PR when complete` keeps review attached.<br>Branch, path, and PR intent stay visible together.                        | Stay on the same form but shift emphasis to the PR checkbox and resulting configuration clarity. | Create-new mode with PR option enabled and path preview still visible.                      | Enable `Automatically create PR when complete`.                     | The run is now configured for isolated execution and review handoff in one step.                        | Checkbox snap plus restrained overlay callouts on branch and path.     | 6                |
| 5            | Prove the isolated worktree has its own tracked destination inside Maestro. | `Open in Maestro` and `Available Worktrees` show the isolated target.<br>Docs stay with the parent agent; the branch moves to the worktree. | Show worktree inventory and supporting configuration proof without leaving the product frame.    | Open or available worktree inventory with supporting config context.                        | Inspect the available destination or open a worktree from the list. | The isolated target is visible as a real directory and agent destination, not an abstract promise.      | Layered list reveal with a calm rack focus between sections.           | 6                |
| 6            | Finish on execution proof and a clean parent checkout.                      | Auto Run runs in the isolated branch while the main checkout stays clean.<br>Parallel work keeps a cleaner review path.                     | Terminal feedback and worktree proof close the story on operational follow-through.              | Run launched in the worktree with terminal and branch context visible.                      | Start the run after confirming worktree settings.                   | Maestro executes the Auto Run in the isolated branch and directory while preserving the parent context. | Terminal-led cadence with a final settle on the isolated branch state. | 6                |
