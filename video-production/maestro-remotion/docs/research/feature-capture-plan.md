---
type: analysis
title: Feature Capture Plan
created: 2026-03-10
tags:
  - remotion
  - capture-pipeline
  - maestro
  - production
related:
  - '[[master-production-plan]]'
  - '[[project-sources]]'
  - '[[symphony-storyboard]]'
  - '[[director-notes-storyboard]]'
  - '[[worktree-spin-offs-storyboard]]'
---

# Feature Capture Plan

## Objective

This note defines the capture pipeline that turns the storyboarded standalone specs into trackable production assets without changing Maestro product code. It stays anchored to `[[master-production-plan]]`, the exact source inventory in `[[project-sources]]`, and the checked-in standalone specs.

## Folder Layout

All capture assets now live under a single predictable root:

```text
capture/
├── live/
├── docs/
├── derived/
├── manifests/
└── recordings/
```

- `capture/live/`
  - Trimmed live-product clips used directly in scenes.
- `capture/docs/`
  - Repository screenshots, documentation crops, or doc-backed stills.
- `capture/derived/`
  - Motion overlays, JSON proof cards, reconstructed inserts, and other non-source captures.
- `capture/manifests/`
  - One scaffolded JSON manifest per feature, keyed by stable scene IDs and capture IDs.
- `capture/recordings/`
  - Raw screen recordings before trims and ratio-specific crops are cut.

## Naming Rules

- Feature folders follow the slug already implied by `assetPlaceholders[].plannedSource` in the standalone specs: `symphony`, `director-notes`, and `worktree`.
- Planned asset paths stay in the existing `capture/<bucket>/<feature>/<artifact>.<ext>` shape so the specs, manifests, and final files use the same address.
- Raw recordings are keyed by storyboard scene number plus the stable scene ID, for example `capture/recordings/symphony/s03-symphony-standalone-create-agent.mov`.
- Manifest files live at `capture/manifests/<feature>/<feature>-capture-manifest.json`.

## Pipeline Scripts

- `pnpm capture:manifests`
  - Rebuild the checked-in feature manifest scaffolds from the standalone specs.
- `pnpm validate:capture`
  - Validate the capture folder scaffold, manifest JSON files, and doc references against the source specs.

These scripts intentionally reuse the existing `capturePlan`, `assetPlaceholders`, `storyboard.sceneNumber`, and aspect-ratio intent instead of introducing a second planning language.

## Manifest Contract

Each feature manifest keeps four stable joins together:

- storyboard scene number and scene ID
- `captureIds` from the spec
- `assetPlaceholderIds` and `plannedSource`
- crop bookkeeping for `16:9`, `1:1`, and `9:16`

The scaffolded manifest files start in `planned` status. Later capture passes can fill real `resolvedSourcePath` values, actual captured files, and readiness state without changing the underlying scene or asset IDs.

## Crop Bookkeeping

The authored master remains `16:9`. Every scene manifest also carries the same adaptation notes already declared in the standalone specs so later trims can keep the copy-safe regions stable for square and vertical exports.

- `16:9`
  - Source-of-truth frame for recordings, live trims, and QA.
- `1:1`
  - Center crop around the primary modal shell or proof card.
- `9:16`
  - Vertical crop that preserves the active control path and on-screen copy.

## Operational Workflow

1. Update a standalone spec when scene IDs, capture IDs, or planned asset paths change.
2. Run `pnpm capture:manifests` to refresh the per-feature manifest scaffold.
3. Record raw takes into `capture/recordings/<feature>/`.
4. Use the manifest plus storyboard scene IDs to cut trimmed assets into `capture/live/`, `capture/docs/`, or `capture/derived/`.
5. Run `pnpm validate:capture` before implementation or handoff work.
