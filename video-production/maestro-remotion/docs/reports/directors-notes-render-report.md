---
type: report
title: Director's Notes Render Report
created: 2026-03-11
tags:
  - remotion
  - maestro
  - director-notes
  - render
related:
  - '[[master-production-plan]]'
  - '[[director-notes-feature-research]]'
  - '[[director-notes-prototype-plan]]'
  - '[[director-notes-storyboard]]'
---

# Director's Notes Render Report

## Summary

The `DirectorNotesStandalone` validation and 16:9 master render completed successfully on March 11, 2026 without requiring code repairs during this run.

The final export was rendered to `renders/director-notes-standalone-16x9-master.mp4` from the isolated Remotion workspace, then spot-checked against the checked-in `Unified History` and `AI Overview` reference captures plus two extracted master frames from this run.

The feature-targeted `pnpm test -- ...` invocation still exercised the full workspace suite through the package script, so this run reconfirmed all `42` test files / `112` tests before the final render.

## Validation Commands

- `git up`
- `pnpm test -- tests/director-notes-capture-assets.test.ts tests/director-notes-master-composition.test.tsx tests/director-notes-planning-alignment.test.ts tests/director-notes-render-smoke.test.ts tests/director-notes-standalone-choreography.test.ts tests/director-notes-standalone-scene.test.tsx tests/director-notes-standalone-validation.test.ts tests/director-notes-surface-showcase.test.ts`
- `pnpm validate`

## Render Command

- `pnpm exec remotion render src/index.ts DirectorNotesStandalone renders/director-notes-standalone-16x9-master.mp4`

## Render Settings

| Setting | Value |
| --- | --- |
| Composition | `DirectorNotesStandalone` |
| Dimensions | `1920x1080` |
| Aspect ratio | `16:9` |
| FPS | `30` |
| Frames | `1200` |
| Target runtime | `40.00s` |
| Observed file duration | `40.042667s` |
| Video codec | `h264` |
| Audio codec | `aac` |
| Output size | `20,335,173 bytes` (`20.3 MB`) |
| Average bit rate | `4,062,701` |

## Output Locations

- `renders/director-notes-standalone-16x9-master.mp4`
- `Auto Run Docs/Working/director-notes-master-frame-01.png`
- `Auto Run Docs/Working/director-notes-master-frame-02.png`

## Source Assets Used

- `capture/docs/director-notes/unified-history-reference.png`
- `capture/docs/director-notes/ai-overview-ready-reference.png`
- `capture/derived/director-notes/history-detail-proof.json`
- `capture/derived/director-notes/ai-overview-loading-proof.json`
- `capture/derived/director-notes/evidence-link.json`

## Fidelity Notes

- The master preserves the shipped `Help`, `Unified History`, and `AI Overview` tab order and uses the current product terminology from the source-backed reconstruction instead of treating the checked-in screenshots as literal full-screen captures.
- The checked-in AI Overview ready screenshot still shows `Refresh`, but the rendered master keeps the current shipped `Regenerate` label called out in [[director-notes-feature-research]] and [[director-notes-storyboard]].
- Planned live-capture `.mov` trims for Director's Notes are still absent, but the approved doc-capture and derived-proof assets were sufficient to validate and render the final standalone master without introducing unsupported UI states.
