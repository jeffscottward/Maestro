---
type: research
title: Director's Notes Feature Research
created: 2026-03-10
tags:
  - remotion
  - maestro
  - director-notes
  - research
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[symphony-feature-research]]'
  - '[[worktree-spin-offs-feature-research]]'
---

# Director's Notes Feature Research

## Source References

- `docs/director-notes.md`
- `src/main/ipc/handlers/director-notes.ts`
- `src/renderer/components/DirectorNotes/DirectorNotesModal.tsx`
- `src/renderer/components/DirectorNotes/UnifiedHistoryTab.tsx`
- `src/renderer/components/DirectorNotes/AIOverviewTab.tsx`
- `src/renderer/components/DirectorNotes/OverviewTab.tsx`
- `src/renderer/components/HistoryDetailModal.tsx`
- `src/renderer/components/SettingsModal.tsx`

## In-Product Labels To Preserve

- `Director's Notes`
- `Help`
- `Unified History`
- `AI Overview`
- `AUTO`
- `USER`
- `Lookback`
- `Regenerate`
- `Save`
- `Copy`
- `Synopsis Provider`
- `Default Lookback Period`

## One-Sentence Takeaway

`Director's Notes` gives the user one place to review what every Maestro agent has done and, when needed, compress that activity into an AI-generated synopsis.

## Value Proposition

- Users stop bouncing agent-to-agent just to answer “what changed today?”
- The feature pairs evidence-first history browsing with an AI summary, so the video can show both trustable raw activity and fast executive compression.
- It makes Maestro feel like an orchestration surface rather than a pile of unrelated agent tabs.

## Technical Description

`DirectorNotesModal.tsx` renders a three-tab modal whose tab strip reads `Help`, `Unified History`, and `AI Overview`, but whose default active tab is `Unified History`. The feature is also gated behind `Settings > Encore Features`, where the user enables `Director's Notes`, chooses the `Synopsis Provider`, and sets the `Default Lookback Period`. `UnifiedHistoryTab.tsx` fetches aggregated history across all Maestro sessions through `director-notes:getUnifiedHistory`, paginates in batches of `100`, supports `AUTO` and `USER` filter toggles, real-time search across summary text and agent names, activity-graph lookback changes, keyboard list navigation, and a detail modal that can jump back into the originating agent session.

`AIOverviewTab.tsx` auto-generates a synopsis on first open if no cached result exists, then caches the markdown in module scope so the result survives tab switches and modal reopens during the session. The renderer sends a single IPC request; the main-process handler builds a manifest of history-file paths and asks the selected provider to read those files directly. The resulting `AI Overview` surface combines a lookback slider, `Regenerate`, `Save`, and `Copy` controls with stats for analyzed entries, active agents, and generation time.

## Before Workflow

1. Open multiple agent histories one by one.
2. Manually infer which work mattered, how much it cost, and what remains unresolved.
3. Copy fragments into a standup note or ask an agent for a separate summary with weak project-wide context.

## After Workflow

1. Open `Director's Notes` and land immediately in `Unified History`.
2. Filter by `AUTO` or `USER`, search across agents, and inspect the timeline or detail view.
3. Switch to `AI Overview` once generation is ready and review the structured synopsis.
4. `Save` or `Copy` the markdown and jump back into the originating agent session when deeper investigation is needed.

## Primary Pain Solved

The feature removes fragmented observability across many agents by turning scattered history files into a single, searchable timeline plus an optional synthesized briefing.

## Who Benefits Most

Developers and operators running several Maestro agents or Auto Run sessions at once, especially when they need a fast project-wide status readout before resuming work or reporting progress.

## Transformation Shown On Screen

The video should show chaos resolving into order: many disconnected agent histories collapse into one unified timeline, then the timeline collapses again into a structured AI briefing that still links back to raw evidence.

## Capture-Critical UI States

- Modal header and tab strip with `Help`, `Unified History`, and disabled-or-ready `AI Overview`.
- Unified history header with filter toggles, search, activity graph, and aggregate stats bar.
- History list entries showing agent name, session pill, summary, cost, duration, and timestamps.
- Detail modal and session-resume affordance proving the timeline is actionable, not static.
- `AI Overview` generation state, ready state, lookback slider, and export controls.
- Detail modal controls for `Resume`, `Prev`, `Next`, and entry validation context.

## Source-of-Truth Notes

- The docs describe the tabs conceptually as `Unified History`, `AI Overview`, and `Help`, while the live tab strip order in `DirectorNotesModal.tsx` is `Help`, `Unified History`, then `AI Overview`. For capture planning, preserve the visible tab order but start the story in the default `Unified History` view.
- `docs/director-notes.md` still says `Refresh`, but the current `AI Overview` action label is `Regenerate`. Video copy and captions should match the live UI.
- `AI Overview` is intentionally not immediately interactive on cold open; the tab shows generation state first and only becomes enabled once a synopsis exists or a cached result is restored.
- The synopsis pipeline reads history files by path in the main process, so the feature narrative should emphasize “grounded in your actual activity history” rather than a loose chat summary.
