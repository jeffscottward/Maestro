---
type: report
title: Phase 02 Capture Readiness
created: 2026-03-10
tags:
  - remotion
  - maestro
  - capture
  - readiness
related:
  - '[[master-production-plan]]'
  - '[[feature-capture-plan]]'
  - '[[phase-02-source-material-log]]'
  - '[[symphony-feature-research]]'
  - '[[director-notes-feature-research]]'
  - '[[worktree-spin-offs-feature-research]]'
---

# Phase 02 Capture Readiness

## Readiness Summary

Capture coverage is sufficient for scene implementation across all three standalone feature videos.

Validated on March 10, 2026 by rerunning `pnpm validate:capture`, `pnpm test -- tests/capture-readiness.test.ts`, and `pnpm validate`; all three commands completed successfully with no manifest, schema, or scene-linkage repairs required.

Each standalone spec scene now has both:

- a declared visual source via manifest `sources[].resolvedSourcePath`
- a declared fallback path via the linked manifest asset placeholders

The workspace is not at final asset-complete status yet. The manifests remain `in-progress` because several planned live trims under `capture/live/` still exist only as declared targets, not checked-in files.

## Feature Status

- `Maestro Symphony` via [[symphony-feature-research]]
  - Final status: ready for per-feature implementation.
  - `6` scenes and `9` source mappings are covered for scene implementation.
  - Every scene resolves to a checked-in doc, reconstruction, or derived proof path before animation work starts.
  - Non-blocking gap: the final live hero trims remain pending, including `capture/live/symphony/projects-browse.mov`, `capture/live/symphony/create-agent.mov`, `capture/live/symphony/active-card.mov`, and `capture/live/symphony/stats-history.mov`.
- `Director's Notes` via [[director-notes-feature-research]]
  - Final status: ready for per-feature implementation.
  - `6` scenes and `9` source mappings are covered for scene implementation.
  - The current pass is grounded by checked-in Unified History and AI Overview references plus reconstruction-driven coverage for states without screenshots.
  - Non-blocking gap: the planned live trims are still pending, including `capture/live/director-notes/modal-open.mov`, `capture/live/director-notes/unified-history.mov`, `capture/live/director-notes/history-detail.mov`, `capture/live/director-notes/ai-overview-loading.mov`, and `capture/live/director-notes/ai-overview-ready.mov`.
- `Run in Worktree` via [[worktree-spin-offs-feature-research]]
  - Final status: ready for per-feature implementation.
  - `6` scenes and `7` source mappings are covered for scene implementation.
  - Auto Run launch, worktree configuration, inventory proof, and terminal-proof beats all resolve to checked-in fallback material for the current pass.
  - Non-blocking gap: the planned live trims are still pending, including `capture/live/worktree/autorun-batch-runner.mov`, `capture/live/worktree/toggle-enabled.mov`, `capture/live/worktree/create-new-form.mov`, and `capture/live/worktree/inventory-proof.mov`.

## Unresolved Capture Gaps

- Final live-capture deliverables are still placeholders in the manifests for all three features.
- Asset materialization is behind scene-source readiness: scenes already have concrete source material, but many paired live asset paths are still future outputs.
- This gap does not block scene implementation because the current manifests already resolve every planned scene to doc-backed, reconstruction-backed, or derived proof inputs.
- A later capture pass should either cut the planned `capture/live/` files or intentionally promote the current fallback assets as the final sources for those scenes.

## Validation Commands

- `pnpm validate:capture`
- `pnpm test -- tests/capture-readiness.test.ts`
- `pnpm validate`
