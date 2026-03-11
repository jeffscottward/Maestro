---
type: analysis
title: Director's Notes Storyboard
created: 2026-03-10
tags:
  - remotion
  - maestro
  - director-notes
  - storyboard
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[director-notes-prototype-plan]]'
  - '[[director-notes-feature-research]]'
---

# Director's Notes Storyboard

## Delivery Snapshot

- Runtime target: `40 seconds`
- FPS: `30`
- Primary ratio: `16:9`
- Final edit: `text-led`; no voiceover, music, or SFX planned in the isolated workspace
- Pacing emphasis: let `Unified History` and the ready `AI Overview` breathe longer than the modal-open and warmup beats
- Matching spec: `src/data/specs/director-notes-standalone-spec.ts`
- Source-of-truth note: preserve the visible tab order `Help`, `Unified History`, `AI Overview` while beginning the story in the default `Unified History` view; `AI Overview` starts generating on modal open and only becomes clickable once the synopsis is ready

## Scene Board

| scene_number | purpose                                                                                       | on_screen_copy                                                                                           | visual_composition                                                                                                                          | ui_state_shown                                                                                                                                  | user_action                                                                           | system_response                                                                                   | motion_style                                                                          | duration_seconds |
| ------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------- |
| 1            | Frame fragmented agent oversight as a real operational burden before the feature resolves it. | Too many agent tabs. Not enough shared context.<br>`Director's Notes` becomes the shared status surface. | Blur or compress background agent clutter, then bring the modal header and tabs into sharp focus.                                           | `Director's Notes` opening into the default `Unified History` state with `Help`, `Unified History`, and `AI Overview` visible in the tab strip. | Open `Director's Notes` from Maestro.                                                 | The modal lands directly in `Unified History` with the evidence-first view ready.                 | Pull focus from surrounding agent clutter into the centered modal shell.              | 5                |
| 2            | Show `Unified History` as the central operational control surface.                            | `Unified History` merges `AUTO` and `USER` work.<br>Search, filters, and stats stay visible.             | Wide list-first composition with stats row, filter pills, search, and timeline entries all readable together.                               | `Unified History` with filters, search, stats, and dense activity rows.                                                                         | Toggle filters and enter a search term.                                               | The list narrows while the overview still reads as one project-wide timeline.                     | Horizontal parallax across controls and list rows with precise cursor beats.          | 8                |
| 3            | Prove the history is actionable, not passive reporting.                                       | Open detail, then jump back to the agent.<br>The timeline stays actionable.                              | Layer the detail modal over the list and keep the originating session context visible.                                                      | History detail modal with resume and entry navigation affordances.                                                                              | Select a history row to inspect its details.                                          | The detail view exposes the originating session and navigation controls for deeper follow-up.     | Focused zoom into the selected row followed by a modal settle.                        | 7                |
| 4            | Show that synthesis starts from the same evidence before the user even leaves the timeline.   | Keep reviewing the timeline while `AI Overview` builds.<br>The summary is earned before it opens.        | Keep `Unified History` active while the tab-strip spinner and light loading cues telegraph background synthesis from the same evidence set. | `Unified History` remains active while `AI Overview` shows generating state in the tab strip.                                                   | Continue reviewing `Unified History` while `AI Overview` generates in the background. | The tab strip shows background progress and only enables `AI Overview` after the synopsis exists. | Hold on evidence rows, then rack focus to the tab-strip spinner and loading feedback. | 5                |
| 5            | Resolve into the ready synopsis with export controls.                                         | `Regenerate`, `Save`, and `Copy` stay next to the summary.<br>Raw history becomes a shareable check-in.  | Markdown synopsis hero with controls, lookback setting, and summary stats kept on screen together.                                          | Ready `AI Overview` state with synopsis sections and export controls.                                                                           | Select the now-ready `AI Overview` tab.                                               | The modal switches to a grounded summary that is ready to review, save, or copy.                  | Section-by-section reveal with steady camera framing to preserve readability.         | 8                |
| 6            | Close on faster project check-ins built from evidence first and synthesis second.             | One timeline first. One grounded summary second.<br>Project check-ins stop requiring tab-by-tab hunting. | End on a relationship shot between timeline evidence and final synopsis output.                                                             | `Unified History` and `AI Overview` shown as a linked workflow.                                                                                 | Compare the raw activity view and the synopsis result.                                | The feature lands as a repeatable status workflow instead of a one-off summary trick.             | Crossfade between timeline and summary with anchored callout labels.                  | 7                |
