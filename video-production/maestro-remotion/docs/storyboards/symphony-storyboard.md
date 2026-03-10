---
type: analysis
title: Maestro Symphony Storyboard
created: 2026-03-10
tags:
  - remotion
  - maestro
  - symphony
  - storyboard
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[symphony-prototype-plan]]'
  - '[[symphony-feature-research]]'
---

# Maestro Symphony Storyboard

## Delivery Snapshot

- Runtime target: `45 seconds`
- FPS: `30`
- Primary ratio: `16:9`
- Matching spec: `src/data/specs/symphony-standalone-spec.ts`
- Source-of-truth note: activation should reflect the current implementation path where setup creates an empty commit and draft PR before the run moves into `Active`

## Scene Board

| scene_number | purpose                                                                                           | on_screen_copy                                                                                                 | visual_composition                                                                                           | ui_state_shown                                                                                  | user_action                                                            | system_response                                                                    | motion_style                                                                        | duration_seconds |
| ------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------- |
| 1            | Establish contribution inventory and repository credibility before any setup begins.              | Open-source work, already staged.<br>`Projects` keeps issues, docs, and status together.                       | Wide modal pass across repository cards, category chips, search, and issue counts with one project selected. | `Maestro Symphony` on the `Projects` tab with repository metadata and issue totals visible.     | Open `Maestro Symphony` and select a repository worth contributing to. | The selected project locks in with maintainer context and clear issue volume.      | Slow lateral drift with a deliberate push-in on the selected repository.            | 6                |
| 2            | Show the issue detail and Auto Run document preview before activation so the work feels concrete. | `Available Issues` and `Blocked` are visible before commit.<br>Auto Run docs preview inside the same modal.    | Split focus between issue detail, status grouping, and the document preview pane.                            | Selected project detail with issue sections plus document preview controls.                     | Choose a specific issue and cycle through its attached documents.      | The preview updates in place, keeping task context inside the same modal.          | Snap zoom into the selected issue with cursor-tracked emphasis on document changes. | 7                |
| 3            | Turn browsing into a decisive handoff.                                                            | `Start Symphony` moves straight into `Create Agent`.<br>Provider and working directory stay tied to the issue. | CTA click resolves into the `Create Agent` dialog with provider list and working directory fields in view.   | `Start Symphony` transition into `Create Agent`.                                                | Click `Start Symphony` on the chosen issue.                            | `Create Agent` opens with issue-specific context already attached.                 | Fast modal morph with a short whip-pan between browse and setup states.             | 8                |
| 4            | Prove the orchestration Maestro performs during activation.                                       | Clone. branch. stage docs. open draft PR.<br>The current setup flow creates an empty commit and draft PR.      | `Create Agent` confirmation paired with a concise checklist or progress rail showing setup milestones.       | Setup proof state spanning clone, branch creation, Auto Run doc staging, and draft PR creation. | Confirm the provider and launch the run.                               | Maestro performs the setup work and stages the contribution as a live run.         | Staggered checklist reveals with a compact terminal-style pulse underneath.         | 7                |
| 5            | Show the contribution as a live Maestro object instead of a one-off dialog.                       | `Active` shows status, elapsed time, tokens, and PR state.<br>The handoff is now running, not hypothetical.    | Active contribution card hero with badges, progress details, PR state, and supporting metadata.              | `Active` contribution state with status and progress proof.                                     | Switch from setup proof into the live contribution view.               | The issue now exists as a tracked contribution lane inside Maestro.                | Card stack rise with badge flickers and a restrained progress sweep.                | 9                |
| 6            | Close with measurable proof that discovery became contribution history.                           | `History` and `Stats` turn one start click into measurable progress.<br>Discovery became a contribution lane.  | Resolve into milestone stats and history proof with emphasis on contribution continuity.                     | `History` or `Stats` proof state showing milestones, contribution totals, or review readiness.  | Move to the proof surface that summarizes progress.                    | Maestro shows cumulative contribution proof instead of leaving the story at setup. | Metric count-up and calm settle to finish on operational credibility.               | 8                |
