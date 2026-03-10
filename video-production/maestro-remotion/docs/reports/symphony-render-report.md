---
type: report
title: Symphony Render Report
created: 2026-03-10
tags:
  - remotion
  - maestro
  - symphony
  - render
related:
  - '[[master-production-plan]]'
  - '[[symphony-feature-research]]'
  - '[[Maestro Symphony Storyboard]]'
---

# Symphony Render Report

## Summary

The `SymphonyStandalone` validation and master render completed successfully on March 10, 2026 without requiring code repairs during this run.

The final 16:9 export was rendered to `renders/symphony-standalone-16x9-master.mp4` from the isolated Remotion workspace.

## Validation Commands

- `git up`
- `pnpm test -- tests/symphony-standalone-validation.test.ts tests/symphony-render-smoke.test.ts`
- `pnpm validate`

## Render Command

- `pnpm exec remotion render src/index.ts SymphonyStandalone renders/symphony-standalone-16x9-master.mp4`

## Render Settings

| Setting | Value |
| --- | --- |
| Composition | `SymphonyStandalone` |
| Dimensions | `1920x1080` |
| Aspect ratio | `16:9` |
| FPS | `30` |
| Frames | `1350` |
| Target runtime | `45.00s` |
| Observed file duration | `45.056s` |
| Video codec | `h264` |
| Audio codec | `aac` |
| Output size | `24,782,865 bytes` (`24.8 MB`) |
| Average bit rate | `4,400,366` |

## Output Path

- `renders/symphony-standalone-16x9-master.mp4`

## Source Assets Used

- `capture/docs/symphony/projects-browse-reference.png`
- `capture/docs/symphony/issue-detail-reference.png`
- `capture/docs/symphony/create-agent-reference.png`
- `capture/derived/symphony/setup-checklist.json`
- `capture/docs/symphony/active-card-reference.png`
- `capture/docs/symphony/history-proof-reference.png`
- `capture/docs/symphony/stats-proof-reference.png`

## Fidelity Tradeoffs

- The master uses reconstructed Maestro UI for the shipped `Start Symphony`, `Create Symphony Agent`, draft-PR, `Check PR Status`, `Finalize PR`, and `Ready for Review` states, while the checked-in screenshot assets remain framing and layout references.
- `capture/docs/symphony/create-agent-reference.png` still reflects the older dialog title, so the composition intentionally preserves current product terminology from `AgentCreationDialog.tsx` instead of mirroring that screenshot verbatim.
- `capture/docs/symphony/active-card-reference.png` is also treated as a visual-reference-only fallback because the product code now reflects draft PR setup during activation rather than the older first-commit PR wording.
- No additional live-capture trims were required for this final master because the approved checked-in fallback references and derived setup proof already covered all six storyboard scenes.
