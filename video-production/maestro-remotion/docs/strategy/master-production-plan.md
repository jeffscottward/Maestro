---
type: analysis
title: Maestro Master Production Plan
created: 2026-03-10
tags:
  - remotion
  - maestro
  - strategy
  - video-production
related:
  - '[[project-sources]]'
  - '[[phase-01-prototype-report]]'
  - '[[symphony-prototype-plan]]'
  - '[[director-notes-prototype-plan]]'
  - '[[worktree-spin-offs-prototype-plan]]'
---

# Maestro Master Production Plan

## Scope Summary

This production track has three primary feature videos:

- `Maestro Symphony`
- `Director's Notes`
- `Run in Worktree`

The current prototype reel remains the shared teaser that previews those three deliverables before each feature gets a deeper standalone production pass.

## Master Format

- Master aspect ratio: `16:9`
- Master frame size: `1920x1080`
- Current prototype fps target: `30`
- Current structured spec modules:
  - `src/data/specs/feature-teaser-spec.ts`
  - `src/data/specs/symphony-prototype-spec.ts`
  - `src/data/specs/director-notes-prototype-spec.ts`
  - `src/data/specs/worktree-spin-offs-prototype-spec.ts`

## Ratio Adaptation Plan

The source timeline stays authored at `16:9` first so Maestro modal layouts, side panels, and terminal density can be matched without early cropping compromises.

Later adaptation work should branch from the shared structured specs instead of rewriting scenes by hand:

- `1:1` delivery should keep the modal shell and key stats inside a centered safe zone while secondary sidebars collapse into stacked callout regions.
- `9:16` delivery should treat the current modal as a vertical camera move across reconstructed UI, with data-driven text layers carrying the narration while dense screenshots or live captures appear as framed inserts.
- Scene IDs, capture IDs, and terminology should stay stable across ratios so later renders can share QA notes and asset tracking with `[[project-sources]]`.

## Prototype Scene Delivery Matrix

| Composition                 | Scene                        | Reconstructed UI                | data-driven text               | capture fallback                                       |
| --------------------------- | ---------------------------- | ------------------------------- | ------------------------------ | ------------------------------------------------------ |
| `MaestroFeatureTeaser`      | `teaser-symphony`            | `symphony-projects` surface     | `accentLabel`, `title`, `body` | `symphony-create-agent`                                |
| `MaestroFeatureTeaser`      | `teaser-director-notes`      | `director-history` surface      | `accentLabel`, `title`, `body` | `director-notes-history`, `director-notes-ai-overview` |
| `MaestroFeatureTeaser`      | `teaser-worktree`            | `worktree-dispatch` surface     | `accentLabel`, `title`, `body` | `autorun-worktree`, `git-worktree-configuration`       |
| `SymphonyPrototype`         | `symphony-projects-overview` | `symphony-projects` surface     | `accentLabel`, `title`, `body` | `symphony-details`                                     |
| `SymphonyPrototype`         | `symphony-create-agent-flow` | `symphony-create-agent` surface | `accentLabel`, `title`, `body` | `symphony-create-agent`                                |
| `DirectorNotesPrototype`    | `director-history-overview`  | `director-history` surface      | `accentLabel`, `title`, `body` | `director-notes-history`                               |
| `DirectorNotesPrototype`    | `director-ai-overview-flow`  | `director-ai-overview` surface  | `accentLabel`, `title`, `body` | `director-notes-ai-overview`                           |
| `WorktreeSpinOffsPrototype` | `worktree-dispatch-overview` | `worktree-dispatch` surface     | `accentLabel`, `title`, `body` | `autorun-worktree`                                     |
| `WorktreeSpinOffsPrototype` | `worktree-follow-through`    | `worktree-terminal` surface     | `accentLabel`, `title`, `body` | `git-worktree-configuration`, `git-worktree-list`      |

The structured scene-delivery record that backs this matrix lives in `src/data/specs/prototype-production-artifacts.ts`.

## Open Implementation Constraints

- Dense Maestro screens still rely on screenshot-based capture fallback while later phases reconstruct more of the product row-for-row.
- The current prototype compositions are intentionally `30` fps because the motion density is UI-led and does not yet justify `60` fps.
- No ratio-specific compositions exist yet for `1:1` or `9:16`; those should wrap the current structured specs rather than fork feature copy or scene IDs.
- The final standalone edits now remain text-led, with no voiceover, music, or SFX assets planned inside the isolated workspace for v1.
- Live product capture and rendered artifact QA remain deferred to later phases and should link back to `[[phase-01-prototype-report]]`.
