---
type: analysis
title: Director's Notes Standalone Video Strategy
created: 2026-03-10
tags:
  - remotion
  - maestro
  - director-notes
  - strategy
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[approved-feature-video-narrative-structures]]'
  - '[[director-notes-feature-research]]'
---

# Director's Notes Standalone Video Strategy

## Strategy Snapshot

- Runtime target: `40 seconds`
- Tone: `calm`, `authoritative`, `operational`
- Copy density: `medium`
- Voiceover vs text: `text-led final`; no voiceover, music, or SFX planned in the isolated workspace, so the evidence-to-summary transition must read entirely on muted playback

## Narrative Structure

Selected structure: `Fragmentation -> Visibility -> Synthesis` from `[[approved-feature-video-narrative-structures]]`.

Beat breakdown:

1. `Fragmentation`: imply the old workflow of checking multiple agent histories to answer a simple status question.
2. `Visibility`: open `Director's Notes` in `Unified History`, keep `Help`, `Unified History`, and `AI Overview` visible in the tab strip, and show filters, search, stats, and jump-back affordances as the central control surface.
3. `Synthesis`: let `AI Overview` start in the background while the viewer stays on evidence, then switch only after the synopsis is ready so the summary feels grounded instead of conjured.

## Why This Structure Fits

Director's Notes is not a creation workflow; it is an observability workflow. Developers care that the feature first removes tab-sprawl and then turns that unified evidence into a faster decision artifact. This structure keeps the story grounded in that two-step value progression instead of overselling the AI summary as if it exists without the underlying history.

## Platform Plan

- Primary: `16:9` master for product pages, docs, and narrated demos where the full tab strip, stats row, and dense list or markdown summary can remain readable.
- Secondary: `1:1` cutdown for LinkedIn and X feeds, with centered crops around the stat row, filters, and synopsis header instead of trying to preserve the entire modal.
- Tertiary: `9:16` cutdown for short-form product marketing only after storyboard safe zones are defined, using vertical camera moves across the timeline and summary blocks.

## Messaging Guardrails

- Preserve visible tab order as `Help`, `Unified History`, and `AI Overview`, even though the story should begin in the default `Unified History` state.
- Use current labels from the implementation, including `Regenerate`, `Save`, and `Copy`, rather than older doc wording such as `Refresh`.
- Do not show the user clicking into `AI Overview` to start generation; on cold open it starts when the modal opens and the tab remains disabled until the synopsis is ready.
- Emphasize that the synopsis is grounded in actual history files and unified activity data, not a freeform chat guess.
- Treat the checked-in ready-state screenshot as a layout reference, not literal UI text, because the live control label is `Regenerate`.
- Keep the jump-back-to-session affordance visible somewhere in the story so the feature reads as actionable, not passive reporting.

## Final Edit Decisions

- Keep the v1 export fully text-led; no audio layers are planned inside the isolated workspace for this pass.
- Hold `Unified History` and the ready `AI Overview` longer than the modal-open and warmup beats because the shipped UI already carries dense text.
- Keep `Regenerate`, `Save`, and `Copy` on the same readable beat as lookback context and the grounded summary so the export controls do not flash by.

## Story Beats

1. Start with the burden of fragmented agent oversight, then reveal `Director's Notes` as the single place to inspect activity.
2. Showcase `Unified History` with `AUTO` and `USER` filters, search, stats, and a dense but navigable activity list while `AI Overview` warms in the background.
3. Prove the list is actionable by surfacing the detail modal or session jump-back behavior.
4. Let the tab-strip generation state resolve, then switch into the ready `AI Overview` with synopsis sections plus `Regenerate`, `Save`, and `Copy`.
5. End on the promise of faster project check-ins: one timeline first, one grounded summary second.
